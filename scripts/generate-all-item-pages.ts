import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/items/individual');

// Read and parse the items.ts file manually to extract data without requiring assets
async function extractItemsData(): Promise<any[]> {
  try {
    const itemsPath = path.resolve(process.cwd(), 'files/data/items.ts');
    const armorPath = path.resolve(process.cwd(), 'files/data/armor.ts');
    const weaponsPath = path.resolve(process.cwd(), 'files/data/weapons.ts');
    
    const itemsContent = await fs.readFile(itemsPath, 'utf-8');
    const armorContent = await fs.readFile(armorPath, 'utf-8');
    const weaponsContent = await fs.readFile(weaponsPath, 'utf-8');
    
    // Extract items by parsing the object definitions manually
    const items: any[] = [];
    
    // Helper function to extract asset path from require statement
    const extractAssetPath = (requireStr: string): string => {
      const match = requireStr.match(/require\(['"`]([^'"`]+)['"`]\)/);
      if (match && match[1]) {
        // Convert relative paths to absolute web paths
        return match[1].replace('../assets', '/assets');
      }
      return '/assets/icons/question.png'; // fallback
    };
    
    // Helper function to parse item objects from file content with proper categorization
    const parseItemsFromContent = (content: string, expectedCategory: string): any[] => {
      // Look for specific object definitions based on the category
      let sectionRegex;
      
      switch (expectedCategory) {
        case 'Tools':
          sectionRegex = /export const tools:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Food':
          sectionRegex = /export const food:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Rings':
          sectionRegex = /export const rings:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Potions':
          sectionRegex = /export const potions:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Amulets':
          sectionRegex = /export const amulets:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Quest Items':
          sectionRegex = /export const questItems:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Jams':
          sectionRegex = /export const jams:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Armor':
          sectionRegex = /export const allArmor:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        case 'Weapons':
          sectionRegex = /export const allWeapons:\s*Record<[\w\s|',]+>\s*=\s*{([\s\S]*?)};/;
          break;
        default:
          return [];
      }
      
      const sectionMatch = content.match(sectionRegex);
      if (!sectionMatch) return [];
      
      const sectionContent = sectionMatch[1];
      const itemMatches = sectionContent.match(/(\w+):\s*{[^{}]*(?:{[^{}]*}[^{}]*)*}/g);
      if (!itemMatches) return [];
      
      return itemMatches.map(match => {
        const keyMatch = match.match(/key:\s*['"`]([^'"`]+)['"`]/);
        const nameMatch = match.match(/name:\s*['"`]([^'"`]+)['"`]/);
        const iconMatch = match.match(/icon:\s*(require\([^)]+\))/);
        const typeMatch = match.match(/type:\s*['"`]([^'"`]+)['"`]/);
        const descMatch = match.match(/description:\s*['"`]([^'"`]+)['"`]/);
        const priceMatch = match.match(/price:\s*(\d+)/);
        const equipLocationMatch = match.match(/equipLocation:\s*['"`]([^'"`]+)['"`]/);
        const classLockedMatch = match.match(/classLocked:\s*\[([^\]]+)\]/);
        const levelLockedMatch = match.match(/levelLocked:\s*(\d+)/);
        const setIdMatch = match.match(/setId:\s*['"`]([^'"`]+)['"`]/);
        const itemClassMatch = match.match(/itemClass:\s*['"`]([^'"`]+)['"`]/);
        
        // Extract stats object
        const statsMatch = match.match(/stats:\s*{([^}]*)}/);
        let stats: Record<string, number> = {};
        if (statsMatch) {
          const statsContent = statsMatch[1];
          const statPairs = statsContent.match(/(\w+):\s*([^,}]+)/g);
          if (statPairs) {
            statPairs.forEach(pair => {
              const [key, value] = pair.split(':').map(s => s.trim());
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                stats[key] = numValue;
              }
            });
          }
        }
        
        // Extract statBoost for consumables
        const statBoostMatch = match.match(/statBoost:\s*{[^}]*stats:\s*{([^}]*)}/);
        let statBoost: { stats: Record<string, number> } | null = null;
        if (statBoostMatch) {
          const boostStatsContent = statBoostMatch[1];
          const boostStatPairs = boostStatsContent.match(/(\w+):\s*([^,}]+)/g);
          const boostStats: Record<string, number> = {};
          if (boostStatPairs) {
            boostStatPairs.forEach(pair => {
              const [key, value] = pair.split(':').map(s => s.trim());
              const numValue = parseFloat(value);
              if (!isNaN(numValue)) {
                boostStats[key] = numValue;
              }
            });
          }
          statBoost = { stats: boostStats };
        }
        
        return {
          key: keyMatch ? keyMatch[1] : '',
          name: nameMatch ? nameMatch[1] : '',
          icon: iconMatch ? extractAssetPath(iconMatch[1]) : '/assets/icons/question.png',
          type: typeMatch ? typeMatch[1] : expectedCategory.toLowerCase(),
          description: descMatch ? descMatch[1] : '',
          price: priceMatch ? parseInt(priceMatch[1]) : undefined,
          equipLocation: equipLocationMatch ? equipLocationMatch[1] : undefined,
          classLocked: classLockedMatch ? classLockedMatch[1].split(',').map(s => s.trim().replace(/['"`]/g, '')) : undefined,
          levelLocked: levelLockedMatch ? parseInt(levelLockedMatch[1]) : undefined,
          setId: setIdMatch ? setIdMatch[1] : undefined,
          itemClass: itemClassMatch ? itemClassMatch[1] : undefined,
          stats: Object.keys(stats).length > 0 ? stats : undefined,
          statBoost: statBoost,
          category: expectedCategory
        };
      });
    };
    
    // Parse items from main items.ts file
    items.push(...parseItemsFromContent(itemsContent, 'Tools'));
    items.push(...parseItemsFromContent(itemsContent, 'Food'));
    items.push(...parseItemsFromContent(itemsContent, 'Rings'));
    items.push(...parseItemsFromContent(itemsContent, 'Potions'));
    items.push(...parseItemsFromContent(itemsContent, 'Amulets'));
    items.push(...parseItemsFromContent(itemsContent, 'Quest Items'));
    items.push(...parseItemsFromContent(itemsContent, 'Jams'));
    
    // For armor and weapons, parse all item definitions regardless of sub-categories
    const parseAllItemsFromContent = (content: string, category: string): any[] => {
      // Find all item definitions in the file
      const itemMatches = content.match(/(\w+):\s*{[^{}]*(?:{[^{}]*}[^{}]*)*}/g);
      if (!itemMatches) return [];
      
      return itemMatches
        .filter(match => match.includes('key:') && match.includes('name:'))
        .map(match => {
          const keyMatch = match.match(/key:\s*['"`]([^'"`]+)['"`]/);
          const nameMatch = match.match(/name:\s*['"`]([^'"`]+)['"`]/);
          const iconMatch = match.match(/icon:\s*(require\([^)]+\))/);
          const typeMatch = match.match(/type:\s*['"`]([^'"`]+)['"`]/);
          const descMatch = match.match(/description:\s*['"`]([^'"`]+)['"`]/);
          const priceMatch = match.match(/price:\s*(\d+)/);
          const equipLocationMatch = match.match(/equipLocation:\s*['"`]([^'"`]+)['"`]/);
          const classLockedMatch = match.match(/classLocked:\s*\[([^\]]+)\]/);
          const levelLockedMatch = match.match(/levelLocked:\s*(\d+)/);
          const setIdMatch = match.match(/setId:\s*['"`]([^'"`]+)['"`]/);
          const itemClassMatch = match.match(/itemClass:\s*['"`]([^'"`]+)['"`]/);
          
          // Extract stats object
          const statsMatch = match.match(/stats:\s*{([^}]*)}/);
          let stats: Record<string, number> = {};
          if (statsMatch) {
            const statsContent = statsMatch[1];
            const statPairs = statsContent.match(/(\w+):\s*([^,}]+)/g);
            if (statPairs) {
              statPairs.forEach(pair => {
                const [key, value] = pair.split(':').map(s => s.trim());
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  stats[key] = numValue;
                }
              });
            }
          }
          
          return {
            key: keyMatch ? keyMatch[1] : '',
            name: nameMatch ? nameMatch[1] : '',
            icon: iconMatch ? extractAssetPath(iconMatch[1]) : '/assets/icons/question.png',
            type: typeMatch ? typeMatch[1] : 'wearable',
            description: descMatch ? descMatch[1] : '',
            price: priceMatch ? parseInt(priceMatch[1]) : undefined,
            equipLocation: equipLocationMatch ? equipLocationMatch[1] : undefined,
            classLocked: classLockedMatch ? classLockedMatch[1].split(',').map(s => s.trim().replace(/['"`]/g, '')) : undefined,
            levelLocked: levelLockedMatch ? parseInt(levelLockedMatch[1]) : undefined,
            setId: setIdMatch ? setIdMatch[1] : undefined,
            itemClass: itemClassMatch ? itemClassMatch[1] : undefined,
            stats: Object.keys(stats).length > 0 ? stats : undefined,
            category: category
          };
        })
        .filter(item => item.key && item.name);
    };
    
    // Parse armor items
    items.push(...parseAllItemsFromContent(armorContent, 'Armor'));
    
    // Parse weapon items  
    items.push(...parseAllItemsFromContent(weaponsContent, 'Weapons'));
    
    // Remove duplicates based on key
    const uniqueItems = items.filter((item, index, arr) => 
      item.key && item.name && arr.findIndex(i => i.key === item.key) === index
    );
    
    return uniqueItems;
    
  } catch (error) {
    console.error('Error extracting items data:', error);
    return [];
  }
}

function formatStats(stats: any, statBoost: any): string {
  let allStats: Record<string, number> = {};
  
  // Add regular stats
  if (stats) {
    allStats = { ...stats };
  }
  
  // Add statBoost stats for consumables
  if (statBoost && statBoost.stats) {
    Object.entries(statBoost.stats).forEach(([key, value]) => {
      allStats[key] = value as number;
    });
  }
  
  if (Object.keys(allStats).length === 0) return '';
  
  const statEntries = Object.entries(allStats)
    .filter(([_, value]) => value !== undefined && value !== 0)
    .map(([key, value]) => {
      const displayKey = key === 'critChance' ? 'Critical Chance' : 
                        key === 'agilityPercent' ? 'Agility %' :
                        key === 'hpPercent' ? 'HP %' :
                        key === 'atkPercent' ? 'Attack %' :
                        key === 'defPercent' ? 'Defense %' :
                        key === 'hp' ? 'Health Points' :
                        key === 'atk' ? 'Attack' :
                        key === 'def' ? 'Defense' :
                        key === 'agility' ? 'Agility' :
                        key.charAt(0).toUpperCase() + key.slice(1);
      
      const displayValue = key.includes('Percent') || key === 'critChance' ? 
                          `${value}%` : 
                          Number(value) < 0 ? `${value}` :
                          `+${value}`;
      
      return `| ${displayKey} | ${displayValue} |`;
    });
  
  if (statEntries.length === 0) return '';
  
  return `
## Stats

| Stat | Value |
|------|-------|
${statEntries.join('\n')}
`;
}

function formatRequirements(item: any): string {
  const requirements = [];
  
  if (item.levelLocked) {
    requirements.push(`**Level Required:** ${item.levelLocked}`);
  }
  
  if (item.classLocked && item.classLocked.length > 0) {
    requirements.push(`**Class Restricted:** ${item.classLocked.join(', ')}`);
  }
  
  if (requirements.length === 0) return '';
  
  return `
## Requirements

${requirements.join('\n\n')}
`;
}

function getItemCategory(item: any): string {
  if (item.category) return item.category;
  
  switch (item.type) {
    case 'tool':
      return 'Tools';
    case 'consumable':
      return item.equipLocation === 'potion' ? 'Potions' : 'Food';
    case 'wearable':
      if (item.equipLocation === 'ring') return 'Rings';
      if (item.equipLocation === 'amulet') return 'Amulets';
      if (['helmet', 'chest', 'legs', 'gloves', 'boots'].includes(item.equipLocation)) return 'Armor';
      if (['weapon', 'off-hand'].includes(item.equipLocation)) return 'Weapons';
      return 'Equipment';
    case 'quest':
      return 'Quest Items';
    default:
      return 'Items';
  }
}

function getTierInfo(item: any): string {
  if (!item.price) return '';
  
  const price = item.price;
  let tier = '';
  
  if (price <= 100) tier = 'Basic';
  else if (price <= 500) tier = 'Common';
  else if (price <= 1500) tier = 'Uncommon';
  else if (price <= 5000) tier = 'Rare';
  else if (price <= 15000) tier = 'Epic';
  else tier = 'Legendary';
  
  return `**Tier:** ${tier}`;
}

function generateItemPage(item: any): string {
  const category = getItemCategory(item);
  const tierInfo = getTierInfo(item);
  const statsSection = formatStats(item.stats, item.statBoost);
  const requirementsSection = formatRequirements(item);
  
  return `---
title: ${item.name}
description: ${item.description || `${item.name} - ${category} in Stepcraft`}
---

# ${item.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${item.icon}" alt="${item.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">${item.description || `A ${item.type} item in Stepcraft.`}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Category:** ${category}
        </span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md">
          **Type:** ${item.type}
        </span>
        ${item.equipLocation ? `<span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-md">
          **Equipment Slot:** ${item.equipLocation}
        </span>` : ''}
        ${item.price ? `<span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-md">
          **Price:** ${item.price.toLocaleString()} coins
        </span>` : ''}
      </div>
      ${tierInfo ? `<p className="text-sm font-medium">${tierInfo}</p>` : ''}
    </div>
  </div>
</div>

## Item Details

| Property | Value |
|----------|-------|
| **Name** | ${item.name} |
| **Key** | \`${item.key}\` |
| **Category** | ${category} |
| **Type** | ${item.type} |
${item.equipLocation ? `| **Equipment Slot** | ${item.equipLocation} |` : ''}
${item.itemClass ? `| **Item Class** | ${item.itemClass} |` : ''}
${item.price ? `| **Price** | ${item.price.toLocaleString()} coins |` : ''}
${item.setId ? `| **Set** | ${item.setId} |` : ''}
${statsSection}${requirementsSection}
## Related Items

Browse more items from the [${category}](/items#${category.toLowerCase().replace(/\s+/g, '-')}) category or return to the [complete items catalog](/items).

## Navigation

- [← Back to Items Catalog](/items)
- [Browse ${category}](/items#${category.toLowerCase().replace(/\s+/g, '-')})
- [Search All Items](/items)
`;
}

async function generateAllItemPages() {
  console.log('🔧 Generating individual item pages for all items...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Clean existing files
    const existingFiles = await fs.readdir(outputDir).catch(() => []);
    for (const file of existingFiles) {
      if (file.endsWith('.mdx') && file !== 'index.mdx') {
        await fs.unlink(path.join(outputDir, file));
      }
    }
    
    console.log('📖 Extracting items data from source files...');
    const items = await extractItemsData();
    let generatedCount = 0;
    
    console.log(`📊 Processing ${items.length} items...`);
    
    if (items.length === 0) {
      console.error('❌ No items extracted from source files!');
      return;
    }
    
    for (const item of items) {
      try {
        const content = generateItemPage(item);
        const filename = `${item.key}.mdx`;
        const filepath = path.join(outputDir, filename);
        
        await fs.writeFile(filepath, content);
        generatedCount++;
        
        if (generatedCount % 50 === 0) {
          console.log(`✅ Generated ${generatedCount}/${items.length} pages...`);
        }
      } catch (error) {
        console.error(`❌ Error generating page for ${item.name}:`, error);
      }
    }
    
    console.log(`🎉 Successfully generated ${generatedCount} item pages!`);
    console.log(`📁 Pages saved to: ${outputDir}`);
    
    // Generate index file for the individual items directory
    const indexContent = `---
title: Individual Item Pages
description: All Stepcraft items as individual pages for detailed information
---

# Individual Item Pages

This directory contains individual pages for all ${generatedCount} items in Stepcraft. Each item has its own dedicated page with detailed information, stats, and requirements.

## Categories Generated

Based on the extracted data, pages have been generated for items across these categories:
- **Tools** - Mining, woodcutting, and harvesting tools
- **Food** - Consumable food items for health restoration
- **Potions** - Alchemical potions with temporary effects
- **Rings** - Wearable rings with stat bonuses
- **Amulets** - Necklaces and amulets with magical properties
- **Armor** - Protective equipment (helmets, chest, legs, gloves, boots)
- **Weapons** - Combat weapons and off-hand items
- **Quest Items** - Special items for quests and story progression
- **Jams** - Special consumable items

## How to Access

Individual item pages are accessible via direct URLs using the item key:
- Format: \`/items/individual/[item-key]\`
- Example: \`/items/individual/copper_pickaxe\`

## Search Integration

These pages are automatically indexed by the search system, making all items easily discoverable through the search functionality.

## Navigation

- [← Back to Items Catalog](/items)
- [Browse Complete Catalog](/items)

*Generated ${new Date().toISOString()} - ${generatedCount} items*
`;
    
    await fs.writeFile(path.join(outputDir, 'index.mdx'), indexContent);
    console.log('📄 Generated index page for individual items directory');
    
  } catch (error) {
    console.error('❌ Error generating item pages:', error);
  }
}

// Run the generator
generateAllItemPages();