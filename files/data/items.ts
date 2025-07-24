import { allArmor } from './armor';
import { allWeapons } from './weapons';

export type ItemType = 'wearable' | 'consumable' | 'tool' | 'quest';

export type ItemStats = {
  hp?: number;
  hpPercent?: number;
  atk?: number;
  atkPercent?: number;
  def?: number;
  defPercent?: number;
  agility?: number;
  agilityPercent?: number;
  critChance?: number;
};
export type StatBoost = {
  stats: ItemStats;
  duration: number; // in steps
};

export type SlotKey =
  | 'helmet'
  | 'chest'
  | 'legs'
  | 'gloves'
  | 'boots'
  | 'ring'
  | 'amulet'
  | 'weapon'
  | 'off-hand'
  | 'potion'
  | 'food';

export type SkillToolKey = 'pickaxe' | 'axe' | 'sickle' | 'rod';

export type classLocked = 'druid' | 'ranger' | 'warrior' | 'wizard';

export type ItemClass =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'ranged'
  | 'ammo'
  | 'two-handed'
  | 'melee'
  | 'magic'
  | 'focus'
  | 'shield';

export interface Item {
  key: string;
  name: string;
  setId?: string; // for equipped sets of armor + weapon to be identified
  description?: string;
  itemClass?: ItemClass;
  icon: any;
  equipLocation?: SlotKey | SkillToolKey;
  classLocked?: classLocked[];
  levelLocked?: number;
  type: ItemType;
  stats?: ItemStats; // for wearable
  statBoost?: StatBoost; // for consumable
  price?: number;
}

// TOOLS
type ToolKey =
  | 'copper_pickaxe'
  | 'copper_axe'
  | 'copper_sickle'
  | 'copper_rod'
  | 'iron_pickaxe'
  | 'iron_axe'
  | 'iron_sickle'
  | 'iron_rod'
  | 'silver_pickaxe'
  | 'silver_axe'
  | 'silver_sickle'
  | 'silver_rod'
  | 'gold_pickaxe'
  | 'gold_axe'
  | 'gold_sickle'
  | 'gold_rod'
  | 'blue_pickaxe'
  | 'blue_axe'
  | 'blue_sickle'
  | 'blue_rod'
  | 'red_pickaxe'
  | 'red_axe'
  | 'red_sickle'
  | 'red_rod';

export const tools: Record<ToolKey, Item> = {
  copper_pickaxe: {
    key: 'copper_pickaxe',
    name: 'Copper Pickaxe',
    icon: require('../assets/resources/smithing/copper_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 1094,
  },
  copper_axe: {
    key: 'copper_axe',
    name: 'Copper Axe',
    icon: require('../assets/resources/smithing/copper_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 1094,
  },
  copper_sickle: {
    key: 'copper_sickle',
    name: 'Copper Sickle',
    icon: require('../assets/resources/smithing/copper_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 1094,
  },
  copper_rod: {
    key: 'copper_rod',
    name: 'Copper Rod',
    icon: require('../assets/resources/smithing/copper_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 1094,
  },
  iron_pickaxe: {
    key: 'iron_pickaxe',
    name: 'Iron Pickaxe',
    icon: require('../assets/resources/smithing/iron_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 1878,
  },
  iron_axe: {
    key: 'iron_axe',
    name: 'Iron Axe',
    icon: require('../assets/resources/smithing/iron_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 1878,
  },
  iron_sickle: {
    key: 'iron_sickle',
    name: 'Iron Sickle',
    icon: require('../assets/resources/smithing/iron_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 1878,
  },
  iron_rod: {
    key: 'iron_rod',
    name: 'Iron Rod',
    icon: require('../assets/resources/smithing/iron_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 1878,
  },
  silver_pickaxe: {
    key: 'silver_pickaxe',
    name: 'Silver Pickaxe',
    icon: require('../assets/resources/smithing/silver_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 5833,
  },
  silver_axe: {
    key: 'silver_axe',
    name: 'Silver Axe',
    icon: require('../assets/resources/smithing/silver_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 5833,
  },
  silver_sickle: {
    key: 'silver_sickle',
    name: 'Silver Sickle',
    icon: require('../assets/resources/smithing/silver_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 5833,
  },
  silver_rod: {
    key: 'silver_rod',
    name: 'Silver Rod',
    icon: require('../assets/resources/smithing/silver_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 5833,
  },
  gold_pickaxe: {
    key: 'gold_pickaxe',
    name: 'Gold Pickaxe',
    icon: require('../assets/resources/smithing/gold_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 11768,
  },
  gold_axe: {
    key: 'gold_axe',
    name: 'Gold Axe',
    icon: require('../assets/resources/smithing/gold_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 11768,
  },
  gold_sickle: {
    key: 'gold_sickle',
    name: 'Gold Sickle',
    icon: require('../assets/resources/smithing/gold_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 11768,
  },
  gold_rod: {
    key: 'gold_rod',
    name: 'Gold Rod',
    icon: require('../assets/resources/smithing/gold_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 11768,
  },
  blue_pickaxe: {
    key: 'blue_pickaxe',
    name: 'Blue Pickaxe',
    icon: require('../assets/resources/smithing/blue_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 35206,
  },
  blue_axe: {
    key: 'blue_axe',
    name: 'Blue Axe',
    icon: require('../assets/resources/smithing/blue_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 35206,
  },
  blue_sickle: {
    key: 'blue_sickle',
    name: 'Blue Sickle',
    icon: require('../assets/resources/smithing/blue_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 35206,
  },
  blue_rod: {
    key: 'blue_rod',
    name: 'Blue Rod',
    icon: require('../assets/resources/smithing/blue_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 35206,
  },
  red_pickaxe: {
    key: 'red_pickaxe',
    name: 'Red Pickaxe',
    icon: require('../assets/resources/smithing/red_pickaxe.png'),
    type: 'tool',
    equipLocation: 'pickaxe',
    price: 42556,
  },
  red_axe: {
    key: 'red_axe',
    name: 'Red Axe',
    icon: require('../assets/resources/smithing/red_axe.png'),
    type: 'tool',
    equipLocation: 'axe',
    price: 42556,
  },
  red_sickle: {
    key: 'red_sickle',
    name: 'Red Sickle',
    icon: require('../assets/resources/smithing/red_sickle.png'),
    type: 'tool',
    equipLocation: 'sickle',
    price: 42556,
  },
  red_rod: {
    key: 'red_rod',
    name: 'Red Rod',
    icon: require('../assets/resources/smithing/red_rod.png'),
    type: 'tool',
    equipLocation: 'rod',
    price: 42556,
  },
};

type FoodKey =
  | 'mushroom_skewer'
  | 'cooked_bird'
  | 'drumstick'
  | 'fish_soup'
  | 'fried_egg'
  | 'bread'
  | 'calamari'
  | 'cooked_crab'
  | 'cooked_lobster'
  | 'cooked_shrimp'
  | 'cookie'
  | 'sashimi'
  | 'sushi'
  | 'shucked_oyster'
  | 'salmowich'
  | 'pizza_slice'
  | 'donut'
  | 'grey_fish'
  | 'blue_fish'
  | 'onion_soup'
  | 'bacon'
  | 'breakfast'
  | 'hamburger'
  | 'hot_dog'
  | 'berry_pie'
  | 'dinner'
  | 'crimson_fruit_salad'
  | 'chocolate'
  | 'chocolate_cake'
  | 'french_fries'
  | 'lemon_pie'
  | 'omelette'
  | 'spaghetti'
  | 'strawberry_cake'
  | 'garlic_bread'
  | 'popcorn'
  | 'salad'
  | 'taco';

// FOOD
export const food: Record<FoodKey, Item> = {
  mushroom_skewer: {
    key: 'mushroom_skewer',
    name: 'Mushroom Skewer',
    description: 'Heals 25 HP over 100 steps',
    icon: require('../assets/resources/cooking/mushroom_skewer.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 25 }, duration: 100 },
    price: 56,
  },
  cooked_bird: {
    key: 'cooked_bird',
    name: 'Cooked Bird',
    description: 'Heals 20 HP over 100 steps',
    icon: require('../assets/resources/cooking/cooked_bird.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 20 }, duration: 100 },
    price: 35,
  },
  drumstick: {
    key: 'drumstick',
    name: 'Drumstick',
    description: 'Heals 20 HP over 100 steps',
    icon: require('../assets/resources/cooking/drumstick.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 20 }, duration: 100 },
    price: 70,
  },
  fish_soup: {
    key: 'fish_soup',
    name: 'Fish Soup',
    description: 'Heals 10 HP over 50 steps',
    icon: require('../assets/resources/cooking/fish_soup.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 10 }, duration: 50 },
    price: 5,
  },
  fried_egg: {
    key: 'fried_egg',
    name: 'Fried Egg',
    description: 'Heals 30 HP over 120 steps',
    icon: require('../assets/resources/cooking/fried_egg.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 30 }, duration: 120 },
    price: 99,
  },
  bread: {
    key: 'bread',
    name: 'Bread',
    description: 'Heals 25 HP over 80 steps',
    icon: require('../assets/resources/cooking/bread.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 25 }, duration: 80 },
    price: 53,
  },
  calamari: {
    key: 'calamari',
    name: 'Calamari',
    description: 'Heals 20 HP over 100 steps',
    icon: require('../assets/resources/cooking/calamari.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 20 }, duration: 100 },
    price: 158,
  },
  cooked_crab: {
    key: 'cooked_crab',
    name: 'Cooked Crab',
    description: 'Heals 35 HP over 60 steps',
    icon: require('../assets/resources/cooking/cooked_crab.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 35 }, duration: 60 },
    price: 33,
  },
  cooked_lobster: {
    key: 'cooked_lobster',
    name: 'Cooked Lobster',
    description: 'Heals 40 HP over 120 steps',
    icon: require('../assets/resources/cooking/cooked_lobster.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 40 }, duration: 120 },
    price: 158,
  },
  cooked_shrimp: {
    key: 'cooked_shrimp',
    name: 'Cooked Shrimp',
    description: 'Heals 10 HP over 50 steps',
    icon: require('../assets/resources/cooking/cooked_shrimp.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 10 }, duration: 50 },
    price: 5,
  },
  cookie: {
    key: 'cookie',
    name: 'Cookie',
    description: 'Heals 30 HP over 100 steps',
    icon: require('../assets/resources/cooking/cookie.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 30 }, duration: 100 },
    price: 52,
  },
  sashimi: {
    key: 'sashimi',
    name: 'Sashimi',
    description: 'Heals 25 HP over 100 steps',
    icon: require('../assets/resources/cooking/sashimi.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 25 }, duration: 100 },
    price: 5,
  },
  sushi: {
    key: 'sushi',
    name: 'Sushi',
    description: 'Heals 35 HP over 100 steps',
    icon: require('../assets/resources/cooking/sushi.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 35 }, duration: 100 },
    price: 24,
  },
  shucked_oyster: {
    key: 'shucked_oyster',
    name: 'Shucked Oyster',
    description: 'Heals 20 HP over 100 steps',
    icon: require('../assets/resources/cooking/shucked_oyster.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 20 }, duration: 100 },
    price: 15,
  },
  salmowich: {
    key: 'salmowich',
    name: 'Salmowich',
    description: 'Heals 45 HP over 100 steps',
    icon: require('../assets/resources/cooking/sandwich.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 45 }, duration: 100 },
    price: 63,
  },
  pizza_slice: {
    key: 'pizza_slice',
    name: 'Pizza Slice',
    description: 'Heals 70 HP over 100 steps',
    icon: require('../assets/resources/cooking/pizza_slice.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 70 }, duration: 200 },
    price: 170,
  },
  donut: {
    key: 'donut',
    name: 'Donut',
    description: 'Heals 9999 HP over 50 steps',
    icon: require('../assets/resources/cooking/donut.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 9999 }, duration: 50 },
    price: 2272,
  },
  grey_fish: {
    key: 'grey_fish',
    name: 'Grey Fish',
    description: 'Heals 50 HP over 200 steps',
    icon: require('../assets/resources/cooking/grey_fish.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 50 }, duration: 200 },
    price: 158,
  },
  blue_fish: {
    key: 'blue_fish',
    name: 'Blue Fish',
    description: 'Heals 90 HP over 200 steps',
    icon: require('../assets/resources/cooking/blue_fish.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 90 }, duration: 200 },
    price: 331,
  },
  onion_soup: {
    key: 'onion_soup',
    name: 'Onion Soup',
    description: 'Heals 60 HP over 180 steps',
    icon: require('../assets/resources/cooking/onion_soup.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 60 }, duration: 180 },
    price: 337,
  },
  bacon: {
    key: 'bacon',
    name: 'Bacon',
    description: 'Heals 40 HP over 100 steps',
    icon: require('../assets/resources/cooking/bacon.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 40 }, duration: 100 },
    price: 158,
  },
  breakfast: {
    key: 'breakfast',
    name: 'Breakfast',
    description: 'Heals 120 HP over 200 steps',
    icon: require('../assets/resources/cooking/breakfast.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 120 }, duration: 200 },
    price: 845,
  },
  hamburger: {
    key: 'hamburger',
    name: 'Bear Burger',
    description: 'Heals 250 HP over 500 steps',
    icon: require('../assets/resources/cooking/hamburger.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 250 }, duration: 500 },
    price: 1693,
  },
  hot_dog: {
    key: 'hot_dog',
    name: 'Hot Dog',
    description: 'Heals 60 HP over 200 steps',
    icon: require('../assets/resources/cooking/hotdog.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 60 }, duration: 200 },
    price: 384,
  },
  berry_pie: {
    key: 'berry_pie',
    name: 'Berry Pie',
    description: 'Heals 100 HP over 180 steps',
    icon: require('../assets/resources/cooking/berry_pie.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 100 }, duration: 180 },
    price: 535,
  },
  dinner: {
    key: 'dinner',
    name: 'Dinner',
    description: 'Heals 200 HP over 500 steps',
    icon: require('../assets/resources/cooking/dinner.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 200 }, duration: 500 },
    price: 1435,
  },
  crimson_fruit_salad: {
    key: 'crimson_fruit_salad',
    name: 'Crimson Fruit Salad',
    description: 'Heals 80 HP over 160 steps',
    icon: require('../assets/resources/cooking/crimson_fruit_salad.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 80 }, duration: 160 },
    price: 834,
  },
  chocolate: {
    key: 'chocolate',
    name: 'Chocolate',
    description: 'Heals 50 HP over 200 steps',
    icon: require('../assets/resources/cooking/chocolate.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 50 }, duration: 200 },
    price: 100,
  },
  chocolate_cake: {
    key: 'chocolate_cake',
    name: 'Chocolate Cake',
    description: 'Heals 150 HP over 250 steps',
    icon: require('../assets/resources/cooking/chocolate_cake.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 150 }, duration: 250 },
    price: 929,
  },
  french_fries: {
    key: 'french_fries',
    name: 'French Fries',
    description: 'Heals 40 HP over 150 steps',
    icon: require('../assets/resources/cooking/frenchfries.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 40 }, duration: 150 },
    price: 244,
  },
  lemon_pie: {
    key: 'lemon_pie',
    name: 'Lemon Pie',
    description: 'Heals 60 HP over 180 steps',
    icon: require('../assets/resources/cooking/lemonpie.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 60 }, duration: 180 },
    price: 321,
  },
  omelette: {
    key: 'omelette',
    name: 'Omelette',
    description: 'Heals 65 HP over 180 steps',
    icon: require('../assets/resources/cooking/omelette.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 65 }, duration: 180 },
    price: 382,
  },
  spaghetti: {
    key: 'spaghetti',
    name: 'Spaghetti',
    description: 'Heals 70 HP over 200 steps',
    icon: require('../assets/resources/cooking/spaghetti.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 70 }, duration: 200 },
    price: 196,
  },
  strawberry_cake: {
    key: 'strawberry_cake',
    name: 'Strawberry Cake',
    description: 'Heals 90 HP over 250 steps',
    icon: require('../assets/resources/cooking/strawberrycake.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 90 }, duration: 250 },
    price: 531,
  },
  garlic_bread: {
    key: 'garlic_bread',
    name: 'Garlic Bread',
    description: 'Heals 30 HP over 120 steps',
    icon: require('../assets/resources/cooking/garlicbread.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 30 }, duration: 120 },
    price: 72,
  },
  popcorn: {
    key: 'popcorn',
    name: 'Popcorn',
    description: 'Heals 25 HP over 100 steps',
    icon: require('../assets/resources/cooking/popcorn.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 25 }, duration: 100 },
    price: 103,
  },
  salad: {
    key: 'salad',
    name: 'Salad',
    description: 'Heals 50 HP over 170 steps',
    icon: require('../assets/resources/cooking/salad.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 50 }, duration: 170 },
    price: 205,
  },
  taco: {
    key: 'taco',
    name: 'Taco',
    description: 'Heals 60 HP over 170 steps',
    icon: require('../assets/resources/cooking/taco.png'),
    type: 'consumable',
    equipLocation: 'food',
    statBoost: { stats: { hp: 60 }, duration: 170 },
    price: 318,
  },
};

// POTIONS
type PotionKey =
  | 'minor_healing_potion'
  | 'healing_potion'
  | 'greater_healing_potion'
  | 'minor_defense_potion'
  | 'defense_potion'
  | 'greater_defense_potion'
  | 'minor_attack_potion'
  | 'attack_potion'
  | 'greater_attack_potion'
  | 'minor_crit_chance_potion'
  | 'crit_chance_potion'
  | 'greater_crit_chance_potion';

export const potions: Record<PotionKey, Item> = {
  minor_healing_potion: {
    key: 'minor_healing_potion',
    name: 'Minor Potion of Healing',
    description: 'Heals 50 HP over 250 steps',
    icon: require('../assets/resources/alchemy/minor_healing_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { hp: 50 }, duration: 250 },
    price: 15,
  },
  healing_potion: {
    key: 'healingpotion',
    name: 'Potion of Healing',
    description: 'Heals 200 HP over 500 steps',
    icon: require('../assets/resources/alchemy/healing_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { hp: 200 }, duration: 500 },
    price: 58,
  },
  greater_healing_potion: {
    key: 'greater_healing_potion',
    name: 'Greater Potion of Healing',
    description: 'Heals 800 HP over 1000 steps',
    icon: require('../assets/resources/alchemy/greater_healing_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { hp: 800 }, duration: 1000 },
    price: 208,
  },
  minor_defense_potion: {
    key: 'minor_defense_potion',
    name: 'Minor Potion of Defense',
    description: 'Increases defense by 5 for 250 steps',
    icon: require('../assets/resources/alchemy/minor_defense_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { def: 5 }, duration: 250 },
    price: 70,
  },
  defense_potion: {
    key: 'defensepotion',
    name: 'Potion of Defense',
    description: 'Increases defense by 10 for 500 steps',
    icon: require('../assets/resources/alchemy/defense_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { def: 10 }, duration: 500 },
    price: 213,
  },
  greater_defense_potion: {
    key: 'greater_defense_potion',
    name: 'Greater Potion of Defense',
    description: 'Increases defense by 20 for 1000 steps',
    icon: require('../assets/resources/alchemy/greater_defense_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { def: 20 }, duration: 1000 },
    price: 611,
  },
  minor_attack_potion: {
    key: 'minor_attack_potion',
    name: 'Minor Potion of Attack',
    description: 'Increases attack by 5 for 250 steps',
    icon: require('../assets/resources/alchemy/minor_attack_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { atk: 5 }, duration: 250 },
    price: 99,
  },
  attack_potion: {
    key: 'attackpotion',
    name: 'Potion of Attack',
    description: 'Increases attack by 10 for 500 steps',
    icon: require('../assets/resources/alchemy/attack_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { atk: 10 }, duration: 500 },
    price: 323,
  },
  greater_attack_potion: {
    key: 'greater_attack_potion',
    name: 'Greater Potion of Attack',
    description: 'Increases attack by 20 for 1000 steps',
    icon: require('../assets/resources/alchemy/greater_attack_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { atk: 20 }, duration: 1000 },
    price: 1011,
  },

  minor_crit_chance_potion: {
    key: 'minor_crit_chance_potion',
    name: 'Minor Potion of Luck',
    description: 'Increases Critical Chance by 5% for 250 steps',
    icon: require('../assets/resources/alchemy/minor_crit_chance_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { critChance: 0.05 }, duration: 250 },
    price: 219,
  },
  crit_chance_potion: {
    key: 'crit_chance_potion',
    name: 'Potion of Luck',
    description: 'Increases Critical Chance by 10% for 500 steps',
    icon: require('../assets/resources/alchemy/crit_chance_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { critChance: 0.1 }, duration: 500 },
    price: 696,
  },
  greater_crit_chance_potion: {
    key: 'greater_crit_chance_potion',
    name: 'Greater Potion of Luck',
    description: 'Increases Critical Chance by 20% for 1000 steps',
    icon: require('../assets/resources/alchemy/greater_attack_potion.png'),
    type: 'consumable',
    equipLocation: 'potion',
    statBoost: { stats: { critChance: 0.2 }, duration: 1000 },
    price: 1634,
  },
};

export type ConsumableKey = PotionKey | FoodKey;

// RINGS
type RingKey =
  | 'copper_band'
  | 'iron_ring'
  | 'silver_loop'
  | 'gold_band'
  | 'gilded_square'
  | 'steel_ring'
  | 'crimson_zigzag'
  | 'azure_band'
  | 'golden_vine'
  | 'flame_ring'
  | 'bone_ring'
  | 'emerald_band'
  | 'sunburst_ring'
  | 'natures_call'
  | 'crescent_ring'
  | 'shadow_band'
  | 'ruby_circle'
  | 'tidal_ring'
  | 'earth_guard'
  | 'molten_band'
  | 'blood_stone'
  | 'skull_ring'
  | 'fire_shard_ring'
  | 'silver_serpent'
  | 'ember_ring'
  | 'flame_guard'
  | 'crimson_shard'
  | 'ocean_ring'
  | 'golden_eye'
  | 'sunset_band'
  | 'frost_ring'
  | 'ice_crown'
  | 'sapphire_loop'
  | 'azure_guard'
  | 'golden_sigil'
  | 'frost_band'
  | 'crimson_arrow'
  | 'ice_shard'
  | 'natures_eye'
  | 'diamond_weave';

// RINGS
export const rings: Record<RingKey, Item> = {
  copper_band: {
    key: 'copper_band',
    name: 'Copper Band',
    icon: require('../assets/resources/trinketry/rings/copper_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 2, atk: 2, critChance: 0.01 },
    price: 425,
  },
  iron_ring: {
    key: 'iron_ring',
    name: 'Iron Ring',
    icon: require('../assets/resources/trinketry/rings/iron_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 4, def: 1, atk: 2, critChance: 0.01 },
    price: 1004,
  },
  silver_loop: {
    key: 'silver_loop',
    name: 'Silver Loop',
    icon: require('../assets/resources/trinketry/rings/silver_loop.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 8, def: 2, atk: 5, critChance: 0.02 },
    price: 2223,
  },
  gold_band: {
    key: 'gold_band',
    name: 'Gold Band',
    icon: require('../assets/resources/trinketry/rings/gold_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 15, def: 3, atk: 8, critChance: 0.03 },
    price: 4813,
  },
  gilded_square: {
    key: 'gilded_square',
    name: 'Gilded Square',
    icon: require('../assets/resources/trinketry/rings/gilded_square.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 18, atk: 12, critChance: 0.05 },
    price: 4813,
  },
  steel_ring: {
    key: 'steel_ring',
    name: 'Steel Ring',
    icon: require('../assets/resources/trinketry/rings/steel_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 8, def: 2, atk: 5, critChance: 0.02 },
    price: 1004,
  },
  crimson_zigzag: {
    key: 'crimson_zigzag',
    name: 'Crimson Zigzag',
    icon: require('../assets/resources/trinketry/rings/crimson_zigzag.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 65, atk: 40, def: 12, critChance: 0.08 },
    price: 21111,
  },
  azure_band: {
    key: 'azure_band',
    name: 'Azure Band',
    icon: require('../assets/resources/trinketry/rings/azure_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 40, atk: 25, def: 8, critChance: 0.06 },
    price: 10088,
  },
  golden_vine: {
    key: 'golden_vine',
    name: 'Golden Vine',
    icon: require('../assets/resources/trinketry/rings/golden_vine.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 18, atk: 6, def: 2, critChance: 0.03 },
    price: 4813,
  },
  flame_ring: {
    key: 'flame_ring',
    name: 'Flame Ring',
    icon: require('../assets/resources/trinketry/rings/flame_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 65, atk: 40, def: 12, critChance: 0.08 },
    price: 21111,
  },
  bone_ring: {
    key: 'bone_ring',
    name: 'Bone Ring',
    icon: require('../assets/resources/trinketry/rings/bone_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 4, atk: 3, critChance: 0.01 },
    price: 428,
  },
  emerald_band: {
    key: 'emerald_band',
    name: 'Emerald Band',
    icon: require('../assets/resources/trinketry/rings/emerald_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 25, atk: 15, def: 5, critChance: 0.04 },
    price: 2348,
  },
  sunburst_ring: {
    key: 'sunburst_ring',
    name: 'Sunburst Ring',
    icon: require('../assets/resources/trinketry/rings/sunburst_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 15, atk: 4, def: 8, critChance: 0.01 },
    price: 4813,
  },
  natures_call: {
    key: 'natures_call',
    name: "Nature's Call",
    icon: require('../assets/resources/trinketry/rings/natures_call.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 18, atk: 6, def: 2, critChance: 0.03 },
    price: 2263,
  },
  crescent_ring: {
    key: 'crescent_ring',
    name: 'Crescent Ring',
    icon: require('../assets/resources/trinketry/rings/crescent_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 15, atk: 8, def: 3, critChance: 0.03 },
    price: 4813,
  },
  shadow_band: {
    key: 'shadow_band',
    name: 'Shadow Band',
    icon: require('../assets/resources/trinketry/rings/shadow_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 5, atk: 1, def: 3, critChance: 0.01 },
    price: 1004,
  },
  ruby_circle: {
    key: 'ruby_circle',
    name: 'Ruby Circle',
    icon: require('../assets/resources/trinketry/rings/ruby_circle.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 10, atk: 12, critChance: 0.05 },
    price: 4813,
  },
  tidal_ring: {
    key: 'tidal_ring',
    name: 'Tidal Ring',
    icon: require('../assets/resources/trinketry/rings/tidal_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 6, atk: 3, critChance: 0.05 },
    price: 2204,
  },
  earth_guard: {
    key: 'earth_guard',
    name: 'Earth Guard',
    icon: require('../assets/resources/trinketry/rings/earth_guard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 20, atk: 5, def: 5, critChance: 0.02 },
    price: 4813,
  },
  molten_band: {
    key: 'molten_band',
    name: 'Molten Band',
    icon: require('../assets/resources/trinketry/rings/molten_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 80, atk: 25, def: 20, critChance: 0.08 },
    price: 21111,
  },
  blood_stone: {
    key: 'blood_stone',
    name: 'Blood Stone',
    icon: require('../assets/resources/trinketry/rings/blood_stone.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 12, atk: 6, def: 1, critChance: 0.02 },
    price: 2223,
  },
  skull_ring: {
    key: 'skull_ring',
    name: 'Skull Ring',
    icon: require('../assets/resources/trinketry/rings/skull_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 10, atk: 6, critChance: 0.03 },
    price: 2223,
  },
  fire_shard_ring: {
    key: 'fire_shard_ring',
    name: 'Fire Shard Ring',
    icon: require('../assets/resources/trinketry/rings/fire_shard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 25, atk: 15, def: 5, critChance: 0.04 },
    price: 1023,
  },
  silver_serpent: {
    key: 'silver_serpent',
    name: 'Silver Serpent',
    icon: require('../assets/resources/trinketry/rings/silver_serpent.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 8, atk: 3, def: 5, critChance: 0.01 },
    price: 2263,
  },
  ember_ring: {
    key: 'ember_ring',
    name: 'Ember Ring',
    icon: require('../assets/resources/trinketry/rings/ember_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { atk: 4 },
    price: 4813,
  },
  flame_guard: {
    key: 'flame_guard',
    name: 'Flame Guard',
    icon: require('../assets/resources/trinketry/rings/flame_guard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 8, atk: 4, def: 5, critChance: 0.01 },
    price: 1023,
  },
  crimson_shard: {
    key: 'crimson_shard',
    name: 'Crimson Shard',
    icon: require('../assets/resources/trinketry/rings/crimson_shard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 55, atk: 48, def: 8, critChance: 0.1 },
    price: 21111,
  },
  ocean_ring: {
    key: 'ocean_ring',
    name: 'Ocean Ring',
    icon: require('../assets/resources/trinketry/rings/ocean_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 15, atk: 22, critChance: 0.07 },
    price: 10088,
  },
  golden_eye: {
    key: 'golden_eye',
    name: 'Golden Eye',
    icon: require('../assets/resources/trinketry/rings/golden_eye.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 13, atk: 12, critChance: 0.05 },
    price: 4813,
  },
  sunset_band: {
    key: 'sunset_band',
    name: 'Sunset Band',
    icon: require('../assets/resources/trinketry/rings/sunset_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 15, atk: 6, def: 2, critChance: 0.05 },
    price: 4813,
  },
  frost_ring: {
    key: 'frost_ring',
    name: 'Frost Ring',
    icon: require('../assets/resources/trinketry/rings/frost_ring.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 5, atk: 8, critChance: 0.04 },
    price: 2223,
  },
  ice_crown: {
    key: 'ice_crown',
    name: 'Ice Crown',
    icon: require('../assets/resources/trinketry/rings/ice_crown.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 10, atk: 4, critChance: 0.05 },
    price: 2223,
  },
  sapphire_loop: {
    key: 'sapphire_loop',
    name: 'Sapphire Loop',
    icon: require('../assets/resources/trinketry/rings/sapphire_loop.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 8, atk: 3, def: 5, critChance: 0.01 },
    price: 2223,
  },
  azure_guard: {
    key: 'azure_guard',
    name: 'Azure Guard',
    icon: require('../assets/resources/trinketry/rings/azure_guard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 30, atk: 12, def: 6, critChance: 0.03 },
    price: 10088,
  },
  golden_sigil: {
    key: 'golden_sigil',
    name: 'Golden Sigil',
    icon: require('../assets/resources/trinketry/rings/golden_sigil.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 13, atk: 9, def: 3, critChance: 0.03 },
    price: 4813,
  },
  frost_band: {
    key: 'frost_band',
    name: 'Frost Band',
    icon: require('../assets/resources/trinketry/rings/frost_band.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 12, atk: 5, critChance: 0.03 },
    price: 252,
  },
  crimson_arrow: {
    key: 'crimson_arrow',
    name: 'Crimson Arrow',
    icon: require('../assets/resources/trinketry/rings/crimson_arrow.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 50, atk: 15, def: 15, critChance: 0.03 },
    price: 20761,
  },
  ice_shard: {
    key: 'ice_shard',
    name: 'Ice Shard',
    icon: require('../assets/resources/trinketry/rings/ice_shard.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 28, atk: 11, def: 6, critChance: 0.05 },
    price: 10088,
  },
  natures_eye: {
    key: 'natures_eye',
    name: "Nature's Eye",
    icon: require('../assets/resources/trinketry/rings/natures_eye.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 20, atk: 5, def: 5, critChance: 0.02 },
    price: 4813,
  },
  diamond_weave: {
    key: 'diamond_weave',
    name: 'Diamond Weave',
    icon: require('../assets/resources/trinketry/rings/diamond_weave.png'),
    type: 'wearable',
    equipLocation: 'ring',
    stats: { hp: 35, atk: 8, def: 10, critChance: 0.02 },
    price: 10088,
  },
};

type AmuletKey =
  | 'bone_crescent'
  | 'iron_spiral'
  | 'silver_charm'
  | 'steel_pendant'
  | 'golden_shield'
  | 'chain_link'
  | 'flame_wing'
  | 'tidal_charm'
  | 'nature_star'
  | 'fire_blade'
  | 'verdant_pendant'
  | 'solar_disk'
  | 'golden_dagger'
  | 'silver_cross'
  | 'amber_leaf'
  | 'emerald_eye'
  | 'dragon_wing'
  | 'lightning_bolt'
  | 'earth_crown'
  | 'crimson_disk'
  | 'fire_shard_amulet'
  | 'sun_medallion'
  | 'molten_drop'
  | 'bone_cross'
  | 'autumn_leaf'
  | 'ruby_orb'
  | 'flame_skull'
  | 'silver_star'
  | 'golden_bloom'
  | 'ember_disk'
  | 'frost_pendant'
  | 'moon_disk'
  | 'tidal_blade'
  | 'azure_cross'
  | 'ocean_orbs'
  | 'sapphire_square'
  | 'solar_flare'
  | 'ice_star'
  | 'nature_shield'
  | 'crimson_star';

export const amulets: Record<AmuletKey, Item> = {
  bone_crescent: {
    key: 'bone_crescent',
    name: 'Bone Crescent',
    icon: require('../assets/resources/trinketry/amulets/bone_crescent.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 3, atk: 2, def: 1, critChance: 0.02 },
    price: 500,
  },
  iron_spiral: {
    key: 'iron_spiral',
    name: 'Iron Spiral',
    icon: require('../assets/resources/trinketry/amulets/iron_spiral.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 8, atk: 5, def: 2, critChance: 0.02 },
    price: 1023,
  },
  silver_charm: {
    key: 'silver_charm',
    name: 'Silver Charm',
    icon: require('../assets/resources/trinketry/amulets/silver_charm.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 20, atk: 10, def: 2, critChance: 0.04 },
    price: 2263,
  },
  steel_pendant: {
    key: 'steel_pendant',
    name: 'Steel Pendant',
    icon: require('../assets/resources/trinketry/amulets/steel_pendant.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 15, atk: 8, def: 4, critChance: 0.03 },
    price: 1023,
  },
  golden_shield: {
    key: 'golden_shield',
    name: 'Golden Shield',
    icon: require('../assets/resources/trinketry/amulets/golden_shield.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 65, atk: 36, def: 10, critChance: 0.07 },
    price: 4898,
  },
  chain_link: {
    key: 'chain_link',
    name: 'Chain Link',
    icon: require('../assets/resources/trinketry/amulets/chain_link.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 35, atk: 15, def: 8, critChance: 0.04 },
    price: 2263,
  },
  flame_wing: {
    key: 'flame_wing',
    name: 'Flame Wing',
    icon: require('../assets/resources/trinketry/amulets/flame_wing.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 160, atk: 92, def: 10, critChance: 0.1 },
    price: 21111,
  },
  tidal_charm: {
    key: 'tidal_charm',
    name: 'Tidal Charm',
    icon: require('../assets/resources/trinketry/amulets/tidal_charm.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 110, atk: 58, def: 10, critChance: 0.08 },
    price: 10261,
  },
  nature_star: {
    key: 'nature_star',
    name: 'Nature Star',
    icon: require('../assets/resources/trinketry/amulets/nature_star.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 45, atk: 40, def: 5, critChance: 0.08 },
    price: 4898,
  },
  fire_blade: {
    key: 'fire_blade',
    name: 'Fire Blade',
    icon: require('../assets/resources/trinketry/amulets/fire_blade.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 120, atk: 105, def: 5, critChance: 0.12 },
    price: 21111,
  },
  verdant_pendant: {
    key: 'verdant_pendant',
    name: 'Verdant Pendant',
    icon: require('../assets/resources/trinketry/amulets/verdant_pendant.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 30, atk: 18, def: 3, critChance: 0.06 },
    price: 2263,
  },
  solar_disk: {
    key: 'solar_disk',
    name: 'Solar Disk',
    icon: require('../assets/resources/trinketry/amulets/solar_disk.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 55, atk: 30, def: 15, critChance: 0.05 },
    price: 4898,
  },
  golden_dagger: {
    key: 'golden_dagger',
    name: 'Golden Dagger',
    icon: require('../assets/resources/trinketry/amulets/golden_dagger.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 35, atk: 50, def: 5, critChance: 0.08 },
    price: 4898,
  },
  silver_cross: {
    key: 'silver_cross',
    name: 'Silver Cross',
    icon: require('../assets/resources/trinketry/amulets/silver_cross.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 28, atk: 20, def: 3, critChance: 0.06 },
    price: 2263,
  },
  amber_leaf: {
    key: 'amber_leaf',
    name: 'Amber Leaf',
    icon: require('../assets/resources/trinketry/amulets/amber_leaf.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 53, atk: 32, def: 15, critChance: 0.04 },
    price: 4898,
  },
  emerald_eye: {
    key: 'emerald_eye',
    name: 'Emerald Eye',
    icon: require('../assets/resources/trinketry/amulets/emerald_eye.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 80, atk: 67, def: 5, critChance: 0.11 },
    price: 2521,
  },
  dragon_wing: {
    key: 'dragon_wing',
    name: 'Dragon Wing',
    icon: require('../assets/resources/trinketry/amulets/dragon_wing.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 160, atk: 92, def: 10, critChance: 0.12 },
    price: 21111,
  },
  lightning_bolt: {
    key: 'lightning_bolt',
    name: 'Lightning Bolt',
    icon: require('../assets/resources/trinketry/amulets/lightning_bolt.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 55, atk: 35, def: 10, critChance: 0.05 },
    price: 4898,
  },
  earth_crown: {
    key: 'earth_crown',
    name: 'Earth Crown',
    icon: require('../assets/resources/trinketry/amulets/earth_crown.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 47, atk: 33, def: 17, critChance: 0.05 },
    price: 4898,
  },
  crimson_disk: {
    key: 'crimson_disk',
    name: 'Crimson Disk',
    icon: require('../assets/resources/trinketry/amulets/crimson_disk.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 160, atk: 92, def: 10, critChance: 0.1 },
    price: 21111,
  },
  fire_shard_amulet: {
    key: 'fire_shard_amulet',
    name: 'Fire Shard Amulet',
    icon: require('../assets/resources/trinketry/amulets/fire_shard.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 157, atk: 87, def: 10, critChance: 0.12 },
    price: 1023,
  },
  sun_medallion: {
    key: 'sun_medallion',
    name: 'Sun Medallion',
    icon: require('../assets/resources/trinketry/amulets/sun_medallion.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 55, atk: 30, def: 15, critChance: 0.05 },
    price: 4898,
  },
  molten_drop: {
    key: 'molten_drop',
    name: 'Molten Drop',
    icon: require('../assets/resources/trinketry/amulets/molten_drop.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 130, atk: 82, def: 25, critChance: 0.09 },
    price: 21111,
  },
  bone_cross: {
    key: 'bone_cross',
    name: 'Bone Cross',
    icon: require('../assets/resources/trinketry/amulets/bone_cross.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 39, atk: 20, def: 5, critChance: 0.05 },
    price: 2263,
  },
  autumn_leaf: {
    key: 'autumn_leaf',
    name: 'Autumn Leaf',
    icon: require('../assets/resources/trinketry/amulets/autumn_leaf.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 60, atk: 38, def: 8, critChance: 0.08 },
    price: 4898,
  },
  ruby_orb: {
    key: 'ruby_orb',
    name: 'Ruby Orb',
    icon: require('../assets/resources/trinketry/amulets/ruby_orb.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 62, atk: 35, def: 10, critChance: 0.07 },
    price: 4898,
  },
  flame_skull: {
    key: 'flame_skull',
    name: 'Flame Skull',
    icon: require('../assets/resources/trinketry/amulets/flame_skull.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 66, atk: 41, def: 8, critChance: 0.08 },
    price: 20588,
  },
  silver_star: {
    key: 'silver_star',
    name: 'Silver Star',
    icon: require('../assets/resources/trinketry/amulets/silver_star.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 32, atk: 22, def: 3, critChance: 0.06 },
    price: 2263,
  },
  golden_bloom: {
    key: 'golden_bloom',
    name: 'Golden Bloom',
    icon: require('../assets/resources/trinketry/amulets/golden_bloom.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 65, atk: 25, def: 15, critChance: 0.05 },
    price: 4898,
  },
  ember_disk: {
    key: 'ember_disk',
    name: 'Ember Disk',
    icon: require('../assets/resources/trinketry/amulets/ember_disk.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 105, atk: 105, def: 5, critChance: 0.15 },
    price: 21111,
  },
  frost_pendant: {
    key: 'frost_pendant',
    name: 'Frost Pendant',
    icon: require('../assets/resources/trinketry/amulets/frost_pendant.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 110, atk: 58, def: 10, critChance: 0.08 },
    price: 10261,
  },
  moon_disk: {
    key: 'moon_disk',
    name: 'Moon Disk',
    icon: require('../assets/resources/trinketry/amulets/moon_disk.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 95, atk: 50, def: 18, critChance: 0.06 },
    price: 2521,
  },
  tidal_blade: {
    key: 'tidal_blade',
    name: 'Tidal Blade',
    icon: require('../assets/resources/trinketry/amulets/tidal_blade.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 80, atk: 65, def: 5, critChance: 0.1 },
    price: 10261,
  },
  azure_cross: {
    key: 'azure_cross',
    name: 'Azure Cross',
    icon: require('../assets/resources/trinketry/amulets/azure_cross.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 100, atk: 55, def: 12, critChance: 0.09 },
    price: 10261,
  },
  ocean_orbs: {
    key: 'ocean_orbs',
    name: 'Ocean Orbs',
    icon: require('../assets/resources/trinketry/amulets/ocean_orbs.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 85, atk: 60, def: 8, critChance: 0.08 },
    price: 10261,
  },
  sapphire_square: {
    key: 'sapphire_square',
    name: 'Sapphire Square',
    icon: require('../assets/resources/trinketry/amulets/sapphire_square.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 120, atk: 45, def: 15, critChance: 0.06 },
    price: 10261,
  },
  solar_flare: {
    key: 'solar_flare',
    name: 'Solar Flare',
    icon: require('../assets/resources/trinketry/amulets/solar_flare.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 155, atk: 110, def: 13, critChance: 0.15 },
    price: 21111,
  },
  ice_star: {
    key: 'ice_star',
    name: 'Ice Star',
    icon: require('../assets/resources/trinketry/amulets/ice_star.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 105, atk: 52, def: 14, critChance: 0.07 },
    price: 10261,
  },
  nature_shield: {
    key: 'nature_shield',
    name: 'Nature Shield',
    icon: require('../assets/resources/trinketry/amulets/nature_shield.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 50, atk: 35, def: 8, critChance: 0.09 },
    price: 4898,
  },
  crimson_star: {
    key: 'crimson_star',
    name: 'Crimson Star',
    icon: require('../assets/resources/trinketry/amulets/crimson_star.png'),
    type: 'wearable',
    equipLocation: 'amulet',
    stats: { hp: 145, atk: 120, def: 15, critChance: 0.15 },
    price: 21111,
  },
};

export type JamKey =
  | 'apple_jam'
  | 'apricot_jam'
  | 'banana_jam'
  | 'blueberry_jam'
  | 'cherry_jam'
  | 'chili_pepper_jam'
  | 'dragonfruit_jam'
  | 'grape_jam'
  | 'kiwi_jam'
  | 'lemon_jam'
  | 'orange_jam'
  | 'papaya_jam'
  | 'pear_jam'
  | 'pineapple_jam'
  | 'pomegranate_jam'
  | 'raspberry_jam'
  | 'strawberry_jam';

export const jams: Record<JamKey, Item> = {
  apple_jam: {
    key: 'apple_jam',
    name: 'Apple Jam',
    icon: require('../assets/resources/foraging/apple_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 30,
  },
  apricot_jam: {
    key: 'apricot_jam',
    name: 'Apricot Jam',
    icon: require('../assets/resources/foraging/apricot_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 1986,
  },
  banana_jam: {
    key: 'banana_jam',
    name: 'Banana Jam',
    icon: require('../assets/resources/foraging/banana_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 30,
  },
  blueberry_jam: {
    key: 'blueberry_jam',
    name: 'Blueberry Jam',
    icon: require('../assets/resources/foraging/blueberry_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 100,
  },
  cherry_jam: {
    key: 'cherry_jam',
    name: 'Cherry Jam',
    icon: require('../assets/resources/foraging/cherry_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 84,
  },
  chili_pepper_jam: {
    key: 'chili_pepper_jam',
    name: 'Chili Jam',
    icon: require('../assets/resources/foraging/chili_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 198,
  },
  dragonfruit_jam: {
    key: 'dragonfruit_jam',
    name: 'Dragonfruit Jam',
    icon: require('../assets/resources/foraging/dragonfruit_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 4086,
  },
  grape_jam: {
    key: 'grape_jam',
    name: 'Grape Jam',
    icon: require('../assets/resources/foraging/grape_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 84,
  },
  kiwi_jam: {
    key: 'kiwi_jam',
    name: 'Kiwi Jam',
    icon: require('../assets/resources/foraging/kiwi_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 948,
  },
  lemon_jam: {
    key: 'lemon_jam',
    name: 'Lemon Jam',
    icon: require('../assets/resources/foraging/lemon_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 198,
  },
  orange_jam: {
    key: 'orange_jam',
    name: 'Orange Jam',
    icon: require('../assets/resources/foraging/orange_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 4086,
  },
  papaya_jam: {
    key: 'papaya_jam',
    name: 'Papaya Jam',
    icon: require('../assets/resources/foraging/papaya_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 1986,
  },
  pear_jam: {
    key: 'pear_jam',
    name: 'Pear Jam',
    icon: require('../assets/resources/foraging/pear_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 84,
  },
  pineapple_jam: {
    key: 'pineapple_jam',
    name: 'Pineapple Jam',
    icon: require('../assets/resources/foraging/pineapple_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 438,
  },
  pomegranate_jam: {
    key: 'pomegranate_jam',
    name: 'Pomegranate Jam',
    icon: require('../assets/resources/foraging/pomegranate_jam.png'),
    type: 'consumable',
    equipLocation: 'food',
    price: 1986,
  },
  raspberry_jam: {
    key: 'raspberry_jam',
    name: 'Raspberry Jam',
    icon: require('../assets/resources/foraging/raspberry_jam.png'),
    type: 'consumable',
    price: 438,
  },
  strawberry_jam: {
    key: 'strawberry_jam',
    name: 'Strawberry Jam',
    icon: require('../assets/resources/foraging/strawberry_jam.png'),
    type: 'consumable',
    price: 948,
  },
};

export type QuestItemKey = 'moonstone_tablet';

export const questItems: Record<QuestItemKey, Item> = {
  moonstone_tablet: {
    key: 'moonstone_tablet',
    name: 'Moonstone Tablet',
    icon: require('../assets/quest_items/moonstone_tablet.png'),
    type: 'quest',
  },
};

type ItemKey = FoodKey | RingKey | AmuletKey | PotionKey | ToolKey | QuestItemKey | JamKey | string;

export const allItems: Record<ItemKey, Item> = {
  ...tools,
  ...food,
  ...rings,
  ...potions,
  ...amulets,
  ...allArmor,
  ...allWeapons,
  ...questItems,
  ...jams,
};

// Tool tier system for recipe requirements
export type ToolTier = 'copper' | 'iron' | 'silver' | 'gold' | 'blue' | 'red';

export const toolTiers: ToolTier[] = ['copper', 'iron', 'silver', 'gold', 'blue', 'red'];

// Map tool keys to their tiers
export const toolKeyToTier: Record<ToolKey, ToolTier> = {
  copper_pickaxe: 'copper',
  copper_axe: 'copper',
  copper_sickle: 'copper',
  copper_rod: 'copper',
  iron_pickaxe: 'iron',
  iron_axe: 'iron',
  iron_sickle: 'iron',
  iron_rod: 'iron',
  silver_pickaxe: 'silver',
  silver_axe: 'silver',
  silver_sickle: 'silver',
  silver_rod: 'silver',
  gold_pickaxe: 'gold',
  gold_axe: 'gold',
  gold_sickle: 'gold',
  gold_rod: 'gold',
  blue_pickaxe: 'blue',
  blue_axe: 'blue',
  blue_sickle: 'blue',
  blue_rod: 'blue',
  red_pickaxe: 'red',
  red_axe: 'red',
  red_sickle: 'red',
  red_rod: 'red',
};

// Check if an equipped tool meets the required tier
export const doesToolMeetRequirement = (
  equippedToolKey: string | null,
  requiredTier: ToolTier | undefined
): boolean => {
  if (!requiredTier) return true; // No tool requirement
  if (!equippedToolKey) return false;

  const equippedTier = toolKeyToTier[equippedToolKey as ToolKey];
  if (!equippedTier) return false;

  const equippedIndex = toolTiers.indexOf(equippedTier);
  const requiredIndex = toolTiers.indexOf(requiredTier);

  return equippedIndex >= requiredIndex;
};
