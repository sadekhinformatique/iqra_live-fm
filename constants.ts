import { StationSettings } from './types';

// Default settings if nothing is saved in storage
export const DEFAULT_SETTINGS: StationSettings = {
  radioName: "NeoWave FM",
  logoUrl: "https://picsum.photos/id/453/400/400", // Placeholder abstract image
  // A reliable public stream for testing (Icecast example)
  streamUrl: "https://stream.zeno.fm/ztmkyozjspltv", 
  playlistUrl: "",
  primaryColor: "#3b82f6", // Blue-500
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com"
  }
};

// Simulated mock playlist data since direct Terabox API access needs backend proxy
export const MOCK_PLAYLIST = [
  { id: '1', title: "Midnight City", artist: "M83", coverUrl: "https://picsum.photos/id/10/200/200", time: "14:20" },
  { id: '2', title: "Blinding Lights", artist: "The Weeknd", coverUrl: "https://picsum.photos/id/11/200/200", time: "14:16" },
  { id: '3', title: "Nightcall", artist: "Kavinsky", coverUrl: "https://picsum.photos/id/12/200/200", time: "14:12" },
  { id: '4', title: "Get Lucky", artist: "Daft Punk", coverUrl: "https://picsum.photos/id/13/200/200", time: "14:08" },
  { id: '5', title: "Instant Crush", artist: "Daft Punk", coverUrl: "https://picsum.photos/id/14/200/200", time: "14:03" },
];