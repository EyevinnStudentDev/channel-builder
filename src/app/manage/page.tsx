"use client";

import { useEffect, useState } from 'react';
import { Channel1, Playlist } from '../lib/types';
import Link from 'next/link';


export default function ManageChannelsPage() {
  const [channels, setChannels] = useState<Channel1[]>([]); 
  const [resultMessage, setResultMessage] = useState('');
  const [newPlaylist, setNewPlaylist] = useState<{ [key: string]: { fileName: string; fileUrl: string } }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // fetch channels
  useEffect(() => {
    fetchChannels();
  }, []);

  /*useEffect(() => {
    retrieveChannels();
}, []);*/

/*const retrieveChannels = async () => {      // fetchChannels, from fast channel engine
  try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/getChannels', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          cache: 'no-store',
      });

      if (response.ok) {
          const data = await response.json();
          setChannels(data);
          console.log("Channels fetched successfully:", data);
      } else {
          const errorData = await response.json();
          console.error('Failed to fetch channels:', {
              status: response.status,
              error: errorData
          });
          setError(`Failed to fetch channels: ${errorData.error || response.statusText}`);
      }
  } catch (error) {
      console.error('Error fetching channels:', error);
      setError('Failed to fetch channels. Please try again.');
  } finally {
      setIsLoading(false);
  }
}; */

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

  const toggleSelect = (id: string) => {     // select channels
    setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        return newSet;
    });
};

const deleteSelected = async () => {   // delete channel
  setDeleteInProgress(true);
  setError(null);
  const results: { id: string; success: boolean; error?: string }[] = [];

  try {
      for (const id of selectedItems) {
          try {
              console.log(`Attempting to delete channel ${id}`);
              const response = await fetch(`/api/managePlaylist?id=${encodeURIComponent(id)}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                  },
              });

              let data;
              const textResponse = await response.text();
              try {
                  data = textResponse ? JSON.parse(textResponse) : {};
              } catch (e) {
                  console.error('Failed to parse response:', textResponse);
                  data = { error: 'Invalid response format' };
              }

              if (!response.ok) {
                  console.error(`Error deleting channel ${id}:`, {
                      status: response.status,
                      data: data
                  });
                  results.push({
                      id,
                      success: false,
                      error: data.error || `HTTP ${response.status}: ${response.statusText}`
                  });
              } else {
                  console.log(`Successfully deleted channel ${id}`);
                  results.push({ id, success: true });
              }
          } catch (error) {
              console.error(`Error processing delete for channel ${id}:`, error);
              results.push({
                  id,
                  success: false,
                  error: error instanceof Error ? error.message : 'Unknown error'
              });
          }
      }

      const failures = results.filter(r => !r.success);
      if (failures.length > 0) {
          setError(`Failed to delete some channels: ${failures.map(f => `${f.id} (${f.error})`).join(', ')}`);
      }

      // await retrieveChannels();
      await fetchChannels();
      setSelectedItems(new Set());
  } catch (error) {
      console.error('Error in delete operation:', error);
      setError('Failed to complete delete operation. Please try again.');
  } finally {
      setDeleteInProgress(false);
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
    <div className="p-6">
      <div className="absolute top-0 right-0 p-4">
                <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded duration-150">
                    Back to Home
                </Link>
            </div>
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-4">Manage Channels & Playlists</h1>
      {resultMessage && <p className="mb-4 text-green-600">{resultMessage}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {isLoading && <p className="mb-4 text-blue-600">Loading...</p>}
  
      {/* Display Channels */}
      {channels.length > 0 ? (
        channels.map((channel) => (
          <div key={channel.id} className="mb-6 p-4 border rounded shadow-md">
            {/* Channel Details */}
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="mb-2">Description: {channel.description}</p>
  
            {/* Playlists Section */}
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
  
            {/* Add Playlist Section */}
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
  
            {/* Selection Toggle */}
            <div className="mt-4">
              <input
                type="checkbox"
                checked={selectedItems.has(channel.id)}
                onChange={() => toggleSelect(channel.id)}
                className="mr-2"
              />
              <label>Select this channel</label>
            </div>
          </div>
        ))
      ) : (
        <p>No channels found.</p>
      )}
  
      {/* Delete Selected Channels Section */}
      {selectedItems.size > 0 && (
        <div className="mt-6 p-4 border rounded shadow-md bg-red-50">
          <h2 className="text-lg font-semibold text-red-600">
            {deleteInProgress ? 'Deleting...' : 'Selected Channels for Deletion'}
          </h2>
          <p>{Array.from(selectedItems).join(', ')}</p>
          <button
            onClick={deleteSelected}
            disabled={deleteInProgress}
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
          >
            {deleteInProgress ? 'Deleting...' : 'Delete Selected Channels'}
          </button>
        </div>
      )}
    </div>
  );
}  
