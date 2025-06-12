import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Dumbbell,
  Award,
  User,
  Plus,
} from 'lucide-react-native';
import { useColorScheme, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, getThemeColors } from '@/constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const insets = useSafeAreaInsets();

  // Calculate bottom padding for tab bar
  const tabBarHeight = 60;
  const bottomPadding =
    Platform.OS === 'android' ? Math.max(insets.bottom, 8) : 8;
  const totalTabBarHeight = tabBarHeight + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: totalTabBarHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
          // Ensure the tab bar stays above system navigation
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerStyle: {
          backgroundColor: theme.surface,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        // Add safe area to tab bar
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Dashboard',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/exercises')}
              style={{ marginRight: 16 }}
            >
              <Plus
                size={24}
                color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color, size }) => (
            <Dumbbell size={size} color={color} />
          ),
          headerTitle: 'Daily Quests',
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Badges',
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
          headerTitle: 'Your Achievements',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Your Profile',
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
