import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/items/individual');

interface ItemData {
  key: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  price: number;
  category: string;
  equipLocation?: string;
  stats?: Record<string, number>;
  statBoost?: {
    stats: Record<string, number>;
    duration?: number;
  };
  classLocked?: string[];
  levelLocked?: number;
  setId?: string;
  itemClass?: string;
}

interface CraftingInput {
  key: string;
  name: string;
  amount: number;
  category: string;
}

interface CraftingRecipe {
  skill: string;
  skillKey?: string;
  level?: number;
  requiredLevel?: number;
  xp?: number;
  steps?: number;
  inputs: CraftingInput[];
}

// Helper function to extract asset path from require statement
function extractAssetPath(requireStr: string): string {
  const match = requireStr.match(/require\(['"`]([^'"`]+)['"`]\)/);
  if (match && match[1]) {
    return match[1].replace('../assets', '/assets');
  }
  return '/assets/icons/question.png';
}

// Helper function to format display names
function formatDisplayName(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Parse JavaScript object notation to extract item data
function parseItemFromText(itemText: string, category: string): ItemData | null {
  try {
    // Extract key from the inner key field - format is "key: 'item_key'"
    const keyMatch = itemText.match(/key:\s*['"`]([^'"`]+)['"`]/);
    if (!keyMatch) {
      return null;
    }
    
    const key = keyMatch[1];
    
    // Extract individual properties using regex
    const nameMatch = itemText.match(/name:\s*['"`]([^'"`]+)['"`]/);
    const descMatch = itemText.match(/description:\s*['"`]([^'"`]*?)['"`]/);
    const iconMatch = itemText.match(/icon:\s*(require\([^)]+\))/);
    const typeMatch = itemText.match(/type:\s*['"`]([^'"`]+)['"`]/);
    const priceMatch = itemText.match(/price:\s*(\d+)/);
    const equipLocationMatch = itemText.match(/equipLocation:\s*['"`]([^'"`]+)['"`]/);
    const classLockedMatch = itemText.match(/classLocked:\s*\[([^\]]+)\]/);
    const levelLockedMatch = itemText.match(/levelLocked:\s*(\d+)/);
    const setIdMatch = itemText.match(/setId:\s*['"`]([^'"`]+)['"`]/);
    const itemClassMatch = itemText.match(/itemClass:\s*['"`]([^'"`]+)['"`]/);
    
    // Parse stats object
    const statsMatch = itemText.match(/stats:\s*{([^}]*)}/);
    let stats: Record<string, number> = {};
    if (statsMatch) {
      const statsContent = statsMatch[1];
      const statPairs = statsContent.match(/(\w+):\s*([^,}]+)/g);
      if (statPairs) {
        statPairs.forEach(pair => {
          const [statKey, value] = pair.split(':').map(s => s.trim());
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            stats[statKey] = numValue;
          }
        });
      }
    }
    
    // Parse statBoost object
    const statBoostMatch = itemText.match(/statBoost:\s*{([^}]*)}/);
    let statBoost: { stats: Record<string, number>; duration?: number } | undefined;
    if (statBoostMatch) {
      const statBoostContent = statBoostMatch[1];
      const statsInnerMatch = statBoostContent.match(/stats:\s*{([^}]*)}/);
      const durationMatch = statBoostContent.match(/duration:\s*(\d+)/);
      
      if (statsInnerMatch) {
        const boostStats: Record<string, number> = {};
        const boostStatPairs = statsInnerMatch[1].match(/(\w+):\s*([^,}]+)/g);
        if (boostStatPairs) {
          boostStatPairs.forEach(pair => {
            const [statKey, value] = pair.split(':').map(s => s.trim());
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              boostStats[statKey] = numValue;
            }
          });
        }
        
        statBoost = {
          stats: boostStats,
          duration: durationMatch ? parseInt(durationMatch[1]) : undefined
        };
      }
    }
    
    return {
      key,
      name: nameMatch ? nameMatch[1] : formatDisplayName(key),
      description: descMatch ? descMatch[1] : '',
      icon: iconMatch ? extractAssetPath(iconMatch[1]) : '/assets/icons/question.png',
      type: typeMatch ? typeMatch[1] : category.toLowerCase(),
      price: priceMatch ? parseInt(priceMatch[1]) : 0,
      category: category,
      equipLocation: equipLocationMatch ? equipLocationMatch[1] : undefined,
      stats: Object.keys(stats).length > 0 ? stats : undefined,
      statBoost: statBoost,
      classLocked: classLockedMatch ? classLockedMatch[1].split(',').map(s => s.trim().replace(/['"`]/g, '')) : undefined,
      levelLocked: levelLockedMatch ? parseInt(levelLockedMatch[1]) : undefined,
      setId: setIdMatch ? setIdMatch[1] : undefined,
      itemClass: itemClassMatch ? itemClassMatch[1] : undefined
    };
  } catch (error) {
    console.error(`Error parsing item: ${error}`);
    return null;
  }
}

// Parse crafting recipes from skills.ts file
async function parseCraftingRecipes(): Promise<Map<string, CraftingRecipe[]>> {
  const recipesMap = new Map<string, CraftingRecipe[]>();
  
  try {
    const skillsPath = path.resolve(process.cwd(), 'files/data/skills.ts');
    const skillsContent = await fs.readFile(skillsPath, 'utf-8');
    
    // Find the cooking skill section specifically  
    const cookingStartMatch = skillsContent.match(/{\s*key:\s*['"`]cooking['"`][\s\S]*?recipes:\s*\[/);
    
    if (cookingStartMatch) {
      const recipesStartIndex = cookingStartMatch.index! + cookingStartMatch[0].length;
      
      // Find the matching closing bracket for the recipes array
      // We need to be careful about nested arrays and objects
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
      
      if (recipesEndIndex === -1) {
        console.log('⚠️  Could not find end of cooking recipes array');
        return recipesMap;
      }
      
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
      
      console.log(`📋 Found ${recipeTexts.length} cooking recipes`);
      
      // Parse each recipe
      for (const recipeText of recipeTexts) {
        // Extract output item key - handle both food and jams
        const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(food|jams)\[['"`]([^'"`]+)['"`]\]/);
        if (!outputMatch) continue;
        
        const itemKey = outputMatch[2]; // Get the actual item key, not the category
        
        // Parse recipe details
        const levelMatch = recipeText.match(/requiredLevel:\s*(\w+)/);
        const xpMatch = recipeText.match(/xpReward:\s*([^,}]+)/);
        const stepsMatch = recipeText.match(/requiredSteps:\s*([^,}]+)/);
        
        // Parse inputs - exclude the output item
        const inputs: CraftingInput[] = [];
        
        // Use a more robust approach to find inputs array with proper bracket matching
        const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
        if (inputsStartMatch) {
          const inputsStartIndex = inputsStartMatch.index! + inputsStartMatch[0].length;
          let bracketLevel = 1;
          let inputsEndIndex = -1;
          
          for (let i = inputsStartIndex; i < recipeText.length; i++) {
            const char = recipeText[i];
            if (char === '[') {
              bracketLevel++;
            } else if (char === ']') {
              bracketLevel--;
              if (bracketLevel === 0) {
                inputsEndIndex = i;
                break;
              }
            }
          }
          
          if (inputsEndIndex !== -1) {
            const inputsSection = recipeText.substring(inputsStartIndex, inputsEndIndex);
            const inputMatches = inputsSection.matchAll(/{\s*resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\],\s*amount:\s*(\d+)\s*}/g);
          
            for (const inputMatch of inputMatches) {
              const inputCategory = inputMatch[1];
              const inputKey = inputMatch[2];
              const amount = parseInt(inputMatch[3]);
              
              inputs.push({
                key: inputKey,
                name: formatDisplayName(inputKey),
                amount: amount,
                category: inputCategory
              });
            }
          }
        }
        
        if (inputs.length > 0) {
          const recipe: CraftingRecipe = {
            skill: 'Cooking',
            level: levelMatch ? getLevelFromConstant(levelMatch[1]) : undefined,
            xp: xpMatch ? parseXpValue(xpMatch[1]) : undefined,
            steps: stepsMatch ? parseStepsValue(stepsMatch[1]) : undefined,
            inputs: inputs
          };
          
          if (!recipesMap.has(itemKey)) {
            recipesMap.set(itemKey, []);
          }
          recipesMap.get(itemKey)!.push(recipe);
        }
      }
    }
    
    // Search for jam recipes directly in the entire skills content
    // Simple approach: find raspberry_jam recipe specifically
    const raspberryJamMatch = skillsContent.match(/{\s*key:\s*'raspberry_jam'[\s\S]*?inputs:\s*\[\s*{\s*resource:\s*foraging\['raspberry'\],\s*amount:\s*5\s*}\s*\][\s\S]*?requiredLevel:\s*T3_LEVEL[\s\S]*?}/);
    
    if (raspberryJamMatch) {
      const recipe: CraftingRecipe = {
        skill: 'Cooking',
        level: 45, // T3_LEVEL = 45
        inputs: [{
          key: 'raspberry',
          name: 'Raspberry',
          amount: 5,
          category: 'foraging'
        }]
      };
      
      recipesMap.set('raspberry_jam', [recipe]);
    }
    
    // Parse smithing recipes for tools and armor
    await parseSmithingRecipes(skillsContent, recipesMap);
    await parseCraftingSkillRecipes(skillsContent, recipesMap);
    
    // TODO: Add parsing for other skills like carpentry, etc.
    
    console.log(`📋 Parsed crafting recipes for ${recipesMap.size} items`);
    return recipesMap;
    
  } catch (error) {
    console.error('❌ Error parsing crafting recipes:', error);
    return new Map();
  }
}

// Helper function to convert level constants to numbers
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

// Helper function to parse XP values
function parseXpValue(xpStr: string): number | undefined {
  // Simple extraction - you might need to adjust based on actual patterns
  const numMatch = xpStr.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : undefined;
}

// Helper function to parse steps values
function parseStepsValue(stepsStr: string): number | undefined {
  // Simple extraction - you might need to adjust based on actual patterns
  const numMatch = stepsStr.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : undefined;
}

// Parse smithing recipes for tools and armor
async function parseSmithingRecipes(skillsContent: string, recipesMap: Map<string, CraftingRecipe[]>): Promise<void> {
  try {
    // Find the smithing skill section
    const smithingStartMatch = skillsContent.match(/{\s*key:\s*['"`]smithing['"`][\s\S]*?recipes:\s*\[/);
    
    if (!smithingStartMatch) {
      console.log('⚠️  Smithing skill section not found');
      return;
    }
    
    const smithingStartIndex = smithingStartMatch.index! + smithingStartMatch[0].length;
    
    // Find the end of the smithing recipes array using balanced bracket matching
    let smithingEndIndex = -1;
    let bracketLevel = 1; // We start after the opening '['
    let inString = false;
    let stringChar = '';
    
    for (let i = smithingStartIndex; i < skillsContent.length; i++) {
      const char = skillsContent[i];
      const prevChar = i > 0 ? skillsContent[i - 1] : '';
      
      // Handle string literals to avoid counting brackets inside strings
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      // Only count brackets when we're not inside a string
      if (!inString) {
        if (char === '[') {
          bracketLevel++;
        } else if (char === ']') {
          bracketLevel--;
          if (bracketLevel === 0) {
            smithingEndIndex = i;
            console.log(`🔍 DEBUG: Found smithing recipes end using bracket matching at ${smithingEndIndex}`);
            break;
          }
        }
      }
    }
    
    if (smithingEndIndex === -1) {
      console.log('⚠️  Could not find end of smithing recipes array');
      return;
    }
    
    console.log(`🔍 DEBUG: Smithing section from index ${smithingStartIndex} to ${smithingEndIndex} (length: ${smithingEndIndex - smithingStartIndex})`);
    
    const smithingSection = skillsContent.substring(smithingStartIndex, smithingEndIndex);
    
    // Debug: Check if smithing section contains blue_axe
    if (smithingSection.includes('blue_axe')) {
      console.log('✅ DEBUG: blue_axe found in smithing section');
    } else {
      console.log('❌ DEBUG: blue_axe NOT found in smithing section');
      console.log(`Last 500 chars of smithing section: ...${smithingSection.slice(-500)}`);
    }
    
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
    
    console.log(`📋 Found ${smithingRecipeTexts.length} smithing recipes`);
    
    // Debug: Check if any recipe contains blue_axe
    let foundBlueAxe = false;
    for (let i = 0; i < smithingRecipeTexts.length; i++) {
      if (smithingRecipeTexts[i].includes('blue_axe')) {
        console.log(`🔍 DEBUG: Found blue_axe in recipe ${i}:`, smithingRecipeTexts[i].substring(0, 300));
        foundBlueAxe = true;
      }
    }
    if (!foundBlueAxe) {
      console.log('❌ DEBUG: blue_axe not found in any smithing recipe text');
    }
    
    // Parse each smithing recipe
    for (const recipeText of smithingRecipeTexts) {
      // Extract output item key - handle tools, armor, weapons
      const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(tools|headArmors|chestArmors|legArmors|bootsArmors|glovesArmors|swords|shields|allWeapons)\[['"`]([^'"`]+)['"`]\]/);
      if (!outputMatch) {
        // Debug: Check if this recipe contains blue_axe
        if (recipeText.includes('blue_axe')) {
          console.log('❌ DEBUG: blue_axe recipe found but output pattern did not match');
          console.log('Recipe text:', recipeText.substring(0, 200));
        }
        continue;
      }
      
      const itemKey = outputMatch[2];
      
      if (itemKey === 'blue_axe') {
        console.log(`📋 DEBUG: Found blue_axe recipe in smithing!`);
      }
      
      // Parse recipe details
      const levelMatch = recipeText.match(/requiredLevel:\s*(\w+(?:\s*\+\s*\d+)?)/);
      const xpMatch = recipeText.match(/xpReward:\s*([^,}]+)/);
      const stepsMatch = recipeText.match(/requiredSteps:\s*([^,}]+)/);
      
      // Parse inputs for smithing recipes
      const inputs: CraftingInput[] = [];
      const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
      if (inputsStartMatch) {
        const inputsStartIndex = inputsStartMatch.index! + inputsStartMatch[0].length;
        let bracketLevel = 1;
        let braceLevel = 0;
        let inputsEndIndex = -1;
        
        for (let i = inputsStartIndex; i < recipeText.length; i++) {
          const char = recipeText[i];
          if (char === '[') {
            bracketLevel++;
          } else if (char === ']') {
            bracketLevel--;
            if (bracketLevel === 0 && braceLevel === 0) {
              inputsEndIndex = i;
              break;
            }
          } else if (char === '{') {
            braceLevel++;
          } else if (char === '}') {
            braceLevel--;
          }
        }
        
        if (inputsEndIndex !== -1) {
          const inputsSection = recipeText.substring(inputsStartIndex, inputsEndIndex);
          const inputMatches = inputsSection.matchAll(/{\s*resource:\s*(\w+)\[['"`]([^'"`]+)['"`]\],\s*amount:\s*(\d+)\s*}/g);
          
          for (const inputMatch of inputMatches) {
            const inputCategory = inputMatch[1];
            const inputKey = inputMatch[2];
            const amount = parseInt(inputMatch[3]);
            
            inputs.push({
              key: inputKey,
              name: formatDisplayName(inputKey),
              amount: amount,
              category: inputCategory
            });
          }
        }
      }
      
      if (inputs.length > 0) {
        const recipe: CraftingRecipe = {
          skill: 'Smithing',
          level: levelMatch ? parseSmithingLevel(levelMatch[1]) : undefined,
          xp: xpMatch ? parseXpValue(xpMatch[1]) : undefined,
          steps: stepsMatch ? parseStepsValue(stepsMatch[1]) : undefined,
          inputs: inputs
        };
        
        if (!recipesMap.has(itemKey)) {
          recipesMap.set(itemKey, []);
        }
        recipesMap.get(itemKey)!.push(recipe);
      }
    }
    
  } catch (error) {
    console.error('❌ Error parsing smithing recipes:', error);
  }
}

// Parse crafting skill recipes for advanced tools and items
async function parseCraftingSkillRecipes(skillsContent: string, recipesMap: Map<string, CraftingRecipe[]>): Promise<void> {
  try {
    // Find the crafting skill section
    const craftingStartMatch = skillsContent.match(/{\s*key:\s*['"`]crafting['"`][\s\S]*?recipes:\s*\[/);
    
    if (!craftingStartMatch) {
      console.log('⚠️  Crafting skill section not found');
      return;
    }
    
    const craftingStartIndex = craftingStartMatch.index! + craftingStartMatch[0].length;
    
    // Find the end of the crafting recipes array using balanced bracket matching
    let craftingEndIndex = -1;
    let bracketLevel = 1; // We start after the opening '['
    let inString = false;
    let stringChar = '';
    
    for (let i = craftingStartIndex; i < skillsContent.length; i++) {
      const char = skillsContent[i];
      const prevChar = i > 0 ? skillsContent[i - 1] : '';
      
      // Handle string literals to avoid counting brackets inside strings
      if (!inString && (char === '"' || char === "'" || char === '`')) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
      
      // Only count brackets when we're not inside a string
      if (!inString) {
        if (char === '[') {
          bracketLevel++;
        } else if (char === ']') {
          bracketLevel--;
          if (bracketLevel === 0) {
            craftingEndIndex = i;
            console.log(`🔍 DEBUG: Found crafting recipes end using bracket matching at ${craftingEndIndex}`);
            break;
          }
        }
      }
    }
    
    if (craftingEndIndex === -1) {
      console.log('⚠️  Could not find end of crafting recipes array');
      return;
    }
    
    console.log(`🔍 DEBUG: Crafting section from index ${craftingStartIndex} to ${craftingEndIndex} (length: ${craftingEndIndex - craftingStartIndex})`);
    
    const craftingSection = skillsContent.substring(craftingStartIndex, craftingEndIndex);
    
    // Debug: Check if crafting section contains blue_axe
    if (craftingSection.includes('blue_axe')) {
      console.log('✅ DEBUG: blue_axe found in crafting section');
    } else {
      console.log('❌ DEBUG: blue_axe NOT found in crafting section');
    }
    
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
    
    console.log(`📋 Found ${craftingRecipeTexts.length} crafting recipes`);
    
    // Debug: Check if any recipe contains blue_axe
    let foundBlueAxe = false;
    for (let i = 0; i < craftingRecipeTexts.length; i++) {
      if (craftingRecipeTexts[i].includes('blue_axe')) {
        console.log(`🔍 DEBUG: Found blue_axe in crafting recipe ${i}:`, craftingRecipeTexts[i].substring(0, 300));
        foundBlueAxe = true;
      }
    }
    if (!foundBlueAxe) {
      console.log('❌ DEBUG: blue_axe not found in any crafting recipe text');
    }
    
    // Parse each crafting recipe
    for (const recipeText of craftingRecipeTexts) {
      // Extract output item key - handle tools, armor, weapons
      const outputMatch = recipeText.match(/output:\s*\[\s*{\s*resource:\s*(tools|headArmors|chestArmors|legArmors|bootsArmors|glovesArmors|swords|shields|allWeapons)\[['"`]([^'"`]+)['"`]\]/);
      if (!outputMatch) {
        // Debug: Check if this recipe contains blue_axe
        if (recipeText.includes('blue_axe')) {
          console.log('❌ DEBUG: blue_axe recipe found but output pattern did not match');
          console.log('Recipe text:', recipeText.substring(0, 200));
        }
        continue;
      }
      
      const itemKey = outputMatch[2];
      
      if (itemKey === 'blue_axe') {
        console.log(`📋 DEBUG: Found blue_axe recipe in crafting!`);
      }
      
      // Parse recipe details
      const levelMatch = recipeText.match(/requiredLevel:\s*(\w+(?:\s*\+\s*\d+)?)/);
      const xpMatch = recipeText.match(/xpReward:\s*([^,}]+)/);
      const stepsMatch = recipeText.match(/requiredSteps:\s*([^,}]+)/);
      
      // Parse inputs for crafting recipes using balanced bracket matching
      const inputs: CraftingInput[] = [];
      const inputsStartMatch = recipeText.match(/inputs:\s*\[/);
      
      if (inputsStartMatch) {
        const inputsStart = inputsStartMatch.index! + inputsStartMatch[0].length;
        
        // Find the matching closing bracket for the inputs array
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
          
          if (recipeText.includes('blue_axe')) {
            console.log('🔍 DEBUG: blue_axe full inputs content:', inputsContent);
          }
          
          // Use regex to find all input objects directly
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
          
          if (recipeText.includes('blue_axe')) {
            console.log(`✅ DEBUG: Parsed ${inputs.length} inputs for blue_axe:`, inputs.map(i => `${i.amount}x ${i.name}`));
          }
        }
      } else if (recipeText.includes('blue_axe')) {
        console.log('❌ DEBUG: No inputs section found for blue_axe');
      }
      
      // Parse level requirement
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
        inputs: inputs,
        xp: xpMatch ? parseXpValue(xpMatch[1]) : undefined,
        steps: stepsMatch ? parseStepsValue(stepsMatch[1]) : undefined
      };
      
      if (!recipesMap.has(itemKey)) {
        recipesMap.set(itemKey, []);
      }
      recipesMap.get(itemKey)!.push(recipe);
      
      if (itemKey === 'blue_axe') {
        console.log(`✅ DEBUG: Successfully added blue_axe recipe to recipesMap`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error parsing crafting recipes:', error);
  }
}

// Helper function to parse smithing level requirements (handles T5_LEVEL + 2 format)
function parseSmithingLevel(levelStr: string): number | undefined {
  if (levelStr.includes('+')) {
    const parts = levelStr.split('+');
    const baseLevel = getLevelFromConstant(parts[0].trim());
    const addition = parseInt(parts[1].trim());
    return baseLevel ? baseLevel + addition : undefined;
  }
  return getLevelFromConstant(levelStr);
}

// Extract all items from the source files using balanced brace parsing
async function extractAllItems(): Promise<ItemData[]> {
  try {
    const itemsPath = path.resolve(process.cwd(), 'files/data/items.ts');
    const armorPath = path.resolve(process.cwd(), 'files/data/armor.ts');
    const weaponsPath = path.resolve(process.cwd(), 'files/data/weapons.ts');
    
    const items: ItemData[] = [];
    
    // Parse items.ts
    const itemsContent = await fs.readFile(itemsPath, 'utf-8');
    
    // Define the sections to parse
    const sections = [
      { name: 'Tools', regex: /export const tools:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Food', regex: /export const food:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Rings', regex: /export const rings:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Potions', regex: /export const potions:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Amulets', regex: /export const amulets:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Quest Items', regex: /export const questItems:\s*Record<[^>]+>\s*=\s*{/ },
      { name: 'Jams', regex: /export const jams:\s*Record<[^>]+>\s*=\s*{/ }
    ];
    
    // Parse each section
    for (const section of sections) {
      const sectionMatch = itemsContent.match(section.regex);
      if (!sectionMatch) {
        console.log(`⚠️  Section ${section.name} not found`);
        continue;
      }
      
      const startIndex = sectionMatch.index! + sectionMatch[0].length - 1; // Position of the opening {
      
      // Find the matching closing brace using balanced parsing
      let braceLevel = 0;
      let endIndex = -1;
      
      for (let i = startIndex; i < itemsContent.length; i++) {
        const char = itemsContent[i];
        if (char === '{') {
          braceLevel++;
        } else if (char === '}') {
          braceLevel--;
          if (braceLevel === 0) {
            endIndex = i;
            break;
          }
        }
      }
      
      if (endIndex === -1) {
        console.log(`⚠️  Could not find end of section ${section.name}`);
        continue;
      }
      
      const sectionContent = itemsContent.substring(startIndex + 1, endIndex);
      
      // Parse individual items using balanced brace parsing
      const itemObjects = [];
      let itemBraceLevel = 0;
      let itemStart = -1;
      let i = 0;
      
      while (i < sectionContent.length) {
        const char = sectionContent[i];
        
        if (char === '{') {
          if (itemBraceLevel === 0) {
            // Find the item key by looking backwards for "key_name: {"
            let keyEnd = i - 1;
            while (keyEnd >= 0 && /\s/.test(sectionContent[keyEnd])) {
              keyEnd--;
            }
            keyEnd++; // Move to the position after the last non-space character
            
            let keyStart = keyEnd - 1;
            while (keyStart >= 0 && /[\w_]/.test(sectionContent[keyStart])) {
              keyStart--;
            }
            keyStart++; // Move to the start of the key name
            
            // Include the key name and colon in the extracted text
            itemStart = keyStart;
          }
          itemBraceLevel++;
        } else if (char === '}') {
          itemBraceLevel--;
          if (itemBraceLevel === 0 && itemStart !== -1) {
            const itemText = sectionContent.substring(itemStart, i + 1);
            itemObjects.push(itemText);
            itemStart = -1;
          }
        }
        i++;
      }
      
      // Parse each item
      console.log(`📋 Found ${itemObjects.length} items in ${section.name} section`);
      
      let successfullyParsed = 0;
      itemObjects.forEach((itemText, index) => {
        const item = parseItemFromText(itemText, section.name);
        if (item) {
          items.push(item);
          successfullyParsed++;
        } else {
          console.log(`⚠️  Failed to parse item ${index} in ${section.name}. Text preview: ${itemText.substring(0, 100)}`);
        }
      });
      
      console.log(`✅ Successfully parsed ${successfullyParsed}/${itemObjects.length} items from ${section.name}`);
    }
    
    // Parse armor.ts
    try {
      const armorContent = await fs.readFile(armorPath, 'utf-8');
      const armorMatch = armorContent.match(/export const allArmor:\s*Record<[^>]+>\s*=\s*{/);
      if (armorMatch) {
        const startIndex = armorMatch.index! + armorMatch[0].length - 1;
        let braceLevel = 0;
        let endIndex = -1;
        
        for (let i = startIndex; i < armorContent.length; i++) {
          const char = armorContent[i];
          if (char === '{') braceLevel++;
          else if (char === '}') {
            braceLevel--;
            if (braceLevel === 0) {
              endIndex = i;
              break;
            }
          }
        }
        
        if (endIndex !== -1) {
          const armorSection = armorContent.substring(startIndex + 1, endIndex);
          
          // Parse armor items
          const armorObjects = [];
          let itemBraceLevel = 0;
          let itemStart = -1;
          let i = 0;
          
          while (i < armorSection.length) {
            const char = armorSection[i];
            
            if (char === '{') {
              if (itemBraceLevel === 0) {
                let keyStart = i - 1;
                while (keyStart >= 0 && /\s/.test(armorSection[keyStart])) keyStart--;
                while (keyStart >= 0 && /\w/.test(armorSection[keyStart])) keyStart--;
                keyStart++;
                itemStart = keyStart;
              }
              itemBraceLevel++;
            } else if (char === '}') {
              itemBraceLevel--;
              if (itemBraceLevel === 0 && itemStart !== -1) {
                const itemText = armorSection.substring(itemStart, i + 1);
                armorObjects.push(itemText);
                itemStart = -1;
              }
            }
            i++;
          }
          
          console.log(`📋 Found ${armorObjects.length} items in Armor section`);
          armorObjects.forEach(itemText => {
            const item = parseItemFromText(itemText, 'Armor');
            if (item) items.push(item);
          });
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not parse armor.ts: ${error}`);
    }
    
    // Parse weapons.ts
    try {
      const weaponsContent = await fs.readFile(weaponsPath, 'utf-8');
      const weaponsMatch = weaponsContent.match(/export const allWeapons:\s*Record<[^>]+>\s*=\s*{/);
      if (weaponsMatch) {
        const startIndex = weaponsMatch.index! + weaponsMatch[0].length - 1;
        let braceLevel = 0;
        let endIndex = -1;
        
        for (let i = startIndex; i < weaponsContent.length; i++) {
          const char = weaponsContent[i];
          if (char === '{') braceLevel++;
          else if (char === '}') {
            braceLevel--;
            if (braceLevel === 0) {
              endIndex = i;
              break;
            }
          }
        }
        
        if (endIndex !== -1) {
          const weaponsSection = weaponsContent.substring(startIndex + 1, endIndex);
          
          // Parse weapon items
          const weaponObjects = [];
          let itemBraceLevel = 0;
          let itemStart = -1;
          let i = 0;
          
          while (i < weaponsSection.length) {
            const char = weaponsSection[i];
            
            if (char === '{') {
              if (itemBraceLevel === 0) {
                let keyStart = i - 1;
                while (keyStart >= 0 && /\s/.test(weaponsSection[keyStart])) keyStart--;
                while (keyStart >= 0 && /\w/.test(weaponsSection[keyStart])) keyStart--;
                keyStart++;
                itemStart = keyStart;
              }
              itemBraceLevel++;
            } else if (char === '}') {
              itemBraceLevel--;
              if (itemBraceLevel === 0 && itemStart !== -1) {
                const itemText = weaponsSection.substring(itemStart, i + 1);
                weaponObjects.push(itemText);
                itemStart = -1;
              }
            }
            i++;
          }
          
          console.log(`📋 Found ${weaponObjects.length} items in Weapons section`);
          weaponObjects.forEach(itemText => {
            const item = parseItemFromText(itemText, 'Weapons');
            if (item) items.push(item);
          });
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not parse weapons.ts: ${error}`);
    }
    
    return items;
  } catch (error) {
    console.error('Error extracting items:', error);
    return [];
  }
}

// Generate page content for an item with crafting recipes
function generateItemPageContent(item: ItemData, recipes: CraftingRecipe[]): string {
  const statsSection = item.stats && Object.keys(item.stats).length > 0 
    ? `## Stats

| Stat | Value |
|------|-------|
${Object.entries(item.stats).map(([stat, value]) => `| ${formatDisplayName(stat)} | +${value} |`).join('\n')}
`
    : '';

  const statBoostSection = item.statBoost && Object.keys(item.statBoost.stats).length > 0
    ? `## Effects

| Effect | Value |
|--------|-------|
${Object.entries(item.statBoost.stats).map(([stat, value]) => `| ${formatDisplayName(stat)} | +${value}${item.statBoost?.duration ? ` (${item.statBoost.duration} steps)` : ''} |`).join('\n')}
`
    : '';

  const craftingSection = recipes.length > 0
    ? `## Crafting

This item can be crafted using the following recipe${recipes.length > 1 ? 's' : ''}:

${recipes.map(recipe => `### ${recipe.skill}${recipe.level ? ` (Level ${recipe.level} required)` : ''}

**Required Materials:**
${recipe.inputs.map(input => `- ${input.amount}x [${input.name}](/docs/resources/individual/${input.key})`).join('\n')}

${recipe.xp ? `**XP Gained:** ${recipe.xp}` : ''}${recipe.steps ? `${recipe.xp ? ' | ' : ''}**Steps:** ${recipe.steps}` : ''}
`).join('\n')}
`
    : '';

  const priceDisplay = item.price > 0 ? `
        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-md">
          **Price:** ${item.price.toLocaleString()} coins
        </span>` : '';

  const additionalProperties = [
    item.equipLocation ? `| **Equip Location** | ${formatDisplayName(item.equipLocation)} |` : '',
    item.classLocked ? `| **Class Requirement** | ${item.classLocked.join(', ')} |` : '',
    item.levelLocked ? `| **Level Requirement** | ${item.levelLocked} |` : '',
    item.setId ? `| **Set** | ${item.setId} |` : '',
    item.itemClass ? `| **Item Class** | ${item.itemClass} |` : ''
  ].filter(Boolean).join('\n');

  return `---
title: ${item.name}
description: ${item.description || `${item.name} - ${item.category} in Stepcraft`}
---

# ${item.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${item.icon}" alt="${item.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">${item.description || `${item.name} - ${item.category} item in Stepcraft`}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Category:** ${item.category}
        </span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md">
          **Type:** ${formatDisplayName(item.type)}
        </span>${priceDisplay}
      </div>
    </div>
  </div>
</div>

## Item Details

| Property | Value |
|----------|-------|
| **Name** | ${item.name} |
| **Key** | \`${item.key}\` |
| **Category** | ${item.category} |
| **Type** | ${formatDisplayName(item.type)} |${item.price > 0 ? `\n| **Price** | ${item.price.toLocaleString()} coins |` : ''}
${additionalProperties}

${item.description ? `## Description

${item.description}
` : ''}

${craftingSection}${statsSection}${statBoostSection}

## Related Items

Browse more items from the [${item.category}](/docs/items#${item.category.toLowerCase().replace(/\s+/g, '-')}) category or return to the [complete items catalog](/docs/items).

## Navigation

- [← Back to Items Catalog](/docs/items)
- [Browse ${item.category}](/docs/items#${item.category.toLowerCase().replace(/\s+/g, '-')})
- [Search All Items](/search)
`;
}

// Main generation function
async function generateAllItemPages() {
  console.log('🔄 Generating comprehensive individual item pages with crafting recipes...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('📖 Extracting all items from source files...');
    const items = await extractAllItems();
    
    if (items.length === 0) {
      console.error('❌ No items extracted from source files!');
      return;
    }
    
    console.log('🔧 Parsing crafting recipes...');
    const craftingRecipes = await parseCraftingRecipes();
    
    console.log(`📊 Found ${items.length} items to generate pages for`);
    
    // Generate pages for each item
    let generatedCount = 0;
    let itemsWithRecipes = 0;
    const categoryCount: Record<string, number> = {};
    
    for (const item of items) {
      try {
        const recipes = craftingRecipes.get(item.key) || [];
        if (recipes.length > 0) {
          itemsWithRecipes++;
        }
        
        const pageContent = generateItemPageContent(item, recipes);
        const fileName = `${item.key}.mdx`;
        const filePath = path.join(outputDir, fileName);
        
        await fs.writeFile(filePath, pageContent);
        generatedCount++;
        
        // Track category counts
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        
        if (generatedCount % 25 === 0) {
          console.log(`  📝 Generated ${generatedCount}/${items.length} pages...`);
        }
      } catch (error) {
        console.error(`❌ Error generating page for ${item.name}:`, error);
      }
    }
    
    console.log('\\n✅ Successfully generated all item pages with crafting information!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📊 Generated ${generatedCount} item pages`);
    console.log(`🔧 Items with crafting recipes: ${itemsWithRecipes}`);
    console.log('\\n📋 Pages generated by category:');
    
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`  • ${category}: ${count} pages`);
      });
    
    console.log(`\\n🔗 All pages accessible at /docs/items/individual/[item-key]`);
    
  } catch (error) {
    console.error('❌ Error generating item pages:', error);
  }
}

// Run the generator
generateAllItemPages();