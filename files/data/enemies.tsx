import { ReactNode } from 'react';
import { createEnemyComponent } from '../src/components/encounters/enemyFactory';

export type Enemy = {
  name: string;
  key: string;
  icon: string;
  animation: (ref: React.RefObject<any>) => ReactNode;
  hp: number;
  atk: number;
  def: number;
};

// Create all enemy components
const GreenSlime = createEnemyComponent('green_slime');
const RedMushroom = createEnemyComponent('red_mushroom');
const BrownMushroom = createEnemyComponent('brown_mushroom');
const PurpleMushroom = createEnemyComponent('purple_mushroom');
const StickEnt = createEnemyComponent('stick_ent');
const OakEnt = createEnemyComponent('oak_ent');
const PineEnt = createEnemyComponent('pine_ent');
const GhostSlime = createEnemyComponent('ghost_slime');
const CommonRat = createEnemyComponent('common_rat');
const BatRat = createEnemyComponent('bat_rat');
const RottenRat = createEnemyComponent('rotten_rat');
const BlackGhost = createEnemyComponent('black_ghost');
const BlueGhost = createEnemyComponent('blue_ghost');
const RedGhost = createEnemyComponent('red_ghost');
const FlameSlime = createEnemyComponent('flame_slime');
const EarthLich = createEnemyComponent('earth_lich');
const IceLich = createEnemyComponent('ice_lich');
const FlameLich = createEnemyComponent('flame_lich');
const ClayGolem = createEnemyComponent('clay_golem');
const MetalGolem = createEnemyComponent('metal_golem');
const AmethystGolem = createEnemyComponent('amethyst_golem');

type EnemyKey =
  | 'green_slime'
  | 'red_mushroom'
  | 'brown_mushroom'
  | 'purple_mushroom'
  | 'stick_ent'
  | 'oak_ent'
  | 'pine_ent'
  | 'ghost_slime'
  | 'common_rat'
  | 'bat_rat'
  | 'rotten_rat'
  | 'black_ghost'
  | 'blue_ghost'
  | 'red_ghost'
  | 'flame_slime'
  | 'earth_lich'
  | 'ice_lich'
  | 'flame_lich'
  | 'clay_golem'
  | 'metal_golem'
  | 'amethyst_golem';

export const enemies: Record<EnemyKey, Enemy> = {
  // T0 Enemies (Player: ~170 HP, 40 ATK, 25 DEF)
  green_slime: {
    name: 'Green Slime',
    key: 'green_slime',
    icon: require('../assets/enemies/green_slime/slime.png'),
    animation: (ref) => <GreenSlime ref={ref} />,
    hp: 60,
    atk: 10,
    def: 3,
  },
  red_mushroom: {
    name: 'Red Mushroom',
    key: 'red_mushroom',
    icon: require('../assets/enemies/red_mushroom/mushroom.png'),
    animation: (ref) => <RedMushroom ref={ref} />,
    hp: 120,
    atk: 40,
    def: 12,
  },

  // T1 Enemies (Player: ~230 HP, 60 ATK, 38 DEF)
  brown_mushroom: {
    name: 'Brown Mushroom',
    key: 'brown_mushroom',
    icon: require('../assets/enemies/brown_mushroom/mushroom.png'),
    animation: (ref) => <BrownMushroom ref={ref} />,
    hp: 150,
    atk: 55,
    def: 18,
  },
  purple_mushroom: {
    name: 'Purple Mushroom',
    key: 'purple_mushroom',
    icon: require('../assets/enemies/purple_mushroom/mushroom.png'),
    animation: (ref) => <PurpleMushroom ref={ref} />,
    hp: 190,
    atk: 65,
    def: 22,
  },
  ghost_slime: {
    name: 'Ghost Slime',
    key: 'ghost_slime',
    icon: require('../assets/enemies/ghost_slime/slime.png'),
    animation: (ref) => <GhostSlime ref={ref} />,
    hp: 180,
    atk: 60,
    def: 20,
  },

  // T2 Enemies (Player: ~300 HP, 95 ATK, 60 DEF)
  stick_ent: {
    name: 'Stick Ent',
    key: 'stick_ent',
    icon: require('../assets/enemies/stick_ent/ent.png'),
    animation: (ref) => <StickEnt ref={ref} />,
    hp: 280,
    atk: 80,
    def: 25,
  },
  oak_ent: {
    name: 'Oak Ent',
    key: 'oak_ent',
    icon: require('../assets/enemies/oak_ent/ent.png'),
    animation: (ref) => <OakEnt ref={ref} />,
    hp: 350,
    atk: 90,
    def: 30,
  },
  common_rat: {
    name: 'Common Rat',
    key: 'common_rat',
    icon: require('../assets/enemies/common_rat/rat.png'),
    animation: (ref) => <CommonRat ref={ref} />,
    hp: 220,
    atk: 85,
    def: 22,
  },
  bat_rat: {
    name: 'Bat Rat',
    key: 'bat_rat',
    icon: require('../assets/enemies/bat_rat/rat.png'),
    animation: (ref) => <BatRat ref={ref} />,
    hp: 280,
    atk: 95,
    def: 28,
  },

  // T3 Enemies (Player: ~480 HP, 175 ATK, 95 DEF)
  pine_ent: {
    name: 'Pine Ent',
    key: 'pine_ent',
    icon: require('../assets/enemies/pine_ent/ent.png'),
    animation: (ref) => <PineEnt ref={ref} />,
    hp: 450,
    atk: 120,
    def: 35,
  },
  rotten_rat: {
    name: 'Rotten Rat',
    key: 'rotten_rat',
    icon: require('../assets/enemies/rotten_rat/rat.png'),
    animation: (ref) => <RottenRat ref={ref} />,
    hp: 420,
    atk: 115,
    def: 32,
  },
  black_ghost: {
    name: 'Black Ghost',
    key: 'black_ghost',
    icon: require('../assets/enemies/black_ghost/ghost.png'),
    animation: (ref) => <BlackGhost ref={ref} />,
    hp: 520,
    atk: 130,
    def: 38,
  },
  flame_slime: {
    name: 'Flame Slime',
    key: 'flame_slime',
    icon: require('../assets/enemies/flame_slime/slime.png'),
    animation: (ref) => <FlameSlime ref={ref} />,
    hp: 480,
    atk: 125,
    def: 36,
  },

  // T4 Enemies (Player: ~650 HP, 250 ATK, 130 DEF)
  blue_ghost: {
    name: 'Blue Ghost',
    key: 'blue_ghost',
    icon: require('../assets/enemies/blue_ghost/ghost.png'),
    animation: (ref) => <BlueGhost ref={ref} />,
    hp: 700,
    atk: 160,
    def: 45,
  },
  red_ghost: {
    name: 'Red Ghost',
    key: 'red_ghost',
    icon: require('../assets/enemies/red_ghost/ghost.png'),
    animation: (ref) => <RedGhost ref={ref} />,
    hp: 850,
    atk: 175,
    def: 52,
  },
  earth_lich: {
    name: 'Earth Lich',
    key: 'earth_lich',
    icon: require('../assets/enemies/earth_lich/lich.png'),
    animation: (ref) => <EarthLich ref={ref} />,
    hp: 780,
    atk: 165,
    def: 48,
  },
  ice_lich: {
    name: 'Ice Lich',
    key: 'ice_lich',
    icon: require('../assets/enemies/ice_lich/lich.png'),
    animation: (ref) => <IceLich ref={ref} />,
    hp: 900,
    atk: 180,
    def: 55,
  },

  // T5 Enemies (Player: ~900 HP, 370 ATK, 180 DEF)
  flame_lich: {
    name: 'Flame Lich',
    key: 'flame_lich',
    icon: require('../assets/enemies/flame_lich/lich.png'),
    animation: (ref) => <FlameLich ref={ref} />,
    hp: 1100,
    atk: 220,
    def: 65,
  },
  clay_golem: {
    name: 'Clay Golem',
    key: 'clay_golem',
    icon: require('../assets/enemies/clay_golem/golem.png'),
    animation: (ref) => <ClayGolem ref={ref} />,
    hp: 1300,
    atk: 240,
    def: 75,
  },

  // T6 Enemies (Player: ~1200 HP, 525 ATK, 290 DEF)
  metal_golem: {
    name: 'Metal Golem',
    key: 'metal_golem',
    icon: require('../assets/enemies/metal_golem/golem.png'),
    animation: (ref) => <MetalGolem ref={ref} />,
    hp: 1600,
    atk: 330,
    def: 90,
  },
  amethyst_golem: {
    name: 'Amethyst Golem',
    key: 'amethyst_golem',
    icon: require('../assets/enemies/amethyst_golem/golem.png'),
    animation: (ref) => <AmethystGolem ref={ref} />,
    hp: 1900,
    atk: 370,
    def: 110,
  },
};
