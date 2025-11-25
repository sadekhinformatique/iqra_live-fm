
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { fetchSettings } from './services/settingsService';
import { StationSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<StationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (error) {
      console.error("Erreur chargement config:", error);
      setSettings(DEFAULT_SETTINGS); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Écouter les changements locaux (pour le mode démo/localStorage)
    const handleStorageChange = () => {
      loadSettings();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-blue-500">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={settings ? <Home settings={settings} /> : null} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
