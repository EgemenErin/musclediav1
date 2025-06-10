export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  estimatedTime: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
};

export const dailyQuests: Quest[] = [
  {
    id: 'quest1',
    title: 'Morning Warm-Up',
    description: 'Complete 20 jumping jacks and 10 pushups to kickstart your day.',
    xp: 50,
    estimatedTime: '5-10 min',
    type: 'daily',
    difficulty: 'easy',
  },
  {
    id: 'quest2',
    title: 'Lunch Break Stretching',
    description: 'Take a 5-minute stretching break to improve flexibility and reduce stress.',
    xp: 30,
    estimatedTime: '5 min',
    type: 'daily',
    difficulty: 'easy',
  },
  {
    id: 'quest3',
    title: 'Evening Strength Session',
    description: 'Complete 3 sets of 10 squats, 10 lunges, and 10 dumbbell curls.',
    xp: 80,
    estimatedTime: '15-20 min',
    type: 'daily',
    difficulty: 'medium',
  },
  {
    id: 'quest4',
    title: 'Cardio Challenge',
    description: 'Run, jog, or brisk walk for 20 minutes without stopping.',
    xp: 100,
    estimatedTime: '20 min',
    type: 'daily',
    difficulty: 'medium',
  },
  {
    id: 'quest5',
    title: 'Core Crusher',
    description: 'Complete 3 sets of 15 crunches, 30-second plank, and 10 leg raises.',
    xp: 70,
    estimatedTime: '10-15 min',
    type: 'daily',
    difficulty: 'medium',
  },
  {
    id: 'quest6',
    title: 'Hydration Hero',
    description: 'Drink at least 8 glasses of water throughout the day.',
    xp: 40,
    estimatedTime: 'All day',
    type: 'daily',
    difficulty: 'easy',
  },
];

export const weeklyQuests: Quest[] = [
  {
    id: 'weekly1',
    title: 'Distance Runner',
    description: 'Run a total of 10km over the course of the week.',
    xp: 200,
    estimatedTime: 'Weekly',
    type: 'weekly',
    difficulty: 'hard',
  },
  {
    id: 'weekly2',
    title: 'Strength Master',
    description: 'Complete 3 full strength training sessions this week.',
    xp: 250,
    estimatedTime: 'Weekly',
    type: 'weekly',
    difficulty: 'hard',
  },
  {
    id: 'weekly3',
    title: 'Consistency King',
    description: 'Complete at least one quest every day this week.',
    xp: 300,
    estimatedTime: 'Weekly',
    type: 'weekly',
    difficulty: 'medium',
  },
];

export const specialQuests: Quest[] = [
  {
    id: 'special1',
    title: 'Mountain Climber',
    description: 'Complete a hiking trail or climb stairs for a total of 100 floors.',
    xp: 350,
    estimatedTime: 'Special Event',
    type: 'special',
    difficulty: 'hard',
  },
  {
    id: 'special2',
    title: 'Marathon Milestone',
    description: 'Run a half-marathon (21km) in one session.',
    xp: 500,
    estimatedTime: 'Special Event',
    type: 'special',
    difficulty: 'hard',
  },
];