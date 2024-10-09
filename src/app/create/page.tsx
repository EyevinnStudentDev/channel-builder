"use client";

import { FormEvent, useState } from 'react';
import { fetchServiceToken } from '../lib/serviceToken';
import path from 'path';
import JSZip from 'jszip';

export default function Home() {
  const [channelName, setChannelName] = useState<string>("");
  const [channelType, setChannelType] = useState<string>("Loop");
  const [streamUrl, setStreamUrl] = useState<string>(""); // For Loop
  const [playlist, setPlaylist] = useState<string>(""); // For Playlist

  const createChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let url = streamUrl;

    // If type is Playlist, upload the playlist to Gist and get the URL to the gist
    if (channelType === "Playlist") {
      const playlistUrl = await uploadPlaylistToGist(playlist); // Upload playlist to Gist
      if (!playlistUrl) {
        console.error("Failed to upload playlist to Gist.");
        return;
      }
      url = playlistUrl; 
    }

    // If type is Webhook, upload the playlist to the webhook (dynamic playlist)
    if (channelType === "Webhook") {
      const formData = new FormData();
      // const playlistUrl = await uploadPlaylistToLambda(playlist); // Upload playlist to Lambda webhook
      // Path to the file with the dynamic playlist
      // const lambdaUrl = "https://${tenant}-svdt.birme-lambda.auto.prod.osaas.io/upload"; 
      const lambdaUrl = "https://devstudent-svdt.birme-lambda.auto.prod.osaas.io/upload";   // hardcoded for now
      // const filePath = path.join(process.cwd(), 'src/components/webhooks', 'index.js');  
      var zip = new JSZip();
      const handlerCode = `
      const { randomUUID } = require('crypto');
      exports.handler = async (event) => {
        const playlist = \`${playlist}\`;
        const vods = playlist.split('\\n').map(url => url.trim()).filter(url => url !== "");
        if (vods.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'No VODs provided' }) };
        }
        return {
          body: {
            id: randomUUID(),
            title: 'Example',
            hlsUrl: vods[Math.floor(Math.random() * vods.length)],
            prerollUrl: 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8',
            prerollDurationMs: 105000
          }
        };
      };`;
      // zip.file(filePath);
      zip.file("index.js", handlerCode);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      formData.append("file", zipBlob, "webhook-handler.zip");

      // POST request to upload zip file to Lambda
      try {
        const response = await fetch(lambdaUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors', 
        });
  
        if (!response.ok) {
          console.error('Failed to upload zip to Lambda:', response.statusText);
          return;
        }
  
        const data = await response.json();
        console.log('Successfully uploaded the zip file:', data);
      } catch (error) {
        console.error('Error uploading zip file:', error);
      }
    };  


    // POST request to create channel
    try {
      const response = await fetch('/api/postChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: channelName,
          type: channelType,
          url: url,
          opts: {
            useDemuxedAudio: false, useVttSubtitles: false
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("SUCCESS:", data);
      } else {
        console.error('Failed to create channel:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  // upload playlist to GitHub Gist as .txt
  const uploadPlaylistToGist = async (playlist: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/postGist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist }),
      });

      if (response.ok) {
        const { url } = await response.json();
        return url; 
      } else {
        console.error('Failed to upload playlist:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading playlist:', error);
      return null;
    }
  };

  /* const uploadPlaylistToLambda = async (playlist: string): Promise<string | null> => {

    try {
      const response = await fetch('/api/postLambda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlist,  // Playlist as part of the POST body
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload Success:", responseData);
        return responseData.url || null;  
      } else {
        console.error('Failed to upload playlist to Lambda:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading playlist to Lambda:', error);
      return null;
    }
  };    */

  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div>
        <h1>Create a Channel</h1>
        <form onSubmit={createChannel}>
          <label>Channel Name:</label>
          <input
            type="text"
            name="channel"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
          />
          <br />

          <label>Channel Type:</label>
          <select
            name="type"
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            required
          >
            <option value="Loop">Loop</option>
            <option value="Playlist">Playlist</option>
            <option value="Webhook">Webhook</option>
          </select>
          <br />

          {/* Conditionally show stream URL input or playlist input based on the type */}
          {channelType == "Loop" && (
            <>
              <label>Stream URL:</label>
              <input
                type="text"
                name="streamUrl"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                required
              />
            </>
          )}

          {channelType == "Playlist" || channelType == "Webhook"  && (
            <>
              <label>Playlist (one URL per line):</label>
              <textarea
                name="playlist"
                value={playlist}
                onChange={(e) => setPlaylist(e.target.value)}
                rows={6}
                required
              />
            </>
          )}

          <br />
          <button type="submit">Add Channel</button>
        </form>
      </div>
    </main>
  );
}
