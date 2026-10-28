/* Cupunapa site: the top bar turns cream after scrolling (and while the menu is open); the store button
   appears next to the logo after scrolling; the three-lines menu opens and closes. No tracking, no outside calls. */
(function () {
  var bar = document.getElementById('topbar');
  var btn = document.getElementById('menu-btn');
  var panel = document.getElementById('site-menu');
  if (!bar) return;
  var alwaysSolid = document.body.hasAttribute('data-solid');   // the privacy page keeps a cream bar

  function update() {
    var scrolled = (window.pageYOffset || document.documentElement.scrollTop) > 24;
    var open = btn && btn.getAttribute('aria-expanded') === 'true';
    bar.classList.toggle('scrolled', scrolled);
    bar.classList.toggle('solid', alwaysSolid || scrolled || open);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  if (!btn || !panel) return;
  function setOpen(open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    panel.hidden = !open;
    update();
  }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (btn.getAttribute('aria-expanded') === 'true' && !panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
})();

/* Hero: make the text column exactly as wide as its longest line, so the gap to the phone is a true 1 cm (the CSS box is otherwise a little wider than the words). Re-measured when the window or fonts change. No effect on phone-sized screens. */
(function () {
  var t = document.querySelector('.hero-text');
  if (!t) return;
  function fit() {
    t.style.width = '';
    if (window.matchMedia('(max-width: 920px)').matches) return;
    var max = 0;
    t.querySelectorAll('p').forEach(function (p) {
      var r = document.createRange(); r.selectNodeContents(p);
      Array.prototype.forEach.call(r.getClientRects(), function (b) { if (b.width > max) max = b.width; });
    });
    var row = t.querySelector('.hero-title-row');
    if (row) max = Math.max(max, row.getBoundingClientRect().width);
    if (max > 0) t.style.width = Math.ceil(max) + 1 + 'px';
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  var hero = document.querySelector('.hero');
  if (hero && window.ResizeObserver) new ResizeObserver(fit).observe(hero);   // fires whenever the first screen changes size
})();
