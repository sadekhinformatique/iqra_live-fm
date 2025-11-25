export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface StationSettings {
  radioName: string;
  logoUrl: string;
  streamUrl: string;
  playlistUrl: string; // URL to a JSON file or Terabox folder link (simulated)
  primaryColor: string;
  socials: SocialLinks;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  time: string;
}

export interface AuthState {
  isAuthenticated: boolean;
}