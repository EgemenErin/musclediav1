import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useCharacter } from '@/hooks/useCharacter';
import { Zap, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { dailyQuests } from '@/data/quests';

export default function QuestsScreen() {
  const { character, completeQuest } = useCharacter();
  const colorScheme = useColorScheme();
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const bgColor = isDark ? '#111827' : '#F9FAFB';
  const cardBgColor = isDark ? '#1F2937' : '#FFFFFF';

  const handleCompleteQuest = (questId: string, xp: number) => {
    if (!completedQuestIds.includes(questId)) {
      completeQuest(questId, xp);
      setCompletedQuestIds([...completedQuestIds, questId]);
    }
  };

  const renderQuestItem = ({ item }) => {
    const isCompleted = completedQuestIds.includes(item.id);
    
    return (
      <View 
        style={[
          styles.questCard, 
          { backgroundColor: cardBgColor },
          isCompleted && styles.completedCard
        ]}
      >
        <View style={styles.questHeader}>
          <Text style={[styles.questTitle, { color: textColor }]}>
            {item.title}
          </Text>
          {isCompleted ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <View style={styles.xpBadge}>
              <Zap size={14} color="#FFFFFF" />
              <Text style={styles.xpText}>{item.xp} XP</Text>
            </View>
          )}
        </View>
        
        <Text 
          style={[
            styles.questDescription, 
            { color: isDark ? '#D1D5DB' : '#4B5563' }
          ]}
        >
          {item.description}
        </Text>
        
        <View style={styles.questFooter}>
          <View style={styles.timeInfo}>
            <Clock size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text 
              style={[
                styles.timeText, 
                { color: isDark ? '#9CA3AF' : '#6B7280' }
              ]}
            >
              {item.estimatedTime}
            </Text>
          </View>
          
          {!isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteQuest(item.id, item.xp)}
            >
              <Text style={styles.completeButtonText}>
                Complete
              </Text>
            </TouchableOpacity>
          )}
          
          {isCompleted && (
            <Text style={styles.completedText}>
              Completed
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.streakContainer}>
        <Text style={[styles.streakText, { color: textColor }]}>
          🔥 Current Streak: {character.streak} days
        </Text>
      </View>
      
      <FlatList
        data={dailyQuests}
        renderItem={renderQuestItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  streakContainer: {
    padding: 16,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  questCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.8,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  xpBadge: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  questDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#6D28D9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#10B981',
    fontWeight: 'bold',
  },
});