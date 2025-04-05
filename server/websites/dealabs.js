const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');  // Import de MongoClient
const fs = require('fs');

// Configuration MongoDB
const MONGODB_URI = 'mongodb+srv://admin:admin1234@lego.mjxy4lw.mongodb.net/?retryWrites=true&w=majority&appName=Lego';  // Remplace <user>, <password>, <cluster-url>
const MONGODB_DB_NAME = 'lego';  // Le nom de ta base de données

/**
 * Parse the HTML from Dealabs
 * @param {string} html - The HTML content of the page
 * @returns {Array} - Array of deals
 */
const parse = html => {
  const $ = cheerio.load(html);
  const deals = [];

  $('article.thread').each((i, el) => {
    const title = $(el).find('a.cept-tt.thread-link').text().trim();
    const priceText = $(el).find('span.text--b.size--all-xl.size--fromW3-xxl.thread-price').text().trim();
    
    // Nettoyage et conversion du prix
    let price = null;
    if (priceText) {price = parseFloat(priceText.replace(/[^\d,.-]/g, '').replace(',', '.'));}

    const link = $(el).find('a.cept-tt.thread-link').attr('href');
    const datePosted = $(el).find('span.size--all-s').text().trim() || 'Date non disponible';
    deals.push({ title, price, link, datePosted });
  });

  return deals;
};

/**
 * Fonction pour insérer les données dans MongoDB
 * @param {Array} deals - Liste des deals à insérer
 */
const insertDealsToMongoDB = async (deals) => {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB_NAME);  // Sélectionne la base de données
  
  try {
    // Insertion des deals dans la collection 'deals'
    const collection = db.collection('deals');
    const result = await collection.insertMany(deals);

    console.log(`✅ ${result.insertedCount} deals inserted to MongoDB`);  // Affiche combien de deals ont été insérés
  } catch (err) {
    console.error('❌ Failed to insert into MongoDB', err);
  } finally {
    await client.close();  // Ferme la connexion à MongoDB
  }
};

/**
 * Scrape the webpage, parse it and save the deals to MongoDB
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

    // Insérer les deals dans MongoDB
    await insertDealsToMongoDB(deals);

    console.log('✅ Done');
  } catch (err) {
    console.error('❌ Scraping failed:', err);  // Affiche l'erreur si le scraping échoue
  }
};

// Export the scrape function so it can be used elsewhere
module.exports.scrape = scrape;
