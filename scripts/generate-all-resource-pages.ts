import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/resources/individual');

// Interface for recipe information
interface RecipeInfo {
  key: string;
  name: string;
  skillName: string;
  skillKey: string;
  output: { name: string; amount: number }[];
  requiredLevel?: number;
  xpReward?: number;
}

// Extract recipe data from skills.ts file programmatically
async function extractRecipeData(): Promise<Map<string, RecipeInfo[]>> {
  try {
    const skillsPath = path.resolve(process.cwd(), 'files/data/skills.ts');
    const skillsContent = await fs.readFile(skillsPath, 'utf-8');
    
    const recipesByResource = new Map<string, RecipeInfo[]>();
    
    // Helper function to clean up resource/item names for matching
    const normalizeResourceKey = (rawKey: string): string => {
      // Remove category prefix and clean up the key
      return rawKey.replace(/^(ores|bars|logs|planks|handles|toolParts|fish|foraging|hunting|misc|combat|farming|gems|ingredients|food|tools|rings|potions|amulets|questItems|jams|swords|shields|bootsArmors|chestArmors|glovesArmors|headArmors|legArmors|allWeapons)\[['"`]/, '')
                .replace(/['"`]\]$/, '')
                .trim();
    };
    
    // Helper function to format display names
    const formatDisplayName = (key: string): string => {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    
    // Extract all skills and their recipes
    const skillsMatch = skillsContent.match(/export const skills:\s*SkillDef\[\]\s*=\s*\[([\s\S]*?)\];/);
    if (!skillsMatch) return recipesByResource;
    
    const skillsSection = skillsMatch[1];
    
    // Parse skills more carefully by looking for complete skill objects
    const skills: { name: string; key: string; content: string }[] = [];
    
    // Look for complete skill objects - they start with { and end with }, containing key, name, and recipes
    // We need to find balanced braces for complete skill objects
    const skillObjects = [];
    let braceLevel = 0;
    let skillStart = -1;
    let i = 0;
    
    while (i < skillsSection.length) {
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
      i++;
    }
    
    // Extract key and name from each complete skill object
    skillObjects.forEach(skillContent => {
      const keyMatch = skillContent.match(/key:\s*['"`]([^'"`]+)['"`]/);
      const nameMatch = skillContent.match(/name:\s*['"`]([^'"`]+)['"`]/);
      
      if (keyMatch && nameMatch) {
        skills.push({
          name: nameMatch[1],
          key: keyMatch[1],
          content: skillContent
        });
      }
    });
    
    console.log(`🔍 Found ${skills.length} skills to parse for recipes`);
    
    // Parse recipes from each skill
    skills.forEach(skill => {
      // Find recipes array using balanced bracket parsing to handle nested arrays
      const recipesStartMatch = skill.content.match(/recipes:\s*\[/);
      if (!recipesStartMatch) {
        console.log(`  ⚠️  ${skill.name}: No recipes array found`);
        return;
      }
      
      const recipesStartIndex = recipesStartMatch.index! + recipesStartMatch[0].length - 1; // Position of the opening [
      let bracketLevel = 0;
      let recipesEndIndex = -1;
      
      for (let i = recipesStartIndex; i < skill.content.length; i++) {
        const char = skill.content[i];
        
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
      
      if (recipesEndIndex === -1) {
        console.log(`  ⚠️  ${skill.name}: No recipes array end found`);
        return;
      }
      
      const recipesContent = skill.content.substring(recipesStartIndex + 1, recipesEndIndex);
      
      // Parse individual recipes more carefully
      // Look for recipe objects by finding balanced braces
      const recipes = [];
      let braceLevel = 0;
      let recipeStart = -1;
      let i = 0;
      
      while (i < recipesContent.length) {
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
            recipes.push(recipeText);
            recipeStart = -1;
          }
        }
        i++;
      }
      
      console.log(`  📝 ${skill.name}: Found ${recipes.length} recipe objects`);
      
      // Parse each recipe
      recipes.forEach((recipeText, recipeIndex) => {
        try {
          // Extract recipe details
          const keyMatch = recipeText.match(/key:\s*['"`]([^'"`]+)['"`]/);
          const nameMatch = recipeText.match(/name:\s*['"`]([^'"`]+)['"`]/);
          // Use balanced bracket parsing for inputs and outputs
          const getArrayContent = (text: string, arrayName: string): string | null => {
            const startMatch = text.match(new RegExp(`${arrayName}:\\s*\\[`));
            if (!startMatch) return null;
            
            const startIndex = startMatch.index! + startMatch[0].length - 1; // Position of the opening [
            let bracketLevel = 0;
            let endIndex = -1;
            
            for (let i = startIndex; i < text.length; i++) {
              const char = text[i];
              
              if (char === '[') {
                bracketLevel++;
              } else if (char === ']') {
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
          const levelMatch = recipeText.match(/requiredLevel:\s*([^,}\s]+)/);
          const xpMatch = recipeText.match(/xpReward:\s*([^,}\s]+)/);
          
          if (!keyMatch || !nameMatch) {
            console.log(`    ⚠️  Recipe ${recipeIndex + 1}: Missing key or name`);
            return;
          }
          
          const recipeKey = keyMatch[1];
          const recipeName = nameMatch[1];
          
          console.log(`    🔍 Processing recipe: ${recipeName} (${recipeKey})`);
          
          // Parse inputs if they exist
          if (inputsContent && inputsContent.trim() !== '') {
            console.log(`      🔍 Inputs content: "${inputsContent.substring(0, 100)}..."`);
            
            // Find all resource references in inputs - improve regex to capture the resource references
            const resourceMatches = inputsContent.match(/{\s*resource:\s*[^}]+}/g);
            if (resourceMatches) {
              console.log(`      🎯 Found ${resourceMatches.length} input resources`);
              
              resourceMatches.forEach((resourceMatch, inputIndex) => {
                // Extract the resource key from references like "{ resource: ores['copper_ore'], amount: 2 }"
                const resourceKeyMatch = resourceMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
                const amountMatch = resourceMatch.match(/amount:\s*(\d+)/);
                
                if (resourceKeyMatch) {
                  const resourceKey = resourceKeyMatch[2];
                  const amount = amountMatch ? parseInt(amountMatch[1]) : 1;
                  
                  console.log(`        📦 Input ${inputIndex + 1}: ${resourceKey} (${amount})`);
                  
                  // Parse outputs for display
                  let outputs: { name: string; amount: number }[] = [];
                  if (outputContent) {
                    const outputResourceMatches = outputContent.match(/{\s*resource:\s*[^}]+}/g);
                    if (outputResourceMatches) {
                      outputs = outputResourceMatches.map(outputMatch => {
                        const outputKeyMatch = outputMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
                        const outputAmountMatch = outputMatch.match(/amount:\s*(\d+)/);
                        return {
                          name: outputKeyMatch ? formatDisplayName(outputKeyMatch[2]) : 'Unknown',
                          amount: outputAmountMatch ? parseInt(outputAmountMatch[1]) : 1
                        };
                      });
                    }
                  }
                  
                  const recipeInfo: RecipeInfo = {
                    key: recipeKey,
                    name: recipeName,
                    skillName: skill.name,
                    skillKey: skill.key,
                    output: outputs,
                    requiredLevel: levelMatch ? parseInt(levelMatch[1]) : undefined,
                    xpReward: xpMatch ? parseInt(xpMatch[1]) : undefined
                  };
                  
                  if (!recipesByResource.has(resourceKey)) {
                    recipesByResource.set(resourceKey, []);
                  }
                  recipesByResource.get(resourceKey)!.push(recipeInfo);
                  
                  console.log(`        ✅ Added recipe for resource: ${resourceKey}`);
                }
              });
            } else {
              console.log(`      ❌ No resource matches found in inputs`);
            }
          } else {
            console.log(`      ℹ️  Recipe ${recipeName} has no inputs (gathering recipe)`);
          }
        } catch (error) {
          console.error(`Error parsing recipe in ${skill.name}:`, error);
        }
      });
    });
    
    console.log(`📊 Programmatically found recipes for ${recipesByResource.size} different resources`);
    
    return recipesByResource;
    
  } catch (error) {
    console.error('Error extracting recipe data:', error);
    return new Map();
  }
}

// Extract resource data from resources.ts file
async function extractResourcesData(): Promise<any[]> {
  try {
    const resourcesPath = path.resolve(process.cwd(), 'files/data/resources.ts');
    const resourcesContent = await fs.readFile(resourcesPath, 'utf-8');
    
    const resources: any[] = [];
    
    // Helper function to extract asset path from require statement
    const extractAssetPath = (requireStr: string): string => {
      const match = requireStr.match(/require\(['"`]([^'"`]+)['"`]\)/);
      if (match && match[1]) {
        return match[1].replace('../assets', '/assets');
      }
      return '/assets/icons/question.png';
    };
    
    // Helper function to parse resources from each category
    const parseResourcesFromCategory = (content: string, categoryName: string): any[] => {
      const categoryRegex = new RegExp(`export const ${categoryName}:\\s*Record<[\\w\\s|',]+>\\s*=\\s*{([\\s\\S]*?)};`, 'g');
      const categoryMatch = content.match(categoryRegex);
      
      if (!categoryMatch) return [];
      
      const categoryContent = categoryMatch[0].match(/{([\s\S]*?)};$/);
      if (!categoryContent) return [];
      
      const resourceMatches = categoryContent[1].match(/(\w+):\s*{[^{}]*(?:{[^{}]*}[^{}]*)*}/g);
      if (!resourceMatches) return [];
      
      return resourceMatches.map(match => {
        const keyMatch = match.match(/key:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = match.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const iconMatch = match.match(/icon:\s*(require\([^)]+\))/);
        const priceMatch = match.match(/price:\s*(\d+)/);
        
        return {
          key: keyMatch ? keyMatch[1] : '',
          name: nameMatch ? nameMatch[1] : '',
          icon: iconMatch ? extractAssetPath(iconMatch[1]) : '/assets/icons/question.png',
          price: priceMatch ? parseInt(priceMatch[1]) : undefined,
          category: getCategoryDisplayName(categoryName)
        };
      }).filter(resource => resource.key && resource.name);
    };
    
    // Parse all resource categories
    const categories = [
      'toolParts', 'ores', 'gems', 'bars', 'logs', 'planks', 
      'handles', 'fish', 'farming', 'ingredients', 'foraging', 
      'hunting', 'misc', 'combat'
    ];
    
    categories.forEach(category => {
      const categoryResources = parseResourcesFromCategory(resourcesContent, category);
      resources.push(...categoryResources);
    });
    
    // Remove duplicates based on key
    const uniqueResources = resources.filter((resource, index, arr) => 
      resource.key && resource.name && arr.findIndex(r => r.key === resource.key) === index
    );
    
    return uniqueResources;
    
  } catch (error) {
    console.error('Error extracting resources data:', error);
    return [];
  }
}

// Convert category names to display names
function getCategoryDisplayName(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    'toolParts': 'Tool Parts',
    'ores': 'Ores',
    'gems': 'Gems', 
    'bars': 'Bars',
    'logs': 'Logs',
    'planks': 'Planks',
    'handles': 'Handles',
    'fish': 'Fish',
    'farming': 'Farming',
    'ingredients': 'Ingredients',
    'foraging': 'Foraging',
    'hunting': 'Hunting',
    'misc': 'Miscellaneous',
    'combat': 'Combat'
  };
  
  return categoryMap[categoryName] || categoryName;
}

// Generate resource tier based on price
function getResourceTier(price: number | undefined): string {
  if (!price) return 'Common';
  if (price <= 50) return 'Common';
  if (price <= 200) return 'Uncommon';
  if (price <= 1000) return 'Rare';
  if (price <= 5000) return 'Epic';
  return 'Legendary';
}

// Generate resource rarity color based on tier
function getTierColor(tier: string): string {
  switch (tier) {
    case 'Common': return 'gray';
    case 'Uncommon': return 'green';
    case 'Rare': return 'blue';
    case 'Epic': return 'purple';
    case 'Legendary': return 'yellow';
    default: return 'gray';
  }
}

// Generate individual resource page content
function generateResourcePageContent(resource: any, recipes: RecipeInfo[] = []): string {
  const tier = getResourceTier(resource.price);
  const tierColor = getTierColor(tier);
  
  return `---
title: ${resource.name}
description: ${resource.name} - ${resource.category} in Stepcraft
---

# ${resource.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${resource.icon}" alt="${resource.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">A valuable resource used for crafting and trading in Stepcraft.</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Category:** ${resource.category}
        </span>
        <span className="px-2 py-1 bg-${tierColor}-100 dark:bg-${tierColor}-900 rounded-md">
          **Tier:** ${tier}
        </span>
        ${resource.price ? `<span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md">
          **Price:** ${resource.price.toLocaleString()} coins
        </span>` : ''}
      </div>
    </div>
  </div>
</div>

## Resource Details

| Property | Value |
|----------|-------|
| **Name** | ${resource.name} |
| **Key** | \`${resource.key}\` |
| **Category** | ${resource.category} |
| **Tier** | ${tier} |
${resource.price ? `| **Price** | ${resource.price.toLocaleString()} coins |\n` : ''}

## Usage

This resource is commonly used in:

- **Crafting**: Essential material for various recipes
- **Trading**: Valuable commodity for merchants
- **Skill Development**: Used in leveling crafting professions
${resource.category === 'Fish' || resource.category === 'Farming' || resource.category === 'Foraging' || resource.category === 'Hunting' ? '- **Consumption**: Can be used as food or ingredient' : ''}

## Acquisition

${getAcquisitionInfo(resource.category)}

${recipes.length > 0 ? `
## Used in Recipes

This resource is used in the following crafting recipes:

| Recipe | Skill | Level | XP | Produces |
|--------|-------|-------|----|---------:|
${recipes.map(recipe => {
  const levelReq = recipe.requiredLevel ? `Lv. ${recipe.requiredLevel}` : '-';
  const xpReward = recipe.xpReward ? `${recipe.xpReward} XP` : '-';
  const outputs = recipe.output.length > 0 
    ? recipe.output.map(out => `${out.amount}x ${out.name}`).join('<br/>') 
    : 'Various items';
  
  return `| **${recipe.name}** | ${recipe.skillName} | ${levelReq} | ${xpReward} | ${outputs} |`;
}).join('\n')}

*This resource is required as a crafting material in ${recipes.length} recipe${recipes.length > 1 ? 's' : ''} across ${new Set(recipes.map(r => r.skillName)).size} skill${new Set(recipes.map(r => r.skillName)).size > 1 ? 's' : ''}.*
` : `
## Recipe Usage

This resource is not currently used in any known crafting recipes. It may be:
- A basic material gathered directly from the environment
- Used for trading with NPCs
- Required for future recipes not yet discovered
`}

## Related Skills

${getRelatedSkills(resource.key, resource.category)}

## Related Resources

Browse more resources from the [${resource.category}](/docs/resources#${resource.category.toLowerCase().replace(' ', '-')}) category or return to the [complete resources catalog](/docs/resources).

## Navigation

- [← Back to Resources Catalog](/docs/resources)
- [Browse ${resource.category}](/docs/resources#${resource.category.toLowerCase().replace(' ', '-')})
- [Search All Resources](/search)
`;
}

// Get related skills based on resource key and category
function getRelatedSkills(resourceKey: string, category: string): string {
  const skillMappings: Record<string, string[]> = {
    // Ore resources
    'stone': ['Mining', 'Smithing'],
    'copper_ore': ['Mining', 'Smithing'],
    'iron_ore': ['Mining', 'Smithing'],
    'silver_ore': ['Mining', 'Smithing'],
    'gold_ore': ['Mining', 'Smithing'],
    'blue_ore': ['Mining', 'Smithing'],
    'red_ore': ['Mining', 'Smithing'],
    
    // Bar resources
    'stone_brick': ['Smithing', 'Crafting'],
    'copper_bar': ['Smithing', 'Crafting'],
    'iron_bar': ['Smithing', 'Crafting'],
    'silver_bar': ['Smithing', 'Crafting'],
    'gold_bar': ['Smithing', 'Crafting'],
    'blue_bar': ['Smithing', 'Crafting'],
    'red_bar': ['Smithing', 'Crafting'],
    
    // Wood resources
    'sticks': ['Woodcutting', 'Carpentry'],
    'birch_log': ['Woodcutting', 'Carpentry'],
    'oak_log': ['Woodcutting', 'Carpentry'],
    'birch_plank': ['Carpentry', 'Crafting'],
    'oak_plank': ['Carpentry', 'Crafting'],
    'crude_plank': ['Carpentry', 'Crafting'],
    
    // Handle resources
    'birch_handle': ['Carpentry', 'Crafting'],
    'oak_handle': ['Carpentry', 'Crafting'],
    
    // Tool parts
    'copper_toolhead': ['Smithing', 'Crafting'],
    'iron_toolhead': ['Smithing', 'Crafting'],
    'silver_toolhead': ['Smithing', 'Crafting'],
    'gold_toolhead': ['Smithing', 'Crafting'],
    'blue_toolhead': ['Smithing', 'Crafting'],
    'red_toolhead': ['Smithing', 'Crafting'],
    
    // Fish resources
    'tilapia': ['Fishing', 'Cooking'],
    'bass': ['Fishing', 'Cooking'],
    
    // Foraging resources
    'button_mushroom': ['Foraging', 'Cooking'],
    'fly_agaric': ['Foraging', 'Alchemy'],
    
    // Hunting resources
    'rabbit_meat': ['Hunting', 'Cooking']
  };
  
  // Get category-based skills
  const categorySkills: Record<string, string[]> = {
    'Ores': ['Mining', 'Smithing'],
    'Bars': ['Smithing', 'Crafting'],
    'Logs': ['Woodcutting', 'Carpentry'],
    'Planks': ['Carpentry', 'Crafting'],
    'Handles': ['Carpentry', 'Crafting'],
    'Tool Parts': ['Smithing', 'Crafting'],
    'Fish': ['Fishing', 'Cooking'],
    'Foraging': ['Foraging', 'Cooking', 'Alchemy'],
    'Hunting': ['Hunting', 'Cooking'],
    'Farming': ['Farming', 'Cooking'],
    'Gems': ['Mining', 'Trinketry'],
    'Ingredients': ['Foraging', 'Alchemy', 'Cooking'],
    'Combat': ['Combat', 'Smithing'],
    'Miscellaneous': ['Crafting']
  };
  
  // Get skills for specific resource or fall back to category
  const skills = skillMappings[resourceKey] || categorySkills[category] || ['Crafting'];
  
  if (skills.length === 0) {
    return 'This resource may be used across various skills and activities.';
  }
  
  const skillLinks = skills.map(skill => `[${skill}](/docs/skills/individual/${skill.toLowerCase()})`).join(' • ');
  
  return `This resource is primarily associated with: ${skillLinks}`;
}

// Get acquisition information based on category
function getAcquisitionInfo(category: string): string {
  switch (category) {
    case 'Ores':
      return 'Obtained through **Mining** - found in mines and rocky areas. Higher tier ores require better tools and access to deeper mining locations.';
    case 'Fish':
      return 'Caught through **Fishing** - found in various water bodies. Different fish species are available in different locations and seasons.';
    case 'Logs':
      return 'Harvested through **Logging** - obtained from trees in forests and wooded areas. Different wood types come from different tree species.';
    case 'Gems':
      return 'Found through **Mining** rare deposits or **Trading** with specialized merchants. Gems are valuable materials used in high-end crafting.';
    case 'Farming':
      return 'Grown through **Farming** - planted and harvested on agricultural plots. Requires seeds, proper soil, and seasonal timing.';
    case 'Foraging':
      return 'Gathered through **Foraging** - found in wilderness areas, forests, and natural environments. Availability varies by season and location.';
    case 'Hunting':
      return 'Obtained through **Hunting** - acquired from various creatures and animals. Requires combat skills and appropriate hunting equipment.';
    case 'Tool Parts':
      return 'Crafted through **Smithing** - created using raw materials and specialized smithing techniques. Essential for tool construction.';
    case 'Bars':
      return 'Smelted through **Smithing** - refined from raw ores using furnaces and smithing equipment. Base material for many crafted items.';
    case 'Planks':
      return 'Processed through **Carpentry** - refined from raw logs using carpentry tools. Essential material for construction and tool crafting.';
    case 'Handles':
      return 'Crafted through **Carpentry** - specialized components created for tool assembly. Requires carpentry skills and quality wood materials.';
    case 'Combat':
      return 'Acquired through **Combat** activities - obtained from battles, victories, or combat-related crafting processes.';
    case 'Ingredients':
      return 'Gathered from various **Crafting** activities - specialized materials used in advanced recipes and alchemical processes.';
    default:
      return 'Acquired through various activities - check with local merchants and crafting guides for specific acquisition methods.';
  }
}

// Generate all resource pages
async function generateAllResourcePages() {
  console.log('🔄 Generating individual resource pages...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('📖 Extracting resources data from source files...');
    const resources = await extractResourcesData();
    
    console.log('🔧 Extracting recipe data from skills...');
    const recipesByResource = await extractRecipeData();
    
    console.log(`📋 Found recipes for ${recipesByResource.size} different resources`);
    
    if (resources.length === 0) {
      console.error('❌ No resources extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${resources.length} resources to generate pages for`);
    
    // Generate pages for each resource
    let generatedCount = 0;
    const categoryCount: Record<string, number> = {};
    
    for (const resource of resources) {
      try {
        const resourceRecipes = recipesByResource.get(resource.key) || [];
        const pageContent = generateResourcePageContent(resource, resourceRecipes);
        const fileName = `${resource.key}.mdx`;
        const filePath = path.join(outputDir, fileName);
        
        await fs.writeFile(filePath, pageContent);
        generatedCount++;
        
        // Track category counts
        categoryCount[resource.category] = (categoryCount[resource.category] || 0) + 1;
        
        if (generatedCount % 25 === 0) {
          console.log(`  📝 Generated ${generatedCount}/${resources.length} pages...`);
        }
      } catch (error) {
        console.error(`❌ Error generating page for ${resource.name}:`, error);
      }
    }
    
    console.log('\\n✅ Successfully generated all resource pages!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📊 Generated ${generatedCount} resource pages`);
    console.log('\\n📋 Pages generated by category:');
    
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  • ${category}: ${count} pages`);
      });
    
    console.log(`\\n🔗 All pages accessible at /docs/resources/individual/[resource-key]`);
    
  } catch (error) {
    console.error('❌ Error generating resource pages:', error);
  }
}

// Run the generator
generateAllResourcePages();