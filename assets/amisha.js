/* Amisha Masala - scroll reveal + count-up numbers */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var designMode = window.Shopify && window.Shopify.designMode;

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    if (isNaN(end) || reduce) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    var duration = 1800;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(step);
  }

  function init(root) {
    var scope = root || document;
    var items = scope.querySelectorAll('[data-reveal]:not(.is-in)');
    var counters = scope.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window) || designMode) {
      items.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (e) { io.observe(e); });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (e) { cio.observe(e); });
  }

  window.__amReady = true;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
