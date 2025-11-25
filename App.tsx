import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { getSettings } from './services/settingsService';
import { StationSettings } from './types';

const App: React.FC = () => {
  // We lift state here so updating in Admin reflects immediately in Home if navigated within same session
  const [settings, setSettings] = useState<StationSettings>(getSettings());

  useEffect(() => {
    // A simple event listener to update state if localStorage changes in another tab
    const handleStorageChange = () => {
      setSettings(getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home settings={settings} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
};

export default App;