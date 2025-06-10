import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCharacter } from '@/hooks/useCharacter';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';
import ProgressBar from '@/components/ProgressBar';
import { Siren as Fire, Zap, Trophy, TrendingUp } from 'lucide-react-native';
import StatsCard from '@/components/StatsCard';
import { getGreeting } from '@/utils/helpers';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Colors, getThemeColors } from '@/constants/Colors';

export default function HomeScreen() {
  const { character, incrementXP } = useCharacter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const [greeting, setGreeting] = useState('');
  const { workouts } = useWorkouts();
  
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  // Helper to get start of week (Monday)
  function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const workoutsThisWeek = workouts.filter(w => {
    const workoutDate = new Date(w.timestamp);
    return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
  });

  const workoutsToShow = workouts;  //workoutsThisWeek; - to show only this week workouts; fix

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <LinearGradient
      colors={isDark ? [theme.background, theme.surface] : [theme.surface, theme.background]}
      style={styles.container}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.username, { color: theme.text }]}>
            {user?.name || character.name || 'Adventurer'}
          </Text>
        </View>

        <View style={[styles.characterSection, { backgroundColor: theme.surface }]}>
          <CharacterAvatar 
            level={character.level} 
            gender={character.gender} 
            streak={character.streak}
            size="large"
          />
          <View style={styles.levelInfo}>
            <Text style={[styles.levelText, { color: theme.text }]}>
              Level {character.level}
            </Text>
            <ProgressBar 
              progress={character.xp / character.xpToNextLevel} 
              color={Colors.primary}
            />
            <Text style={[styles.xpText, { color: theme.textSecondary }]}>
              {character.xp}/{character.xpToNextLevel} XP to Level {character.level + 1}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Your Stats
        </Text>

        <View style={styles.statsGrid}>
          <StatsCard 
            title="Streak"
            value={character.streak.toString()}
            icon={<Fire size={24} color="#F97316" />}
            accentColor="#F97316"
          />
          <StatsCard 
            title="Total XP"
            value={character.totalXP.toString()}
            icon={<Zap size={24} color="#0EA5E9" />}
            accentColor="#0EA5E9"
          />
          <StatsCard 
            title="Quests Done"
            value={character.questsCompleted.toString()}
            icon={<Trophy size={24} color="#10B981" />}
            accentColor="#10B981"
          />
          <StatsCard 
            title="Level Ups"
            value={character.level.toString()}
            icon={<TrendingUp size={24} color={Colors.primary} />}
            accentColor={Colors.primary}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Next Quest
        </Text>

        <TouchableOpacity 
          style={[styles.nextQuestCard, { backgroundColor: theme.surface }]}
          onPress={() => incrementXP(50)}
        >
          <View style={styles.questContent}>
            <Text style={[styles.questTitle, { color: theme.text }]}>
              Morning Workout Challenge
            </Text>
            <Text style={[styles.questDescription, { color: theme.textSecondary }]}>
              Complete 20 push-ups and 30 squats
            </Text>
            <View style={styles.questReward}>
              <Zap size={16} color="#0EA5E9" />
              <Text style={[styles.questRewardText, { color: theme.textSecondary }]}>
                +50 XP
              </Text>
            </View>
          </View>
          <View style={[styles.questButton, { backgroundColor: Colors.primary }]}>
            <Text style={styles.questButtonText}>Start</Text>
          </View>
        </TouchableOpacity>

        {/* Recent Workouts Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Workouts</Text>
        {workoutsToShow.length === 0 ? (
          <View style={[styles.noWorkoutsCard, { backgroundColor: theme.surface }]}> 
            <Text style={{ color: theme.text }}>No workouts so far. Add one from the Exercises tab!</Text>
          </View>
        ) : (
          workoutsToShow.slice(0, 5).map((workout, idx) => (
            <View key={workout.timestamp} style={[styles.workoutCard, { backgroundColor: theme.surface }]}> 
              <Text style={[styles.workoutName, { color: theme.text }]}>{workout.name}</Text>
              <Text style={[styles.workoutDetails, { color: theme.textSecondary }]}>Sets: {workout.sets}   Reps: {workout.reps}   Weight: {workout.weight} kg</Text>
              <Text style={[styles.workoutDate, { color: theme.textMuted }]}> 
                {new Date(workout.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  characterSection: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelInfo: {
    flex: 1,
    marginLeft: 16,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  xpText: {
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nextQuestCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questContent: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questRewardText: {
    fontSize: 14,
    marginLeft: 4,
  },
  questButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 16,
  },
  questButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  workoutCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noWorkoutsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});