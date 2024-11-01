'use client';

import { FormEvent, useState, useEffect } from 'react';

export default function Home() {
  const [channelName, setChannelName] = useState<string>('');
  const [channelType, setChannelType] = useState<string>('Webhook');
  const [channelDescription, setChannelDescription] = useState('');

  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [playlists, setPlaylists] = useState<{ fileName: string; fileUrl: string }[]>([]);


  const [streamUrl, setStreamUrl] = useState<string>(''); // For Loop
  const [existingChannels, setExistingChannels] = useState<any[]>([]); // To display existing channels

  /* BACKEND FUNCTIONS */
  const createChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
    // 1. POST data to MariaDB
    const response = await fetch('/api/postData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: channelName,
        description: channelDescription,
        playlists, 
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      //DEBUG
      console.log('added successfully to DB:', responseData.name);

      const channelId = responseData.id;

      // 2. if the size of the playlists array is equal to 1 then create a loop
      if (playlists.length === 1) {
        // Loop
        const response = await fetch('/api/postChannel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: channelName,
            type: "Loop",
            url: playlists[0].fileUrl,
            opts: {
              useDemuxedAudio: false,
              useVttSubtitles: false
            }
          })
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log('Loop created', responseData);
        }
      }else{
        // 3. else create a webhook channel
        const constructedWebhookUrl = `${window.location.origin}/api/webhook/${channelId}`;
        console.log('constructedWebhookUrl:', constructedWebhookUrl);

        const response = await fetch('/api/postChannel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: channelName,
            type: "WebHook",
            url: constructedWebhookUrl,
            opts: {
              useDemuxedAudio: false,
              useVttSubtitles: false
            }
          })
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log('Webhook created', responseData);
        }
      }

      /*
      if (channelType === 'Webhook') {
          const response = await fetch(`/api/webhook/${channelId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            const responseData = await response.json();
            console.log('Webhook created', responseData);
          }
        }
        */
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      
    }
    /*
    // POST request to create channel for webhook
    if (channelType === 'Webhook') {
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
    }
    */
    // reset form
    setChannelName('');
    setChannelDescription('');
    setPlaylists([]);
    fetchChannels(); // fetch channels after adding new
  };

  /* FRONTEND FUNCTIONS */
  // function to add a playlist entry to the playlists array (frontend)
  const addPlaylist = () => {
    if (fileName && fileUrl) {
      setPlaylists([...playlists, { fileName, fileUrl }]);
      // reset inputs
      setFileName(''); 
      setFileUrl('');
    }
  };
  // function to remove a playlist entry from the playlists array (frontend)
  const removePlaylist = (index: number) => {
    setPlaylists(playlists.filter((_, i) => i !== index));
  };
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

  return (
    <main className="flex flex-col items-center w-screen h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Channel Creator</h1>

      {/* form to add new channel */}
      <form onSubmit={createChannel} className="flex flex-col w-full max-w-md space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Add New Channel</h2>
        <input
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Channel Description"
          value={channelDescription}
          onChange={(e) => setChannelDescription(e.target.value)}
          required
          className="border p-2"
        />

        <h2 className="text-lg mt-4">Add Playlists to Channel</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border p-2 flex-1"
          />
          <input
            type="text"
            placeholder="File URL"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            type="button"
            onClick={addPlaylist}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Playlist
          </button>
        </div>

        <ul className="list-disc mt-2">
          {playlists.map((playlist, index) => (
            <li key={index} className="p-2 flex justify-between items-center">
              <span>
                <strong>File Name:</strong> {playlist.fileName} | <strong>File URL:</strong> {playlist.fileUrl}
              </span>
              <button
                type="button"
                onClick={() => removePlaylist(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Submit Channel
        </button>
      </form>

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
