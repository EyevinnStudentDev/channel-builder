"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use this hook to get dynamic params
import VideoPlayer from '../../../components/video/video-player';

interface Stream {
  id: string | number;
  title: string;
  uri: string; // This holds the URL for the video stream
}

export default function ChannelDetails() {
  const { channelId } = useParams(); // Get channelId from the dynamic URL
  const [streams, setStreams] = useState<Stream[]>([]); // Change state to hold streams instead of the whole channel object

  useEffect(() => {
    if (channelId) {
      // Fetch data for the specific channel using the channelId
      fetch(`/api/channels/${channelId}/streams`)
        .then((response) => response.json())
        .then((data) => {
          setStreams(data); // Store the list of streams
          console.log(data);
        })
        .catch((error) => console.error('Error fetching streams:', error));
    }
  }, [channelId]);

  if (!streams || streams.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Channel ID: {channelId}</h1>
      <div>
        {/* Iterate over streams and render a VideoPlayer for each stream */}
        {streams.map((stream) => (
          <div key={stream.id}>
            <h3>{stream.title}</h3>
            <VideoPlayer src={stream.uri} /> {/* Pass the stream URI to VideoPlayer */}
          </div>
        ))}
      </div>
    </div>
  );
}
