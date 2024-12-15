import { Snippet } from '@nextui-org/react';
import VideoPlayer from '../video/video-player';

export default function HelloWorld() {
  return (
    <>
      <VideoPlayer
        src={'http://localhost:8080/channels/myfirstchannel/master.m3u8'}
      />
    </>
  );
}
