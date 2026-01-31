/**
 * Section navigation, theme (dark/light), and lang button wiring.
 */
(function () {
  const THEME_KEY = 'theme';

  function getTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(function (s) {
      s.classList.toggle('active', s.id === sectionId);
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const id = a.getAttribute('data-section');
      a.removeAttribute('data-active');
      if (id === sectionId) a.setAttribute('data-active', '');
    });
  }

  function init() {
    setTheme(getTheme());

    document.querySelectorAll('[data-section]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (el.getAttribute('href') === '#') e.preventDefault();
        const id = el.getAttribute('data-section');
        if (id === 'home') {
          showSection('home');
          return;
        }
        if (id) showSection(id);
      });
    });


    document.querySelector('.btn-theme')?.addEventListener('click', function () {
      toggleTheme();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
