'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const VideoPlayer = dynamic(
  () => import('../../components/video/video-player'),
  { ssr: false }
);
import Link from 'next/link';
import { Button, Card } from '@nextui-org/react';

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
            'Content-Type': 'application/json'
          },
          cache: 'no-store' // disable cache
        });

        if (response.ok) {
          const data = await response.json();
          setChannels(data);
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
    <main className="flex justify-center items-start w-screen bg-background text-foreground">
      <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-6">
          <div className="relative flex items-center justify-center">
            <Link href="/">
              <Button
                className="absolute left-4"
                color="primary"
                variant="bordered"
              >
                Back to Start
              </Button>
            </Link>
            <h1 className="text-white font-serif text-5xl font-bold text-center">
              List of Channels
            </h1>
          </div>
        </div>

        {/* Display Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 p-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="p-4 text-center">
              <h2 className="text-primary text-2xl capitalize">
                {channel.name}
              </h2>
              <div className="mt-4">
                <VideoPlayer src={channel.url} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
