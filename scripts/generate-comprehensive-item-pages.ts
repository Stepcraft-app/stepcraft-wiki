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

// Generate page content for an item
function generateItemPageContent(item: ItemData): string {
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

${statsSection}${statBoostSection}

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
  console.log('🔄 Generating comprehensive individual item pages...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('📖 Extracting all items from source files...');
    const items = await extractAllItems();
    
    if (items.length === 0) {
      console.error('❌ No items extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${items.length} items to generate pages for`);
    
    // Generate pages for each item
    let generatedCount = 0;
    const categoryCount: Record<string, number> = {};
    
    for (const item of items) {
      try {
        const pageContent = generateItemPageContent(item);
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
    
    console.log('\\n✅ Successfully generated all item pages!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📊 Generated ${generatedCount} item pages`);
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