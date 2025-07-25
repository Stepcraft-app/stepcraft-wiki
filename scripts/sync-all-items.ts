import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function syncAllItems() {
  console.log('🚀 Starting complete items synchronization...');
  console.log('');
  
  try {
    // Step 1: Generate all individual item pages
    console.log('1️⃣ Generating individual item pages...');
    const { stdout: pages, stderr: pagesErr } = await execAsync('npm run generate-all-item-pages');
    if (pagesErr) console.error('Pages stderr:', pagesErr);
    console.log(pages);
    console.log('');
    
    // Step 2: Sync the main catalog with hyperlinks
    console.log('2️⃣ Syncing items catalog with hyperlinks...');
    const { stdout: catalog, stderr: catalogErr } = await execAsync('npm run sync-items-catalog');
    if (catalogErr) console.error('Catalog stderr:', catalogErr);
    console.log(catalog);
    console.log('');
    
    // Step 3: Regenerate search data to include everything
    console.log('3️⃣ Updating search index...');
    const { stdout: search, stderr: searchErr } = await execAsync('npm run generate-content-json');
    if (searchErr) console.error('Search stderr:', searchErr);
    console.log(search);
    console.log('');
    
    console.log('✅ Complete items synchronization finished!');
    console.log('');
    console.log('📊 Summary:');
    console.log('  • Individual item pages generated and updated');
    console.log('  • Main catalog synchronized with source data');
    console.log('  • All items now have hyperlinks to detail pages');
    console.log('  • Search index updated with all content');
    console.log('');
    console.log('🔗 Access items at:');
    console.log('  • Main catalog: /docs/items');
    console.log('  • Individual pages: /docs/items/individual/[item-key]');
    console.log('  • Search: Use the search function to find any item');
    
  } catch (error) {
    console.error('❌ Error during synchronization:', error);
    process.exit(1);
  }
}

// Run the complete sync
syncAllItems();