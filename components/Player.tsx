import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Radio } from 'lucide-react';
import { StationSettings } from '../types';
import Visualizer from './Visualizer';

interface PlayerProps {
  settings: StationSettings;
}

const Player: React.FC<PlayerProps> = ({ settings }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset state when stream URL changes
  useEffect(() => {
    setIsPlaying(false);
    setError(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [settings.streamUrl]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(false);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback failed:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl p-6 shadow-2xl w-full max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
      <audio
        ref={audioRef}
        src={settings.streamUrl}
        onError={() => {
          setError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }}
        preload="none"
      />

      <div className="flex flex-col items-center">
        {/* Status Badge */}
        <div className={`mb-6 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 border ${
          error 
            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
            : isPlaying 
              ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
              : 'bg-slate-600/20 text-slate-400 border-slate-600/20'
        }`}>
          {error ? (
            <>
              <AlertCircle size={12} />
              OFF AIR
            </>
          ) : (
            <>
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {isPlaying ? 'ON AIR' : 'READY'}
            </>
          )}
        </div>

        {/* Logo/Cover with Wave Animation */}
        <div className="relative w-48 h-48 mb-8 group flex items-center justify-center">
          
          {/* Wave Animations (Behind the image) */}
          {isPlaying && !error && (
            <>
              <div 
                className="absolute inset-0 rounded-full animate-ripple"
                style={{ backgroundColor: settings.primaryColor, animationDelay: '0s', zIndex: 0 }}
              ></div>
              <div 
                className="absolute inset-0 rounded-full animate-ripple"
                style={{ backgroundColor: settings.primaryColor, animationDelay: '0.6s', zIndex: 0 }}
              ></div>
              <div 
                className="absolute inset-0 rounded-full animate-ripple"
                style={{ backgroundColor: settings.primaryColor, animationDelay: '1.2s', zIndex: 0 }}
              ></div>
            </>
          )}

          {/* Static Glow Background */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-50 transition-colors duration-700 z-0"
            style={{ backgroundColor: isPlaying ? settings.primaryColor : 'transparent' }}
          ></div>

          {/* Main Image */}
          <img 
            src={settings.logoUrl} 
            alt="Station Logo" 
            className={`relative w-full h-full object-cover rounded-full border-4 border-slate-800 shadow-2xl z-10 transition-transform duration-[5s] ease-linear ${isPlaying ? 'rotate-[360deg]' : 'rotate-0'}`}
            style={{ animation: isPlaying ? 'spin 10s linear infinite' : 'none' }}
          />
          
          {/* Center hole for vinyl effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full z-20 border border-slate-700"></div>
        </div>

        {/* Titles */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{settings.radioName}</h1>
          <p className="text-slate-400 text-sm">Live Stream</p>
        </div>

        {/* Visualizer */}
        <div className="w-full h-12 mb-6 flex items-center justify-center">
          <Visualizer isPlaying={isPlaying} color={settings.primaryColor} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 w-full mb-4">
          
          {/* Mute Button */}
          <button 
            onClick={toggleMute}
            className="p-3 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {/* Main Play Button */}
          <button
            onClick={togglePlay}
            disabled={isLoading || error}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative group z-20"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : error ? (
              <AlertCircle size={32} />
            ) : isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
            
            {/* Ripple effect on play */}
            {isPlaying && (
               <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: settings.primaryColor }}></div>
            )}
          </button>

          {/* Volume Slider (Simple) */}
          <div className="relative group flex items-center">
             <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
             />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Player;