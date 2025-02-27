import { createContext, useContext, useState, useRef } from 'react';

const AudioContext = createContext();

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }) {
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const playSound = async (audioFile, options = {}) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioFile);
      audioRef.current = audio;
      
      // Apply audio settings
      audio.volume = isMuted ? 0 : volume;
      if (options.loop) audio.loop = true;
      if (options.playbackRate) audio.playbackRate = options.playbackRate;
      
      await audio.play();
      setError(null);
      
      return audio;
    } catch (err) {
      setError(err);
      console.error('Audio playback error:', err);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const adjustVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const value = {
    playSound,
    stopSound,
    error,
    volume,
    isMuted,
    adjustVolume,
    toggleMute
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}