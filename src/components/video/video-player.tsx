"use client";

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface VideoPlayerProps {
  src: string;
}

// VideoPlayer component for displaying HLS streams
export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const defaultOptions = {};

    // Check if the video can play HLS natively (e.g., Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      // Initialize Hls.js for browsers that do not support HLS natively
      const hls = new Hls();
      hls.loadSource(src);
      // Initialize Plyr for custom video controls
      const player = new Plyr(video, defaultOptions);
      hls.attachMedia(video);

    } else {
      console.error('This browser does not support MSE');

    }
  }, [src]);

  return (
    <>
      <video ref={videoRef} playsInline controls />
      <style jsx>{`
        video {
          max-width: 100%;
          width: auto;
          height: 100%;
        }
      `}</style>
    </>
  );
}
