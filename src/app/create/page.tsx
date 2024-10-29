"use client";

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Home() {
  const [channelName, setChannelName] = useState<string>("");
  const [channelType, setChannelType] = useState<string>("Loop");
  const [streamUrl, setStreamUrl] = useState<string>(""); // For Loop
  const [playlist, setPlaylist] = useState<string>(""); // For Playlist
  const router = useRouter();
  const finishTaskClick = () => router.push('/');



  

  const createChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let url = streamUrl;

    // If type is Playlist, upload the playlist to Gist and get the URL to the gist
    if (channelType === "Playlist") {
      const playlistUrl = await uploadPlaylistToGist(playlist); // Upload playlist to Gist
      if (!playlistUrl) {
        console.error("Failed to upload playlist to Gist.");
        return;
      }
      url = playlistUrl; 
    }

    // POST request to create channel
    try {
      const response = await fetch('/api/postChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: channelName,
          type: channelType,
          url: url,
          opts: {
            useDemuxedAudio: false, useVttSubtitles: false
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("SUCCESS:", data);
      } else {
        console.error('Failed to create channel:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  // upload playlist to GitHub Gist as .txt
  const uploadPlaylistToGist = async (playlist: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/postGist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist }),
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

<div className="absolute top-0 right-0 p-4">
  <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
    Back to Home
  </Link>
</div>

<div className="bg-gradient-to-br from-blue-200 to-blue-400 rounded py-6 px-6 border mx-auto my-10 w-1/2 text-center" >
  <h1 className="text-white text-6xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold mb-6 underline">Create a Channel</h1>
  <form onSubmit={createChannel} className="flex flex-col items-center space-y-4">
    <label className="text-white text-lg font-semibold">Channel Name:</label>
    <input
      type="text"
      name="channel"
      className="w-full max-w-md p-3 rounded text-lg"
      value={channelName}
      onChange={(e) => setChannelName(e.target.value)}
      required
    />

    <label className="text-white text-lg font-semibold">Channel Type:</label>
    <select
      name="type"
      className="w-full max-w-md p-3 rounded text-lg"
      value={channelType}
      onChange={(e) => setChannelType(e.target.value)}
      required
    >
      <option value="Loop">Loop</option>
      <option value="Playlist">Playlist</option>
    </select>

    {/* Conditionally show stream URL input or playlist input based on the type */}
    {channelType === "Loop" && (
      <>
        <label className="text-white text-lg font-semibold">Stream URL:</label>
        <input
          type="text"
          name="streamUrl"
          className="w-full max-w-md p-3 rounded text-lg"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          required
        />
      </>
    )}

    {channelType === "Playlist" && (
      <>
        <label className="text-white text-lg font-semibold">Playlist (one URL per line):</label>
        <textarea
          name="playlist"
          className="w-full max-w-md p-3 rounded text-lg"
          value={playlist}
          onChange={(e) => setPlaylist(e.target.value)}
          rows={6}
          required
        />
      </>
    )}
    <button className="bg-blue-500 hover:bg-blue-700 border-slate-50 text-white font-bold py-2 px-4 rounded duration-150" type="submit" >Add Channel</button>
  </form>
</div>    </main>
  );
}

