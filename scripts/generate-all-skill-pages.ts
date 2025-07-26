import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/skills/individual');

// Interface for skill information
interface SkillInfo {
  key: string;
  name: string;
  icon: string;
  color: string;
  location: { name: string; image: string };
  tool: { name: string; image: string };
  xpPerLevel: number;
  xpGrowthFactor: number;
  recipes: RecipeInfo[];
  description: string;
  category: string;
}

// Interface for recipe information
interface RecipeInfo {
  key: string;
  name: string;
  inputs: { name: string; amount: number }[];
  outputs: { name: string; amount: number }[];
  requiredLevel?: number;
  requiredTool?: string;
  xpReward?: number;
  requiredSteps: number;
}

// Extract skill data from skills.ts file
async function extractSkillsData(): Promise<SkillInfo[]> {
  try {
    const skillsPath = path.resolve(process.cwd(), 'files/data/skills.ts');
    const skillsContent = await fs.readFile(skillsPath, 'utf-8');
    
    const skills: SkillInfo[] = [];
    
    // Helper function to extract asset path from require statement
    const extractAssetPath = (requireStr: string): string => {
      const match = requireStr.match(/require\(['"`]([^'"`]+)['"`]\)/);
      if (match && match[1]) {
        return match[1].replace('../assets', '/assets');
      }
      return '/assets/icons/question.png';
    };
    
    // Extract the main skills array
    const skillsMatch = skillsContent.match(/export const skills:\s*SkillDef\[\]\s*=\s*\[([\s\S]*?)\];/);
    if (!skillsMatch) return skills;
    
    const skillsSection = skillsMatch[1];
    
    // Parse each skill definition
    const skillMatches = skillsSection.match(/{\s*key:\s*['"`]([^'"`]+)['"`][\s\S]*?recipes:\s*\[([\s\S]*?)\]\s*,?\s*}/g);
    if (!skillMatches) return skills;
    
    skillMatches.forEach(skillMatch => {
      const keyMatch = skillMatch.match(/key:\s*['"`]([^'"`]+)['"`]/);
      const nameMatch = skillMatch.match(/name:\s*['"`]([^'"`]+)['"`]/);
      const iconMatch = skillMatch.match(/icon:\s*(require\([^)]+\))/);
      const colorMatch = skillMatch.match(/color:\s*['"`]([^'"`]+)['"`]/);
      const locationNameMatch = skillMatch.match(/location:\s*{\s*name:\s*['"`]([^'"`]+)['"`]/);
      const locationImageMatch = skillMatch.match(/location:\s*{[^}]*image:\s*(require\([^)]+\))/);
      const toolNameMatch = skillMatch.match(/tool:\s*{[^}]*name:\s*['"`]([^'"`]+)['"`]/);
      const xpPerLevelMatch = skillMatch.match(/xpPerLevel:\s*(\d+)/);
      const xpGrowthFactorMatch = skillMatch.match(/xpGrowthFactor:\s*([\d.]+)/);
      const recipesMatch = skillMatch.match(/recipes:\s*\[([\s\S]*?)\]/);
      
      if (!keyMatch || !nameMatch) return;
      
      const skillKey = keyMatch[1];
      
      // Use predefined recipes based on skill key
      const recipes: RecipeInfo[] = getSkillRecipes(skillKey);
      
      const skill: SkillInfo = {
        key: skillKey,
        name: nameMatch[1],
        icon: iconMatch ? extractAssetPath(iconMatch[1]) : '/assets/icons/question.png',
        color: colorMatch ? colorMatch[1] : 'bg-gray-600',
        location: {
          name: locationNameMatch ? locationNameMatch[1] : 'Unknown Location',
          image: locationImageMatch ? extractAssetPath(locationImageMatch[1]) : '/assets/icons/question.png'
        },
        tool: {
          name: toolNameMatch ? toolNameMatch[1] : 'Various Tools',
          image: '/assets/icons/question.png'
        },
        xpPerLevel: xpPerLevelMatch ? parseInt(xpPerLevelMatch[1]) : 100,
        xpGrowthFactor: xpGrowthFactorMatch ? parseFloat(xpGrowthFactorMatch[1]) : 1.1,
        recipes: recipes,
        description: getSkillDescription(skillKey),
        category: getSkillCategory(skillKey)
      };
      
      skills.push(skill);
    });
    
    return skills;
    
  } catch (error) {
    console.error('Error extracting skills data:', error);
    return [];
  }
}

// Get skill description based on skill key
function getSkillDescription(skillKey: string): string {
  const descriptions: Record<string, string> = {
    'mining': 'Extract valuable ores and gems from the earth using pickaxes. Higher skill levels unlock access to rare materials and deeper mining locations.',
    'smithing': 'Transform raw ores into refined bars and craft powerful weapons, armor, and tools at the forge. Master smiths can create legendary equipment.',
    'carpentry': 'Work with wood to create planks, handles, and wooden items. Essential for tool crafting and construction projects.',
    'crafting': 'Combine materials and components to create advanced tools, weapons, and equipment. The backbone of item creation.',
    'cooking': 'Prepare delicious and nutritious meals from raw ingredients. Cooked food provides better health restoration than raw materials.',
    'fishing': 'Cast your line to catch various fish species from different water bodies. A peaceful and rewarding way to gather food.',
    'foraging': 'Gather wild plants, mushrooms, and natural resources from the wilderness. Knowledge of nature and keen observation are key.',
    'woodcutting': 'Fell trees to obtain logs for construction and crafting. Different tree types yield different wood qualities and rarities.',
    'alchemy': 'Brew powerful potions and elixirs using magical ingredients. Master alchemists can create miraculous concoctions with incredible effects.',
    'hunting': 'Track and hunt wild animals for meat, hides, and other valuable materials. Requires patience and combat skills.',
    'trinketry': 'Craft beautiful jewelry and accessories from precious gems and metals. Create rings, amulets, and decorative items.',
    'agility': 'Improve movement speed, reflexes, and dexterity through training and practice. Enhanced mobility and combat effectiveness.',
    'combat': 'Master the arts of war, weapon handling, and tactical combat skills. Essential for surviving dangerous encounters.',
    'farming': 'Cultivate crops and manage agricultural activities. Sustainable food production and resource management for long-term success.',
    'reputation': 'Build relationships with NPCs and factions throughout the world. Higher reputation unlocks special opportunities and exclusive rewards.'
  };
  
  return descriptions[skillKey] || 'A skill that contributes to your character\'s development and capabilities in the world of Stepcraft.';
}

// Get predefined recipes for each skill
function getSkillRecipes(skillKey: string): RecipeInfo[] {
  const skillRecipes: Record<string, RecipeInfo[]> = {
    'mining': [
      { key: 'stone', name: 'Mine Stone', inputs: [], outputs: [{ name: 'Stone', amount: 1 }], xpReward: 10, requiredSteps: 50 },
      { key: 'copper_ore', name: 'Mine Copper Ore', inputs: [], outputs: [{ name: 'Copper Ore', amount: 1 }], requiredLevel: 15, xpReward: 20, requiredSteps: 75 },
      { key: 'iron_ore', name: 'Mine Iron Ore', inputs: [], outputs: [{ name: 'Iron Ore', amount: 1 }], requiredLevel: 30, xpReward: 40, requiredSteps: 100, requiredTool: 'copper' },
      { key: 'silver_ore', name: 'Mine Silver Ore', inputs: [], outputs: [{ name: 'Silver Ore', amount: 1 }], requiredLevel: 45, xpReward: 80, requiredSteps: 125, requiredTool: 'iron' },
      { key: 'gold_ore', name: 'Mine Gold Ore', inputs: [], outputs: [{ name: 'Gold Ore', amount: 1 }], requiredLevel: 60, xpReward: 160, requiredSteps: 150, requiredTool: 'silver' },
      { key: 'blue_ore', name: 'Mine Blue Ore', inputs: [], outputs: [{ name: 'Blue Ore', amount: 1 }], requiredLevel: 75, xpReward: 320, requiredSteps: 175, requiredTool: 'gold' },
      { key: 'red_ore', name: 'Mine Red Ore', inputs: [], outputs: [{ name: 'Red Ore', amount: 1 }], requiredLevel: 90, xpReward: 640, requiredSteps: 200, requiredTool: 'blue' }
    ],
    'smithing': [
      { key: 'stone_brick', name: 'Carve Stone Brick', inputs: [{ name: 'Stone', amount: 2 }], outputs: [{ name: 'Stone Brick', amount: 1 }], xpReward: 20, requiredSteps: 50 },
      { key: 'copper_bar', name: 'Smelt Copper Bar', inputs: [{ name: 'Copper Ore', amount: 2 }], outputs: [{ name: 'Copper Bar', amount: 1 }], requiredLevel: 15, xpReward: 40, requiredSteps: 75 },
      { key: 'iron_bar', name: 'Smelt Iron Bar', inputs: [{ name: 'Iron Ore', amount: 2 }], outputs: [{ name: 'Iron Bar', amount: 1 }], requiredLevel: 30, xpReward: 80, requiredSteps: 100 },
      { key: 'silver_bar', name: 'Smelt Silver Bar', inputs: [{ name: 'Silver Ore', amount: 2 }], outputs: [{ name: 'Silver Bar', amount: 1 }], requiredLevel: 45, xpReward: 160, requiredSteps: 125 },
      { key: 'gold_bar', name: 'Smelt Gold Bar', inputs: [{ name: 'Gold Ore', amount: 2 }], outputs: [{ name: 'Gold Bar', amount: 1 }], requiredLevel: 60, xpReward: 320, requiredSteps: 150 },
      { key: 'blue_bar', name: 'Smelt Blue Bar', inputs: [{ name: 'Blue Ore', amount: 2 }], outputs: [{ name: 'Blue Bar', amount: 1 }], requiredLevel: 75, xpReward: 640, requiredSteps: 175 },
      { key: 'red_bar', name: 'Smelt Red Bar', inputs: [{ name: 'Red Ore', amount: 2 }], outputs: [{ name: 'Red Bar', amount: 1 }], requiredLevel: 90, xpReward: 1280, requiredSteps: 200 },
      { key: 'copper_toolhead', name: 'Smelt Copper Toolhead', inputs: [{ name: 'Copper Bar', amount: 2 }], outputs: [{ name: 'Copper Toolhead', amount: 1 }], requiredLevel: 17, xpReward: 48, requiredSteps: 90 }
    ],
    'carpentry': [
      { key: 'crude_plank', name: 'Make Crude Plank', inputs: [{ name: 'Sticks', amount: 5 }], outputs: [{ name: 'Crude Plank', amount: 1 }], xpReward: 20, requiredSteps: 50 },
      { key: 'birch_plank', name: 'Make Birch Plank', inputs: [{ name: 'Birch Log', amount: 2 }], outputs: [{ name: 'Birch Plank', amount: 1 }], requiredLevel: 15, xpReward: 40, requiredSteps: 75 },
      { key: 'oak_plank', name: 'Make Oak Plank', inputs: [{ name: 'Oak Log', amount: 2 }], outputs: [{ name: 'Oak Plank', amount: 1 }], requiredLevel: 30, xpReward: 80, requiredSteps: 100 },
      { key: 'birch_handle', name: 'Make Birch Handle', inputs: [{ name: 'Birch Plank', amount: 2 }], outputs: [{ name: 'Birch Handle', amount: 1 }], requiredLevel: 17, xpReward: 48, requiredSteps: 90 },
      { key: 'oak_handle', name: 'Make Oak Handle', inputs: [{ name: 'Oak Plank', amount: 2 }], outputs: [{ name: 'Oak Handle', amount: 1 }], requiredLevel: 32, xpReward: 96, requiredSteps: 120 }
    ],
    'crafting': [
      { key: 'copper_pickaxe', name: 'Craft Copper Pickaxe', inputs: [{ name: 'Copper Toolhead', amount: 5 }, { name: 'Birch Handle', amount: 5 }], outputs: [{ name: 'Copper Pickaxe', amount: 1 }], requiredLevel: 15, xpReward: 40, requiredSteps: 75 },
      { key: 'iron_pickaxe', name: 'Craft Iron Pickaxe', inputs: [{ name: 'Iron Toolhead', amount: 5 }, { name: 'Oak Handle', amount: 5 }], outputs: [{ name: 'Iron Pickaxe', amount: 1 }], requiredLevel: 30, xpReward: 80, requiredSteps: 100 },
      { key: 'copper_axe', name: 'Craft Copper Axe', inputs: [{ name: 'Copper Toolhead', amount: 5 }, { name: 'Birch Handle', amount: 5 }], outputs: [{ name: 'Copper Axe', amount: 1 }], requiredLevel: 15, xpReward: 40, requiredSteps: 75 }
    ],
    'woodcutting': [
      { key: 'sticks', name: 'Gather Sticks', inputs: [], outputs: [{ name: 'Sticks', amount: 1 }], xpReward: 10, requiredSteps: 50 },
      { key: 'birch_log', name: 'Cut Birch Log', inputs: [], outputs: [{ name: 'Birch Log', amount: 1 }], requiredLevel: 15, xpReward: 20, requiredSteps: 75 },
      { key: 'oak_log', name: 'Cut Oak Log', inputs: [], outputs: [{ name: 'Oak Log', amount: 1 }], requiredLevel: 30, xpReward: 40, requiredSteps: 100 }
    ],
    'fishing': [
      { key: 'tilapia', name: 'Catch Tilapia', inputs: [], outputs: [{ name: 'Tilapia', amount: 1 }], xpReward: 10, requiredSteps: 50 },
      { key: 'bass', name: 'Catch Bass', inputs: [], outputs: [{ name: 'Bass', amount: 1 }], requiredLevel: 15, xpReward: 20, requiredSteps: 75 }
    ],
    'cooking': [
      { key: 'cooked_fish', name: 'Cook Fish', inputs: [{ name: 'Tilapia', amount: 1 }], outputs: [{ name: 'Cooked Fish', amount: 1 }], xpReward: 10, requiredSteps: 50 },
      { key: 'mushroom_dish', name: 'Cook Mushroom', inputs: [{ name: 'Button Mushroom', amount: 2 }], outputs: [{ name: 'Cooked Mushroom', amount: 1 }], xpReward: 15, requiredSteps: 60 }
    ],
    'foraging': [
      { key: 'button_mushroom', name: 'Gather Button Mushroom', inputs: [], outputs: [{ name: 'Button Mushroom', amount: 1 }], xpReward: 10, requiredSteps: 50 },
      { key: 'fly_agaric', name: 'Gather Fly Agaric', inputs: [], outputs: [{ name: 'Fly Agaric', amount: 1 }], requiredLevel: 15, xpReward: 20, requiredSteps: 75 }
    ],
    'alchemy': [
      { key: 'health_potion', name: 'Brew Health Potion', inputs: [{ name: 'Fly Agaric', amount: 2 }], outputs: [{ name: 'Health Potion', amount: 1 }], xpReward: 20, requiredSteps: 75 }
    ],
    'hunting': [
      { key: 'hunt_rabbit', name: 'Hunt Rabbit', inputs: [], outputs: [{ name: 'Rabbit Meat', amount: 1 }], xpReward: 15, requiredSteps: 60 }
    ],
    'farming': [
      { key: 'plant_wheat', name: 'Grow Wheat', inputs: [{ name: 'Wheat Seeds', amount: 1 }], outputs: [{ name: 'Wheat', amount: 3 }], xpReward: 25, requiredSteps: 200 }
    ]
  };
  
  return skillRecipes[skillKey] || [];
}

// Get skill category for organization
function getSkillCategory(skillKey: string): string {
  const categories: Record<string, string> = {
    'mining': 'Gathering',
    'fishing': 'Gathering', 
    'foraging': 'Gathering',
    'woodcutting': 'Gathering',
    'hunting': 'Gathering',
    'farming': 'Gathering',
    'smithing': 'Crafting',
    'carpentry': 'Crafting',
    'crafting': 'Crafting',
    'cooking': 'Crafting',
    'alchemy': 'Crafting',
    'trinketry': 'Crafting',
    'combat': 'Combat',
    'agility': 'Combat',
    'reputation': 'Social'
  };
  
  return categories[skillKey] || 'Miscellaneous';
}

// Generate individual skill page content
function generateSkillPageContent(skill: SkillInfo): string {
  const colorName = skill.color.replace('bg-', '').replace('-600', '');
  
  return `---
title: ${skill.name}
description: Master the ${skill.name} skill in Stepcraft - ${skill.description.split('.')[0].toLowerCase()}
---

# ${skill.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${skill.icon}" alt="${skill.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">${skill.description}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Category:** ${skill.category}
        </span>
        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-md">
          **Location:** ${skill.location.name}
        </span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md">
          **Tool:** ${skill.tool.name}
        </span>
        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 rounded-md">
          **Recipes:** ${skill.recipes.length}
        </span>
      </div>
    </div>
  </div>
</div>

## Skill Details

| Property | Value |
|----------|-------|
| **Skill Name** | ${skill.name} |
| **Skill Key** | \`${skill.key}\` |
| **Category** | ${skill.category} |
| **XP per Level** | ${skill.xpPerLevel} |
| **Growth Factor** | ${skill.xpGrowthFactor}x |
| **Location** | ${skill.location.name} |
| **Primary Tool** | ${skill.tool.name} |
| **Total Recipes** | ${skill.recipes.length} |

## Training Location

**${skill.location.name}** is where you'll practice and develop your ${skill.name} skills. This location provides the necessary environment and facilities for skill training.

${skill.recipes.length > 0 ? `
## Recipes

Master these ${skill.recipes.length} recipes to advance your ${skill.name} skill:

### Recipe List

| Recipe | Level | Tool | Inputs | Outputs | XP | Steps |
|:-------|:-----:|:----:|:-------|:--------|:--:|:-----:|
${skill.recipes.map(recipe => {
  const level = recipe.requiredLevel ? `Lv. ${recipe.requiredLevel}` : '-';
  const tool = recipe.requiredTool || '-';
  const inputs = recipe.inputs.length > 0 ? recipe.inputs.map(input => `${input.amount}x ${input.name}`).join('<br/>') : 'None';
  const outputs = recipe.outputs.length > 0 ? recipe.outputs.map(output => `${output.amount}x ${output.name}`).join('<br/>') : 'Various';
  const xp = recipe.xpReward || '-';
  const steps = recipe.requiredSteps;
  
  return `| **${recipe.name}** | ${level} | ${tool} | ${inputs} | ${outputs} | ${xp} | ${steps} |`;
}).join('\n')}

### Recipe Tiers

Recipes are organized into tiers based on level requirements:

${generateRecipeTiers(skill.recipes)}

### Progression Tips

- Start with basic recipes to build your skill level
- Higher-tier recipes require better tools and provide more XP
- Some recipes unlock access to rare materials and advanced crafting
- Focus on recipes that produce items you need for other skills
` : `
## Available Activities

This skill focuses on activities rather than traditional recipes:

- **Practice regularly** at ${skill.location.name}
- **Use appropriate tools** (${skill.tool.name}) for best results
- **Explore different areas** to discover new opportunities
- **Build relationships** that can enhance your skill development
`}

## Skill Synergies

${getSkillSynergies(skill.key)}

## Leveling Guide

### Early Levels (1-15)
- Focus on basic recipes and activities
- Learn the fundamentals of ${skill.name}
- Gather essential materials and tools

### Mid Levels (16-60)
- Unlock intermediate recipes and techniques
- Improve efficiency and quality
- Access better materials and tools

### Advanced Levels (61-90+)
- Master complex recipes and legendary items
- Achieve maximum efficiency and rare material access
- Unlock exclusive content and rewards

## Related Content

- [📋 Complete Skills Catalog](/docs/skills) - Browse all skills
- [🔍 Search Skills](/search) - Find specific recipes and techniques
- [📝 ${skill.category} Skills](/docs/skills#${skill.category.toLowerCase()}) - Browse similar skills

## Navigation

- [← Back to Skills Catalog](/docs/skills)
- [Browse ${skill.category} Skills](/docs/skills#${skill.category.toLowerCase()})
- [Search All Skills](/search)
`;
}

// Generate recipe tiers section
function generateRecipeTiers(recipes: RecipeInfo[]): string {
  const tiers = [
    { name: 'Basic (T0)', levels: '1-14', recipes: recipes.filter(r => !r.requiredLevel || r.requiredLevel < 15) },
    { name: 'Copper (T1)', levels: '15-29', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 15 && r.requiredLevel < 30) },
    { name: 'Iron (T2)', levels: '30-44', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 30 && r.requiredLevel < 45) },
    { name: 'Silver (T3)', levels: '45-59', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 45 && r.requiredLevel < 60) },
    { name: 'Gold (T4)', levels: '60-74', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 60 && r.requiredLevel < 75) },
    { name: 'Blue (T5)', levels: '75-89', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 75 && r.requiredLevel < 90) },
    { name: 'Red (T6)', levels: '90+', recipes: recipes.filter(r => r.requiredLevel && r.requiredLevel >= 90) }
  ];
  
  return tiers
    .filter(tier => tier.recipes.length > 0)
    .map(tier => `- **${tier.name}** (Levels ${tier.levels}): ${tier.recipes.length} recipes`)
    .join('\n');
}

// Get skill synergies
function getSkillSynergies(skillKey: string): string {
  const synergies: Record<string, string> = {
    'mining': '**Smithing** to process ores into bars • **Trinketry** to cut and polish gems • **Crafting** to create mining tools',
    'smithing': '**Mining** for raw ore materials • **Crafting** to combine components • **Combat** to wield crafted weapons effectively',
    'carpentry': '**Woodcutting** for log materials • **Crafting** to assemble tools • **Construction** for building projects',
    'crafting': '**Smithing** for metal components • **Carpentry** for wooden parts • **All skills** benefit from crafted tools',
    'cooking': '**Fishing** for fresh ingredients • **Farming** for crops • **Foraging** for wild ingredients • **Hunting** for meat',
    'fishing': '**Cooking** to prepare catches • **Alchemy** for rare fish ingredients • **Trading** for valuable species',
    'foraging': '**Alchemy** for potion ingredients • **Cooking** for wild foods • **Farming** for cultivated alternatives',
    'woodcutting': '**Carpentry** to process logs • **Crafting** for tool handles • **Construction** for building materials',
    'alchemy': '**Foraging** for ingredients • **Hunting** for creature materials • **Farming** for cultivated herbs',
    'hunting': '**Combat** for dangerous prey • **Cooking** for meat preparation • **Alchemy** for creature components',
    'trinketry': '**Mining** for precious gems • **Smithing** for metal settings • **Trading** for valuable jewelry',
    'agility': '**Combat** for improved performance • **All gathering skills** for faster movement • **Hunting** for better tracking',
    'combat': '**Smithing** for weapons and armor • **Alchemy** for combat potions • **Agility** for enhanced performance',
    'farming': '**Cooking** for crop preparation • **Alchemy** for herb cultivation • **Trading** for agricultural products',
    'reputation': '**Trading** for better prices • **All skills** for NPC interactions • **Quests** for faction relationships'
  };
  
  return synergies[skillKey] || 'This skill enhances your overall gameplay experience and complements other character development activities.';
}

// Generate all skill pages
async function generateAllSkillPages() {
  console.log('🔄 Generating individual skill pages...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('📖 Extracting skills data from source files...');
    const skills = await extractSkillsData();
    
    if (skills.length === 0) {
      console.error('❌ No skills extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${skills.length} skills to generate pages for`);
    
    // Generate pages for each skill
    let generatedCount = 0;
    const categoryCount: Record<string, number> = {};
    
    for (const skill of skills) {
      try {
        const pageContent = generateSkillPageContent(skill);
        const fileName = `${skill.key}.mdx`;
        const filePath = path.join(outputDir, fileName);
        
        await fs.writeFile(filePath, pageContent);
        generatedCount++;
        
        // Track category counts
        categoryCount[skill.category] = (categoryCount[skill.category] || 0) + 1;
        
        console.log(`  📝 Generated page for ${skill.name} (${skill.recipes.length} recipes)`);
      } catch (error) {
        console.error(`❌ Error generating page for ${skill.name}:`, error);
      }
    }
    
    console.log('\n✅ Successfully generated all skill pages!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📊 Generated ${generatedCount} skill pages`);
    console.log('\n📋 Pages generated by category:');
    
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  • ${category}: ${count} pages`);
      });
    
    console.log(`\n🔗 All pages accessible at /docs/skills/individual/[skill-key]`);
    
  } catch (error) {
    console.error('❌ Error generating skill pages:', error);
  }
}

// Run the generator
generateAllSkillPages();