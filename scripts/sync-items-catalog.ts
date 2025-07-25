import { promises as fs } from 'fs';
import path from 'path';

const itemsIndexPath = path.join(process.cwd(), 'contents/docs/items/index.mdx');

// Extract item data from source files (reusing logic from generate-all-item-pages.ts)
async function extractItemsData(): Promise<any[]> {
  try {
    const itemsPath = path.resolve(process.cwd(), 'files/data/items.ts');
    const armorPath = path.resolve(process.cwd(), 'files/data/armor.ts');
    const weaponsPath = path.resolve(process.cwd(), 'files/data/weapons.ts');
    
    const itemsContent = await fs.readFile(itemsPath, 'utf-8');
    const armorContent = await fs.readFile(armorPath, 'utf-8');
    const weaponsContent = await fs.readFile(weaponsPath, 'utf-8');
    
    const items: any[] = [];
    
    // Helper function to extract asset path from require statement
    const extractAssetPath = (requireStr: string): string => {
      const match = requireStr.match(/require\(['"`]([^'"`]+)['"`]\)/);
      if (match && match[1]) {
        return match[1].replace('../assets', '/assets');
      }
      return '/assets/icons/question.png';
    };
    
    // Helper function to parse item objects from file content with proper categorization
    const parseItemsFromContent = (content: string, expectedCategory: string): any[] => {
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
          type: typeMatch ? typeMatch[1] : expectedCategory.toLowerCase(),
          description: descMatch ? descMatch[1] : '',
          price: priceMatch ? parseInt(priceMatch[1]) : undefined,
          equipLocation: equipLocationMatch ? equipLocationMatch[1] : undefined,
          stats: Object.keys(stats).length > 0 ? stats : undefined,
          category: expectedCategory
        };
      }).filter(item => item.key && item.name);
    };
    
    // For armor and weapons, parse all item definitions regardless of sub-categories
    const parseAllItemsFromContent = (content: string, category: string): any[] => {
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
            stats: Object.keys(stats).length > 0 ? stats : undefined,
            category: category
          };
        })
        .filter(item => item.key && item.name);
    };
    
    // Parse items from main items.ts file
    items.push(...parseItemsFromContent(itemsContent, 'Tools'));
    items.push(...parseItemsFromContent(itemsContent, 'Food'));
    items.push(...parseItemsFromContent(itemsContent, 'Rings'));
    items.push(...parseItemsFromContent(itemsContent, 'Potions'));
    items.push(...parseItemsFromContent(itemsContent, 'Amulets'));
    items.push(...parseItemsFromContent(itemsContent, 'Quest Items'));
    items.push(...parseItemsFromContent(itemsContent, 'Jams'));
    
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

// Group items by category
function groupItemsByCategory(items: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  items.forEach(item => {
    const category = item.category || 'Miscellaneous';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });
  
  // Sort items within each category by name
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return grouped;
}

// Generate table rows for a category
function generateCategoryTable(items: any[], category: string): string {
  if (items.length === 0) return '';
  
  let table = '';
  
  // Different table formats based on category
  switch (category) {
    case 'Tools':
      table = `
## Tools - Complete Collection (${items.length} items)

All gathering tools across different tiers for various skills. Each tier unlocks access to higher-level resources.

| Tool | Name | Tier | Materials Accessed | HP | Efficiency | Price | Link |
|------|------|------|-------------------|----|-----------:|------:|------|
`;
      items.forEach(item => {
        const tier = getTierFromPrice(item.price);
        const materials = getToolMaterials(item.key);
        const hp = item.stats?.hp || '-';
        const efficiency = item.stats?.efficiency || '-';
        const price = item.price ? item.price.toLocaleString() : '-';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${tier} | ${materials} | ${hp} | ${efficiency} | ${price} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Food':
      table = `
## Food - Complete Collection (${items.length} items)

Essential sustenance for your adventures, from basic bread to elaborate dinners. Each food item provides health restoration.

| Food Item | Name | HP Restored | Type | Link |
|-----------|------|------------|------|------|
`;
      items.forEach(item => {
        const hp = item.stats?.hp || item.statBoost?.stats?.hp || '-';
        const type = item.equipLocation === 'food' ? 'Food' : 'Consumable';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ❤️ +${hp} HP | ${type} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Potions':
      table = `
## Potions - Complete Collection (${items.length} items)

Powerful alchemical creations that provide temporary stat boosts and special effects.

| Potion | Name | Effects | Type | Link |
|--------|------|---------|------|------|
`;
      items.forEach(item => {
        const effects = formatPotionEffects(item);
        const type = item.equipLocation === 'potion' ? 'Potion' : 'Consumable';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${effects} | ${type} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Rings':
      table = `
## Rings - Complete Collection (${items.length} items)

Master craftsmen create these powerful trinkets to enhance your combat abilities.

| Ring | Name | HP | ATK | DEF | Crit | Price | Link |
|------|------|----|----|-----|------|-------|------|
`;
      items.forEach(item => {
        const hp = item.stats?.hp ? `+${item.stats.hp}` : '-';
        const atk = item.stats?.atk ? `+${item.stats.atk}` : '-';
        const def = item.stats?.def ? `+${item.stats.def}` : '-';
        const crit = item.stats?.critChance ? `+${item.stats.critChance}%` : '-';
        const price = item.price ? item.price.toLocaleString() : '-';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${hp} | ${atk} | ${def} | ${crit} | ${price} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Amulets':
      table = `
## Amulets - Complete Collection (${items.length} items)

Mystical necklaces that channel ancient powers to enhance your abilities.

| Amulet | Name | HP | ATK | DEF | Crit | Price | Link |
|--------|------|----|----|-----|------|-------|------|
`;
      items.forEach(item => {
        const hp = item.stats?.hp ? `+${item.stats.hp}` : '-';
        const atk = item.stats?.atk ? `+${item.stats.atk}` : '-';
        const def = item.stats?.def ? `+${item.stats.def}` : '-';
        const crit = item.stats?.critChance ? `+${item.stats.critChance}%` : '-';
        const price = item.price ? item.price.toLocaleString() : '-';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${hp} | ${atk} | ${def} | ${crit} | ${price} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Armor':
      table = `
## Armor - Complete Collection (${items.length} items)

Protective equipment to keep you safe in dangerous adventures.

| Armor | Name | Type | HP | ATK | DEF | Price | Link |
|-------|------|------|----|----|-----|-------|------|
`;
      items.forEach(item => {
        const armorType = item.equipLocation || 'Equipment';
        const hp = item.stats?.hp ? `+${item.stats.hp}` : '-';
        const atk = item.stats?.atk ? `+${item.stats.atk}` : '-';
        const def = item.stats?.def ? `+${item.stats.def}` : '-';
        const price = item.price ? item.price.toLocaleString() : '-';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${armorType} | ${hp} | ${atk} | ${def} | ${price} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    case 'Weapons':
      table = `
## Weapons - Complete Collection (${items.length} items)

Combat weapons and tools for battle and defense.

| Weapon | Name | Type | HP | ATK | DEF | Price | Link |
|--------|------|------|----|----|-----|-------|------|
`;
      items.forEach(item => {
        const weaponType = item.equipLocation || item.itemClass || 'Weapon';
        const hp = item.stats?.hp ? `+${item.stats.hp}` : '-';
        const atk = item.stats?.atk ? `+${item.stats.atk}` : '-';
        const def = item.stats?.def ? `+${item.stats.def}` : '-';
        const price = item.price ? item.price.toLocaleString() : '-';
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${weaponType} | ${hp} | ${atk} | ${def} | ${price} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
      
    default:
      // Generic table for other categories
      table = `
## ${category} - Complete Collection (${items.length} items)

| Item | Name | Description | Link |
|------|------|-------------|------|
`;
      items.forEach(item => {
        const description = item.description || `A ${item.type} item in Stepcraft`;
        table += `| ![${item.name}](${item.icon}) | **[${item.name}](/docs/items/individual/${item.key})** | ${description} | [View Details](/docs/items/individual/${item.key}) |\n`;
      });
      break;
  }
  
  return table;
}

// Helper functions
function getTierFromPrice(price: number | undefined): string {
  if (!price) return 'Basic';
  if (price <= 500) return 'Basic';
  if (price <= 1500) return 'Common';
  if (price <= 5000) return 'Uncommon';
  if (price <= 15000) return 'Rare';
  return 'Legendary';
}

function getToolMaterials(key: string): string {
  if (key.includes('copper')) return 'Stone, Copper';
  if (key.includes('iron')) return 'Iron ore';
  if (key.includes('silver')) return 'Silver ore';
  if (key.includes('gold')) return 'Gold ore';
  if (key.includes('blue')) return 'Blue ore';
  if (key.includes('red')) return 'All materials';
  return 'Basic materials';
}

function formatPotionEffects(item: any): string {
  if (item.stats) {
    const effects = [];
    if (item.stats.hp) effects.push(`❤️ +${item.stats.hp} HP`);
    if (item.stats.atk) effects.push(`⚔️ +${item.stats.atk} ATK`);
    if (item.stats.def) effects.push(`🛡️ +${item.stats.def} DEF`);
    if (item.stats.agility) effects.push(`💨 +${item.stats.agility} AGI`);
    return effects.join(', ') || 'Consumable effect';
  }
  return 'Consumable effect';
}

// Generate the complete catalog content
function generateCatalogContent(groupedItems: Record<string, any[]>, totalItems: number): string {
  const categoryOrder = ['Tools', 'Food', 'Potions', 'Rings', 'Amulets', 'Armor', 'Weapons', 'Quest Items', 'Jams'];
  
  // Generate category summary cards
  const categoryCards = categoryOrder.filter(cat => groupedItems[cat]?.length > 0).map(category => {
    const items = groupedItems[category];
    const count = items.length;
    const icon = getCategoryIcon(category);
    const color = getCategoryColor(category);
    
    return `  <div className="flex items-center gap-3 p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-700">
    <img src="${icon}" alt="${category}" className="w-12 h-12" />
    <div>
      <h4 className="font-semibold text-${color}-800 dark:text-${color}-200">${category}</h4>
      <p className="text-xs text-${color}-600 dark:text-${color}-300">${count} ${category === 'Jewelry' ? 'Rings & Amulets' : 'Items'}</p>
    </div>
  </div>`;
  }).join('\n\n');
  
  // Generate all category tables
  const categoryTables = categoryOrder.filter(cat => groupedItems[cat]?.length > 0).map(category => {
    return generateCategoryTable(groupedItems[category], category);
  }).join('\n\n---\n\n');
  
  return `---
title: Complete Items Catalog
description: Complete catalog of all items, weapons, armor, tools, consumables, and accessories in Stepcraft - ${totalItems} items with stats and images
---

# Complete Items Catalog

Discover every single item available in Stepcraft. This comprehensive catalog includes all tools, weapons, armor, food, potions, rings, amulets, and special items with their complete statistics, requirements, and visual assets.

<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-8">
  <div className="flex items-center gap-3 mb-2">
    <span className="text-2xl">📊</span>
    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Complete Database</h3>
  </div>
  <p className="text-blue-700 dark:text-blue-300">
    This catalog contains every item from the game files - ${totalItems} unique items with complete statistics, images, and descriptions. Each item links to its individual detail page.
  </p>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
${categoryCards}
</div>

---

${categoryTables}

## Navigation

- [🔍 Search All Items](/search) - Use the search function to find specific items
- [📝 Individual Item Pages](/docs/items/individual) - Browse detailed pages for each item
- [🏠 Back to Documentation](/docs) - Return to main documentation

*Catalog updated ${new Date().toISOString().split('T')[0]} - ${totalItems} items*
`;
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Tools': return '/assets/icons/smithing.png';
    case 'Food': return '/assets/icons/alchemy.png';
    case 'Potions': return '/assets/icons/alchemy.png';
    case 'Rings': return '/assets/icons/trinketry.png';
    case 'Amulets': return '/assets/icons/trinketry.png';
    case 'Armor': return '/assets/icons/armor.png';
    case 'Weapons': return '/assets/icons/weapons.png';
    case 'Quest Items': return '/assets/icons/quest.png';
    case 'Jams': return '/assets/icons/alchemy.png';
    default: return '/assets/icons/question.png';
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Tools': return 'amber';
    case 'Food': return 'green';
    case 'Potions': return 'purple';
    case 'Rings': return 'yellow';
    case 'Amulets': return 'yellow';
    case 'Armor': return 'blue';
    case 'Weapons': return 'red';
    case 'Quest Items': return 'indigo';
    case 'Jams': return 'pink';
    default: return 'gray';
  }
}

// Main sync function
async function syncItemsCatalog() {
  console.log('🔄 Syncing items catalog with source data...');
  
  try {
    console.log('📖 Extracting items data from source files...');
    const items = await extractItemsData();
    
    if (items.length === 0) {
      console.error('❌ No items extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${items.length} items across all categories`);
    
    // Group items by category
    const groupedItems = groupItemsByCategory(items);
    
    // Log category breakdown
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
      console.log(`  • ${category}: ${categoryItems.length} items`);
    });
    
    // Generate the new catalog content
    console.log('📝 Generating updated catalog content...');
    const catalogContent = generateCatalogContent(groupedItems, items.length);
    
    // Write to the items index file
    await fs.writeFile(itemsIndexPath, catalogContent);
    
    console.log(`✅ Successfully updated items catalog!`);
    console.log(`📁 Updated: ${itemsIndexPath}`);
    console.log(`📊 Total items: ${items.length}`);
    console.log(`🔗 All items now link to individual pages at /items/individual/[item-key]`);
    
  } catch (error) {
    console.error('❌ Error syncing items catalog:', error);
  }
}

// Run the sync
syncItemsCatalog();