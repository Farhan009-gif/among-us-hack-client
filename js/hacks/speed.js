// ============================================================
// speed.js — Speed Boost Controller for Among Us Hack Client
// ============================================================

class SpeedHack {
  constructor() {
    this.speed = Utils.getHackState('speed') || 1.5; // multiplier (x)
    this.active = false;
    this._intervalId = null;
    this.crewmateEl = document.querySelector('.crewmate.red');
  }

  /** Activate or deactivate speed boost */
  toggle(on) {
    if (!on && !this.active) return; // already off
    this.active = on;
    Utils.setHackState('speed', this.speed);

    if (on) {
      this._startAnimation();
      Utils.showToast(`Speed Boost ON — ${this.speed}x`, 'success');
    } else {
      this._stopAnimation();
      Utils.showToast('Speed Boost OFF', 'info');
    }
  }

  /** Update the speed value (called from slider). */
  setSpeed(value) {
    this.speed = parseFloat(value);
    Utils.setHackState('speed', this.speed);
    // Dispatch event so other modules can react.
    window.dispatchEvent(new CustomEvent('speed-change', { detail: this.speed }));
  }

  /** Start the movement animation loop */
  _startAnimation() {
    if (this._intervalId) return;
    const step = () => {
      if (!this.active || !this.crewmateEl) return;
      // Bounce the red crewmate horizontally. Higher speed → faster translation.
      const t = Date.now() / (400 / this.speed);
      const x = Math.sin(t) * 30; // ±30 px range
      this.crewmateEl.style.transform = `translateX(${x}px)`;
    };
    step(); // run immediately, then interval.
    this._intervalId = setInterval(step, 50);
  }

  /** Stop the movement animation loop */
  _stopAnimation() {
    clearInterval(this._intervalId);
    this._intervalId = null;
    if (this.crewmateEl) {
      this.crewmateEl.style.transform = ''; // reset.
    }
  }

  destroy() {
    this.toggle(false);
  }
}

// Singleton instance exposed on window for easy access.
window.SpeedHack = new SpeedHack();
