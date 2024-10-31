// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDb } from '../../lib/db';
import { Channel } from '../../entities/Channel';

export async function GET(req: Request) {
    try {
        // Get channelId from query params
        const { searchParams } = new URL(req.url);
        const channelId = searchParams.get('channelId');

        if (!channelId) {
            return NextResponse.json(
                { error: 'Channel ID is required' },
                { status: 400 }
            );
        }

        // Get database connection and channel repository
        const db = await getDb();
        const channelRepository = db.getRepository(Channel);

        // Find the channel
        const channel = await channelRepository.findOne({
            where: { id: channelId }
        });

        if (!channel) {
            return NextResponse.json(
                { error: 'Channel not found' },
                { status: 404 }
            );
        }

        // Get next video URL based on channel type
        let nextUrl: string;
        if (channel.type === 'Loop') {
            nextUrl = channel.url;
        } else if (channel.playlist) {
            // Parse the playlist and get a random video
            const playlist = JSON.parse(channel.playlist);
            nextUrl = playlist[Math.floor(Math.random() * playlist.length)];
        } else {
            return NextResponse.json(
                { error: 'No content available' },
                { status: 404 }
            );
        }

        // Return in the format expected by Channel Engine
        return NextResponse.json({
            body: {
                id: randomUUID(),
                title: channel.name,
                hlsUrl: nextUrl,
                prerollUrl: 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8',
                prerollDurationMs: 105000
            }
        });

    } catch (error) {
        console.error('Error in webhook:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}