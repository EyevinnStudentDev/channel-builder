// måste ha exporterat metod, GET eller POST

import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken'; // service token handler
// src/app/api/webhook/route.ts
import { randomUUID } from 'crypto';
// import channel

// define payload type for the POST request
interface ChannelPayload {
    name: string;
    type: string;
    url: string;
  }
  
const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function POST(req: Request) {
  try {
    const { channelId } = await req.json();
    console.log(`Requesting next VOD for channel ${channelId}`);
    const serviceToken = await fetchServiceToken('channel-builder');
    console.log('Service token:', serviceToken);

    const body: ChannelPayload = await req.json();
    console.log('Channel payload:', body);

    // DB connection here, get the dynamic playlist for the channel
    // For now, we'll hardcode the VODs like in the example
    const vods = [
      'https://lab.cdn.eyevinn.technology/stswetvplus-promo-2023-5GBm231Mkz.mov/manifest.m3u8',
      'https://lab.cdn.eyevinn.technology/Channel-Engine-Promo-Mar-2023-PnA8E-jw5x.mp4/manifest.m3u8',
      'https://lab.cdn.eyevinn.technology/eyevinn-reel-feb-2023-_2Y7i4eOAi.mp4/manifest.m3u8'
    ];

    // Select a random VOD
    // const playlistItems = channel.playlistItems;
    // const selectedVod = playlistItems[Math.floor(Math.random() * playlistItems.length)].vodUrl;
    const selectedVod = vods[Math.floor(Math.random() * vods.length)];

    // Create the response in the format the Channel Engine expects
    return NextResponse.json({
        body: {
            id: randomUUID(),
            // title: channel.name,
            title: 'channel_name_temp',
            hlsUrl: selectedVod,
            prerollUrl: 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8',
            prerollDurationMs: 105000
          },
        headers: {
        'x-jwt': `Bearer ${serviceToken}`, 
        },   
    });
  } catch (error) {
    console.error('Error in webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  // some finally clause where we can close the DB connection
}