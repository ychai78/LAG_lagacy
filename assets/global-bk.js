
(function() {
    /**
     * This function handles lazy loading and fade-in effects for elements.
     * 
     * @param {NodeList} elements - The elements to observe.
     * @param {Function} callback - The callback to execute after all elements are in view.
     */
    function handleIntersectingElements(elements, callback) {
        if (elements.length) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (entry.target.dataset.lazyLoad === "true") {
                            if (entry.target.dataset.src) {
                                if (entry.target.tagName === 'IMG') {
                                    entry.target.src = entry.target.dataset.src;
                                } else {
                                    fetch(entry.target.dataset.src)
                                        .then(response => response.text())
                                        .then(data => {
                                            entry.target.innerHTML = data;
                                        });
                                }
                            }
                        }
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });

                if (elements.length === entries.length) {
                    callback();
                }
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

    // Infinite scrolling event listener
    document.addEventListener('DOMContentLoaded', function() {
        var nextPageLink = document.getElementById('NextPageLink');
        var loadingSpinner = document.getElementById('LoadingSpinner');
        var productsGrid = document.querySelector('.products-grid');
        var pagination = document.getElementById('Pagination');
        var sentinel = document.getElementById('Sentinel');

        var isLoading = false;

        function loadNextPage() {
            if (isLoading || !nextPageLink) return;

            isLoading = true;
            loadingSpinner.style.display = 'block';

            fetch(nextPageLink.href)
                .then(function(response) {
                    return response.text();
                })
                .then(function(html) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');

                    var newProducts = doc.querySelectorAll('.products-grid .card');
                    var newPagination = doc.querySelector('#Pagination');
                    var newNextPageLink = doc.getElementById('NextPageLink');

                    newProducts.forEach(function(product) {
                        product.dataset.transitionEnabled = 'true';
                        product.dataset.scrollTransition = 'fade';
                        productsGrid.appendChild(product);
                    });

                    pagination.innerHTML = newPagination.innerHTML;
                    nextPageLink = newNextPageLink;

                    isLoading = false;
                    loadingSpinner.style.display = 'none';

                    // Trigger the intersection observer for the newly added products
                    handleIntersectingElements(newProducts, function() {
                        // Initialize Slick slider for the newly added products
                        initSlickSlider($('.products-grid'));
                    });

                    // Re-observe the sentinel element if there's a next page
                    if (nextPageLink && sentinel) {
                        observer.observe(sentinel);
                    }
                })
                .catch(function(error) {
                    console.log('Error:', error);
                    isLoading = false;
                    loadingSpinner.style.display = 'none';
                });
        }

        // IntersectionObserver to load next page when sentinel is in view
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    observer.unobserve(sentinel); // Stop observing until new content is loaded
                    loadNextPage();
                }
            });
        }, {
            root: null,
            rootMargin: window.innerWidth <= 600 ? '200px' : '800px',
            threshold: 0
        });

        if (sentinel) {
            observer.observe(sentinel);
        }

        // Hide the pagination component when the page loads
        if (pagination) {
            //pagination.style.display = 'none';
        }

        function checkPagination() {
            var cards = document.querySelectorAll('.card-selector');
            var paginationThreshold = 50;

            if (loadingSpinner) {
                if (cards.length < paginationThreshold) {
                    loadingSpinner.style.display = 'none';
                } else {
                    loadingSpinner.style.display = 'flex';
                }
            }
        }

        checkPagination();
    });

    // Lazy loading and fade-in effect event listener
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

        // Update title
        const title = event.currentTarget.getAttribute('data-title');
        this.updateTitle(title, productCard);
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
        cardMedia.src = `${variantImage}?width=1024`;

        // Generate srcset
        const widths = [320, 640, 960, 1280, 1600, 1920, 2048];
        const srcsetValues = widths.map(width => `${variantImage}?width=${width} ${width}w`).join(', ');

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
            if (!selectedVariant) {
                selectedVariant = variantLabels[0];
            }

            if (selectedVariant) {
                selectedVariant.classList.add('active');
                this.updateVariantStatuses(selectedVariant, productCard);
                this.updateMedia(selectedVariant, productCard);
                const title = selectedVariant.getAttribute('data-title');
                this.updateTitle(title, productCard);
            }
        });
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
  document.querySelectorAll('.shade-categories-slider').forEach(slider => {
    new ShadeCategoriesSlider();
  });
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


/**
document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll('.responsive-image__wrapper img');
  
  function removeBlur(img) {
    const wrapper = img.closest('.responsive-image__wrapper');
    if (wrapper) {
      wrapper.style.filter = 'none';
      wrapper.style.backgroundImage = 'none'; // Remove the background image
    }
  }

  images.forEach((img) => {
    if (img.complete) {
      // Image is already loaded (might be cached or eagerly loaded)
      removeBlur(img);
    } else {
      // Image is still loading
      img.addEventListener('load', function() {
        removeBlur(img);
      });
    }

    // Add error handling
    img.addEventListener('error', function() {
      console.error('Failed to load image:', img.src);
      // Optionally, you can still remove the blur or handle the error differently
      removeBlur(img);
    });
  });
});



/**
 * This script sets a CSS custom property (--height--header) with the height of the site header
 * when the window width is less than 1024px. It adds event listeners for DOMContentLoaded, load,
 * and resize events to dynamically update the property. If the window width is 1024px or larger,
 * the custom property is removed and the resize event listener is detached to optimize performance.

(() => {
  const getHeaderHeight = () => {
    return document.querySelector(".site__header")?.offsetHeight || 0;
  };

  const setHeaderHeightProperty = () => {
    if (window.innerWidth < 1024) {
      document.body.style.setProperty("--height--header", `${getHeaderHeight()}px`);
    } else {
      document.body.style.removeProperty("--height--header");
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setHeaderHeightProperty();
      window.addEventListener("resize", setHeaderHeightProperty);
    } else {
      document.body.style.removeProperty("--height--header");
      window.removeEventListener("resize", setHeaderHeightProperty);
    }
  };

  window.addEventListener("DOMContentLoaded", handleResize);
  window.addEventListener("load", handleResize);
  window.addEventListener("resize", handleResize);
})();
 */



/**
 * Lazy Load Images using Intersection Observer API
 *
 * This script observes images with the data attribute `data-class="LazyLoad"`.
 * When an image enters the viewport, the script loads the actual image URL 
 * from the `data-src` and `data-srcset` attributes, replacing the placeholder.
 * If the browser does not support Intersection Observer, it loads all images immediately.
 */
/*
document.addEventListener("DOMContentLoaded", function() {
    let lazyImages = [].slice.call(document.querySelectorAll("img[data-class='LazyLoad']"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                    }
                    lazyImage.removeAttribute("data-class");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that do not support IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            if (lazyImage.dataset.srcset) {
                lazyImage.srcset = lazyImage.dataset.srcset;
            }
            lazyImage.removeAttribute("data-class");
        });
    }
});
*/
/*
// use lazy-loader in classname to lazyload content
document.addEventListener('DOMContentLoaded', function() {
  const contentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyLoadElement = entry.target;
        const contentElement = lazyLoadElement.querySelector('.lazy-loader-content');

        if (contentElement) {
          // Simulate content loading delay
          setTimeout(() => {
            contentElement.classList.add('loaded');
            lazyLoadElement.querySelector('.placeholder').style.display = 'none';
          }, 1000);
        }

        contentObserver.unobserve(lazyLoadElement);
      }
    });
  }, {
    root: null,
    threshold: 0,
    rootMargin: '100px'
  });

  const lazyLoadContent = document.querySelectorAll('[class*="lazy-loader"]');
  lazyLoadContent.forEach((element) => {
    // Create placeholder div
    const placeholderDiv = document.createElement('div');
    placeholderDiv.classList.add('placeholder');
    placeholderDiv.innerHTML = 'Loading...'; // Add your desired placeholder content

    // Create lazy-loader-content div
    const lazyLoadContentDiv = document.createElement('div');
    lazyLoadContentDiv.classList.add('lazy-loader-content');
    lazyLoadContentDiv.innerHTML = element.innerHTML; // Move the existing content inside the lazy-loader-content div

    // Clear the original content
    element.innerHTML = '';

    // Append the placeholder and lazy-loader-content divs to the original element
    element.appendChild(placeholderDiv);
    element.appendChild(lazyLoadContentDiv);

    contentObserver.observe(element);
  });
});

*/