import {
  RaceQuest,
  ClassQuest,
  MainQuest,
  WorldQuest,
  Event,
  EventQuest,
  QuestDatabase,
  EventDatabase,
  createQuestId,
} from './quest-types';

// ==========================================
// ELF RACE QUEST LINE (5 Quests)
// ==========================================

const elfRaceQuests: RaceQuest[] = [
  {
    id: createQuestId('race', 'elf', 1),
    type: 'race',
    race: 'elf',
    title: 'The Giving Begins',
    description: `The morning sun struggles through the lingering storm clouds as you step outside, your heart racing with anticipation.

**Today, your childhood ends and your adult life begins.**

The village paths are strewn with leaves and broken branches from last night's tempest, and you can hear the distant sound of hammering - repairs already underway.

*The Giving Days have arrived.*`,
    objectives: [
      {
        id: 'obj-1-1',
        description: 'Meet Elder Mirae at the Heart Grove tree',
        location: 'Heart Grove',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'heart_grove' },
          },
        ],
      },
    ],

    //TODO: QUEST REWARDS
    reward: {
      skillXp: [
        { skill: 'agility', amount: 25 },
        { skill: 'reputation', amount: 100 },
      ],
    },

    nextQuestId: createQuestId('race', 'elf', 2),
  },

  {
    id: createQuestId('race', 'elf', 2),
    type: 'race',
    race: 'elf',
    title: 'Festival Preparations',
    description: `Elder Mirae greets you at dawn beneath the Heart Grove's ancient boughs.

**"Your Giving Days begin with the most essential task - feeding our people."**

The festival feast needs fresh Salmowiches this year. Journey to **Blooming Glade** for wheat - once you reach level 5 in farming, you'll master the milling arts to turn it into flour. Then head to **Crystalrun River** where the salmon are abundant.

Gather what you need, then use the ovens at Willowbend Plaza to craft the feast.

*Oh, and leave the Heart Grove's pond untouched - those fish are sacred.*`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 1)],
    },
    objectives: [
      {
        id: 'obj-2-1',
        description: 'Harvest 20 Wheat in Blooming Glade',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'wheat',
            quantity: 20,
          },
        ],
      },
      {
        id: 'obj-2-2',
        description: 'Mill 10 Flour in Blooming Glade',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'flour',
            quantity: 10,
          },
        ],
      },
      {
        id: 'obj-2-3',
        description: 'Catch 10 Salmon at Crystalrun River',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'salmon',
            quantity: 10,
          },
        ],
      },
      {
        id: 'obj-2-4',
        description: 'Return to Elder Mirae at the Heart Grove',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'heart_grove' },
          },
        ],
      },
    ],

    reward: {
      currency: [{ type: 'gold', amount: 150 }],
      skillXp: [
        { skill: 'agility', amount: 75 },
        { skill: 'farming', amount: 50 },
        { skill: 'fishing', amount: 50 },
        { skill: 'reputation', amount: 100 },
      ],
    },

    nextQuestId: createQuestId('race', 'elf', 3),
  },

  {
    id: createQuestId('race', 'elf', 3),
    type: 'race',
    race: 'elf',
    title: 'From Field to Feast',
    description: `With your basket full of wheat and fresh-caught salmon, you make your way to Willowbend Plaza.

The festival ovens are already warm, their smoke mixing with the morning mist. Elder Mirae's instructions echo in your mind - **the village depends on everyone doing their part, especially this year.**

Time to transform these simple ingredients into food that will sustain your neighbors through the festival. The elder mentioned she'd have someone waiting at the plaza to collect the finished goods.`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 2)],
    },
    objectives: [
      {
        id: 'obj-3-1',
        description: 'Travel to Willowbend Plaza',
        location: 'Willowbend Plaza',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'willowbend_plaza' },
          },
        ],
      },
      {
        id: 'obj-3-2',
        description: 'Bake 5 Bread',
        location: 'Willowbend Plaza',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'bread',
            quantity: 5,
          },
        ],
      },
      {
        id: 'obj-3-3',
        description: 'Make 5 Sashimi',
        location: 'Willowbend Plaza',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'sashimi',
            quantity: 5,
          },
        ],
      },
      {
        id: 'obj-3-4',
        description: 'Make 5 Salmowiches',
        location: 'Willowbend Plaza',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'salmowich',
            quantity: 5,
          },
        ],
      },
      {
        id: 'obj-3-5',
        description: 'Return to Elder Mirae',
        location: 'Heart Grove',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'heart_grove' },
          },
        ],
      },
    ],
    reward: {
      skillXp: [
        { skill: 'cooking', amount: 100 },
        { skill: 'agility', amount: 75 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 250 }],
    },

    nextQuestId: createQuestId('race', 'elf', 4),
  },

  {
    id: createQuestId('race', 'elf', 4),
    type: 'race',
    race: 'elf',
    title: 'Storm Damage',
    description: `As you work at the plaza ovens, you overhear worried voices. Tamion, the village carpenter, is speaking urgently with neighbors.

**"The storm last night took half my roof! With the festival starting, I can't gather materials and fix it alone."**

Seeing you complete your task, he approaches. **"You there! It's your Giving Days, yes? I need help gathering materials to repair my home before the rains return."**`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 3)],
    },

    objectives: [
      {
        id: 'obj-4-1',
        description: "Collect 25 Sticks from Titan's Reach",
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'sticks',
            quantity: 25,
          },
        ],
      },
      {
        id: 'obj-4-2',
        description: "Collect 10 Stone from Titan's Reach",
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'stone',
            quantity: 10,
          },
        ],
      },
      {
        id: 'obj-4-3',
        description: 'Craft 5 Crude Planks at Willowbend Plaza Carpentry Bench',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'crude_plank',
            quantity: 5,
          },
        ],
      },
      {
        id: 'obj-4-4',
        description: 'Craft 10 Stone Bricks at Willowbend Plaza Forge',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'stone_brick',
            quantity: 10,
          },
        ],
      },
      {
        id: 'obj-4-5',
        description: 'Return to Tamion at Willowbend Plaza',
        completionRequirements: [
          {
            type: 'item',
            items: [
              { id: 'crude_plank', quantity: 5 },
              { id: 'stone_brick', quantity: 10 },
            ],
            location: { type: 'region', region: 'willowbend_plaza' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'carpentry', amount: 100 },
        { skill: 'smithing', amount: 100 },
        { skill: 'mining', amount: 50 },
        { skill: 'woodcutting', amount: 100 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 150 }],
    },

    nextQuestId: createQuestId('race', 'elf', 5),
  },

  {
    id: createQuestId('race', 'elf', 5),
    type: 'race',
    race: 'elf',
    title: "The Herbalist's Need",
    description: `Silviana waves you over as you pass her stall.

**"Good timing! Alaion just sent word - he's gathering ingredients in Mycelwood Thicket but needs an extra pair of hands."**

With so many villagers falling ill lately, he's working overtime preparing remedies. You'll find him near the old oak at the thicket's entrance.

*Best hurry - he's not the most patient elf.*`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 4)],
    },

    objectives: [
      {
        id: 'obj-5-1',
        description: 'Find Alaion Elfir at Mycelwood Thicket',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'mycelwood_thicket' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
    },

    nextQuestId: createQuestId('race', 'elf', 6),
  },

  {
    id: createQuestId('race', 'elf', 6),
    type: 'race',
    race: 'elf',
    title: 'Mushrooms and Medicine',
    description: `The elderly herbalist barely looks up from his gathering.

**"Silviana sent you? Good. See these red and white mushrooms? They're essential for healing potions, but my back isn't what it used to be."**

Gather ten - and mind the purple ones, they're poisonous. In return, I'll teach you basic potion-making and... _He produces a worn sword._

**"This might prove useful. The forest has been restless lately."**`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 5)],
    },

    objectives: [
      {
        id: 'obj-6-1',
        description: 'Collect 10 Fly Agarics from Mycelwood Thicket',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'fly_agaric',
            quantity: 10,
          },
        ],
      },
      {
        id: 'obj-6-2',
        description: 'Craft 5 Minor Potions of Healing through Alchemy',
        group: 1,
        completionRequirements: [
          {
            type: 'craft',
            itemId: 'minor_healing_potion',
            quantity: 5,
          },
        ],
      },
      {
        id: 'obj-6-3',
        description: 'Return to Alaion at Mycelwood Thicket',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'mycelwood_thicket' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'alchemy', amount: 200 },
        { skill: 'foraging', amount: 100 },
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
      items: [{ id: 'basic_sword', name: 'Basic Sword', quantity: 1 }],
    },

    nextQuestId: createQuestId('race', 'elf', 7),
  },

  {
    id: createQuestId('race', 'elf', 7),
    type: 'race',
    race: 'elf',
    title: 'A Cry for Help',
    description: `As you finish bottling the last potion, a distant cry echoes through the trees. Alaion's face pales.

**"That came from Hollow Crown - but no one should be there! The ruins have been dangerous since the slimes appeared."**

He grabs your shoulder. **"You're young and quick. Go! I'll follow as fast as these old bones allow. Someone needs help!"**`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 6)],
    },

    objectives: [
      {
        id: 'obj-7-1',
        description: 'Investigate the cry for help at Hollow Crown',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'hollow_crown' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
    },

    nextQuestId: createQuestId('race', 'elf', 8),
  },

  {
    id: createQuestId('race', 'elf', 8),
    type: 'race',
    race: 'elf',
    title: "The Ruins' Secret",
    description: `You find young Pyria huddled behind a crumbling pillar, her berry basket overturned.

**"I-I saw something glinting deeper in the ruins! I thought it might be festival decorations someone dropped, but these horrible slimes came out of nowhere!"**

She points toward the ancient stone archway. **"They're guarding something in there. Please, I just want to go home!"**

You'll need to clear the path and investigate what has the slimes so agitated.`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 7)],
    },

    objectives: [
      {
        id: 'obj-8-1',
        description: 'Defeat slimes until you find something unexpected',
        completionRequirements: [
          {
            type: 'item',
            items: [{ id: 'moonstone_tablet', quantity: 1 }],
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'combat', amount: 500 },
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
    },

    nextQuestId: createQuestId('race', 'elf', 9),
  },

  {
    id: createQuestId('race', 'elf', 9),
    type: 'race',
    race: 'elf',
    title: 'The Gleaming Prophecy',
    description: `Among the slime's remains, you discover what caught young Pyria's eye - an ancient tablet carved from moonstone, its surface still reflecting light after centuries in darkness.

The elvish script is old, predating even the village records:

**"Eight hundred years shall pass in peace, while the Devourer sleeps beneath. When the Heart Grove's bounty fades and fails, when dwarven forges cool their nails, when human towers crumble down, and orcish drums make no more sound - then does the Devourer wake, all lands and life it seeks to take. Apart we fall, together stand, unite once more to save the land."**

Your hands tremble as you realize this prophecy is coming true - the failing harvests are just the beginning.`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 8)],
    },

    objectives: [
      {
        id: 'obj-9-1',
        description: 'Bring the Moonstone Tablet to Elder Mirae at the Heart Grove',
        completionRequirements: [
          {
            type: 'item',
            items: [{ id: 'moonstone_tablet', quantity: 1 }],
            location: { type: 'region', region: 'heart_grove' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'combat', amount: 500 },
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
    },

    nextQuestId: createQuestId('race', 'elf', 10),
  },

  {
    id: createQuestId('race', 'elf', 10),
    type: 'race',
    race: 'elf',
    title: "The Elder's Wisdom",
    description: `Elder Mirae traces the ancient words on the moonstone tablet with trembling fingers.

**"Eight hundred years... I've been counting the years wrong. I thought we had more time."**

She looks at you with new intensity. **"This prophecy - your parents were searching for something like this. They believed the old warnings were more than legend."**

She glances toward the Heart Grove, its light flickering weakly in the morning sun. **"The Devourer stirs, feeding on our land's strength from below. But rushing to the other regions unprepared would be foolish."**

You need to become someone capable of uniting peoples who have forgotten they ever stood together. Learn every craft Willow's Reach can teach. Help every soul who needs you. Understand what we're fighting to save.

Only when you've grown strong in body, mind, and purpose should you attempt the Sunforge Sands. The journey ahead will test everything you are.`,
    requirements: {
      completedQuests: [createQuestId('race', 'elf', 9)],
    },

    objectives: [
      {
        id: 'obj-10-1',
        description: 'Reach level 20 in Combat',
        group: 1,
        completionRequirements: [
          {
            type: 'skill_level',
            skill: 'combat',
            level: 20,
          },
        ],
      },
      {
        id: 'obj-10-2',
        description: 'Reach level 10 in Reputation',
        group: 1,
        completionRequirements: [
          {
            type: 'skill_level',
            skill: 'reputation',
            level: 10,
          },
        ],
      },
      {
        id: 'obj-10-3',
        description: 'Reach level 20 in Crafting',
        group: 1,
        completionRequirements: [
          {
            type: 'skill_level',
            skill: 'crafting',
            level: 20,
          },
        ],
      },
      {
        id: 'obj-10-4',
        description: 'Reach level 20 in Cooking',
        group: 1,
        completionRequirements: [
          {
            type: 'skill_level',
            skill: 'cooking',
            level: 20,
          },
        ],
      },
      {
        id: 'obj-10-5',
        description: 'Return to Elder Mirae at the Heart Grove',
        completionRequirements: [
          {
            type: 'location',
            location: { type: 'region', region: 'heart_grove' },
          },
        ],
      },
    ],

    reward: {
      skillXp: [
        { skill: 'combat', amount: 500 },
        { skill: 'agility', amount: 500 },
        { skill: 'reputation', amount: 100 },
      ],
      currency: [{ type: 'gold', amount: 100 }],
    },

    nextQuestId: createQuestId('race', 'elf', 11),
  },
];

// ==========================================
// MAIN QUEST EXAMPLE
// ==========================================

const mainQuest: MainQuest = {
  id: createQuestId('main', 'chapter1', 1),
  type: 'main',
  chapter: 1,
  act: 1,
  isCriticalPath: true,
  title: 'The Gathering Storm',
  description:
    'Representatives from all races have been summoned to the Council of Unity. Dark omens suggest a threat that endangers all.',

  requirements: {
    completedQuests: [
      createQuestId('race', 'elf', 5), // Or equivalent for other races
    ],
  },

  objectives: [
    {
      id: 'obj-m1-1',
      description: 'Travel to the Neutral City of Convergence',
      completionRequirements: [
        {
          type: 'location',
          location: { type: 'exact', x: 0, y: 0 },
        },
      ],
    },
    {
      id: 'obj-m1-2',
      description: 'Meet with representatives from each race',
      completionRequirements: [
        {
          type: 'location',
          location: { type: 'exact', x: 0, y: 0 },
        },
      ],
    },
    {
      id: 'obj-m1-3',
      description: 'Investigate the ancient archives',
      completionRequirements: [
        {
          type: 'location',
          location: { type: 'exact', x: 0, y: 0 },
        },
      ],
    },
    {
      id: 'obj-m1-4',
      description: 'Defend the city from shadow cult attack',
      completionRequirements: [
        {
          type: 'kill',
          enemyId: 'shadow-cultist',
          quantity: 10,
        },
      ],
    },
  ],

  reward: {
    skillXp: [],
    items: [],
    currency: [{ type: 'gold', amount: 500 }],
  },

  nextQuestId: createQuestId('main', 'chapter1', 2),
};

// ==========================================
// WORLD QUEST EXAMPLE
// ==========================================

const worldQuest: WorldQuest = {
  id: createQuestId('world', 'mistwood', 1),
  type: 'world',
  region: 'Mistwood Vale',
  faction: "Merchant's Guild",
  isDaily: true,
  title: 'Caravan Protection',
  description:
    'The morning merchant caravan needs protection through the dangerous Mistwood Pass. Bandits have been increasingly bold.',

  objectives: [
    {
      id: 'obj-wq1-1',
      description: 'Meet the caravan at dawn',
      completionRequirements: [
        {
          type: 'location',
          location: { type: 'exact', x: 0, y: 0 },
        },
      ],
    },
    {
      id: 'obj-wq1-2',
      description: 'Escort the caravan through Mistwood Pass',
      completionRequirements: [
        {
          type: 'location',
          location: { type: 'exact', x: 0, y: 0 },
        },
      ],
    },
    {
      id: 'obj-wq1-3',
      description: 'Defeat any bandits that attack (0/3 ambushes)',
      completionRequirements: [
        {
          type: 'kill',
          enemyId: 'bandit',
          quantity: 3,
        },
      ],
    },
  ],

  isRepeatable: true,
  cooldownHours: 24,

  reward: {
    skillXp: [],
    currency: [{ type: 'gold', amount: 75 }],
  },
};

// ==========================================
// EVENT EXAMPLE
// ==========================================

const winterEvent: Event = {
  id: 'winter-festival-2025',
  title: 'Festival of Frozen Stars',
  description:
    'The annual winter celebration has arrived! Complete festive challenges, earn exclusive rewards, and help prepare the grand feast.',
  type: 'seasonal',
  startDate: new Date('2025-12-20'),
  endDate: new Date('2026-01-05'),
  isActive: true,

  globalObjective: {
    description: 'Community Goal: Collect 1,000,000 Frozen Stars',
    currentProgress: 245000,
    targetProgress: 1000000,
  },

  participationReward: {
    items: [{ id: 'festive-hat', name: 'Festive Snow Hat', quantity: 1 }],
  },

  completionReward: {
    items: [
      {
        id: 'ice-walker-mount',
        name: 'Frostmane Wolf Mount',
        quantity: 1,
      },
    ],
    exclusiveItems: [
      {
        id: 'aurora-cloak',
        name: 'Cloak of the Aurora',
      },
    ],
  },

  quests: [],
};

// Event Quest Example
const eventQuest1: EventQuest = {
  id: 'winter-event-quest-1',
  eventId: 'winter-festival-2025',
  isMainObjective: true,
  dailyLimit: 3,

  title: 'Gathering the Feast',
  description:
    'Help Chef Margot collect ingredients for the grand winter feast. The rarer the ingredient, the better the rewards!',

  npc: {
    id: 'chef-margot',
    name: 'Chef Margot',
    location: 'Festival Grounds',
  },

  objectives: [
    {
      id: 'obj-eq1-1',
      description: 'Collect 10 Winter Berries from the Frozen Forest',
      completionRequirements: [
        {
          type: 'item',
          items: [{ id: 'winter-berry', quantity: 10 }],
        },
      ],
    },
    {
      id: 'obj-eq1-2',
      description: 'Fish for 5 Silver Trout in the Ice Lakes',
      completionRequirements: [
        {
          type: 'item',
          items: [{ id: 'silver-trout', quantity: 5 }],
        },
      ],
    },
    {
      id: 'obj-eq1-3',
      description: 'Hunt Snow Elk for 3 pieces of venison',
      completionRequirements: [
        {
          type: 'item',
          items: [{ id: 'snow-elk-venison', quantity: 3 }],
        },
      ],
    },
  ],

  reward: {
    skillXp: [
      { skill: 'gathering', amount: 50 },
      { skill: 'hunting', amount: 50 },
    ],
    items: [{ id: 'feast-ingredient-box', name: "Chef's Special Box", quantity: 1 }],
  },
};

// Add event quest to the event
winterEvent.quests.push(eventQuest1);

// ==========================================
// DATABASE SETUP
// ==========================================

const questDatabase: QuestDatabase = {
  classQuests: new Map([
    // ['warrior', warriorClassQuests],
    // Add other classes here
  ]),
  raceQuests: new Map([
    ['elf', elfRaceQuests],
    // Add other races here
  ]),
  worldQuests: new Map([
    ['Mistwood Vale', [worldQuest]],
    // Add other regions here
  ]),
  mainQuests: [mainQuest],
};

const eventDatabase: EventDatabase = {
  activeEvents: [winterEvent],
  upcomingEvents: [],
  pastEvents: [],
};

// Export everything
export { elfRaceQuests, mainQuest, worldQuest, winterEvent, questDatabase, eventDatabase };
