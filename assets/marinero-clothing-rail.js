(() => {
  if (customElements.get('marinero-clothing-rail')) return;
  class ClothingRail extends HTMLElement {
    connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      const on = (target, event, fn, options = {}) => target.addEventListener(event, fn, { ...options, signal: this.abort.signal });
      this.viewport = this.querySelector('.m-rail__viewport');
      this.items = [...this.querySelectorAll('.m-rail__item')];
      this.panel = this.querySelector('.m-rail__selection');
      this.active = null;
      this.classList.add('is-ready');
      this.style.setProperty('--rail-viewport', `${this.viewport.clientWidth}px`);
      this.select(this.nearestItem() || this.available[0]);
      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver(() => {
        const width = this.viewport.clientWidth;
        if (this.viewportWidth === width) return;
        this.viewportWidth = width;
        this.style.setProperty('--rail-viewport', `${width}px`);
        if (this.active) this.center(this.active);
      });
      this.resizeObserver.observe(this.viewport);
      on(this, 'click', (event) => {
        const face = event.target.closest('[data-rail-face]');
        if (face) {
          const item = face.closest('.m-rail__item');
          if (item !== this.active) this.select(item);
          this.flip(face.dataset.railFace === 'back');
          return;
        }
        const link = event.target.closest('.m-rail__garment');
        if (!link) return;
        if (Date.now() < (this.suppressClickUntil || 0)) { event.preventDefault(); return; }
        const item = link.closest('.m-rail__item');
        this.updateLink(item);
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const image = item.querySelector(item.classList.contains('is-back') ? '.m-rail__back img' : '.m-rail__front img');
        if (image && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          image.setAttribute('data-view-transition-type', 'product-image-transition');
          image.setAttribute('data-view-transition-triggered', 'true');
        }
      });
      on(window, 'pageshow', () => {
        this.querySelectorAll('[data-view-transition-triggered]').forEach(image => {
          image.removeAttribute('data-view-transition-type');
          image.removeAttribute('data-view-transition-triggered');
        });
      });
      on(this, 'keydown', (event) => {
        if (event.key === 'Escape' && this.active) { event.preventDefault(); this.close(); return; }
        if (!this.viewport.contains(event.target)) return;
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const available = this.available;
          const current = available.indexOf(event.target.closest('.m-rail__item') || this.active);
          const index = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : Math.max(0, Math.min(available.length - 1, current + (event.key === 'ArrowLeft' ? -1 : 1)));
          if (available[index]) { this.select(available[index]); available[index].querySelector('.m-rail__garment').focus({ preventScroll: true }); }
        }
      });
      on(this.viewport, 'pointerdown', (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        if (event.target.closest('[data-rail-face]')) return;
        const item = event.target.closest('.m-rail__item');
        this.cancelMotion();
        this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, scroll: this.viewport.scrollLeft, mouse: event.pointerType === 'mouse', moved: false, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
      });
      on(this.viewport, 'pointermove', (event) => {
        const d = this.drag;
        if (!d || d.id !== event.pointerId) return;
        const dx = event.clientX - d.x;
        if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - d.y)) {
          d.moved = true;
          if (d.mouse) this.viewport.setPointerCapture(event.pointerId);
        }
        if (d.moved && d.mouse) {
          event.preventDefault();
          this.viewport.classList.add('is-dragging');
          this.viewport.scrollLeft = d.scroll - dx;
          const now = performance.now();
          d.velocity = (event.clientX - d.lastX) / Math.max(1, now - d.lastTime);
          d.lastX = event.clientX;
          d.lastTime = now;
        }
      }, { passive: false });
      const endDrag = (event) => {
        const d = this.drag;
        if (!d || d.id !== event.pointerId) return;
        this.drag = null;
        this.viewport.classList.remove('is-dragging');
        if (d.moved) {
          this.suppressClickUntil = Date.now() + 350;
          if (event.type === 'pointerup' && d.mouse) {
            const velocity = performance.now() - d.lastTime < 80 ? d.velocity : 0;
            this.viewport.scrollTo({ left: this.viewport.scrollLeft - Math.max(-2, Math.min(2, velocity)) * 110, behavior: this.motion });
            this.scheduleSettle();
          }
        }
        if (this.viewport.hasPointerCapture(event.pointerId)) this.viewport.releasePointerCapture(event.pointerId);
      };
      on(window, 'pointerup', endDrag);
      on(window, 'pointercancel', endDrag);
      on(this.viewport, 'wheel', () => this.cancelMotion(), { passive: true });
      on(this.viewport, 'scroll', () => {
        if (!this.centerFrame && !this.viewport.classList.contains('is-centering')) {
          if (!this.selectionFrame) this.selectionFrame = requestAnimationFrame(() => {
            this.selectionFrame = null;
            if (this.centerFrame) return;
            const nearest = this.nearestItem();
            if (nearest && nearest !== this.active) this.select(nearest, false);
          });
          this.scheduleSettle();
        }
      }, { passive: true });
      on(this.viewport, 'dragstart', (event) => event.preventDefault());
      on(this, 'shopify:block:select', (event) => {
        const item = event.target.closest('.m-rail__item');
        if (item) this.select(item);
      });
      on(this, 'shopify:block:deselect', () => this.close(false));
    }
    disconnectedCallback() { this.abort?.abort(); this.resizeObserver?.disconnect(); this.cancelMotion(); cancelAnimationFrame(this.selectionFrame); }
    get available() { return this.items.filter(item => !item.querySelector('.m-rail__garment').disabled); }
    get motion() { return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
    select(item, center = true) {
      if (!item || item.querySelector('.m-rail__garment').disabled) return;
      this.items.forEach(other => {
        other.classList.toggle('is-selected', other === item);
        other.classList.remove('is-back');
        other.querySelector('.m-rail__garment').setAttribute('aria-current', String(other === item));
      });
      this.active = item;
      this.panel.hidden = false;
      this.querySelector('[data-rail-title]').textContent = item.dataset.title;
      this.querySelector('[data-rail-price]').textContent = item.dataset.price;
      this.querySelector('[data-rail-age]').textContent = item.dataset.age || '';
      this.querySelector('[data-rail-age]').hidden = !item.dataset.age;
      this.querySelector('[data-rail-price]').hidden = !item.dataset.price;
      const setNote = this.querySelector('[data-rail-set-note]');
      if (setNote) setNote.hidden = item.dataset.soldAsSet !== 'true';
      this.items.forEach(other => this.updateLink(other));
      this.announce();
      if (center) this.center(item);
    }
    center(item) {
      if (!this.isConnected || this.active !== item) return;
      this.cancelMotion();
      this.viewport.classList.add('is-centering');
      const target = () => {
        const rect = item.getBoundingClientRect();
        const viewport = this.viewport.getBoundingClientRect();
        return Math.max(0, Math.min(this.viewport.scrollWidth - this.viewport.clientWidth, this.viewport.scrollLeft + rect.left - viewport.left - (viewport.width - rect.width) / 2));
      };
      if (this.motion === 'auto') {
        this.viewport.scrollLeft = target();
        this.viewport.classList.remove('is-centering');
        return;
      }
      const start = performance.now();
      let previous = start;
      const tick = now => {
        if (!this.isConnected || this.active !== item) { this.cancelMotion(); return; }
        const dt = Math.min(40, now - previous);
        previous = now;
        this.viewport.scrollLeft += (target() - this.viewport.scrollLeft) * (1 - Math.exp(-dt / 60));
        if (now - start < 700) this.centerFrame = requestAnimationFrame(tick);
        else {
          this.viewport.scrollLeft = target();
          this.viewport.classList.remove('is-centering');
          this.centerFrame = null;
        }
      };
      this.centerFrame = requestAnimationFrame(tick);
    }
    cancelMotion() {
      cancelAnimationFrame(this.centerFrame);
      clearTimeout(this.settleTimer);
      this.centerFrame = null;
      this.viewport?.classList.remove('is-centering');
    }
    scheduleSettle() {
      clearTimeout(this.settleTimer);
      if (this.centerFrame || this.viewport.classList.contains('is-centering')) return;
      this.settleTimer = setTimeout(() => {
        if (this.drag || !this.isConnected) return;
        const nearest = this.nearestItem();
        if (nearest && nearest !== this.active) this.select(nearest);
        else if (nearest) this.center(nearest);
      }, 160);
    }
    nearestItem() {
      const bounds = this.viewport.getBoundingClientRect();
      const midpoint = bounds.left + bounds.width / 2;
      return this.available.reduce((best, item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - midpoint);
        return !best || distance < best.distance ? { item, distance } : best;
      }, null)?.item;
    }
    updateLink(item) {
      const back = item.classList.contains('is-back');
      const link = item.querySelector('.m-rail__garment');
      if (item.dataset.url) {
        const url = new URL(item.dataset.url, location.origin);
        const media = back ? item.dataset.backMedia : item.dataset.frontMedia;
        if (media) url.hash = 'rail-media=' + media;
        link.href = url.href;
      }
      item.querySelectorAll('[data-rail-face]').forEach(dot => dot.setAttribute('aria-pressed', String((dot.dataset.railFace === 'back') === back)));
    }
    flip(back = !this.active?.classList.contains('is-back')) {
      if (!this.active?.hasAttribute('data-has-back')) return;
      this.active.classList.toggle('is-back', back);
      this.updateLink(this.active);
      this.announce();
    }
    announce() {
      this.querySelector('.m-rail__status').textContent = this.active ? `${this.active.dataset.title} — ${this.active.classList.contains('is-back') ? this.dataset.backLabel : this.dataset.frontLabel}` : '';
    }
    close(focus = true) {
      const item = this.active || this.nearestItem();
      if (item) this.select(item);
      if (focus) item?.querySelector('.m-rail__garment').focus({ preventScroll: true });
    }
    step(delta) {
      const available = this.available;
      if (!available.length) return;
      const index = available.indexOf(this.active);
      this.select(available[Math.max(0, Math.min(available.length - 1, index < 0 ? (delta > 0 ? 0 : available.length - 1) : index + delta))]);
    }
  }
  customElements.define('marinero-clothing-rail', ClothingRail);
})();
