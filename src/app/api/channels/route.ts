// src/app/api/channels/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';
import { Channel } from '../../entities/Channel';
import { fetchServiceToken } from '../../lib/serviceToken';

// Base URL for the FAST Channel Engine API
const API_URL = 'https://api-ce.prod.osaas.io/channel';

/**
 * Interface defining the expected request structure when creating a channel.
 * Three types of channels are supported:
 * - Loop: Single video played on repeat
 * - Playlist: Multiple videos played in sequence
 * - Webhook: Dynamic content served via webhook
 */
interface CreateChannelRequest {
    name: string;                               // Display name of the channel
    type: 'Loop' | 'Playlist' | 'Webhook';      // Type of channel
    url?: string;                               // URL for Loop channels
    playlist?: string[];                        // Array of URLs for Playlist channels
}

/**
 * Formats a channel object for API responses by parsing stored JSON and adding computed fields.
 * @param channel - The raw channel object from the database
 * @returns Formatted channel object with parsed playlist and playback URL
 */
function formatChannelResponse(channel: Channel) {
    return {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        url: channel.url,
        playlist: channel.playlist ? JSON.parse(channel.playlist) : null,
        playbackUrl: `https://devstudent.ce.prod.osaas.io/channels/${channel.id.split('-')[1]}/master.m3u8`
    };
}

/**
 * Validates a channel creation request to ensure all required fields are present and valid.
 * Different validations are applied based on channel type:
 * - All channels require a name
 * - Loop channels require a valid URL
 * - Playlist channels require an array of URLs
 * 
 * @param body - The request body to validate
 * @returns Object indicating if the request is valid and any error message
 */
function validateChannelRequest(body: any): { valid: boolean; error?: string } {
    // Validate name field
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        return { valid: false, error: 'Name is required' };
    }

    // Validate channel type
    if (!body.type || !['Loop', 'Playlist', 'Webhook'].includes(body.type)) {
        return { valid: false, error: 'Type must be Loop, Playlist, or Webhook' };
    }

    // Additional validation for Loop channels
    if (body.type === 'Loop') {
        if (!body.url || !body.url.startsWith('http')) {
            return { valid: false, error: 'Valid URL is required for Loop channels' };
        }
    }

    // Additional validation for Playlist channels
    if (body.type === 'Playlist' && (!body.playlist || !Array.isArray(body.playlist))) {
        return { valid: false, error: 'Playlist array is required for Playlist type' };
    }

    return { valid: true };
}

/**
 * Creates a safe channel name for use with the FAST Engine.
 * - Converts to lowercase
 * - Removes special characters
 * - Adds timestamp for uniqueness
 * 
 * @param name - Original channel name
 * @returns Safe channel name suitable for use with FAST Engine
 */
function createSafeChannelName(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')  // Replace special chars with hyphens
        .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
        + '-' + Date.now();          // Add timestamp for uniqueness
}

/**
 * GET /api/channels
 * Lists all channels from the database with formatted responses.
 * Videos are served through the FAST Channel Engine's manifest manipulation technology.
 */
export async function GET() {
    try {
        const db = await getDb();
        const channelRepository = db.getRepository(Channel);
        const channels = await channelRepository.find();
        
        // Format each channel response
        const formattedChannels = channels.map(formatChannelResponse);
        
        return NextResponse.json(formattedChannels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channels' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/channels
 * Creates a new channel both in FAST Engine and local database.
 * Process:
 * 1. Validates request data
 * 2. Creates channel in FAST Engine
 * 3. Stores channel information in local database
 * 4. Returns channel details including playback URL
 */
export async function POST(req: Request) {
    try {
        // Parse and validate request body
        const body = await req.json() as CreateChannelRequest;
        console.log('Received channel creation request:', body);

        const validation = validateChannelRequest(body);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Get service token and prepare webhook URL
        const serviceToken = await fetchServiceToken('channel-engine');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const webhookUrl = `${baseUrl}/api/webhook`;

        // Create safe name for the channel
        const safeName = createSafeChannelName(body.name);

        // Prepare channel configuration for FAST Engine
        const channelConfig = {
            name: safeName,
            type: body.type === 'Loop' ? 'Loop' : 'WebHook', // Use WebHook for Playlist type
            url: body.type === 'Loop' ? body.url : webhookUrl,
            opts: {
                useDemuxedAudio: false,
                useVttSubtitles: false
            }
        };

        console.log('Sending to FAST Engine:', channelConfig);

        // Create channel in FAST Engine
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'x-jwt': `Bearer ${serviceToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(channelConfig),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('FAST Engine error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return NextResponse.json({
                error: 'Failed to create channel in FAST Engine',
                details: errorText
            }, { status: response.status });
        }

        const fastChannelData = await response.json();
        console.log('FAST Engine response:', fastChannelData);

        // Save channel to local database
        const db = await getDb();
        const channelRepository = db.getRepository(Channel);

        const channel = new Channel({
            id: fastChannelData.id,
            name: body.name,
            type: body.type,
            url: body.type === 'Loop' ? body.url : webhookUrl,
            playlist: body.playlist ? JSON.stringify(body.playlist) : undefined
        });

        await channelRepository.save(channel);
        console.log('Saved to database:', channel);

        // Return success response with enhanced details
        return NextResponse.json({
            ...fastChannelData,
            success: true,
            displayName: body.name,
            safeName: safeName,
            details: {
                type: body.type,
                originalUrl: body.url,
                playlist: body.playlist,
                webhookUrl: body.type !== 'Loop' ? webhookUrl : undefined
            }
        });

    } catch (error) {
        console.error('Error creating channel:', error);
        return NextResponse.json({
            error: 'Failed to create channel',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}