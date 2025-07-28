import { promises as fs } from 'fs';
import path from 'path';

// Enemy type definition based on the enemies.tsx file
type Enemy = {
  name: string;
  key: string;
  icon: string;
  hp: number;
  atk: number;
  def: number;
};

// Enemy tier information
type TierInfo = {
  tier: string;
  playerStats: string;
  color: string;
};

const tierMapping: Record<string, TierInfo> = {
  'green_slime': { tier: 'T0', playerStats: '~170 HP, 40 ATK, 25 DEF', color: 'green' },
  'red_mushroom': { tier: 'T0', playerStats: '~170 HP, 40 ATK, 25 DEF', color: 'green' },
  'brown_mushroom': { tier: 'T1', playerStats: '~230 HP, 60 ATK, 38 DEF', color: 'blue' },
  'purple_mushroom': { tier: 'T1', playerStats: '~230 HP, 60 ATK, 38 DEF', color: 'blue' },
  'ghost_slime': { tier: 'T1', playerStats: '~230 HP, 60 ATK, 38 DEF', color: 'blue' },
  'stick_ent': { tier: 'T2', playerStats: '~300 HP, 95 ATK, 60 DEF', color: 'purple' },
  'oak_ent': { tier: 'T2', playerStats: '~300 HP, 95 ATK, 60 DEF', color: 'purple' },
  'common_rat': { tier: 'T2', playerStats: '~300 HP, 95 ATK, 60 DEF', color: 'purple' },
  'bat_rat': { tier: 'T2', playerStats: '~300 HP, 95 ATK, 60 DEF', color: 'purple' },
  'pine_ent': { tier: 'T3', playerStats: '~480 HP, 175 ATK, 95 DEF', color: 'orange' },
  'rotten_rat': { tier: 'T3', playerStats: '~480 HP, 175 ATK, 95 DEF', color: 'orange' },
  'black_ghost': { tier: 'T3', playerStats: '~480 HP, 175 ATK, 95 DEF', color: 'orange' },
  'flame_slime': { tier: 'T3', playerStats: '~480 HP, 175 ATK, 95 DEF', color: 'orange' },
  'blue_ghost': { tier: 'T4', playerStats: '~650 HP, 250 ATK, 130 DEF', color: 'red' },
  'red_ghost': { tier: 'T4', playerStats: '~650 HP, 250 ATK, 130 DEF', color: 'red' },
  'earth_lich': { tier: 'T4', playerStats: '~650 HP, 250 ATK, 130 DEF', color: 'red' },
  'ice_lich': { tier: 'T4', playerStats: '~650 HP, 250 ATK, 130 DEF', color: 'red' },
  'flame_lich': { tier: 'T5', playerStats: '~900 HP, 370 ATK, 180 DEF', color: 'yellow' },
  'clay_golem': { tier: 'T5', playerStats: '~900 HP, 370 ATK, 180 DEF', color: 'yellow' },
  'metal_golem': { tier: 'T6', playerStats: '~1200 HP, 525 ATK, 290 DEF', color: 'purple' },
  'amethyst_golem': { tier: 'T6', playerStats: '~1200 HP, 525 ATK, 290 DEF', color: 'purple' },
};

// Manual enemy data extracted from enemies.tsx
const enemies: Record<string, Enemy> = {
  green_slime: { name: 'Green Slime', key: 'green_slime', icon: '/assets/enemies/green_slime/slime.png', hp: 60, atk: 10, def: 3 },
  red_mushroom: { name: 'Red Mushroom', key: 'red_mushroom', icon: '/assets/enemies/red_mushroom/mushroom.png', hp: 120, atk: 40, def: 12 },
  brown_mushroom: { name: 'Brown Mushroom', key: 'brown_mushroom', icon: '/assets/enemies/brown_mushroom/mushroom.png', hp: 150, atk: 55, def: 18 },
  purple_mushroom: { name: 'Purple Mushroom', key: 'purple_mushroom', icon: '/assets/enemies/purple_mushroom/mushroom.png', hp: 190, atk: 65, def: 22 },
  ghost_slime: { name: 'Ghost Slime', key: 'ghost_slime', icon: '/assets/enemies/ghost_slime/slime.png', hp: 180, atk: 60, def: 20 },
  stick_ent: { name: 'Stick Ent', key: 'stick_ent', icon: '/assets/enemies/stick_ent/ent.png', hp: 280, atk: 80, def: 25 },
  oak_ent: { name: 'Oak Ent', key: 'oak_ent', icon: '/assets/enemies/oak_ent/ent.png', hp: 350, atk: 90, def: 30 },
  common_rat: { name: 'Common Rat', key: 'common_rat', icon: '/assets/enemies/common_rat/rat.png', hp: 220, atk: 85, def: 22 },
  bat_rat: { name: 'Bat Rat', key: 'bat_rat', icon: '/assets/enemies/bat_rat/rat.png', hp: 280, atk: 95, def: 28 },
  pine_ent: { name: 'Pine Ent', key: 'pine_ent', icon: '/assets/enemies/pine_ent/ent.png', hp: 450, atk: 120, def: 35 },
  rotten_rat: { name: 'Rotten Rat', key: 'rotten_rat', icon: '/assets/enemies/rotten_rat/rat.png', hp: 420, atk: 115, def: 32 },
  black_ghost: { name: 'Black Ghost', key: 'black_ghost', icon: '/assets/enemies/black_ghost/ghost.png', hp: 520, atk: 130, def: 38 },
  flame_slime: { name: 'Flame Slime', key: 'flame_slime', icon: '/assets/enemies/flame_slime/slime.png', hp: 480, atk: 125, def: 36 },
  blue_ghost: { name: 'Blue Ghost', key: 'blue_ghost', icon: '/assets/enemies/blue_ghost/ghost.png', hp: 700, atk: 160, def: 45 },
  red_ghost: { name: 'Red Ghost', key: 'red_ghost', icon: '/assets/enemies/red_ghost/ghost.png', hp: 850, atk: 175, def: 52 },
  earth_lich: { name: 'Earth Lich', key: 'earth_lich', icon: '/assets/enemies/earth_lich/lich.png', hp: 780, atk: 165, def: 48 },
  ice_lich: { name: 'Ice Lich', key: 'ice_lich', icon: '/assets/enemies/ice_lich/lich.png', hp: 900, atk: 180, def: 55 },
  flame_lich: { name: 'Flame Lich', key: 'flame_lich', icon: '/assets/enemies/flame_lich/lich.png', hp: 1100, atk: 220, def: 65 },
  clay_golem: { name: 'Clay Golem', key: 'clay_golem', icon: '/assets/enemies/clay_golem/golem.png', hp: 1300, atk: 240, def: 75 },
  metal_golem: { name: 'Metal Golem', key: 'metal_golem', icon: '/assets/enemies/metal_golem/golem.png', hp: 1600, atk: 330, def: 90 },
  amethyst_golem: { name: 'Amethyst Golem', key: 'amethyst_golem', icon: '/assets/enemies/amethyst_golem/golem.png', hp: 1900, atk: 370, def: 110 },
};

function getEnemyType(enemyKey: string): string {
  if (enemyKey.includes('slime')) return 'Slime';
  if (enemyKey.includes('mushroom')) return 'Mushroom';
  if (enemyKey.includes('ent')) return 'Ent';
  if (enemyKey.includes('rat')) return 'Rat';
  if (enemyKey.includes('ghost')) return 'Ghost';
  if (enemyKey.includes('lich')) return 'Lich';
  if (enemyKey.includes('golem')) return 'Golem';
  return 'Unknown';
}

function getDifficultyDescription(tier: string): string {
  switch (tier) {
    case 'T0': return 'Beginner-friendly enemies perfect for new players learning combat mechanics.';
    case 'T1': return 'Low-tier enemies that require basic combat skills and decent equipment.';
    case 'T2': return 'Mid-tier enemies requiring upgraded equipment and tactical awareness.';
    case 'T3': return 'Challenging enemies that demand high-quality gear and combat experience.';
    case 'T4': return 'Formidable foes requiring end-game equipment and advanced strategies.';
    case 'T5': return 'Elite enemies that challenge even veteran players with top-tier gear.';
    case 'T6': return 'Ultimate adversaries representing the pinnacle of combat difficulty.';
    default: return 'A dangerous enemy requiring careful preparation.';
  }
}

function generateEnemyPage(enemy: Enemy): string {
  const tierInfo = tierMapping[enemy.key];
  const enemyType = getEnemyType(enemy.key);
  const difficultyDesc = getDifficultyDescription(tierInfo.tier);

  return `---
title: ${enemy.name}
description: ${enemy.name} - ${enemyType} enemy in Stepcraft
---

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${enemy.icon}" alt="${enemy.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">${difficultyDesc}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Type:** ${enemyType}
        </span>
        <span className="px-2 py-1 bg-${tierInfo.color}-100 dark:bg-${tierInfo.color}-900 rounded-md">
          **Tier:** ${tierInfo.tier}
        </span>
        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 rounded-md">
          **Difficulty:** ${tierInfo.tier === 'T0' || tierInfo.tier === 'T1' ? 'Easy' : tierInfo.tier === 'T2' || tierInfo.tier === 'T3' ? 'Medium' : 'Hard'}
        </span>
      </div>
    </div>
  </div>
</div>

## Enemy Stats

| Stat | Value |
|------|-------|
| **Health Points (HP)** | ${enemy.hp} |
| **Attack (ATK)** | ${enemy.atk} |
| **Defense (DEF)** | ${enemy.def} |
| **Tier** | ${tierInfo.tier} |
| **Type** | ${enemyType} |

## Combat Information

### Recommended Player Stats
For comfortable combat against this enemy, players should have approximately:
- **${tierInfo.playerStats}**

### Combat Tips
${getCombatTips(enemy, tierInfo.tier)}

## Tier Information

**${tierInfo.tier}** enemies are designed for players with **${tierInfo.playerStats}**. ${difficultyDesc}

## Related Content

### Similar Enemies
Browse other [${enemyType}](/docs/enemies#${enemyType.toLowerCase()}s) enemies or explore the [${tierInfo.tier}](/docs/enemies#tier-${tierInfo.tier.toLowerCase().replace('t', '')}-${tierInfo.tier.toLowerCase()}) tier.

### Combat Resources
- [Combat Skill Guide](/docs/skills/individual/combat)
- [Equipment and Gear](/docs/items)
- [Combat Strategies](/docs/getting-started)

## Navigation

- [← Back to Enemies Catalog](/docs/enemies)
- [Browse ${enemyType}s](/docs/enemies#${enemyType.toLowerCase()}s)
- [View ${tierInfo.tier} Enemies](/docs/enemies#tier-${tierInfo.tier.toLowerCase().replace('t', '')}-${tierInfo.tier.toLowerCase()})
- [Search All Enemies](/search)
`;
}

function getCombatTips(enemy: Enemy, tier: string): string {
  const type = getEnemyType(enemy.key);
  
  let baseTips = '';
  
  // Type-specific tips
  switch (type) {
    case 'Slime':
      baseTips = '- Slimes have moderate health but low defense, making them vulnerable to sustained attacks\n- Watch for their bouncing movement patterns';
      break;
    case 'Mushroom':
      baseTips = '- Mushrooms are stationary but hit hard when you get close\n- Use ranged attacks when possible or hit-and-run tactics';
      break;
    case 'Ent':
      baseTips = '- Ents have high health and defense but move slowly\n- Circle around them to avoid their powerful attacks';
      break;
    case 'Rat':
      baseTips = '- Rats are fast and aggressive, requiring quick reflexes\n- Focus on timing your attacks between their rushes';
      break;
    case 'Ghost':
      baseTips = '- Ghosts can phase through attacks occasionally\n- Be patient and wait for clear openings';
      break;
    case 'Lich':
      baseTips = '- Liches are powerful spellcasters with high damage\n- Interrupt their casting when possible and use hit-and-run tactics';
      break;
    case 'Golem':
      baseTips = '- Golems have massive health and defense but attack slowly\n- Focus on sustained damage and avoid their devastating attacks';
      break;
    default:
      baseTips = '- Study the enemy\'s attack patterns and adapt your strategy accordingly';
  }
  
  // Tier-specific tips
  let tierTips = '';
  switch (tier) {
    case 'T0':
    case 'T1':
      tierTips = '- Good for learning basic combat mechanics\n- Basic equipment should suffice';
      break;
    case 'T2':
    case 'T3':
      tierTips = '- Ensure your equipment is upgraded\n- Stock up on healing potions';
      break;
    case 'T4':
    case 'T5':
      tierTips = '- High-tier equipment is essential\n- Master your combat skills before engaging\n- Consider using combat potions for buffs';
      break;
    case 'T6':
      tierTips = '- Only attempt with the best available equipment\n- Use all available combat buffs and consumables\n- Perfect your combat timing and positioning';
      break;
  }
  
  return baseTips + '\\n' + tierTips;
}

async function main() {
  console.log('🔄 Generating individual enemy pages...');
  
  const outputDir = path.join(process.cwd(), 'contents', 'docs', 'enemies', 'individual');
  
  // Create the directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  let generatedCount = 0;
  const totalEnemies = Object.keys(enemies).length;
  
  for (const [enemyKey, enemy] of Object.entries(enemies)) {
    const pageContent = generateEnemyPage(enemy);
    const fileName = `${enemyKey}.mdx`;
    const filePath = path.join(outputDir, fileName);
    
    await fs.writeFile(filePath, pageContent);
    generatedCount++;
    
    if (generatedCount % 5 === 0 || generatedCount === totalEnemies) {
      console.log(`  📝 Generated ${generatedCount}/${totalEnemies} enemy pages...`);
    }
  }
  
  console.log('\\n✅ Successfully generated all enemy pages!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📊 Generated ${generatedCount} enemy pages`);
  console.log(`\\n📋 Enemy pages generated by type:`);
  
  // Count by type
  const typeCounts: Record<string, number> = {};
  for (const enemyKey of Object.keys(enemies)) {
    const type = getEnemyType(enemyKey);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`  • ${type}s: ${count} pages`);
  }
  
  console.log(`\\n🔗 All pages accessible at /docs/enemies/individual/[enemy-key]`);
}

main().catch(console.error);