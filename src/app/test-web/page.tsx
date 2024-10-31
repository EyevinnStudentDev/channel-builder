"use client";

import { useEffect, useState } from 'react';

export default function WebhookTestPage() {
  const [channelId, setChannelId] = useState('');
  const [addPlaylists, setAddPlaylists] = useState([{ fileName: '', fileUrl: '' }]);
  const [removePlaylists, setRemovePlaylists] = useState(['']);
  const [responseMessage, setResponseMessage] = useState('');
  const [existingChannels, setExistingChannels] = useState<any[]>([]);

  // function to fetch all existing channels and playlists (GET req)
  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/getData');
      if (response.ok) {
        const data = await response.json();
        console.log('data:', data);
        setExistingChannels(data.channels); // update state with existing channels
      } else {
        console.error('Failed to fetch channels');
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };  
  // fetch channels
  useEffect(() => {
    fetchChannels();
  }, []);

  const handleAddPlaylistChange = (index: number, field: string, value: string) => {
    const updatedPlaylists = [...addPlaylists];
    updatedPlaylists[index][field as keyof typeof updatedPlaylists[0]] = value;
    setAddPlaylists(updatedPlaylists);
  };

  const handleRemovePlaylistChange = (index: number, value: string) => {
    const updatedRemovePlaylists = [...removePlaylists];
    updatedRemovePlaylists[index] = value;
    setRemovePlaylists(updatedRemovePlaylists);
  };

  const addNewPlaylistField = () => setAddPlaylists([...addPlaylists, { fileName: '', fileUrl: '' }]);
  const addRemovePlaylistField = () => setRemovePlaylists([...removePlaylists, '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // filter out empty add and remove playlists
    const filteredAddPlaylists = addPlaylists.filter((p) => p.fileName && p.fileUrl);
    const filteredRemovePlaylists = removePlaylists.filter((id) => id);

    const requestBody: Record<string, any> = {};
    if (filteredAddPlaylists.length > 0) requestBody.addPlaylists = filteredAddPlaylists;
    if (filteredRemovePlaylists.length > 0) requestBody.removePlaylists = filteredRemovePlaylists;

    if (Object.keys(requestBody).length === 0) {
      setResponseMessage('Please add or remove at least one playlist.');
      return;
    }

    try {
      const response = await fetch(`/api/webhook/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(`Webhook response: ${JSON.stringify(data, null, 2)}`);
      } else {
        const error = await response.json();
        setResponseMessage(`Error: ${JSON.stringify(error, null, 2)}`);
      }
    } catch (error) {
      console.error('Failed to execute webhook:', error);
      setResponseMessage(`Failed to execute webhook: ${error}`);
    }
  };

  return (
    <main className="flex flex-col items-center w-screen h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Webhook Test Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Channel ID:
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            className="border rounded p-2 w-full mb-4"
            required
          />
        </label>

        <h2 className="text-xl font-semibold mb-2">Add Playlists</h2>
        {addPlaylists.map((playlist, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="File Name"
              value={playlist.fileName}
              onChange={(e) => handleAddPlaylistChange(index, 'fileName', e.target.value)}
              className="border rounded p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="File URL"
              value={playlist.fileUrl}
              onChange={(e) => handleAddPlaylistChange(index, 'fileUrl', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addNewPlaylistField}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Another Playlist
        </button>

        <h2 className="text-xl font-semibold mb-2">Remove Playlists</h2>
        {removePlaylists.map((playlistId, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Playlist ID"
              value={playlistId}
              onChange={(e) => handleRemovePlaylistChange(index, e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addRemovePlaylistField}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          Remove Another Playlist
        </button>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Submit Webhook
        </button>
      </form>

      {responseMessage && (
        <div className="mt-6">
          <h3 className="font-semibold">Response:</h3>
          <pre className="bg-gray-200 p-4 rounded">{responseMessage}</pre>
        </div>
      )}

    {/* display existing channels */}
    <section className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Existing Channels</h2>
        {existingChannels && existingChannels.length > 0 ? (
          <ul className="list-disc">
            {existingChannels.map((channel) => (
              <li key={channel.id} className="mb-4">
                <div className="font-bold">Channel: {channel.name}</div>
                <div>Description: {channel.description}</div>
                <div>
                  <strong>Playlists:</strong>
                  <ul className="list-disc pl-5">
                    {channel.playlists && channel.playlists.length > 0 ? (
                      channel.playlists.map((playlist: any) => (
                        <li key={playlist.id}>
                          <strong>File Name:</strong> {playlist.fileName} | <strong>File URL:</strong> {playlist.fileUrl}
                        </li>
                      ))
                    ) : (
                      <li>No playlists available</li>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No channels found</p>
        )}
      </section>
    </main>
  );
}
