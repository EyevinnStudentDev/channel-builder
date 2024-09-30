export interface IChannelManager {
  // Get a list of channels available
  getChannels: () => Channel[];
  // Called when engine is having the autoCreateSession option enabled
  autoCreateChannel?: (channelId: string) => void;
}
interface Channel {
  id: string; // Unique Id of a channel
  profile: ChannelProfile[]; // Channel profile
  audioTracks?: AudioTracks[]; // Audio tracks available
  subtitleTracks?: SubtitleTracks[]; // Subtitle tracks available
  closedCaptions?: ClosedCaptions[]; // Closed captions available
}
interface ChannelProfile {
  bw: number; // Bandwidth of the ladder
  codecs: string; // Codecs string
  resolution: number[]; // Resolution, e.g. [ 1920, 1080 ]
  channels?: string; // Channel layout string (2 for stereo)
}
interface AudioTracks {
  language: string; // Audio language
  name: string; // Display name of audio track
  default?: boolean; // When true this is the default track to use
  enforceAudioGroupId?: string; // Enforce to use this audio group Id
}
interface SubtitleTracks {
  language: string; // Subtitle language
  name: string; // Display name of subtitle track
  default?: boolean; // When true this is the default track to use
}
interface ClosedCaptions {
  id: string;
  lang: string;
  name: string;
  default?: boolean;
  auto?: boolean;
}
