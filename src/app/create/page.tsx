'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';


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

  return (
    <main className="flex justify-center items-center w-screen h-screen">
            <div className="absolute top-0 left-0 p-4">
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
          Back to Home
        </Link>
      </div>

      <div className="w-2/3 p-8 bg-gradient-to-br from-purple-500/20 to-purple-600/20 shadow-indigo-500 rounded-3xl shadow-lg">
        <h1 className="text-slate-100 text-4xl font-bold mb-6 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)] underline text-center">
          Create a Channel
        </h1>
        <form onSubmit={createChannel} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Channel Name:</label>
            <input
              type="text"
              name="channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter the channel name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Channel Type:</label>
            <select
              name="type"
              value={channelType}
              onChange={(e) => setChannelType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="Loop">Loop</option>
              <option value="Playlist">Playlist</option>
            </select>
          </div>

          {/* Conditionally show stream URL input or playlist input based on the type */}
          {channelType === 'Loop' && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Stream URL:</label>
              <input
                type="text"
                name="streamUrl"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter the stream URL"
                required
              />
            </div>
          )}

          {channelType === 'Playlist' && (
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Playlist (one URL per line):</label>
              <textarea
                name="playlist"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter one URL per line"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600/80 hover:bg-purple-700/80 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Add Channel
          </button>
        </form>
      </div>
    </main>
  );
}
