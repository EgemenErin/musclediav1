import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Gender = 'male' | 'female';

type Character = {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  streak: number;
  lastWorkout: string | null;
  questsCompleted: number;
  gender: Gender;
  height?: number;
  weight?: number;
  goal?: string;
};

type CharacterContextType = {
  character: Character;
  updateCharacter: (updatedCharacter: Partial<Character>) => void;
  incrementXP: (amount: number) => void;
  completeQuest: (questId: string, xpReward: number) => void;
  resetCharacter: () => void;
};

const DEFAULT_CHARACTER: Character = {
  name: 'Adventurer',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  streak: 0,
  lastWorkout: null,
  questsCompleted: 0,
  gender: 'male',
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load character data on initial render
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const storedCharacter = await AsyncStorage.getItem('character');
        if (storedCharacter) {
          setCharacter(JSON.parse(storedCharacter));
        }
      } catch (error) {
        console.error('Failed to load character data:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadCharacter();
  }, []);

  // Update streak based on last workout date
  useEffect(() => {
    if (!isInitialized) return;

    const updateStreak = () => {
      const today = new Date().toISOString().split('T')[0];
      const lastWorkout = character.lastWorkout;

      if (!lastWorkout) {
        // First time user, no streak yet
        return;
      }

      const lastWorkoutDate = new Date(lastWorkout);
      const currentDate = new Date(today);
      
      // Calculate the difference in days
      const timeDiff = currentDate.getTime() - lastWorkoutDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 1) {
        // Consecutive day, increase streak
        updateCharacter({ 
          streak: character.streak + 1,
          lastWorkout: today
        });
      } else if (daysDiff > 1) {
        // Streak broken
        updateCharacter({ 
          streak: 0,
          lastWorkout: today
        });
      }
    };

    updateStreak();
  }, [isInitialized]);

  // Save character data whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    const saveCharacter = async () => {
      try {
        await AsyncStorage.setItem('character', JSON.stringify(character));
      } catch (error) {
        console.error('Failed to save character data:', error);
      }
    };

    saveCharacter();
  }, [character, isInitialized]);

  // Calculate XP needed for next level (increases with each level)
  const calculateXPToNextLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
  };

  // Handle leveling up logic
  const checkLevelUp = (xp: number, currentLevel: number, currentXpToNextLevel: number) => {
    if (xp >= currentXpToNextLevel) {
      const newLevel = currentLevel + 1;
      const remainingXP = xp - currentXpToNextLevel;
      const newXpToNextLevel = calculateXPToNextLevel(newLevel);
      
      return {
        level: newLevel,
        xp: remainingXP,
        xpToNextLevel: newXpToNextLevel,
      };
    }
    
    return {
      level: currentLevel,
      xp: xp,
      xpToNextLevel: currentXpToNextLevel,
    };
  };

  // Update character with new values
  const updateCharacter = (updatedCharacter: Partial<Character>) => {
    setCharacter(prevCharacter => ({
      ...prevCharacter,
      ...updatedCharacter,
    }));
  };

  // Add XP and handle leveling up
  const incrementXP = (amount: number) => {
    const newXP = character.xp + amount;
    const newTotalXP = character.totalXP + amount;
    
    const levelData = checkLevelUp(newXP, character.level, character.xpToNextLevel);
    
    updateCharacter({
      ...levelData,
      totalXP: newTotalXP,
    });
  };

  // Complete a quest and get the reward
  const completeQuest = (questId: string, xpReward: number) => {
    const today = new Date().toISOString().split('T')[0];
    const lastWorkout = character.lastWorkout;
    
    let newStreak = character.streak;
    
    if (lastWorkout !== today) {
      if (!lastWorkout) {
        // First workout ever
        newStreak = 1;
      } else {
        const lastWorkoutDate = new Date(lastWorkout);
        const currentDate = new Date(today);
        
        const timeDiff = currentDate.getTime() - lastWorkoutDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If same day, streak stays the same
      }
    }
    
    // Update character stats
    incrementXP(xpReward);
    updateCharacter({
      questsCompleted: character.questsCompleted + 1,
      lastWorkout: today,
      streak: newStreak,
    });
  };

  // Reset character to default values
  const resetCharacter = () => {
    setCharacter(DEFAULT_CHARACTER);
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        incrementXP,
        completeQuest,
        resetCharacter,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};