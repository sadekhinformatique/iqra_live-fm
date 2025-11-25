import React, { useState, useEffect, useRef } from 'react';
import { StationSettings } from '../types';
import { getSettings, saveSettings, checkAuth, login, logout } from '../services/settingsService';
import { Save, LogOut, Settings, Globe, Palette, Lock, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<StationSettings>(getSettings());
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
    setSettings(getSettings());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setIsAuthenticated(true);
      setPassword('');
      setStatusMsg(null);
    } else {
      setStatusMsg({ type: 'error', text: "Mot de passe incorrect (Indice: password)" });
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveSettings(settings);
      setStatusMsg({ type: 'success', text: "Configuration sauvegardée avec succès !" });
      
      // Petit délai pour laisser l'utilisateur lire le message avant le reload (nécessaire pour propager les changements globaux proprement ici)
      setTimeout(() => {
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Erreur lors de la sauvegarde." });
    }
  };

  const handleChange = (field: keyof StationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socials: { ...prev.socials, [network]: value }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation simple de taille (Max 1MB pour localStorage)
      if (file.size > 1024 * 1024) {
        setStatusMsg({ type: 'error', text: "L'image est trop lourde (Max 1Mo)." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleChange('logoUrl', result);
        setStatusMsg({ type: 'success', text: "Image chargée ! N'oubliez pas d'enregistrer." });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
        {/* Background animation hints */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-slate-700/30 rounded-full shadow-inner border border-slate-600/30">
                <Lock size={32} className="text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">Administration</h2>
          <p className="text-center text-slate-400 mb-8 text-sm">Accès sécurisé au panneau de contrôle</p>
          
          {statusMsg && statusMsg.type === 'error' && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-600"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]"
            >
              Connexion
            </button>
          </form>
          <div className="mt-6 text-center">
             <a href="#/" className="text-sm text-slate-500 hover:text-white transition-colors">← Retour à la radio</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <Settings size={20} className="text-blue-500" />
            </div>
            <h1 className="font-bold text-white text-lg tracking-tight">Panneau Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#/" target="_blank" className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all">
                <Globe size={16} /> Voir le site
            </a>
            <div className="h-6 w-px bg-slate-800"></div>
            <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        
        {/* Header with Title and Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Configuration</h2>
            <p className="text-slate-400">Gérez les paramètres de votre station de radio.</p>
          </div>
          {statusMsg && (
             <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${statusMsg.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {statusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {statusMsg.text}
             </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Card: Identity */}
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <ImageIcon size={22} className="text-blue-400" /> Identité Visuelle
            </h3>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo Preview & Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-900 shadow-inner overflow-hidden group-hover:border-blue-500/30 transition-colors">
                  <img src={settings.logoUrl} alt="Logo actuel" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Changer le logo
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Max 1 Mo (JPG, PNG)</p>
                </div>
              </div>

              {/* Identity Fields */}
              <div className="flex-1 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Nom de la Radio</label>
                  <input
                    type="text"
                    value={settings.radioName}
                    onChange={(e) => handleChange('radioName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ex: My Radio FM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Couleur Principale</label>
                  <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="h-8 w-12 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                      />
                      <span className="text-sm font-mono text-slate-400 uppercase">{settings.primaryColor}</span>
                      <div className="flex-1 text-right text-xs text-slate-500">Utilisé pour les animations</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card: Streaming */}
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Settings size={22} className="text-purple-400" /> Flux & Audio
            </h3>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">URL du Flux Audio (Stream)</label>
                <input
                  type="text"
                  value={settings.streamUrl}
                  onChange={(e) => handleChange('streamUrl', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none font-mono text-sm text-purple-300"
                  placeholder="https://..."
                />
                 <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                   <CheckCircle size={10} /> Compatible Icecast, Shoutcast, HLS
                 </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Source de la Playlist (JSON/Dossier)</label>
                <input
                    type="text"
                    value={settings.playlistUrl}
                    onChange={(e) => handleChange('playlistUrl', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                    placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {/* Card: Social Media */}
          <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
             <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Globe size={22} className="text-green-400" /> Réseaux Sociaux
            </h3>
            <div className="grid gap-5 md:grid-cols-2">
                {Object.keys(settings.socials).map((key) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{key}</label>
                        <input
                            type="text"
                            value={settings.socials[key as keyof typeof settings.socials] || ''}
                            onChange={(e) => handleSocialChange(key, e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
                            placeholder={`Lien vers votre page ${key}...`}
                        />
                    </div>
                ))}
            </div>
          </section>

          {/* Floating Save Bar */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
                type="submit"
                className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
                <Save size={20} />
                Enregistrer les modifications
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Admin;