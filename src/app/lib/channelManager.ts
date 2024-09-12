// lib/channelManager.ts

export interface Channel {
    id: string | number;
    title: string;
    uri: string;
  }
  
  // Define the AssetManager class
  export class MyAssetManager {
    private static instance: MyAssetManager;
    assets: Record<string, Channel[]>;
  
    // Singleton pattern to ensure one instance is shared across the app
    private constructor() {
      this.assets = {
        myfirstchannel: [
          {
            id: "e62ae11e-eee0-4372-812d-90730241831b",
            title: "stswe19-three-roads-to-jerusalem",
            uri: "https://lab.cdn.eyevinn.technology/stswe19-three-roads-to-jerusalem.mp4/manifest.m3u8",
          },
          {
            id: "3a65e827-8c75-4e7b-90d5-15f797ed1646",
            title: "stswe22-talks-teaser",
            uri: "https://lab.cdn.eyevinn.technology/stswe22-talks-teaser-Z4-ehLIMe8.mp4/manifest.m3u8",
          },
          {
            id: "dd21b69f-8096-4ee5-a899-9cdabb9371b4",
            title: "stswe22-webrtc",
            uri: "https://lab.cdn.eyevinn.technology/stswe22-webrtc-flt5fm7bR3.mp4/manifest.m3u8",
          },
        ],
        mysecondchannel: [
          {
            id: 1,
            title: "Tears of Steel",
            uri: "https://maitv-vod.lab.eyevinn.technology/tearsofsteel_4k.mov/master.m3u8",
          },
        ],
      };
    }
  
    // Singleton instance
    public static getInstance(): MyAssetManager {
      if (!MyAssetManager.instance) {
        MyAssetManager.instance = new MyAssetManager();
      }
      return MyAssetManager.instance;
    }
  
    // Method to get the next VOD based on playlistId
    async getNextVod(vodRequest: { playlistId: string }): Promise<Channel> {
      const assets = this.assets[vodRequest.playlistId] || this.assets["myfirstchannel"];
      const idx = Math.floor(Math.random() * assets.length);
      return assets[idx];
    }
  
    // Method to update assets
    updateAssets(newAssets: Record<string, Channel[]>) {
      this.assets = newAssets;
    }
  }
  
  // Define the ChannelManager class
  export class MyChannelManager {
    private static instance: MyChannelManager;
  
    private constructor() {}
  
    // Singleton instance
    public static getInstance(): MyChannelManager {
      if (!MyChannelManager.instance) {
        MyChannelManager.instance = new MyChannelManager();
      }
      return MyChannelManager.instance;
    }
  
    // Method to get a list of available channels
    getChannels(): Array<{ id: string }> {
      const assetManager = MyAssetManager.getInstance();
      return Object.keys(assetManager.assets).map((channelId) => ({
        id: channelId,
      }));
    }
  
    // Method to get the streams for a specific channel
    getChannelStreams(channelId: string): Channel[] | null {
      const assetManager = MyAssetManager.getInstance();
      return assetManager.assets[channelId] || null;
    }
  }
  