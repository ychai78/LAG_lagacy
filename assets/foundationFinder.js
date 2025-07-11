function initLoadFoundationFinder() {

  //var dataURL=  "https://cdn.shopify.com/s/files/1/0944/0398/files/foundationFinderData_20220622_4.json?v=1656027277";  
  var dataURL=  "https://cdn.shopify.com/s/files/1/0944/0398/files/foundationFinderData_20210810_1_2.json?v=1628616154";
  $.get( dataURL, function( data ) {
           var HTML = '';
               for (var i = 0; i < data.length; i++) {
                   value = data[i];
                   HTML += '<div class="foundation-element '
                   +value.Undertone+ ' ' 
                   +value.Shade+ ' '
                   +'" data-product="'+value.PageHandle
                   +'" data-undertone="'+value.Undertone                
                   +'" data-shade="'+value.Shade
                   +'" data-sku="'+value.SKU+'">'
                   +'<div class="hide filter">'+ value.Undertone  +'<br>'
                   +value.Shade +'<br></div>'
                   +'<a href="https://www.lagirlusa.com/products/tinted-foundation?variant='+value.VariantID+'">'
                   +'<div class="shadeimg flex"><img class="f-image foundation-img" src="'+value.modelImg+'"><img class="f-image foundation-img" src="'+value.VariantImage+'"></div>'                   
                   +'<div class="product-info">'
                     + '<div class="p-name">'+ value.Product +'</div>'
                     + '<div class="p-shade">'+ value.SKU +' - ' + value.ShadeName +'</a></div>'
                     + '<div class="p-desc">'+ value.Description +'</div>'                    
                   +'<a class="foundation-btn add" href="https://www.lagirlusa.com/cart/add?id='+value.VariantID+'&quantity=1"><span class="button_foundation">Add to Bag</span></a>'
                   +'<\/div><\/div>';
               }
    $('#shadeSelector-grid').append(HTML);
    initIsotope();
    
  });  
    // init Flickity for slider
    var $carousel = $('.carousel').flickity({
      prevNextButtons: false,
      cellSelector: 'img',
      imagesLoaded: true,
 	  percentPosition: false,
      pageDots: false,initialIndex: 2
    });
    // Flickity instance
    var flkty = $carousel.data('flickity');
    // elements
    var $cellButtonGroup = $('.button-group--cells');
    var $cellButtons = $cellButtonGroup.find('.dot-button');

    // update selected cellButtons
    $carousel.on( 'select.flickity', function() {
      $cellButtons.filter('.is-selected').removeClass('is-selected');
      $cellButtons.eq( flkty.selectedIndex ).addClass('is-selected');
    
      // set image caption using img's alt
      var $caption = $('.caption');
      $caption.text( flkty.selectedElement.alt )
    });
   
  
    // Landing page section.
    $("#foundationStartQuiz").click(function() {
      $(".foundationFinderLanding").hide();
      $(".foundationFinderMain").removeClass("initial");
      $(".foundationFinderMain").css("visibility", "visible");
       topFunction();
 	 });

    // Skintone section. select cell on button click.  This is for clicking on the radio btn on the color slider
    $cellButtonGroup.on( 'click', '.dot-button', function() {
      var index = $(this).index();
      $carousel.flickity( 'select', index );
      var selectedSlide = index+1;
     //selectedSlide is the current slide on the color range.  Below are the options to trigger. 
      switch (selectedSlide) {
      case 1:
         $("#btn-shade-light").click();
        break;
      case 2:
         $("#btn-shade-light-medium").click();
        break;
      case 3:
         $("#btn-shade-medium").click();
        break;
      case 4:
         $("#btn-shade-medium-deep").click();
        break;
      case 5:
         $("#btn-shade-deep").click();
    }   
    });
 // Skintone Section. Click on Next Btn
  $("#next-btn-skintone").click(function() {
    var selectedSlider = selectedSlider =$(".foundation-shade-slider").find(".is-selected").attr( "data-selection" );
    if(selectedSlider == 1){
      $("#btn-shade-light").click();}
    else if(selectedSlider == 2){
      $("#btn-shade-light-medium").click();}
    else if(selectedSlider == 3){
      $("#btn-shade-medium").click();}
    else if(selectedSlider == 4){
      $("#btn-shade-medium-deep").click();}
    else if(selectedSlider == 5){
      $("#btn-shade-deep").click();}
    

    $("#skintone").removeClass("active");
    $("#jewelry").addClass("active");   
    $(".steps.jewelry").addClass("active");  
        topFunction();
});

  // Jewelry Section. Click on Next Btn
    $("#jewelry .foundation-btn").click(function() {
    $("#jewelry").removeClass("active");
    $("#veinColor").addClass("active");  
    $(".steps.veinColor").addClass("active");    
     topFunction();  
});

  // veincolor Section. Click on Next Btn
    $("#veinColor .foundation-btn").click(function() {
    $("#veinColor").removeClass("active");
    $("#undertone").addClass("active"); 
    $(".steps.undertone").addClass("active"); 
       topFunction();
});
      
  
  // undertone section.  Click on selected undertone to trigger product update.
  $("a.foundation-btn.cool").click(function() {
    $("#btn-undertone-cool").click(); 
     updateFoundationProductResults();
     $("#undertone").removeClass("active");
     $("#match").addClass("active");
     $(".steps.myMatch").addClass("active");   
  });
  $("a.foundation-btn.neutral").click(function() {
    $("#btn-undertone-neutral").click(); 
     updateFoundationProductResults();
     $("#undertone").removeClass("active");
     $("#match").addClass("active");  
     $(".steps.myMatch").addClass("active");     
  });
  $("a.foundation-btn.warm").click(function() {
    $("#btn-undertone-warm").click(); 
    updateFoundationProductResults();
     $("#undertone").removeClass("active");
     $("#match").addClass("active"); 
     $(".steps.myMatch").addClass("active");     
  });
  

 function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
} 
  
  function updateFoundationProductResults() {
    topFunction();
    setTimeout(function() {
        $(".foundation-element").not(":visible").each(function(){
    	$(this).remove();
        });     
    $(".foundation-element").each(function(){
        $(this).addClass('result');
        $(this).removeAttr('style');
        });
      //copy all the elements in the grid and put them in the result div
$("div#shadeSelector-grid").children().clone().appendTo("#foundationFinder_results");

      var filterCount = $('.filter-count').text();  //get the number of foundation to display
      $("#foundationFinder_results").addClass("results-"+filterCount);
      $("#foundationFinder_results").css("visibility", "visible");      
/*     
 $("div#shadeSelector-grid").removeAttr('style');
    $("div#shadeSelector-grid").removeAttr('style');
    $("div#shadeSelector-grid").addClass('result'); 
    $("div#shadeSelector-grid").appendTo(".results")
    $("#shadeSelector-grid").css("visibility", "visible");
      $("#shadeSelector-grid").css("height", "auto");
      */
      
      }, 500);   
  
  }

//create an array to store the selected options
  var finalSelection =[];
  var finalConcealers =[];

    $( "#finder-btn-finish button" ).on( "click", function() {
      
      //use setTimeout to give time for the filter to update
      setTimeout(function() {
        $(".foundation-element:visible").each(function(){
          finalSelection.push($(this).attr("data-sku"));
          finalConcealers.push($(this).attr("data-concealer"));
        });
       
 	  $(".result-output").text(finalSelection);
        

    //output the result onto screen        
    $.each(finalSelection, function(index, value) {
    $("#"+value+".ff-product-grid-shade-finder").css("display","block");

    });
    $.each(finalConcealers, function(index, value) {
    $("#"+value+".finder").css("display","block");

    });

     //clear the array
      finalSelection =[];        
        
      }, 500);
      
    });
  
  
}
