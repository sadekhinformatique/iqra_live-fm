import React from 'react';
import { MOCK_PLAYLIST } from '../constants';
import { Music, Clock } from 'lucide-react';

const Playlist: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto mt-12">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Music size={18} className="text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-200">Derniers titres</h3>
      </div>
      
      <div className="bg-slate-800/30 rounded-2xl p-2 border border-slate-700/50">
        {MOCK_PLAYLIST.map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group">
            <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-lg object-cover shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{track.title}</h4>
              <p className="text-xs text-slate-400 truncate">{track.artist}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              {track.time}
            </div>
          </div>
        ))}
        
        <div className="p-3 text-center">
            <p className="text-xs text-slate-600 italic">Playlist synchronisée depuis le cloud</p>
        </div>
      </div>
    </div>
  );
};

export default Playlist;