"use client";

import { channel } from 'diagnostics_channel';
import { FormEvent, use, useEffect, useState } from 'react';
import VideoPlayer from '../../components/video/video-player';
import Link from 'next/link';


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
            cache: 'no-store', // disable cache
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
    <main className="flex justify-center items-start w-screen">
      <div>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 relative">
              <Link href="/" className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-600 outline text-white font-bold py-2 px-4 rounded duration-150">
                Back to Start
              </Link>
            <h1 className="text-white font-serif text-5xl font-bold text-center p-4">
              List of Channels <br className="md:hidden" />
            </h1>
          </div>
        </div>

        {/* display channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {channels.map((channel) => (
            <div className="p-2" key={channel.id}>
              <h2 className="text-center text-white font-serif text-3xl capitalize p-2">{channel.name}</h2>
                 <VideoPlayer src={channel.url} />
           </div>
  ))}
</div>

      </div>
    </main>
  );
}
