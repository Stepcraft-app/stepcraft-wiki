export interface Resource {
  key: string;
  name: string;
  icon: any;
  price?: number;
}

type ToolPartKey =
  | 'copper_toolhead'
  | 'iron_toolhead'
  | 'silver_toolhead'
  | 'gold_toolhead'
  | 'blue_toolhead'
  | 'red_toolhead';

// TOOL PARTS
export const toolParts: Record<ToolPartKey, Resource> = {
  copper_toolhead: {
    key: 'copper_toolhead',
    name: 'Copper Toolhead',
    icon: require('../assets/resources/smithing/copper_toolhead.png'),
    price: 108,
  },
  iron_toolhead: {
    key: 'iron_toolhead',
    name: 'Iron Toolhead',
    icon: require('../assets/resources/smithing/iron_toolhead.png'),
    price: 261,
  },
  silver_toolhead: {
    key: 'silver_toolhead',
    name: 'Silver Toolhead',
    icon: require('../assets/resources/smithing/silver_toolhead.png'),
    price: 596,
  },
  gold_toolhead: {
    key: 'gold_toolhead',
    name: 'Gold Toolhead',
    icon: require('../assets/resources/smithing/gold_toolhead.png'),
    price: 1331,
  },
  blue_toolhead: {
    key: 'blue_toolhead',
    name: 'Blue Toolhead',
    icon: require('../assets/resources/smithing/blue_toolhead.png'),
    price: 2890,
  },
  red_toolhead: {
    key: 'red_toolhead',
    name: 'Red Toolhead',
    icon: require('../assets/resources/smithing/red_toolhead.png'),
    price: 6177,
  },
};

type OreKey = 'stone' | 'copper_ore' | 'iron_ore' | 'silver_ore' | 'gold_ore' | 'blue_ore' | 'red_ore';

// ORES
export const ores: Record<OreKey, Resource> = {
  stone: {
    key: 'stone',
    name: 'Stone',
    icon: require('../assets/resources/mining/stone_2.png'),
    price: 5,
  },
  copper_ore: {
    key: 'copper_ore',
    name: 'Copper Ore',
    icon: require('../assets/resources/mining/copper_ore.png'),
    price: 14,
  },
  iron_ore: {
    key: 'iron_ore',
    name: 'Iron Ore',
    icon: require('../assets/resources/mining/iron_ore.png'),
    price: 33,
  },
  silver_ore: {
    key: 'silver_ore',
    name: 'Silver Ore',
    icon: require('../assets/resources/mining/silver_ore.png'),
    price: 73,
  },
  gold_ore: {
    key: 'gold_ore',
    name: 'Gold Ore',
    icon: require('../assets/resources/mining/gold_ore.png'),
    price: 100,
  },
  blue_ore: {
    key: 'blue_ore',
    name: 'Blue Ore',
    icon: require('../assets/resources/mining/blue_ore.png'),
    price: 158,
  },
  red_ore: {
    key: 'red_ore',
    name: 'Red Ore',
    icon: require('../assets/resources/mining/red_ore.png'),
    price: 213,
  },
};

type GemKey =
  | 'dustmote_crystal_raw'
  | 'embercore_ruby_raw'
  | 'moonwell_opal_raw'
  | 'goldleaf_peridot_raw'
  | 'tidecrest_sapphire_raw'
  | 'voidstone_raw'
  | 'dustmote_crystal'
  | 'embercore_ruby'
  | 'moonwell_opal'
  | 'goldleaf_peridot'
  | 'tidecrest_sapphire'
  | 'voidstone'
  | 'shattered_dustmote_crystal'
  | 'shattered_embercore_ruby'
  | 'shattered_moonwell_opal'
  | 'shattered_goldleaf_peridot'
  | 'shattered_tidecrest_sapphire'
  | 'shattered_voidstone';

export const gems: Record<GemKey, Resource> = {
  dustmote_crystal_raw: {
    key: 'dustmote_crystal_raw',
    name: 'Raw Dustmote Crystal ',
    icon: require('../assets/resources/mining/dustmote_crystal_raw.png'),
    price: 4,
  },
  embercore_ruby_raw: {
    key: 'embercore_ruby_raw',
    name: 'Raw Embercore Ruby',
    icon: require('../assets/resources/mining/embercore_ruby_raw.png'),
    price: 4,
  },
  moonwell_opal_raw: {
    key: 'moonwell_opal_raw',
    name: 'Raw Moonwell Opal',
    icon: require('../assets/resources/mining/moonwell_opal_raw.png'),
    price: 4,
  },
  goldleaf_peridot_raw: {
    key: 'goldleaf_peridot_raw',
    name: 'Raw Goldleaf Peridot',
    icon: require('../assets/resources/mining/goldleaf_peridot_raw.png'),
    price: 4,
  },
  tidecrest_sapphire_raw: {
    key: 'tidecrest_sapphire_raw',
    name: 'Raw Tidecrest Sapphire',
    icon: require('../assets/resources/mining/tidecrest_sapphire_raw.png'),
    price: 4,
  },
  voidstone_raw: {
    key: 'voidstone_raw',
    name: 'Raw Voidstone',
    icon: require('../assets/resources/mining/voidstone_raw.png'),
    price: 4,
  },
  dustmote_crystal: {
    key: 'dustmote_crystal',
    name: 'Dustmote Crystal',
    icon: require('../assets/resources/mining/dustmote_crystal.png'),
    price: 20,
  },
  embercore_ruby: {
    key: 'embercore_ruby',
    name: 'Embercore Ruby',
    icon: require('../assets/resources/mining/embercore_ruby.png'),
    price: 20,
  },
  moonwell_opal: {
    key: 'moonwell_opal',
    name: 'Moonwell Opal',
    icon: require('../assets/resources/mining/moonwell_opal.png'),
    price: 20,
  },
  goldleaf_peridot: {
    key: 'goldleaf_peridot',
    name: 'Goldleaf Peridot',
    icon: require('../assets/resources/mining/goldleaf_peridot.png'),
    price: 20,
  },
  tidecrest_sapphire: {
    key: 'tidecrest_sapphire',
    name: 'Tidecrest Sapphire',
    icon: require('../assets/resources/mining/tidecrest_sapphire.png'),
    price: 20,
  },
  voidstone: {
    key: 'voidstone',
    name: 'Voidstone',
    icon: require('../assets/resources/mining/voidstone.png'),
    price: 20,
  },
  shattered_dustmote_crystal: {
    key: 'shattered_dustmote_crystal',
    name: 'Shattered Dustmote Crystal',
    icon: require('../assets/resources/mining/shattered_dustmote_crystal.png'),
    price: 4,
  },
  shattered_embercore_ruby: {
    key: 'shattered_embercore_ruby',
    name: 'Shattered Embercore Ruby',
    icon: require('../assets/resources/mining/shattered_embercore_ruby.png'),
    price: 4,
  },
  shattered_moonwell_opal: {
    key: 'shattered_moonwell_opal',
    name: 'Shattered Moonwell Opal',
    icon: require('../assets/resources/mining/shattered_moonwell_opal.png'),
    price: 4,
  },
  shattered_goldleaf_peridot: {
    key: 'shattered_goldleaf_peridot',
    name: 'Shattered Goldleaf Peridot',
    icon: require('../assets/resources/mining/shattered_goldleaf_peridot.png'),
    price: 4,
  },
  shattered_tidecrest_sapphire: {
    key: 'shattered_tidecrest_sapphire',
    name: 'Shattered Tidecrest Sapphire',
    icon: require('../assets/resources/mining/shattered_tidecrest_sapphire.png'),
    price: 4,
  },
  shattered_voidstone: {
    key: 'shattered_voidstone',
    name: 'Shattered Voidstone',
    icon: require('../assets/resources/mining/shattered_voidstone.png'),
    price: 4,
  },
};

type BarKey = 'stone_brick' | 'copper_bar' | 'iron_bar' | 'silver_bar' | 'gold_bar' | 'blue_bar' | 'red_bar';

// BARS
export const bars: Record<BarKey, Resource> = {
  stone_brick: {
    key: 'stone_brick',
    name: 'Stone Brick',
    icon: require('../assets/resources/smithing/stone_brick.png'),
    price: 15,
  },
  copper_bar: {
    key: 'copper_bar',
    name: 'Copper Bar',
    icon: require('../assets/resources/smithing/copper_bar.png'),
    price: 42,
  },
  iron_bar: {
    key: 'iron_bar',
    name: 'Iron Bar',
    icon: require('../assets/resources/smithing/iron_bar.png'),
    price: 99,
  },
  silver_bar: {
    key: 'silver_bar',
    name: 'Silver Bar',
    icon: require('../assets/resources/smithing/silver_bar.png'),
    price: 219,
  },
  gold_bar: {
    key: 'gold_bar',
    name: 'Gold Bar',
    icon: require('../assets/resources/smithing/gold_bar.png'),
    price: 474,
  },
  blue_bar: {
    key: 'blue_bar',
    name: 'Blue Bar',
    icon: require('../assets/resources/smithing/blue_bar.png'),
    price: 993,
  },
  red_bar: {
    key: 'red_bar',
    name: 'Red Bar',
    icon: require('../assets/resources/smithing/red_bar.png'),
    price: 2043,
  },
};

type LogKey = 'sticks' | 'birch_log' | 'oak_log' | 'pine_log' | 'redwood_log' | 'silverleaf_log' | 'eldritchwood_log';

// LOGS
export const logs: Record<LogKey, Resource> = {
  sticks: {
    key: 'sticks',
    name: 'Sticks',
    icon: require('../assets/resources/woodcutting/sticks.png'),
    price: 5,
  },
  birch_log: {
    key: 'birch_log',
    name: 'Birch Log',
    icon: require('../assets/resources/woodcutting/birch_log.png'),
    price: 14,
  },
  oak_log: {
    key: 'oak_log',
    name: 'Oak Log',
    icon: require('../assets/resources/woodcutting/oak_log.png'),
    price: 33,
  },
  pine_log: {
    key: 'pine_log',
    name: 'Pine Log',
    icon: require('../assets/resources/woodcutting/pine_log.png'),
    price: 63,
  },
  redwood_log: {
    key: 'redwood_log',
    name: 'Redwood Log',
    icon: require('../assets/resources/woodcutting/redwood_log.png'),
    price: 73,
  },
  silverleaf_log: {
    key: 'silverleaf_log',
    name: 'Silverleaf Log',
    icon: require('../assets/resources/woodcutting/silverleaf_log.png'),
    price: 158,
  },
  eldritchwood_log: {
    key: 'eldritchwood_log',
    name: 'Eldritchwood Log',
    icon: require('../assets/resources/woodcutting/eldritchwood_log.png'),
    price: 158,
  },
};

type PlankKey =
  | 'crude_plank'
  | 'birch_plank'
  | 'oak_plank'
  | 'pine_plank'
  | 'redwood_plank'
  | 'silverleaf_plank'
  | 'eldritchwood_plank';

// PLANKS
export const planks: Record<PlankKey, Resource> = {
  crude_plank: {
    key: 'crude_plank',
    name: 'Crude Plank',
    icon: require('../assets/resources/carpentry/crude_plank.png'),
    price: 30,
  },
  birch_plank: {
    key: 'birch_plank',
    name: 'Birch Plank',
    icon: require('../assets/resources/carpentry/birch_plank.png'),
    price: 42,
  },
  oak_plank: {
    key: 'oak_plank',
    name: 'Oak Plank',
    icon: require('../assets/resources/carpentry/oak_plank.png'),
    price: 99,
  },
  pine_plank: {
    key: 'pine_plank',
    name: 'Pine Plank',
    icon: require('../assets/resources/carpentry/pine_plank.png'),
    price: 199,
  },
  redwood_plank: {
    key: 'redwood_plank',
    name: 'Redwood Plank',
    icon: require('../assets/resources/carpentry/redwood_plank.png'),
    price: 304,
  },
  silverleaf_plank: {
    key: 'silverleaf_plank',
    name: 'Silverleaf Plank',
    icon: require('../assets/resources/carpentry/silverleaf_plank.png'),
    price: 647,
  },
  eldritchwood_plank: {
    key: 'eldritchwood_plank',
    name: 'Eldritchwood Plank',
    icon: require('../assets/resources/carpentry/eldritchwood_plank.png'),
    price: 997,
  },
};

// HANDLES
type HandleKey =
  | 'birch_handle'
  | 'oak_handle'
  | 'pine_handle'
  | 'redwood_handle'
  | 'silverleaf_handle'
  | 'eldritchwood_handle';

export const handles: Record<HandleKey, Resource> = {
  birch_handle: {
    key: 'birch_handle',
    name: 'Birch Handle',
    icon: require('../assets/resources/carpentry/birch_handle.png'),
    price: 108,
  },
  oak_handle: {
    key: 'oak_handle',
    name: 'Oak Handle',
    icon: require('../assets/resources/carpentry/oak_handle.png'),
    price: 261,
  },
  pine_handle: {
    key: 'pine_handle',
    name: 'Pine Handle',
    icon: require('../assets/resources/carpentry/pine_handle.png'),
    price: 556,
  },
  redwood_handle: {
    key: 'redwood_handle',
    name: 'Redwood Handle',
    icon: require('../assets/resources/carpentry/redwood_handle.png'),
    price: 991,
  },
  silverleaf_handle: {
    key: 'silverleaf_handle',
    name: 'Silverleaf Handle',
    icon: require('../assets/resources/carpentry/silverleaf_handle.png'),
    price: 2198,
  },
  eldritchwood_handle: {
    key: 'eldritchwood_handle',
    name: 'Eldritchwood Handle',
    icon: require('../assets/resources/carpentry/eldritchwood_handle.png'),
    price: 4085,
  },
};

// FISH
type FishKey =
  | 'red_bait'
  | 'maggot_bait'
  | 'fly_bait'
  | 'basic_bait'
  | 'rainbow_trout'
  | 'salmon'
  | 'scorpion_carp'
  | 'largemouth_bass'
  | 'shrimp'
  | 'shrimp_bait'
  | 'peach_jellyfish'
  | 'peach_bait'
  | 'stingray'
  | 'woodskip'
  | 'orb_octopus'
  | 'octopus'
  | 'shad'
  | 'albacore'
  | 'speckled_cycloptopus'
  | 'squid'
  | 'crab'
  | 'blue_crab'
  | 'eldritch_bass'
  | 'beige_snapper'
  | 'smallmouth_bass'
  | 'pike'
  | 'tiger_trout'
  | 'tiger_bait'
  | 'green_sunfish'
  | 'red_rainbowfish'
  | 'sea_snake'
  | 'lobster'
  | 'chub'
  | 'dwarf_goby'
  | 'swordfish'
  | 'rockfish'
  | 'pufferfish'
  | 'puff_bait'
  | 'shoal'
  | 'grouper'
  | 'flying_fish'
  | 'half_shoal'
  | 'sardine'
  | 'sardine_bait'
  | 'chattahoochee_bass'
  | 'catfish'
  | 'red_drum'
  | 'tilapia'
  | 'lingcod'
  | 'carp'
  | 'starfish'
  | 'barrel'
  | 'boot'
  | 'bottle'
  | 'crate'
  | 'fish_skeleton'
  | 'rope';

export const fish: Record<FishKey, Resource> = {
  red_bait: {
    key: 'red_bait',
    name: 'Red Bait',
    icon: require('../assets/resources/fishing/red_bait.png'),
    price: 4,
  },
  maggot_bait: {
    key: 'maggot_bait',
    name: 'Maggot Bait',
    icon: require('../assets/resources/fishing/maggot_bait.png'),
    price: 4,
  },
  fly_bait: {
    key: 'fly_bait',
    name: 'Fly Bait',
    icon: require('../assets/resources/fishing/fly_bait.png'),
    price: 4,
  },
  basic_bait: {
    key: 'basic_bait',
    name: 'Basic Bait',
    icon: require('../assets/resources/fishing/basic_bait.png'),
    price: 4,
  },
  rainbow_trout: {
    key: 'rainbow_trout',
    name: 'Rainbow Trout',
    icon: require('../assets/resources/fishing/rainbow_trout.png'),
    price: 4,
  },
  salmon: {
    key: 'salmon',
    name: 'Salmon',
    icon: require('../assets/resources/fishing/salmon.png'),
    price: 4,
  },
  scorpion_carp: {
    key: 'scorpion_carp',
    name: 'Scorpion Carp',
    icon: require('../assets/resources/fishing/scorpion_carp.png'),
    price: 4,
  },
  largemouth_bass: {
    key: 'largemouth_bass',
    name: 'Largemouth Bass',
    icon: require('../assets/resources/fishing/largemouth_bass.png'),
    price: 4,
  },
  shrimp: {
    key: 'shrimp',
    name: 'Shrimp',
    icon: require('../assets/resources/fishing/shrimp.png'),
    price: 4,
  },
  shrimp_bait: {
    key: 'shrimp_bait',
    name: 'Shrimp Bait',
    icon: require('../assets/resources/fishing/shrimp_bait.png'),
    price: 5,
  },
  peach_jellyfish: {
    key: 'peach_jellyfish',
    name: 'Peach Jellyfish',
    icon: require('../assets/resources/fishing/peach_jellyfish.png'),
    price: 4,
  },
  peach_bait: {
    key: 'peach_bait',
    name: 'Peach Bait',
    icon: require('../assets/resources/fishing/peach_bait.png'),
    price: 443,
  },
  stingray: {
    key: 'stingray',
    name: 'Stingray',
    icon: require('../assets/resources/fishing/stingray.png'),
    price: 4,
  },
  woodskip: {
    key: 'woodskip',
    name: 'Woodskip',
    icon: require('../assets/resources/fishing/woodskip.png'),
    price: 4,
  },
  orb_octopus: {
    key: 'orb_octopus',
    name: 'Orb Octopus',
    icon: require('../assets/resources/fishing/orb_octopus.png'),
    price: 4,
  },
  octopus: {
    key: 'octopus',
    name: 'Octopus',
    icon: require('../assets/resources/fishing/octopus.png'),
    price: 4,
  },
  shad: {
    key: 'shad',
    name: 'Shad',
    icon: require('../assets/resources/fishing/shad.png'),
    price: 4,
  },
  albacore: {
    key: 'albacore',
    name: 'Albacore',
    icon: require('../assets/resources/fishing/albacore.png'),
    price: 4,
  },
  speckled_cycloptopus: {
    key: 'speckled_cycloptopus',
    name: 'Speckled Cycloptopus',
    icon: require('../assets/resources/fishing/speckled_cycloptopus.png'),
    price: 4,
  },
  squid: {
    key: 'squid',
    name: 'Squid',
    icon: require('../assets/resources/fishing/squid.png'),
    price: 4,
  },
  crab: {
    key: 'crab',
    name: 'Crab',
    icon: require('../assets/resources/fishing/crab.png'),
    price: 4,
  },
  blue_crab: {
    key: 'blue_crab',
    name: 'Blue Crab',
    icon: require('../assets/resources/fishing/blue_crab.png'),
    price: 4,
  },
  eldritch_bass: {
    key: 'eldritch_bass',
    name: 'Eldritch Bass',
    icon: require('../assets/resources/fishing/eldritch_bass.png'),
    price: 4,
  },
  beige_snapper: {
    key: 'beige_snapper',
    name: 'Beige Snapper',
    icon: require('../assets/resources/fishing/beige_snapper.png'),
    price: 4,
  },
  smallmouth_bass: {
    key: 'smallmouth_bass',
    name: 'Smallmouth Bass',
    icon: require('../assets/resources/fishing/smallmouth_bass.png'),
    price: 4,
  },
  pike: {
    key: 'pike',
    name: 'Pike',
    icon: require('../assets/resources/fishing/pike.png'),
    price: 4,
  },
  tiger_trout: {
    key: 'tiger_trout',
    name: 'Tiger Trout',
    icon: require('../assets/resources/fishing/tiger_trout.png'),
    price: 4,
  },
  tiger_bait: {
    key: 'tiger_bait',
    name: 'Tiger Bait',
    icon: require('../assets/resources/fishing/tiger_bait.png'),
    price: 73,
  },
  green_sunfish: {
    key: 'green_sunfish',
    name: 'Green Sunfish',
    icon: require('../assets/resources/fishing/green_sunfish.png'),
    price: 4,
  },
  red_rainbowfish: {
    key: 'red_rainbowfish',
    name: 'Red Rainbowfish',
    icon: require('../assets/resources/fishing/red_rainbowfish.png'),
    price: 4,
  },
  sea_snake: {
    key: 'sea_snake',
    name: 'Sea Snake',
    icon: require('../assets/resources/fishing/sea_snake.png'),
    price: 4,
  },
  lobster: {
    key: 'lobster',
    name: 'Lobster',
    icon: require('../assets/resources/fishing/lobster.png'),
    price: 4,
  },
  chub: {
    key: 'chub',
    name: 'Chub',
    icon: require('../assets/resources/fishing/chub.png'),
    price: 4,
  },
  dwarf_goby: {
    key: 'dwarf_goby',
    name: 'Dwarf Goby',
    icon: require('../assets/resources/fishing/dwarf_goby.png'),
    price: 4,
  },
  swordfish: {
    key: 'swordfish',
    name: 'Swordfish',
    icon: require('../assets/resources/fishing/swordfish.png'),
    price: 4,
  },
  rockfish: {
    key: 'rockfish',
    name: 'Rockfish',
    icon: require('../assets/resources/fishing/rockfish.png'),
    price: 100,
  },
  pufferfish: {
    key: 'pufferfish',
    name: 'Pufferfish',
    icon: require('../assets/resources/fishing/pufferfish.png'),
    price: 4,
  },
  puff_bait: {
    key: 'puff_bait',
    name: 'Puff Bait',
    icon: require('../assets/resources/fishing/puff_bait.png'),
    price: 331,
  },
  shoal: {
    key: 'shoal',
    name: 'Shoal',
    icon: require('../assets/resources/fishing/shoal.png'),
    price: 4,
  },
  grouper: {
    key: 'grouper',
    name: 'Grouper',
    icon: require('../assets/resources/fishing/grouper.png'),
    price: 4,
  },
  flying_fish: {
    key: 'flying_fish',
    name: 'Flying Fish',
    icon: require('../assets/resources/fishing/flying_fish.png'),
    price: 4,
  },
  half_shoal: {
    key: 'half_shoal',
    name: 'Half Shoal',
    icon: require('../assets/resources/fishing/half_shoal.png'),
    price: 331,
  },
  sardine: {
    key: 'sardine',
    name: 'Sardine',
    icon: require('../assets/resources/fishing/sardine.png'),
    price: 4,
  },
  sardine_bait: {
    key: 'sardine_bait',
    name: 'Sardine Bait',
    icon: require('../assets/resources/fishing/sardine_bait.png'),
    price: 14,
  },
  chattahoochee_bass: {
    key: 'chattahoochee_bass',
    name: 'Chattahoochee Bass',
    icon: require('../assets/resources/fishing/chattahoochee_bass.png'),
    price: 4,
  },
  catfish: {
    key: 'catfish',
    name: 'Catfish',
    icon: require('../assets/resources/fishing/catfish.png'),
    price: 4,
  },
  red_drum: {
    key: 'red_drum',
    name: 'Red Drum',
    icon: require('../assets/resources/fishing/red_drum.png'),
    price: 4,
  },
  tilapia: {
    key: 'tilapia',
    name: 'Tilapia',
    icon: require('../assets/resources/fishing/tilapia.png'),
    price: 4,
  },
  lingcod: {
    key: 'lingcod',
    name: 'Lingcod',
    icon: require('../assets/resources/fishing/lingcod.png'),
    price: 4,
  },
  carp: {
    key: 'carp',
    name: 'Carp',
    icon: require('../assets/resources/fishing/carp.png'),
    price: 4,
  },
  starfish: {
    key: 'starfish',
    name: 'Starfish',
    icon: require('../assets/resources/fishing/starfish.png'),
    price: 5,
  },
  barrel: {
    key: 'barrel',
    name: 'Barrel',
    icon: require('../assets/resources/fishing/barrel.png'),
    price: 1,
  },
  boot: {
    key: 'boot',
    name: 'Boot',
    icon: require('../assets/resources/fishing/boot.png'),
    price: 1,
  },
  bottle: {
    key: 'bottle',
    name: 'Bottle',
    icon: require('../assets/resources/fishing/bottle.png'),
    price: 1,
  },
  crate: {
    key: 'crate',
    name: 'Crate',
    icon: require('../assets/resources/fishing/crate.png'),
    price: 1,
  },
  fish_skeleton: {
    key: 'fish_skeleton',
    name: 'Fish Skeleton',
    icon: require('../assets/resources/fishing/fish_skeleton.png'),
    price: 1,
  },
  rope: {
    key: 'rope',
    name: 'Rope',
    icon: require('../assets/resources/fishing/rope.png'),
    price: 1,
  },
};

// FARMING
type FarmingKey =
  | 'carrot'
  | 'cheese_slice'
  | 'wheat'
  | 'egg'
  | 'flour'
  | 'milk'
  | 'sugar'
  | 'avocado'
  | 'broccoli'
  | 'corn'
  | 'eggplant'
  | 'garlic'
  | 'grapes'
  | 'lettuce'
  | 'onion'
  | 'potato'
  | 'peas'
  | 'radish'
  | 'tomato'
  | 'yellow_pepper'
  | 'rice';

export const farming: Record<FarmingKey, Resource> = {
  carrot: {
    key: 'carrot',
    name: 'Carrot',
    icon: require('../assets/resources/farming/carrot.png'),
    price: 5,
  },
  cheese_slice: {
    key: 'cheese_slice',
    name: 'Cheese Slice',
    icon: require('../assets/resources/farming/cheese_slice.png'),
    price: 73,
  },
  wheat: {
    key: 'wheat',
    name: 'Wheat',
    icon: require('../assets/resources/farming/wheat.png'),
    price: 5,
  },
  egg: {
    key: 'egg',
    name: 'Egg',
    icon: require('../assets/resources/farming/egg.png'),
    price: 33,
  },
  flour: {
    key: 'flour',
    name: 'Flour',
    icon: require('../assets/resources/farming/flour.png'),
    price: 24,
  },
  milk: {
    key: 'milk',
    name: 'Milk',
    icon: require('../assets/resources/farming/milk.png'),
    price: 158,
  },
  sugar: {
    key: 'sugar',
    name: 'Sugar',
    icon: require('../assets/resources/farming/sugar.png'),
    price: 33,
  },
  avocado: {
    key: 'avocado',
    name: 'Avocado',
    icon: require('../assets/resources/farming/avocado.png'),
    price: 158,
  },
  broccoli: {
    key: 'broccoli',
    name: 'Broccoli',
    icon: require('../assets/resources/farming/broccoli.png'),
    price: 158,
  },
  corn: {
    key: 'corn',
    name: 'Corn',
    icon: require('../assets/resources/farming/corn.png'),
    price: 14,
  },
  eggplant: {
    key: 'eggplant',
    name: 'Eggplant',
    icon: require('../assets/resources/farming/eggplant.png'),
    price: 5,
  },
  garlic: {
    key: 'garlic',
    name: 'Garlic',
    icon: require('../assets/resources/farming/garlic.png'),
    price: 5,
  },
  grapes: {
    key: 'grapes',
    name: 'Grapes',
    icon: require('../assets/resources/farming/grapes.png'),
    price: 14,
  },
  lettuce: {
    key: 'lettuce',
    name: 'Lettuce',
    icon: require('../assets/resources/farming/lettuce.png'),
    price: 14,
  },
  onion: {
    key: 'onion',
    name: 'Onion',
    icon: require('../assets/resources/farming/onion.png'),
    price: 33,
  },
  potato: {
    key: 'potato',
    name: 'Potato',
    icon: require('../assets/resources/farming/potato.png'),
    price: 33,
  },
  peas: {
    key: 'peas',
    name: 'Peas',
    icon: require('../assets/resources/farming/peas.png'),
    price: 331,
  },
  radish: {
    key: 'radish',
    name: 'Radish',
    icon: require('../assets/resources/farming/radish.png'),
    price: 681,
  },
  tomato: {
    key: 'tomato',
    name: 'Tomato',
    icon: require('../assets/resources/farming/tomato.png'),
    price: 158,
  },
  yellow_pepper: {
    key: 'yellow_pepper',
    name: 'Yellow Pepper',
    icon: require('../assets/resources/farming/yellow_pepper.png'),
    price: 158,
  },
  rice: {
    key: 'rice',
    name: 'Rice',
    icon: require('../assets/resources/farming/rice.png'),
    price: 4,
  },
};

type IngredientKey = 'hamburger_patty';

export const ingredients: Record<IngredientKey, Resource> = {
  hamburger_patty: {
    key: 'hamburger_patty',
    name: 'Hamburger Patty',
    icon: require('../assets/resources/cooking/patty.png'),
  },
};

// FORAGING
type ForagingKey =
  | 'button_mushroom'
  | 'fly_agaric'
  | 'penny_bun'
  | 'chanterelle'
  | 'morel'
  | 'parrot_waxcap'
  | 'pixies_parasol'
  | 'witchs_hat'
  | 'violet_webcap'
  | 'grapes'
  | 'spring_onion'
  | 'coconut'
  | 'banana'
  | 'pineapple'
  | 'apple'
  | 'apricot'
  | 'cherry'
  | 'chili_pepper'
  | 'dragon_fruit'
  | 'kiwi'
  | 'lemon'
  | 'orange'
  | 'papaya'
  | 'pear'
  | 'pomegranate'
  | 'raspberry'
  | 'strawberry'
  | 'blueberry'
  | 'watermelon'
  | 'oyster';

export const foraging: Record<ForagingKey, Resource> = {
  button_mushroom: {
    key: 'button_mushroom',
    name: 'Button Mushroom',
    icon: require('../assets/resources/foraging/white_mushroom.png'),
    price: 14,
  },
  fly_agaric: {
    key: 'fly_agaric',
    name: 'Fly Agaric',
    icon: require('../assets/resources/foraging/mushrooms.png'),
    price: 5,
  },
  penny_bun: {
    key: 'penny_bun',
    name: 'Penny Bun',
    icon: require('../assets/resources/foraging/brown_mushroom.png'),
    price: 33,
  },
  chanterelle: {
    key: 'chanterelle',
    name: 'Chanterelle',
    icon: require('../assets/resources/foraging/chanterelle_mushroom.png'),
    price: 73,
  },
  morel: {
    key: 'morel',
    name: 'Morel',
    icon: require('../assets/resources/foraging/morel_mushroom.png'),
    price: 158,
  },
  parrot_waxcap: {
    key: 'parrot_waxcap',
    name: 'Parrot Waxcap',
    icon: require('../assets/resources/foraging/parrot_waxcap_mushroom.png'),
    price: 213,
  },
  pixies_parasol: {
    key: 'pixies_parasol',
    name: "Pixie's Parasol",
    icon: require('../assets/resources/foraging/pixies_parasol_mushroom.png'),
    price: 331,
  },
  witchs_hat: {
    key: 'witchs_hat',
    name: "Witch's Hat",
    icon: require('../assets/resources/foraging/witchs_hat_mushroom.png'),
    price: 443,
  },
  violet_webcap: {
    key: 'violet_webcap',
    name: 'Violet Webcap',
    icon: require('../assets/resources/foraging/purple_mushroom.png'),
    price: 20,
  },
  grapes: {
    key: 'grapes',
    name: 'Grapes',
    icon: require('../assets/resources/foraging/grapes.png'),
    price: 14,
  },
  spring_onion: {
    key: 'spring_onion',
    name: 'Spring Onion',
    icon: require('../assets/resources/foraging/spring_onion.png'),
    price: 1,
  },
  coconut: {
    key: 'coconut',
    name: 'Coconut',
    icon: require('../assets/resources/foraging/coconut.png'),
    price: 33,
  },
  banana: {
    key: 'banana',
    name: 'Banana',
    icon: require('../assets/resources/foraging/banana.png'),
    price: 5,
  },
  pineapple: {
    key: 'pineapple',
    name: 'Pineapple',
    icon: require('../assets/resources/foraging/pineapple.png'),
    price: 73,
  },
  apple: {
    key: 'apple',
    name: 'Apple',
    icon: require('../assets/resources/foraging/apple.png'),
    price: 5,
  },
  apricot: {
    key: 'apricot',
    name: 'Apricot',
    icon: require('../assets/resources/foraging/apricot.png'),
    price: 331,
  },
  cherry: {
    key: 'cherry',
    name: 'Cherry',
    icon: require('../assets/resources/foraging/cherry.png'),
    price: 14,
  },
  chili_pepper: {
    key: 'chili_pepper',
    name: 'Chili Pepper',
    icon: require('../assets/resources/foraging/chili.png'),
    price: 33,
  },
  dragon_fruit: {
    key: 'dragon_fruit',
    name: 'Dragon Fruit',
    icon: require('../assets/resources/foraging/dragonfruit.png'),
    price: 681,
  },
  kiwi: {
    key: 'kiwi',
    name: 'Kiwi',
    icon: require('../assets/resources/foraging/kiwi.png'),
    price: 158,
  },
  lemon: {
    key: 'lemon',
    name: 'Lemon',
    icon: require('../assets/resources/foraging/lemon.png'),
    price: 33,
  },
  orange: {
    key: 'orange',
    name: 'Orange',
    icon: require('../assets/resources/foraging/orange.png'),
    price: 681,
  },
  papaya: {
    key: 'papaya',
    name: 'Papaya',
    icon: require('../assets/resources/foraging/papaya.png'),
    price: 331,
  },
  pear: {
    key: 'pear',
    name: 'Pear',
    icon: require('../assets/resources/foraging/pear.png'),
    price: 14,
  },
  pomegranate: {
    key: 'pomegranate',
    name: 'Pomegranate',
    icon: require('../assets/resources/foraging/pomegranate.png'),
    price: 331,
  },
  raspberry: {
    key: 'raspberry',
    name: 'Raspberry',
    icon: require('../assets/resources/foraging/raspberry.png'),
    price: 73,
  },
  strawberry: {
    key: 'strawberry',
    name: 'Strawberry',
    icon: require('../assets/resources/foraging/strawberry.png'),
    price: 158,
  },
  blueberry: {
    key: 'blueberry',
    name: 'Blueberry',
    icon: require('../assets/resources/foraging/blueberries.png'),
    price: 158,
  },
  watermelon: {
    key: 'watermelon',
    name: 'Watermelon',
    icon: require('../assets/resources/foraging/watermelon.png'),
    price: 331,
  },
  oyster: {
    key: 'oyster',
    name: 'Oyster',
    icon: require('../assets/resources/foraging/oyster.png'),
    price: 5,
  },
};

type HuntingKey =
  | 'bear'
  | 'bear_hide'
  | 'bear_meat'
  | 'deer'
  | 'deer_hide'
  | 'deer_meat'
  | 'wolf'
  | 'wolf_hide'
  | 'wolf_meat'
  | 'rabbit'
  | 'rabbit_hide'
  | 'squirrel'
  | 'squirrel_hide'
  | 'squirrel_meat'
  | 'moose'
  | 'moose_hide'
  | 'moose_sausage'
  | 'hog'
  | 'hog_leg'
  | 'hog_hide'
  | 'fox'
  | 'fox_hide'
  | 'fox_meat'
  | 'bird_1'
  | 'bird_1_meat'
  | 'bird_2'
  | 'bird_2_meat'
  | 'bird_2_feather';

// HUNTING
export const hunting: Record<HuntingKey, Resource> = {
  bear: {
    key: 'bear',
    name: 'Bear',
    icon: require('../assets/resources/hunting/bear_t1.png'),
    price: 681,
  },
  bear_hide: {
    key: 'bear_hide',
    name: 'Bear Hide',
    icon: require('../assets/resources/hunting/bear_t2.png'),
    price: 4,
  },
  bear_meat: {
    key: 'bear_meat',
    name: 'Bear Meat',
    icon: require('../assets/resources/hunting/bear_steak.png'),
    price: 4,
  },
  deer: {
    key: 'deer',
    name: 'Deer',
    icon: require('../assets/resources/hunting/deer_t1.png'),
    price: 213,
  },
  deer_hide: {
    key: 'deer_hide',
    name: 'Deer Hide',
    icon: require('../assets/resources/hunting/deer_t2.png'),
    price: 4,
  },
  deer_meat: {
    key: 'deer_meat',
    name: 'Deer Meat',
    icon: require('../assets/resources/hunting/deer_meat.png'),
    price: 4,
  },
  wolf: {
    key: 'wolf',
    name: 'Wolf',
    icon: require('../assets/resources/hunting/wolf_t1.png'),
    price: 443,
  },
  wolf_hide: {
    key: 'wolf_hide',
    name: 'Wolf Hide',
    icon: require('../assets/resources/hunting/wolf_t2.png'),
    price: 4,
  },
  wolf_meat: {
    key: 'wolf_meat',
    name: 'Wolf Meat',
    icon: require('../assets/resources/hunting/wolf_meat.png'),
    price: 4,
  },
  rabbit: {
    key: 'rabbit',
    name: 'Rabbit',
    icon: require('../assets/resources/hunting/rabbit_t1.png'),
    price: 73,
  },
  rabbit_hide: {
    key: 'rabbit_hide',
    name: 'Rabbit Hide',
    icon: require('../assets/resources/hunting/rabbit_t2.png'),
    price: 4,
  },
  squirrel: {
    key: 'squirrel',
    name: 'Squirrel',
    icon: require('../assets/resources/hunting/squirrel_t1.png'),
    price: 33,
  },
  squirrel_hide: {
    key: 'squirrel_hide',
    name: 'Squirrel Hide',
    icon: require('../assets/resources/hunting/squirrel_t2.png'),
    price: 4,
  },
  squirrel_meat: {
    key: 'squirrel_meat',
    name: 'Squirrel Meat',
    icon: require('../assets/resources/hunting/squirrel_meat.png'),
    price: 4,
  },
  moose: {
    key: 'moose',
    name: 'Moose',
    icon: require('../assets/resources/hunting/moose_t1.png'),
    price: 331,
  },
  moose_hide: {
    key: 'moose_hide',
    name: 'Moose Hide',
    icon: require('../assets/resources/hunting/moose_t2.png'),
    price: 993,
  },
  moose_sausage: {
    key: 'moose_sausage',
    name: 'Moose Sausage',
    icon: require('../assets/resources/hunting/sausage.png'),
    price: 4,
  },
  hog: {
    key: 'hog',
    name: 'Hog',
    icon: require('../assets/resources/hunting/hog_t1.png'),
    price: 100,
  },
  hog_leg: {
    key: 'hog_leg',
    name: 'Hog Leg',
    icon: require('../assets/resources/hunting/hog_leg.png'),
    price: 4,
  },
  hog_hide: {
    key: 'hog_hide',
    name: 'Hog Hide',
    icon: require('../assets/resources/hunting/hog_t2.png'),
    price: 4,
  },
  fox: {
    key: 'fox',
    name: 'Fox',
    icon: require('../assets/resources/hunting/fox_t1.png'),
    price: 4,
  },
  fox_hide: {
    key: 'fox_hide',
    name: 'Fox Hide',
    icon: require('../assets/resources/hunting/fox_t2.png'),
    price: 4,
  },
  fox_meat: {
    key: 'fox_meat',
    name: 'Fox Meat',
    icon: require('../assets/resources/hunting/fox_meat.png'),
    price: 4,
  },
  bird_1: {
    key: 'bird_1',
    name: 'Bird 1',
    icon: require('../assets/resources/hunting/bird_1_t1.png'),
    price: 5,
  },
  bird_1_meat: {
    key: 'bird_1_meat',
    name: 'Bird 1 Meat',
    icon: require('../assets/resources/hunting/bird_1_meat.png'),
    price: 15,
  },
  bird_2: {
    key: 'bird_2',
    name: 'Bird 2',
    icon: require('../assets/resources/hunting/bird_2_t1.png'),
    price: 14,
  },
  bird_2_meat: {
    key: 'bird_2_meat',
    name: 'Bird 2 Meat',
    icon: require('../assets/resources/hunting/bird_2_meat.png'),
    price: 4,
  },
  bird_2_feather: {
    key: 'bird_2_feather',
    name: 'Bird 2 Feather',
    icon: require('../assets/resources/hunting/bird_t2_02.png'),
    price: 4,
  },
};

type MiscKey =
  | 'boots'
  | 'basket'
  | 'saw'
  | 'axe'
  | 'pickaxe'
  | 'hammer'
  | 'fishing_rod'
  | 'pan'
  | 'pliers'
  | 'alchemy'
  | 'hunting'
  | 'reputation'
  | 'combat'
  | 'farming';

// MISC (SKILL ICONS, TOOLS, ETC)
export const misc: Record<MiscKey, Resource> = {
  boots: {
    key: 'boots',
    name: 'Boots',
    icon: require('../assets/tools/boots.png'),
    price: 4,
  },
  basket: {
    key: 'basket',
    name: 'Basket',
    icon: require('../assets/tools/basket.png'),
    price: 4,
  },
  saw: {
    key: 'saw',
    name: 'Saw',
    icon: require('../assets/tools/saw.png'),
    price: 4,
  },
  axe: {
    key: 'axe',
    name: 'Axe',
    icon: require('../assets/tools/axe.png'),
    price: 4,
  },
  pickaxe: {
    key: 'pickaxe',
    name: 'Pickaxe',
    icon: require('../assets/tools/pickaxe.png'),
    price: 4,
  },
  hammer: {
    key: 'hammer',
    name: 'Hammer',
    icon: require('../assets/tools/hammer.png'),
    price: 4,
  },
  fishing_rod: {
    key: 'fishing_rod',
    name: 'Fishing Rod',
    icon: require('../assets/tools/fishing_rod.png'),
    price: 4,
  },
  pan: {
    key: 'pan',
    name: 'Pan',
    icon: require('../assets/tools/pan.png'),
    price: 4,
  },
  pliers: {
    key: 'pliers',
    name: 'Pliers',
    icon: require('../assets/tools/pliers.png'),
    price: 4,
  },
  alchemy: {
    key: 'alchemy',
    name: 'Alchemy',
    icon: require('../assets/icons/alchemy.png'),
    price: 4,
  },
  hunting: {
    key: 'hunting',
    name: 'Hunting',
    icon: require('../assets/icons/hunting.png'),
    price: 4,
  },
  reputation: {
    key: 'reputation',
    name: 'Reputation',
    icon: require('../assets/icons/reputation.png'),
    price: 4,
  },
  combat: {
    key: 'combat',
    name: 'Combat',
    icon: require('../assets/icons/combat.png'),
    price: 4,
  },
  farming: {
    key: 'farming',
    name: 'Farming',
    icon: require('../assets/icons/farming.png'),
    price: 4,
  },
};

type CombatKey = 'slime' | 'poison_mushroom' | 'brown_mushroom' | 'cursed_pine_log';

export const combat: Record<CombatKey, Resource> = {
  slime: {
    key: 'slime',
    name: 'Slime',
    icon: require('../assets/resources/combat/slime_loot.png'),
  },
  poison_mushroom: {
    key: 'poison_mushroom',
    name: 'Poison Mushroom',
    icon: require('../assets/resources/foraging/mushrooms.png'),
  },
  brown_mushroom: {
    key: 'brown_mushroom',
    name: 'Brown Mushroom',
    icon: require('../assets/resources/foraging/brown_mushroom.png'),
  },
  cursed_pine_log: {
    key: 'cursed_pine_log',
    name: 'Cursed Pine Log',
    icon: require('../assets/resources/woodcutting/pine_log.png'),
    price: 4,
  },
};

type ResourceKey =
  | ToolPartKey
  | OreKey
  | GemKey
  | BarKey
  | LogKey
  | PlankKey
  | HandleKey
  | ForagingKey
  | HuntingKey
  | MiscKey
  | CombatKey;

// Optionally, export a flat allResources object for compatibility
export const allResources: Record<ResourceKey, Resource> = {
  ...toolParts,
  ...ores,
  ...gems,
  ...bars,
  ...logs,
  ...planks,
  ...handles,
  ...fish,
  ...foraging,
  ...farming,
  ...ingredients,
  ...hunting,
  ...misc,
  ...combat,
};
