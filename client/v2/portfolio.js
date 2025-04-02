// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/**
Description of the available api
GET https://lego-api-blue.vercel.app/deals

Search for specific deals

This endpoint accepts the following optional query string parameters:

- `page` - page of deals to return
- `size` - number of deals to return

GET https://lego-api-blue.vercel.app/sales

Search for current Vinted sales for a given lego set id

This endpoint accepts the following optional query string parameters:

- `id` - lego set id to return
*/




'use strict';

let currentDeals = [];
let currentPagination = {};
let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []); // Gestion des favoris

const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const selectSort = document.querySelector('#sort-select');
const selectFilter = document.querySelector('#filter-select');
const sectionDeals = document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const sectionFavorites = document.querySelector('#favorites');

// Indicateurs
const spanNbSales = document.querySelector('#nbSales');
const spanAvgSalesPrice = document.querySelector('#avgSalesPrice');
const spanP5SalesPrice = document.querySelector('#p5SalesPrice');
const spanP25SalesPrice = document.querySelector('#p25SalesPrice');
const spanP50SalesPrice = document.querySelector('#p50SalesPrice');
const spanLifetimeValue = document.querySelector('#lifetimeValue');
const sectionVintedSales = document.querySelector('#vinted-sales');

const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
  updateIndicators(); // Mise à jour des indicateurs après avoir défini les deals
};

const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify([...favorites]));
};

const toggleFavorite = (uuid) => {
  if (favorites.has(uuid)) {
    favorites.delete(uuid);
  } else {
    favorites.add(uuid);
  }
  saveFavorites();
  render();
};

const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (!body.success) return { currentDeals, currentPagination };
    return body.data;
  } catch (error) {
    console.error(error);
    return { currentDeals, currentPagination };
  }
};

// Fonction de filtrage des offres
const filterDeals = (deals, filterType) => {
  switch (filterType) {
    case 'best-discount':
      return deals.filter(deal => deal.discount > 50);
    case 'most-commented':
      return deals.filter(deal => deal.comments > 15);
    case 'hot-deals':
      return deals.filter(deal => deal.temperature > 100);
    case 'favorites':
      return deals.filter(deal => favorites.has(deal.uuid));
    default:
      return deals;
  }
};

// Fonction de tri des offres par prix et date
const sortDeals = (deals, sortType) => {
  switch (sortType) {
    case 'price-asc':
      return deals.sort((a, b) => a.price - b.price); // Tri par prix croissant (moins cher)
    case 'price-desc':
      return deals.sort((a, b) => b.price - a.price); // Tri par prix décroissant (plus cher)
    case 'date-asc':
      return deals.sort((a, b) => new Date(a.date) - new Date(b.date)); // Tri par date croissante (le plus récent)
    case 'date-desc':
      return deals.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri par date décroissante (le plus ancien)
    default:
      return deals;
  }
};

// Fonction de calcul des indicateurs
const updateIndicators = () => {
  const deals = currentDeals;

  if (deals.length === 0) return;

  // Calcul des prix pour les indicateurs
  const prices = deals.map(deal => deal.price).sort((a, b) => a - b); // Tri des prix
  const totalSales = deals.reduce((acc, deal) => acc + deal.sales, 0); // Total des ventes

  // Calcul de la moyenne
  const avgSalesPrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;

  // Calcul de p5, p25, p50
  const p5SalesPrice = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25SalesPrice = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50SalesPrice = prices[Math.floor(prices.length * 0.50)] || 0;

  // Lifetime value (basé sur la première date et la date actuelle)
  const firstDate = new Date(deals[0].date); // La date de la première vente
  const lifetimeValue = Math.floor((new Date() - firstDate) / (1000 * 60 * 60 * 24)); // En jours

  // Mise à jour des indicateurs
  spanNbDeals.innerText = deals.length;
  spanNbSales.innerText = totalSales;
  spanAvgSalesPrice.innerText = avgSalesPrice.toFixed(2);
  spanP5SalesPrice.innerText = p5SalesPrice;
  spanP25SalesPrice.innerText = p25SalesPrice;
  spanP50SalesPrice.innerText = p50SalesPrice;
  spanLifetimeValue.innerText = `${lifetimeValue} days`;
};

// Fonction pour récupérer les ventes Vinted pour un set id spécifique
const fetchVintedSales = async (setId) => {
  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${setId}`);
    const data = await response.json();
    if (!data.success) return;

    const sales = data.data; // Les ventes récupérées pour le set spécifique
    updateIndicatorsForSet(sales); // Met à jour les indicateurs avec les ventes du set
  } catch (error) {
    console.error('Error fetching Vinted sales:', error);
  }
};

// Fonction pour afficher les informations Vinted sur les ventes
const displayVintedSales = (sales) => {
  if (!sales || sales.length === 0) {
    sectionVintedSales.innerHTML = '<p>No sales data available for this set.</p>';
    return;
  }

  let totalSales = sales.length;
  let avgPrice = sales.reduce((acc, sale) => acc + sale.price, 0) / totalSales;
  
  // Affichage des informations
  sectionVintedSales.innerHTML = `
    <h3>Vinted Sales Information</h3>
    <p>Total sales: ${totalSales}</p>
    <p>Average price: ${avgPrice.toFixed(2)}€</p>
  `;

  // Calcul des p5, p25, p50 pour les ventes
  const prices = sales.map(sale => sale.price).sort((a, b) => a - b);
  const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50 = prices[Math.floor(prices.length * 0.50)] || 0;

  sectionVintedSales.innerHTML += `
    <p>p5 price value: ${p5}€</p>
    <p>p25 price value: ${p25}€</p>
    <p>p50 price value: ${p50}€</p>
  `;
};

// Fonction de mise à jour des indicateurs basés sur le set sélectionné
const updateIndicatorsForSet = (sales) => {
  if (!sales || sales.length === 0) {
    sectionVintedSales.innerHTML = '<p>No sales data available for this set.</p>';
    return;
  }

  // Mise à jour des indicateurs pour les ventes spécifiques du set
  let totalSales = sales.length;
  let avgPrice = sales.reduce((acc, sale) => acc + sale.price, 0) / totalSales;
  
  // Affichage des informations
  sectionVintedSales.innerHTML = `
    <h3>Vinted Sales Information</h3>
    <p>Total sales: ${totalSales}</p>
    <p>Average price: ${avgPrice.toFixed(2)}€</p>
  `;

  const prices = sales.map(sale => sale.price).sort((a, b) => a - b);
  const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
  const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
  const p50 = prices[Math.floor(prices.length * 0.50)] || 0;

  sectionVintedSales.innerHTML += `
    <p>p5 price value: ${p5}€</p>
    <p>p25 price value: ${p25}€</p>
    <p>p50 price value: ${p50}€</p>
  `;
};

// Fonction de mise à jour de la pagination en fonction du nombre de deals
const updatePagination = (meta) => {
  const pages = Math.ceil(meta.totalDeals / meta.dealsPerPage);
  selectPage.innerHTML = '';  // Réinitialise les options de la pagination

  // Créer des options pour chaque page
  for (let i = 1; i <= pages; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Page ${i}`;
    selectPage.appendChild(option);
  }
};

// Rendu des deals et des favoris
const renderDeals = (deals) => {
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  selectLegoSetIds.innerHTML = '<option value="">Select a Set</option>'; // Réinitialise le sélecteur

  deals.forEach(deal => {
    const div = document.createElement('div');
    div.classList.add('deal');
    div.innerHTML = `
      <span>${deal.id}</span>
      <a href="${deal.link}" target="_blank">${deal.title}</a>
      <span>${deal.price}€</span>
      <button onclick="toggleFavorite('${deal.uuid}')">${favorites.has(deal.uuid) ? '❤️' : '🤍'}</button>
    `;
    sectionDeals.appendChild(div);

    // Ajout du set id au sélecteur
    const option = document.createElement('option');
    option.value = deal.id;  // Utilise l'ID de l'offre comme set id
    option.textContent = deal.title;  // Le titre de l'offre comme texte du menu
    selectLegoSetIds.appendChild(option);
  });
};

// Fonction de rendu globale
const render = () => {
  let deals = filterDeals(currentDeals, selectFilter?.value);
  deals = sortDeals(deals, selectSort?.value); // Applique le tri
  renderDeals(deals);
  renderFavorites();
  updateIndicators(); // Mise à jour des indicateurs de base
};

// Charger les deals au démarrage
document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();
  setCurrentDeals(deals);
  render();
});

// Ajout d'événements sur les éléments de sélection
selectFilter?.addEventListener('change', render);
selectSort.addEventListener('change', render);
selectShow.addEventListener('change', async (event) => {
  const numberOfDeals = parseInt(event.target.value);  // Récupère le nombre de deals sélectionné
  const deals = await fetchDeals(currentPagination.currentPage, numberOfDeals);  // Charge les nouveaux deals
  setCurrentDeals(deals);  // Met à jour les données de deals
  render();  // Re-render les deals avec le nouveau nombre
});

// Écouteur pour la sélection du set id dans le menu déroulant
selectLegoSetIds.addEventListener('change', (event) => {
  const selectedSetId = event.target.value;
  if (selectedSetId) {
    fetchVintedSales(selectedSetId); // Récupérer les ventes pour le set sélectionné
  } else {
    sectionVintedSales.innerHTML = ''; // Effacer les informations si aucun set n'est sélectionné
  }
});
