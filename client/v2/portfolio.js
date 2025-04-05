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




let currentDeals = [];
let currentPagination = {};
let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const selectSort = document.querySelector('#sort-select');
const selectFilter = document.querySelector('#filter-select');
const sectionDeals = document.querySelector('#deals');
const sectionFavorites = document.querySelector('#favorites');
const sectionVintedSales = document.querySelector('#vinted-sales');

const spanNbDeals = document.querySelector('#nbDeals');
const spanNbSales = document.querySelector('#nbSales');
const spanAvgSalesPrice = document.querySelector('#avgSalesPrice');
const spanP5SalesPrice = document.querySelector('#p5SalesPrice');
const spanP25SalesPrice = document.querySelector('#p25SalesPrice');
const spanP50SalesPrice = document.querySelector('#p50SalesPrice');
const spanLifetimeValue = document.querySelector('#lifetimeValue');

/* =======================
   🔹 FONCTIONS PRINCIPALES
   ======================= */

// 🔹 Met à jour les deals et la pagination
const setCurrentDeals = ({ result, meta }) => {
  currentDeals = result;
  currentPagination = meta;
  updatePagination(meta);
  render();
};

// 🔹 Récupère les deals de l'API
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(`https://server-zeta-two-58.vercel.app/deals?page=${page}&size=${size}`);
    const body = await response.json();
    if (!body.success) return { currentDeals, currentPagination };
    return body.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des deals :", error);
    return { currentDeals, currentPagination };
  }
};

// 🔹 Récupère les ventes Vinted pour un set spécifique
const fetchVintedSales = async (setId) => {
  console.log("fetchVintedSales appelé avec setId:", setId);

  try {
    const response = await fetch(`https://lego-api-blue.vercel.app/sales?id=${setId}`);
    const data = await response.json();

    console.log("🔍 Données complètes reçues de l'API:", data); // Affiche tout data

    if (!data.success) {
      console.error("❌ L'API a retourné une erreur !");
      return;
    }

    // Vérification si data.data et data.data.result existent avant d'accéder
    if (Array.isArray(data.data.result) && data.data.result.length > 0) {
      console.log("🔍 Données des ventes trouvées:", data.data.result);
      updateIndicatorsForDealAndSet(data.data.result);
    } 
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes Vinted :", error);

  }
};












/* =======================
   🔹 FILTRAGE & TRI
   ======================= */

// 🔹 Filtre les offres selon le type sélectionné
// 🔹 Filtre les offres selon le type sélectionné
const filterDeals = (deals, filterType) => {
  switch (filterType) {
    case 'best-discount': return deals.filter(deal => deal.discount > 50);
    case 'most-commented': return deals.filter(deal => deal.comments > 5);
    case 'hot-deals': return deals.filter(deal => deal.temperature > 100);
    case 'favorites': return deals.filter(deal => favorites.has(deal.uuid));
    default: return deals;
  }
};


// 🔹 Trie les offres selon le critère choisi
const sortDeals = (deals, sortType) => {
  switch (sortType) {
    case 'price-asc': return deals.sort((a, b) => a.price - b.price);
    case 'price-desc': return deals.sort((a, b) => b.price - a.price);
    case 'date-asc': return deals.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'date-desc': return deals.sort((a, b) => new Date(b.date) - new Date(a.date));
    default: return deals;

    
  }
};


/* =======================
   🔹 MISE À JOUR UI
   ======================= */

// 🔹 Met à jour la pagination dynamiquement
const updatePagination = (meta) => {
  const pages = Math.ceil(meta.totalDeals / meta.dealsPerPage);
  selectPage.innerHTML = '';

  for (let i = 1; i <= pages; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Page ${i}`;
    selectPage.appendChild(option);
  }
  selectPage.value = meta.currentPage;
};

// 🔹 Mise à jour des indicateurs pour un deal spécifique et son historique de ventes
const updateIndicatorsForDealAndSet = (deal) => {
  console.log("Données des ventes reçues dans updateIndicatorsForSet:", deal);

  if (!deal) {
    console.error("❌ Problème: deal est null ou undefined !");
    return;
  }

  // Vérifier si deal est un tableau ou un objet
  if (Array.isArray(deal)) {
    if (deal.length === 0) {
      console.error("❌ Problème: deal est un tableau vide !");
      return;
    }

    // Si c'est un tableau, calculez les prix, etc.
    let totalSales = deal.length;
    let avgPrice = deal.reduce((acc, sale) => acc + sale.price, 0) / totalSales;
    const prices = deal.map(sale => sale.price).sort((a, b) => a - b);
    const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
    const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
    const p50 = prices[Math.floor(prices.length * 0.50)] || 0;

    // Mise à jour des informations du deal sélectionné
    spanNbDeals.innerText = "1";  // Un seul deal sélectionné
    spanNbSales.innerText = totalSales;
    spanAvgSalesPrice.innerText = avgPrice || 0;
    spanP5SalesPrice.innerText = p5;
    spanP25SalesPrice.innerText = p25;
    spanP50SalesPrice.innerText = p50;

    // Calcul de la lifetime (période écoulée depuis la première vente)
    const firstDate = new Date(deal[0].published);  // Date de la première vente
    const lifetimeValue = Math.floor((new Date() - firstDate) / (1000 * 60 * 60 * 24)); // En jours
    spanLifetimeValue.innerText = lifetimeValue ? `${lifetimeValue} days` : "N/A";
  } else if (typeof deal === 'object') {
    // Si c'est un objet, on peut gérer ce cas en tant que vente unique
    let totalSales = 1; // Une seule vente
    let avgPrice = deal.price || 0;
    const prices = [deal.price].sort((a, b) => a - b);
    const p5 = prices[Math.floor(prices.length * 0.05)] || 0;
    const p25 = prices[Math.floor(prices.length * 0.25)] || 0;
    const p50 = prices[Math.floor(prices.length * 0.50)] || 0;

    // Mise à jour des informations du deal sélectionné
    spanNbDeals.innerText = "1";  // Un seul deal sélectionné
    spanNbSales.innerText = totalSales;
    spanAvgSalesPrice.innerText = avgPrice || 0;
    spanP5SalesPrice.innerText = p5;
    spanP25SalesPrice.innerText = p25;
    spanP50SalesPrice.innerText = p50;

    // Calcul de la lifetime (période écoulée depuis la première vente)
    const firstDate = new Date(deal.date);  // Date de la première vente
    const lifetimeValue = Math.floor((new Date() - firstDate) / (1000 * 60 * 60 * 24)); // En jours
    spanLifetimeValue.innerText = lifetimeValue ? `${lifetimeValue} days` : "N/A";
  } else {
    console.error("❌ Type de donnée incorrect pour 'deal'. Il devrait être un tableau ou un objet.");
  }

  // Récupérer l'historique des ventes pour ce set
  fetchVintedSales(deal.id);
};



// 🔹 Sélection d'un set LEGO → mise à jour des indicateurs
selectLegoSetIds.addEventListener('change', (event) => {
  const selectedId = event.target.value;
  const selectedDeal = currentDeals.find(deal => deal.id === selectedId);

  updateIndicatorsForDealAndSet(selectedDeal);
});

/* =======================
   🔹 FAVORIS
   ======================= */

// 🔹 Sauvegarde les favoris
const saveFavorites = () => {
  localStorage.setItem('favorites', JSON.stringify([...favorites]));
};

// 🔹 Ajoute ou supprime un deal des favoris
const toggleFavorite = (uuid) => {
  favorites.has(uuid) ? favorites.delete(uuid) : favorites.add(uuid);
  saveFavorites();
  render();
};

/* =======================
   🔹 RENDU DES DEALS
   ======================= */

// 🔹 Affiche les deals dans la section correspondante
const renderDeals = (deals) => {
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  selectLegoSetIds.innerHTML = '<option value="">Select a Set</option>';

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

    const option = document.createElement('option');
    option.value = deal.id;
    option.textContent = deal.title;
    selectLegoSetIds.appendChild(option);
  });
};

// 🔹 Rendu principal
const render = () => {
  let deals = filterDeals(currentDeals, selectFilter?.value);
  deals = sortDeals(deals, selectSort?.value);
  renderDeals(deals);
};

/* =======================
   🔹 ÉVÉNEMENTS
   ======================= */

// 🔹 Chargement initial des deals
document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();
  setCurrentDeals(deals);
});

// 🔹 Gestion des filtres et tri
selectSort.addEventListener('change', render);
selectFilter.addEventListener('change', render);


// 🔹 Gestion du changement du nombre de deals affichés
selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const deals = await fetchDeals(1, size);
  setCurrentDeals(deals);
});

// 🔹 Gestion du changement de page
selectPage.addEventListener('change', async () => {
  const deals = await fetchDeals(parseInt(selectPage.value), parseInt(selectShow.value));
  setCurrentDeals(deals);
});













// 🔹 Sélection d'un set LEGO → mise à jour des indicateurs
selectLegoSetIds.addEventListener('change', (event) => {
  const selectedSetId = event.target.value;  // On récupère l'ID du set sélectionné

  if (!selectedSetId || selectedSetId.trim() === '') {
    console.error("❌ Aucun set ID sélectionné !");
    return; // Si aucun set n'est sélectionné, on arrête la fonction
  }

  console.log("✅ Set ID sélectionné :", selectedSetId); // Affichage du set ID sélectionné
  
  // Chercher le deal associé au set sélectionné
  const selectedDeal = currentDeals.find(deal => deal.id === selectedSetId);

  if (selectedDeal) {
    console.log("✅ Deal trouvé :", selectedDeal);
    updateIndicatorsForDealAndSet(selectedDeal);  // Appel à la fonction de mise à jour avec le deal trouvé
  } else {
    console.error("❌ Aucun deal trouvé pour cet ID de set.");
    updateIndicatorsForDealAndSet(null);  // Réinitialisation des indicateurs
  }
});


