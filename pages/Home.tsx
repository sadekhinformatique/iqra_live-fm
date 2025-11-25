import React from 'react';
import { StationSettings } from '../types';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import { Facebook, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';

interface HomeProps {
  settings: StationSettings;
}

const Home: React.FC<HomeProps> = ({ settings }) => {
  const getSocialIcon = (network: string) => {
    switch (network) {
      case 'facebook': return <Facebook size={24} />;
      case 'twitter': return <Twitter size={24} />;
      case 'instagram': return <Instagram size={24} />;
      case 'youtube': return <Youtube size={24} />;
      default: return <ExternalLink size={24} />;
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 -z-20"></div>
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 -z-10 pointer-events-none"
        style={{ backgroundColor: settings.primaryColor }}
      ></div>

      <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg tracking-tight">{settings.radioName}</span>
        </div>
        <a href="#/admin" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Admin</a>
      </header>

      <main className="w-full px-4 z-10 mt-8">
        <Player settings={settings} />
        <Playlist />

        <div className="flex justify-center gap-6 mt-12">
          {Object.entries(settings.socials).map(([key, url]) => {
            if (!url) return null;
            return (
              <a 
                key={key} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-all transform hover:scale-110 hover:-translate-y-1"
                title={key}
              >
                {getSocialIcon(key)}
              </a>
            );
          })}
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-center text-slate-600 text-xs z-10">
        &copy; {new Date().getFullYear()} {settings.radioName}. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Home;