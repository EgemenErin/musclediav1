import * as React from 'react';
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthUser = {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
  }) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(mapSupabaseUserToAuthUser(session.user));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(mapSupabaseUserToAuthUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToAuthUser = (supabaseUser: User): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name:
        supabaseUser.user_metadata?.name ||
        supabaseUser.user_metadata?.full_name,
      createdAt: supabaseUser.created_at,
    };
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validation
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long',
        };
      }

      if (name.trim().length < 2) {
        return {
          success: false,
          error: 'Name must be at least 2 characters long',
        };
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      console.log('Attempting registration with:', {
        email: email.trim().toLowerCase(),
        hasPassword: !!password,
        name: name.trim(),
      });

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation redirect
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      });

      console.log('Supabase registration response:', {
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message,
        errorCode: error?.status,
      });

      if (error) {
        console.error('Supabase registration error:', error);

        // Handle specific Supabase errors
        if (
          error.message?.includes('invalid') &&
          error.message?.includes('email')
        ) {
          return {
            success: false,
            error:
              'The email address format is not accepted. Please try a different email.',
          };
        }

        if (error.message?.includes('User already registered')) {
          return {
            success: false,
            error:
              'An account with this email already exists. Please try signing in instead.',
          };
        }

        if (error.message?.includes('signup disabled')) {
          return {
            success: false,
            error:
              'Account registration is currently disabled. Please contact support.',
          };
        }

        return {
          success: false,
          error: error.message || 'Registration failed. Please try again.',
        };
      }

      // If user was created successfully, create character
      if (data.user) {
        console.log('Creating character for user:', data.user.id);

        // Import CharacterService dynamically to avoid circular dependency
        const { CharacterService } = await import(
          '@/services/characterService'
        );

        const characterResult = await CharacterService.createCharacter(
          data.user.id,
          name.trim(),
          'male' // Default gender, can be changed later in profile
        );

        if (!characterResult.success) {
          console.error('Failed to create character:', characterResult.error);
          // Don't fail registration if character creation fails
          // User can create character later
        } else {
          console.log(
            'Character created successfully:',
            characterResult.character?.id
          );
        }
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('Email confirmation required for user:', data.user.id);
        return {
          success: true, // This is actually a success!
          error:
            'Please check your email and click the confirmation link to complete registration.',
        };
      }

      console.log('Registration successful for user:', data.user?.id);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      console.log('Attempting login with:', email.trim().toLowerCase());

      // Try to sign in with Supabase with error handling
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          console.error('Supabase login error:', error);
          return {
            success: false,
            error: error.message || 'Login failed. Please try again.',
          };
        }

        if (!data.session) {
          return {
            success: false,
            error: 'Login failed. No session returned.',
          };
        }

        // Login successful
        return { success: true };
      } catch (supabaseError: any) {
        console.error('Caught Supabase API error:', supabaseError);

        // Check for JSON parse error specifically
        if (supabaseError.message?.includes('JSON Parse error')) {
          return {
            success: false,
            error:
              'Connection issue with authentication server. Please try again later.',
          };
        }

        return {
          success: false,
          error:
            supabaseError.message || 'Login failed due to a network issue.',
        };
      }
    } catch (error: any) {
      console.error('General login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear any local character data first
      try {
        await AsyncStorage.removeItem('character_data');
        console.log('Character data cleared successfully');
      } catch (err) {
        console.log('Error clearing character data:', err);
        // Continue with logout even if this fails
      }

      // Clear session first to avoid potential race conditions
      setUser(null);
      setSession(null);

      // Use a try-catch block for the signOut operation
      try {
        console.log('Attempting to sign out from Supabase');
        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error('Supabase signOut error:', error);
          // We've already cleared local state, so just log the error
        } else {
          console.log('Supabase sign out successful');
        }
      } catch (signOutError) {
        console.error('Caught signOut error:', signOutError);
        // We've already cleared local state above
      }

      // Force clear any persisted session data just in case
      try {
        await AsyncStorage.removeItem('supabase.auth.token');
        console.log('Auth token cleared from storage');
      } catch (err) {
        console.error('Failed to clear auth token:', err);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: {
    name?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!session?.user) {
        return { success: false, error: 'No user session found' };
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          full_name: updates.name,
        },
      });

      if (error) {
        console.error('Profile update error:', error);
        return {
          success: false,
          error: error.message || 'Failed to update profile',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while updating profile',
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
