import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from './useAuth';
import { CharacterService } from '@/services/characterService';
import type { Database } from '@/lib/supabase-types';

type Character = Database['public']['Tables']['characters']['Row'];

type CharacterContextType = {
  character: Character | null;
  isLoading: boolean;
  error: string | null;
  updateCharacter: (updates: Partial<Character>) => Promise<void>;
  incrementXP: (amount: number) => Promise<void>;
  completeQuest: (questId: string, xpReward: number) => Promise<void>;
  resetCharacter: () => Promise<void>;
};

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load character data when user changes
  useEffect(() => {
    const loadCharacter = async () => {
      if (!user?.id) {
        setCharacter(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { character: loadedCharacter, error: fetchError } =
          await CharacterService.getCharacterByUserId(user.id);

        if (fetchError) {
          throw new Error(fetchError);
        }

        setCharacter(loadedCharacter || null);
      } catch (err) {
        console.error('Failed to load character:', err);
        setError('Failed to load character data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [user?.id]);

  const updateCharacter = async (updates: Partial<Character>) => {
    if (!character?.id) {
      setError('No character found to update');
      return;
    }

    try {
      const { character: updatedCharacter, error: updateError } =
        await CharacterService.updateCharacter(character.id, updates);

      if (updateError) {
        throw new Error(updateError);
      }

      if (updatedCharacter) {
        setCharacter(updatedCharacter);
      }
    } catch (err) {
      console.error('Failed to update character:', err);
      setError('Failed to update character');
    }
  };

  const incrementXP = async (amount: number) => {
    if (!character?.id) {
      setError('No character found to update XP');
      return;
    }

    try {
      const { character: updatedCharacter, error: xpError } =
        await CharacterService.addXP(character.id, amount);

      if (xpError) {
        throw new Error(xpError);
      }

      if (updatedCharacter) {
        setCharacter(updatedCharacter);
      }
    } catch (err) {
      console.error('Failed to increment XP:', err);
      setError('Failed to update XP');
    }
  };

  const completeQuest = async (questId: string, xpReward: number) => {
    if (!character?.id) {
      setError('No character found to complete quest');
      return;
    }

    try {
      const { character: updatedCharacter, error: questError } =
        await CharacterService.completeQuest(character.id, xpReward);

      if (questError) {
        throw new Error(questError);
      }

      if (updatedCharacter) {
        setCharacter(updatedCharacter);
      }
    } catch (err) {
      console.error('Failed to complete quest:', err);
      setError('Failed to complete quest');
    }
  };

  const resetCharacter = async () => {
    setCharacter(null);
    setError(null);
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        isLoading,
        error,
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
