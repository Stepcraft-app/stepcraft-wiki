import { promises as fs } from 'fs';
import path from 'path';

// Location data type based on map.ts structure
type Location = {
  id: string;
  name: string;
  description: string;
  allowedActions: Record<string, string[]>;
  hasImage: boolean;
  isOutskirts: boolean;
  mainLocationId?: string;
};

// Manual location data extracted from map.ts actionDefinitions
const locations: Location[] = [
  {
    id: 'silverleaf_refuge',
    name: 'Silverleaf Refuge',
    description: 'A serene island sanctuary where ancient silverleaf trees grow beside crystal-clear waters. The unique wood from these rare trees shimmers with an inner light, while the surrounding streams teem with fish drawn to the magical runoff.',
    allowedActions: {
      fishing: ['salmon', 'catfish', 'chub', 'carp', 'largemouth_bass', 'smallmouth_bass', 'shad', 'scorpion_carp', 'eldritch_bass'],
      woodcutting: ['silverleaf_log', 'sticks']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'silverleaf_refuge_outskirts',
    name: 'Silverleaf Refuge Outskirts',
    description: 'A serene island sanctuary where ancient silverleaf trees grow beside crystal-clear waters. The unique wood from these rare trees shimmers with an inner light, while the surrounding streams teem with fish drawn to the magical runoff.',
    allowedActions: {
      fishing: ['salmon'],
      woodcutting: ['sticks']
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'silverleaf_refuge'
  },
  {
    id: 'thornspire_ruins',
    name: 'Thornspire Ruins',
    description: 'Once a proud elven watchtower, now crumbling stone haunted by restless spirits. Dark energy seeps from the broken walls, attracting both supernatural entities and those brave enough to forage among the thorny undergrowth.',
    allowedActions: {
      woodcutting: ['redwood_log', 'sticks'],
      foraging: ['cherry', 'chili_pepper', 'raspberry', 'strawberry', 'pomegranate'],
      combat: ['ghost_slime', 'common_rat', 'bat_rat', 'rotten_rat', 'black_ghost', 'blue_ghost', 'red_ghost']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'titans_rest',
    name: "Titan's Rest",
    description: "Legend says a titan fell here ages ago, its body becoming the mineral-rich cliffs. Miners work the stone quarries by day, uncovering veins of precious ore where the titan's essence crystallized.",
    allowedActions: {
      mining: ['stone', 'copper_ore', 'iron_ore', 'red_ore'],
      woodcutting: ['birch_log', 'oak_log', 'sticks']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'titans_rest_outskirts',
    name: "Titan's Rest Outskirts",
    description: "Legend says a titan fell here ages ago, its body becoming the mineral-rich cliffs. Miners work the stone quarries by day, uncovering veins of precious ore where the titan's essence crystallized.",
    allowedActions: {
      mining: ['stone', 'copper_ore'],
      woodcutting: ['sticks']
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'titans_rest'
  },
  {
    id: 'ironheart_cliffs',
    name: 'Ironheart Cliffs',
    description: 'Towering cliffs of red stone where the rarest ores hide deep within the rock face. The harsh winds and sheer drops make mining treacherous, but the rewards of gold and mystical gems draw the bold.',
    allowedActions: {
      mining: ['silver_ore', 'gold_ore', 'blue_ore', 'red_ore', 'copper_ore', 'iron_ore'],
      woodcutting: ['eldritchwood_log', 'sticks']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'ironheart_cliffs_outskirts',
    name: 'Ironheart Cliffs Outskirts',
    description: 'Towering cliffs of red stone where the rarest ores hide deep within the rock face. The harsh winds and sheer drops make mining treacherous, but the rewards of gold and mystical gems draw the bold.',
    allowedActions: {
      mining: ['silver_ore'],
      woodcutting: ['sticks']
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'ironheart_cliffs'
  },
  {
    id: 'crimson_garden',
    name: 'Crimson Garden',
    description: "A hidden orchard where fruit trees grow wild, their leaves forever tinged red by ancient magic. The sweet scent of berries and exotic fruits fills the air, carefully tended by those who know the garden's secrets.",
    allowedActions: {
      foraging: ['apple', 'cherry', 'chili_pepper', 'raspberry', 'strawberry', 'pomegranate', 'dragonfruit'],
      woodcutting: ['redwood_log', 'sticks']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'verdant_isle',
    name: 'Verdant Isle',
    description: "The largest island in the southern waters, blessed with abundant life. Dense forests, hidden coves for fishing, and wild game make it a paradise for those seeking nature's bounty.",
    allowedActions: {
      fishing: ['flying_fish', 'red_drum', 'grouper', 'octopus', 'squid', 'pufferfish', 'peach_jellyfish', 'cycloptopus'],
      woodcutting: ['oak_log', 'sticks'],
      foraging: ['pear', 'lemon', 'kiwi', 'apricot', 'orange'],
      hunting: ['hunting_resources'] // allRecipesForAction('hunting')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'pearlsand_strand_docks',
    name: 'Pearlsand Strand Docks',
    description: 'Where the river meets the sea, creating beaches of glistening sand. Fishermen cast their lines for deep-water catches.',
    allowedActions: {
      fishing: ['shrimp', 'sardine', 'crab', 'blue_crab', 'rockfish', 'lobster', 'albacore', 'stingray', 'swordfish', 'orb_octopus']
    },
    hasImage: false,
    isOutskirts: false
  },
  {
    id: 'pearlsand_strand',
    name: 'Pearlsand Strand',
    description: 'Where the river meets the sea, creating beaches of glistening sand. Foragers comb the shores for tropical fruits and rare shells washed in by the tides.',
    allowedActions: {
      foraging: ['banana', 'coconut', 'pineapple', 'papaya', 'starfish', 'oyster']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'crystalrun_river',
    name: 'Crystalrun River',
    description: 'Its waters sparkle with trace magic. Rainbow trout and salmon leap through the rapids, while fishermen tell tales of the mystical catches found in deeper pools.',
    allowedActions: {
      fishing: ['salmon', 'rainbow_trout', 'pike', 'tiger_trout', 'chattahochee_bass', 'lingcod', 'sea_snake'],
      woodcutting: ['sticks']
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'moonmere',
    name: 'Moonmere',
    description: 'A peaceful lake that perfectly reflects the night sky, surrounded by mixed forest. The still waters hide unusual fish species, while the shoreline offers both timber and wild edibles to those who know where to look.',
    allowedActions: {
      fishing: ['tilapia', 'beige_snapper', 'dwarf_goby', 'red_rainbowfish', 'woodskip', 'shoal', 'green_sunfish'],
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      foraging: ['foraging_resources'] // allRecipesForAction('foraging')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'hollow_crown',
    name: 'Hollow Crown',
    description: 'An ancient meeting hall of the old kingdoms, now overrun by corruption. Though dangerous, crafters still use its intact workshops, and alchemists seek reagents in its depths.',
    allowedActions: {
      crafting: ['crafting_resources'], // allRecipesForAction('crafting')
      combat: ['green_slime', 'red_mushroom', 'brown_mushroom', 'purple_mushroom', 'stick_ent', 'oak_ent', 'pine_ent'],
      alchemy: ['alchemy_resources'] // allRecipesForAction('alchemy')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'heart_grove',
    name: 'Heart Grove',
    description: "The sacred center of Willow's Reach, where the ancient tree's roots drink from an ever-flowing spring. Elder Mirae tends the grove, teaching the alchemical arts amid the rare flowers that bloom only here.",
    allowedActions: {
      alchemy: ['alchemy_resources'] // allRecipesForAction('alchemy')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'heart_grove_outskirts',
    name: 'Heart Grove Outskirts',
    description: "The sacred center of Willow's Reach, where the ancient tree's roots drink from an ever-flowing spring. Elder Mirae tends the grove, teaching the alchemical arts amid the rare flowers that bloom only here.",
    allowedActions: {
      alchemy: ['alchemy_resources'] // allRecipesForAction('alchemy')
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'heart_grove'
  },
  {
    id: 'blooming_glade',
    name: 'Blooming Glade',
    description: "Vibrant meadows surrounding the village and Heart Grove, where wildflowers carpet the earth. The community farms thrive here, blessed by the grove's influence and tended by generations of elven farmers.",
    allowedActions: {
      foraging: ['grapes', 'chili_pepper', 'raspberry', 'strawberry'],
      woodcutting: ['sticks'],
      farming: ['farming_resources'] // allRecipesForAction('farming')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'blooming_glade_outskirts',
    name: 'Blooming Glade Outskirts',
    description: "Vibrant meadows surrounding the village and Heart Grove, where wildflowers carpet the earth. The community farms thrive here, blessed by the grove's influence and tended by generations of elven farmers.",
    allowedActions: {
      foraging: ['grapes', 'chili_pepper', 'raspberry', 'strawberry'],
      woodcutting: ['sticks']
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'blooming_glade'
  },
  {
    id: 'willowbend_plaza',
    name: 'Willowbend Plaza',
    description: 'The bustling heart of village life, where craft halls and workshops cluster around the central market. The smell of fresh bread mingles with forge smoke as artisans practice their trades and merchants hawk their wares.',
    allowedActions: {
      cooking: ['cooking_resources'], // allRecipesForAction('cooking')
      smithing: ['smithing_resources'], // allRecipesForAction('smithing')
      crafting: ['crafting_resources'], // allRecipesForAction('crafting')
      trinketry: ['trinketry_resources'], // allRecipesForAction('trinketry')
      reputation: ['reputation_resources'], // allRecipesForAction('reputation')
      carpentry: ['carpentry_resources'] // allRecipesForAction('carpentry')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'willowbend_village',
    name: 'Willowbend Village',
    description: 'The bustling heart of village life, where craft halls and workshops cluster around the central market. The smell of fresh bread mingles with forge smoke as artisans practice their trades and merchants hawk their wares.',
    allowedActions: {
      reputation: ['reputation_resources'] // allRecipesForAction('reputation')
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'willowbend_plaza'
  },
  {
    id: 'sunforge_sands',
    name: 'Sunforge Sands',
    description: 'A wasteland of scorching dunes that separates elven and dwarven lands. The bones of ancient creatures bleach in the sun, while elemental beings stir in the heat-warped air, guarding the treacherous passage.',
    allowedActions: {
      crafting: ['crafting_resources'], // allRecipesForAction('crafting')
      combat: ['flame_slime', 'earth_lich', 'ice_lich', 'flame_lich', 'clay_golem', 'metal_golem', 'amethyst_golem'],
      alchemy: ['alchemy_resources'] // allRecipesForAction('alchemy')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'sunforge_wastelands',
    name: 'Sunforge Wastelands',
    description: 'A wasteland of scorching dunes that separates elven and dwarven lands. The bones of ancient creatures bleach in the sun, while elemental beings stir in the heat-warped air, guarding the treacherous passage.',
    allowedActions: {
      alchemy: ['alchemy_resources'] // allRecipesForAction('alchemy')
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'sunforge_sands'
  },
  {
    id: 'mycelwood_thicket',
    name: 'Mycelwood Thicket',
    description: 'A dense woodland where giant mushrooms grow as tall as trees, creating a twilight world beneath their caps. Herbalists prize the rare fungi found here, though hunters must be wary of what stalks the shadowy undergrowth.',
    allowedActions: {
      foraging: ['foraging_resources'], // allRecipesForAction('foraging')
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      hunting: ['hunting_resources'] // allRecipesForAction('hunting')
    },
    hasImage: true,
    isOutskirts: false
  },
  {
    id: 'mycelwood_thicket_outskirts',
    name: 'Mycelwood Thicket Outskirts',
    description: 'A dense woodland where giant mushrooms grow as tall as trees, creating a twilight world beneath their caps. Herbalists prize the rare fungi found here, though hunters must be wary of what stalks the shadowy undergrowth.',
    allowedActions: {
      woodcutting: ['oak_log', 'pine_log', 'sticks'],
      hunting: ['hunting_resources'] // allRecipesForAction('hunting')
    },
    hasImage: false,
    isOutskirts: true,
    mainLocationId: 'mycelwood_thicket'
  }
];

function getSkillIcon(skill: string): string {
  const skillIcons: Record<string, string> = {
    fishing: '🎣',
    woodcutting: '🪓',
    mining: '⛏️',
    foraging: '🌿',
    hunting: '🏹',
    farming: '🌾',
    cooking: '🍳',
    smithing: '🔨',
    crafting: '⚒️',
    trinketry: '💍',
    alchemy: '⚗️',
    carpentry: '🪚',
    combat: '⚔️',
    reputation: '🤝'
  };
  return skillIcons[skill] || '🔧';
}

function getSkillColor(skill: string): string {
  const skillColors: Record<string, string> = {
    fishing: 'blue',
    woodcutting: 'green',
    mining: 'stone',
    foraging: 'purple',
    hunting: 'red',
    farming: 'lime',
    cooking: 'orange',
    smithing: 'gray',
    crafting: 'yellow',
    trinketry: 'pink',
    alchemy: 'indigo',
    carpentry: 'amber',
    combat: 'red',
    reputation: 'teal'
  };
  return skillColors[skill] || 'gray';
}

function getDangerLevel(location: Location): { level: string; description: string; color: string } {
  const hasCombat = location.allowedActions.combat && location.allowedActions.combat.length > 0;
  const combatEnemies = location.allowedActions.combat || [];
  
  if (!hasCombat) {
    return { level: 'Safe', description: 'No hostile creatures reported', color: 'green' };
  }
  
  // Determine danger based on enemy types
  const hasHighTierEnemies = combatEnemies.some(enemy => 
    enemy.includes('lich') || enemy.includes('golem')
  );
  const hasMidTierEnemies = combatEnemies.some(enemy => 
    enemy.includes('ghost') || enemy.includes('ent')
  );
  
  if (hasHighTierEnemies) {
    return { level: 'Extreme', description: 'Elite enemies present - end-game equipment required', color: 'red' };
  } else if (hasMidTierEnemies) {
    return { level: 'High', description: 'Dangerous creatures - advanced equipment recommended', color: 'orange' };
  } else {
    return { level: 'Moderate', description: 'Some hostile creatures - basic combat preparation advised', color: 'yellow' };
  }
}

function getLocationImage(location: Location): string {
  if (location.hasImage) {
    return `/assets/locations/${location.id}.png`;
  } else if (location.isOutskirts && location.mainLocationId) {
    return `/assets/locations/${location.mainLocationId}.png`;
  } else {
    // Default fallback image
    return '/assets/locations/willowbend_plaza.png';
  }
}

function formatResourceList(resources: string[]): string {
  if (resources.length === 0) return 'None';
  if (resources.includes('foraging_resources') || resources.includes('hunting_resources') || 
      resources.includes('crafting_resources') || resources.includes('alchemy_resources') ||
      resources.includes('cooking_resources') || resources.includes('smithing_resources') ||
      resources.includes('trinketry_resources') || resources.includes('farming_resources') ||
      resources.includes('carpentry_resources') || resources.includes('reputation_resources')) {
    return 'All available recipes for this skill';
  }
  
  return resources.map(resource => {
    const formatted = resource.replace(/_/g, ' ');
    return `[${formatted.charAt(0).toUpperCase() + formatted.slice(1)}](/docs/resources/individual/${resource})`;
  }).join(', ');
}

function generateLocationPage(location: Location): string {
  const dangerLevel = getDangerLevel(location);
  const locationImage = getLocationImage(location);
  
  let activitiesSection = '';
  if (Object.keys(location.allowedActions).length > 0) {
    activitiesSection = `## Available Activities

${Object.entries(location.allowedActions).map(([skill, resources]) => `
### ${getSkillIcon(skill)} ${skill.charAt(0).toUpperCase() + skill.slice(1)}

**Available Resources/Actions:** ${formatResourceList(resources)}

*Visit the [${skill.charAt(0).toUpperCase() + skill.slice(1)} skill guide](/docs/skills/individual/${skill}) for more information.*
`).join('')}`;
  }

  let outskirtSection = '';
  if (location.isOutskirts && location.mainLocationId) {
    outskirtSection = `
## Main Location

This is an outskirt area of **[${locations.find(l => l.id === location.mainLocationId)?.name}](/docs/map/individual/${location.mainLocationId})**. Outskirt areas typically offer:
- Reduced resource variety compared to the main location
- Lower-tier materials and opportunities
- Safer conditions for beginners
- Less crowded gathering spots

Visit the main location for the full range of activities and resources.
`;
  }

  let relatedLocations = '';
  if (!location.isOutskirts) {
    const outskirts = locations.find(l => l.isOutskirts && l.mainLocationId === location.id);
    if (outskirts) {
      relatedLocations = `
## Related Areas

**[${outskirts.name}](/docs/map/individual/${outskirts.id})** - Outskirt area with limited activities suitable for beginners.
`;
    }
  }

  return `---
title: ${location.name}
description: ${location.name} - Explore this ${location.isOutskirts ? 'outskirt area' : 'region'} in Stepcraft
---

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${locationImage}" alt="${location.name}" className="w-32 h-32 border rounded-lg object-cover" />
  </div>
  <div className="flex-1">
    <div className="space-y-3">
      <p className="text-lg text-muted-foreground">${location.description}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Type:** ${location.isOutskirts ? 'Outskirt Area' : 'Main Region'}
        </span>
        <span className="px-3 py-1 bg-${dangerLevel.color}-100 dark:bg-${dangerLevel.color}-900 rounded-md">
          **Danger Level:** ${dangerLevel.level}
        </span>
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-md">
          **Activities:** ${Object.keys(location.allowedActions).length}
        </span>
      </div>
    </div>
  </div>
</div>

## Location Overview

${location.description}

**Safety Information:** ${dangerLevel.description}

${outskirtSection}

${activitiesSection}

## Skill Badges

<div className="flex flex-wrap gap-2 my-4">
${Object.keys(location.allowedActions).map(skill => 
  `  <span className="inline-flex items-center gap-1 px-3 py-1 bg-${getSkillColor(skill)}-100 dark:bg-${getSkillColor(skill)}-900 rounded-full text-sm">
    ${getSkillIcon(skill)} [${skill.charAt(0).toUpperCase() + skill.slice(1)}](/docs/skills/individual/${skill})
  </span>`
).join('\n')}
</div>

${relatedLocations}

## Strategic Information

### Best For
${getBestForList(location)}

### Tips for Visitors
${getVisitorTips(location)}

## Navigation

- [← Back to World Map](/docs/map)
- [Browse All Locations](/docs/map/individual)
- [Skills Guide](/docs/skills)
- [Resources Catalog](/docs/resources)
${location.allowedActions.combat ? '- [Enemy Bestiary](/docs/enemies)' : ''}
- [Search All Content](/search)
`;
}

function getBestForList(location: Location): string {
  const suggestions = [];
  
  if (location.allowedActions.fishing) {
    suggestions.push('🎣 **Fishing enthusiasts** - Diverse aquatic resources available');
  }
  if (location.allowedActions.mining) {
    suggestions.push('⛏️ **Miners** - Rich ore deposits and stone quarries');
  }
  if (location.allowedActions.foraging) {
    suggestions.push('🌿 **Foragers** - Abundant wild plants and fruits');
  }
  if (location.allowedActions.hunting) {
    suggestions.push('🏹 **Hunters** - Wildlife and game animals');
  }
  if (location.allowedActions.combat) {
    suggestions.push('⚔️ **Combat training** - Hostile creatures for experience');
  }
  if (location.allowedActions.crafting || location.allowedActions.smithing || location.allowedActions.cooking) {
    suggestions.push('🔨 **Artisans** - Crafting facilities and workshops');
  }
  if (location.isOutskirts) {
    suggestions.push('🆕 **Beginners** - Safer environment with basic resources');
  }
  
  return suggestions.length > 0 ? suggestions.join('\n') : '- **All adventurers** - Something for everyone';
}

function getVisitorTips(location: Location): string {
  const tips = [];
  
  if (location.allowedActions.combat) {
    tips.push('⚔️ **Combat Areas:** Come prepared with appropriate equipment and healing items');
  }
  if (location.allowedActions.mining) {
    tips.push('⛏️ **Mining:** Bring a good pickaxe and expect competition for rare ore veins');
  }
  if (location.allowedActions.fishing) {
    tips.push('🎣 **Fishing:** Different fish may require specific bait types');
  }
  if (location.isOutskirts) {
    tips.push('🌟 **Outskirt Area:** Perfect for learning new skills with reduced risk');
  }
  if (location.name.includes('Ruins') || location.name.includes('Crown')) {
    tips.push('🏚️ **Ancient Location:** Explore carefully - danger and treasure often go hand in hand');
  }
  
  if (tips.length === 0) {
    tips.push('🗺️ **General:** Take time to explore and discover what this location has to offer');
  }
  
  return tips.join('\n');
}

async function main() {
  console.log('🔄 Generating individual location pages...');
  
  const outputDir = path.join(process.cwd(), 'contents', 'docs', 'map', 'individual');
  
  // Create the directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  let generatedCount = 0;
  const totalLocations = locations.length;
  
  for (const location of locations) {
    const pageContent = generateLocationPage(location);
    const fileName = `${location.id}.mdx`;
    const filePath = path.join(outputDir, fileName);
    
    await fs.writeFile(filePath, pageContent);
    generatedCount++;
    
    if (generatedCount % 5 === 0 || generatedCount === totalLocations) {
      console.log(`  📝 Generated ${generatedCount}/${totalLocations} location pages...`);
    }
  }
  
  console.log('\\n✅ Successfully generated all location pages!');
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`📊 Generated ${generatedCount} location pages`);
  console.log(`\\n📋 Location pages generated by type:`);
  
  // Count by type
  const mainLocations = locations.filter(l => !l.isOutskirts).length;
  const outskirtAreas = locations.filter(l => l.isOutskirts).length;
  
  console.log(`  • Main Regions: ${mainLocations} pages`);
  console.log(`  • Outskirt Areas: ${outskirtAreas} pages`);
  
  console.log(`\\n🔗 All pages accessible at /docs/map/individual/[location-id]`);
}

main().catch(console.error);