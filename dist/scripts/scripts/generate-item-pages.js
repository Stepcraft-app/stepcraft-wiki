import { promises as fs } from 'fs';
import path from 'path';
import { allItems } from '../files/data/items';
const outputDir = path.join(process.cwd(), 'contents/docs/items/individual');
function extractIconPath(iconRequire) {
    if (typeof iconRequire === 'string') {
        return iconRequire;
    }
    // Handle require() statements - extract path from default export
    if (iconRequire && iconRequire.default) {
        return iconRequire.default;
    }
    // Fallback - try to extract path from the require statement structure
    if (iconRequire && typeof iconRequire === 'object') {
        // Look for common asset path patterns
        const pathMatch = JSON.stringify(iconRequire).match(/assets\/[^"]+\.png/);
        if (pathMatch) {
            return `/${pathMatch[0]}`;
        }
    }
    return '/assets/icons/question.png'; // Fallback icon
}
function formatStats(stats) {
    if (!stats)
        return '';
    const statEntries = Object.entries(stats)
        .filter(([_, value]) => value !== undefined && value !== 0)
        .map(([key, value]) => {
        const displayKey = key === 'critChance' ? 'Crit Chance' :
            key === 'agilityPercent' ? 'Agility %' :
                key === 'hpPercent' ? 'HP %' :
                    key === 'atkPercent' ? 'ATK %' :
                        key === 'defPercent' ? 'DEF %' :
                            key.toUpperCase();
        const displayValue = key.includes('Percent') || key === 'critChance' ?
            `${value}%` : `+${value}`;
        return `| ${displayKey} | ${displayValue} |`;
    });
    if (statEntries.length === 0)
        return '';
    return `
## Stats

| Stat | Value |
|------|-------|
${statEntries.join('\n')}
`;
}
function formatRequirements(item) {
    const requirements = [];
    if (item.levelLocked) {
        requirements.push(`**Level Required:** ${item.levelLocked}`);
    }
    if (item.classLocked && item.classLocked.length > 0) {
        requirements.push(`**Class Restricted:** ${item.classLocked.join(', ')}`);
    }
    if (requirements.length === 0)
        return '';
    return `
## Requirements

${requirements.join('\n\n')}
`;
}
function getItemCategory(item) {
    switch (item.type) {
        case 'tool':
            return 'Tools';
        case 'consumable':
            return item.equipLocation === 'potion' ? 'Potions' : 'Food';
        case 'wearable':
            if (item.equipLocation === 'ring')
                return 'Rings';
            if (item.equipLocation === 'amulet')
                return 'Amulets';
            if (['helmet', 'chest', 'legs', 'gloves', 'boots'].includes(item.equipLocation))
                return 'Armor';
            if (['weapon', 'off-hand'].includes(item.equipLocation))
                return 'Weapons';
            return 'Equipment';
        case 'quest':
            return 'Quest Items';
        default:
            return 'Items';
    }
}
function getTierInfo(item) {
    // Determine tier based on price ranges
    if (!item.price)
        return '';
    const price = item.price;
    let tier = '';
    if (price <= 100)
        tier = 'Basic';
    else if (price <= 500)
        tier = 'Common';
    else if (price <= 1500)
        tier = 'Uncommon';
    else if (price <= 5000)
        tier = 'Rare';
    else if (price <= 15000)
        tier = 'Epic';
    else
        tier = 'Legendary';
    return `**Tier:** ${tier}`;
}
function generateItemPage(item) {
    const iconPath = extractIconPath(item.icon);
    const category = getItemCategory(item);
    const tierInfo = getTierInfo(item);
    const statsSection = formatStats(item.stats);
    const requirementsSection = formatRequirements(item);
    return `---
title: ${item.name}
description: ${item.description || `${item.name} - ${category} in Stepcraft`}
---

# ${item.name}

<div className="flex items-start gap-6 mb-8">
  <div className="flex-shrink-0">
    <img src="${iconPath}" alt="${item.name}" className="w-24 h-24 border rounded-lg" />
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
    console.log('🔧 Generating individual item pages...');
    try {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true });
        // Clean existing files
        const existingFiles = await fs.readdir(outputDir).catch(() => []);
        for (const file of existingFiles) {
            if (file.endsWith('.mdx')) {
                await fs.unlink(path.join(outputDir, file));
            }
        }
        const items = Object.values(allItems);
        let generatedCount = 0;
        console.log(`📊 Processing ${items.length} items...`);
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
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('❌ Error generating item pages:', error);
    }
}
// Run the generator
generateAllItemPages();
