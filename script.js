(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a'));

  function setNav(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setNav(!header.classList.contains('nav-open'));
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { setNav(false); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) {
      setNav(false);
      toggle.focus();
    }
  });

  /* ---------- Scroll progress ---------- */
  var bar = document.getElementById('progress-bar');
  var ticking = false;

  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Scroll spy ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var linksById = {};
  navLinks.forEach(function (link) {
    linksById[link.getAttribute('href').slice(1)] = link;
  });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
        var active = linksById[entry.target.id];
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('in'); });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
