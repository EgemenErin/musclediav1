import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useCharacter } from '@/hooks/useCharacter';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';
import SafeTabView from '@/components/SafeTabView';
import {
  User,
  CreditCard as Edit,
  Save,
  Dumbbell,
  Award,
  Ruler,
  Weight,
  LogOut,
  AlertCircle,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { character, isLoading, error, updateCharacter } = useCharacter();
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');

  // Update local state when character data changes
  useEffect(() => {
    if (character) {
      setName(character.name);
      setHeight(character.height?.toString() || '170');
      setWeight(character.weight?.toString() || '70');
      setGoal(character.goal || 'Get stronger');
    }
  }, [character]);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const bgColor = isDark ? '#111827' : '#F9FAFB';
  const cardBgColor = isDark ? '#1F2937' : '#FFFFFF';
  const inputBgColor = isDark ? '#374151' : '#F3F4F6';

  const handleSave = async () => {
    if (!character) return;

    await updateCharacter({
      name,
      height: parseInt(height),
      weight: parseInt(weight),
      goal,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <SafeTabView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6D28D9" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Loading profile...
          </Text>
        </View>
      </SafeTabView>
    );
  }

  if (error || !character) {
    return (
      <SafeTabView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.centerContent}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={[styles.errorText, { color: textColor }]}>
            {error || 'Failed to load profile'}
          </Text>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
            onPress={logout}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeTabView>
    );
  }

  return (
    <SafeTabView
      style={[styles.container, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.profileHeader, { backgroundColor: '#6D28D9' }]}>
        <View style={styles.avatarContainer}>
          <CharacterAvatar
            level={character.level}
            gender={character.gender}
            streak={character.streak}
            size="large"
          />
          {!isEditing ? (
            <Text style={styles.username}>{name}</Text>
          ) : (
            <TextInput
              style={[
                styles.input,
                styles.nameInput,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          )}
          <Text style={styles.levelText}>Level {character.level}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <Save size={20} color="#FFFFFF" />
          ) : (
            <Edit size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
          <Dumbbell size={24} color="#F97316" />
          <Text style={[styles.statValue, { color: textColor }]}>
            {character.quests_completed}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Workouts
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
          <Award size={24} color="#0EA5E9" />
          <Text style={[styles.statValue, { color: textColor }]}>
            {badges.filter((b) => b.isUnlocked).length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Badges
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.streakValue, { color: textColor }]}>
            🔥 {character.streak}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Day Streak
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Personal Info
      </Text>

      <View style={[styles.infoCard, { backgroundColor: cardBgColor }]}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <User size={20} color="#6D28D9" />
          </View>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Gender
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            {character.gender || 'Not set'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ruler size={20} color="#6D28D9" />
          </View>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Height
          </Text>
          {!isEditing ? (
            <Text style={[styles.infoValue, { color: textColor }]}>
              {height} cm
            </Text>
          ) : (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBgColor, color: textColor },
              ]}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="Height in cm"
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            />
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Weight size={20} color="#6D28D9" />
          </View>
          <Text
            style={[
              styles.infoLabel,
              { color: isDark ? '#D1D5DB' : '#6B7280' },
            ]}
          >
            Weight
          </Text>
          {!isEditing ? (
            <Text style={[styles.infoValue, { color: textColor }]}>
              {weight} kg
            </Text>
          ) : (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBgColor, color: textColor },
              ]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Weight in kg"
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            />
          )}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Fitness Goal
      </Text>

      <View style={[styles.goalCard, { backgroundColor: cardBgColor }]}>
        {!isEditing ? (
          <Text style={[styles.goalText, { color: textColor }]}>{goal}</Text>
        ) : (
          <TextInput
            style={[
              styles.goalInput,
              { backgroundColor: inputBgColor, color: textColor },
            ]}
            value={goal}
            onChangeText={setGoal}
            placeholder="What's your fitness goal?"
            placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            multiline
          />
        )}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
          onPress={logout}
        >
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <Text
          style={[styles.logoutHint, { color: isDark ? '#9CA3AF' : '#6B7280' }]}
        >
          Signed in as {user?.email}
        </Text>
      </View>
    </SafeTabView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  profileHeader: {
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  levelText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  infoCard: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(109, 40, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalText: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 100,
  },
  nameInput: {
    marginTop: 12,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    width: 200,
  },
  goalInput: {
    minHeight: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  logoutSection: {
    marginTop: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 200,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});

// Mock data for badges - will be replaced by the badges from the data folder
const badges = [
  { id: '1', isUnlocked: true },
  { id: '2', isUnlocked: false },
  { id: '3', isUnlocked: true },
];
