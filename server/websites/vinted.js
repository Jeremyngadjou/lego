const fetch = require('node-fetch');
const fs = require('fs');

/**
 * Scrape Vinted listings for a given search term
 * @param {string} query
 * @returns {Promise<Array>}
 */
const scrape = async (query = 'lego') => {
  const url = `https://www.vinted.fr/api/v2/catalog/items?search_text=${encodeURIComponent(query)}&per_page=50`;

  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json'
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const json = await res.json();
    const items = json.items.map(item => ({
      title: item.title,
      price: item.price,
      currency: item.currency,
      brand: item.brand_title,
      image_url: item.photos?.[0]?.url || null,
      url: `https://www.vinted.fr${item.url}`,
      user: item.user?.login,
      location: item.user?.city
    }));

    // Optionnel : écrire dans un fichier
    fs.writeFileSync(
      `vinted-deals-${query.replace(/\s+/g, '_')}.json`,
      JSON.stringify(items, null, 2),
      'utf-8'
    );

    return items;
  } catch (err) {
    console.error('❌ Vinted scraping failed:', err.message);
    return [];
  }
};

module.exports = { scrape };
