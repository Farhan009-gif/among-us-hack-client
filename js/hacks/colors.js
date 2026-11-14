// ============================================================
// colors.js — Color Swap Module for Among Us Hack Client
// ============================================================

class ColorsHack {
  constructor() {
    this.active = false;
    this.selectedColor = Utils.getHackState('color') || '#FF0000'; // default red.
    this.canvasArea = document.getElementById('canvasArea');
    
    if (!this.canvasArea) return;

    // Collect all crewmate elements in the preview canvas.
    this.crewmates = Array.from(this.canvasArea.querySelectorAll('.crewmate'));
  }

  /** Toggle color swap on/off */
  toggle(on) {
    if (on === undefined || on !== on) {
      // Called without argument — flip current state.
      on = !this.active;
    }

    this.active = on;
    Utils.setHackState('color', on);

    if (on) {
      this._applyColor();
      Utils.showToast(`Color Swap ON — ${this.selectedColor}`, 'success');
    } else {
      this._removeColor();
      Utils.showToast('Color Swap OFF', 'info');
    }
  }

  /** Apply the selected color to all crewmates */
  _applyColor() {
    if (!this.canvasArea) return;

    // Add "color-swap-active" class for CSS visual feedback.
    this.canvasArea.classList.add('color-swap-active');

    // Update each crewmate's background or border with the selected color.
    this.crewmates.forEach((cm, i) => {
      if (i % 2 === 0) {
        // Even-indexed crewmates get full color fill.
        cm.style.backgroundColor = `${this.selectedColor}cc`; // slight transparency.
        cm.style.borderColor = this.selectedColor;
      } else {
        // Odd-indexed crewmates get border highlight only (simulating partial ESP).
        cm.style.border = `3px solid ${this.selectedColor}`;
      }

      // Stagger the color transition animation.
      const delay = i * 150;
      setTimeout(() => {
        if (this.active) {
          cm.classList.add('color-changed');
        }
      }, delay);
    });
  }

  /** Remove applied colors and reset to defaults */
  _removeColor() {
    if (!this.canvasArea) return;

    this.canvasArea.classList.remove('color-swap-active');

    this.crewmates.forEach((cm, i) => {
      cm.style.backgroundColor = ''; // clear inline style.
      cm.style.borderColor = '';
      cm.style.border = '';
      
      const delay = i * 100;
      setTimeout(() => {
        if (!this.active) {
          cm.classList.remove('color-changed');
        }
      }, delay);
    });
  }

  /** Update the selected color (called from premium modal). */
  updateColor(colorHex) {
    this.selectedColor = colorHex;
    Utils.setHackState('color', this.active ? true : false); // persist flag.
    
    if (this.active) {
      this._applyColor(); // re-apply with new color immediately.
      Utils.showToast(`Color updated to ${colorHex}`, 'success');
    } else {
      // Store for when it's activated later.
      Utils.setHackState('selected-color', colorHex);
      Utils.showToast(`Color set: ${colorHex} (activates on toggle)`, 'info');
    }
  }

  /** Get current selected color */
  getSelectedColor() {
    return this.selectedColor;
  }

  destroy() {
    this.toggle(false);
  }
}

// Singleton instance.
window.ColorsHack = new ColorsHack();
