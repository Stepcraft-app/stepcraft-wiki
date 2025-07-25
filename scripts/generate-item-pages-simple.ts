import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/items/individual');

// Sample item data extracted from the tables we created
const sampleItems = [
  // Tools
  { key: 'copper_pickaxe', name: 'Copper Pickaxe', category: 'Tools', type: 'Mining Tool', image: '/assets/resources/smithing/copper_pickaxe.png', description: 'Basic mining tool for extracting stone and copper ore', stats: { hp: 10, efficiency: 1.2 }, price: 434 },
  { key: 'iron_pickaxe', name: 'Iron Pickaxe', category: 'Tools', type: 'Mining Tool', image: '/assets/resources/smithing/iron_pickaxe.png', description: 'Improved mining tool with 25% speed bonus', stats: { hp: 20, efficiency: 1.5 }, price: 1023 },
  
  // Food
  { key: 'bread', name: 'Bread', category: 'Food', type: 'Staple Food', image: '/assets/resources/cooking/bread.png', description: 'Basic bread providing essential sustenance', stats: { hp: 10 }, price: null },
  { key: 'chocolate_cake', name: 'Chocolate Cake', category: 'Food', type: 'Elite Dessert', image: '/assets/resources/cooking/chocolate_cake.png', description: 'Premium dessert with maximum HP restoration', stats: { hp: 40 }, price: null },
  
  // Potions
  { key: 'health_potion_small', name: 'Small Health Potion', category: 'Potions', type: 'Health Restoration', image: '/assets/resources/alchemy/health_potion_small.png', description: 'Basic healing potion for instant HP recovery', stats: { hp: 50 }, rarity: 'Common' },
  { key: 'berserk_potion', name: 'Berserk Potion', category: 'Potions', type: 'Combat Enhancement', image: '/assets/resources/alchemy/berserk_potion.png', description: 'High-risk combat potion with attack boost and defense penalty', stats: { atk: 25, def: -10 }, rarity: 'Very Rare', duration: '150 steps' },
  
  // Rings
  { key: 'copper_band', name: 'Copper Band', category: 'Rings', type: 'Tier 1 Ring', image: '/assets/resources/trinketry/rings/copper_band.png', description: 'Entry level ring providing basic combat bonuses', stats: { hp: 2, atk: 2, crit: '1%' }, price: 425 },
  { key: 'crimson_shard', name: 'Crimson Shard', category: 'Rings', type: 'Legendary Ring', image: '/assets/resources/trinketry/rings/crimson_shard.png', description: 'Legendary ring with maximum critical chance enhancement', stats: { hp: 55, atk: 48, def: 8, crit: '10%' }, price: 21111 },
  
  // Weapons
  { key: 'basic_sword', name: 'Basic Sword', category: 'Weapons', type: 'Primary Weapon', image: '/assets/resources/crafting/weapons/swords/basic_sword.png', description: 'Entry level melee weapon for close combat', stats: { hp: 2, atk: 15, crit: '1%' }, price: 35 },
  { key: 'tempest_staff', name: 'Staff of the Tempest', category: 'Weapons', type: 'Legendary Staff', image: '/assets/resources/crafting/weapons/two-handed-staff/tempest_staff.png', description: 'Carved from a tree struck by lightning, channels the raw power of nature\'s wrath', stats: { hp: 100, atk: 10, def: 10 }, requirements: 'Druid class, Level 100', setInfo: 'Part of Tempest Set' }
];

function formatStats(stats: any): string {
  if (!stats) return '';
  
  const statEntries = Object.entries(stats)
    .filter(([_, value]) => value !== undefined && value !== 0)
    .map(([key, value]) => {
      const displayKey = key === 'crit' ? 'Critical Chance' : 
                        key === 'atk' ? 'Attack' :
                        key === 'def' ? 'Defense' :
                        key === 'hp' ? 'Health Points' :
                        key === 'efficiency' ? 'Efficiency' :
                        key.charAt(0).toUpperCase() + key.slice(1);
      
      const displayValue = typeof value === 'string' ? value : 
                          key === 'def' && Number(value) < 0 ? `${value}` :
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

function generateItemPage(item: any): string {
  const statsSection = formatStats(item.stats);
  const priceSection = item.price ? `| **Price** | ${item.price.toLocaleString()} coins |` : '';
  const raritySection = item.rarity ? `| **Rarity** | ${item.rarity} |` : '';
  const durationSection = item.duration ? `| **Duration** | ${item.duration} |` : '';
  const requirementsSection = item.requirements ? `| **Requirements** | ${item.requirements} |` : '';
  const setSection = item.setInfo ? `| **Set Information** | ${item.setInfo} |` : '';
  
  return `---
title: ${item.name}
description: ${item.description}
---

# ${item.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${item.image}" alt="${item.name}" className="w-24 h-24 border rounded-lg" />
  </div>
  <div className="flex-1">
    <div className="space-y-2">
      <p className="text-lg text-muted-foreground">${item.description}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md">
          **Category:** ${item.category}
        </span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md">
          **Type:** ${item.type}
        </span>
        ${item.price ? `<span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-md">
          **Price:** ${item.price.toLocaleString()} coins
        </span>` : ''}
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
| **Type** | ${item.type} |
${priceSection}
${raritySection}
${durationSection}
${requirementsSection}
${setSection}
${statsSection}
## Related Items

Browse more items from the [${item.category}](/items#${item.category.toLowerCase()}) category or return to the [complete items catalog](/items).

## Navigation

- [← Back to Items Catalog](/items)
- [Browse ${item.category}](/items#${item.category.toLowerCase()})
- [Search All Items](/items)
`;
}

async function generateSampleItemPages() {
  console.log('🔧 Generating sample individual item pages...');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    let generatedCount = 0;
    
    console.log(`📊 Processing ${sampleItems.length} sample items...`);
    
    for (const item of sampleItems) {
      try {
        const content = generateItemPage(item);
        const filename = `${item.key}.mdx`;
        const filepath = path.join(outputDir, filename);
        
        await fs.writeFile(filepath, content);
        generatedCount++;
        
        console.log(`✅ Generated: ${item.name}`);
      } catch (error) {
        console.error(`❌ Error generating page for ${item.name}:`, error);
      }
    }
    
    console.log(`🎉 Successfully generated ${generatedCount} sample item pages!`);
    console.log(`📁 Pages saved to: ${outputDir}`);
    
    // Generate index file for the individual items directory
    const indexContent = `---
title: Individual Item Pages
description: Individual pages for Stepcraft items with detailed information
---

# Individual Item Pages

This directory contains individual pages for Stepcraft items. Each item has its own dedicated page with detailed information, stats, and requirements.

## Sample Items Available

We have generated sample pages for items across all major categories:

### Tools
- [Copper Pickaxe](/items/individual/copper_pickaxe) - Basic mining tool
- [Iron Pickaxe](/items/individual/iron_pickaxe) - Improved mining tool

### Food
- [Bread](/items/individual/bread) - Basic staple food
- [Chocolate Cake](/items/individual/chocolate_cake) - Elite dessert

### Potions  
- [Small Health Potion](/items/individual/health_potion_small) - Basic healing
- [Berserk Potion](/items/individual/berserk_potion) - Combat enhancement

### Rings
- [Copper Band](/items/individual/copper_band) - Entry level ring  
- [Crimson Shard](/items/individual/crimson_shard) - Legendary ring

### Weapons
- [Basic Sword](/items/individual/basic_sword) - Entry level sword
- [Staff of the Tempest](/items/individual/tempest_staff) - Legendary staff

## How to Access

Individual item pages are accessible via direct URLs using the item key:
- Format: \`/items/individual/[item-key]\`
- Example: \`/items/individual/copper_pickaxe\`

## Search Integration

These pages are automatically indexed by the search system, making all items easily discoverable through the search functionality.

## Navigation

- [← Back to Items Catalog](/items)
- [Browse Complete Catalog](/items)

*Generated ${new Date().toISOString()} - ${generatedCount} sample items*
`;
    
    await fs.writeFile(path.join(outputDir, 'index.mdx'), indexContent);
    console.log('📄 Generated index page for individual items directory');
    
  } catch (error) {
    console.error('❌ Error generating item pages:', error);
  }
}

// Run the generator
generateSampleItemPages();