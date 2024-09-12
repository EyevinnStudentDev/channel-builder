import { NextResponse } from 'next/server';
import { MyChannelManager } from '../../../../lib/channelManager';
// GET /api/channels/[channelId]/streams

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const channelManager = MyChannelManager.getInstance();
  const streams = channelManager.getChannelStreams(params.channelId);

  if (!streams) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  return NextResponse.json(streams);
}
