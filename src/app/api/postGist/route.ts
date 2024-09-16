import { NextResponse } from 'next/server';

const GITHUB_API_URL = 'https://api.github.com/gists';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store your GitHub PAT in .env.local

export async function POST(req: Request) {
  try {
    const { playlist } = await req.json(); // Receive the playlist from the frontend

    // Prepare the data for the GitHub Gist API
    const gistPayload = {
      description: 'Playlist of streams',
      public: true, // Make it a public Gist
      files: {
        'playlist.txt': {
          content: playlist, // The playlist content
        },
      },
    };

    // Send a POST request to create the Gist
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`, // Use the GitHub token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating Gist:', errorText);
      return NextResponse.json({ error: 'Failed to create Gist' }, { status: response.status });
    }

    // Parse the response from GitHub and extract the Gist URL
    const gistData = await response.json();
    const gistUrl = gistData.html_url; // URL to the public Gist

    // Return the Gist URL
    return NextResponse.json({ url: gistUrl });
  } catch (error) {
    console.error('Error creating Gist:', error);
    return NextResponse.json({ error: 'Failed to create Gist' }, { status: 500 });
  }
}
