import { useState, useEffect } from 'react';

export interface Settings {
  workStartTime: string;
  workEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  workShift: '1' | '2' | '3';
}

const defaultSettings: Settings = {
  workStartTime: '09:00',
  workEndTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '14:00',
  workShift: '2',
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('app-settings');
      const parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};
      return { ...defaultSettings, ...parsedSettings };
    } catch (error) {
      console.error("Failed to parse settings from localStorage, using default.", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};