import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type CharacterRow = Database['public']['Tables']['characters']['Row'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];
type CharacterUpdate = Database['public']['Tables']['characters']['Update'];

export class CharacterService {
  /**
   * Create a new character for a user after registration
   */
  static async createCharacter(
    userId: string,
    name: string,
    gender: 'male' | 'female' = 'male'
  ): Promise<{ success: boolean; character?: CharacterRow; error?: string }> {
    try {
      const defaultCharacter: CharacterInsert = {
        user_id: userId,
        name: name.trim(),
        level: 1,
        xp: 0,
        xp_to_next_level: 100,
        total_xp: 0,
        streak: 0,
        last_workout: null,
        quests_completed: 0,
        gender,
        height: null,
        weight: null,
        goal: null,
      };

      const { data, error } = await supabase
        .from('characters')
        .insert(defaultCharacter)
        .select()
        .single();

      if (error) {
        console.error('Error creating character:', error);
        return { success: false, error: error.message };
      }

      return { success: true, character: data };
    } catch (error) {
      console.error('Character creation failed:', error);
      return { success: false, error: 'Failed to create character' };
    }
  }

  /**
   * Get character by user ID
   */
  static async getCharacterByUserId(
    userId: string
  ): Promise<{ success: boolean; character?: CharacterRow; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No character found - this is okay for new users
          return { success: true, character: undefined };
        }
        console.error('Error fetching character:', error);
        return { success: false, error: error.message };
      }

      return { success: true, character: data };
    } catch (error) {
      console.error('Character fetch failed:', error);
      return { success: false, error: 'Failed to fetch character' };
    }
  }

  /**
   * Update character data
   */
  static async updateCharacter(
    characterId: string,
    updates: CharacterUpdate
  ): Promise<{ success: boolean; character?: CharacterRow; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', characterId)
        .select()
        .single();

      if (error) {
        console.error('Error updating character:', error);
        return { success: false, error: error.message };
      }

      return { success: true, character: data };
    } catch (error) {
      console.error('Character update failed:', error);
      return { success: false, error: 'Failed to update character' };
    }
  }

  /**
   * Add XP to character and handle level ups
   */
  static async addXP(
    characterId: string,
    xpAmount: number
  ): Promise<{
    success: boolean;
    character?: CharacterRow;
    leveledUp?: boolean;
    error?: string;
  }> {
    try {
      // First get current character data
      const { data: currentChar, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      let newXP = currentChar.xp + xpAmount;
      let newLevel = currentChar.level;
      let newXPToNext = currentChar.xp_to_next_level;
      let leveledUp = false;

      // Check for level up
      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = newLevel * 100; // XP needed increases with level
        leveledUp = true;
      }

      const updates: CharacterUpdate = {
        xp: newXP,
        level: newLevel,
        xp_to_next_level: newXPToNext,
        total_xp: currentChar.total_xp + xpAmount,
        updated_at: new Date().toISOString(),
      };

      const result = await this.updateCharacter(characterId, updates);

      return {
        ...result,
        leveledUp,
      };
    } catch (error) {
      console.error('Add XP failed:', error);
      return { success: false, error: 'Failed to add XP' };
    }
  }

  /**
   * Update streak
   */
  static async updateStreak(
    characterId: string,
    newStreak: number
  ): Promise<{ success: boolean; character?: CharacterRow; error?: string }> {
    return this.updateCharacter(characterId, {
      streak: newStreak,
      last_workout: new Date().toISOString(),
    });
  }

  /**
   * Complete quest
   */
  static async completeQuest(
    characterId: string,
    xpReward: number
  ): Promise<{
    success: boolean;
    character?: CharacterRow;
    leveledUp?: boolean;
    error?: string;
  }> {
    try {
      // First get current character data
      const { data: currentChar, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Update quests completed
      const questUpdate = await this.updateCharacter(characterId, {
        quests_completed: currentChar.quests_completed + 1,
      });

      if (!questUpdate.success) {
        return questUpdate;
      }

      // Add XP reward
      return this.addXP(characterId, xpReward);
    } catch (error) {
      console.error('Complete quest failed:', error);
      return { success: false, error: 'Failed to complete quest' };
    }
  }
}
