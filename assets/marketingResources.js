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

