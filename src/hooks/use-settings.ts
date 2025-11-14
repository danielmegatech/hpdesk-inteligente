import { useState, useEffect } from 'react';

interface Settings {
  workStartTime: string;
  workEndTime: string;
  breakStartTime: string; // New field for break start time
  breakEndTime: string;   // New field for break end time
}

const defaultSettings: Settings = {
  workStartTime: '09:00',
  workEndTime: '18:00',
  breakStartTime: '13:00', // Default break start
  breakEndTime: '14:00',   // Default break end (1 hour)
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('app-settings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
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