import { promises as fs } from 'fs';
import path from 'path';

const skillsIndexPath = path.join(process.cwd(), 'contents/docs/skills/index.mdx');

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
  recipeCount: number;
  description: string;
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
      const toolImageMatch = skillMatch.match(/tool:\s*{[^}]*image:\s*[^,}]+/);
      const xpPerLevelMatch = skillMatch.match(/xpPerLevel:\s*(\d+)/);
      const xpGrowthFactorMatch = skillMatch.match(/xpGrowthFactor:\s*([\d.]+)/);
      const recipesMatch = skillMatch.match(/recipes:\s*\[([\s\S]*?)\]/);
      
      if (!keyMatch || !nameMatch) return;
      
      // Count recipes
      let recipeCount = 0;
      if (recipesMatch) {
        const recipeMatches = recipesMatch[1].match(/{\s*key:\s*['"`][^'"`]+['"`][\s\S]*?},/g);
        recipeCount = recipeMatches ? recipeMatches.length : 0;
      }
      
      // Generate skill description based on type
      const skillKey = keyMatch[1];
      const description = getSkillDescription(skillKey);
      
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
          image: '/assets/icons/question.png' // Tool image parsing is complex due to misc references
        },
        xpPerLevel: xpPerLevelMatch ? parseInt(xpPerLevelMatch[1]) : 100,
        xpGrowthFactor: xpGrowthFactorMatch ? parseFloat(xpGrowthFactorMatch[1]) : 1.1,
        recipeCount: recipeCount,
        description: description
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
    'mining': 'Extract valuable ores and gems from the earth using pickaxes. Higher skill levels unlock access to rare materials.',
    'smithing': 'Transform raw ores into refined bars and craft powerful weapons, armor, and tools at the forge.',
    'carpentry': 'Work with wood to create planks, handles, and wooden items. Essential for tool crafting and construction.',
    'crafting': 'Combine materials and components to create advanced tools, weapons, and equipment.',
    'cooking': 'Prepare delicious and nutritious meals from raw ingredients. Cooked food provides better health restoration.',
    'fishing': 'Cast your line to catch various fish species from different water bodies. A peaceful way to gather food.',
    'foraging': 'Gather wild plants, mushrooms, and natural resources from the wilderness. Knowledge of nature is key.',
    'woodcutting': 'Fell trees to obtain logs for construction and crafting. Different tree types yield different wood qualities.',
    'alchemy': 'Brew powerful potions and elixirs using magical ingredients. Master alchemists can create miraculous concoctions.',
    'hunting': 'Track and hunt wild animals for meat, hides, and other valuable materials.',
    'trinketry': 'Craft beautiful jewelry and accessories from precious gems and metals.',
    'agility': 'Improve movement speed, reflexes, and dexterity through training and practice.',
    'combat': 'Master the arts of war, weapon handling, and tactical combat skills.',
    'farming': 'Cultivate crops and manage agricultural activities. Sustainable food production and resource management.',
    'reputation': 'Build relationships with NPCs and factions. Higher reputation unlocks special opportunities and rewards.'
  };
  
  return descriptions[skillKey] || 'A skill that contributes to your character\'s development and capabilities.';
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

// Group skills by category
function groupSkillsByCategory(skills: SkillInfo[]): Record<string, SkillInfo[]> {
  const grouped: Record<string, SkillInfo[]> = {};
  
  skills.forEach(skill => {
    const category = getSkillCategory(skill.key);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(skill);
  });
  
  // Sort skills within each category by name
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return grouped;
}

// Generate table for a skill category
function generateCategoryTable(skills: SkillInfo[], category: string): string {
  if (skills.length === 0) return '';
  
  const categoryDescriptions: Record<string, string> = {
    'Gathering': 'Skills focused on collecting raw materials and resources from the environment.',
    'Crafting': 'Skills that transform raw materials into useful items, equipment, and consumables.',
    'Combat': 'Skills related to fighting, defense, and physical prowess.',
    'Social': 'Skills that affect your relationships and standing with NPCs and factions.'
  };
  
  let table = `
## ${category} Skills

${categoryDescriptions[category] || 'Essential skills for character development.'}

| Skill | Name | Location | Recipes | Description |
|:-----:|:-----|:---------|:-------:|:------------|
`;

  skills.forEach(skill => {
    table += `| <img src="${skill.icon}" alt="${skill.name}" width="32" height="32" style={{margin: 0}} /> | **[${skill.name}](/docs/skills/individual/${skill.key})** | ${skill.location.name} | ${skill.recipeCount} | ${skill.description} |\n`;
  });
  
  return table;
}

// Generate the Skills Catalog content
function generateSkillsCatalogContent(groupedSkills: Record<string, SkillInfo[]>, totalSkills: number): string {
  const categoryOrder = ['Gathering', 'Crafting', 'Combat', 'Social', 'Miscellaneous'];
  
  // Generate category summary cards
  const categoryCards = categoryOrder.filter(cat => groupedSkills[cat]?.length > 0).map(category => {
    const skills = groupedSkills[category];
    const count = skills.length;
    const icon = getCategoryIcon(category);
    const color = getCategoryColor(category);
    
    return `  <div className="flex items-center gap-3 p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-700">
    <img src="${icon}" alt="${category}" className="w-12 h-12" />
    <div>
      <h4 className="font-semibold text-${color}-800 dark:text-${color}-200">${category}</h4>
      <p className="text-xs text-${color}-600 dark:text-${color}-300">${count} Skills</p>
    </div>
  </div>`;
  }).join('\n\n');
  
  // Generate all category tables
  const categoryTables = categoryOrder.filter(cat => groupedSkills[cat]?.length > 0).map(category => {
    return generateCategoryTable(groupedSkills[category], category);
  }).join('\n\n');
  
  // Calculate total recipes across all skills
  const totalRecipes = Object.values(groupedSkills).flat().reduce((sum, skill) => sum + skill.recipeCount, 0);
  
  return `---
title: Skills Catalog
description: Master all ${totalSkills} skills in Stepcraft - from gathering and crafting to combat and social abilities with ${totalRecipes} total recipes
---

# Skills Overview

Develop your character through ${totalSkills} diverse skills across multiple categories. Each skill offers unique recipes, abilities, and progression paths that shape your gameplay experience.

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
${categoryCards}
</div>

## Skill Progression System

All skills in Stepcraft follow a consistent progression system:

- **Base XP per Level**: 100 XP (most skills)
- **Growth Factor**: 1.1x multiplier per level
- **Recipe Unlocks**: New recipes become available at specific level thresholds
- **Tool Requirements**: Higher-tier recipes require better tools and equipment

### Level Tiers

| Tier | Level Range | XP Reward | Recipes Unlocked |
|:----:|:-----------:|:---------:|:-----------------|
| **T0** | 1-14 | 10-20 XP | Basic recipes, starter materials |
| **T1** | 15-29 | 20-40 XP | Copper tier, improved efficiency |
| **T2** | 30-44 | 40-80 XP | Iron tier, intermediate recipes |
| **T3** | 45-59 | 80-160 XP | Silver tier, advanced materials |
| **T4** | 60-74 | 160-320 XP | Gold tier, rare recipes |
| **T5** | 75-89 | 320-640 XP | Blue tier, epic materials |
| **T6** | 90+ | 640+ XP | Red tier, legendary recipes |

${categoryTables}

## Skill Synergies

Many skills work together to create powerful synergies:

- **Mining + Smithing**: Extract ores and smelt them into bars and tools
- **Woodcutting + Carpentry**: Harvest logs and craft planks, handles, and wooden items  
- **Foraging + Alchemy**: Gather magical ingredients and brew powerful potions
- **Fishing + Cooking**: Catch fresh fish and prepare nutritious meals
- **Hunting + Crafting**: Obtain materials and create specialized equipment

## Navigation

- [🔍 Search All Skills](/search) - Find specific skills and recipes
- [📝 Individual Skill Pages](/docs/skills/individual) - Detailed guides for each skill
- [🏠 Back to Documentation](/docs) - Return to main documentation

*Catalog updated ${new Date().toISOString().split('T')[0]} - ${totalSkills} skills with ${totalRecipes} total recipes*
`;
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Gathering': return '/assets/icons/mining.png';
    case 'Crafting': return '/assets/icons/smithing.png';
    case 'Combat': return '/assets/icons/combat.png';
    case 'Social': return '/assets/icons/reputation.png';
    default: return '/assets/icons/question.png';
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Gathering': return 'green';
    case 'Crafting': return 'amber';
    case 'Combat': return 'red';
    case 'Social': return 'blue';
    default: return 'gray';
  }
}

// Main sync function
async function syncSkillsCatalog() {
  console.log('🔄 Syncing skills catalog with source data...');
  
  try {
    console.log('📖 Extracting skills data from source files...');
    const skills = await extractSkillsData();
    
    if (skills.length === 0) {
      console.error('❌ No skills extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${skills.length} skills across all categories`);
    
    // Group skills by category
    const groupedSkills = groupSkillsByCategory(skills);
    
    // Log category breakdown
    Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
      console.log(`  • ${category}: ${categorySkills.length} skills`);
    });
    
    // Generate the new catalog content
    console.log('📝 Generating updated catalog content...');
    const catalogContent = generateSkillsCatalogContent(groupedSkills, skills.length);
    
    // Ensure output directory exists
    await fs.mkdir(path.dirname(skillsIndexPath), { recursive: true });
    
    // Write to the skills index file
    await fs.writeFile(skillsIndexPath, catalogContent);
    
    console.log(`✅ Successfully updated skills catalog!`);
    console.log(`📁 Updated: ${skillsIndexPath}`);
    console.log(`📊 Total skills: ${skills.length}`);
    console.log(`🔗 All skills now link to individual pages at /docs/skills/individual/[skill-key]`);
    
  } catch (error) {
    console.error('❌ Error syncing skills catalog:', error);
  }
}

// Run the sync
syncSkillsCatalog();