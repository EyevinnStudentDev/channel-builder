"use client"

import { useEffect, useState } from 'react';
import { Channel } from 'eyevinn-channel-engine';
import Link from 'next/link'; 

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]); // Using the Channel interface for type safety

  useEffect(() => {
    // Fetch available channels from the backend
    fetch('http://' + process.env.NEXT_PUBLIC_DB_SERVER + '/api/channels') // Use NEXT_PUBLIC_ prefix
      .then(response => response.json())
      .then(data => {
        setChannels(data);
      })
      .catch(error => console.error('Error fetching channels:', error));
  }, []);

  return (
    <div>
      <h1>Available Channels:</h1>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            {/* Link to the dynamic channel route */}
            <Link href={`/home/${channel.id}`}>
              {channel.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
