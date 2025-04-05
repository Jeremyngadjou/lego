/* eslint-disable no-console, no-process-exit */
const path = require('path');

// Changement ici : récupère dynamiquement le bon module
async function sandbox (input) {
  try {
    const websiteName = input.includes('dealabs')
      ? 'dealabs'
      : input.includes('avenuedelabrique')
        ? 'avenuedelabrique'
        : 'vinted';

    const scraper = require(`./websites/${websiteName}`);

    const param = websiteName === 'vinted'
      ? input.replace(/^https?:\/\/[^\/]+\/?/, '') // ex: "lego 75347"
      : input;

    console.log(`🕵️‍♀️ Scraping with ${websiteName}.js for ${param}...`);

    const deals = await scraper.scrape(param);

    console.log(deals);
    console.log('✅ Done');
    process.exit(0);
  } catch (e) {
    console.error('💥 Error:', e);
    process.exit(1);
  }
}

const [,, input] = process.argv;

sandbox(input || 'lego 75347');
