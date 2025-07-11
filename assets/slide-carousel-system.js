// slide-carousel-system.js
 
function initializeCarousel(carouselId) {
  const thumb = document.querySelector(`#${carouselId} .slide-carousel-system__scrollbar-thumb`);
  const carouselWrapper = document.querySelector(`#${carouselId} .slide-carousel-system__wrapper`);
  const trendCarousel = document.getElementById(carouselId);

  let trackWidth = document.querySelector(`#${carouselId} .slide-carousel-system__scrollbar-track`).offsetWidth;
  let isDragging = false;
  let initialThumbPosition = 0;

  function updateThumbPosition() {
    const lastScrollPosition = (thumb.offsetLeft / trackWidth) * 100;
    trackWidth = document.querySelector(`#${carouselId} .slide-carousel-system__scrollbar-track`).offsetWidth;
    const newThumbPosition = (lastScrollPosition / 100) * trackWidth;
    thumb.style.left = `${newThumbPosition}px`;
    thumb.setAttribute('data-percent', lastScrollPosition);
  }

  function handleDragStart(e) {
    isDragging = true;
    thumb.style.cursor = 'grabbing';
    thumb.setAttribute('data-cursor', 'grabbing');
    initialThumbPosition = thumb.offsetLeft - e.clientX;
  }

  function handleDragMove(e) {
    if (isDragging) {
      const thumbWidth = thumb.offsetWidth;
      const maxThumbPosition = trackWidth - thumbWidth;
      let thumbPosition = e.clientX + initialThumbPosition;
      thumbPosition = Math.min(maxThumbPosition, Math.max(0, thumbPosition));
      thumb.style.left = `${thumbPosition}px`;

      const scrollPercentage = (thumbPosition / maxThumbPosition) * 100;
      const carouselScrollPosition = (scrollPercentage / 100) * (carouselWrapper.scrollWidth - trendCarousel.offsetWidth);
      carouselWrapper.scrollLeft = carouselScrollPosition;

      carouselWrapper.offsetWidth;
      thumb.setAttribute('data-percent', scrollPercentage);
    }
  }

  function handleDragEnd() {
    isDragging = false;
    thumb.style.cursor = 'grab';
    thumb.setAttribute('data-cursor', 'grab');
  }

  thumb.addEventListener('mousedown', handleDragStart);
  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', handleDragEnd);

  thumb.addEventListener('touchstart', (e) => {
    handleDragStart(e.touches[0]);
  });

  document.addEventListener('touchmove', (e) => {
    handleDragMove(e.touches[0]);
  });

  document.addEventListener('touchend', handleDragEnd);

  carouselWrapper.addEventListener('scroll', () => {
    const maxThumbPosition = trackWidth - thumb.offsetWidth;
    const scrollPercentage = (carouselWrapper.scrollLeft / (carouselWrapper.scrollWidth - trendCarousel.offsetWidth)) * 100;
    const thumbPosition = (scrollPercentage / 100) * maxThumbPosition;
    thumb.style.left = `${thumbPosition}px`;
    thumb.setAttribute('data-percent', scrollPercentage);
  });

  window.addEventListener('resize', updateThumbPosition);

  // Initial calculation
  updateThumbPosition();
}

// Look for elements with the class 'slide-carousel-system' and initialize the carousel for each
document.addEventListener('DOMContentLoaded', function () {
  const elementsToInit = document.querySelectorAll('.slide-carousel-system');
  elementsToInit.forEach(function (element) {
    initializeCarousel(element.id);
  });
});