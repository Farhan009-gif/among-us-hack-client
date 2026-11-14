// ============================================================
// utils.js — Helpers & Utilities for Among Us Hack Client
// ============================================================

const Utils = {
  /**
   * Show a toast notification.
   * @param {string} message - Text to display.
   * @param {'success'|'error'|'info'} type - Toast style.
   */
  showToast(message, type = 'info') {
    const toastEl = document.getElementById('toast');
    if (!toastEl) return;

    // Clear previous content and set class
    toastEl.textContent = message;
    toastEl.className = `toast ${type}`;

    // Force reflow so the animation restarts cleanly.
    void toastEl.offsetWidth;

    // Auto-dismiss after 2 seconds.
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2000);
  },

  /**
   * Check if the user has premium (persisted in localStorage).
   */
  isPremium() {
    return localStorage.getItem('amongus_premium') === 'true';
  },

  /**
   * Set / clear premium flag.
   */
  setPremium(value) {
    localStorage.setItem('amongus_premium', String(Boolean(value)));
  },

  /**
   * Persist a single hack state to localStorage.
   * @param {string} key - Feature key (speed, esp, color …).
   * @param {*} value - Value to store.
   */
  setHackState(key, value) {
    try {
      localStorage.setItem(`amongus_hack_${key}`, JSON.stringify(value));
    } catch (_) { /* quota exceeded — ignore silently */ }
  },

  /**
   * Retrieve a hack state (parsed).
   */
  getHackState(key) {
    const raw = localStorage.getItem(`amongus_hack_${key}`);
    try { return JSON.parse(raw); } catch (_) { return null; }
  },

  /**
   * Debounce helper.
   * @param {Function} fn - Function to debounce.
   * @param {number} delayMs - Milliseconds.
   */
  debounce(fn, delayMs = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), delayMs);
    };
  },

  /**
   * Simulate a network request (for upgrade flow).
   */
  simulatePayment() {
    return new Promise((resolve) => {
      // 90 % chance of success for demo.
      setTimeout(() => resolve(Math.random() < 0.9), 800);
    });
  },

  /**
   * Escape HTML special chars (XSS-safe).
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Expose for other modules to use.
window.Utils = Utils;
