// src/app/api/channels/[channelId]/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { Channel } from '../../../entities/Channel';
import { fetchServiceToken } from '../../../lib/serviceToken';

const API_URL = 'https://api-ce.prod.osaas.io/channel';

/**
 * Formats a channel object for API responses
 * Ensures consistent format between list and single channel endpoints
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
 * GET /api/channels/[channelId]
 * Retrieves a single channel by ID
 */
export async function GET(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const { channelId } = params;
        console.log('Fetching channel:', channelId);

        const db = await getDb();
        const channelRepository = db.getRepository(Channel);
        
        const channel = await channelRepository.findOne({
            where: { id: channelId }
        });

        if (!channel) {
            console.log('Channel not found:', channelId);
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(formatChannelResponse(channel));
        
    } catch (error) {
        console.error('Error fetching channel:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channel' },
            { status: 500 }
        );
    }
}

// DELETE /api/channels/{id} - Delete a channel
export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const { channelId } = params;
        console.log('Deleting channel:', channelId);

        const serviceToken = await fetchServiceToken('channel-engine');

        // First delete from FAST Engine
        const response = await fetch(`${API_URL}/${channelId}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'x-jwt': `Bearer ${serviceToken}`
            }
        });

        if (!response.ok && response.status !== 404) {
            const errorText = await response.text();
            console.error('FAST Engine delete error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return NextResponse.json({
                error: 'Failed to delete channel from FAST Engine',
                details: errorText
            }, { status: response.status });
        }

        // Then delete from our database
        const db = await getDb();
        const channelRepository = db.getRepository(Channel);

        const channel = await channelRepository.findOne({
            where: { id: channelId }
        });

        if (!channel) {
            console.log('Channel not found in database:', channelId);
            return NextResponse.json(
                { error: 'Channel not found in database' },
                { status: 404 }
            );
        }

        await channelRepository.remove(channel);
        console.log('Channel deleted successfully:', channelId);

        return NextResponse.json({
            success: true,
            message: 'Channel deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting channel:', error);
        return NextResponse.json({
            error: 'Failed to delete channel',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/channels/{id} - Update a channel
export async function PUT(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const { channelId } = params;
        const body = await req.json();
        console.log('Updating channel:', channelId, body);

        const db = await getDb();
        const channelRepository = db.getRepository(Channel);

        const channel = await channelRepository.findOne({
            where: { id: channelId }
        });

        if (!channel) {
            console.log('Channel not found:', channelId);
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        // Update channel properties
        Object.assign(channel, body);
        await channelRepository.save(channel);
        console.log('Channel updated successfully:', channel);

        return NextResponse.json({
            success: true,
            channel
        });

    } catch (error) {
        console.error('Error updating channel:', error);
        return NextResponse.json({
            error: 'Failed to update channel',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}