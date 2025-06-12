import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { CharacterProvider } from '@/hooks/useCharacter';
import { WorkoutsProvider } from '@/hooks/useWorkouts';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { CharacterService } from '@/services/characterService';

// Auth navigation component
function AuthNavigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[1] === 'onboarding';
    const inLoginOrRegister =
      segments[1] === 'login' || segments[1] === 'register';

    // Don't redirect if user is in login or registration screen
    if (!isAuthenticated && inLoginOrRegister) {
      return;
    }

    // If authenticated and in onboarding, let them complete it
    if (isAuthenticated && inOnboarding) {
      return;
    }

    if (isAuthenticated && !inTabsGroup && !inOnboarding) {
      // If authenticated and not in onboarding or tabs, go to tabs
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, router, isLoading]);

  return null;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WorkoutsProvider>
          <CharacterProvider>
            <AuthNavigation />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </CharacterProvider>
        </WorkoutsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
