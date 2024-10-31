import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken';

const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function DELETE(req: Request) {
    try {
        const serviceToken = await fetchServiceToken();
        const url = new URL(req.url);
        const id = url.searchParams.get('id'); // assuming ID is passed as a query parameter

        if (!id) {
            return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'x-jwt': `Bearer ${serviceToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting channel:', errorText);
            return NextResponse.json({ error: 'Failed to delete channel' }, { status: response.status });
        }

        return NextResponse.json({ message: 'Channel deleted successfully' }, { status: response.status });
    } catch (error) {
        console.error('Error deleting channel:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
