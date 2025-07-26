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
  inputs: { name: string; amount: number; resourceKey: string }[];
  outputs: { name: string; amount: number; resourceKey: string }[];
  requiredLevel?: number;
  requiredTool?: string;
  xpReward?: number;
  requiredSteps: number;
}

// Helper function to format display names
function formatDisplayName(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to get the URL for an item/resource
function getItemUrl(itemKey: string): string {
  // Determine if it's an item or resource based on common patterns
  // Items typically include tools, armor, weapons, food, etc.
  const itemKeywords = [
    'pickaxe', 'axe', 'sickle', 'rod', 'sword', 'shield', 'helm', 'chest', 'legs', 'boots', 'gloves', 'ring', 'amulet', 'potion',
    'pie', 'cake', 'bread', 'cookie', 'pizza', 'donut', 'spaghetti', 'jam', 'staff'
  ];
  const isItem = itemKeywords.some(keyword => itemKey.includes(keyword));
  
  // Both items and resources use underscores in their filenames
  if (isItem) {
    return `/docs/items/individual/${itemKey}`;
  } else {
    return `/docs/resources/individual/${itemKey}`;
  }
}

// Helper function to create links to individual item/resource pages
function createItemLink(itemKey: string, itemName: string): string {
  return `[${itemName}](${getItemUrl(itemKey)})`;
}

// Helper function to resolve constant expressions to actual values
function resolveConstantValue(expression: string): number | undefined {
  if (!expression) return undefined;
  
  // Define the constants based on the skills.ts file
  const constants: Record<string, number> = {
    'T0_XP': 10,
    'T1_XP': 20,
    'T2_XP': 40,
    'T3_XP': 80,
    'T4_XP': 160,
    'T5_XP': 320,
    'T6_XP': 640,
    'T0_STEPS': 50,
    'T1_STEPS': 75,
    'T2_STEPS': 100,
    'T3_STEPS': 125,
    'T4_STEPS': 150,
    'T5_STEPS': 175,
    'T6_STEPS': 200,
    'T0_LEVEL': 0,
    'T1_LEVEL': 15,
    'T2_LEVEL': 30,
    'T3_LEVEL': 45,
    'T4_LEVEL': 60,
    'T5_LEVEL': 75,
    'T6_LEVEL': 90
  };
  
  // Handle simple constants
  if (constants[expression]) {
    return constants[expression];
  }
  
  // Handle expressions like "T0_XP * 2"
  const multiplyMatch = expression.match(/(\w+)\s*\*\s*(\d+)/);
  if (multiplyMatch) {
    const constant = constants[multiplyMatch[1]];
    const multiplier = parseInt(multiplyMatch[2]);
    if (constant && multiplier) {
      return constant * multiplier;
    }
  }
  
  // Handle literal numbers
  const literalMatch = expression.match(/^\d+$/);
  if (literalMatch) {
    return parseInt(expression);
  }
  
  return undefined;
}

// Extract recipes from a skill object
function extractRecipesFromSkill(skillContent: string, skillKey: string, skillName: string): RecipeInfo[] {
  const recipes: RecipeInfo[] = [];
  
  try {
    // Find recipes array using balanced bracket parsing
    const recipesStartMatch = skillContent.match(/recipes:\s*\[/);
    if (!recipesStartMatch) return recipes;
    
    const recipesStartIndex = recipesStartMatch.index! + recipesStartMatch[0].length - 1; // Position of the opening [
    let bracketLevel = 0;
    let recipesEndIndex = -1;
    
    for (let i = recipesStartIndex; i < skillContent.length; i++) {
      const char = skillContent[i];
      
      if (char === '[') {
        bracketLevel++;
      } else if (char === ']') {
        bracketLevel--;
        if (bracketLevel === 0) {
          recipesEndIndex = i;
          break;
        }
      }
    }
    
    if (recipesEndIndex === -1) return recipes;
    
    const recipesContent = skillContent.substring(recipesStartIndex + 1, recipesEndIndex);
    
    // Parse individual recipes using balanced brace parsing
    const recipeObjects = [];
    let braceLevel = 0;
    let recipeStart = -1;
    
    for (let i = 0; i < recipesContent.length; i++) {
      const char = recipesContent[i];
      
      if (char === '{') {
        if (braceLevel === 0) {
          recipeStart = i;
        }
        braceLevel++;
      } else if (char === '}') {
        braceLevel--;
        if (braceLevel === 0 && recipeStart !== -1) {
          const recipeText = recipesContent.substring(recipeStart, i + 1);
          recipeObjects.push(recipeText);
          recipeStart = -1;
        }
      }
    }
    
    // Parse each recipe object
    recipeObjects.forEach(recipeText => {
      try {
        const keyMatch = recipeText.match(/key:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = recipeText.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const levelMatch = recipeText.match(/requiredLevel:\s*([^,}\s]+)/);
        const xpMatch = recipeText.match(/xpReward:\s*([^,}\s]+)/);
        const stepsMatch = recipeText.match(/requiredSteps:\s*([^,}\s]+)/);
        const toolMatch = recipeText.match(/requiredTool:\s*['"`]([^'"`]+)['"`]/);
        
        if (!keyMatch || !nameMatch) return;
        
        const recipeKey = keyMatch[1];
        const recipeName = nameMatch[1];
        
        // Parse inputs using balanced bracket parsing
        const getArrayContent = (text: string, arrayName: string) => {
          const startMatch = text.match(new RegExp(`${arrayName}:\\s*\\[`));
          if (!startMatch) return null;
          
          const startIndex = startMatch.index! + startMatch[0].length - 1;
          let bracketLevel = 0;
          let endIndex = -1;
          
          for (let i = startIndex; i < text.length; i++) {
            const char = text[i];
            if (char === '[') bracketLevel++;
            else if (char === ']') {
              bracketLevel--;
              if (bracketLevel === 0) {
                endIndex = i;
                break;
              }
            }
          }
          
          if (endIndex === -1) return null;
          return text.substring(startIndex + 1, endIndex);
        };
        
        const inputsContent = getArrayContent(recipeText, 'inputs');
        const outputContent = getArrayContent(recipeText, 'output');
        
        // Parse inputs
        const inputs: { name: string; amount: number; resourceKey: string }[] = [];
        if (inputsContent && inputsContent.trim() !== '') {
          const resourceMatches = inputsContent.match(/{\s*resource:\s*[^}]+}/g);
          if (resourceMatches) {
            resourceMatches.forEach(resourceMatch => {
              const resourceKeyMatch = resourceMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
              const amountMatch = resourceMatch.match(/amount:\s*(\d+)/);
              if (resourceKeyMatch) {
                const resourceKey = resourceKeyMatch[2];
                inputs.push({
                  name: formatDisplayName(resourceKey),
                  amount: amountMatch ? parseInt(amountMatch[1]) : 1,
                  resourceKey: resourceKey
                });
              }
            });
          }
        }
        
        // Parse outputs
        const outputs: { name: string; amount: number; resourceKey: string }[] = [];
        if (outputContent && outputContent.trim() !== '') {
          const resourceMatches = outputContent.match(/{\s*resource:\s*[^}]+}/g);
          if (resourceMatches) {
            resourceMatches.forEach(resourceMatch => {
              const resourceKeyMatch = resourceMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
              const amountMatch = resourceMatch.match(/amount:\s*(\d+)/);
              if (resourceKeyMatch) {
                const resourceKey = resourceKeyMatch[2];
                outputs.push({
                  name: formatDisplayName(resourceKey),
                  amount: amountMatch ? parseInt(amountMatch[1]) : 1,
                  resourceKey: resourceKey
                });
              }
            });
          }
        }
        
        const recipe: RecipeInfo = {
          key: recipeKey,
          name: recipeName,
          inputs: inputs,
          outputs: outputs,
          requiredLevel: levelMatch ? resolveConstantValue(levelMatch[1]) : undefined,
          requiredTool: toolMatch ? toolMatch[1] : undefined,
          xpReward: xpMatch ? resolveConstantValue(xpMatch[1]) : undefined,
          requiredSteps: stepsMatch ? resolveConstantValue(stepsMatch[1]) || 0 : 0
        };
        
        recipes.push(recipe);
      } catch (error) {
        console.error(`Error parsing recipe in ${skillName}:`, error);
      }
    });
    
  } catch (error) {
    console.error(`Error extracting recipes from ${skillName}:`, error);
  }
  
  return recipes;
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
    
    // Use balanced brace parsing to extract complete skill objects
    const skillObjects = [];
    let braceLevel = 0;
    let skillStart = -1;
    
    for (let i = 0; i < skillsSection.length; i++) {
      const char = skillsSection[i];
      
      if (char === '{') {
        if (braceLevel === 0) {
          skillStart = i;
        }
        braceLevel++;
      } else if (char === '}') {
        braceLevel--;
        if (braceLevel === 0 && skillStart !== -1) {
          const skillContent = skillsSection.substring(skillStart, i + 1);
          // Verify this is actually a skill object (has key, name, and recipes)
          if (skillContent.includes('key:') && skillContent.includes('name:') && skillContent.includes('recipes:')) {
            skillObjects.push(skillContent);
          }
          skillStart = -1;
        }
      }
    }
    
    // Parse each skill object
    skillObjects.forEach(skillContent => {
      const keyMatch = skillContent.match(/key:\s*['"`]([^'"`]+)['"`]/);
      const nameMatch = skillContent.match(/name:\s*['"`]([^'"`]+)['"`]/);
      const iconMatch = skillContent.match(/icon:\s*(require\([^)]+\))/);
      const colorMatch = skillContent.match(/color:\s*['"`]([^'"`]+)['"`]/);
      const locationNameMatch = skillContent.match(/location:\s*{\s*name:\s*['"`]([^'"`]+)['"`]/);
      const locationImageMatch = skillContent.match(/location:\s*{[^}]*image:\s*(require\([^)]+\))/);
      const toolNameMatch = skillContent.match(/tool:\s*{[^}]*name:\s*['"`]([^'"`]+)['"`]/);
      const xpPerLevelMatch = skillContent.match(/xpPerLevel:\s*(\d+)/);
      const xpGrowthFactorMatch = skillContent.match(/xpGrowthFactor:\s*([\d.]+)/);
      
      if (!keyMatch || !nameMatch) return;
      
      const skillKey = keyMatch[1];
      const skillName = nameMatch[1];
      
      // Extract recipes programmatically from this skill
      const recipes = extractRecipesFromSkill(skillContent, skillKey, skillName);
      
      const skill: SkillInfo = {
        key: skillKey,
        name: skillName,
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

// Removed manual recipe definitions - now using programmatic parsing

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
  const inputs = recipe.inputs.length > 0 ? recipe.inputs.map(input => `${input.amount}x ${createItemLink(input.resourceKey, input.name)}`).join('<br/>') : 'None';
  const outputs = recipe.outputs.length > 0 ? recipe.outputs.map(output => `${output.amount}x ${createItemLink(output.resourceKey, output.name)}`).join('<br/>') : 'Various';
  const xp = recipe.xpReward || '-';
  const steps = recipe.requiredSteps;
  
  // Create link for recipe name to the main output item/resource
  const recipeNameLink = recipe.outputs.length > 0 
    ? `**[${recipe.name}](${getItemUrl(recipe.outputs[0].resourceKey)})**`
    : `**${recipe.name}**`;
  
  return `| <a id="${recipe.key}"></a>${recipeNameLink} | ${level} | ${tool} | ${inputs} | ${outputs} | ${xp} | ${steps} |`;
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