import { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, set, get } from 'firebase/database';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    fontSize: 'normal',
    dyslexicFont: false,
    highContrast: false,
    audioEnabled: true,
    readingSpeed: 1,
    screenReaderEnabled: true,
    autoPlayAudio: false,
    showHints: true,
    textToSpeech: true,
    theme: 'dark',
    language: 'en',
    notifications: true,
    volume: 1
  });
  
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadSettings = async () => {
    try {
      const settingsRef = ref(database, `settings/${currentUser.uid}`);
      const snapshot = await get(settingsRef);
      
      if (snapshot.exists()) {
        setSettings(prev => ({...prev, ...snapshot.val()}));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading settings:', err);
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    if (!currentUser) return;

    try {
      const settingsRef = ref(database, `settings/${currentUser.uid}`);
      const updatedSettings = {...settings, ...newSettings};
      
      await set(settingsRef, updatedSettings);
      setSettings(updatedSettings);
      
      // Apply settings immediately
      applySettings(updatedSettings);
      
      return true;
    } catch (err) {
      console.error('Error saving settings:', err);
      return false;
    }
  };

  const applySettings = (newSettings) => {
    // Apply font settings
    document.documentElement.style.fontSize = 
      newSettings.fontSize === 'large' ? '120%' : 
      newSettings.fontSize === 'small' ? '90%' : '100%';

    // Apply theme
    document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
    document.documentElement.classList.toggle('high-contrast', newSettings.highContrast);

    // Apply font family
    document.documentElement.style.fontFamily = 
      newSettings.dyslexicFont ? 'OpenDyslexic, sans-serif' : 'system-ui, sans-serif';
  };

  const value = {
    settings,
    loading,
    updateSettings,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}