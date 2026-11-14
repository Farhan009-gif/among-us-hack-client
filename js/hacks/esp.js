// ============================================================
// esp.js — ESP / Fog of War Hack Module
// ============================================================

class EspHack {
  constructor() {
    this.active = false;
    // Track which crewmates are "revealed" through walls.
    this.revealed = new Set();
    this.canvasArea = document.getElementById('canvasArea');
    if (!this.canvasArea) return;

    // Collect all crewmate elements inside the canvas area.
    this.crewmates = Array.from(this.canvasArea.querySelectorAll('.crewmate'));
  }

  /** Toggle ESP on/off */
  toggle(on) {
    if (on === undefined || on !== on) {
      // Called without argument — flip current state.
      on = !this.active;
    }

    this.active = on;
    Utils.setHackState('esp', on);

    // Apply ESP visual effect to all crewmates in the preview canvas.
    if (on) {
      this._activate();
      Utils.showToast('ESP ON — see through walls!', 'success');
    } else {
      this._deactivate();
      Utils.showToast('ESP OFF', 'info');
    }
  }

  /** Activate ESP visuals */
  _activate() {
    // Add "esp-active" class to the canvas area.
    if (this.canvasArea) {
      this.canvasArea.classList.add('esp-active');
    }

    // Reveal all hidden crewmates with a glowing outline effect.
    const crewmates = Array.from(
      document.querySelectorAll('#canvasArea .crewmate')
    );
    crewmates.forEach((cm, i) => {
      if (i % 3 !== 0) {
        // Every third crewmate is "hidden" by fog; reveal them.
        cm.classList.add('esp-revealed');
      } else {
        // Keep some as visible but add ESP trail effect.
        cm.classList.add('esp-trail');
      }

      // Stagger the reveal animation slightly per crewmate.
      const delay = i * 100;
      setTimeout(() => {
        if (this.active) {
          cm.style.opacity = ''; // reset from any previous hidden state.
        }
      }, delay);
    });
  }

  /** Deactivate ESP visuals */
  _deactivate() {
    if (this.canvasArea) {
      this.canvasArea.classList.remove('esp-active');
    }

    const crewmates = Array.from(
      document.querySelectorAll('#canvasArea .crewmate')
    );
    crewmates.forEach((cm, i) => {
      cm.classList.remove('esp-revealed', 'esp-trail');
      if (i % 3 !== 0) {
        // Re-hide the ones that were hidden behind fog.
        cm.style.opacity = ''; // let CSS handle default state.
      } else {
        cm.style.opacity = '';
      }
    });
  }

  /** Get list of revealed crewmate positions (for external use). */
  getRevealedPositions() {
    const result = [];
    this.crewmates.forEach((cm) => {
      if (!this.revealed.has(cm)) return;
      const rect = cm.getBoundingClientRect();
      result.push({ x: rect.left, y: rect.top });
    });
    return result;
  }

  destroy() {
    this.toggle(false);
  }
}

// Singleton instance.
window.EspHack = new EspHack();
