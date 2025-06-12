-- Enable Row Level Security
ALTER TABLE IF EXISTS characters ENABLE ROW LEVEL SECURITY;

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  xp_to_next_level INTEGER DEFAULT 100 NOT NULL,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  last_workout TIMESTAMPTZ NULL,
  quests_completed INTEGER DEFAULT 0 NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) DEFAULT 'male' NOT NULL,
  height INTEGER NULL,
  weight INTEGER NULL,
  goal TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one character per user
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters(user_id);
CREATE INDEX IF NOT EXISTS characters_level_idx ON characters(level);
CREATE INDEX IF NOT EXISTS characters_streak_idx ON characters(streak);

-- Row Level Security Policies
-- Users can only access their own character data
CREATE POLICY "Users can view their own character" ON characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own character" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own character" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own character" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_characters_updated_at 
  BEFORE UPDATE ON characters 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a function to get character with user info
CREATE OR REPLACE FUNCTION get_character_with_user(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  user_email TEXT,
  name TEXT,
  level INTEGER,
  xp INTEGER,
  xp_to_next_level INTEGER,
  total_xp INTEGER,
  streak INTEGER,
  last_workout TIMESTAMPTZ,
  quests_completed INTEGER,
  gender TEXT,
  height INTEGER,
  weight INTEGER,
  goal TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    u.email as user_email,
    c.name,
    c.level,
    c.xp,
    c.xp_to_next_level,
    c.total_xp,
    c.streak,
    c.last_workout,
    c.quests_completed,
    c.gender,
    c.height,
    c.weight,
    c.goal,
    c.created_at,
    c.updated_at
  FROM characters c
  JOIN auth.users u ON c.user_id = u.id
  WHERE c.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 