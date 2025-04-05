const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse the HTML from Dealabs
 * @param {string} html - The HTML content of the page
 * @returns {Array} - Array of deals
 */
const parse = html => {
  const $ = cheerio.load(html);
  const deals = [];

  $('article.thread').each((i, el) => {
    const title = $(el).find('a.thread-title').text().trim();
    const priceText = $(el).find('.thread-price').text().trim();
    const linkPart = $(el).find('a.thread-title').attr('href');
    const link = `https://www.dealabs.com${linkPart}`;
    const store = $(el).find('.cept-merchant-name').text().trim();

    const price = parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));

    deals.push({ title, price, store, link });
  });

  return deals;
};

/**
 * Scrape the webpage and save the deals to a JSON file
 * @param {string} url - The URL to scrape
 */
const scrape = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const html = await res.text();
    const deals = parse(html);

    // Affichage des données récupérées dans la console
    console.log('Liste des deals récupérés :');
    console.log(deals);  // Affiche toutes les offres récupérées

    fs.writeFileSync('deals.json', JSON.stringify(deals, null, 2), 'utf-8');
    console.log(`✅ ${deals.length} deals saved to deals.json`);
  } catch (err) {
    console.error('❌ Scraping failed:', err);  // Affiche l'erreur si le scraping échoue
  }
};

// Export the scrape function so it can be used elsewhere
module.exports.scrape = scrape;
