/*
 * Chosen jQuery plugin to add an image to the dropdown items.
 */
(function($) {
    $.fn.chosenImage = function(options) {
        return this.each(function() {
            var $select = $(this);
            var imgMap  = {};

            // 1. Retrieve img-src from data attribute and build object of image sources for each list item.
            $select.find('option').filter(function(){
                return $(this).text();
            }).each(function(i) {
                imgMap[i] = $(this).attr('data-img-src');
            });

            // 2. Execute chosen plugin and get the newly created chosen container.
            $select.chosen(options);
            var $chosen = $select.next('.chosen-container').addClass('chosenImage-container');

            // 3. Style list with image sources.
            $chosen.on('click.chosen, mousedown.chosen, keyup.chosen', function(event){
                $chosen.find('.chosen-results li').each(function() {
                    var imgIndex = $(this).attr('data-option-array-index');
                    var swatch_name1 = $(this).text().replace(/[^A-Za-z0-9\s]-/g, '').replace(/[_\s]/g, '-').replace("&", "").replace("/", "-").replace(/["']/g, "").replace("!", "").replace("--", "-").replace("'", "").toLowerCase();
                    $(this).css(cssObj(imgMap[imgIndex]));
                    let sku = swatch_name1.split('-')[0].toUpperCase();
                    var $label = $('#product-variants').find('label[data-sku="' + sku + '"]');
                  if ($label.length) {
                    var labelStyle = $label.attr('style');
                  } else { var labelStyle = '';}
                  
                  	$(this).attr('data-swatch-option', swatch_name1);
                    if($(this).has( ".dropdown-swatch-color" ).length == 0){
                  	$(this).prepend('<div class="dropdown-swatch-color" data-swatch-color="'+swatch_name1+'" style="'+ labelStyle +'" ></div>');
                    }
               
                });
            });

            // 4. Change image on chosen selected element when form changes.
            $select.change(function() {
                var imgSrc = $select.find('option:selected').attr('data-img-src') || '';
                var swatch_name2 = $select.find('option:selected').val().replace(/[^A-Za-z0-9\s]-/g, '').replace(/[_\s]/g, '-').replace("&", "").replace("/", "-").replace(/["']/g, "").replace("!", "").replace("--", "-").replace("'", "").toLowerCase();
                var selected_swatch_option = $select.find('option:selected').val();
                let sku = swatch_name2.split('-')[0].toUpperCase();
                var $label = $('#product-variants').find('label[data-sku="' + sku + '"]');
                if ($label.length) {
                    var labelStyle = $label.attr('style');
                } else { var labelStyle = '';}  
              
              if ($chosen.parent().find('.product-variants').length >0){ 	//quickview exists in DOM
                 var dropdown_swatch_quickView = $chosen.find('.chosen-single span').text().replace(/[^A-Za-z0-9\s]-/g, '').replace(/[_\s]/g, '-').replace("&", "").replace(/["']/g, "").replace("!", "").replace("--", "-").replace("'", "").toLowerCase();
                  if($chosen.find('.chosen-single').has( ".dropdown-swatch-color" ).length == 0){
                	$chosen.find('.chosen-single').prepend('<div class="dropdown-swatch-color"  data-swatch-color="'+dropdown_swatch_quickView+'" ></div>');
                  }else{
                  $chosen.find('.chosen-single .dropdown-swatch-color').attr("data-swatch-color",dropdown_swatch_quickView);
                }
              }else{  //quickview not in in DOM
                
                $chosen.find('.chosen-single span').css(cssObj(imgSrc));

                if($chosen.find('.chosen-single').has( ".dropdown-swatch-color" ).length == 0){
                  $chosen.find('.chosen-single').prepend('<div class="dropdown-swatch-color"  data-swatch-color="'+swatch_name2+'" style="'+ labelStyle +'" ></div>');
                }else{
                  $chosen.find('.chosen-single .dropdown-swatch-color').attr("data-swatch-color",swatch_name2);
                }
              }
              
               $('#product-add-to-cart').prop('value', 'add to bag');
   			var dataZoomImage = $("#more-view-carousel li").find("a[data-variant='" + selected_swatch_option + "']").attr("data-zoom-image");
 		    $("#product-featured-image").attr("src",dataZoomImage);
   			  
            });
          
            $select.trigger('change');
             


  
          
           
            // Utilties
            function cssObj(imgSrc) {
                var bgImg = (imgSrc) ? 'url(' + imgSrc + ')' : 'none';
                return { 'background-image' : bgImg };
            }
          
   
        });
    };
})(jQuery);
