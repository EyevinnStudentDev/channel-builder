// src/app/api/postChannel/route.ts
import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken';
import { getDb } from '../../lib/db';
import { Channel } from '../../entities/Channel';

const API_URL = 'https://api-ce.prod.osaas.io/channel';

// Type for the incoming request body
interface CreateChannelRequest {
    name: string;
    type: 'Loop' | 'Playlist' | 'Webhook';
    url?: string;
    playlist?: string[];  // Array of video URLs
}

// Helper function to create a safe, unique channel name
function createSafeChannelName(name: string): string {
  // Remove special characters and spaces, convert to lowercase
  const safeName = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  
  // Add timestamp to make it unique
  return `${safeName}-${Date.now()}`;
}

export async function POST(req: Request) {
  try {
      const body = await req.json() as CreateChannelRequest;
      console.log('Received request:', body);
      
      // Create a safe, unique channel name
      const safeName = createSafeChannelName(body.name);
      console.log('Generated safe channel name:', safeName);

      const serviceToken = await fetchServiceToken('channel-engine');
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const webhookUrl = `${baseUrl}/api/webhook`;

      const channelConfig = {
          name: safeName, // Use the safe name here
          type: body.type === 'Loop' ? 'Loop' : 'WebHook',
          url: body.type === 'Loop' ? body.url : webhookUrl,
          opts: {
              useDemuxedAudio: false,
              useVttSubtitles: false
          }
      };

      console.log('Sending to FAST Engine:', channelConfig);

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

      // Save to database with original name but safe ID
      const db = await getDb();
      const channelRepository = db.getRepository(Channel);

      const channel = new Channel({
          id: fastChannelData.id,
          name: body.name, // Keep original name for display
          type: body.type,
          url: body.type === 'Loop' ? body.url! : webhookUrl,
          playlist: body.playlist ? JSON.stringify(body.playlist) : undefined
      });

      await channelRepository.save(channel);
      console.log('Saved to database:', channel);

      return NextResponse.json({
          ...fastChannelData,
          success: true,
          displayName: body.name,
          safeName: safeName
      });

  } catch (error) {
      console.error('Detailed error:', error);
      return NextResponse.json({
          error: 'Failed to create channel',
          details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
  }
}