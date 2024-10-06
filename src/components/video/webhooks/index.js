const { randomUUID } = require('crypto');

exports.handler = async (event) => {
  const channelId = event.query.channelId;
  console.log(`Requesting next VOD for channel ${channelId}`);
  const playlist = event.body.playlist;
  const vods = playlist.split('\n').map(url => url.trim()).filter(url => url !== "");  // split string of streams into playlist

  // to the handler, send in query.vods and channel id instead of hardcoded
  /*const vods = [
    'https://lab.cdn.eyevinn.technology/stswetvplus-promo-2023-5GBm231Mkz.mov/manifest.m3u8',
    'https://lab.cdn.eyevinn.technology/Channel-Engine-Promo-Mar-2023-PnA8E-jw5x.mp4/manifest.m3u8',
    'https://lab.cdn.eyevinn.technology/eyevinn-reel-feb-2023-_2Y7i4eOAi.mp4/manifest.m3u8'
  ];*/

  if (vods.length === 0) {
    console.error('No VODs provided');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No VODs provided' }),
    };
  }

  console.log(`Requesting next VOD for channel ${channelId}`);

  // Dynamically select a VOD from the playlist
  return {
    body: {
      id: randomUUID(),
      title: 'Example',
      hlsUrl: vods[Math.floor(Math.random() * vods.length)],
      prerollUrl: 'https://maitv-vod.lab.eyevinn.technology/VINN.mp4/master.m3u8',
      prerollDurationMs: 105000
    }
  };
};

// post/webhook request to lambda
