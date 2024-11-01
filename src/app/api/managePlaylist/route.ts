import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken';

const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function DELETE(
    request: Request,
    { params }: { params: { id?: string } }
) {
    try {
        const serviceToken = await fetchServiceToken();
        
        // Get the ID from the URL search params
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        console.log('Attempting to delete channel with ID:', id);

        if (!id) {
            console.error('Delete request missing ID parameter');
            return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
        }

        // Make sure to encode the ID properly in the URL
        const deleteUrl = `${API_URL}/${encodeURIComponent(id)}`;
        console.log('Delete URL:', deleteUrl);

        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'x-jwt': `Bearer ${serviceToken}`,
                'Content-Type': 'application/json',
            },
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
                data: responseData,
            });
            return NextResponse.json({
                error: 'Failed to delete channel',
                details: responseData,
                status: response.status
            }, { status: response.status });
        }

        return NextResponse.json({
            message: 'Channel deleted successfully',
            channelId: id
        }, { status: 200 });

    } catch (error) {
        console.error('Error in DELETE handler:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}