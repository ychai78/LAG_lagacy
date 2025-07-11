
(function() {
    /**
     * This function handles fade-in effects for elements.
     * 
     * @param {NodeList} elements - The elements to observe.
     * @param {Function} callback - The callback to execute after all elements are in view.
     */ 
    function handleIntersectingElements(elements, callback) {
        if (elements.length) {
            let elementsLeftToObserve = elements.length;
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                        elementsLeftToObserve--;
                        if (elementsLeftToObserve === 0) {
                            callback();
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: "0px",
                threshold: 0.28
            });

            elements.forEach(function(element) {
                if (element.dataset.transitionEnabled === "true") {
                    observer.observe(element);
                    element.classList.add('fade-in');
                }
            });
        } else {
            callback();
        }
    }

    // Fade-in effect event listener
    document.addEventListener('DOMContentLoaded', function() {
        handleIntersectingElements(
            document.querySelectorAll('[data-transition-enabled="true"][data-scroll-transition="fade"]'),
            function() {
                initSlickSlider($('.products-grid'));
            }
        );
    });
})();


// Function to play the video
function playVideo() {
        // Get the video element within the lightbox content
        var video = document.querySelector('.lity-opened video');
        
        // Check if video element exists
        if (video) {
            console.log('Video element found:', video);
            
            // Start playing the video
            video.play();
        } else {
            console.log('Video element not found.');
        }
    }
function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}    
// Add event listener to a common ancestor element
document.addEventListener('click', function(event) {
        // Check if the clicked element is an <a> tag with data-lity attribute
        if (event.target.matches('a[data-lity]')) {
            // After a short delay to allow the lightbox to open, play the video
            setTimeout(playVideo, 500);
        }
});

// ----- Function to check for touch capability
  const isTouchDevice = () => {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  };

  // Select all elements that should be hidden on touch devices
  const touchHiddenElements = document.querySelectorAll('.hide-on-touch');
  
  // Hide elements if it's a touch device
  if (isTouchDevice()) {
    touchHiddenElements.forEach(element => {
      element.style.display = 'none';
    });
  }
// ----- end Function to check for touch capability


class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector('.slider-counter--current');
    this.pageTotalElement = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button.sliderbtn-prev'); // Updated selector
    this.nextButton = this.querySelector('button.sliderbtn-next'); // Updated selector
    this.sliderStep = parseInt(this.dataset.sliderStep) || 1; // Get the slider step from the data attribute
    this.paginationElement = this.querySelector('.slider-pagination');
    
    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));    
    this.createPagination();
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter((element) => element.clientWidth > 0);
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  createPagination() {
    if (!this.paginationElement) return;

    this.paginationElement.innerHTML = '';

    const totalDots = Math.ceil(this.sliderItemsToShow.length / this.slidesPerPage);

    for (let i = 0; i < totalDots; i++) {
      const paginationDot = document.createElement('div');
      paginationDot.classList.add('pagination-dot');
      if (i === 0) paginationDot.classList.add('active');
      paginationDot.addEventListener('click', () => {
        this.setSlidePosition(i * this.slidesPerPage * this.sliderItemOffset);
      });
      this.paginationElement.appendChild(paginationDot);
    }
  }

  update() {
    // Temporarily prevents unneeded updates resulting from variant changes
    // This should be refactored as part of https://github.com/Shopify/dawn/issues/2057
    if (!this.slider || !this.nextButton) return;

    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(
        new CustomEvent('slideChanged', {
          detail: {
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        })
      );
    }

    if (this.enableSliderLooping) return;

    // Disable buttons if on the first or last slide
    if (this.currentPage === 1) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }

    if (this.paginationElement) {
      const paginationDots = this.paginationElement.querySelectorAll('.pagination-dot');
      paginationDots.forEach((dot, index) => {
        if (index === Math.floor(this.currentPage / this.slidesPerPage)) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return element.offsetLeft + element.clientWidth <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = this.sliderStep;
    this.slideScrollPosition =
      event.currentTarget.classList.contains('sliderbtn-next')
        ? this.slider.scrollLeft + step * this.sliderItemOffset
        : this.slider.scrollLeft - step * this.sliderItemOffset;
    this.setSlidePosition(this.slideScrollPosition);
  }

  setSlidePosition(position) {
    this.slider.scrollTo({
      left: position,
    });
  }
}

customElements.define('slider-component', SliderComponent);


class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector('.slideshow__slide');
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.announcementBarSlider = this.querySelector('.announcement-bar-slider');
    // Value below should match --duration-announcement-bar CSS value
    this.announcerBarAnimationDelay = this.announcementBarSlider ? 250 : 0;

    this.sliderControlLinksArray = Array.from(this.sliderControlWrapper.querySelectorAll('.slider-counter__link'));
    this.sliderControlLinksArray.forEach((link) => link.addEventListener('click', this.linkToSlide.bind(this)));
    this.slider.addEventListener('scroll', this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.announcementBarSlider) {
      this.announcementBarArrowButtonWasClicked = false;

      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.addEventListener('change', () => {
        if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
      });

      [this.prevButton, this.nextButton].forEach((button) => {
        button.addEventListener(
          'click',
          () => {
            this.announcementBarArrowButtonWasClicked = true;
          },
          { once: true }
        );
      });
    }

    if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
  }

  setAutoPlay() {
    this.autoplaySpeed = this.slider.dataset.speed * 1000;
    this.addEventListener('mouseover', this.focusInHandling.bind(this));
    this.addEventListener('mouseleave', this.focusOutHandling.bind(this));
    this.addEventListener('focusin', this.focusInHandling.bind(this));
    this.addEventListener('focusout', this.focusOutHandling.bind(this));

    if (this.querySelector('.slideshow__autoplay')) {
      this.sliderAutoplayButton = this.querySelector('.slideshow__autoplay');
      this.sliderAutoplayButton.addEventListener('click', this.autoPlayToggle.bind(this));
      this.autoplayButtonIsSetToPlay = true;
      this.play();
    } else {
      this.reducedMotion.matches || this.announcementBarArrowButtonWasClicked ? this.pause() : this.play();
    }
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    this.wasClicked = true;

    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) {
      this.applyAnimationToAnnouncementBar(event.currentTarget.name);
      return;
    }

    if (isFirstSlide && event.currentTarget.name === 'previous') {
      this.slideScrollPosition =
        this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === 'next') {
      this.slideScrollPosition = 0;
    }

    this.setSlidePosition(this.slideScrollPosition);

    this.applyAnimationToAnnouncementBar(event.currentTarget.name);
  }

  setSlidePosition(position) {
    if (this.setPositionTimeout) clearTimeout(this.setPositionTimeout);
    this.setPositionTimeout = setTimeout(() => {
      this.slider.scrollTo({
        left: position,
      });
    }, this.announcerBarAnimationDelay);
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
    this.prevButton.removeAttribute('disabled');

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove('slider-counter__link--active');
      link.removeAttribute('aria-current');
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
    this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
  }

  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
    this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
    this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
  }

  focusOutHandling(event) {
    if (this.sliderAutoplayButton) {
      const focusedOnAutoplayButton =
        event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
      if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
      this.play();
    } else if (!this.reducedMotion.matches && !this.announcementBarArrowButtonWasClicked) {
      this.play();
    }
  }

  focusInHandling(event) {
    if (this.sliderAutoplayButton) {
      const focusedOnAutoplayButton =
        event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
      if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
        this.play();
      } else if (this.autoplayButtonIsSetToPlay) {
        this.pause();
      }
    } else if (this.announcementBarSlider.contains(event.target)) {
      this.pause();
    }
  }

  play() {
    this.slider.setAttribute('aria-live', 'off');
    clearInterval(this.autoplay);
    this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
  }

  pause() {
    this.slider.setAttribute('aria-live', 'polite');
    clearInterval(this.autoplay);
  }

  togglePlayButtonState(pauseAutoplay) {
    if (pauseAutoplay) {
      this.sliderAutoplayButton.classList.add('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.playSlideshow);
    } else {
      this.sliderAutoplayButton.classList.remove('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.pauseSlideshow);
    }
  }

  autoRotateSlides() {
    const slideScrollPosition =
      this.currentPage === this.sliderItems.length ? 0 : this.slider.scrollLeft + this.sliderItemOffset;

    this.setSlidePosition(slideScrollPosition);
    this.applyAnimationToAnnouncementBar();
  }

  setSlideVisibility(event) {
    this.sliderItemsToShow.forEach((item, index) => {
      const linkElements = item.querySelectorAll('a');
      if (index === this.currentPage - 1) {
        if (linkElements.length)
          linkElements.forEach((button) => {
            button.removeAttribute('tabindex');
          });
        item.setAttribute('aria-hidden', 'false');
        item.removeAttribute('tabindex');
      } else {
        if (linkElements.length)
          linkElements.forEach((button) => {
            button.setAttribute('tabindex', '-1');
          });
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });
    this.wasClicked = false;
  }

  applyAnimationToAnnouncementBar(button = 'next') {
    if (!this.announcementBarSlider) return;

    const itemsCount = this.sliderItems.length;
    const increment = button === 'next' ? 1 : -1;

    const currentIndex = this.currentPage - 1;
    let nextIndex = (currentIndex + increment) % itemsCount;
    nextIndex = nextIndex === -1 ? itemsCount - 1 : nextIndex;

    const nextSlide = this.sliderItems[nextIndex];
    const currentSlide = this.sliderItems[currentIndex];

    const animationClassIn = 'announcement-bar-slider--fade-in';
    const animationClassOut = 'announcement-bar-slider--fade-out';

    const isFirstSlide = currentIndex === 0;
    const isLastSlide = currentIndex === itemsCount - 1;

    const shouldMoveNext = (button === 'next' && !isLastSlide) || (button === 'previous' && isFirstSlide);
    const direction = shouldMoveNext ? 'next' : 'previous';

    currentSlide.classList.add(`${animationClassOut}-${direction}`);
    nextSlide.classList.add(`${animationClassIn}-${direction}`);

    setTimeout(() => {
      currentSlide.classList.remove(`${animationClassOut}-${direction}`);
      nextSlide.classList.remove(`${animationClassIn}-${direction}`);
    }, this.announcerBarAnimationDelay * 2);
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(event.currentTarget) + 1 - this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}

customElements.define('slideshow-component', SlideshowComponent);


class DeferredMedia extends HTMLElement {
  
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));

     // Check if the template element exists before accessing it
    const template = this.querySelector('template');
    if (!template) {
      return;
    }
    
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
         
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));


      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
      if (deferredElement.nodeName == 'VIDEO' && deferredElement.getAttribute('autoplay')) {
        // force autoplay for safari
        deferredElement.play();
      }
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

class QuickbuyVariant extends HTMLElement {
    constructor() {
        super();
        const variantLabels = this.querySelectorAll('.product-tile__swatch');
        variantLabels.forEach(variantLabel => {
            variantLabel.addEventListener('click', this.onVariantClick.bind(this));
        });
      
        // Update buttons and title on page load
        this.updateButtonsOnLoad();
        this.updateTitleOnLoad();
    }

    onVariantClick(event) {
        event.preventDefault();
        const productCard = event.currentTarget.closest('.cards__item');
        this.updateCurrentActiveVariant(event.currentTarget);
        this.updateMedia(event.currentTarget, productCard);
        this.updateVariantStatuses(event.currentTarget, productCard);
        this.updatePricing(event.currentTarget, productCard); // Add this line

        // Update title
        const title = event.currentTarget.getAttribute('data-title');
        this.updateTitle(title, productCard);
    }
    // Add this new method to handle price updates
updatePricing(target, productCard) {
        const price = target.getAttribute('data-price');
        const comparePrice = target.getAttribute('data-compare-price');
        const priceWrapper = productCard.querySelector('[data-price-wrapper]');
        
        if (!priceWrapper) return;

        // Clear existing price content
        while (priceWrapper.firstChild) {
            priceWrapper.firstChild.remove();
        }

        const spanWrapper = document.createElement('span');
        spanWrapper.className = 'block h-8';

        if (comparePrice && comparePrice.trim() !== '' && parseFloat(comparePrice.replace(/[^0-9.]/g, '')) > parseFloat(price.replace(/[^0-9.]/g, ''))) {
            // Create and append sale price
            const salePrice = document.createElement('span');
            salePrice.classList.add('text-red-600');
            salePrice.setAttribute('data-product-price', '');
            salePrice.textContent = price;
            spanWrapper.appendChild(salePrice);

            // Create and append compare price
            const comparePriceElement = document.createElement('span');
            comparePriceElement.classList.add('ml-1', 'text-base', 'text-gray-500', 'line-through');
            comparePriceElement.setAttribute('data-compare-price', '');
            comparePriceElement.textContent = comparePrice;
            spanWrapper.appendChild(comparePriceElement);
        } else {
            // Create and append regular price
            const regularPrice = document.createElement('span');
            regularPrice.setAttribute('data-product-price', '');
            regularPrice.textContent = price;
            spanWrapper.appendChild(regularPrice);
        }

        priceWrapper.appendChild(spanWrapper);
    }

    updateButtonsOnLoad() {
        const productCards = document.querySelectorAll('.cards__item');
        productCards.forEach(productCard => {
            const variantLabels = productCard.querySelectorAll('.product-tile__swatch');
            let selectedVariant = null;

            // Find the first available variant
            for (let label of variantLabels) {
                if (this.isVariantAvailable(label)) {
                    selectedVariant = label;
                    break;
                }
            }

            // If no available variant found, select the first one
            if (!selectedVariant && variantLabels.length > 0) {
                selectedVariant = variantLabels[0];
            }

            if (selectedVariant) {
                selectedVariant.classList.add('active');
                this.updateVariantStatuses(selectedVariant, productCard);
                this.updateMedia(selectedVariant, productCard);
                this.updatePricing(selectedVariant, productCard); // Add this line
                const title = selectedVariant.getAttribute('data-title');
                this.updateTitle(title, productCard);
            }
        });
    } 
    updateCurrentActiveVariant(target) {
        const variantLabels = this.querySelectorAll('.product-tile__swatch');
        variantLabels.forEach(label => {
            label.classList.remove('active');
        });
        target.classList.add('active');
    }
    
    updateMedia(target, productCard) {
        const variantImage = target.dataset.variantImage;
        const cardMedia = productCard.querySelector('.card__media .card__image');
    
        if (!cardMedia || !variantImage) return;
    
        // Update the src attribute
        cardMedia.src = variantImage;
    
        // Generate srcset
        const widths = [320, 640, 960, 1280, 1600, 1920, 2048];
    
        // Function to append or replace the width parameter in the URL
        function updateUrlWidth(url, width) {
            // Create a URL object
            const urlObj = new URL(url, window.location.origin);
    
            // Remove existing width parameter if present
            urlObj.searchParams.delete('width');
    
            // Add the new width parameter
            urlObj.searchParams.append('width', width);
    
            return urlObj.href;
        }
    
        const srcsetValues = widths.map(width => {
            const urlWithWidth = updateUrlWidth(variantImage, width);
            return `${urlWithWidth} ${width}w`;
        }).join(', ');
    
        cardMedia.srcset = srcsetValues;
    }

    updateVariantStatuses(target, productCard) {
        const button = productCard.querySelector('.js_AddToCart');
        const submitBtnText = productCard.querySelector('.submit-btn-txt');

        if (!button || !submitBtnText) return;

        const ctaText = target.getAttribute('data-cta-text');
        if (!ctaText) return;

        switch (ctaText) {
            case "Out of Stock":
                button.disabled = true;
                submitBtnText.textContent = "Out of Stock";
                button.setAttribute('data-submit-button-text', 'Out of Stock');
                break;
            case "Learn More":
                button.disabled = true;
                submitBtnText.textContent = "Learn More";
                button.setAttribute('data-submit-button-text', 'Learn More');
                break;
            case "Add to Bag":
                button.disabled = false;
                submitBtnText.textContent = "Add to Bag";
                button.setAttribute('data-submit-button-text', 'Add to Bag');
                break;
            default:
                button.disabled = false;
                submitBtnText.textContent = "Add to Bag";
                button.setAttribute('data-submit-button-text', 'Add to Bag');
                break;
        }
    }

    isVariantAvailable(variantLabel) {
        const ctaText = variantLabel.getAttribute('data-cta-text');
        return ctaText === "Add to Bag";
    }



    updateTitleOnLoad() {
        const productCards = document.querySelectorAll('.cards__item');
        productCards.forEach(productCard => {
            const activeLabel = productCard.querySelector('.product-tile__swatch.active') || productCard.querySelector('.product-tile__swatch');
            if (!activeLabel) return;
            const title = activeLabel.getAttribute('data-title');
            const titleElement = productCard.querySelector('.quickbuy-variant-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
        });
    }

    updateTitle(title, productCard) {
        const titleElement = productCard.querySelector('.quickbuy-variant-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }
}

customElements.define('quickbuy-variant', QuickbuyVariant);

document.addEventListener("DOMContentLoaded", function() {
    const quickbuyVariants = document.querySelectorAll('quickbuy-variant');
    quickbuyVariants.forEach(quickbuyVariant => {
        quickbuyVariant.updateTitleOnLoad();
    });
});



// Add to Cart functionality
(function() {
    function initAddToCart() {
        if (document.querySelectorAll('.js_AddToCart').length > 0) {
            
            // Get all "Add to Bag" buttons
            const addToCartButtons = document.querySelectorAll('.js_AddToCart');
            
            // Add click event listener to each "Add to Bag" button
            addToCartButtons.forEach((button, index) => {
                button.addEventListener('click', function(event) {
                    // Prevent the default button click behavior
                    event.preventDefault();
                    // Get the closest cards__item
                    const cardItem = button.closest('.cards__item');
                    
                    if (cardItem) {
                        
                        // Get the quickbuy-variant within the cards__item
                        const quickbuyVariant = cardItem.querySelector('quickbuy-variant');
                        if (quickbuyVariant) {
                            
                            // Get the active swatch within the quickbuy-variant
                            const activeLabel = quickbuyVariant.querySelector('.product-tile__swatch.active');
                            if (activeLabel) {
                                
                                // Get the necessary attributes
                                const variant_id = activeLabel.getAttribute('data-variant-id');
                                const quantity = "1";
                                
                                // Call the AJAX add to cart function
                                addToCart(variant_id, quantity, button);
                            } else {
                                console.error('No active swatch found');
                            }
                        } else {
                            console.error('No quickbuy-variant found');
                        }
                    } else {
                        console.error('No cards__item found');
                    }
                });
            });
        } 
    }

    function addToCart(variantId, quantity, button) {
        
        // Disable the button and change text while processing
        button.disabled = true;
        const originalText = button.querySelector('.submit-btn-txt').textContent;
        button.querySelector('.submit-btn-txt').textContent = 'Adding...';
        console.log('Button disabled and text changed to "Adding..."');

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    id: variantId,
                    quantity: quantity
                }]
            })
        })
        .then(response => {
            console.log('Fetch response received');
            return response.json();
        })
        .then(data => {
            console.log('Add to cart successful. Response data:', data);
            button.querySelector('.submit-btn-txt').textContent = 'Added to Bag';
        })
        .catch((error) => {
            console.error('Error adding to cart:', error);
            button.querySelector('.submit-btn-txt').textContent = 'Error - Try Again';
        })
        .finally(() => {
            console.log('Add to cart process completed');
            // Re-enable the button after a short delay
            setTimeout(() => {
                button.disabled = false;
                button.querySelector('.submit-btn-txt').textContent = originalText;
                console.log('Button re-enabled and text reset');
            }, 2000);
        });
    }

    // Initialize Add to Cart functionality when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initAddToCart);
})();





class QuicklinksNav extends HTMLElement {
  
  constructor() {
    super();
    


  }

  connectedCallback() {
    // Add event listeners for grabbing and dragging
    let isDragging = false;
    let startX;
    let scrollLeft;

    const menu = this.querySelector('.quicklinks__nav-menu');

    menu.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - menu.offsetLeft;
      scrollLeft = menu.scrollLeft;
    });

    menu.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    menu.addEventListener('mouseup', () => {
      isDragging = false;
    });

    menu.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - menu.offsetLeft;
      const walk = (x - startX) * 3; // Adjust scroll speed if needed
      menu.scrollLeft = scrollLeft - walk;
    });
  }
}

// Define the custom element
customElements.define('quicklinks-nav', QuicklinksNav);


///hide mobile menu search when scrolling
document.addEventListener("DOMContentLoaded", function() {
    var mobileMenuSearch = document.querySelector('.mobile-main-menu-search');
    var lastScrollTop = 0;

    function handleScroll() {
        var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop <= 30) {
            document.body.classList.remove('is-scrolling');
            if (mobileMenuSearch) {
                mobileMenuSearch.style.visibility = 'visible';
                mobileMenuSearch.style.transform = 'translateY(0%)';
            }
        } else {
            document.body.classList.add('is-scrolling');
            if (mobileMenuSearch) {
                mobileMenuSearch.style.visibility = 'hidden';
                mobileMenuSearch.style.transform = 'translateY(-100%)';
            }
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }

    window.addEventListener('scroll', handleScroll);
});

///Search Modal and Drawer Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Search Modal Elements
  const searchModal = document.getElementById('desktop-search-modal');
  const searchBox = document.getElementById('search_box_desktop');
  const searchOpenButton = document.querySelector('.search-open');
  const searchCloseButton = document.getElementById('search-close');

  // Drawer Elements
  const drawerToggle = document.getElementById('mobile-drawer');
  const drawerOverlay = document.querySelector('.backdrop.daisydrawer-overlay');
  const drawerSide = document.querySelector('.daisydrawer-side');

  // Search Modal Functions
  function showSearchModal() {
    searchModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function hideSearchModal() {
    searchModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Drawer Functions
  function toggleDrawerOverlay() {
    if (drawerToggle.checked) {
      drawerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      drawerOverlay.style.zIndex = '500';
      drawerOverlay.style.transitionDelay = '0s';
      document.body.style.overflow = 'hidden';
    } else {
      drawerOverlay.style.backgroundColor = 'transparent';
      drawerOverlay.style.transitionDelay = '0.3s';
      setTimeout(() => {
        if (!drawerToggle.checked) {
          drawerOverlay.style.zIndex = '-1';
        }
      }, 300);
      document.body.style.overflow = '';
    }
  }

  // Search Modal Event Listeners
  searchOpenButton.addEventListener('click', showSearchModal);
  searchCloseButton.addEventListener('click', hideSearchModal);
  searchBox.addEventListener('focus', showSearchModal);

  // Drawer Event Listeners
  drawerToggle.addEventListener('change', toggleDrawerOverlay);

  // Global Click Event Listener
  document.body.addEventListener('click', function(event) {
    const clickedElement = event.target;

    // Handle search modal clicks
    if (searchModal.style.display === 'block' && !searchModal.contains(event.target) && !searchOpenButton.contains(event.target)) {
      hideSearchModal();
    }

    // Handle drawer overlay clicks
    if (clickedElement.matches('.backdrop.daisydrawer-overlay')) {
      drawerToggle.checked = false;
      toggleDrawerOverlay();
    }
  });

  // Prevent propagation for search modal and drawer side
  searchModal.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  drawerSide.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  // Handle search box blur
  searchBox.addEventListener('blur', function(event) {
    setTimeout(() => {
      if (!searchModal.contains(document.activeElement)) {
        hideSearchModal();
      }
    }, 100);
  });
});

class ScrollSlider extends HTMLElement {
  connectedCallback() {
    this.setupSlider();
  }

  setupSlider() {
    const sliderWrapper = this.querySelector('.scroll-slider__wrapper');
    const prevButton = this.querySelector('.scroll-slider__button--prev');
    const nextButton = this.querySelector('.scroll-slider__button--next');

    const checkScrollability = () => {
      const isScrollable = sliderWrapper.scrollWidth > sliderWrapper.clientWidth;
      const isAtStart = sliderWrapper.scrollLeft === 0;
      const isAtEnd = sliderWrapper.scrollLeft + sliderWrapper.clientWidth >= sliderWrapper.scrollWidth - 1;

      prevButton.style.display = isScrollable && !isAtStart ? 'flex' : 'none';
      nextButton.style.display = isScrollable && !isAtEnd ? 'flex' : 'none';
    };

    const scrollSlider = (direction) => {
      const scrollAmount = sliderWrapper.clientWidth / 2;
      sliderWrapper.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    };

    prevButton.addEventListener('click', () => {
      scrollSlider('left');
      setTimeout(checkScrollability, 350);
    });

    nextButton.addEventListener('click', () => {
      scrollSlider('right');
      setTimeout(checkScrollability, 350);
    });

    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    sliderWrapper.addEventListener('scroll', checkScrollability);

    setTimeout(checkScrollability, 100);
  }
}

customElements.define('scroll-slider', ScrollSlider);


class ScrollableList extends HTMLElement {
  constructor() {
    super();
    this.list = this.querySelector('.scrollable-list');
    this.prevButton = this.querySelector('.scroll-button--prev');
    this.nextButton = this.querySelector('.scroll-button--next');
    this.listItems = this.querySelectorAll('.scrollable-list li');
  }

  connectedCallback() {
    this.checkScrollability();
    this.addEventListeners();
  }

  checkScrollability() {
    const isScrollable = this.list.scrollWidth > this.list.clientWidth;
    const isAtStart = this.list.scrollLeft === 0;
    const isAtEnd = this.list.scrollLeft + this.list.clientWidth >= this.list.scrollWidth - 1;
    this.prevButton.style.display = isScrollable && !isAtStart ? 'flex' : 'none';
    this.nextButton.style.display = isScrollable && !isAtEnd ? 'flex' : 'none';
  }

  scrollList(direction) {
    const scrollAmount = this.list.clientWidth / 2;
    this.list.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.checkScrollability(), 350);
  }

  addEventListeners() {
    this.prevButton.addEventListener('click', () => this.scrollList('left'));
    this.nextButton.addEventListener('click', () => this.scrollList('right'));
    window.addEventListener('resize', () => this.checkScrollability());
    this.list.addEventListener('scroll', () => this.checkScrollability());

    // Add click event listener to each list item
    this.listItems.forEach(item => {
      item.addEventListener('click', () => this.toggleActive(item));
    });
  }

  toggleActive(clickedItem) {
    // Remove 'active' class from all items
    this.listItems.forEach(item => item.classList.remove('active'));
    // Add 'active' class to the clicked item
    clickedItem.classList.add('active');
  }
}

customElements.define('scrollable-list', ScrollableList);

// Initialize all scrollable tab lists on the page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('scrollable-list').forEach(list => {
    new ScrollableList();
  });
});

// Initialize all sliders on the page
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ShadeCategoriesSlider === 'function') {
    document.querySelectorAll('.shade-categories-slider').forEach(slider => {
      try {
        new ShadeCategoriesSlider(slider);
      } catch (error) {
       
      }
    });
  } else {
   
  }
});
/**
 * Initializes Slick sliders for product swatches within the specified container.
 */
function initSlickSlider($container) {
    $container.find('.swipe-product-swatch').each(function() {
        var $slickSlider = $(this);
        if (!$slickSlider.hasClass('slick-initialized')) {
            $slickSlider.on('init', function() {
                $(this).removeClass("hidden-visibility");
            });

            $slickSlider.slick({
                dots: false,
                infinite: false,
                slidesToShow: 5,
                slidesToScroll: 1,
                nextArrow: '<div class="slick-button-black-next"></div>',
                prevArrow: '<div class="slick-button-black-prev"></div>'
            });
        }
    });
}

$(document).ready(function() {
    initSlickSlider($('.products-grid'));
});

//feature-slider.liquid
class FeatureSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderWrapper = this.querySelector('.scroll-snap-slider-wrapper');
    this.slider = this.querySelector('.scroll-snap-slider');
    this.prevButtons = this.querySelectorAll('[data-action="prev"]');
    this.nextButtons = this.querySelectorAll('[data-action="next"]');
    this.slideWidth = parseInt(this.getAttribute('data-slide-width')) || 300;
    this.slideGap = parseInt(this.getAttribute('data-slide-gap')) || 20;
    this.scrollBehavior = this.getAttribute('data-scroll-behavior') || 'single';
    this.enableAutoplay = this.getAttribute('data-enable-autoplay') === 'true';
    this.autoplayDuration = parseInt(this.getAttribute('data-autoplay-duration')) || 3000;
    this.autoplayInterval = null;

    // Bind methods to maintain proper 'this' context
    this.handleResize = this.debounce(this.updateButtonStates.bind(this), 250);
  }

  connectedCallback() {
    if (!this.sliderWrapper || !this.slider) {
      console.error('Slider or wrapper element not found');
      return;
    }
    
    this.attachButtonListeners();
    this.setupAutoplay();
    
    // Initial button state update
    this.updateButtonStates();

    // Update button states on scroll and resize
    this.sliderWrapper.addEventListener('scroll', () => this.updateButtonStates());
    window.addEventListener('resize', this.handleResize);

    // Update button states when images load
    const pictures = this.slider.querySelectorAll('picture');
    pictures.forEach(picture => {
      const img = picture.querySelector('img');
      if (img) {
        if (img.complete) {
          this.updateButtonStates();
        } else {
          img.addEventListener('load', () => this.updateButtonStates());
        }
      }
    });
  }

  disconnectedCallback() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize);
    this.stopAutoplay();
  }

  debounce(func, wait) {
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

  getTotalWidth() {
    // Get all slides
    const slides = this.slider.children;
    let totalWidth = 0;

    // Calculate total width including gaps
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideRect = slide.getBoundingClientRect();
      totalWidth += slideRect.width;
      
      // Add gap after each slide except the last one
      if (i < slides.length - 1) {
        totalWidth += this.slideGap;
      }
    }

    return totalWidth;
  }

  scrollSlider(direction) {
    const containerWidth = this.sliderWrapper.clientWidth;
    const fullySlidesVisible = Math.floor(containerWidth / (this.slideWidth + this.slideGap));
    
    let scrollAmount;
    if (this.scrollBehavior === 'single') {
      scrollAmount = direction * (this.slideWidth + this.slideGap);
    } else {
      scrollAmount = direction * fullySlidesVisible * (this.slideWidth + this.slideGap);
    }
    
    const currentScroll = this.sliderWrapper.scrollLeft;
    const newScrollPosition = currentScroll + scrollAmount;

    // Add bounds checking
    const maxScroll = this.getTotalWidth() - this.sliderWrapper.clientWidth;
    const boundedPosition = Math.max(0, Math.min(newScrollPosition, maxScroll));
    
    this.sliderWrapper.scrollTo({
      left: boundedPosition,
      behavior: 'smooth'
    });

    // Update button states after scroll animation
    setTimeout(() => this.updateButtonStates(), 300);
  }

  attachButtonListeners() {
    const handleClick = (direction) => (e) => {
      e.preventDefault();
      this.scrollSlider(direction === 'prev' ? -1 : 1);
    };

    this.prevButtons.forEach(button => {
      button.removeEventListener('click', handleClick('prev'));
      button.addEventListener('click', handleClick('prev'));
    });

    this.nextButtons.forEach(button => {
      button.removeEventListener('click', handleClick('next'));
      button.addEventListener('click', handleClick('next'));
    });
  }

  updateButtonStates() {
    const currentScroll = this.sliderWrapper.scrollLeft;
    const containerWidth = this.sliderWrapper.clientWidth;
    const totalWidth = this.getTotalWidth();
    
    // Add a small buffer (1px) to account for potential rounding
    const isAtStart = currentScroll <= 1;
    const isAtEnd = Math.ceil(currentScroll + containerWidth) >= totalWidth - 1;

    this.prevButtons.forEach(button => {
      button.disabled = isAtStart;
      button.setAttribute('aria-disabled', isAtStart);
      if (isAtStart) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    });

    this.nextButtons.forEach(button => {
      button.disabled = isAtEnd;
      button.setAttribute('aria-disabled', isAtEnd);
      if (isAtEnd) {
        button.classList.add('disabled');
      } else {
        button.classList.remove('disabled');
      }
    });
  }

  setupAutoplay() {
    if (this.enableAutoplay) {
      this.startAutoplay();
      this.sliderWrapper.addEventListener('mouseenter', () => this.stopAutoplay());
      this.sliderWrapper.addEventListener('mouseleave', () => this.startAutoplay());
      
      // Stop autoplay when the page is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAutoplay();
        } else {
          this.startAutoplay();
        }
      });
    }
  }

  startAutoplay() {
    if (this.enableAutoplay && !this.autoplayInterval) {
      this.autoplayInterval = setInterval(() => {
        // Only scroll if there's more content to show
        const containerWidth = this.sliderWrapper.clientWidth;
        const totalWidth = this.getTotalWidth();
        const currentScroll = this.sliderWrapper.scrollLeft;
        
        if (Math.ceil(currentScroll + containerWidth) >= totalWidth - 1) {
          // If at the end, scroll back to start
          this.sliderWrapper.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          this.scrollSlider(1);
        }
      }, this.autoplayDuration);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

customElements.define('feature-slider', FeatureSlider);

document.querySelectorAll('.product_name').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/®/g, '<span class="reg">®</span>');
});