import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from './supabase-types';

const supabaseUrl = 'https://hsexhnekwofdwsqbiywl.supabase.co';

// Try multiple ways to get the Supabase key
const supabaseKey =
  process.env.SUPABASE_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  // Temporary fallback - replace with your actual key
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZXhobmVrd29mZHdzcWJpeXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzM5MDIsImV4cCI6MjA2NTMwOTkwMn0.eyhmhXaQE4g5kmR8NzmuASjLjK9CT0Rm8saGZ8X-vB8';

// For debugging
console.log('Initializing Supabase with URL:', supabaseUrl);
console.log('API key length:', supabaseKey?.length || 0);

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
    // Keep it simple for now
    flowType: 'implicit',
  },
  global: {
    headers: { 'x-app-version': '1.0.0' },
  },
  // Added realtime configuration to avoid websocket issues
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Verify setup
console.log('Supabase client initialized');

// Continuously refresh auth session in foreground
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

// Test connection
const testConnection = async () => {
  try {
    const { error } = await supabase.from('characters').select('count');
    if (error) {
      console.error('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (err) {
    console.error('Supabase connection test exception:', err);
  }
};

// Run test connection
testConnection();
