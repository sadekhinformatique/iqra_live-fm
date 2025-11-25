
import { StationSettings, AuthState } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const SETTINGS_KEY = 'radio_station_settings';
const AUTH_KEY = 'radio_admin_auth';

// --- CONFIGURATION PRODUCTION ---
// Mettre à true pour utiliser votre vrai backend (PHP/Node/Python)
// Mettre à false pour tester en local avec le navigateur (simulation)
const USE_API = false; 
const API_BASE_URL = '/api';

// --- INTERFACE API RÉELLE (FETCH) ---

async function apiFetchSettings(): Promise<StationSettings> {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return await response.json();
}

async function apiSaveSettings(settings: StationSettings): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to save settings');
}

async function apiCheckAuth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check`);
    if (response.status === 401) return false;
    return response.ok;
  } catch {
    return false;
  }
}

async function apiLogin(password: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return response.ok;
}

async function apiLogout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
}

// --- INTERFACE SIMULÉE (LOCALSTORAGE) ---
// Simule des délais réseau pour imiter un vrai serveur

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function mockFetchSettings(): Promise<StationSettings> {
  await delay(300); // Simulation latence réseau
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function mockSaveSettings(settings: StationSettings): Promise<void> {
  await delay(600); // Simulation écriture base de données
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  // Déclenche un événement pour mettre à jour les autres onglets/composants si besoin
  window.dispatchEvent(new Event('storage'));
}

async function mockCheckAuth(): Promise<boolean> {
  await delay(100);
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  try {
    const parsed: AuthState = JSON.parse(auth);
    return parsed.isAuthenticated;
  } catch {
    return false;
  }
}

async function mockLogin(password: string): Promise<boolean> {
  await delay(800); // Simulation vérification hash (bcrypt)
  if (password === 'password') {
    const state: AuthState = { isAuthenticated: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    return true;
  }
  return false;
}

async function mockLogout(): Promise<void> {
  await delay(200);
  localStorage.removeItem(AUTH_KEY);
}

// --- EXPORTS UNIFIÉS ---

export const fetchSettings = USE_API ? apiFetchSettings : mockFetchSettings;
export const saveSettings = USE_API ? apiSaveSettings : mockSaveSettings;
export const checkAuth = USE_API ? apiCheckAuth : mockCheckAuth;
export const login = USE_API ? apiLogin : mockLogin;
export const logout = USE_API ? apiLogout : mockLogout;
