// Theme: follows the visitor's local time by default (light 06:00–18:00, dark otherwise),
// with a toggle button that cycles Auto → Light → Dark. Choice is remembered per browser.
(function () {
  const KEY = 'sl-theme';
  const root = document.documentElement;
  const get = () => { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };
  const byTime = () => { const h = new Date().getHours(); return h >= 6 && h < 18 ? 'light' : 'dark'; };
  function apply(pref) {
    const mode = pref === 'auto' ? byTime() : pref;
    root.dataset.theme = mode;
    root.dataset.themePref = pref;
    document.querySelectorAll('[data-theme-label]').forEach((el) => {
      el.textContent = pref === 'auto' ? `Auto · ${mode === 'light' ? 'Day' : 'Night'}` : mode === 'light' ? 'Light' : 'Dark';
    });
    const meta = document.querySelector('meta[name=theme-color]');
    if (meta) meta.content = mode === 'light' ? '#ecE8e0' : '#08080a';
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode, pref } }));
  }
  apply(get());
  // re-check every minute so "auto" flips at 6am / 6pm while the page is open
  setInterval(() => { if (get() === 'auto') apply('auto'); }, 60000);
  window.addEventListener('DOMContentLoaded', () => {
    apply(get());
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const order = ['auto', 'light', 'dark'];
        const next = order[(order.indexOf(get()) + 1) % order.length];
        set(next);
        root.classList.add('theme-anim');
        apply(next);
        setTimeout(() => root.classList.remove('theme-anim'), 700);
      })
    );
  });
})();
