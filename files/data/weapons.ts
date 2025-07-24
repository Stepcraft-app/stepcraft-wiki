import { Item } from './items';

type StaffKey = 'tempest_staff';

export const staffs: Record<StaffKey, Item> = {
  tempest_staff: {
    key: 'tempest_staff',
    name: 'Staff of the Tempest',
    setId: 'tempest',
    description: "Carved from a tree struck by lightning, it channels the raw power of nature's wrath.",
    icon: require('../assets/resources/crafting/weapons/two-handed-staff/tempest_staff.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'two-handed',
    classLocked: ['druid'],
    levelLocked: 100,
    stats: {
      hp: 100,
      atk: 10,
      def: 10,
    },
  },
};

type SwordKey =
  | 'basic_sword'
  | 'copper_sword'
  | 'iron_sword'
  | 'silver_sword'
  | 'gold_sword'
  | 'blue_sword'
  | 'red_sword';

export const swords: Record<SwordKey, Item> = {
  basic_sword: {
    key: 'basic_sword',
    name: 'Basic Sword',
    setId: 'basic',
    description: 'A basic sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/basic_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 2,
      atk: 15,
      critChance: 0.01,
    },
    price: 35,
  },
  copper_sword: {
    key: 'copper_sword',
    name: 'Copper Sword',
    setId: 'copper',
    description: 'A copper sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/copper_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 5,
      atk: 25,
      critChance: 0.02,
    },
    price: 98,
  },
  iron_sword: {
    key: 'iron_sword',
    name: 'Iron Sword',
    setId: 'iron',
    description: 'An iron sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/iron_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 10,
      atk: 45,
      critChance: 0.03,
    },
    price: 231,
  },
  silver_sword: {
    key: 'silver_sword',
    name: 'Silver Sword',
    setId: 'silver',
    description: 'A silver sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/silver_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 15,
      atk: 75,
      critChance: 0.05,
    },
    price: 511,
  },
  gold_sword: {
    key: 'gold_sword',
    name: 'Gold Sword',
    setId: 'gold',
    description: 'A gold sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/gold_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 25,
      atk: 120,
      critChance: 0.07,
    },
    price: 1106,
  },
  blue_sword: {
    key: 'blue_sword',
    name: 'Blue Sword',
    setId: 'blue',
    description: 'A blue sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/blue_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 40,
      atk: 190,
      critChance: 0.1,
    },
    price: 2317,
  },
  red_sword: {
    key: 'red_sword',
    name: 'Red Sword',
    setId: 'red',
    description: 'A red sword for beginners.',
    icon: require('../assets/resources/crafting/weapons/swords/red_sword.png'),
    equipLocation: 'weapon',
    type: 'wearable',
    itemClass: 'melee',
    stats: {
      hp: 40,
      atk: 280,
      critChance: 0.15,
    },
    price: 4767,
  },
};

type ShieldKey =
  | 'basic_shield'
  | 'copper_shield'
  | 'iron_shield'
  | 'silver_shield'
  | 'gold_shield'
  | 'blue_shield'
  | 'red_shield';

export const shields: Record<ShieldKey, Item> = {
  basic_shield: {
    key: 'basic_shield',
    name: 'Basic Shield',
    setId: 'basic',
    description: 'A basic shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/basic_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 8,
      def: 5,
      atk: 1,
    },
    price: 65,
  },
  copper_shield: {
    key: 'copper_shield',
    name: 'Copper Shield',
    setId: 'copper',
    description: 'A copper shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/copper_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 15,
      def: 8,
      atk: 2,
    },
    price: 98,
  },
  iron_shield: {
    key: 'iron_shield',
    name: 'Iron Shield',
    setId: 'iron',
    description: 'An iron shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/iron_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 25,
      def: 15,
      atk: 3,
    },
    price: 231,
  },
  silver_shield: {
    key: 'silver_shield',
    name: 'Silver Shield',
    setId: 'silver',
    description: 'A silver shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/silver_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 40,
      def: 25,
      atk: 5,
    },
    price: 511,
  },
  gold_shield: {
    key: 'gold_shield',
    name: 'Gold Shield',
    setId: 'gold',
    description: 'A gold shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/gold_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 70,
      def: 35,
      atk: 8,
    },
    price: 1106,
  },
  blue_shield: {
    key: 'blue_shield',
    name: 'Blue Shield',
    setId: 'blue',
    description: 'A blue shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/blue_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 110,
      def: 55,
      atk: 12,
    },
    price: 2317,
  },
  red_shield: {
    key: 'red_shield',
    name: 'Red Shield',
    setId: 'red',
    description: 'A red shield for beginners.',
    icon: require('../assets/resources/crafting/weapons/shields/red_shield.png'),
    equipLocation: 'off-hand',
    type: 'wearable',
    itemClass: 'shield',
    stats: {
      hp: 170,
      def: 80,
      atk: 18,
    },
    price: 4767,
  },
};

type WeaponKey = StaffKey | SwordKey | ShieldKey;

export const allWeapons: Record<WeaponKey, Item> = {
  ...staffs,
  ...swords,
  ...shields,
};
