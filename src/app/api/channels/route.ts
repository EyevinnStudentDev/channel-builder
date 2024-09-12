import { NextResponse } from 'next/server';
import { MyChannelManager } from '../../lib/channelManager';

// GET /api/channels
export async function GET() {
  const channelManager = MyChannelManager.getInstance();
  const channels = channelManager.getChannels();
  
  return NextResponse.json(channels);
}
