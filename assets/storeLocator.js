 function initStoreLocator() {
// This loads the page for store locator .  
  $(".main-content").removeClass( "site-wrap" );
  $( "button#storemapper-filter" ).click(function() {
    $( "ul#storemapper-filter-drop-down" ).addClass("active");
  });
  
  $(window).load(function(){
    $("button#storemapper-filter").text(function () {
    return $(this).text().replace("Filter", " Filter by Store Type "); 
    });
    
    $( "<span class='caret'></span>" ).appendTo( "button#storemapper-filter" );
    $( "button#storemapper-filter" ).css( "opacity", "1" );
    $( ".storemapper-powered-by" ).remove();
    $("#rite-aid-store").insertAfter( "button#storemapper-go" );
    $("#rite-aid-store").css( "opacity","1" );
    

   });  
} 