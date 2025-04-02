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


// current deals on the page
let currentDeals = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectLegoSetIds = document.querySelector('#lego-set-id-select');
const sectionDeals= document.querySelector('#deals');
const spanNbDeals = document.querySelector('#nbDeals');
const selectFilter = document.querySelector('#filter-select');
const selectSort = document.querySelector('#sort-select');

/**
 * Set global value
 * @param {Array} result - deals to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentDeals = ({result, meta}) => {
  currentDeals = result;
  currentPagination = meta;
};

/**
 * Fetch deals from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchDeals = async (page = 1, size = 6) => {
  try {
    const response = await fetch(
      `https://lego-api-blue.vercel.app/deals?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentDeals, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentDeals, currentPagination};
  }
};

// Assure-toi que favorites est initialisé comme un Set
const favorites = new Set();

/**
 * Render list of deals
 * @param  {Array} deals
 */
const renderDeals = deals => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = deals
    .map(deal => {
      return `
      <div class="deal" id=${deal.uuid}>
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
        <button class="favorite-btn" data-uuid="${deal.uuid}">
          ${favorites.has(deal.uuid) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionDeals.innerHTML = '<h2>Deals</h2>';
  sectionDeals.appendChild(fragment);
  
  if (deals.length === 0) {
    sectionDeals.innerHTML = '<p>Aucun deal trouvé avec ces critères.</p>';
    return;
  }
  
};

const toggleFavorite = (uuid) => {
  if (favorites.has(uuid)) {
    favorites.delete(uuid);
  } else {
    favorites.add(uuid);
  }
  render(currentDeals, currentPagination);  // Mettre à jour l'affichage des deals
  renderFavorites();  // Mettre à jour l'affichage des favoris
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const applyFilters = (deals, filterType) => {
  switch (filterType) {
    case 'best-discount':
      return deals.filter(deal => deal.discount >= 50);
    case 'most-commented':
      return deals.filter(deal => deal.comments >= 15);
    case 'hot-deals':
      return deals.filter(deal => deal.temperature >= 100);
      case 'favorites':
      return deals.filter(deal => favorites.has(deal.uuid));
    default:
      return deals;
  }
};

const applySorting = (deals, sortType) => {
  switch (sortType) {
    case 'price-asc':
      return deals.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return deals.sort((a, b) => b.price - a.price);
    case 'date-newest':
      return deals.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-oldest':
      return deals.sort((a, b) => new Date(a.date) - new Date(b.date));
    default:
      return deals;
  }
};

/**
 * Render lego set ids selector
 * @param  {Array} lego set ids
 */
const renderLegoSetIds = (deals) => {
  const ids = getIdsFromDeals(deals);
  const options = ids.map(id => 
    `<option value="${id}">${id}</option>`
  ).join('');
  
  selectLegoSetIds.innerHTML = options;
};

const renderFavorites = () => {
  const favoriteDeals = currentDeals.filter(deal => favorites.has(deal.uuid));
  const favoriteDealsHtml = favoriteDeals
    .map(deal => `
      <div class="deal" id="${deal.uuid}">
        <span>${deal.id}</span>
        <a href="${deal.link}">${deal.title}</a>
        <span>${deal.price}</span>
      </div>
    `)
    .join('');
  document.querySelector('#favorites-list').innerHTML = favoriteDealsHtml;
};



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbDeals.innerHTML = count;
};


const render = (deals, pagination) => {
  const filteredDeals = applyFilters(deals, selectFilter.value);
  const sortedDeals = applySorting(filteredDeals, selectSort.value);
  renderDeals(sortedDeals);
  renderPagination(pagination);
  renderIndicators(pagination);
  spanNbDeals.innerHTML = filteredDeals.length; // Afficher le nombre de deals après filtre
  renderLegoSetIds(deals)
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of deals to display
 */
selectShow.addEventListener('change', async (event) => {
  const size = parseInt(event.target.value);
  const deals = await fetchDeals(currentPagination.currentPage, size);
  setCurrentDeals(deals);
  render(deals.result, deals.meta); // Utilise les données mises à jour
});


selectFilter.addEventListener('change', () => {
  render(currentDeals, currentPagination);
});

selectSort.addEventListener('change', () => {
  render(currentDeals, currentPagination);
});

document.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('favorite-btn')) {
    const uuid = event.target.dataset.uuid;
    toggleFavorite(uuid);
    render(currentDeals, currentPagination); // Rafraîchir l'affichage des deals
  }
});


selectPage.addEventListener('change', async (event) => {
  const page = parseInt(event.target.value);
  const size = parseInt(selectShow.value);
  const deals = await fetchDeals(page, size);
  setCurrentDeals(deals);
  render(deals.result, deals.meta);
});


document.addEventListener('DOMContentLoaded', async () => {
  const deals = await fetchDeals();

  setCurrentDeals(deals);
  render(currentDeals, currentPagination);
});
