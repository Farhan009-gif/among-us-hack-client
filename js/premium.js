// ============================================================
// premium.js — Premium gate, modal and upgrade flow
// Loads BEFORE app.js: its change-listeners on the premium
// toggles are registered first, and when a locked feature is
// switched on it stops the event so app.js never activates it.
// ============================================================

const Premium = {
  // Premium feature key -> its toggle input id.
  gatedToggles: {
    esp: 'espToggle',
    color: 'colorToggle',
    ghost: 'ghostToggle',
    antitask: 'antitaskToggle',
  },

  modal: null,

  init() {
    this.modal = document.getElementById('premiumModal');
    if (!this.modal) return;

    document.getElementById('premiumBtn')
      ?.addEventListener('click', () => this.open());
    document.getElementById('closePremium')
      ?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    document.getElementById('upgradeBtn')
      ?.addEventListener('click', () => this.upgrade());

    // Gate every premium toggle.
    Object.entries(this.gatedToggles).forEach(([key, id]) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('change', (e) => {
        if (input.checked && !Utils.isPremium()) {
          input.checked = false;
          e.stopImmediatePropagation(); // app.js must not activate it
          Utils.showToast('Premium feature — upgrade to unlock', 'error');
          this.open();
        }
      });
    });

    // Color picker (lives inside the modal).
    document.querySelectorAll('#colorPicker .color-options button')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#colorPicker .color-options button')
            .forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          window.ColorsHack?.updateColor(btn.dataset.color);
        });
      });

    if (Utils.isPremium()) this.applyUnlocked();
  },

  open() {
    this.modal?.classList.remove('hidden');
  },

  close() {
    this.modal?.classList.add('hidden');
  },

  /** Reflect the unlocked state in the UI. */
  applyUnlocked() {
    document.querySelectorAll('.premium-lock').forEach((el) => el.classList.add('hidden'));
    document.querySelectorAll('.feature-item.locked').forEach((el) => {
      el.classList.remove('locked');
      el.classList.add('unlocked');
    });
    document.getElementById('colorPicker')?.classList.remove('hidden');
    const badge = document.getElementById('premiumBtn');
    if (badge) badge.classList.add('active');
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
      upgradeBtn.textContent = 'Premium Active ✓';
      upgradeBtn.classList.add('done');
      upgradeBtn.disabled = true;
    }
  },

  /** Simulated upgrade: payment is a demo, per utils.js. */
  async upgrade() {
    if (Utils.isPremium()) return;
    const btn = document.getElementById('upgradeBtn');
    btn.disabled = true;
    btn.textContent = 'Processing…';
    const ok = await Utils.simulatePayment();
    if (ok) {
      Utils.setPremium(true);
      this.applyUnlocked();
      Utils.showToast('Premium unlocked — all hacks available!', 'success');
      setTimeout(() => this.close(), 900);
    } else {
      btn.disabled = false;
      btn.textContent = 'Upgrade to Premium — $4.99';
      Utils.showToast('Payment failed (simulated) — try again', 'error');
    }
  },
};

window.Premium = Premium;
Premium.init();
