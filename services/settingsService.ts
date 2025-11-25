import { StationSettings, AuthState } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const SETTINGS_KEY = 'radio_station_settings';
const AUTH_KEY = 'radio_admin_auth';

// In a real app, these would fetch from a backend API (Node/PHP/Python)
// For this standalone version, we use localStorage to mimic the database.

export const getSettings = (): StationSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: StationSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const checkAuth = (): boolean => {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  try {
    const parsed: AuthState = JSON.parse(auth);
    return parsed.isAuthenticated;
  } catch {
    return false;
  }
};

export const login = (password: string): boolean => {
  // Hardcoded for demo simplicity. In prod, verify hash against DB.
  if (password === 'password') {
    const state: AuthState = { isAuthenticated: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};