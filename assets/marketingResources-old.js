function initLoadMarketingResources() {
 // This loads all the content for marketing resource page .  
 //page.marketing-resources.liquid
 //article.marketing-resources-flyers.liquid
 // grab the json file and create the html block.  
 var pageURL = window.location.href;
//var dataURL= "https://cdn.shopify.com/s/files/1/0944/0398/files/Display_list_sorted_20240424_3.json?v=1714062257";   
//var dataURL= "https://cdn.shopify.com/s/files/1/0944/0398/files/Display_list_sorted_20240514_2.json?v=1715705632";
//var dataURL= "https://cdn.shopify.com/s/files/1/0944/0398/files/Display_list_sorted_20240516.json?v=1715903148";
  var dataURL= "https://cdn.shopify.com/s/files/1/0944/0398/files/Display_list_sorted_20240520_1.json?v=1716223913"; 
  $.get( dataURL, function( data ) {
    var HTML = '';
    for (var i = 0; i < data.length; i++) {
      value = data[i];
      var tag="";
      if(value.calloutTag == "" ){
       tag="hide";       
      }else{tag= value.calloutTag;}
      
      HTML +='<div class="displayListing grid-row display-card'
      +'" data-title="'+value.title
      +'" data-displayNumber="'+value.displayNumber
      +'" data-main-category="'+value.mainCategory
      +'" data-sub-category="'+value.subCategory
      +'" data-productImageUrl="'+value.productImageUrl
      +'" data-callout="'+value.calloutTag
      +'" data-url="'+value.flyerURL
      +'">'
      +'<a class="display-container" target="_blank" href="'+value.flyerURL+'">'
      +'<img class="display-img" src="https://cdn.shopify.com/s/files/1/0944/0398/files/'+value.productImageUrl+'_400x.jpg" >'			   
      +'<div class="display-details">'
      +'<div class="display-number">'+value.displayNumber+'</div>'
      +'<div class="display-name">'+value.title+'</div>'
      +'</div>'
      +'<div class="grid-product__highlight '+tag+'"><img src="https://cdn.shopify.com/s/files/1/0944/0398/files/'+value.calloutTagFileName+'"  alt=new"></div>'
      +'</a><\/div>';
    }
    $('#displayListing-grid').append(HTML);
    });
  
  // when clicked on a link, add active, enable filterable categories. 
  $( ".flyer-categories a" ).click(function() {
    $('.flyer-menu-nav a').removeClass("active");
    $('.flyer-categories a').removeClass("active");
    $(this).addClass("active");
  
    // filter through categories.     
    $('#displayListing-grid').removeClass("hide"); 
    var catagoryID =  $(this).attr( "id" );

    $(".displayListing.grid-row").addClass("hide");  
   
    if( catagoryID == "all"){
      catagoryID =  $(this).closest(".flyer-categories").attr( "id" );
      $('.displayListing.grid-row[data-main-category="' + catagoryID + '"]').removeClass("hide");
    }else if( catagoryID == "new"){
      $('.displayListing.grid-row[data-callout*="' + catagoryID + '"]').removeClass("hide");
    }else{
      $('.displayListing.grid-row[data-sub-category*="' + catagoryID + '"]').removeClass("hide");
    }
   
  });
  
  // click to reset the categories    
  $( "#reset-filter" ).click(function() {
    $('.flyer-menu-nav a').removeClass("active");
    $('.displayListing.grid-row').removeClass("hide");
  });  

  // Get a reference to the search field element
  var searchField = document.getElementById('search-field');

  // Add an event listener to the search field element
  searchField.addEventListener('input', function() {
      // Get the value of the search field
      var searchValue = searchField.value.toLowerCase();
      $('.flyer-categories a').removeClass("active");
      $('.displayListing.grid-row').removeClass("hide");
    
      // Get all of the product elements on the page
      var products = document.getElementsByClassName('display-card');
    
      // Loop through each product element and check if it matches the search value
      for (var i = 0; i < products.length; i++) {
        var productId = products[i].getAttribute('data-displaynumber');
        var productSku = products[i].getAttribute('data-title');
        if (productId.toLowerCase().indexOf(searchValue) > -1 || productSku.toLowerCase().indexOf(searchValue) > -1) {
          products[i].style.display = '';
        } else {
          products[i].style.display = 'none';
        }
      }
    });

  // Add an event listener to the search field element for blur event. Once you leave search, it will reset the search box
  searchField.addEventListener('blur', function() {
  // Reset the search field value
  searchField.value = '';

});


}
function initMarketingResourcesFlyers() {
 // This initiates the js for blog posts-flyers .  
 
  // remove unnecessary content on page. 
 $('section.grid-product__swatch').remove();
 $('.grid-product__title a:empty').closest('.grid__item.grid-product').remove();
  

  // enable the blog side content. 
  if($.trim( $('.article-product').text() ).length != 0){
  $('.blog-side').removeClass("hide");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById("logout_portal");
  
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutDistributorPortal);
  }
});

function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()}; path=/`;
  });
}

function logoutDistributorPortal() {
  deleteAllCookies();
  window.location.href = "/pages/distributor-login";
}

