import { NextResponse } from 'next/server';
import { Context } from '@osaas/client-core';

const API_URL = 'https://api-ce.prod.osaas.io/channel';

/**
 * @swagger
 * /api/managePlaylist:
 *   delete:
 *     summary: Deletes a channel from the OSAAS API by its ID.
 *     description: This endpoint deletes a channel by its ID from the OSAAS Channel Engine. The channel ID must be provided as a query parameter.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: The ID of the channel to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the channel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 channelId:
 *                   type: string
 *       400:
 *         description: Channel ID is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 *       500:
 *         description: Internal server error during deletion process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id?: string } }
) {
  try {
    // activate the service and fetch the service token
    const ctx = new Context();
    const serviceToken = await ctx.getServiceAccessToken('channel-engine');

    // Get the ID from the URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      console.error('Delete request missing ID parameter');
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      );
    }

    // Make sure to encode the ID properly in the URL
    const deleteUrl = `${API_URL}/${encodeURIComponent(id)}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'x-jwt': `Bearer ${serviceToken}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let responseData;

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Failed to parse response:', responseText);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error('Error deleting channel:', {
        status: response.status,
        data: responseData
      });
      return NextResponse.json(
        {
          error: 'Failed to delete channel',
          details: responseData,
          status: response.status
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: 'Channel deleted successfully',
        channelId: id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
