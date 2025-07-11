document.addEventListener('DOMContentLoaded', () => {
  // Select all necessary DOM elements
  const productForm = document.querySelector('form[action="/cart/add"]');
  const variantSelector = document.getElementById('swatch-icons');
  const priceElement = document.querySelector('.price_section span[itemprop="price"]');
  const addToCartButton = document.querySelector('.product-form__submit');
  const quantityInput = document.querySelector('.quantity-input');
  const quantitySelector = document.querySelector('.quantity-selector');
  const customDropdown = document.querySelector('.custom-dropdown');
  const dropdownMenu = customDropdown.querySelector('.variant-dropdown-menu');
  const skuElement = document.querySelector('.variant-sku');

  let mainSwiper, thumbSwiper;
  let isManuallyChanging = false;

  // Initialize Swiper sliders for main product images and thumbnails

  function initializeSwiper() {
  mainSwiper = new Swiper('.main-slider', {
    slidesPerView: 1,
    spaceBetween: 16,
    watchOverflow: true,
    watchSlidesProgress: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    allowTouchMove: true,
      touchRatio: 1,
      threshold: 5,
      grabCursor: true,
  });

  thumbSwiper = new Swiper('.thumbnail-slider', {
    slidesPerView: 'auto',
    direction: 'vertical',
    spaceBetween: 10,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
  });

  let currentThumbIndex = 0;

// Handle thumbnail clicks
thumbSwiper.on('click', function () {
  const clickedSlide = thumbSwiper.clickedSlide;
  if (!clickedSlide) return;

  const visibleSlides = Array.from(thumbSwiper.slides).filter(slide => slide.style.display !== 'none');
  const clickedVisibleIndex = visibleSlides.indexOf(clickedSlide);
  const clickedDataName = clickedSlide.dataset.name;

  if (clickedVisibleIndex !== -1) {
    const slidesToMove = clickedVisibleIndex - currentThumbIndex;

    if (slidesToMove > 0) {
      for (let i = 0; i < slidesToMove; i++) {
        mainSwiper.slideNext();
      }
    } else if (slidesToMove < 0) {
      for (let i = 0; i > slidesToMove; i--) {
        mainSwiper.slidePrev();
      }
    }

    currentThumbIndex = clickedVisibleIndex;

        // Remove 'swiper-slide-active' class from all thumbnails
        thumbSwiper.slides.forEach(slide => {
          slide.classList.remove('swiper-slide-active');
        });

        // Add 'swiper-slide-active' class to the clicked thumbnail
        clickedSlide.classList.add('swiper-slide-active'); 
  }
});


  // Sync thumbnail slider to main slider
  mainSwiper.on('slideChange', function () {
    thumbSwiper.slideTo(mainSwiper.activeIndex);
    currentThumbIndex = mainSwiper.activeIndex;
    console.log('Main slider changed to:', mainSwiper.slides[mainSwiper.activeIndex].dataset.name);
  });
}

function updateSliderImages(selectedVariant) {
    // Hide all elements and show loading circle
    const mainSliderWrapper = document.querySelector('.main-slider .swiper-wrapper');
    const thumbSliderWrapper = document.querySelector('.thumbnail-slider .swiper-wrapper');
    mainSliderWrapper.style.opacity = '0';
    thumbSliderWrapper.style.opacity = '0';

    // Add loading circle
    const loadingCircle = document.createElement('div');
    loadingCircle.className = 'loading-circle';
    loadingCircle.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #eb018b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    document.querySelector('.main-slider').appendChild(loadingCircle);

    // Add keyframes for loading animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Existing logic to update slides
    const variantSku = selectedVariant.sku.toLowerCase();
    const mainSlides = Array.from(mainSliderWrapper.children);
    const thumbSlides = Array.from(thumbSliderWrapper.children);
    let visibleSlides = [];

    mainSlides.forEach((slide, index) => {
        const slideName = (slide.dataset.name || '').toLowerCase();
        const isCommon = slideName.includes('common') || slideName.includes('shared');
        const containsSku = slideName.includes(variantSku);
        if (containsSku || isCommon) {
            visibleSlides.push({ mainSlide: slide, thumbSlide: thumbSlides[index] });
            slide.style.display = '';
            thumbSlides[index].style.display = '';
        } else {
            slide.style.display = 'none';
            thumbSlides[index].style.display = 'none';
        }
    });

    visibleSlides.forEach(({ mainSlide, thumbSlide }) => {
        mainSliderWrapper.appendChild(mainSlide);
        thumbSliderWrapper.appendChild(thumbSlide);
    });

    // Update Swiper instances
    mainSwiper.update();
    thumbSwiper.update();
    mainSwiper.slideTo(0, 0);
    thumbSwiper.slideTo(0, 0);

    // Wait 1/2 second, then reveal elements and remove loading circle
    setTimeout(() => {
        mainSliderWrapper.style.opacity = '1';
        thumbSliderWrapper.style.opacity = '1';
        loadingCircle.remove();
        style.remove();
    }, 500);
}
  // Update product details based on the selected variant
  function updateProductDetails(selectedVariant) {
  if (selectedVariant) {
    const priceWrapper = document.querySelector('[data-price-wrapper]');
    const productPrice = priceWrapper.querySelector('[data-product-price]');
    const comparePrice = priceWrapper.querySelector('[data-compare-price]');

    // Check if item is on sale
    const isOnSale = selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price;

    // Clear existing price wrapper content
    while (priceWrapper.firstChild) {
      priceWrapper.firstChild.remove();
    }

    if (isOnSale) {
      // Create and append sale price
      const salePrice = document.createElement('span');
      salePrice.classList.add('text-red-600');
      salePrice.setAttribute('data-product-price', '');
      salePrice.setAttribute('itemprop', 'price');
      salePrice.textContent = '$' + (selectedVariant.price / 100).toFixed(2);
      priceWrapper.appendChild(salePrice);

      // Create and append compare price
      const compareElement = document.createElement('span');
      compareElement.classList.add('ml-1', 'text-base', 'text-gray-500', 'line-through');
      compareElement.setAttribute('data-compare-price', '');
      compareElement.textContent = '$' + (selectedVariant.compare_at_price / 100).toFixed(2);
      priceWrapper.appendChild(compareElement);
    } else {
      // Create and append regular price
      const regularPrice = document.createElement('span');
      regularPrice.setAttribute('data-product-price', '');
      regularPrice.setAttribute('itemprop', 'price');
      regularPrice.textContent = '$' + (selectedVariant.price / 100).toFixed(2);
      priceWrapper.appendChild(regularPrice);
    }
      // Update SKU
      if (skuElement) {
        skuElement.textContent = selectedVariant.sku;
      }

      // Update add to cart button and quantity selector
      updateAddToCartState(selectedVariant);

      // Update URL with the selected variant ID
      if (history.replaceState) {
        const currentHash = window.location.hash; // Preserve the current hash
        const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?variant=${selectedVariant.id}${currentHash}`;
        window.history.replaceState({ path: newurl }, '', newurl);
      }

      // Update the selected swatch and dropdown
      updateSelectedSwatchAndDropdown(selectedVariant.id);

      // Update the hidden input for the selected variant
      const hiddenInput = productForm.querySelector('input[name="id"]');
      hiddenInput.value = selectedVariant.id;
    }
  }

  // Update add to cart button state based on variant availability
  function updateAddToCartState(selectedVariant) {
    const product = window.productPageData.product;
    const buttonTextElement = addToCartButton.querySelector('span');

    // Reset button state
    addToCartButton.disabled = false;
    quantitySelector.style.display = '';

    if (product.vendor === 'NotForSale') {
        if (product.tags.includes('sold-out')) {
            addToCartButton.disabled = true;
            buttonTextElement.textContent = 'Sold Out';
            quantitySelector.style.display = 'none';
            } 
        else{
            addToCartButton.disabled = true;
            buttonTextElement.textContent = 'Available In Stores Only';
            quantitySelector.style.display = 'none';
        }
    } else if (!selectedVariant.available) {
      addToCartButton.disabled = true;
      buttonTextElement.textContent = 'Out of Stock';
    } else if (product.tags.includes('coming soon')) {
      addToCartButton.disabled = true;
      buttonTextElement.textContent = 'Coming Soon';
      quantitySelector.style.display = 'none';
    }else {
      buttonTextElement.textContent = 'Add to Bag';
    }
  }

  // Update the selected swatch and dropdown display
  function updateSelectedSwatchAndDropdown(variantId) {
    // Remove 'selected' class from all swatches
    document.querySelectorAll('.swatch-icon label').forEach(swatch => swatch.classList.remove('selected'));

    // Add 'selected' class to the correct swatch
    const selectedSwatch = document.querySelector(`.swatch-icon[data-variant-id="${variantId}"] label`);
    if (selectedSwatch) {
      selectedSwatch.classList.add('selected');
    }

    // Update dropdown display
    const selectedVariantTitle = document.getElementById('selected-variant-title');
    const variantItem = document.querySelector(`.variant-dropdown-item[data-variant-id="${variantId}"]`);
    if (variantItem && selectedVariantTitle) {
      selectedVariantTitle.textContent = variantItem.textContent;
    }

    // Update swatch in dropdown
    const selectedSwatchInDropdown = document.getElementById('selected-swatch');
    if (selectedSwatchInDropdown && variantItem) {
      selectedSwatchInDropdown.style.setProperty('--swatch-color', variantItem.dataset.hexCode);
      selectedSwatchInDropdown.style.setProperty('--swatch-bkg', `url('${variantItem.dataset.hexImg}')`);
    }
  }

  // Handle variant selection
  function updateVariantSelection(selectedVariantId) {
    const selectedVariant = window.productPageData.productVariants.find(variant => variant.id == selectedVariantId);
    if (selectedVariant) {
     
      updateProductDetails(selectedVariant);
      updateSliderImages(selectedVariant);
    } else {
     
      // Fallback to first variant if selected variant is not found
      const fallbackVariant = window.productPageData.productVariants[0];
      
      updateProductDetails(fallbackVariant);
      updateSliderImages(fallbackVariant);
    }
  }

  // Initialize the product with the correct initial variant
  function initializeProduct() {
    const productVariants = window.productPageData.productVariants;
    let initialVariant;

    // Check if any variant is available for purchase
    const availableVariant = productVariants.find(variant => variant.available);

    if (availableVariant) {
      // If an available variant exists, use it
      initialVariant = availableVariant;
    } else {
      // If no variants are available, use the first variant
      initialVariant = productVariants[0];
    }

    // Update the hidden input with the selected variant ID
    const hiddenInput = productForm.querySelector('input[name="id"]');
    hiddenInput.value = initialVariant.id;

    // Update product details and slider images
    updateProductDetails(initialVariant);
    updateSliderImages(initialVariant);
  }

  // Initialize everything
  initializeSwiper();
  initializeProduct();

  // Event listeners for variant selection
  variantSelector.addEventListener('click', (event) => {
    const swatchIcon = event.target.closest('.swatch-icon');
    if (swatchIcon) {
      const variantId = swatchIcon.dataset.variantId;
      updateVariantSelection(variantId);
    }
  });

  // Custom dropdown functionality
  customDropdown.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });

  document.querySelectorAll('.variant-dropdown-item').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      const variantId = item.dataset.variantId;
      updateVariantSelection(variantId);
      dropdownMenu.classList.remove('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!customDropdown.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });

  // Quantity selector functionality
  const decrementBtn = document.querySelector('.decrement-qty');
  const incrementBtn = document.querySelector('.increment-qty');

  function updateQuantityInput() {
    // Ensure the quantity input in the form is updated
    const formQuantityInput = productForm.querySelector('input[name="quantity"]');
    if (formQuantityInput) {
      formQuantityInput.value = quantityInput.value;
    } else {
      // If the quantity input doesn't exist in the form, create it
      const newQuantityInput = document.createElement('input');
      newQuantityInput.type = 'hidden';
      newQuantityInput.name = 'quantity';
      newQuantityInput.value = quantityInput.value;
      productForm.appendChild(newQuantityInput);
    }
   
  }

  if (incrementBtn && quantityInput) {
    incrementBtn.addEventListener('click', (event) => {
      event.preventDefault();
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateQuantityInput();
    });
  }

  if (decrementBtn && quantityInput) {
    decrementBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateQuantityInput();
      }
    });
  }

  // Handle form submission
  if (productForm) {
    productForm.addEventListener('submit', (event) => {
      // Ensure the quantity is correctly set before submission
      updateQuantityInput();
     
      // Allow the form to submit normally
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
    const dropdownMenu = document.querySelector('.variant-dropdown-menu');
    const customVariantDropdown = document.querySelector('.custom-variant-dropdown');

    if (dropdownMenu && customVariantDropdown) {
        // Function to update the class based on the presence of 'show'
        const updateClass = () => {
            if (dropdownMenu.classList.contains('show')) {
                customVariantDropdown.classList.add('active');
            } else {
                customVariantDropdown.classList.remove('active');
            }
        };

        // Initial check in case 'show' is already there
        updateClass();

        // Set up a MutationObserver to watch for changes to the dropdownMenu's class attribute
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                updateClass();
            });
        });

        // Observe changes to the class attribute of dropdownMenu
        observer.observe(dropdownMenu, { attributes: true, attributeFilter: ['class'] });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('site-header');
    const productImage = document.getElementById('product-main-image');
    const mdBreakpoint = 768; // Tailwind's default md breakpoint

    function updateStickyPosition() {
      // Force a reflow to ensure we get the latest header height
      header.style.display = 'none';
      header.offsetHeight; // Trigger reflow
      header.style.display = '';

      // Now get the accurate header height
      const headerHeight = header.offsetHeight;
      
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--sticky-top-position', `calc(${headerHeight}px + 1rem)`);
      
      if (window.innerWidth >= mdBreakpoint) {
        productImage.style.position = 'sticky';
        productImage.style.top = `var(--sticky-top-position)`;
      } else {
        productImage.style.position = '';
        productImage.style.top = '';
      }
    }

    // Debounce function to limit how often updateStickyPosition is called
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Create a debounced version of updateStickyPosition
    const debouncedUpdateStickyPosition = debounce(updateStickyPosition, 250);

    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver(debouncedUpdateStickyPosition);

    // Start observing the header
    resizeObserver.observe(header);
    
    // Update on load
    updateStickyPosition();
    
    // Update on window resize (for handling viewport width changes)
    window.addEventListener('resize', debouncedUpdateStickyPosition);

    // Clean up the observer when the page is unloaded
    window.addEventListener('unload', () => {
      resizeObserver.disconnect();
    });
  });
  
function initVariantDescriptionUpdater() {
  const variantSkuElement = document.querySelector('.variant-sku');
  
  if (!variantSkuElement) return;
  
  // Function to update descriptions
  function updateDescriptions() {
    const currentSku = variantSkuElement.textContent.trim();
    
    // Hide all descriptions
    document.querySelectorAll('.description').forEach(desc => {
      desc.style.display = 'none';
    });
    
    // Show matching description
    const matchingDesc = document.querySelector(`[data-var-sku-id="${currentSku}"]`);
    if (matchingDesc) {
      matchingDesc.style.display = 'block';
    }
  }
  
  // Initial update
  updateDescriptions();
  
  // Watch for changes to the variant-sku element
  const observer = new MutationObserver(updateDescriptions);
  observer.observe(variantSkuElement, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initVariantDescriptionUpdater);