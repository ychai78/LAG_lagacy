const predictiveSearch = {
  init() {
    this.searchInput = document.getElementById('search_box_desktop');
    this.predictiveSearchResults = document.getElementById('predictive-search');
    this.modalOverlay = document.querySelector('.modal-overlay');
    this.searchModal = document.querySelector('search-modal');
    this.popularSearchesList = document.getElementById('popular-searches-list');

    if (!this.searchInput || !this.predictiveSearchResults || !this.modalOverlay || !this.searchModal) {
      console.error('Search input, predictive search container, modal overlay, or search modal not found');
      return;
    }

    this.setupEventListeners();
    this.fetchPopularSearches();
  },
fetchPopularSearches() {
  // Add a default search term and adjust the resources parameter
  fetch('/search/suggest.json?q=a&resources[type]=query&resources[options][unavailable_products]=last')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Check if data and required properties exist
      if (data && data.resources && data.resources.results && data.resources.results.queries) {
        const popularQueries = data.resources.results.queries
          .filter(query => query.text && query.text.trim().length > 0) // Filter out empty queries
          .slice(0, 4); // Get top 4 results
        this.renderPopularSearches(popularQueries);
      } else {
        this.renderPopularSearches([]);
        console.log('No popular searches available');
      }
    })
    .catch(error => {
      console.error('Error fetching popular searches:', error);
      this.renderPopularSearches([]);
      
      // Hide the popular searches section if there's an error
      if (this.popularSearchesList) {
        this.popularSearchesList.closest('.popular-searches-section')?.classList.add('hidden');
      }
    });
},

// Update renderPopularSearches to handle empty state
renderPopularSearches(queries) {
  if (!this.popularSearchesList) return;

  if (queries.length === 0) {
    this.popularSearchesList.innerHTML = '<li class="list-none mb-4">No popular searches available</li>';
    return;
  }

  const markup = queries.map(query => `
    <li class="list-none mb-4">
      <a href="/search?q=${encodeURIComponent(query.text)}&type=product&options%5Bunavailable_products%5D=hide&options%5Bprefix%5D=last" 
         class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 no-underline text-gray-800">
        ${query.text}
      </a>
    </li>
  `).join('');

  this.popularSearchesList.innerHTML = markup;
},
 setupEventListeners() {
    this.searchInput.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.modalOverlay.addEventListener('click', (event) => {
      this.closeSearchModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeSearchModal();
      }
    });
  },

  onChange(event) {
    const searchTerm = event.target.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  },

 getSearchResults(searchTerm) {
    fetch(`/search/suggest.json?q=${encodeURIComponent(searchTerm)}&resources[type]=product,collection,query&page[limit]=4&options[unavailable_products]=hide`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const resultsMarkup = this.renderResults(data.resources.results.products, data.resources.results.queries, data.resources.results.collections);
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  },

  renderResults(products, queries, collections) {
    const suggestionsMarkup = this.renderSuggestions(queries, collections);
    const productsMarkup = this.renderProducts(products);

    return `
      <div id="predictive-search__results-list" class="predictive-search-results p-8" role="listbox">
        <div id="predictive-search-results-groups-wrapper" class="predictive-search__results-groups-wrapper grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
          ${suggestionsMarkup}
          ${productsMarkup}
        </div>
        <div id="predictive-search-option-search-keywords" class="predictive-search__search-for-button flex justify-center">
          <a href="/search?q=${encodeURIComponent(this.searchInput.value)}&type=product&options[unavailable_products]=hide" class="predictive-search__item daisybtn daisybtn-outline daisybtn-accent h-8 min-h-8 font-sans font-bold text-xs md:text-sm last:pr-4" role="option" aria-selected="false">
            <span data-predictive-search-search-for-text="" class="text">Search for "${this.searchInput.value}"</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="25" height="25" stroke-width="1.5" stroke="currentColor" class="flex justify-center items-center"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path></svg>
          </a>
        </div>
      </div>
    `;
  },

  renderSuggestions(queries, collections) {
    if ((!queries || queries.length === 0) && (!collections || collections.length === 0)) {
      return '';
    }

    const queryItemsMarkup = (queries || []).map((query, index) => {
      return `
        <li id="predictive-search-option-query-${index + 1}" class="predictive-search__list-item" role="option" aria-selected="false">
          <a href="/search?q=${encodeURIComponent(query.text)}&type=product&options%5Bunavailable_products%5D=hide&options%5Bprefix%5D=last" class="predictive-search__item flex gap-4 group" tabindex="-1">
            <div class="predictive-search__item-content predictive-search__item-content--centered">
              <p class="predictive-search__item-heading hover-transition">${query.text}</p>
            </div>
          </a>
        </li>
      `;
    }).join('');

    const collectionItemsMarkup = (collections || []).map((collection, index) => {
      if (!collection.title || !collection.url) return '';
      return `
        <li id="predictive-search-option-collection-${index + 1}" class="predictive-search__list-item" role="option" aria-selected="false">
          <a href="${collection.url}" class="predictive-search__item flex gap-4 group" tabindex="-1">
            <div class="predictive-search__item-content predictive-search__item-content--centered">
              <p class="predictive-search__item-heading hover-transition">${collection.title}</p>
            </div>
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="predictive-search__result-group flex flex-col lg:col-span-2">
        <div>
          <h3 id="predictive-search-queries" class="predictive-search__heading text-base border-b mb-6">Suggestions</h3>
          <ul id="predictive-search-results-queries-list" class="predictive-search__results-list flex flex-col gap-4 list-text--links" role="group" aria-labelledby="predictive-search-queries">
            ${queryItemsMarkup}
            ${collectionItemsMarkup}
          </ul>
        </div>
      </div>
    `;
  },


  renderProducts(products) {
    if (!products || products.length === 0) {
      return '';
    }

    const itemsMarkup = products.map((product, index) => {
      const priceMarkup = product.vendor === 'NotForSale' ? '' : `
        <div class="price">
          <span class="price-holder text-base"><span class="price__prefix">$</span>${product.price}</span>
        </div>
      `;
      return `
        <li id="predictive-search-option-${index + 1}" class="predictive-search__list-item" role="option" aria-selected="false">
          <a href="${product.url}" class="predictive-search__item flex gap-4 group" tabindex="-1">
            <div class="predictive-search__image img-wrapper">
              <img src="${product.featured_image.url}" alt="${product.title}" width="70" height="70.0" loading="lazy" class="loaded">
            </div>
            <div class="predictive-search__item-content">
              <span class="predictive-search__item-heading hover-transition">${product.title}</span>
              ${priceMarkup}
            </div>
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="predictive-search__result-group flex flex-col lg:col-span-8">
        <div>
          <h3 id="predictive-search-products" class="predictive-search__heading text-base border-b mb-6">Products</h3>
          <ul id="predictive-search-results-products-list" class="predictive-search__results-list flex flex-col gap-4 lg:grid lg:grid-cols-2" role="group" aria-labelledby="predictive-search-products">
            ${itemsMarkup}
          </ul>
        </div>
      </div>
    `;
  },

  open() {
    this.predictiveSearchResults.setAttribute('aria-expanded', true);
    this.predictiveSearchResults.style.display = 'block';
  },

  close() {
    this.predictiveSearchResults.setAttribute('aria-expanded', false);
    this.predictiveSearchResults.style.display = 'none';
  },

  openSearchModal() {
    document.body.classList.add('search-modal--open');
    const searchMenuBar = document.querySelector('.desktop-search-modal');
    searchMenuBar.classList.remove('hidden');
    searchMenuBar.classList.add('active');
    this.modalOverlay.classList.add('search-modal--open');
    this.searchInput.focus();
  },

  closeSearchModal() {
    document.body.classList.remove('search-modal--open');
    const searchMenuBar = document.querySelector('.desktop-search-modal');
    searchMenuBar.classList.remove('active');
    searchMenuBar.classList.add('hidden');
    this.modalOverlay.classList.remove('search-modal--open');
    this.searchInput.value = '';
    this.predictiveSearchResults.innerHTML = '';
    this.predictiveSearchResults.style.display = 'none';
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
};

// Attach to window to make it globally accessible
window.predictiveSearch = predictiveSearch;

document.addEventListener("DOMContentLoaded", function() {
  predictiveSearch.init();
  
  document.querySelectorAll('.search-open').forEach(function(element) {
    element.addEventListener('click', function(event) {
      event.preventDefault();
      predictiveSearch.openSearchModal();
    });
  });

  const searchClose = document.getElementById('search-close');
  if (searchClose) {
    searchClose.addEventListener('click', predictiveSearch.closeSearchModal.bind(predictiveSearch));
  } else {
    console.error('Element with ID "search-close" not found.');
  }

  const modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function() {
      predictiveSearch.closeSearchModal();
    });
  } else {
    console.error('Element with class "modal-overlay" not found.');
  }
});

const mobilePredictiveSearch = {
  init() {
    this.searchInput = document.getElementById('search_box_mobile');
    this.predictiveSearchResults = document.getElementById('predictive-search-mobile');
    this.modalOverlay = document.querySelector('.mobile-search-modal .modal-overlay');
    this.searchModal = document.querySelector('.mobile-search-modal');
    this.searchCloseButton = document.getElementById('mobile-search-close');

    if (!this.searchInput || !this.predictiveSearchResults || !this.modalOverlay || !this.searchModal || !this.searchCloseButton) {
      
      return;
    }

    this.setupEventListeners();
  },

  setupEventListeners() {
    this.searchInput.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.modalOverlay.addEventListener('click', (event) => {
      if (event.target === this.modalOverlay) {
        this.closeSearchModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeSearchModal();
      }
    });

    this.searchCloseButton.addEventListener('click', this.closeSearchModal.bind(this));
  },

  onChange(event) {
    const searchTerm = event.target.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  },

  getSearchResults(searchTerm) {
    fetch(`/search/suggest.json?q=${encodeURIComponent(searchTerm)}&resources[type]=product,collection,query&page[limit]=4&options[unavailable_products]=hide`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const resultsMarkup = this.renderResults(data.resources.results.products, data.resources.results.queries, data.resources.results.collections);
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  },

  renderResults(products, queries, collections) {
    const suggestionsMarkup = this.renderSuggestions(queries, collections);
    const productsMarkup = this.renderProducts(products);

    return `
      <div id="predictive-search__results-list-mobile" class="predictive-search-results p-6" role="listbox">
        <div id="predictive-search-results-groups-wrapper-mobile" class="predictive-search__results-groups-wrapper grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
          ${suggestionsMarkup}
          ${productsMarkup}
        </div>
        <div id="predictive-search-option-search-keywords-mobile" class="predictive-search__search-for-button flex justify-center">
          <a href="/search?q=${encodeURIComponent(this.searchInput.value)}&type=product&options[unavailable_products]=hide" class="predictive-search__item daisybtn daisybtn-outline daisybtn-accent h-8 min-h-8 font-sans font-bold text-xs md:text-sm last:pr-4" role="option" aria-selected="false">
            <span data-predictive-search-search-for-text="" class="text">Search for "${this.searchInput.value}"</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="25" height="25" stroke-width="1.5" stroke="currentColor" class="flex justify-center items-center"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path></svg>
          </a>
        </div>
      </div>
    `;
  },
  
  renderSuggestions(queries, collections) {
    if ((!queries || queries.length === 0) && (!collections || collections.length === 0)) {
      return '';
    }

    const collectionItemsMarkup = (collections || []).map((collection, index) => {
      if (!collection.title || !collection.url) return '';
      return `
        <li id="predictive-search-option-collection-mobile-${index + 1}" class="predictive-search__list-item" role="option" aria-selected="false">
          <a href="${collection.url}" class="predictive-search__item flex gap-4 group" tabindex="-1">
            <div class="predictive-search__item-content predictive-search__item-content--centered">
              <p class="predictive-search__item-heading hover-transition">${collection.title}</p>
            </div>
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="predictive-search__result-group flex flex-col lg:col-span-2 hide">
        <div>
          <h3 id="predictive-search-queries-mobile" class="predictive-search__heading text-base border-b mb-6">Suggestions</h3>
          <ul id="predictive-search-results-queries-list-mobile" class="predictive-search__results-list flex flex-col gap-4 list-text--links" role="group" aria-labelledby="predictive-search-queries-mobile">
            ${collectionItemsMarkup}
          </ul>
        </div>
      </div>
    `;
  },

  renderProducts(products) {
    if (!products || products.length === 0) {
      return '';
    }

    const itemsMarkup = products.map((product, index) => {
      const priceMarkup = product.vendor === 'NotForSale' ? '' : `
        <div class="price">
          <span class="price-holder text-base"><span class="price__prefix">$</span>${product.price}</span>
        </div>
      `;
      return `
        <li id="predictive-search-option-mobile-${index + 1}" class="predictive-search__list-item" role="option" aria-selected="false">
          <a href="${product.url}" class="predictive-search__item flex gap-4 group" tabindex="-1">
            <div class="predictive-search__image img-wrapper">
              <img src="${product.featured_image.url}" alt="${product.title}" width="70" height="70.0" loading="lazy" class="loaded">
            </div>
            <div class="predictive-search__item-content">
              <span class="predictive-search__item-heading hover-transition">${product.title}</span>
              ${priceMarkup}
            </div>
          </a>
        </li>
      `;
    }).join('');

    return `
      <div class="predictive-search__result-group flex flex-col lg:col-span-8">
        <div>
          <h3 id="predictive-search-products-mobile" class="predictive-search__heading text-base border-b mb-6 hide">Products</h3>
          <ul id="predictive-search-results-products-list-mobile" class="predictive-search__results-list flex flex-col gap-4 lg:grid lg:grid-cols-2" role="group" aria-labelledby="predictive-search-products-mobile">
            ${itemsMarkup}
          </ul>
        </div>
      </div>
    `;
  },

  open() {
    this.predictiveSearchResults.setAttribute('aria-expanded', true);
    this.predictiveSearchResults.classList.remove('hidden');
  },

  close() {
    this.predictiveSearchResults.setAttribute('aria-expanded', false);
    this.predictiveSearchResults.classList.add('hidden');
  },

  openSearchModal() {
    document.body.classList.add('search-modal--open');
    const searchMenuBar = document.querySelector('.mobile-search-modal');
    searchMenuBar.classList.remove('hidden');
    searchMenuBar.classList.add('active');
    this.modalOverlay.classList.add('search-modal--open');
    this.searchInput.focus();
  },

  closeSearchModal() {
    document.body.classList.remove('search-modal--open');
    const searchMenuBar = document.querySelector('.mobile-search-modal');
    searchMenuBar.classList.remove('active');
    searchMenuBar.classList.add('hidden');
    this.modalOverlay.classList.remove('search-modal--open');
    this.searchInput.value = '';
    this.predictiveSearchResults.innerHTML = '';
    this.predictiveSearchResults.classList.add('hidden');
  },

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
};

// Attach to window to make it globally accessible
window.mobilePredictiveSearch = mobilePredictiveSearch;

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  mobilePredictiveSearch.init();
  
  const searchMobileOpen = document.querySelector('.desktop-search-modal.active');
  if (searchMobileOpen) {
    searchMobileOpen.addEventListener('click', function(event) {
      event.preventDefault();
      mobilePredictiveSearch.openSearchModal();
    });
  } else {
   
  }

  const mobileSearchClose = document.querySelector('.desktop-search-modal.hidden');
  if (mobileSearchClose) {
    mobileSearchClose.addEventListener('click', mobilePredictiveSearch.closeSearchModal.bind(mobilePredictiveSearch));
  } else {
    
  }
});
