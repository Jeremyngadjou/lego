/* eslint-disable no-console, no-process-exit */
const path = require('path');
const { URL } = require('url');

/**
 * Map domain names to their corresponding scraper modules
 */
const scrapers = {
  'www.avenuedelabrique.com': 'avenuedelabrique',
  'www.dealabs.com': 'dealabs'
};

async function sandbox(website) {
  try {
    if (!website) {
      console.error('❌ Please provide a website URL.');
      process.exit(1);
    }

    const domain = new URL(website).hostname;

    const scraperName = scrapers[domain];

    if (!scraperName) {
      console.error(`❌ No scraper available for ${domain}`);
      process.exit(1);
    }

    const scraper = require(path.join(__dirname, 'websites', scraperName));  // Charge le bon scraper
    console.log(`🕵️‍♀️ Scraping ${website} using ${scraperName}.js`);

    // Appel de la fonction scrape avec l'URL
    await scraper.scrape(website);  // Cette fonction inclut l'insertion MongoDB

    console.log('✅ Done');
    process.exit(0);
  } catch (e) {
    console.error('💥 Error:', e);
    process.exit(1);
  }
}

const [,, url] = process.argv;
sandbox(url);
