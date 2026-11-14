// ============================================================
// app.js — Main wiring: toggles, slider, nav, service worker.
// The hack modules (speed/esp/colors) expose window singletons;
// premium gating lives in premium.js, which loads before this.
// Everything here drives the SIMULATED preview only.
// ============================================================

(function () {
  const $ = (id) => document.getElementById(id);
  const fmt = (v) => `${parseFloat(v).toFixed(1)}x`;

  // ---------- Service worker (PWA) ----------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        /* offline support simply stays off if registration fails */
      });
    });
  }

  // ---------- Speed ----------
  const speedToggle = $('speedToggle');
  const speedRange = $('speedRange');
  const sliderVal = $('sliderVal');
  const speedValue = $('speedValue');

  function syncSpeedLabels(v) {
    if (sliderVal) sliderVal.textContent = fmt(v);
    if (speedValue) speedValue.textContent = fmt(v);
    if (speedRange) speedRange.value = v;
  }

  if (window.SpeedHack) syncSpeedLabels(window.SpeedHack.speed);

  speedToggle?.addEventListener('change', () => {
    window.SpeedHack?.toggle(speedToggle.checked);
  });
  speedRange?.addEventListener('input', () => {
    window.SpeedHack?.setSpeed(speedRange.value);
    syncSpeedLabels(speedRange.value);
  });
  window.addEventListener('speed-change', (e) => syncSpeedLabels(e.detail));

  // ---------- ESP / Color (premium-gated in premium.js) ----------
  $('espToggle')?.addEventListener('change', (e) => {
    window.EspHack?.toggle(e.target.checked);
  });
  $('colorToggle')?.addEventListener('change', (e) => {
    window.ColorsHack?.toggle(e.target.checked);
  });

  // ---------- Jump Bot (free, simulated) ----------
  $('jumpToggle')?.addEventListener('change', (e) => {
    const on = e.target.checked;
    document.querySelector('.crewmate.red')?.classList.toggle('jumping', on);
    Utils.setHackState('jump', on);
    Utils.showToast(on ? 'Jump Bot ON' : 'Jump Bot OFF', on ? 'success' : 'info');
  });

  // ---------- Ghost Mode (premium-gated in premium.js) ----------
  $('ghostToggle')?.addEventListener('change', (e) => {
    const on = e.target.checked;
    const ghost = document.querySelector('.crewmate.green');
    if (ghost) ghost.classList.toggle('hidden', !on);
    Utils.setHackState('ghost', on);
    Utils.showToast(on ? 'Ghost Mode ON — walk unseen (simulated)' : 'Ghost Mode OFF',
      on ? 'success' : 'info');
  });

  // ---------- Auto-Task (premium-gated in premium.js) ----------
  $('antitaskToggle')?.addEventListener('change', (e) => {
    const on = e.target.checked;
    Utils.setHackState('antitask', on);
    Utils.showToast(on ? 'Auto-Task ON — tasks complete themselves (simulated)' : 'Auto-Task OFF',
      on ? 'success' : 'info');
  });

  // ---------- Bottom nav ----------
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item')
        .forEach((n) => n.classList.remove('active'));
      item.classList.add('active');
      if (item.getAttribute('href') === '#premium') window.Premium?.open();
    });
  });
})();
