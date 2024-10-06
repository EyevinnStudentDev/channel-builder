'use client';

import { FormEvent, useState } from 'react';
import { fetchServiceToken } from '../lib/serviceToken';

export default function Home() {
  const [channelName, setChannelName] = useState<string>('');
  const [channelType, setChannelType] = useState<string>('Loop');
  const [streamUrl, setStreamUrl] = useState<string>(''); // For Loop
  const [playlist, setPlaylist] = useState<string>(''); // For Playlist

  const createChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let url = streamUrl;

    // If type is Playlist, upload the playlist to Gist and get the URL to the gist
    if (channelType === 'Playlist') {
      const playlistUrl = await uploadPlaylistToGist(playlist); // Upload playlist to Gist
      if (!playlistUrl) {
        console.error('Failed to upload playlist to Gist.');
        return;
      }
      url = playlistUrl;
    }

    // If type is Webhook, upload the playlist to the webhook (dynamic playlist)
    if (channelType === "Webhook") {
      const playlistUrl = await uploadPlaylistToLambda(playlist); // Upload playlist to Lambda instance
      // const urlString = "devStudent" + playlistUrl.substring(15); // Replace the gist URL with the raw URL
      if (!playlistUrl) {
        console.error("Failed to upload playlist to Lambda.");
        return;
      }
      url = playlistUrl; 
    }

    // POST request to create channel
    try {
      const response = await fetch('/api/postChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: channelName,
          type: channelType,
          url: url,
          opts: {
            useDemuxedAudio: false,
            useVttSubtitles: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('SUCCESS:', data);
      } else {
        console.error('Failed to create channel:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  // upload playlist to GitHub Gist as .txt
  const uploadPlaylistToGist = async (
    playlist: string
  ): Promise<string | null> => {
    try {
      const response = await fetch('/api/postGist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playlist })
      });

      if (response.ok) {
        const { url } = await response.json();
        return url;
      } else {
        console.error('Failed to upload playlist:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading playlist:', error);
      return null;
    }
  };

  const uploadPlaylistToLambda = async (playlist: string): Promise<string | null> => {
    const lambdaUrl = "https://devstudent-svdt.birme-lambda.auto.prod.osaas.io/upload";   //TODO: change this to the general URL
    const token = fetchServiceToken; // Get the token from the serviceToken.ts file

    try {
      // POST request to the Lambda endpoint (webhook)
      // TODO: Make sure that Lambda allows POST, GET, OPTIONS requests
      const response = await fetch(lambdaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
          'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({
          playlist,  
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload Success:", responseData);
        return responseData.url || null;  
      } else {
        console.error('Failed to upload playlist to Lambda:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading playlist to Lambda:', error);
      return null;
    }
  };

  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div>
        <h1>Create a Channel</h1>
        <form onSubmit={createChannel}>
          <label>Channel Name:</label>
          <input
            type="text"
            name="channel"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
          <br />

          <label>Channel Type:</label>
          <select
            name="type"
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            required
          >
            <option value="Loop">Loop</option>
            <option value="Playlist">Playlist</option>
            <option value="Webhook">Webhook</option>
          </select>
          <br />

          {/* Conditionally show stream URL input or playlist input based on the type */}
          {channelType == 'Loop' && (
            <>
              <label>Stream URL:</label>
              <input
                type="text"
                name="streamUrl"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                required
              />
            </>
          )}

          {channelType == "Playlist" && (
            <>
              <label>Playlist (one URL per line):</label>
              <textarea
                name="playlist"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                rows={6}
                required
              />
            </>
          )}

          <br />
          <button type="submit">Add Channel</button>
        </form>
      </div>
    </main>
  );
}
