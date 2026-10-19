preloaderInit();
function preloaderInit() {
  var bodyElement = document.querySelector('body');
  var preloader = document.querySelector('.preloader');

  function removePreloader() {
    if (preloader !== null) {
      preloader.classList.add('loaded');
      setTimeout(function() {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 900);
    }
  }

  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    removePreloader();
  });

  // Wait for all resources to be loaded
  window.onload = function() {
    removePreloader();
  };
}