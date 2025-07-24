import { SkillKey } from './skills';

// Base Types
export type Race = 'orc' | 'elf' | 'human' | 'dwarf';
export type Class = 'warrior' | 'mage' | 'rogue' | 'priest' | 'ranger' | 'other';
export type QuestType = 'class' | 'race' | 'world' | 'main';

type ExactCoordinates = { type: 'exact'; x: number; y: number };
type BetweenCoordinates = { type: 'between'; start: { x: number; y: number }; end: { x: number; y: number } };
type Region = { type: 'region'; region: string };
export type QuestLocation = ExactCoordinates | BetweenCoordinates | Region;

export type QuestCompletionRequirement =
  | { type: 'location'; location: QuestLocation }
  | {
      type: 'item';
      location?: QuestLocation;
      items: { id: string; quantity: number }[];
    }
  | { type: 'kill'; enemyId: string; quantity: number }
  | { type: 'craft'; itemId: string; quantity: number }
  | { type: 'skill_level'; skill: SkillKey; level: number };

export interface QuestObjective {
  id: string;
  description: string;
  location?: string;
  group?: number;
  completionRequirements?: QuestCompletionRequirement[];
}

export interface QuestReward {
  skillXp?: { skill: string; amount: number }[];
  items?: {
    id: string;
    name: string;
    quantity?: number;
  }[];
  currency?: {
    type: 'gold';
    amount: number;
  }[];
  unlocks?: string[];
  reputation?: {
    faction: string;
    amount: number;
  }[];
}

export interface QuestRequirements {
  level?: number;
  race?: Race[];
  class?: Class[];
  completedQuests?: string[];
  reputation?: {
    faction: string;
    minimum: number;
  }[];
  items?: string[];
}

// Base Quest Interface
export interface BaseQuest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  reward: QuestReward;
  requirements?: QuestRequirements;

  // Quest flow
  nextQuestId?: string;
  isRepeatable?: boolean;
  cooldownHours?: number;

  // Narrative elements
  npc?: {
    id: string;
    name: string;
    location: string;
  };
}

// Specific Quest Types
export interface ClassQuest extends BaseQuest {
  type: 'class';
  class: Class;
}

export interface RaceQuest extends BaseQuest {
  type: 'race';
  race: Race;
}

export interface WorldQuest extends BaseQuest {
  type: 'world';
  region: string;
  faction?: string;
  isDaily?: boolean;
}

export interface MainQuest extends BaseQuest {
  type: 'main';
  chapter: number;
  act: number;
  isCriticalPath: boolean;
}

export type Quest = ClassQuest | RaceQuest | WorldQuest | MainQuest;

// Event System
export interface EventReward extends QuestReward {
  exclusiveItems?: {
    id: string;
    name: string;
  }[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'seasonal' | 'special' | 'community' | 'competitive';

  // Timing
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  // Event specifics
  quests: EventQuest[];
  globalObjective?: {
    description: string;
    currentProgress: number;
    targetProgress: number;
  };

  // Rewards
  participationReward?: EventReward;
  completionReward?: EventReward;
}

export interface EventQuest extends BaseQuest {
  eventId: string;
  isMainObjective: boolean;
  dailyLimit?: number;
}

// Quest Management
export interface QuestProgress {
  questId: string;
  startedAt: Date;
  completedAt?: Date;
  currentObjective: number;
  objectiveProgress: Map<string, any>;
  abandoned?: boolean;
}

export interface QuestChain {
  id: string;
  name: string;
  description: string;
  questIds: string[];
  requiredForMain?: boolean;
  reward?: QuestReward; // Bonus for completing entire chain
}

// Collections and Groupings
export interface QuestDatabase {
  classQuests: Map<Class, ClassQuest[]>;
  raceQuests: Map<Race, RaceQuest[]>;
  worldQuests: Map<string, WorldQuest[]>; // Keyed by region
  mainQuests: MainQuest[];
}

export interface EventDatabase {
  activeEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
}

// Helper Types for Quest Creation
export interface QuestTemplate {
  type: QuestType;
  baseRewards: QuestReward;
  environmentThemes: string[];
}

// Quest Availability
export interface QuestAvailability {
  questId: string;
  available: boolean;
  reasons?: string[];
  unlocksAt?: {
    level?: number;
    questCompletion?: string[];
    date?: Date;
  };
}

// Example Quest Factory Functions
export function createQuestId(type: QuestType, identifier: string, sequence: number): string {
  return `${type}-${identifier}-${sequence}`;
}
