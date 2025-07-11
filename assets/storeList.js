function initStoreList() {
// This loads the page for store listings .  
    var pageURL = window.location.href.split('#')[0];  //get page url and remove any characters after #
    var dataURL="";
    if (pageURL == "https://www.lagirlusa.com/pages/haute-heat-cvs-stores"){
      dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/haute_haute_heat_list_v1.json?10075";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/gel-polish-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/CVS_nail_polish_skinny_tower_v3.json?10261";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/fierce-and-wild-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Fierce_and_Wild_list_v1.json?10452";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/born-exclusive-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Born_Exclusive_list_v1.json?10460";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/pro-eyeshadow-palette-target-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Pro_Palette_Target_store_list_2.json";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/pro-eyeshadow-palette-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Pro_Palette_CVS_store_list.json?11164";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/pro-eyeshadow-palette-ulta-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Pro_Palette_ULTA_store_list.json?11190";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/neon-gel-polish-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Neon_Polish_CVS_store_list_2.json?11356";
    }    
    if (pageURL == "https://www.lagirlusa.com/pages/now-available-at-target"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Pro_Palette_Target_store_list_2.json";
    }      
    if (pageURL == "https://www.lagirlusa.com/pages/gel-extreme-shine-color-pop-polish-h-e-b-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Gel_ColorPop_HEB_store_list.json?v=1592334970";
    } 
    if (pageURL == "https://www.lagirlusa.com/pages/break-free-eyeshadow-palettes-ulta-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/Break_free_ULTA_store_list.json?v=1597781320";
    } 
    if (pageURL == "https://www.lagirlusa.com/pages/gel-glow-polish-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/glow_gel_CVS_store_list.json?v=1633389135";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/lip-oil-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/lip_oil_CVS_store_list.json?v=1637023120";
    }
    if (pageURL == "https://www.lagirlusa.com/pages/2022-gel-glow-polish-cvs-store-list"){
    dataURL="https://cdn.shopify.com/s/files/1/0944/0398/files/glow_gel_CVS_store_list_2022.json?v=1662075310";
    }

  $.get( dataURL, function( data ) {
           
           var HTML_stateList = '';
           var STATENAME="";
               for (var i = 0; i < data.length; i++) {
                   value = data[i];
                   
                // show state header for every new state
                 if(STATENAME!= abbrState(value.state, 'name'))
                 {
                    var StateNameTrim = abbrState(value.state, 'name').replace(/\s+/g, "");
                    HTML_stateList += '<div class="state" data-stateid="#'+StateNameTrim+'">'+abbrState(value.state, 'name')+'</div>'
                 }
                  
                   STATENAME = abbrState(value.state, 'name');
               }
     		 $('#state-list-grid').append(HTML_stateList);
      
      
      
      	   var HTML = '';
 
//https://www.google.com/maps/place/130+Alamo+Plaza+Alamo+CA
      
               for (var i = 0; i < data.length; i++) {
                   value = data[i];
                   
                // show state header for every new state
                 if(STATENAME!= abbrState(value.state, 'name'))
                 {
                   var StateNameTrim = abbrState(value.state, 'name').replace(/\s+/g, "");
                    HTML += '<a class="storeByState-anchor" id="'+StateNameTrim+'"></a><a class="storeByState">'+abbrState(value.state, 'name')+'</a>'
                 }
                 if(value.phone  == null)
                 {
                   value.phone ="";
                 }
                 if(value.zipcode  == null)
                 {
                   value.zipcode ="";
                 }
                 
                   HTML +='<div class="storelisting grid-row'
                   +'" data-storename="'+value.title
                   +'" data-address="'+value.address
                   +'" data-city="'+value.city
                   +'" data-state="'+value.state
                   +'" data-zipcode="'+value.zipcode
                   +'" data-phone="'+value.phone+'">'
                   
                   +'<a class="store-info" target="_blank" href="https://www.google.com/maps/place/'+value.address+"+"+value.city+"+"+value.state+'">'
                   +'<ul class="store-info">'
                  // +'<li class="state">'+value.state+'</li>'
                  // +'<li class="zip">'+value.zipcode+'</li>'
                   +'<li class="city">'+value.city+'</li>'
                   +'<li class="address">'
                   		+'<span class="address">'+value.address+",</span> "
                   		+'<span class="city">'+value.city+",</span> "
                   		+'<span class="state">'+value.state+" </span> "
                     	+'<span class="zipcode">'+value.zipcode+"</span> "
                   		+'<span class="phone">'+value.phone+"</span> "
                   +'</li>'
                   +'<li class="phone">'+value.phone+'</li>'
                   +'<\/ul></a><\/div>';
                   STATENAME = abbrState(value.state, 'name');
               }
     $('#storelisting-grid').append(HTML);


    });

    
  //once everything is loaded, reveal the page   
 $('#storelisting-grid').removeClass("hide");  

  
(function($) {
  $('a[href*=#]:not([href=#])').click(function() 
  {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        || location.hostname == this.hostname) 
    {
      
      var target = $(this.hash),
      headerHeight = $(".site-header").height() + 5; // Get fixed header height
            
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
              
      if (target.length) 
      {
        $('html,body').animate({
          scrollTop: target.offset().top - headerHeight
        }, 500);
        return false;
      }
    }
  });
})(jQuery);
 scrollToState();   
  
}
function scrollToState()  {  
  $( window ).on( "load", function() {
    $('.state').click(function() {
    var selectedState = $( this ).attr("data-stateid");
      
    $('html, body').animate({
        scrollTop: $(selectedState).offset().top - 150
    }, 0);

    
    });
});  
  

} 
function abbrState(input, to){

// USAGE:
// abbrState('ny', 'name');
// --> 'New York'
// abbrState('New York', 'abbr');
// --> 'NY'     
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
} 