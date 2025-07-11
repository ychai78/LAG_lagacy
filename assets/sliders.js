function initHomepageSlider() {
 // This initiates the image slider on homepage.      
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






