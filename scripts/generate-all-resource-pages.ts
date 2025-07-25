import { promises as fs } from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'contents/docs/resources/individual');

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
function generateResourcePageContent(resource: any): string {
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

## Related Resources

Browse more resources from the [${resource.category}](/docs/resources#${resource.category.toLowerCase().replace(' ', '-')}) category or return to the [complete resources catalog](/docs/resources).

## Navigation

- [← Back to Resources Catalog](/docs/resources)
- [Browse ${resource.category}](/docs/resources#${resource.category.toLowerCase().replace(' ', '-')})
- [Search All Resources](/search)
`;
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
        const pageContent = generateResourcePageContent(resource);
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