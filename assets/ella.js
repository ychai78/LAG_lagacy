
(function($) {
  

     
      
    
    
    // Let the document know when the mouse is being used
    document.body.addEventListener('mousedown', function() {
      document.body.classList.add('using-mouse');
    });
    document.body.addEventListener('keydown', function() {
      document.body.classList.remove('using-mouse');
    });
       
      /*

        if ($(".collection-sidebar")) {
            //work only in collection page
            History.Adapter.bind(window, 'statechange', function() {
                var State = History.getState();
                if (!ella.isSidebarAjaxClick) {
                    ella.sidebarParams();
                    var newurl = ella.sidebarCreateUrl();
                    ella.sidebarGetContent(newurl);
                    ella.reActivateSidebar();
                }
                ella.isSidebarAjaxClick = false;
            });
        }
    
        if (window.use_color_swatch) {
    
            $('.swatch :radio').change(function() {
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();
                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');
               $('.single-option-selector').trigger('chosen:updated');
              
                 var optionItemNumber = optionValue.split(" ")[0];
              
             
                  
              //$('#more-view-carousel img[src*='+optionItemNumber+']').parent().trigger('click'); 
             // $('#more-view-carousel img[data-image-variant-title='+optionValue+']').parent().trigger('click'); 
              
            });
    
            // (c) Copyright 2014 Caroline Schnapp. All Rights Reserved. Contact: mllegeorgesand@gmail.com
            // See http://docs.shopify.com/manual/configuration/store-customization/advanced-navigation/linked-product-options
    
            Shopify.optionsMap = {};
    
    
            Shopify.linkOptionSelectors = function(product) {
                // Building our mapping object.
                for (var i = 0; i < product.variants.length; i++) {
                    var variant = product.variants[i];
                    if (variant.available) {
                        // Gathering values for the 1st drop-down.
                        Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
                        Shopify.optionsMap['root'].push(variant.option1);
                        Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
                 
                        // Gathering values for the 2nd drop-down.
                        if (product.options.length > 1) {
                            var key = variant.option1;
                            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                            Shopify.optionsMap[key].push(variant.option2);
                            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
                        }
                        // Gathering values for the 3rd drop-down.
                        if (product.options.length === 3) {
                            var key = variant.option1 + ' / ' + variant.option2;
                            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                            Shopify.optionsMap[key].push(variant.option3);
                            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
                        }
                    }
                }
                // Update options right away.
                Shopify.updateOptionsInSelector(0);
                if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
                if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
                // When there is an update in the first dropdown.
                $(".single-option-selector:eq(0)").change(function() {
                    Shopify.updateOptionsInSelector(1);
                    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
                    return true;
                });
                // When there is an update in the second dropdown.
                $(".single-option-selector:eq(1)").change(function() {
                    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
                    return true;
                });
    
            };
        }
    */
       
      
    $(document).ready(function() {
        // Event delegation for dynamically added elements
        $(document).on('click', '.btn-remove-item', function(event) {
            event.preventDefault();
            var variantId = $(this).data('variant-id');
            Shopify.removeItem(variantId, function(cart) {
                ella.doUpdateDropdownCart(cart);
            });
        });
    
        // Event listener for 'Esc' key to close the drawer
        $(document).keydown(function(event) {
            if (event.key === "Escape") {
                if ($('#cart-drawer').prop('checked')) {
                    $('#cart-drawer').prop('checked', false);
                }
            }
        });
    
        // Event listener for incrementing quantity
        $(document).on('click', '.cart-drawer .increment-qty', function() {
            var variantId = $(this).data('variant-id');
            var quantityInput = $(`.quantity-input[data-variant-id='${variantId}']`);
            var newQty = parseInt(quantityInput.val()) + 1;
            updateCartQuantity(variantId, newQty);
        });
    
        // Event listener for decrementing quantity
        $(document).on('click', '.cart-drawer .decrement-qty', function() {
            var variantId = $(this).data('variant-id');
            var quantityInput = $(`.quantity-input[data-variant-id='${variantId}']`);
            var newQty = Math.max(1, parseInt(quantityInput.val()) - 1); // Ensure quantity doesn't go below 1
            updateCartQuantity(variantId, newQty);
        });
    
        // Event listener for quantity input change
        $(document).on('change', '.cart-drawer .quantity-input', function() {
            var variantId = $(this).data('variant-id');
            var newQty = parseInt($(this).val());
            if (newQty < 1) {
                newQty = 1;
                $(this).val(newQty);
            }
            updateCartQuantity(variantId, newQty);
        });
    
        function updateCartQuantity(variantId, quantity) {
            $.ajax({
                type: 'POST',
                url: '/cart/change.js',
                data: {
                    id: variantId,
                    quantity: quantity
                },
                dataType: 'json',
                success: function(cart) {
                    ella.doUpdateDropdownCart(cart);
                },
                error: function() {
                    alert('Error updating cart.');
                }
            });
        }
    });
    
    
        $(window).resize(function() {
            ella.initMobileMenu();
            //ella.initMobileSidebar();
            //ella.initResizeImage();
        });
    
        $(window).scroll(function() {
            if ($(this).scrollTop() > 200) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
    
        if (!$(".header-mobile").is(":visible")) {
            $(document).on('click touchstart', function(e) {
                var quickview = $(".quick-view");
                var dropdowncart = $("#dropdown-cart");
                var cartpanel = $("#cart-panel");
            
                var cartButton = $(".cartToggle");
                var newsletter = $("#email-modal .modal-window");
                var searchBar = $(".nav-search");
                //close quickview and dropdowncart when clicking outside
                if (!quickview.is(e.target) && quickview.has(e.target).length === 0 && !dropdowncart.is(e.target) && dropdowncart.has(e.target).length === 0 && !cartButton.is(e.target) && cartButton.has(e.target).length === 0 && !newsletter.is(e.target) && newsletter.has(e.target).length === 0 && !searchBar.is(e.target) && searchBar.has(e.target).length === 0) {
                    ella.closeQuickViewPopup();
                    ella.closeDropdownCart();
                    ella.closeEmailModalWindow();
                    ella.closeDropdownSearch();
                }
            });
        }
        var quickview = $(".quick-view");
      
    
    
          //if click is on the black drop area then close the search dropdown
        $('html').click(function (e) {
          if (e.target.id == 'curtain') {
             ella.closeSearchbar();
             
          }
        });
      
    
      $(document).on('keyup',function(evt) {
        if (evt.keyCode == 27) {
          ella.closeQuickViewPopup();
          ella.closeDropdownCart();
          ella.closeDropdownSearch();
         // ella.closeSearchbar();
          ella.closeSignUpPopup();
          clearTimeout(ella.ellaTimeout);
          if ($('.modal').is(':visible')) {
            $('.modal').fadeOut(500);
          }
        }});
    
  function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    }
  });
}  
        var ella = {
            ellaTimeout: null,
            isSidebarAjaxClick: false,
            init: function() {
                this.initSlickSlider();
                //this.initResizeImage();
                //this.initSearchMenu();
                this.initOpenCloseEvents();
                this.initMobileMenu();
                this.initSidebar();
                this.initMobileSidebar();
                this.initMobileleftbar();
                this.initScrollTop();
                this.initQuickView();
                this.initCloudzoom();
                this.initProductMoreview();
                //this.initAddToCart();
                this.initModal();
                this.initProductAddToCart();
                this.initDropDownCart();
                this.initDropdownSearch();
                this.initToggleCollectionPanel();
                
                this.initInfiniteScrolling();
            },
            initSlickSlider: function() {
              //ella.homepageSlider();
              ella.videoSlider();
              ella.trendingSlider();
              ella.swatchSlider();
              ella.shopTheCollectionSlider();
              ella.magazinePageSlider();
         
            },
            homepageSlider: function() {
              // if page is homepage then init slider
              if ($("body").attr("data-page-handle") == "index" || $("body").attr("data-page-handle") == "page.homepage.tester" ){
                
                var $slickSlider = $('#homepage-slider.slick-container');
                
                $slickSlider.on('init', function() {
                  $(this).removeClass("hidden-visibility");
                });
                
                $slickSlider.slick({
                  dots: true,
                  infinite: true,
                  autoplay:false,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  lazyLoad: 'ondemand',
                  prevArrow: '<div id="bxslider-control-prev" class="swiper-button-prev"></div>',
                  nextArrow: '<div id="bxslider-control-next" class="swiper-button-next"></div>',
                  responsive: [
                    {
                      breakpoint: 768,
                      settings: {
                        arrows: false,
    
                      }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                  ]
                });
              }
            },  
            videoSlider: function() {
              // if page is homepage then init slider
              if ($("body").attr("data-page-handle") == "product"  ){
              if ($("#prod-promo-video").length > 0){
                var $slickSlider = $('#video-slider');
                
                $slickSlider.on('init', function() {
                  $(this).removeClass("hidden-visibility");
                });
                
                  $slickSlider.slick({
                dots: false,
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                nextArrow: '<div class="slick-button-next"></div>',
                prevArrow: '<div class="slick-button-prev"></div>',
                responsive: [
    
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      arrows: false,
                      infinite: true,
                      dots: true
    
    
                    }
                  },
                  {
                    breakpoint: 450,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: false,
                      dots: true
    
                    }
                  }
                  // You can unslick at a given breakpoint now by adding:
                  // settings: "unslick"
                  // instead of a settings object
                ]
              });
              }
    
              
              }
            },   
            
            trendingSlider: function() {
              // if page contains trendslider then init slider
              if ($("#trending.slick-container").length > 0) {
                
                var $slickSlider = $('#trending.slick-container');
                
                $slickSlider.on('init', function() {
                  $(this).removeClass("hidden-visibility");
                });
                
                $slickSlider.slick({
                dots: true,
                infinite: false,
                slidesToShow: 5,
                slidesToScroll: 1,
                nextArrow: '<div class="slick-button-next"></div>',
                prevArrow: '<div class="slick-button-prev"></div>',
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 5,
                      slidesToScroll: 5,
                      infinite: true,
                      dots: true
                    }
                  },
                  {
                    breakpoint: 1023,
                    settings: {
                      slidesToShow: 4,
                      slidesToScroll: 4,
                      arrows: false,
    
    
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      arrows: false,
    
                    }
                  }
                  // You can unslick at a given breakpoint now by adding:
                  // settings: "unslick"
                  // instead of a settings object
                ]
              });
              }
            },
            swatchSlider: function() {
              // if page contains trendslider then init slider
              if ($(".swipe-product-swatch").length > 0) {
                
              
    
    
    $('.swipe-product-swatch').each(function(){
    
      var $slickSlider =$(this);
      $slickSlider.on('init', function() {
        $(this).removeClass("hidden-visibility");
      });
    
       $slickSlider.slick({
         dots: false,
         infinite: false,
    
         slidesToShow: 5,
         slidesToScroll: 4,
                nextArrow: '<div class="slick-button-black-next"></div>',
                prevArrow: '<div class="slick-button-black-prev"></div>'  
        });
      });
 
              }
            },      
            shopTheCollectionSlider: function() {
              // if page contains trendslider then init slider
              if ($("#shopTheCollection.slick-container").length > 0) {
                
                var $slickSlider = $('#shopTheCollection.slick-container');
              
                $slickSlider.on('init', function() {
                  $(this).removeClass("hidden-visibility");
                });
                
                $slickSlider.slick({
                dots: true,
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                nextArrow: '<div class="slick-button-next"></div>',
                prevArrow: '<div class="slick-button-prev"></div>',
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 6,
                      slidesToScroll: 6,
                      infinite: true,
                      dots: true
                    }
                  },
                  {
                    breakpoint: 1023,
                    settings: {
                      slidesToShow: 6,
                      slidesToScroll: 6,
                      arrows: false,
    
    
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      arrows: false,
    
                    }
                  }
                  // You can unslick at a given breakpoint now by adding:
                  // settings: "unslick"
                  // instead of a settings object
                ]
              });
              }
            },      
            magazinePageSlider: function() {
              // if page contains trendslider then init slider
              if ($("#magazine.slick-container").length > 0) {
                
                var $slickSlider = $('#magazine.slick-container');
                
                $slickSlider.on('init', function() {
                  $(this).removeClass("hidden-visibility");
                });
                
                $slickSlider.slick({
                dots: true,
                infinite: false,
                slidesToShow: 6,
                slidesToScroll: 6,
                nextArrow: '<div class="slick-button-next"></div>',
                prevArrow: '<div class="slick-button-prev"></div>',
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 6,
                      slidesToScroll: 6,
                      infinite: true,
                      dots: true
                    }
                  },
                  {
                    breakpoint: 1023,
                    settings: {
                      slidesToShow: 6,
                      slidesToScroll: 6,
                      arrows: false,
    
    
                    }
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
                      arrows: false,
    
                    }
                  }
                  // You can unslick at a given breakpoint now by adding:
                  // settings: "unslick"
                  // instead of a settings object
                ]
              });
              }
            },    
    /*
            initSearchMenu: function() {
            $('#search-open').click(function() {

              if( $(".search-menu-bar").hasClass( "active" )){
                ella.closeSearchbar();
              }
              else {
                //ella.openCurtain();
                $(".search-menu-bar").addClass("active");
                
               
    
                $('#search_box_desktop').focus();
              }
            
            });
            $('#search-close').click(function() {
               ella.closeSearchbar();
            });
            },        
         */ 
            openCurtain: function() {
                $('#curtain').addClass("visible");
            },
            closeCurtain: function() {
                $('#curtain').removeClass("visible");
            }, 
          /*
            closeSearchbar: function() {
                //ella.closeCurtain();
                $(".search-menu-bar").removeClass("active");
            
                
            }, 
          */
            initOpenCloseEvents: function() {
                   $(".minicarttotal").on("click", function() {
                                $(".slideRightBar").click();                   
                   }) 
    
                  $(".mobile.cart-close-btn").on("click", function() {
                                $(".slideRightBar").click();                   
                   });
    
                   $(".showLeftPush").on("click", function() {
                                $("#showLeftPush").click();                   
                   });
    
    
                  $('#email-subscribe').click(function() {
                    $(".email-sign-up").toggle();   
                  });
    
                  $(" a#showRecoverPassword").on("click", function() {   
                    $('div#recover_password').slideToggle( "slow", function() {
                      // Animation complete.
                    });
                  }); 
    
                $("#hide-filters").on("click", function() {
                  $(".visible-desktop.refine-sidebar").removeClass("visible-desktop");
                   $(".refine-sidebar").toggle();
                    $(this).toggleClass("show");              
                   });
    
    
    
    
                $(".collapse-menu-header").on("click", function() {
                    $(this).toggleClass("expand");
                    $(this).children('.icon-add').toggleClass("menu-close");
                    $(this).next().slideToggle( "slow" );
                    $(this).next().toggleClass( "dropdown-expand" );
    
                   });
    
                $("#cat-menu").on("click", function() {
                   if ( $('#filter > ul').hasClass( "dropdown-expand" ) ){
                            $('#filter > ul').toggleClass( "dropdown-expand" );
                            $('#filter > ul').slideToggle( "slow" );
    
                   }
                });
              
                if ( $('.refinements-wrapper .filter-link').hasClass( "active" ) ) {
                    $( '#clearFilter' ).removeClass("hide");
                  }
      
            }, 
              
              validateQty: function (qty) {
              if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
                // We have a valid number!
              } else {
                // Not a number. Default to 1.
                qty = 1;
              }
              return qty;
            },  
            sidebarMapTagEvents: function() {
                  $('.sidebar-tag a:not(".clear"), .sidebar-tag label').click(function(e) {
                    var currentTags = [];
                    if (Shopify.queryParams.constraint) {
                        currentTags = Shopify.queryParams.constraint.split('+');
                    }
    
                    //one selection or multi selection
                    if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
                        //remove other selection first
                        var otherTag = $(this).parents('.sidebar-tag').find("input:checked");
                        if (otherTag.length > 0) {
                            var tagName = otherTag.val();
                            if (tagName) {
                                var tagPos = currentTags.indexOf(tagName);
                                if (tagPos >= 0) {
                                    //remove tag
                                    currentTags.splice(tagPos, 1);
                                }
                            }
                        }
                    }
    
                    var tagName = $(this).prev().val();
                    if (tagName) {
                        var tagPos = currentTags.indexOf(tagName);
                        if (tagPos >= 0) {
                            //tag already existed, remove tag
                            currentTags.splice(tagPos, 1);
                        } else {
                            //tag not existed
                            currentTags.push(tagName);
                        }
                    }
                    if (currentTags.length) {
                        Shopify.queryParams.constraint = currentTags.join('+');
                    } else {
                        delete Shopify.queryParams.constraint;
                    }
                    ella.sidebarAjaxClick();
                    e.preventDefault();
                });
            },
            sidebarMapCategories: function() {
                $(".sidebar-links a").click(function(e) {
                    if (!$(this).hasClass('active')) {
                        delete Shopify.queryParams.q;
                        ella.sidebarAjaxClick($(this).attr('href'));
    
                        //activate selected category
                        $(".sidebar-links a.active").removeClass("active");
                        $(this).addClass("active");
                    }
                    e.preventDefault();
                });
            },
            sidebarMapView: function() {
                $(".view-mode a").click(function(e) {
                    if (!$(this).hasClass("active")) {
                        var paging = $(".filter-show > button span").text();
                        if ($(this).hasClass("list")) {
                            Shopify.queryParams.view = "list" + paging;
                        } else {
                            Shopify.queryParams.view = paging;
                        }
    
                        ella.sidebarAjaxClick();
                        $(".view-mode a.active").removeClass("active");
                        $(this).addClass("active");
                    }
                    e.preventDefault();
                });
            },
            sidebarMapShow: function() {
                $(".filter-show a").click(function(e) {
                    if (!$(this).parent().hasClass("active")) {
                        var thisPaging = $(this).attr('href');
    
                        var view = $(".view-mode a.active").attr("href");
                        if (view == "list") {
                            Shopify.queryParams.view = "list" + thisPaging;
                        } else {
                            Shopify.queryParams.view = thisPaging;
                        }
    
                        ella.sidebarAjaxClick();
                        $(".filter-show > button span").text(thisPaging);
                        $(".filter-show li.active").removeClass("active");
                        $(this).parent().addClass("active");
                    }
                    e.preventDefault();
                });
            },
            sidebarInitToggle: function() {
                if ($(".sidebar-tag").length > 0) {
                    $(".sidebar-tag .widget-title span").click(function() {
                        var $title = $(this).parents('.widget-title');
                        if ($title.hasClass('click')) {
                            $title.removeClass('click');
                        } else {
                            $title.addClass('click');
                        }
    
                        $(this).parents(".sidebar-tag").find(".widget-content").slideToggle();
                    });
                }
            },
            sidebarMapSorting: function(e) {
                $(".filter-sortby a").click(function(e) {
                    if (!$(this).parent().hasClass("active")) {
                        Shopify.queryParams.sort_by = $(this).attr("href");
                        ella.sidebarAjaxClick();
                        var sortbyText = $(this).text();
                        $(".filter-sortby > button span").text(sortbyText);
                        $(".filter-sortby li.active").removeClass("active");
                        $(this).parent().addClass("active");
                    }
                    e.preventDefault();
                });
            },
            sidebarMapPaging: function() {
                $(".pagination-page a").click(function(e) {
                    var page = $(this).attr("href").match(/page=\d+/g);
                    if (page) {
                        Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));
                        if (Shopify.queryParams.page) {
                            var newurl = ella.sidebarCreateUrl();
                            ella.isSidebarAjaxClick = true;
                            History.pushState({
                                param: Shopify.queryParams
                            }, newurl, newurl);
                            ella.sidebarGetContent(newurl);
                            //go to top
                            $('body,html').animate({
                                scrollTop: 500
                            }, 600);
                        }
                    }
                    e.preventDefault();
                });
            },
            sidebarMapClearAll: function() {
                //clear all selection
                $('.refined-widgets a.clear-all').click(function(e) {
                    delete Shopify.queryParams.constraint;
                    delete Shopify.queryParams.q;
                    ella.sidebarAjaxClick();
                    e.preventDefault();
                });
            },
            sidebarMapClear: function() {
                $(".sidebar-tag").each(function() {
                    var sidebarTag = $(this);
                    if (sidebarTag.find("input:checked").length > 0) {
                        //has active tag
                        sidebarTag.find(".clear").show().click(function(e) {
                          console.log("im clicked");
                            var currentTags = [];
                            if (Shopify.queryParams.constraint) {
                                currentTags = Shopify.queryParams.constraint.split('+');
                            }
                            sidebarTag.find("input:checked").each(function() {
                                var selectedTag = $(this);
                                var tagName = selectedTag.val();
                                if (tagName) {
                                    var tagPos = currentTags.indexOf(tagName);
                                    if (tagPos >= 0) {
                                        //remove tag
                                        currentTags.splice(tagPos, 1);
                                    }
                                }
                            });
                            if (currentTags.length) {
                                Shopify.queryParams.constraint = currentTags.join('+');
                            } else {
                                delete Shopify.queryParams.constraint;
                            }
                            ella.sidebarAjaxClick();
                            e.preventDefault();
                        });
                    }
                });
            },
            sidebarMapEvents: function() {
                ella.sidebarMapTagEvents();
                ella.sidebarMapCategories();
                ella.sidebarMapView();
                ella.sidebarMapShow();
                ella.sidebarMapSorting();
            },
            reActivateSidebar: function() {
                $(".sidebar-custom .active, .sidebar-links .active").removeClass("active");
                $(".sidebar-tag input:checked").attr("checked", false);
    
                //category
                var cat = location.pathname.match(/\/collections\/(.*)(\?)?/);
                if (cat && cat[1]) {
                    $(".sidebar-links a[href='" + cat[0] + "']").addClass("active");
                }
    
                //view mode and show filter
                if (Shopify.queryParams.view) {
                    $(".view-mode .active").removeClass("active");
                    var view = Shopify.queryParams.view;
                    if (view.indexOf("list") >= 0) {
                        $(".view-mode .list").addClass("active");
                        //paging
                        view = view.replace("list", "");
                    } else {
                        $(".view-mode .grid").addClass("active");
                    }
                    $(".filter-show > button span").text(view);
                    $(".filter-show li.active").removeClass("active");
                    $(".filter-show a[href='" + view + "']").parent().addClass("active");
                }
                ella.initSortby();
            },
            initSortby: function() {
                //sort by filter
                if (Shopify.queryParams.sort_by) {
                    var sortby = Shopify.queryParams.sort_by;
                    var sortbyText = $(".filter-sortby a[href='" + sortby + "']").text();
                    $(".filter-sortby > button span").text(sortbyText);
                    $(".filter-sortby li.active").removeClass("active");
                    $(".filter-sortby a[href='" + sortby + "']").parent().addClass("active");
                }
            },
            sidebarMapData: function(data) {
                var currentList = $(".col-main .products-grid");
                if (currentList.length == 0) {
                    currentList = $(".col-main .product-list");
                }
                var productList = $(data).find(".col-main .products-grid");
                if (productList.length == 0) {
                    productList = $(data).find(".col-main .product-list");
                }
                if (productList.length > 0 && productList.hasClass("products-grid")) {
                    if (window.product_image_resize) {
                        productList.find('img').fakecrop({
                            fill: window.images_size.is_crop,
                            widthSelector: ".products-grid .grid-item .product-image",
                            ratioWrapper: window.images_size
                        });
                    }
                }
                currentList.replaceWith(productList);
                //convert currency
                if (ella.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, jQuery('#currencies').val(), '.col-main span.money', 'money_format');
                }
    
                //replace paging
                if ($(".padding").length > 0) {
                    $(".padding").replaceWith($(data).find(".padding"));
                } else {
                    $(".block-row.col-main").append($(data).find(".padding"));
                }
    
                //replace title & description
                var currentHeader = $(".page-header");
                var dataHeader = $(data).find(".page-header");
                if (currentHeader.find("h2").text() != dataHeader.find("h2").text()) {
                    currentHeader.find("h2").replaceWith(dataHeader.find("h2"));
                    if (currentHeader.find(".rte").length) {
                        if (dataHeader.find(".rte").length) {
                            currentHeader.find(".rte").replaceWith(dataHeader.find(".rte"));
                        } else {
                            currentHeader.find(".rte").hide();
                        }
                    } else {
                        if (dataHeader.find(".rte").length) {
                            currentHeader.find("h2").after(dataHeader.find(".rte"));
                        }
                    }
                }
    
                //replace refined
                $(".refined-widgets").replaceWith($(data).find(".refined-widgets"));
                
                //replace tags
                $(".sidebar-block").replaceWith($(data).find(".sidebar-block"));            
            },
            sidebarCreateUrl: function(baseLink) {
                var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
                if (baseLink) {
                    //location.href = baseLink + "?" + newQuery;
                    if (newQuery != "")
                        return baseLink + "?" + newQuery;
                    else
                        return baseLink;
                }
                return location.pathname + "?" + newQuery;
            },
            sidebarAjaxClick: function(baseLink) {
                delete Shopify.queryParams.page;
                var newurl = ella.sidebarCreateUrl(baseLink);
                ella.isSidebarAjaxClick = true;
                History.pushState({
                    param: Shopify.queryParams
                }, newurl, newurl);
                ella.sidebarGetContent(newurl);
            },
            sidebarGetContent: function(newurl) {
                $.ajax({
                    type: 'get',
                    url: newurl,
                    beforeSend: function() {
                        ella.showLoading();
                    },
                    success: function(data) {
                        ella.sidebarMapData(data);
                        ella.sidebarMapPaging();
                        ella.translateBlock(".main-content");
                        ella.sidebarMapTagEvents();
                        ella.sidebarInitToggle();
                        ella.sidebarMapClear();
                        ella.sidebarMapClearAll();
                        ella.hideLoading();
    
                        ella.initQuickView();
                        ella.initAddToCart();
                       
                        ella.initInfiniteScrolling();
                    },
                    error: function(xhr, text) {
                        ella.hideLoading();
                        $('.loading-modal').hide();
                        $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                        ella.showModal('.ajax-error-modal');
                    }
                });
            },
            sidebarParams: function() {
                Shopify.queryParams = {};
                //get after ?...=> Object {q: "Acme"} 
                if (location.search.length) {
                    for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                        aKeyValue = aCouples[i].split('=');
                        if (aKeyValue.length > 1) {
                            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                        }
                    }
                }
            },
            initMobileSidebar: function() {
              /*
                //if ($(".header-mobile").is(":visible")) {
                $('footer').append("<a class='option-sidebar left' id='displayTextLeft' href='javascript:void(0)' title='Show Sidebar'><span>Show Sidebar</span></a>");
                $('#displayTextLeft').click(
                    function(event) {
                        event.preventDefault();
                        if ($('.sidebar').is(":hidden")) {
                            //jQuery('.col-main').fadeOut(800);
                            $('.sidebar').fadeIn(800);
                            $('body,html').animate({
                                scrollTop: 400
                            }, 600);
                            $('#displayTextLeft').toggleClass('hidden-arrow-left');
                            $('#displayTextLeft').attr('title', 'hide-sidebar');
                            $('#displayTextLeft').html('<span>Hide Sidebar</span>');
                        } else {
                            $('.sidebar').fadeOut(800);
                            $('#displayTextLeft').removeClass('hidden-arrow-left');
                            $('#displayTextLeft').attr('title', 'show-sidebar');
                            $('#displayTextLeft').html('<span>Show Sidebar</span>');
                            //jQuery('.col-main').fadeIn(800);
                        }
                    });
                //}
                */
            },
             initMobileleftbar: function() {
                 $(".flyout").hide();
    
                 $("#showLeftPush").on("click", function() {
                    $(".flyout").toggle(); 
                   var sidemenuHeight = $('#cbp-spmenu-s1').height();
                   $('body').css("height",sidemenuHeight + "px");
                    
              
              
              
                 
                   
                   
                  });
    
                $(".sub-menu").hide();
                $(".more").on("click", function() {
                  $(this).nextAll("ul").slideToggle( "fast" );
                  $("i", this).toggleClass("fa-plus fa-minus");
                });
    
                $('input[type="submit"], input.btn, button').click(function(){ // remove ugly outline on input button click
                  $(this).blur();
                })
    
                $("li.dropdown").hover(function(){
                  $(this).children('.dropdown').show();
                  $(this).children('.dropdown').stop();
                  $(this).children('.dropdown').animate({
                    opacity: 1.0
                  }, 200);
                }, function(){
                  $(this).children('.dropdown').stop();
                  $(this).children('.dropdown').animate({
                    opacity: 0.0
                  }, 400, function(){
                    $(this).hide();
                  });
                });
               
                
    
            },
            initSidebar: function() {
                //if category page then init sidebar
                if ($(".collection-sidebar").length > 0) {
                    ella.sidebarParams();
                    ella.initSortby();
                    ella.sidebarMapEvents();
                    ella.sidebarMapPaging();
                    ella.sidebarInitToggle();
                    ella.sidebarMapClear();
                    ella.sidebarMapClearAll();
                }
            },
            initMobileMenu: function() {
                if ($(".menu-block").is(':visible')) {
                  $(".menu-bar .container").hide();
                    $(".gf-menu-device-container ul.gf-menu li.dropdown").each(function() {
                        if ($(this).find("> p.toogleClick").length == 0) {
                            $(this).prepend('<p class="toogleClick">+</p>');
                        }
                    });
    
                    if ($(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
                        $(".menu-block").children().addClass("gf-menu-device-wrapper");
                    }
                    if ($(".gf-menu-device-container").find("ul.gf-menu").size() == 0) {
                        $(".gf-menu-device-container").append($(".nav-bar .container").html());
                        $(".gf-menu-device-container .site-nav").addClass("gf-menu");
                        $(".gf-menu-device-container .site-nav").removeClass("nav")
                    }
                    $("p.toogleClick").click(function() {
                        if ($(this).hasClass("mobile-toggle-open")) {
                            $(this).next().next().hide();
                            $(this).removeClass("mobile-toggle-open");
                        } else {
                            $(this).next().next().show();
                            $(this).addClass("mobile-toggle-open")
                        }
                    });
                    $("p.toogleClick").show();
                    $("div.gf-menu-toggle").hide();
                    $(".nav-bar .container").hide();
                    if ($("ul.gf-menu").hasClass("clicked") == false) {
                        $(".gf-menu").hide();
                        $(".gf-menu li.dropdown ul.site-nav-dropdown").hide();
                    }
    
    
                    $(".col-1 .inner ul.dropdown").parent().each(function() {
                        if ($(this).find("> p.toogleClick").length == 0) {
                            $(this).prepend('<p class="toogleClick">+</p>');
                        }
                    });
    
                    $(".cbp-spmenu span.icon-dropdown").remove();
    
                    $("ul.gf-menu li.dropdown").each(function() {
                        if ($(this).find("> p.toogleClick").length == 0) {
                            $(this).prepend('<p class="toogleClick">+</p>');
                        }
                    });
    
                    $("p.toogleClick").click(function() {
                        if ($(this).hasClass("mobile-toggle-open")) {
                            $(this).next().next().hide();
                            $(this).removeClass("mobile-toggle-open");
                        } else {
                            $(this).next().next().show();
                            $(this).addClass("mobile-toggle-open");
                        }
                    });
                    $('.header-panel-bottom ul.customer-links').prependTo($('.customer-area .dropdown-menu'));
                   
                } else {
                  $(".menu-bar .container").show();
                    $(".nav-bar .container").hide();
                    $(".gf-menu").hide();
                 
    
                    $('.customer-area ul.customer-links').appendTo($('.header-panel-bottom')).after($('.top-header'));
                }
                if ($(".menu-block").children().hasClass("gf-menu-device-wrapper") == false) {
                    $(".menu-block").children().addClass("resized");
                };
            },

/*
            initResizeImage: function() {
                if (window.product_image_resize) {
                    $('.products-grid .product-image img').fakecrop({
                        fill: window.images_size.is_crop,
                        widthSelector: ".products-grid .grid-item .product-image",
                        ratioWrapper: window.images_size
                    });
                }
            },
            */
            initInfiniteScrolling: function() {
                if ($('.infinite-scrolling').length > 0) {
                    $('.infinite-scrolling a').click(function(e) {
                        e.preventDefault();
                        if (!$(this).hasClass('disabled')) {
                            ella.doInfiniteScrolling();
                        }
                    });
                }
            },
            doInfiniteScrolling: function() {
                var currentList = $('.block-row .products-grid');
                if (!currentList.length) {
                    currentList = $('.block-row .product-list');
                }
                if (currentList) {
                    var showMoreButton = $('.infinite-scrolling a').first();
                    $.ajax({
                        type: 'GET',
                        url: showMoreButton.attr("href"),
                        beforeSend: function() {
                            ella.showLoading();
                            $('.loading-modal').show();
                        },
                        success: function(data) {
                            ella.hideLoading();
                            var products = $(data).find(".block-row .products-grid");
                            if (!products.length) {
                                products = $(data).find(".block-row .product-list");
                            }
                            if (products.length) {
                                if (products.hasClass('products-grid')) {
                                    /*fake crop*/
                                    if (window.product_image_resize) {
                                        products.children().find('img').fakecrop({
                                            fill: window.images_size.is_crop,
                                            widthSelector: ".products-grid .grid-item .product-image",
                                            ratioWrapper: window.images_size
                                        });
                                    }
                                }
    
                                currentList.append(products.children());
                                ella.translateBlock("." + currentList.attr("class"));
                                ella.initQuickView();
                                ella.initAddToCart();
                                
                                //get link of Show more
                                if ($(data).find('.infinite-scrolling').length > 0) {
                                    showMoreButton.attr('href', $(data).find('.infinite-scrolling a').attr('href'));
                                } else {
                                    //no more products
                                    showMoreButton.hide();
                                    showMoreButton.next().show();
                                }
                              
                                  //currency
                                if (window.show_multiple_currencies && window.shop_currency != jQuery("#currencies").val())
                                {
                                    Currency.convertAll(window.shop_currency, jQuery("#currencies").val(), "span.money", "money_format")
                                }
                              
                                //product review
                                if ($(".spr-badge").length > 0) {
                                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                                }
                            }
                        },
                        error: function(xhr, text) {
                            ella.hideLoading();
                            $('.loading-modal').hide();
                            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                            ella.showModal('.ajax-error-modal');
                        },
                        dataType: "html"
                    });
                }
            },
            closeEmailModalWindow: function() {
                if ($('#email-modal').length > 0 && $('#email-modal').is(':visible')) {
                    $('#email-modal .modal-window').fadeOut(600, function() {
                        $('#email-modal .modal-overlay').fadeOut(600, function() {
                            $('#email-modal').hide();
                            $.cookie('emailSubcribeModal', 'closed', {
                                expires: 1,
                                path: '/'
                            });
                        });
                    });
                }
            },
            showModal: function(selector) {
                $(selector).fadeIn(500)
                ella.ellaTimeout = setTimeout(function() {
                    $(selector).fadeOut(500);
                }, 5000);
            },
            initToggleCollectionPanel: function() {
                if ($('.collection-sharing-btn').length > 0) {
                    $('.collection-sharing-btn').click(function() {
                        $('.collection-sharing-panel').toggle();
                        if ($('.collection-sharing-panel').is(':visible')) {
                            $('.collection-sharing-btn').addClass('btn-hover');
                            $('.collection-filter-panel').hide();
                            $('.collection-filter-btn').removeClass('btn-hover');
                        } else {
                            $('.collection-sharing-btn').removeClass('btn-hover');
                        }
                    });
                }
                if ($('.collection-filter-btn').length > 0) {
                    $('.collection-filter-btn').click(function() {
                        $('.collection-filter-panel').toggle();
                        if ($('.collection-filter-panel').is(':visible')) {
                            $('.collection-filter-btn').addClass('btn-hover');
                            $('.collection-sharing-panel').hide();
                            $('.collection-sharing-btn').removeClass('btn-hover');
                        } else {
                            $('.collection-filter-btn').removeClass('btn-hover');
                        }
                    });
                    $('.collection-filter-panel select').change(function(index) {
                        window.location = $(this).find('option:selected').val();
                    });
                }
            },
            checkItemsInDropdownCart: function() {
                if ($('#dropdown-cart .mini-products-list').children().length > 0) {
                    //Has item in dropdown cart
                    $('#dropdown-cart .no-items').hide();
                    $('#dropdown-cart .has-items').show();
                } else {
                    //No item in dropdown cart                
                    $('#dropdown-cart .has-items').hide();
                    $('#dropdown-cart .no-items').show();
                }
            },
            initModal: function() {
                $('.continue-shopping').click(function() {
                    clearTimeout(ella.ellaTimeout);
                    $('.ajax-success-modal').fadeOut(500);
                });
                $('.close-modal, .overlay').click(function() {
                    clearTimeout(ella.ellaTimeout);
                    $('.ajax-success-modal').fadeOut(500);
                });
            },
            initDropDownCart: function() {
              
                if (window.dropdowncart_type == "click") {
                
                    //click type  
                    $('.cartToggle').click(function() {
                        if ($('#dropdown-cart').is(':visible')) {
                            $("#dropdown-cart").slideUp('fast');
                          
                        } else {
                            $("#dropdown-cart").slideDown('fast');
                             
                        }
                    });
                } else {
                    
                  
                  //click type modified.  Opens up the right sidepanel
                  //hover type
                    if (!('ontouchstart' in document)) {
                        $('.cartToggle').click(function() {
                             ella.openRightDrawer();
                        });
                       
                    } else {
                        //mobile
                        $('.cartToggle').click(function() {
                             ella.openRightDrawer();
                        });
                    }
                }
    
                ella.checkItemsInDropdownCart();
    
                $('#dropdown-cart .no-items a').click(function() {
                    $("#dropdown-cart").slideUp('fast');
                });
    
                $('#dropdown-cart .btn-remove').click(function(event) {
                    event.preventDefault();
                    var productId = $(this).parents('.item').attr('id');
                    productId = productId.match(/\d+/g);
                    Shopify.removeItem(productId, function(cart) {
                        ella.doUpdateDropdownCart(cart);
                    });
                });
              
               $('#cart-panel .btn-remove').click(function(event) {
                    event.preventDefault();
                    var productId = $(this).parents('.item').attr('id');
                    productId = productId.match(/\d+/g);
                    Shopify.removeItem(productId, function(cart) {
                        ella.doUpdateDropdownCart(cart);
                    });
                });
              
             
            },
            closeDropdownCart: function() {
                if ($('#dropdown-cart').is(':visible')) {
                    $("#dropdown-cart").slideUp('fast');
                }
            },
            initDropdownSearch: function() {
                $('.nav-search .icon-search').click(function() {
                    if ($('.header-bottom.on .search-bar').is(':visible')) {
                        $('.header-bottom.on .search-bar').slideUp('fast');
                    } else {
                        $('.header-bottom.on .search-bar').slideDown('fast');
                    }
                });
            },
            closeDropdownSearch: function() {
                if ($(".header-bottom.on .search-bar").is(":visible")) {
                    $(".header-bottom.on .search-bar").slideUp("fast")
                }
            },
            initProductMoreview: function() {
                if ($('.more-view-wrapper-owlslider').length > 0) {
                    this.initOwlMoreview();
                } else if ($('.more-view-wrapper-jcarousel').length > 0) {
                    this.initJcarouselMoreview();
                }
            },
            initOwlMoreview: function() {
                $('.more-view-wrapper-owlslider ul').owlCarousel({
                    navigation: true,
                    items: 5,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [768, 3],
                    itemsTabletSmall: [540, 3],
                    itemsMobile: [360, 3]
                }).css('visibility', 'visible');
            },
            initJcarouselMoreview: function() {
                $('.more-view-wrapper-jcarousel ul').jcarousel({
                    vertical: true
                }).css('visibility', 'visible');
                $('.product-img-box').addClass('has-jcarousel');
                $('.more-view-wrapper').css('visibility', 'visible');
            },
            initCloudzoom: function() {
           
                if ($("#product-featured-image").length > 0) {
                    if ($(".visible-phone").is(":visible")) {
                        //mobile display
                        $("#product-featured-image").elevateZoom({
                            gallery: 'more-view-carousel',
                            cursor: 'pointer',
                            galleryActiveClass: 'active',
                            imageCrossfade: false,
                            scrollZoom: false,
                            onImageSwapComplete: function() {
                                $(".zoomWrapper div").hide();
                            },
                            loadingIcon: window.loading_url
                        });
                        $("#product-featured-image").bind("click", function(e) {
                            return false;
                        });
                    } else {
                        $("#product-featured-image").elevateZoom({
                            gallery: 'more-view-carousel',
                            cursor: 'pointer',
                            galleryActiveClass: 'active',
                            imageCrossfade: true,
                            scrollZoom: true,
                            onImageSwapComplete: function() {
                                $(".zoomWrapper div").hide();
                            },
                            loadingIcon: window.loading_url
                        });
    
                        /*   
                        $("#product-featured-image").bind("click", function(e) {
                            var ez = $('#product-featured-image').data('elevateZoom');
                            $.fancybox(ez.getGalleryList());
                            return false;
                        });
                        */
                    }
                }
            },
            initScrollTop: function() {
                $('#back-top').click(function() {
                    $('body,html').animate({
                        scrollTop: 0
                    }, 400);
                    return false;
                });
            },
            initProductAddToCart: function() {
                if ($('#product-add-to-cart').length > 0) {
                    $('#product-add-to-cart').click(function(event) {
                        event.preventDefault();
                        if ($(this).attr('disabled') != 'disabled') {
                            if (!window.ajax_cart) {
                                $(this).closest('form').submit();
                            } else {
                                var variant_id = $('#add-to-cart-form select[name=id]').val();
                                if (!variant_id) {
                                    variant_id = $('#add-to-cart-form input[name=id]').val();
                                }
                                var quantity = $('#add-to-cart-form #quantity').val();
                                if (!quantity) {
                                    quantity = 1;
                                }
                                var title = $('.product-title h2').html();
                                var image = $('#product-featured-image').attr('src');
                                ella.doAjaxAddToCart(variant_id, quantity, title, image);
                            }
                        }
                        return false;
                    });
                }
            },
/*
            initAddToCart: function() {
              if (document.querySelectorAll('.js_AddToCart').length > 0) {
                // Get all "Add to Bag" buttons
                const addToCartButtons = document.querySelectorAll('.js_AddToCart');
                
                // Add click event listener to each "Add to Bag" button
                addToCartButtons.forEach(button => {
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
                          const swatchColor = activeLabel.getAttribute('data-swatch-color');
                          const variant_id = activeLabel.getAttribute('data-variant-id');
                          const quantity = "1";
                          const title = activeLabel.getAttribute('data-sku');
                          const image = activeLabel.getAttribute('data-variant-image');
                          
                          
                          // Call the AJAX add to cart function
                          ella.doAjaxAddToCart(variant_id, quantity, title, image);
                        } 
                      }
                    } 
                  });
                });
              }
            
             const addToCartForm = document.querySelector('form[action="/cart/add"]');
              if (addToCartForm) {
                addToCartForm.addEventListener('submit', function(event) {
                  event.preventDefault();
                  
                  const quantityInput = addToCartForm.querySelector('.quantity-input');
                  const variantIdInput = addToCartForm.querySelector('input[name="id"]');
                  
                 if (quantityInput && variantIdInput) {
                                    const variant_id = variantIdInput.value;
                                    const quantity = quantityInput.value;
                                    const title =
                                        document.querySelector(".product_name")?.textContent || "Product";
                                    const imageElement = document.querySelector(".product-image");
                                    const image = imageElement ? imageElement.src : "";
            
                                    if (typeof ella.doAjaxAddToCart === "function") {
                                        ella.doAjaxAddToCart(variant_id, quantity, title, image);
                                    } else {
                                        console.error("ella.doAjaxAddToCart function not found");
                                    }
                                } else {
                                    console.error("Quantity or variant ID not found");
                                }
                });
              } else {
                console.error('Add to cart form not found');
              }
            
            
              
            },
                      
            initAddToCarts: function() {
              // Function to handle the Add to Cart logic
              function handleAddToCart(event) {
                // Prevent the default button click behavior
                event.preventDefault();
            
                // Get the closest cards__item
                const button = event.target;
                const cardItem = button.closest('.cards__item');
            
                if (cardItem) {
                  // Get the quickbuy-variant within the cards__item
                  const quickbuyVariant = cardItem.querySelector('.variant-carousel');
            
                  if (quickbuyVariant) {
                    // Get the active swatch within the quickbuy-variant
                    const activeLabel = quickbuyVariant.querySelector('.product-tile__swatch.active');
            
                    if (activeLabel) {
                      // Get the necessary attributes
                      const swatchColor = activeLabel.getAttribute('data-swatch-color');
                      const variant_id = activeLabel.getAttribute('data-variant-id');
                      const quantity = "1";
                      const title = activeLabel.getAttribute('data-sku');
                      const image = activeLabel.getAttribute('data-variant-image');
            
                      // Call the AJAX add to cart function
                      ella.doAjaxAddToCart(variant_id, quantity, title, image);
                    }
                  }
                }
              }
            
              // Add global event listener for "Add to Cart" buttons
              addGlobalEventListener("click", ".js_AddToCart", handleAddToCart);
            
              const addToCartForm = document.querySelector('form[action="/cart/add"]');
              if (addToCartForm) {
                addToCartForm.addEventListener('submit', function(event) {
                  event.preventDefault();
            
                  const quantityInput = addToCartForm.querySelector('.quantity-input');
                  const variantIdInput = addToCartForm.querySelector('input[name="id"]');
            
                  if (quantityInput && variantIdInput) {
                    const variant_id = variantIdInput.value;
                    const quantity = quantityInput.value;
                    const title = document.querySelector(".product_name")?.textContent || "Product";
                    const imageElement = document.querySelector(".product-image");
                    const image = imageElement ? imageElement.src : "";
            
                    if (typeof ella.doAjaxAddToCart === "function") {
                      ella.doAjaxAddToCart(variant_id, quantity, title, image);
                    } else {
                      console.error("ella.doAjaxAddToCart function not found");
                    }
                  } else {
                    console.error("Quantity or variant ID not found");
                  }
                });
              } else {
                console.error('Add to cart form not found');
              }
            },          
*/
            openRightDrawer: function() {
              
              document.getElementById('cart-drawer').checked = !document.getElementById('cart-drawer').checked;
     
    
            },
       
            doAjaxAddToCart: function(variant_id, quantity, title, image) {
                $.ajax({
                    type: "post",
                    url: "/cart/add.js",
                    data: 'quantity=' + quantity + '&id=' + variant_id,
                    dataType: 'json',
                    beforeSend: function() {
                        ella.showLoading();
                    },
                    success: function(msg) {
                        ella.hideLoading();           
                        ella.updateDropdownCart();
                       // ella.openRightDrawer();
                          
                    },
                    error: function(xhr, text) {
                        ella.hideLoading();
                        $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                        ella.showModal('.ajax-error-modal');
                    }
                });
            },
         
            updateDropdownCart: function() {
                Shopify.getCart(function(cart) {
                    ella.doUpdateDropdownCart(cart);
                });
            },
            generateCartItemHtml: function(item) {
                var template = `
<div class="cartDrawerItem flex gap-2 rounded-lg border border-gray-200 bg-white p-2 px-4 shadow-sm" sku="{SKU}" data-variant-id="{VARIANT_ID}">
    <div class="cartDrawerItem__img flex flex-col justify-center shrink-0">
        <a href="{URL}" class="relative aspect-square h-20 w-20 bg-white" tabindex="-1">
            <img alt="{TITLE}" class="lazyload h-full w-full object-cover object-center text-transparent transition-opacity" data-src="{IMAGE}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" loading="lazy">
        </a>
    </div>
    <div class="cartDrawerItem__details flex grow">
        <div class="flex grow flex-col items-baseline gap-2 justify-between">
            <a href="{URL}" class="block"><span class="font-bold block text-base text-xs">{PRODUCT_NAME}</span></a>
            <span class="block text-xs font-medium uppercase flex gap-2 items-center">{HEX_LABEL}{ITEM_SHADENAME}</span>
            <div class="flex gap-2">
                <div class="number-stepper flex border rounded font-sans text-[.88rem] font-medium leading-none">
                    <button class="decrement-qty z-10 flex w-8 items-center justify-center" aria-label="Decrement quantity" data-variant-id="{VARIANT_ID}">
                        <svg class="flex-shrink-0 p-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                        </svg>
                    </button>
                    <input type="number" readonly="readonly" tabindex="-1" aria-label="quantity" class="quantity-input w-8 text-center focus:outline-none" value="{QUANTITY}" min="1" data-variant-id="{VARIANT_ID}">
                    <button class="increment-qty z-10 flex w-8 items-center justify-center" aria-label="Increment quantity" data-variant-id="{VARIANT_ID}">
                        <svg class="flex-shrink-0 p-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                        </svg>
                    </button>
                </div>
              <button type="button" aria-label="remove from cart" class="underline">
              <a href="javascript:void(0)" class="btn-remove-item text-right" data-variant-id="{VARIANT_ID}">Remove</a>
            </button>              
            </div>
        </div>
    </div>
    <div class="cartDrawerItem__price flex w-20 flex-col items-end gap-2 shrink-0 justify-between">
        <div class="text-right font-sans font-medium flex-col items-end">
            <span class="block">
                <span>{LINE_TOTAL}</span>
                <p class="text-right text-[.8rem]">
                    <span class="unitPrice">{QUANTITY} x {UNITPRICE}</span>
                </p>
            </span>
            </div>
       </div>
  </div>`;

                var PRODUCT_NAME = item.title.split(" - ")[0];
                var ITEM_SHADENAME = item.variant_title;
                var ITEM_QTY = item.quantity;
                var UNIT_PRICE = Shopify.formatMoney(item.price, window.money_format);
                var LINE_TOTAL = Shopify.formatMoney(item.final_line_price, window.money_format);

                var hexCode = $(`[data-variant-id='${item.variant_id}']`).data('hex-code');
                var hexImage = $(`[data-variant-id='${item.variant_id}']`).data('hex-image');

                var HEX_LABEL = '';
                if (hexCode) {
                    HEX_LABEL = `<label class="product-tile__swatch" style="--swatch-color: ${hexCode};"></label>`;
                } else if (hexImage) {
                    HEX_LABEL = `<label class="product-tile__swatch" style="--swatch-bkg: url('${hexImage}');"></label>`;
                }

                var newItemHtml = template.replace(/\{TITLE\}/g, PRODUCT_NAME)
                                          .replace(/\{ID\}/g, item.id)
                                          .replace(/\{URL\}/g, item.url)
                                          .replace(/\{PRODUCT_NAME\}/g, PRODUCT_NAME)
                                          .replace(/\{ITEM_SHADENAME\}/g, ITEM_SHADENAME)
                                          .replace(/\{QUANTITY\}/g, ITEM_QTY)
                                          .replace(/\{IMAGE\}/g, Shopify.resizeImage(item.image, 'small'))
                                          .replace(/\{LINE_TOTAL\}/g, LINE_TOTAL)
                                          .replace(/\{UNITPRICE\}/g, UNIT_PRICE)
                                          .replace(/\{HEX_LABEL\}/g, HEX_LABEL)
                                          .replace(/\{VARIANT_ID\}/g, item.variant_id);

                return newItemHtml;
            },     
            addItemToCart: function(variantId, quantity) {
                $.ajax({
                    type: 'POST',
                    url: '/cart/add.js',
                    data: {
                        quantity: quantity,
                        id: variantId
                    },
                    dataType: 'json',
                    success: function(item) {
                        console.log("Item added to cart:", item);
                        ella.updateCartDrawer(item);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.error("Error adding item to cart:", textStatus, errorThrown);
                        alert('Error adding item to cart.');
                    }
                });
            },
            updateCartDrawer: function(newItem) {
                // Fetch the current cart
                Shopify.getCart(function(cart) {                  

                    // Check if the new item is already in the cart
                    var existingItem = cart.items.find(function(item) {
                        return item.variant_id === newItem.variant_id;
                    });

                    if (existingItem) {
                        // Update the quantity of the existing item
                        var newQuantity = existingItem.quantity + newItem.quantity;
                        ella.updateCartItemQuantity(existingItem.variant_id, newQuantity);
                    } else {
                        // Add the new item to the cart drawer
                        ella.addNewItemToCartDrawer(newItem);
                    }

                    // Update other parts of the cart drawer
                    ella.updateCartSummary(cart);
                    ella.toggleCartDrawerContent(cart);
                });
            },
            updateCartItemQuantity: function(variantId, quantity) {
                $.ajax({
                    type: 'POST',
                    url: '/cart/change.js',
                    data: {
                        id: variantId,
                        quantity: quantity
                    },
                    dataType: 'json',
                    success: function(cart) {
                        console.log("Cart updated:", cart);
                        ella.doUpdateDropdownCart(cart);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        console.error("Error updating cart item quantity:", textStatus, errorThrown);
                        alert('Error updating cart item quantity.');
                    }
                });
            },
            addNewItemToCartDrawer: function(item) {
                var newItemHtml = ella.generateCartItemHtml(item);
                $('.cartDrawer__cart-items').append(newItemHtml);
            },
            toggleCartDrawerContent: function(cart) {
            if (cart.item_count === 0) {
                $('.cartDrawer__empty-content').show();
                $('.cartDrawer__content').hide();
            } else {
                $('.cartDrawer__empty-content').hide();
                $('.cartDrawer__content').show();
            }
          },
            updateCartSummary: function(cart) {
                // Update cart summary information (e.g., total items, total price, etc.)
                $('.cartDrawer__total-items').text(`(${cart.item_count}) ${cart.item_count > 1 ? 'Items' : 'Item'}`);
                $('.cartCount.indicator-item').text(`${cart.item_count}`);
                $('#dropdown-cart .summary .price').html(Shopify.formatMoney(cart.original_total_price, window.money_format));
                $('.cartDrawer__cart-total--price').html(Shopify.formatMoney(cart.original_total_price, window.money_format));

                var shipping_fee = 1000;
                var min_cart_amount = 3500;
                var grand_total = shipping_fee + cart.original_total_price;
                $('#cart-panel .cart-total dd').html(Shopify.formatMoney(grand_total, window.money_format));

                ella.checkItemsInDropdownCart();
            },
            doUpdateDropdownCart: function(cart) {
                var freeShippingThreshold = 3500; // Free shipping threshold in cents
                var cartTotal = cart.original_total_price;
                var progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100); // Calculate progress percentage
 
                // Show or hide the empty cart message based on item count
                if (cart.item_count > 0 ) {
                   $('.cartDrawer__empty-cart').addClass("hide");
                   $('.cartDrawer__cart').removeClass("hide");
                   
                } else {
                    $('.cartDrawer__empty-cart').addClass("hide");
                    $('.cartDrawer__cart').removeClass("hide");          
                }         
             
                // Update progress bar width
                $('.cartDrawer__progress-bar').css('width', progressPercent + '%');
                
                // Update free shipping message
                if (cartTotal >= freeShippingThreshold) {
                    $('.cartDrawer__free-shipping').html("You qualify for free shipping!");
                } else {
                    var amountNeeded = Shopify.formatMoney(freeShippingThreshold - cartTotal, window.money_format);
                    $('.cartDrawer__free-shipping').html("Add <span class='free-shipping'>" + amountNeeded + "</span> more for free shipping");
                }             
                
                // Clear existing cart items
                $('.cartDrawer__cart-items').html('');

                // Update subtotal and total price
                $('.cartDrawer__cart-total--price').html(Shopify.formatMoney(cart.original_total_price, window.money_format));

              // Update cart summary information (e.g., total items, total price, etc.)
                $('.cartDrawer__total-items').text(`${cart.item_count} ${cart.item_count > 1 ? 'Items' : 'Item'}`);
                $('.cartCount.indicator-item').text(`${cart.item_count}`);

             
                var shipping_fee = 1000;
                var min_cart_amount = 3500;
                var grand_total = shipping_fee + cart.original_total_price;
                $('#cart-panel .cart-total dd').html(Shopify.formatMoney(grand_total, window.money_format));

                // Add each item to the cart drawer
                cart.items.forEach(function(item) {
                    var itemHtml = ella.generateCartItemHtml(item);
                    $('.cartDrawer__cart-items').append(itemHtml);
                });

                ella.checkItemsInDropdownCart();
            },
            checkItemsInDropdownCart: function() {
                if ($('#dropdown-cart .mini-products-list').children().length > 0) {
                    $('#dropdown-cart .no-items').hide();
                    $('#dropdown-cart .has-items').show();
                } else {
                    $('#dropdown-cart .has-items').hide();
                    $('#dropdown-cart .no-items').show();
                }
            },  
          
            showLoading: function() {
                $('.loading-modal').show();
            },
            hideLoading: function() {
                $('.loading-modal').hide();
            },          
            initQuickView: function() {
                $('.quickview-button a').click(function() {
                  var product_handle = $(this).attr('id');
                    Shopify.getProduct(product_handle, function(product) {
                        var template = $('#quickview-template').html();
                        $('.quick-view').html(template);
                        var quickview = $('.quick-view');
    
                        quickview.find('.product_name_h2 a').html(ella.translateText(product.title));
                        quickview.find('.product_name_h2 a').attr('href', product.url);
                        quickview.find('.view-more').attr('href', product.url);

                      
                      if (quickview.find('.product-description').length > 0) {
                            var description = product.description.replace(/(<([^>]+)>)/ig, "");
                            var description = description.replace(/\[countdown\](.*)\[\/countdown\]/g, "");
                            if (window.multi_lang) {
                              if (description.indexOf("[lang2]") > 0) {
                                var descList = description.split("[lang2]");
                                description = descList[translator.current_lang - 1];
                              }
                            }
                            description = description.split(" ").splice(0, 40).join(" ") + "...";
                            quickview.find('.product-description').text(description);
                        } else {
                            quickview.find('.product-description').remove();
                        }
                      
                        quickview.find('.price').html(Shopify.formatMoney(product.price, window.money_format));
                        quickview.find('.product-item').attr('id', 'product-' + product.id);
                        quickview.find('.variants').attr('id', 'product-actions-' + product.id);
                        quickview.find('.variants select').attr('id', 'product-select-' + product.id);
    
                        //if has compare price
                        if (product.compare_at_price > product.price) {
                            quickview.find('.compare-price').html(Shopify.formatMoney(product.compare_at_price_max, window.money_format)).show();
                            quickview.find('.price').addClass('on-sale');
                        } else {
                            quickview.find('.compare-price').html('');
                            quickview.find('.price').removeClass('on-sale');
                        }
                     
                         //out of stock
                        if (!product.available) {
                          /*
                            quickview.find("select, input, .total-price, .dec, .inc, .variants label").remove();
                            quickview.find(".add-to-cart-btn").text(window.inventory_text.unavailable).addClass('disabled').attr("disabled", "disabled");;
                        */
                        } 
                    
                      else {
                            quickview.find('.total-price span').html(Shopify.formatMoney(product.price, window.money_format));
                            if (window.use_color_swatch) {
                                ella.createQuickViewVariantsSwatch(product, quickview);
                            } else {
                               ella.createQuickViewVariants(product, quickview);
                            }
                        }
    
                        //quantity
                        quickview.find(".button").on("click", function() {
                            var oldValue = quickview.find(".quantity").val(),
                                newVal = 1;
                            if ($(this).text() == "+") {
                                newVal = parseInt(oldValue) + 1;
                            } else if (oldValue > 1) {
                                newVal = parseInt(oldValue) - 1;
                            }
                            quickview.find(".quantity").val(newVal);
    
                            if (quickview.find(".total-price").length > 0) {
                                ella.updatePricingQuickview();
                            }
                        });
    
                        if (window.show_multiple_currencies) {
                            Currency.convertAll(window.shop_currency, jQuery('#currencies').val(), 'span.money', 'money_format');
                        }
    
                        ella.loadQuickViewSlider(product, quickview);
                        ella.initQuickviewAddToCart();
                        ella.translateBlock(".quick-view");                    
    
                        $('.quick-view').fadeIn(500);
                        if ($('.quick-view .total-price').length > 0) {
                            $('.quick-view input[name=quantity]').on('change', ella.updatePricingQuickview);
                        }
                    });
    
                    return false;
                });
    
                $('.quick-view .overlay, .close-window').on('click', function() {
                    ella.closeQuickViewPopup();
                    return false;
                });
            },
            updatePricingQuickview: function() {
                //try pattern one before pattern 2
                var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
                var unitPriceTextMatch = $('.quick-view .price').text().match(regex);
    
                if (!unitPriceTextMatch) {
                    regex = /([0-9]+[.|,][0-9]+)/g;
                    unitPriceTextMatch = $('.quick-view .price').text().match(regex);
                }
    
                if (unitPriceTextMatch) {
                    var unitPriceText = unitPriceTextMatch[0];
                    var unitPrice = unitPriceText.replace(/[.|,]/g, '');
                    var quantity = parseInt($('.quick-view input[name=quantity]').val());
                    var totalPrice = unitPrice * quantity;
    
                    var totalPriceText = Shopify.formatMoney(totalPrice, window.money_format);
                    regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;     
                    if (!totalPriceText.match(regex)) {
                       regex = /([0-9]+[.|,][0-9]+)/g;
                    } 
                    totalPriceText = totalPriceText.match(regex)[0];
    
                    var regInput = new RegExp(unitPriceText, "g");
                    var totalPriceHtml = $('.quick-view .price').html().replace(regInput, totalPriceText);
    
                    $('.quick-view .total-price span').html(totalPriceHtml);
                }
            },
            initQuickviewAddToCart: function() {
                if ($('.quick-view .add-to-cart-btn').length > 0) {
                    $('.quick-view .add-to-cart-btn').click(function() {
                        var variant_id = $('.quick-view select[name=id]').val();
                        if (!variant_id) {
                            variant_id = $('.quick-view input[name=id]').val();
                        }
                        var quantity = $('.quick-view input[name=quantity]').val();
                        if (!quantity) {
                            quantity = 1;
                        }
    
                        var title = $('.quick-view .product_name_h2 a').html();
                        var image = $('.quick-view .quickview-featured-image img').attr('src');
                        ella.doAjaxAddToCart(variant_id, quantity, title, image);
                        ella.closeQuickViewPopup();
                    });
                }
            },            
            checkNeedToConvertCurrency: function() {
                return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
            },
            loadQuickViewSlider: function(product, quickviewTemplate) {
                var featuredImage = Shopify.resizeImage(product.featured_image, 'grande');
                quickviewTemplate.find('.quickview-featured-image').append('<a href="' + product.url + '"><img src="' + featuredImage + '" title="' + product.title + '"/><div style="height: 100%; width: 100%; top:0; left:0 z-index: 2000; position: absolute; display: none; background: url(' + window.loading_url + ') 50% 50% no-repeat;"></div></a>');
                if (product.images.length > 2) {
                    var quickViewCarousel = quickviewTemplate.find('.more-view-wrapper ul');
                    for (i in product.images ) {
                        var grande = Shopify.resizeImage(product.images[i], 'grande');
                        var compact = Shopify.resizeImage(product.images[i], 'compact');
                        var item = '<li><a href="javascript:void(0)" data-total= "'+product.images.length+'"data-image="' + grande + '"><img src="' + compact + '"  /></a></li>'
    
                        quickViewCarousel.append(item);
                      
                    }
    
                    quickViewCarousel.find('a').click(function() {
                        var quickViewFeatureImage = quickviewTemplate.find('.quickview-featured-image img');
                        var quickViewFeatureLoading = quickviewTemplate.find('.quickview-featured-image div');
                        if (quickViewFeatureImage.attr('src') != $(this).attr('data-image')) {
                            quickViewFeatureImage.attr('src', $(this).attr('data-image'));
                            quickViewFeatureLoading.show();
                            quickViewFeatureImage.load(function(e) {
                                quickViewFeatureLoading.hide();
                                $(this).unbind('load');
                                quickViewFeatureLoading.hide();
                            });
                        }
                    });
                  
                    if (quickViewCarousel.hasClass("quickview-more-views-owlslider")) {
                        ella.initQuickViewCarousel(quickViewCarousel);
                    } else {
                        ella.initQuickViewVerticalMoreview(quickViewCarousel);
                    }
                } else {
                    quickviewTemplate.find('.quickview-more-views').remove();
                    quickviewTemplate.find('.quickview-more-view-wrapper-jcarousel').remove();
                }
    
            },
            initQuickViewCarousel: function(quickViewCarousel) {
                if (quickViewCarousel) {
                    quickViewCarousel.owlCarousel({
                        navigation: true,
                        items: 5,
                        itemsDesktop: [1199, 4],
                        itemsDesktopSmall: [979, 3],
                        itemsTablet: [768, 3],
                        itemsTabletSmall: [540, 3],
                        itemsMobile: [360, 3]
                    }).css('visibility', 'visible');
                }
              
            },
            initQuickViewVerticalMoreview: function(quickViewCarousel) {
                if (quickViewCarousel) {
                    quickViewCarousel.jcarousel({
                        vertical: true
                    });
                    $('.product-img-box').addClass('has-jcarousel');
                    $('.more-view-wrapper').css('visibility', 'visible');
    
                }
            },
            convertToSlug: function(text) {
                return text
                    .toLowerCase()
                    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
            },
            createQuickViewVariantsSwatch: function(product, quickviewTemplate) {
                if (product.variants.length > 1) { //multiple variants
                    for (var i = 0; i < product.variants.length; i++) {
                        var variant = product.variants[i];
                        var option = '<option value="' + variant.id + '">' + variant.title + '</option>';
                        quickviewTemplate.find('form.variants > select').append(option);
                    }
                    new Shopify.OptionSelectors("product-select-" + product.id, {
                        product: product,
                        onVariantSelected: selectCallbackQuickview
                    });
                    
                   for (var i = 0; i < product.variants.length; i++) {
                        var variant = product.variants[i];
                        var swatch_name = variant.title.replace(/[^A-Za-z0-9\s]-/g, '').replace(/[_\s]/g, '-').replace("--", "-").toLowerCase();
                        var label = '<label for ="swatch-0-' + swatch_name + '" data-swatch-color="' + swatch_name + '" data-value="' + swatch_name +'">';
                        quickviewTemplate.find('.product-variants').append(label);
                    }
                  
                  //create new dropdown selectors for swatch and quantity
                  quickviewTemplate.find('form.variants > .originalDropdown').chosenImage({disable_search:true}); 
                  quickviewTemplate.find('.quantity_changer .quantity_selector').chosenImage({disable_search:true}); 
                  
                  //detect if quickview dropdown has changed and update to the correct image
                  quickviewTemplate.find('form.variants > select').chosen().change(function() {
                    var selectedVarientNo = $(this).parent().find('.dropdown-swatch-color').attr("data-swatch-color").split('-')[0].toUpperCase();
                    $('.jcarousel-item img[src*='+selectedVarientNo+']').parent().trigger('click'); 
                  });
                  
                  //detect if quickview quantity has changed and update to the correct quantity
                  quickviewTemplate.find('.quantity_changer .quantity_selector').last().chosen().change(function() {
                    
                    var quantityValue = $(this).val();
                    $(this).closest('form').last().closest('form').find('input.quantity').attr('value', quantityValue);
                    
                    var unitPrice = (product.price);
                    var totalPrice = (unitPrice * quantityValue/100).toFixed(2);
                    $(this).closest('form').find('.prices .price').text("$ "+totalPrice);
                    
                  });
                  
                
                } else { //single variant
                    quickviewTemplate.find('form.variants > select').remove();
                    var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
                    quickviewTemplate.find('form.variants').append(variant_field);
                }
            },
            createQuickViewVariants: function(product, quickviewTemplate) {
                if (product.variants.length > 1) { //multiple variants
                    for (var i = 0; i < product.variants.length; i++) {
                        var variant = product.variants[i];
                        var option = '<option value="' + variant.id + '">' + variant.title + '</option>';
                        quickviewTemplate.find('form.variants > select').append(option);
                    }
    
                    new Shopify.OptionSelectors("product-select-" + product.id, {
                        product: product,
                        onVariantSelected: selectCallbackQuickview
                    });
                    $('.quick-view .single-option-selector').selectize();
                    $('.quick-view .selectize-input input').attr("disabled", "disabled");
    
                    if (product.options.length == 1) {
                        $('.selector-wrapper:eq(0)').prepend('<label>' + product.options[0].name + '</label>');
                    }
                    quickviewTemplate.find('form.variants .selector-wrapper label').each(function(i, v) {
                        $(this).html(product.options[i].name);
                    });
                } else { //single variant
                    quickviewTemplate.find('form.variants > select').remove();
                    var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
                    quickviewTemplate.find('form.variants').append(variant_field);
                }
    
            },
            closeQuickViewPopup: function() {
                $('.quick-view').fadeOut(500);
            },
           closeSignUpPopup: function() {
                $('.mailmunch-popover').fadeOut(500);
                $('.mailmunch-overlay').fadeOut(500);
            },    
            translateText: function(str) {
              if (!window.multi_lang || str.indexOf("|") < 0)
                return str;
    
              if (window.multi_lang) {
                var textArr = str.split("|");
                if (translator.isLang2())
                  return textArr[1];
                return textArr[0];
              }          
            },
          translateBlock: function(blockSelector) {
              if (window.multi_lang && translator.isLang2()) {
              translator.doTranslate(blockSelector);
            }
          }
        }
    })(jQuery);
    
    
    