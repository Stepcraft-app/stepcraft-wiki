import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/resources/individual');

// Interface for recipe information
interface RecipeInfo {
  key: string;
  name: string;
  skillName: string;
  skillKey: string;
  output: { name: string; amount: number; resourceKey: string }[];
  requiredLevel?: number;
  xpReward?: number;
}

// Interface for crafting recipe ingredients
interface CraftingInput {
  name: string;
  key: string;
  amount: number;
  category: string;
}

// Interface for crafting recipes (how to make this resource)
interface CraftingRecipe {
  skill: string;
  skillKey: string;
  requiredLevel: number;
  inputs: CraftingInput[];
  xp?: number;
  steps?: number;
}

// Helper function to get the URL for an item/resource
function getItemUrl(itemKey: string): string {
  // Determine if it's an item or resource based on common patterns
  // Items typically include tools, armor, weapons, food, etc.
  const itemKeywords = [
    'pickaxe', 'axe', 'sickle', 'rod', 'sword', 'shield', 'helm', 'chest', 'legs', 'boots', 'gloves', 'ring', 'amulet', 'potion',
    'pie', 'cake', 'bread', 'cookie', 'pizza', 'donut', 'spaghetti', 'jam', 'staff', 'fries',
    'guard', 'band', 'charm', 'pendant', 'blade', 'cross', 'orbs', 'square', 'star', 'shard', 'weave'
  ];
  const isItem = itemKeywords.some(keyword => itemKey.includes(keyword));
  
  // Both items and resources use underscores in their filenames
  if (isItem) {
    return `/docs/items/individual/${itemKey}`;
  } else {
    return `/docs/resources/individual/${itemKey}`;
  }
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
      
      // Removed verbose logging for cleaner output
      
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
          
          // Parse inputs if they exist
          if (inputsContent && inputsContent.trim() !== '') {
            // Find all resource references in inputs
            const resourceMatches = inputsContent.match(/{\s*resource:\s*[^}]+}/g);
            if (resourceMatches) {
              resourceMatches.forEach((resourceMatch, inputIndex) => {
                // Extract the resource key from references like "{ resource: ores['copper_ore'], amount: 2 }"
                const resourceKeyMatch = resourceMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
                const amountMatch = resourceMatch.match(/amount:\s*(\d+)/);
                
                if (resourceKeyMatch) {
                  const resourceKey = resourceKeyMatch[2];
                  const amount = amountMatch ? parseInt(amountMatch[1]) : 1;
                  
                  // Parse outputs for display
                  let outputs: { name: string; amount: number; resourceKey: string }[] = [];
                  if (outputContent) {
                    const outputResourceMatches = outputContent.match(/{\s*resource:\s*[^}]+}/g);
                    if (outputResourceMatches) {
                      outputs = outputResourceMatches.map(outputMatch => {
                        const outputKeyMatch = outputMatch.match(/resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\]/);
                        const outputAmountMatch = outputMatch.match(/amount:\s*(\d+)/);
                        const outputResourceKey = outputKeyMatch ? outputKeyMatch[2] : 'unknown';
                        return {
                          name: outputKeyMatch ? formatDisplayName(outputResourceKey) : 'Unknown',
                          amount: outputAmountMatch ? parseInt(outputAmountMatch[1]) : 1,
                          resourceKey: outputResourceKey
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
                }
              });
            }
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

// Parse crafting recipes from skills.ts (how to make resources)
async function parseCraftingRecipes(): Promise<Map<string, CraftingRecipe[]>> {
  const recipesMap = new Map<string, CraftingRecipe[]>();
  
  try {
    const skillsPath = path.resolve(process.cwd(), 'files/data/skills.ts');
    const skillsContent = await fs.readFile(skillsPath, 'utf-8');
    
    // Parse cooking recipes
    await parseCookingRecipes(skillsContent, recipesMap);
    
    // Parse smithing recipes  
    await parseSmithingRecipes(skillsContent, recipesMap);
    
    // Parse crafting skill recipes
    await parseCraftingSkillRecipes(skillsContent, recipesMap);
    
    console.log(`📋 Parsed crafting recipes for ${recipesMap.size} resources`);
    return recipesMap;
    
  } catch (error) {
    console.error('❌ Error parsing crafting recipes:', error);
    return new Map();
  }
}

// Helper functions
function getLevelFromConstant(constant: string): number | undefined {
  const levelMap: Record<string, number> = {
    'T0_LEVEL': 1,
    'T1_LEVEL': 15,
    'T2_LEVEL': 30,
    'T3_LEVEL': 45,
    'T4_LEVEL': 60,
    'T5_LEVEL': 75,
    'T6_LEVEL': 90
  };
  return levelMap[constant];
}

function parseXpValue(xpStr: string): number | undefined {
  const numMatch = xpStr.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : undefined;
}

function parseStepsValue(stepsStr: string): number | undefined {
  const numMatch = stepsStr.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : undefined;
}

// Parse cooking recipes
async function parseCookingRecipes(skillsContent: string, recipesMap: Map<string, CraftingRecipe[]>): Promise<void> {
  try {
    const cookingStartMatch = skillsContent.match(/{\s*key:\s*['"`]cooking['"`][\s\S]*?recipes:\s*\[/);
    
    if (cookingStartMatch) {
      const recipesStartIndex = cookingStartMatch.index! + cookingStartMatch[0].length;
      
      // Find matching closing bracket
      let bracketLevel = 1;
      let braceLevel = 0;
      let recipesEndIndex = -1;
      
      for (let i = recipesStartIndex; i < skillsContent.length; i++) {
        const char = skillsContent[i];
        if (char === '[') {
          bracketLevel++;
        } else if (char === ']') {
          bracketLevel--;
          if (bracketLevel === 0 && braceLevel === 0) {
            recipesEndIndex = i;
            break;
          }
        } else if (char === '{') {
          braceLevel++;
        } else if (char === '}') {
          braceLevel--;
        }
      }
      
      if (recipesEndIndex > -1) {
        const recipesSection = skillsContent.substring(recipesStartIndex, recipesEndIndex);
        // Parse individual recipe objects
        let recipeBraceLevel = 0;
        let recipeStart = -1;
        const recipeTexts = [];
        
        for (let i = 0; i < recipesSection.length; i++) {
          const char = recipesSection[i];
          
          if (char === '{') {
            if (recipeBraceLevel === 0) {
              recipeStart = i;
            }
            recipeBraceLevel++;
          } else if (char === '}') {
            recipeBraceLevel--;
            if (recipeBraceLevel === 0 && recipeStart !== -1) {
              const recipeText = recipesSection.substring(recipeStart, i + 1);
              recipeTexts.push(recipeText);
              recipeStart = -1;
            }
          }
        }
        
        // Parse each cooking recipe
        for (const recipeText of recipeTexts) {
          const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(food|jams)\[['"`]([^'"`]+)['"`]\]/);
          if (!outputMatch) continue;
          
          const itemKey = outputMatch[2];
          
          // Parse inputs
          const inputs: CraftingInput[] = [];
          const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
          
          if (inputsStartMatch) {
            const inputsStart = inputsStartMatch.index! + inputsStartMatch[0].length;
            let bracketLevel = 1;
            let inputsEnd = -1;
            
            for (let i = inputsStart; i < recipeText.length; i++) {
              const char = recipeText[i];
              if (char === '[') {
                bracketLevel++;
              } else if (char === ']') {
                bracketLevel--;
                if (bracketLevel === 0) {
                  inputsEnd = i;
                  break;
                }
              }
            }
            
            if (inputsEnd !== -1) {
              const inputsContent = recipeText.substring(inputsStart, inputsEnd);
              const inputMatches = inputsContent.matchAll(/{\s*resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\],\s*amount:\s*(\d+)\s*}/g);
              
              for (const inputMatch of inputMatches) {
                const resourceType = inputMatch[1];
                const resourceKey = inputMatch[2];
                const amount = parseInt(inputMatch[3]);
                
                inputs.push({
                  name: resourceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  key: resourceKey,
                  amount: amount,
                  category: resourceType
                });
              }
            }
          }
          
          // Parse level requirement
          const levelMatch = recipeText.match(/requiredLevel:\s*(\w+)/);
          let requiredLevel = 1;
          if (levelMatch) {
            requiredLevel = getLevelFromConstant(levelMatch[1]) || 1;
          }
          
          const recipe: CraftingRecipe = {
            skill: 'Cooking',
            skillKey: 'cooking',
            requiredLevel: requiredLevel,
            inputs: inputs,
            xp: 3,
            steps: 3
          };
          
          if (!recipesMap.has(itemKey)) {
            recipesMap.set(itemKey, []);
          }
          recipesMap.get(itemKey)!.push(recipe);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error parsing cooking recipes:', error);
  }
}

// Parse smithing recipes
async function parseSmithingRecipes(skillsContent: string, recipesMap: Map<string, CraftingRecipe[]>): Promise<void> {
  try {
    const smithingStartMatch = skillsContent.match(/{\s*key:\s*['"`]smithing['"`][\s\S]*?recipes:\s*\[/);
    
    if (!smithingStartMatch) {
      console.log('⚠️  Smithing skill section not found');
      return;
    }
    
    const smithingStartIndex = smithingStartMatch.index! + smithingStartMatch[0].length;
    
    // Find the end using bracket matching
    let smithingEndIndex = -1;
    let bracketLevel = 1;
    let inString = false;
    let stringChar = '';
    
    for (let i = smithingStartIndex; i < skillsContent.length; i++) {
      const char = skillsContent[i];
      const prevChar = i > 0 ? skillsContent[i - 1] : '';
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      if (!inString) {
        if (char === '[') {
          bracketLevel++;
        } else if (char === ']') {
          bracketLevel--;
          if (bracketLevel === 0) {
            smithingEndIndex = i;
            break;
          }
        }
      }
    }
    
    if (smithingEndIndex === -1) {
      console.log('⚠️  Could not find end of smithing recipes array');
      return;
    }
    
    const smithingSection = skillsContent.substring(smithingStartIndex, smithingEndIndex);
    
    // Parse individual smithing recipe objects
    let recipeBraceLevel = 0;
    let recipeStart = -1;
    const smithingRecipeTexts = [];
    
    for (let i = 0; i < smithingSection.length; i++) {
      const char = smithingSection[i];
      
      if (char === '{') {
        if (recipeBraceLevel === 0) {
          recipeStart = i;
        }
        recipeBraceLevel++;
      } else if (char === '}') {
        recipeBraceLevel--;
        if (recipeBraceLevel === 0 && recipeStart !== -1) {
          const recipeText = smithingSection.substring(recipeStart, i + 1);
          smithingRecipeTexts.push(recipeText);
          recipeStart = -1;
        }
      }
    }
    
    // Parse each smithing recipe
    for (const recipeText of smithingRecipeTexts) {
      // Look for outputs that are resources (bars, toolParts, etc.)
      const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(bars|toolParts|shields|headArmors|chestArmors|legArmors|bootsArmors|glovesArmors)\[['"`]([^'"`]+)['"`]\]/);
      if (!outputMatch) continue;
      
      const itemKey = outputMatch[2];
      
      // Parse inputs
      const inputs: CraftingInput[] = [];
      const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
      
      if (inputsStartMatch) {
        const inputsStart = inputsStartMatch.index! + inputsStartMatch[0].length;
        let bracketLevel = 1;
        let inputsEnd = -1;
        
        for (let i = inputsStart; i < recipeText.length; i++) {
          const char = recipeText[i];
          if (char === '[') {
            bracketLevel++;
          } else if (char === ']') {
            bracketLevel--;
            if (bracketLevel === 0) {
              inputsEnd = i;
              break;
            }
          }
        }
        
        if (inputsEnd !== -1) {
          const inputsContent = recipeText.substring(inputsStart, inputsEnd);
          const inputMatches = inputsContent.matchAll(/{\s*resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\],\s*amount:\s*(\d+)\s*}/g);
          
          for (const inputMatch of inputMatches) {
            const resourceType = inputMatch[1];
            const resourceKey = inputMatch[2];
            const amount = parseInt(inputMatch[3]);
            
            inputs.push({
              name: resourceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              key: resourceKey,
              amount: amount,
              category: resourceType
            });
          }
        }
      }
      
      // Parse level requirement
      const levelMatch = recipeText.match(/requiredLevel:\s*(\w+(?:\s*\+\s*\d+)?)/);
      let requiredLevel = 1;
      if (levelMatch) {
        const levelStr = levelMatch[1];
        if (levelStr.includes('+')) {
          const parts = levelStr.split('+');
          const baseLevel = getLevelFromConstant(parts[0].trim()) || 1;
          const additionalLevel = parseInt(parts[1].trim()) || 0;
          requiredLevel = baseLevel + additionalLevel;
        } else {
          requiredLevel = getLevelFromConstant(levelStr) || 1;
        }
      }
      
      const recipe: CraftingRecipe = {
        skill: 'Smithing',
        skillKey: 'smithing',
        requiredLevel: requiredLevel,
        inputs: inputs
      };
      
      if (!recipesMap.has(itemKey)) {
        recipesMap.set(itemKey, []);
      }
      recipesMap.get(itemKey)!.push(recipe);
    }
    
  } catch (error) {
    console.error('❌ Error parsing smithing recipes:', error);
  }
}

// Parse crafting skill recipes
async function parseCraftingSkillRecipes(skillsContent: string, recipesMap: Map<string, CraftingRecipe[]>): Promise<void> {
  try {
    const craftingStartMatch = skillsContent.match(/{\s*key:\s*['"`]crafting['"`][\s\S]*?recipes:\s*\[/);
    
    if (!craftingStartMatch) {
      console.log('⚠️  Crafting skill section not found');
      return;
    }
    
    const craftingStartIndex = craftingStartMatch.index! + craftingStartMatch[0].length;
    
    // Find the end using bracket matching
    let craftingEndIndex = -1;
    let bracketLevel = 1;
    let inString = false;
    let stringChar = '';
    
    for (let i = craftingStartIndex; i < skillsContent.length; i++) {
      const char = skillsContent[i];
      const prevChar = i > 0 ? skillsContent[i - 1] : '';
      
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      if (!inString) {
        if (char === '[') {
          bracketLevel++;
        } else if (char === ']') {
          bracketLevel--;
          if (bracketLevel === 0) {
            craftingEndIndex = i;
            break;
          }
        }
      }
    }
    
    if (craftingEndIndex === -1) {
      console.log('⚠️  Could not find end of crafting recipes array');
      return;
    }
    
    const craftingSection = skillsContent.substring(craftingStartIndex, craftingEndIndex);
    
    // Parse individual crafting recipe objects
    let recipeBraceLevel = 0;
    let recipeStart = -1;
    const craftingRecipeTexts = [];
    
    for (let i = 0; i < craftingSection.length; i++) {
      const char = craftingSection[i];
      
      if (char === '{') {
        if (recipeBraceLevel === 0) {
          recipeStart = i;
        }
        recipeBraceLevel++;
      } else if (char === '}') {
        recipeBraceLevel--;
        if (recipeBraceLevel === 0 && recipeStart !== -1) {
          const recipeText = craftingSection.substring(recipeStart, i + 1);
          craftingRecipeTexts.push(recipeText);
          recipeStart = -1;
        }
      }
    }
    
    // Parse each crafting recipe - looking for resource outputs
    for (const recipeText of craftingRecipeTexts) {
      // Look for outputs that are resources
      const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(toolParts|handles|planks|bars)\[['"`]([^'"`]+)['"`]\]/);
      if (!outputMatch) continue;
      
      const itemKey = outputMatch[2];
      
      // Parse inputs
      const inputs: CraftingInput[] = [];
      const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
      
      if (inputsStartMatch) {
        const inputsStart = inputsStartMatch.index! + inputsStartMatch[0].length;
        let bracketLevel = 1;
        let inputsEnd = -1;
        
        for (let i = inputsStart; i < recipeText.length; i++) {
          const char = recipeText[i];
          if (char === '[') {
            bracketLevel++;
          } else if (char === ']') {
            bracketLevel--;
            if (bracketLevel === 0) {
              inputsEnd = i;
              break;
            }
          }
        }
        
        if (inputsEnd !== -1) {
          const inputsContent = recipeText.substring(inputsStart, inputsEnd);
          const inputMatches = inputsContent.matchAll(/{\s*resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\],\s*amount:\s*(\d+)\s*}/g);
          
          for (const inputMatch of inputMatches) {
            const resourceType = inputMatch[1];
            const resourceKey = inputMatch[2];
            const amount = parseInt(inputMatch[3]);
            
            inputs.push({
              name: resourceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              key: resourceKey,
              amount: amount,
              category: resourceType
            });
          }
        }
      }
      
      // Parse level requirement
      const levelMatch = recipeText.match(/requiredLevel:\s*(\w+(?:\s*\+\s*\d+)?)/);
      let requiredLevel = 1;
      if (levelMatch) {
        const levelStr = levelMatch[1];
        if (levelStr.includes('+')) {
          const parts = levelStr.split('+');
          const baseLevel = getLevelFromConstant(parts[0].trim()) || 1;
          const additionalLevel = parseInt(parts[1].trim()) || 0;
          requiredLevel = baseLevel + additionalLevel;
        } else {
          requiredLevel = getLevelFromConstant(levelStr) || 1;
        }
      }
      
      const recipe: CraftingRecipe = {
        skill: 'Crafting',
        skillKey: 'crafting',
        requiredLevel: requiredLevel,
        inputs: inputs
      };
      
      if (!recipesMap.has(itemKey)) {
        recipesMap.set(itemKey, []);
      }
      recipesMap.get(itemKey)!.push(recipe);
    }
    
  } catch (error) {
    console.error('❌ Error parsing crafting recipes:', error);
  }
}

// Interface for location information
interface LocationInfo {
  id: string;
  name: string;
  description: string;
}

// Parse location data from map.ts
async function parseLocationData(): Promise<Map<string, LocationInfo[]>> {
  const resourceLocations = new Map<string, LocationInfo[]>();
  
  try {
    const mapPath = path.resolve(process.cwd(), 'files/data/map.ts');
    const mapContent = await fs.readFile(mapPath, 'utf-8');
    
    // Extract actionDefinitions object
    const definitionsMatch = mapContent.match(/const actionDefinitions:\s*Record<string,\s*ActionDefinition>\s*=\s*{([\s\S]*?)};/);
    if (!definitionsMatch) {
      console.log('⚠️  Action definitions not found in map.ts');
      return resourceLocations;
    }
    
    
    const definitionsSection = definitionsMatch[1];
    
    // Parse each location definition
    const locationMatches = definitionsSection.matchAll(/(\w+):\s*{[\s\S]*?id:\s*['"`]([^'"`]+)['"`][\s\S]*?name:\s*['"`]([^'"`]+)['"`][\s\S]*?description:\s*['"`]([^'"`]+)['"`][\s\S]*?allowedActions:\s*{([\s\S]*?)}[\s\S]*?}/g);
    
    let locationCount = 0;
    for (const locationMatch of locationMatches) {
      locationCount++;
      const [, , locationId, locationName, locationDescription, allowedActionsSection] = locationMatch;
      
      const location: LocationInfo = {
        id: locationId,
        name: locationName,
        description: locationDescription
      };
      
      // Parse allowed actions to find resources
      const skillMatches = allowedActionsSection.matchAll(/(\w+):\s*\[([\s\S]*?)\]/g);
      
      for (const skillMatch of skillMatches) {
        const [, skillName, resourcesSection] = skillMatch;
        
        // Extract resource names from the array
        const resourceMatches = resourcesSection.matchAll(/['"`]([^'"`]+)['"`]/g);
        
        for (const resourceMatch of resourceMatches) {
          const actionKey = resourceMatch[1];
          
          // Map action key to actual resource key using skills data
          const actualResourceKeys = await mapActionToResources(actionKey, skillName);
          
          
          for (const resourceKey of actualResourceKeys) {
            if (!resourceLocations.has(resourceKey)) {
              resourceLocations.set(resourceKey, []);
            }
            resourceLocations.get(resourceKey)!.push(location);
          }
        }
      }
    }
    
    console.log(`📍 Parsed location data for ${resourceLocations.size} resources`);
    return resourceLocations;
    
  } catch (error) {
    console.error('❌ Error parsing location data:', error);
    return resourceLocations;
  }
}

// Map action key from map.ts to actual resource keys from skills.ts
async function mapActionToResources(actionKey: string, skillName: string): Promise<string[]> {
  try {
    const skillsPath = path.resolve(process.cwd(), 'files/data/skills.ts');
    const skillsContent = await fs.readFile(skillsPath, 'utf-8');
    
    // Simple approach: search for all recipe keys that contain the action key
    const resourceKeys: string[] = [];
    
    // Find all recipes in the file that contain the action key
    const escapedActionKey = actionKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`key:\\s*['"\`]([^'"\`]*${escapedActionKey}[^'"\`]*)['"\`]`, 'g');
    const allRecipeMatches = skillsContent.matchAll(pattern);
    
    for (const match of allRecipeMatches) {
      const recipeKey = match[1];
      resourceKeys.push(recipeKey);
      
    }
    
    return resourceKeys;
    
  } catch (error) {
    console.error(`❌ Error mapping action ${actionKey} to resources:`, error);
    return [];
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
function generateResourcePageContent(resource: any, recipes: RecipeInfo[] = [], craftingRecipes: CraftingRecipe[] = [], locations: LocationInfo[] = []): string {
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

${craftingRecipes.length > 0 ? `
## Crafting

This resource can be crafted using the following recipe${craftingRecipes.length > 1 ? 's' : ''}:

${craftingRecipes.map(recipe => {
  const materials = recipe.inputs.map(input => 
    `- ${input.amount}x [${input.name}](${getItemUrl(input.key)})`
  ).join('\\n');
  
  return `### ${recipe.skill}${recipe.requiredLevel > 1 ? ` (Level ${recipe.requiredLevel} required)` : ''}

**Required Materials:**
${materials}

${recipe.xp ? `**XP Gained:** ${recipe.xp}` : ''}${recipe.steps ? `${recipe.xp ? ' | ' : ''}**Steps:** ${recipe.steps}` : ''}`;
}).join('\\n\\n')}

` : ''}

## Acquisition

${getAcquisitionInfo(resource.category)}${locations.length > 0 ? `

### Locations

This resource can be found in the following areas:

${locations.map(location => `**${location.name}**  
${location.description}`).join('\\n\\n')}` : ''}

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
  
  // Create link to individual item/resource page (the main output of the recipe)
  const recipeLink = recipe.output.length > 0 
    ? getItemUrl(recipe.output[0].resourceKey)
    : `/docs/skills/individual/${recipe.skillKey}#${recipe.key}`;
  
  return `| **[${recipe.name}](${recipeLink})** | ${recipe.skillName} | ${levelReq} | ${xpReward} | ${outputs} |`;
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
    
    console.log('🔧 Parsing crafting recipes (how to make resources)...');
    const craftingRecipes = await parseCraftingRecipes();
    
    console.log('🗺️  Parsing location data from map...');
    const locationData = await parseLocationData();
    
    console.log(`📋 Found recipes for ${recipesByResource.size} different resources`);
    console.log(`📋 Found crafting recipes for ${craftingRecipes.size} different resources`);
    console.log(`📍 Found location data for ${locationData.size} different resources`);
    
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
        const resourceCraftingRecipes = craftingRecipes.get(resource.key) || [];
        const resourceLocations = locationData.get(resource.key) || [];
        const pageContent = generateResourcePageContent(resource, resourceRecipes, resourceCraftingRecipes, resourceLocations);
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