import { useState, useEffect } from 'react';

interface Settings {
  workStartTime: string;
  workEndTime: string;
  breakMinutes: number;
}

const defaultSettings: Settings = {
  workStartTime: '09:00',
  workEndTime: '18:00',
  breakMinutes: 60,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('app-settings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};