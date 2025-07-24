import { CharacterStats } from '../src/utils/stats';
import mapActions from './map-actions';
import { SkillKey, skills } from './skills';

const actions = mapActions.split('\n').map((line: string) => line.split(''));

type AllowedActions = Partial<Record<SkillKey, string[]>>;

type ActionDefinition = {
  id: string;
  name: string;
  allowedActions: AllowedActions;
  description: string;
};

export const AGILITY_XP_REWARD = 10;
export const STEPS_PER_SQUARE = 50;

const allRecipesForAction = (action: SkillKey) => {
  return skills.find((s) => s.key === action)?.recipes.map((r) => r.key) ?? [];
};

const actionDefinitions: Record<string, ActionDefinition> = {
  L: {
    id: 'silverleaf_refuge',
    name: 'Silverleaf Refuge',
    description:
      'A serene island sanctuary where ancient silverleaf trees grow beside crystal-clear waters. The unique wood from these rare trees shimmers with an inner light, while the surrounding streams teem with fish drawn to the magical runoff.',
    allowedActions: {
      fishing: [
        'salmon',
        'catfish',
        'chub',
        'carp',
        'largemouth_bass',
        'smallmouth_bass',
        'shad',
        'scorpion_carp',
        'eldritch_bass',
      ],
      woodcutting: ['silverleaf_log', 'sticks'],
    },
  },
  l: {
    id: 'silverleaf_refuge_outskirts',
    name: 'Silverleaf Refuge Outskirts',
    description:
      'A serene island sanctuary where ancient silverleaf trees grow beside crystal-clear waters. The unique wood from these rare trees shimmers with an inner light, while the surrounding streams teem with fish drawn to the magical runoff.',
    allowedActions: {
      fishing: ['salmon'],
      woodcutting: ['sticks'],
    },
  },
  D: {
    id: 'thornspire_ruins',
    name: 'Thornspire Ruins',
    description:
      'Once a proud elven watchtower, now crumbling stone haunted by restless spirits. Dark energy seeps from the broken walls, attracting both supernatural entities and those brave enough to forage among the thorny undergrowth.',
    allowedActions: {
      woodcutting: ['redwood_log', 'sticks'],

      foraging: ['cherry', 'chili_pepper', 'raspberry', 'strawberry', 'pomegranate'],
      combat: ['ghost_slime', 'common_rat', 'bat_rat', 'rotten_rat', 'black_ghost', 'blue_ghost', 'red_ghost'],
    },
  },
  T: {
    id: 'titans_rest',
    name: "Titan's Rest",
    description:
      "Legend says a titan fell here ages ago, its body becoming the mineral-rich cliffs. Miners work the stone quarries by day, uncovering veins of precious ore where the titan's essence crystallized.",
    allowedActions: {
      mining: ['stone', 'copper_ore', 'iron_ore', 'red_ore'],
      woodcutting: ['birch_log', 'oak_log', 'sticks'],
    },
  },
  t: {
    id: 'titans_rest_outskirts',
    name: "Titan's Rest Outskirts",
    description:
      "Legend says a titan fell here ages ago, its body becoming the mineral-rich cliffs. Miners work the stone quarries by day, uncovering veins of precious ore where the titan's essence crystallized.",
    allowedActions: {
      mining: ['stone', 'copper_ore'],
      woodcutting: ['sticks'],
    },
  },
  I: {
    id: 'ironheart_cliffs',
    name: 'Ironheart Cliffs',
    description:
      'Towering cliffs of red stone where the rarest ores hide deep within the rock face. The harsh winds and sheer drops make mining treacherous, but the rewards of gold and mystical gems draw the bold.',
    allowedActions: {
      mining: ['silver_ore', 'gold_ore', 'blue_ore', 'red_ore', 'copper_ore', 'iron_ore'],
      woodcutting: ['eldritchwood_log', 'sticks'],
    },
  },
  i: {
    id: 'ironheart_cliffs_outskirts',
    name: 'Ironheart Cliffs Outskirts',
    description:
      'Towering cliffs of red stone where the rarest ores hide deep within the rock face. The harsh winds and sheer drops make mining treacherous, but the rewards of gold and mystical gems draw the bold.',
    allowedActions: {
      mining: ['silver_ore'],
      woodcutting: ['sticks'],
    },
  },
  C: {
    id: 'crimson_garden',
    name: 'Crimson Garden',
    description:
      "A hidden orchard where fruit trees grow wild, their leaves forever tinged red by ancient magic. The sweet scent of berries and exotic fruits fills the air, carefully tended by those who know the garden's secrets.",
    allowedActions: {
      foraging: ['apple', 'cherry', 'chili_pepper', 'raspberry', 'strawberry', 'pomegranate', 'dragonfruit'],
      woodcutting: ['redwood_log', 'sticks'],
    },
  },
  V: {
    id: 'verdant_isle',
    name: 'Verdant Isle',
    description:
      "The largest island in the southern waters, blessed with abundant life. Dense forests, hidden coves for fishing, and wild game make it a paradise for those seeking nature's bounty.",
    allowedActions: {
      fishing: [
        'flying_fish',
        'red_drum',
        'grouper',
        'octopus',
        'squid',
        'pufferfish',
        'peach_jellyfish',
        'cycloptopus',
      ],
      woodcutting: ['oak_log', 'sticks'],
      foraging: ['pear', 'lemon', 'kiwi', 'apricot', 'orange'],
      hunting: allRecipesForAction('hunting'),
    },
  },
  P: {
    id: 'pearlsand_strand_docks',
    name: 'Pearlsand Strand Docks',
    description:
      'Where the river meets the sea, creating beaches of glistening sand. Fishermen cast their lines for deep-water catches.',
    allowedActions: {
      fishing: [
        'shrimp',
        'sardine',
        'crab',
        'blue_crab',
        'rockfish',
        'lobster',
        'albacore',
        'stingray',
        'swordfish',
        'orb_octopus',
      ],
    },
  },
  p: {
    id: 'pearlsand_strand',
    name: 'Pearlsand Strand',
    description:
      'Where the river meets the sea, creating beaches of glistening sand. Foragers comb the shores for tropical fruits and rare shells washed in by the tides.',
    allowedActions: {
      foraging: ['banana', 'coconut', 'pineapple', 'papaya', 'starfish', 'oyster'],
    },
  },
  R: {
    id: 'crystalrun_river',
    name: 'Crystalrun River',
    description:
      'Its waters sparkle with trace magic. Rainbow trout and salmon leap through the rapids, while fishermen tell tales of the mystical catches found in deeper pools.',
    allowedActions: {
      fishing: ['salmon', 'rainbow_trout', 'pike', 'tiger_trout', 'chattahochee_bass', 'lingcod', 'sea_snake'],
      woodcutting: ['sticks'],
    },
  },
  N: {
    id: 'moonmere',
    name: 'Moonmere',
    description:
      'A peaceful lake that perfectly reflects the night sky, surrounded by mixed forest. The still waters hide unusual fish species, while the shoreline offers both timber and wild edibles to those who know where to look.',
    allowedActions: {
      fishing: ['tilapia', 'beige_snapper', 'dwarf_goby', 'red_rainbowfish', 'woodskip', 'shoal', 'green_sunfish'],
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      foraging: allRecipesForAction('foraging'),
    },
  },
  O: {
    id: 'hollow_crown',
    name: 'Hollow Crown',
    description:
      'An ancient meeting hall of the old kingdoms, now overrun by corruption. Though dangerous, crafters still use its intact workshops, and alchemists seek reagents in its depths.',
    allowedActions: {
      crafting: allRecipesForAction('crafting'),
      combat: ['green_slime', 'red_mushroon', 'brown_mushroom', 'purple_mushroom', 'stick_ent', 'oak_ent', 'pine_ent'],
      alchemy: allRecipesForAction('alchemy'),
    },
  },
  H: {
    id: 'heart_grove',
    name: 'Heart Grove',
    description:
      "The sacred center of Willow's Reach, where the ancient tree's roots drink from an ever-flowing spring. Elder Mirae tends the grove, teaching the alchemical arts amid the rare flowers that bloom only here.",
    allowedActions: {
      alchemy: allRecipesForAction('alchemy'),
    },
  },
  h: {
    id: 'heart_grove_outskirts',
    name: 'Heart Grove Outskirts',
    description:
      "The sacred center of Willow's Reach, where the ancient tree's roots drink from an ever-flowing spring. Elder Mirae tends the grove, teaching the alchemical arts amid the rare flowers that bloom only here.",
    allowedActions: {
      alchemy: allRecipesForAction('alchemy'),
    },
  },
  B: {
    id: 'blooming_glade',
    name: 'Blooming Glade',
    description:
      "Vibrant meadows surrounding the village and Heart Grove, where wildflowers carpet the earth. The community farms thrive here, blessed by the grove's influence and tended by generations of elven farmers.",
    allowedActions: {
      foraging: ['grapes', 'chili_pepper', 'raspberry', 'strawberry'],
      woodcutting: ['sticks'],
      farming: allRecipesForAction('farming'),
    },
  },
  b: {
    id: 'blooming_glade_outskirts',
    name: 'Blooming Glade Outskirts',
    description:
      "Vibrant meadows surrounding the village and Heart Grove, where wildflowers carpet the earth. The community farms thrive here, blessed by the grove's influence and tended by generations of elven farmers.",
    allowedActions: {
      foraging: ['grapes', 'chili_pepper', 'raspberry', 'strawberry'],
      woodcutting: ['sticks'],
    },
  },
  W: {
    id: 'willowbend_plaza',
    name: 'Willowbend Plaza',
    description:
      'The bustling heart of village life, where craft halls and workshops cluster around the central market. The smell of fresh bread mingles with forge smoke as artisans practice their trades and merchants hawk their wares.',
    allowedActions: {
      cooking: allRecipesForAction('cooking'),
      smithing: allRecipesForAction('smithing'),
      crafting: allRecipesForAction('crafting'),
      trinketry: allRecipesForAction('trinketry'),
      reputation: allRecipesForAction('reputation'),
      carpentry: allRecipesForAction('carpentry'),
    },
  },
  w: {
    id: 'willowbend_village',
    name: 'Willowbend Village',
    description:
      'The bustling heart of village life, where craft halls and workshops cluster around the central market. The smell of fresh bread mingles with forge smoke as artisans practice their trades and merchants hawk their wares.',
    allowedActions: {
      reputation: allRecipesForAction('reputation'),
    },
  },
  S: {
    id: 'sunforge_sands',
    name: 'Sunforge Sands',
    description:
      'A wasteland of scorching dunes that separates elven and dwarven lands. The bones of ancient creatures bleach in the sun, while elemental beings stir in the heat-warped air, guarding the treacherous passage.',
    allowedActions: {
      crafting: allRecipesForAction('crafting'),
      combat: ['flame_slime', 'earth_lich', 'ice_lich', 'flame_lich', 'clay_golem', 'metal_golem', 'amethyst_golem'],
      alchemy: allRecipesForAction('alchemy'),
    },
  },
  s: {
    id: 'sunforge_wastelands',
    name: 'Sunforge Wastelands',
    description:
      'A wasteland of scorching dunes that separates elven and dwarven lands. The bones of ancient creatures bleach in the sun, while elemental beings stir in the heat-warped air, guarding the treacherous passage.',
    allowedActions: {
      alchemy: allRecipesForAction('alchemy'),
    },
  },
  M: {
    id: 'mycelwood_thicket',
    name: 'Mycelwood Thicket',
    description:
      'A dense woodland where giant mushrooms grow as tall as trees, creating a twilight world beneath their caps. Herbalists prize the rare fungi found here, though hunters must be wary of what stalks the shadowy undergrowth.',
    allowedActions: {
      foraging: allRecipesForAction('foraging'),
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      hunting: allRecipesForAction('hunting'),
    },
  },
  m: {
    id: 'mycelwood_thicket_outskirts',
    name: 'Mycelwood Thicket Outskirts',
    description:
      'A dense woodland where giant mushrooms grow as tall as trees, creating a twilight world beneath their caps. Herbalists prize the rare fungi found here, though hunters must be wary of what stalks the shadowy undergrowth.',
    allowedActions: {
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      hunting: allRecipesForAction('hunting'),
    },
  },
};

export const baseActions: AllowedActions = {
  agility: allRecipesForAction('agility'),
};

export const allowedActions = (x: number, y: number): AllowedActions => {
  const action = actions[y][x];

  if (!action) {
    return baseActions;
  }

  if (!actionDefinitions[action]) {
    return baseActions;
  }

  const allowedActions = { ...baseActions };

  for (const [skill, actions] of Object.entries(actionDefinitions[action].allowedActions)) {
    allowedActions[skill as SkillKey] = [...(allowedActions[skill as SkillKey] ?? []), ...actions];
  }

  return allowedActions;
};

export const areaName = (x: number, y: number): string => {
  if (!actions[y] || !actions[y][x]) {
    return 'Uncharted';
  }

  const action = actions[y][x];

  if (!actionDefinitions[action]) {
    return 'Uncharted';
  }

  return actionDefinitions[action].name;
};

export const areaId = (x: number, y: number): string => {
  if (!actions[y] || !actions[y][x]) {
    return 'Uncharted';
  }

  const action = actions[y][x];

  if (!actionDefinitions[action]) {
    return 'unknown';
  }

  return actionDefinitions[action].id;
};

export const areaDescription = (x: number, y: number): string => {
  const action = actions[y][x];

  if (!action) {
    return '';
  }

  if (!actionDefinitions[action]) {
    return 'An area of the region that chartographers have not yet documented.';
  }

  return actionDefinitions[action].description;
};

export type Location = {
  x: number;
  y: number;
};

export const getStepsPerSquare = (stats: CharacterStats) => {
  return STEPS_PER_SQUARE / stats.agility;
};

export const getStepsBetween = (start: Location, end: Location, stats: CharacterStats) => {
  const diffX = Math.abs(start.x - end.x);
  const diffY = Math.abs(start.y - end.y);

  const diagonalSteps = Math.min(diffX, diffY);
  const straightSteps = Math.abs(diffX - diffY);

  return (diagonalSteps * 1.5 + straightSteps) * getStepsPerSquare(stats);
};

export const getMovementProgress = (
  start: Location,
  end: Location,
  current: Location,
  skillProgress: number,
  stats: CharacterStats
) => {
  const totalSteps = getStepsBetween(start, end, stats);
  const stepsToGo = getStepsBetween(current, end, stats);

  return (totalSteps - stepsToGo + skillProgress) / totalSteps;
};
