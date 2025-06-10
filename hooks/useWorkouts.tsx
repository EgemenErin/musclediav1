import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Workout = {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  timestamp: number;
};

const STORAGE_KEY = 'workouts';

type WorkoutsContextType = {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'timestamp'>) => Promise<void>;
  clearWorkouts: () => Promise<void>;
  loading: boolean;
};

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export const WorkoutsProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setWorkouts(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load workouts', e);
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'timestamp'>) => {
    const newWorkout: Workout = { ...workout, timestamp: Date.now() };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearWorkouts = async () => {
    setWorkouts([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <WorkoutsContext.Provider value={{ workouts, addWorkout, clearWorkouts, loading }}>
      {children}
    </WorkoutsContext.Provider>
  );
};

export function useWorkouts() {
  const context = useContext(WorkoutsContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutsProvider');
  }
  return context;
}