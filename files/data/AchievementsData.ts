export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'steps' | 'crafting' | 'quests' | 'combat' | 'exploration' | 'collection' | 'social';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  criteria: {
    metric: keyof AchievementMetrics;
    itemKey?: string;
    value: number;
  };
  title?: string;
}

export type StoredMetrics = {
  totalSteps?: number;
  maxDailySteps?: number;
  questsCompleted?: number;
  enemiesDefeated?: number;
  maxItemsInInventory?: number;
  crafted: Record<string, number>;
};

export type AchievementMetrics = StoredMetrics & {
  uniqueItemsCrafted?: number;
  combatLevel?: number;
  reputationLevel?: number;
};

export const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'completed' | 'completedAt'>[] = [
  // Steps Achievements
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Walk your first 10,000 steps',
    category: 'steps',
    icon: '👣',
    rarity: 'common',
    target: 10000,
    criteria: { metric: 'totalSteps', value: 10000 },
    title: 'One Small Step',
  },
  {
    id: 'daily_walker',
    name: 'Daily Walker',
    description: 'Walk 25,000 steps in a single day',
    category: 'steps',
    icon: '🚶',
    rarity: 'common',
    target: 25000,
    criteria: { metric: 'maxDailySteps', value: 25000 },
  },
  {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Walk 50,000 steps in a single day',
    category: 'steps',
    icon: '🏃',
    rarity: 'legendary',
    target: 50000,
    criteria: { metric: 'maxDailySteps', value: 50000 },
    title: 'Marathon Runner',
  },
  {
    id: 'lifetime_walker',
    name: 'Lifetime Walker',
    description: 'Walk 1,000,000 total steps',
    category: 'steps',
    icon: '🌍',
    rarity: 'epic',
    target: 1000000,
    criteria: { metric: 'totalSteps', value: 1000000 },
    title: 'World Walker',
  },

  // Crafting Achievements
  {
    id: 'first_craft',
    name: 'First Craft',
    description: 'Craft your first item',
    category: 'crafting',
    icon: '🔨',
    rarity: 'common',
    target: 1,
    criteria: { metric: 'crafted', value: 1 },
  },
  {
    id: 'master_crafter',
    name: 'Master Crafter',
    description: 'Craft 1000 items',
    category: 'crafting',
    icon: '⚒️',
    rarity: 'rare',
    target: 1000,
    criteria: { metric: 'crafted', value: 1000 },
  },
  {
    id: 'bread_master',
    name: 'Bread Master',
    description: 'Craft 50 bread',
    category: 'crafting',
    icon: '🍞',
    rarity: 'common',
    target: 50,
    criteria: { metric: 'crafted', itemKey: 'bread', value: 50 },
  },
  {
    id: 'fish_master',
    name: 'Fish Master',
    description: 'Catch 100 fish',
    category: 'crafting',
    icon: '🐟',
    rarity: 'rare',
    target: 100,
    criteria: { metric: 'crafted', itemKey: 'fish', value: 100 },
  },

  // Quest Achievements
  {
    id: 'first_quest',
    name: 'First Quest',
    description: 'Complete your first quest',
    category: 'quests',
    icon: '📜',
    rarity: 'common',
    target: 1,
    criteria: { metric: 'questsCompleted', value: 1 },
  },
  {
    id: 'quest_master',
    name: 'Quest Master',
    description: 'Complete 10 quests',
    category: 'quests',
    icon: '🏆',
    rarity: 'epic',
    target: 10,
    criteria: { metric: 'questsCompleted', value: 10 },
    title: 'Quest Master',
  },
  {
    id: 'elf_hero',
    name: 'Elf Hero',
    description: 'Complete the entire Elf race quest line',
    category: 'quests',
    icon: '🧝',
    rarity: 'legendary',
    target: 1,
    criteria: { metric: 'questsCompleted', value: 10 }, // Simplified: complete 10 quests
    title: 'Elf Hero',
  },

  // Combat Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    category: 'combat',
    icon: '⚔️',
    rarity: 'common',
    target: 1,
    criteria: { metric: 'enemiesDefeated', value: 1 },
  },
  {
    id: 'slime_slayer',
    name: 'Slime Slayer',
    description: 'Defeat 50 slimes',
    category: 'combat',
    icon: '🟢',
    rarity: 'rare',
    target: 50,
    criteria: { metric: 'enemiesDefeated', value: 50 },
  },
  {
    id: 'combat_master',
    name: 'Combat Master',
    description: 'Reach level 20 in Combat',
    category: 'combat',
    icon: '🗡️',
    rarity: 'epic',
    target: 20,
    criteria: { metric: 'combatLevel', value: 20 },
    title: 'Combat Master',
  },

  // Collection Achievements
  {
    id: 'collector',
    name: 'Collector',
    description: 'Collect 50 different items',
    category: 'collection',
    icon: '📦',
    rarity: 'rare',
    target: 50,
    criteria: { metric: 'uniqueItemsCrafted', value: 50 },
  },
  {
    id: 'hoarder',
    name: 'Hoarder',
    description: 'Have 100,000 total items in inventory',
    category: 'collection',
    icon: '🏰',
    rarity: 'epic',
    target: 100000,
    criteria: { metric: 'maxItemsInInventory', value: 100000 },
  },

  // Social/Reputation Achievements
  {
    id: 'respected',
    name: 'Respected',
    description: 'Reach level 10 in Reputation',
    category: 'social',
    icon: '🤝',
    rarity: 'rare',
    target: 10,
    criteria: { metric: 'reputationLevel', value: 10 },
  },
  {
    id: 'legendary_reputation',
    name: 'Legendary Reputation',
    description: 'Reach level 50 in Reputation',
    category: 'social',
    icon: '👑',
    rarity: 'legendary',
    target: 50,
    criteria: { metric: 'reputationLevel', value: 50 },
    title: 'Legendary',
  },
];

export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return '#9ca3af';
    case 'rare':
      return '#3b82f6';
    case 'epic':
      return '#8b5cf6';
    case 'legendary':
      return '#f59e0b';
    default:
      return '#9ca3af';
  }
};

export const getRarityName = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'Common';
    case 'rare':
      return 'Rare';
    case 'epic':
      return 'Epic';
    case 'legendary':
      return 'Legendary';
    default:
      return 'Common';
  }
};
