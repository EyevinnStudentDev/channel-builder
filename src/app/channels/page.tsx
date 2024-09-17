"use client";

import { channel } from 'diagnostics_channel';
import { FormEvent, use, useEffect, useState } from 'react';
import VideoPlayer from '../../components/video/video-player';

interface Channel {
  id: string;
  name: string;
  type: string;
  url: string;
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);

  // get channels from OSAAS api
    useEffect(() => {
      const fetchChannels = async () => {
        try {
          const response = await fetch('/api/getChannels', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setChannels(data);
            console.log("SUCCESS:", data);
          } else {
            console.error('Failed to fetch channels:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching channels:', error);
        }
      };
      fetchChannels();
    }, []);


  return (
    <main className="flex justify-center items-start w-screen h-screen">
      <div>
        <h1 className='flex justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded'>Channels:</h1>
        {/* display channels */}
        {channels.map((channel) => (
          <div key={channel.id}>
            <h2>{channel.name}</h2>
            <VideoPlayer src={channel.url} />
          </div>
        ))}

      </div>
    </main>
  );
}
