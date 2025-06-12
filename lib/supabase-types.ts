export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: number;
          xp: number;
          xp_to_next_level: number;
          total_xp: number;
          streak: number;
          last_workout: string | null;
          quests_completed: number;
          gender: 'male' | 'female';
          height: number | null;
          weight: number | null;
          goal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level?: number;
          xp?: number;
          xp_to_next_level?: number;
          total_xp?: number;
          streak?: number;
          last_workout?: string | null;
          quests_completed?: number;
          gender?: 'male' | 'female';
          height?: number | null;
          weight?: number | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          level?: number;
          xp?: number;
          xp_to_next_level?: number;
          total_xp?: number;
          streak?: number;
          last_workout?: string | null;
          quests_completed?: number;
          gender?: 'male' | 'female';
          height?: number | null;
          weight?: number | null;
          goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
