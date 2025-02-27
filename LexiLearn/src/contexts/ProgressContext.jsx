import { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, set, get, update } from 'firebase/database';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    } else {
      setProgress({});
      setLoading(false);
    }
  }, [currentUser]);

  const loadProgress = async () => {
    try {
      const progressRef = ref(database, `progress/${currentUser.uid}`);
      const snapshot = await get(progressRef);
      
      if (snapshot.exists()) {
        setProgress(snapshot.val());
      }
      
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const updateProgress = async (moduleId, data) => {
    if (!currentUser) return;

    try {
      const updates = {
        [`progress/${currentUser.uid}/${moduleId}`]: {
          ...progress[moduleId],
          ...data,
          lastUpdated: new Date().toISOString()
        }
      };

      await update(ref(database), updates);
      setProgress(prev => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          ...data,
          lastUpdated: new Date().toISOString()
        }
      }));

      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  };

  const getModuleProgress = (moduleId) => {
    return progress[moduleId] || {
      completed: false,
      score: 0,
      timeSpent: 0,
      attempts: 0,
      lastAttempt: null
    };
  };

  const value = {
    progress,
    loading,
    error,
    updateProgress,
    getModuleProgress,
    loadProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}