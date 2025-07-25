import { promises as fs } from 'fs';
import path from 'path';

const resourcesIndexPath = path.join(process.cwd(), 'contents/docs/resources/index.mdx');

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

// Group resources by category
function groupResourcesByCategory(resources: any[]): Record<string, any[]> {
  const grouped: Record<string, any[]> = {};
  
  resources.forEach(resource => {
    const category = resource.category || 'Miscellaneous';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(resource);
  });
  
  // Sort resources within each category by name
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return grouped;
}

// Generate table rows for a category
function generateCategoryTable(resources: any[], category: string): string {
  if (resources.length === 0) return '';
  
  let table = `
## ${category}

Essential materials and resources used for crafting and trading.

| Resource | Name | Price |
|:--------:|:-----|:-----:|
`;

  resources.forEach(resource => {
    const price = resource.price ? resource.price.toLocaleString() + ' coins' : '-';
    table += `| <img src="${resource.icon}" alt="${resource.name}" width="32" height="32" style={{margin: 0}} /> | **[${resource.name}](/docs/resources/individual/${resource.key})** | ${price} |\n`;
  });
  
  return table;
}

// Generate the complete catalog content
function generateCatalogContent(groupedResources: Record<string, any[]>, totalResources: number): string {
  const categoryOrder = [
    'Tool Parts', 'Ores', 'Gems', 'Bars', 'Logs', 'Planks', 
    'Handles', 'Fish', 'Farming', 'Ingredients', 'Foraging', 
    'Hunting', 'Combat', 'Miscellaneous'
  ];
  
  // Generate category summary cards
  const categoryCards = categoryOrder.filter(cat => groupedResources[cat]?.length > 0).map(category => {
    const resources = groupedResources[category];
    const count = resources.length;
    const icon = getCategoryIcon(category);
    const color = getCategoryColor(category);
    
    return `  <div className="flex items-center gap-3 p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-700">
    <img src="${icon}" alt="${category}" className="w-12 h-12" />
    <div>
      <h4 className="font-semibold text-${color}-800 dark:text-${color}-200">${category}</h4>
      <p className="text-xs text-${color}-600 dark:text-${color}-300">${count} Resources</p>
    </div>
  </div>`;
  }).join('\n\n');
  
  // Generate all category tables
  const categoryTables = categoryOrder.filter(cat => groupedResources[cat]?.length > 0).map(category => {
    return generateCategoryTable(groupedResources[category], category);
  }).join('\n\n');
  
  return `---
title: Complete Resources Catalog
description: Complete catalog of all resources, materials, and crafting components in Stepcraft - ${totalResources} resources with prices and images
---

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
${categoryCards}
</div>

${categoryTables}

## Navigation

- [🔍 Search All Resources](/search) - Use the search function to find specific resources
- [📝 Individual Resource Pages](/docs/resources/individual) - Browse detailed pages for each resource
- [🏠 Back to Documentation](/docs) - Return to main documentation

*Catalog updated ${new Date().toISOString().split('T')[0]} - ${totalResources} resources*
`;
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Tool Parts': return '/assets/icons/smithing.png';
    case 'Ores': return '/assets/icons/mining.png';
    case 'Gems': return '/assets/icons/trinketry.png';
    case 'Bars': return '/assets/icons/smithing.png';
    case 'Logs': return '/assets/icons/logging.png';
    case 'Planks': return '/assets/icons/carpentry.png';
    case 'Handles': return '/assets/icons/carpentry.png';
    case 'Fish': return '/assets/icons/fishing.png';
    case 'Farming': return '/assets/icons/farming.png';
    case 'Ingredients': return '/assets/icons/alchemy.png';
    case 'Foraging': return '/assets/icons/foraging.png';
    case 'Hunting': return '/assets/icons/combat.png';
    case 'Combat': return '/assets/icons/combat.png';
    case 'Miscellaneous': return '/assets/icons/question.png';
    default: return '/assets/icons/question.png';
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Tool Parts': return 'amber';
    case 'Ores': return 'stone';
    case 'Gems': return 'purple';
    case 'Bars': return 'gray';
    case 'Logs': return 'amber';
    case 'Planks': return 'yellow';
    case 'Handles': return 'orange';
    case 'Fish': return 'blue';
    case 'Farming': return 'green';
    case 'Ingredients': return 'pink';
    case 'Foraging': return 'lime';
    case 'Hunting': return 'red';
    case 'Combat': return 'red';
    case 'Miscellaneous': return 'gray';
    default: return 'gray';
  }
}

// Main sync function
async function syncResourcesCatalog() {
  console.log('🔄 Syncing resources catalog with source data...');
  
  try {
    console.log('📖 Extracting resources data from source files...');
    const resources = await extractResourcesData();
    
    if (resources.length === 0) {
      console.error('❌ No resources extracted from source files!');
      return;
    }
    
    console.log(`📊 Found ${resources.length} resources across all categories`);
    
    // Group resources by category
    const groupedResources = groupResourcesByCategory(resources);
    
    // Log category breakdown
    Object.entries(groupedResources).forEach(([category, categoryResources]) => {
      console.log(`  • ${category}: ${categoryResources.length} resources`);
    });
    
    // Generate the new catalog content
    console.log('📝 Generating updated catalog content...');
    const catalogContent = generateCatalogContent(groupedResources, resources.length);
    
    // Write to the resources index file
    await fs.writeFile(resourcesIndexPath, catalogContent);
    
    console.log(`✅ Successfully updated resources catalog!`);
    console.log(`📁 Updated: ${resourcesIndexPath}`);
    console.log(`📊 Total resources: ${resources.length}`);
    console.log(`🔗 All resources now link to individual pages at /docs/resources/individual/[resource-key]`);
    
  } catch (error) {
    console.error('❌ Error syncing resources catalog:', error);
  }
}

// Run the sync
syncResourcesCatalog();