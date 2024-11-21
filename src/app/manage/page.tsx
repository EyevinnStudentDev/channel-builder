"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";

// MOVE TO TYPES FILE
type Playlist = {
  id: string;
  fileName: string;
  fileUrl: string;
};

type Channel = {
  id: string;
  name: string;
  description: string;
  playlists: Playlist[];
};

export default function ManageChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]); 
  const [resultMessage, setResultMessage] = useState('');
  const [newPlaylist, setNewPlaylist] = useState<{ [key: string]: { fileName: string; fileUrl: string } }>({});

  // fetch channels
  useEffect(() => {
    fetchChannels();
  }, []);

  // fetch all channels with playlists from DB
  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/getData');
      const data = await response.json();
      if (response.ok) {
        setChannels(data.channels);
      } else {
        console.error('Failed to fetch channels:', data.error);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  // remove a specific playlist URL from a channel
  const removePlaylist = async (channelId: string, playlistId: string) => {
    try {
      const response = await fetch(`/api/webhook/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addPlaylists: [],
          removePlaylists: [playlistId],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResultMessage(`Playlist removed successfully from channel ${channelId}`);
        fetchChannels(); // refresh channels after removal
      } else {
        console.error('Failed to remove playlist:', data.error);
        setResultMessage(`Failed to remove playlist: ${data.error}`);
      }
    } catch (error) {
      console.error('Error removing playlist:', error);
      setResultMessage('Error removing playlist');
    }
  };

  // add new playlist URL to a channel
  const addPlaylist = async (channelId: string) => {
    const playlistData = newPlaylist[channelId];
    if (!playlistData || !playlistData.fileName || !playlistData.fileUrl) {
      setResultMessage("Please fill in both file name and URL.");
      return;
    }

    try {
      const response = await fetch(`/api/webhook/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addPlaylists: [playlistData],
          removePlaylists: [],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResultMessage(`Playlist added successfully to channel ${channelId}`);
        fetchChannels(); // refresh channels after adding
        setNewPlaylist((prev) => ({ ...prev, [channelId]: { fileName: '', fileUrl: '' } })); // reset input fields
      } else {
        console.error('Failed to add playlist:', data.error);
        setResultMessage(`Failed to add playlist: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding playlist:', error);
      setResultMessage('Error adding playlist');
    }
  };

  return (
    <div className="p-6 bg-base-200">
            <div className="absolute top-0 left-0 p-4">
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Manage Channels</h1>
      {resultMessage && <p className="mb-4 text-green-600">{resultMessage}</p>}

      {channels.length > 0 ? (
        channels.map((channel) => (
          <div key={channel.id} className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="mb-2">Description: {channel.description}</p>

            {channel.playlists && channel.playlists.length > 0 ? (
              <ul className="list-disc pl-5">
                {channel.playlists.map((playlist) => (
                  <li key={playlist.id} className="mb-2">
                    <strong>File Name:</strong> {playlist.fileName} <br />
                    <strong>File URL:</strong> {playlist.fileUrl} <br />
                    <button
                      onClick={() => removePlaylist(channel.id, playlist.id)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Remove Playlist
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No playlists available for this channel.</p>
            )}

            {/* Add playlist section */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Add New Playlist</h3>
              <input
                type="text"
                placeholder="File Name"
                value={newPlaylist[channel.id]?.fileName || ''}
                onChange={(e) =>
                  setNewPlaylist((prev) => ({
                    ...prev,
                    [channel.id]: {
                      ...prev[channel.id],
                      fileName: e.target.value,
                    },
                  }))
                }
                className="border p-2 mr-2 mb-2"
              />
              <input
                type="text"
                placeholder="File URL"
                value={newPlaylist[channel.id]?.fileUrl || ''}
                onChange={(e) =>
                  setNewPlaylist((prev) => ({
                    ...prev,
                    [channel.id]: {
                      ...prev[channel.id],
                      fileUrl: e.target.value,
                    },
                  }))
                }
                className="border p-2 mr-2 mb-2"
              />
              <button
                onClick={() => addPlaylist(channel.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Playlist
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No channels found.</p>
      )}
    </div>
  );
}
