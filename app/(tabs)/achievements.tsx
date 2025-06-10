import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  useColorScheme,
} from 'react-native';
import { useCharacter } from '@/hooks/useCharacter';
import { badges } from '@/data/badges';
import { Lock } from 'lucide-react-native';

export default function AchievementsScreen() {
  const { character } = useCharacter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const bgColor = isDark ? '#111827' : '#F9FAFB';
  const cardBgColor = isDark ? '#1F2937' : '#FFFFFF';

  // Determine which badges the user has earned
  const badgesWithStatus = badges.map(badge => {
    let isUnlocked = false;
    
    switch (badge.criteriaType) {
      case 'level':
        isUnlocked = character.level >= badge.criteriaValue;
        break;
      case 'streak':
        isUnlocked = character.streak >= badge.criteriaValue;
        break;
      case 'quests':
        isUnlocked = character.questsCompleted >= badge.criteriaValue;
        break;
      default:
        isUnlocked = false;
    }
    
    return {
      ...badge,
      isUnlocked
    };
  });

  const renderBadgeItem = ({ item }) => {
    return (
      <View style={[styles.badgeCard, { backgroundColor: cardBgColor }]}>
        <View style={styles.badgeImageContainer}>
          {item.isUnlocked ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.badgeImage} 
              resizeMode="contain"
            />
          ) : (
            <View style={styles.lockedBadge}>
              <Lock size={24} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
            </View>
          )}
        </View>
        
        <Text style={[styles.badgeName, { color: textColor }]}>
          {item.name}
        </Text>
        
        <Text 
          style={[
            styles.badgeDescription, 
            { color: isDark ? '#D1D5DB' : '#6B7280' }
          ]}
        >
          {item.isUnlocked ? item.description : item.unlockCriteria}
        </Text>
        
        {item.isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>Unlocked</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: textColor }]}>
          Badges Earned: {badgesWithStatus.filter(b => b.isUnlocked).length} / {badges.length}
        </Text>
      </View>
      
      <FlatList
        data={badgesWithStatus}
        renderItem={renderBadgeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  badgeCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    margin: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  badgeImage: {
    width: 60,
    height: 60,
  },
  lockedBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockedBadge: {
    backgroundColor: '#10B981',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  unlockedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});