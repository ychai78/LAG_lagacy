/* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
(function(a){a.fn.prepareTransition=function(){return this.each(function(){var b=a(this);b.one("TransitionEnd webkitTransitionEnd transitionend oTransitionEnd",function(){b.removeClass("is-transitioning")});var c=["transition-duration","-moz-transition-duration","-webkit-transition-duration","-o-transition-duration"];var d=0;a.each(c,function(a,c){d=parseFloat(b.css(c))||d});if(d!=0){b.addClass("is-transitioning");b[0].offsetWidth}})}})(jQuery);

/* replaceUrlParam - http://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery */
function replaceUrlParam(e,r,a){var n=new RegExp("("+r+"=).*?(&|$)"),c=e;return c=e.search(n)>=0?e.replace(n,"$1"+a+"$2"):c+(c.indexOf("?")>0?"&":"?")+r+"="+a};

/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
    If that file is not included, it is redefined here.
==============================================================================*/
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
    var value = '',
        placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
        formatString = (format || this.money_format);

    if (typeof cents == 'string') {
      cents = cents.replace('.','');
    }

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number/100.0).toFixed(precision);

      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}

// Timber functions
window.timber = window.timber || {};

timber.initCache = function () {
  timber.cache = {
    // General
    $html                    : $('html'),
    $body                    : $('body'),

    // Navigation
    $navigation              : $('#AccessibleNav'),
    $mobileSubNavToggle      : $('.mobile-nav__toggle-btn'),

    // Product Page
    $productImage            : $('#ProductPhotoImg'),
    $optionSelector          : $('.single-option-selector'),

    // Customer Pages
    $recoverPasswordLink     : $('#RecoverPassword'),
    $hideRecoverPasswordLink : $('#HideRecoverPasswordLink'),
    $recoverPasswordForm     : $('#RecoverPasswordForm'),
    $customerLoginForm       : $('#CustomerLoginForm'),
    $passwordResetSuccess    : $('#ResetSuccess')
  };
};

timber.init = function () {
  FastClick.attach(document.body);
  timber.initCache();
  timber.accessibleNav();
  timber.drawersInit();
  timber.mobileNavToggle();
  timber.responsiveVideos();
  timber.loginForms();
  timber.setSelectorLabels();
};

timber.accessibleNav = function () {
  var $nav = timber.cache.$navigation,
      $allLinks = $nav.find('a'),
      $topLevel = $nav.children('li').find('a'),
      $parents = $nav.find('.site-nav--has-dropdown'),
      $subMenuLinks = $nav.find('.site-nav__dropdown').find('a'),
      activeClass = 'nav-hover',
      focusClass = 'nav-focus';

  // Mouseenter
  $parents.on('mouseenter touchstart', function(evt) {
    var $el = $(this);

    if (!$el.hasClass(activeClass)) {
      // force stop the click from happening
      evt.preventDefault();
      evt.stopImmediatePropagation();
    }

    showDropdown($el);
  });

  // Mouseout
  $parents.on('mouseleave', function() {
    hideDropdown($(this));
  });

  $subMenuLinks.on('touchstart', function(evt) {
    // Prevent touchstart on body from firing instead of link
    evt.stopImmediatePropagation();
  });

  $allLinks.focus(function() {
    handleFocus($(this));
  });

  $allLinks.blur(function() {
    removeFocus($topLevel);
  });

  // accessibleNav private methods
  function handleFocus ($el) {
    var $subMenu = $el.next('ul'),
        hasSubMenu = $subMenu.hasClass('sub-nav') ? true : false,
        isSubItem = $('.site-nav__dropdown').has($el).length,
        $newFocus = null;

    // Add focus class for top level items, or keep menu shown
    if (!isSubItem) {
      removeFocus($topLevel);
      addFocus($el);
    } else {
      $newFocus = $el.closest('.site-nav--has-dropdown').find('a');
      addFocus($newFocus);
    }
  }

  function showDropdown ($el) {
    $el.addClass(activeClass);

    setTimeout(function() {
      timber.cache.$body.on('touchstart', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown ($el) {
    $el.removeClass(activeClass);
    timber.cache.$body.off('touchstart');
  }

  function addFocus ($el) {
    $el.addClass(focusClass);
  }

  function removeFocus ($el) {
    $el.removeClass(focusClass);
  }
};

timber.drawersInit = function () {
  timber.LeftDrawer = new timber.Drawers('NavDrawer', 'left');
  
};

timber.mobileNavToggle = function () {
  var $toggleBtns = timber.cache.$mobileSubNavToggle;

  // Setup aria attributes
  $toggleBtns.attr('aria-expanded', 'false');
  $toggleBtns.each(function (i, el) {
    var $el = $(el);
    $el.attr('aria-controls', $el.attr('data-aria-controls'));
  });

  $toggleBtns.on('click', function() {
    var $el = $(this);
    var currentlyExpanded = $el.attr('aria-expanded');
    var toggleState = false;

    // Updated aria-expanded value based on state pre-click
    if (currentlyExpanded === 'true') {
      $el.attr('aria-expanded', 'false');
    } else {
      $el.attr('aria-expanded', 'true');
      toggleState = true;
    }

    // Toggle class that expands/collapses sublist
    $el.closest('.mobile-nav__has-sublist').toggleClass('mobile-nav--expanded', toggleState);
  });
};

timber.getHash = function () {
  return window.location.hash;
};

timber.updateHash = function (hash) {
  window.location.hash = '#' + hash;
  $('#' + hash).attr('tabindex', -1).focus();
};

timber.productPage = function (options) {
  var moneyFormat = options.money_format,
      variant = options.variant,
      selector = options.selector;

  // Selectors
  var $productImage = $('#ProductPhotoImg'),
      $addToCart = $('#AddToCart'),
      $productPrice = $('#ProductPrice'),
      $comparePrice = $('#ComparePrice'),
      $priceWrapper = $('.product-single__price--wrapper'),
      $quantityElements = $('.js-quantity-selector, label + .js-qty'),
      $addToCartText = $('#AddToCartText');

  if (variant) {

    // Update variant image, if one is set
    if (variant.featured_image) {
      var newImg = variant.featured_image,
          el = $productImage[0];
      Shopify.Image.switchImage(newImg, el, theme.showVariantImage);
    }

    // Select a valid variant if available
    if (variant.available) {
      // Available, enable the submit button, change text, show quantity elements
      $addToCart.removeClass('disabled').prop('disabled', false);
      $addToCartText.html("Add to cart");
      $quantityElements.show();
    } else {
      // Sold out, disable the submit button, change text, hide quantity elements
      $addToCart.addClass('disabled').prop('disabled', true);
      $addToCartText.html("Sold out");
      $quantityElements.hide();
    }

    $productPrice.html(Shopify.formatMoney(variant.price, moneyFormat).replace(/((\,00)|(\.00))$/g, '')).show();

    // Also update and show the product's compare price if necessary
    if (variant.compare_at_price > variant.price) {
      $comparePrice.html(Shopify.formatMoney(variant.compare_at_price, moneyFormat).replace(/((\,00)|(\.00))$/g, ''));
      $priceWrapper.show();
      $productPrice.addClass('on-sale');
    } else {
      $priceWrapper.hide();
      $productPrice.removeClass('on-sale');
    }

  } else {
    // The variant doesn't exist, disable submit button.
    // This may be an error or notice that a specific variant is not available.
    // To only show available variants, implement linked product options:
    //   - http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    $addToCart.addClass('disabled').prop('disabled', true);
    $addToCartText.html("Unavailable");
    $quantityElements.hide();
  }
};

timber.setSelectorLabels = function () {
  if (timber.cache.$optionSelector.length && timber.cache.$html.hasClass('supports-pointerevents')) {
    timber.cache.$optionSelector.each(function () {
      timber.updateSelectorLabel(null, this);
    });

    timber.cache.$optionSelector.on('change', timber.updateSelectorLabel);
  }
}

timber.updateSelectorLabel = function (evt, element) {
  var $label,
      renderedLabel,
      selectedVariant;

  // set $select based on whether function was called by
  // bound event or not
  var $select = evt ? $(evt.target) : $(element);
  $label = $select.prev('label').find('.dropdown-label--active');
  selectedVariant = $select.find('option:selected').text();
  $label.html(' ' + selectedVariant);
};

timber.responsiveVideos = function () {
  var $iframeVideo = $('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]');
  var $iframeReset = $iframeVideo.add('iframe#admin_bar_iframe');

  $iframeVideo.each(function () {
    // Add wrapper to make video responsive
    $(this).wrap('<div class="video-wrapper"></div>');
  });

  $iframeReset.each(function () {
    // Re-set the src attribute on each iframe after page load
    // for Chrome's "incorrect iFrame content on 'back'" bug.
    // https://code.google.com/p/chromium/issues/detail?id=395791
    // Need to specifically target video and admin bar
    this.src = this.src;
  });
};

timber.loginForms = function () {
  function showRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.show();
    timber.cache.$customerLoginForm.hide();
  }

  function hideRecoverPasswordForm() {
    timber.cache.$recoverPasswordForm.hide();
    timber.cache.$customerLoginForm.show();
  }

  timber.cache.$recoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    showRecoverPasswordForm();
  });

  timber.cache.$hideRecoverPasswordLink.on('click', function(evt) {
    evt.preventDefault();
    hideRecoverPasswordForm();
  });

  // Allow deep linking to recover password form
  if (timber.getHash() == '#recover') {
    showRecoverPasswordForm();
  }
};

timber.resetPasswordSuccess = function () {
  timber.cache.$passwordResetSuccess.show();
};

/*============================================================================
  Drawer modules
  - Docs http://shopify.github.io/Timber/#drawers
==============================================================================*/
timber.Drawers = (function () {
  var Drawer = function (id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.$nodes = {
      parent: $('body, html'),
      page: $('#PageContainer'),
      moved: $('.is-moved-by-drawer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  };

  Drawer.prototype.init = function () {
    var $openBtn = $(this.config.open);

    // Add aria controls
    $openBtn.attr('aria-expanded', 'false');

    $openBtn.on('click', $.proxy(this.open, this));
    this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened drawer
    if (this.drawerIsOpen) {
      return;
    }

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to $nodes.page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$nodes.moved.addClass('is-transitioning');
    this.$drawer.prepareTransition();

    this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
    this.drawerIsOpen = true;

    // Set focus on drawer
    Drawer.prototype.trapFocus(this.$drawer, 'drawer_focus');

    // Run function when draw opens if set
    if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    // Lock scrolling on mobile
    this.$nodes.page.on('touchmove.drawer', function () {
      return false;
    });

    this.$nodes.page.on('click.drawer', $.proxy(function () {
      this.close();
      return false;
    }, this));
  };

  Drawer.prototype.close = function () {
    // don't close a closed drawer
    if (!this.drawerIsOpen) {
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$nodes.moved.prepareTransition({ disableExisting: true });
    this.$drawer.prepareTransition({ disableExisting: true });

    this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);

    this.drawerIsOpen = false;

    // Remove focus on drawer
    Drawer.prototype.removeTrapFocus(this.$drawer, 'drawer_focus');

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.$nodes.page.off('.drawer');
  };

  Drawer.prototype.trapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.attr('tabindex', '-1');

    $container.focus();

    $(document).on(eventName, function (evt) {
      if ($container[0] !== evt.target && !$container.has(evt.target).length) {
        $container.focus();
      }
    });
  };

  Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
    var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';

    $container.removeAttr('tabindex');
    $(document).off(eventName);
  };

  return Drawer;
})();

// Initialize Timber's JS on docready
$(timber.init);
