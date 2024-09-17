import { NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com/gists';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

export async function POST(req: Request) {
  try {
    const { playlist } = await req.json(); 

    const gistPayload = {
      description: 'Playlist of streams',
      public: true, 
      files: {
        'playlist.txt': {
          content: playlist, 
        },
      },
    };

    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating Gist:', errorText);
      return NextResponse.json({ error: 'Failed to create Gist' }, { status: response.status });
    }

    const gistData = await response.json();
    const rawUrl = gistData.files['playlist.txt'].raw_url; 

    console.log(rawUrl);
    return NextResponse.json({ url: rawUrl });
  } catch (error) {
    console.error('Error creating Gist:', error);
    return NextResponse.json({ error: 'Failed to create Gist' }, { status: 500 });
  }
}
