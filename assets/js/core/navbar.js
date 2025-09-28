// Robust navbar: burger toggle + hide/show on scroll
// Defer hide-on-scroll until page load/stabilization to avoid hiding due to layout shift.

(function () {
  'use strict';

  class Navbar {
    constructor() {
      this.nav = null;
      this.mobileMenu = null;
      this.toggleBtn = null;

      this.lastScrollY = 0;
      this.isHidden = false;
      this.scrollThreshold = 50;

      // control flags
      this.listenersInstalled = false;
      this.scrollActive = false; // <-- only allow hide/show after stabilization
      this.toggleHandler = this.toggleHandler.bind(this);
      this.onDocClick = this.onDocClick.bind(this);
      this.onScrollRAF = this.onScrollRAF.bind(this);
      this.ticking = false;
    }

    // Wait until #main-navbar exists (timeout optional)
    waitForNav(timeout = 7000) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          const el = document.getElementById('main-navbar');
          if (el) return resolve(el);
          if (Date.now() - start > timeout) return reject(new Error('Timeout waiting for #main-navbar'));
          setTimeout(check, 60);
        };
        check();
      });
    }

    // Bind (or re-bind) to current navbar element
    async bind() {
      try {
        const el = await this.waitForNav();
        if (this.nav === el) {
          this.adjustPadding();
          return;
        }

        if (this.toggleBtn && this.toggleBtn.removeEventListener) {
          try { this.toggleBtn.removeEventListener('click', this.toggleHandler); } catch (e) {}
        }

        this.nav = el;
        this.mobileMenu = document.getElementById('mobile-menu');
        this.toggleBtn = document.getElementById('mobile-menu-toggle');

        // ensure visible at bind time
        this.nav.style.transition = this.nav.style.transition || 'transform 300ms ease';
        this.nav.style.transform = 'translateY(0)';
        this.isHidden = false;

        // ensure navbar z-index is above common loaders (optional)
        try {
          // spinner uses z-index 9999 in component-loader; make navbar higher so it's not accidentally under overlays
          this.nav.style.zIndex = '10010';
        } catch (e) {}

        if (this.toggleBtn) {
          this.toggleBtn.addEventListener('click', this.toggleHandler);
        }

        if (!this.listenersInstalled) {
          // install global listeners once
          window.addEventListener('scroll', () => {
            if (!this.ticking) {
              window.requestAnimationFrame(this.onScrollRAF);
              this.ticking = true;
            }
          }, { passive: true });

          window.addEventListener('resize', () => this.adjustPadding());
          document.addEventListener('click', this.onDocClick);

          this.listenersInstalled = true;
        }

        // baseline scroll pos to avoid immediate hide; keep updating baseline until scrollActive enabled
        this.lastScrollY = window.pageYOffset || 0;

        // when window load fires, enable scrollActive after slight delay to let layout settle
        const enableScrollAfterLoad = () => {
          // small margin to avoid immediate hide due to layout shifts
          setTimeout(() => {
            this.lastScrollY = window.pageYOffset || 0;
            this.scrollActive = true;
            console.log('[Navbar] scrollActive = true (post-load)');
          }, 160); // 160ms is small but helps reduce false-positive hides
        };

        if (document.readyState === 'complete') {
          // already loaded
          enableScrollAfterLoad();
        } else {
          window.addEventListener('load', enableScrollAfterLoad, { once: true });
        }

        // initial padding adjust
        this.adjustPadding();

        console.log('[Navbar] bind/rebound done. lastScrollY=', this.lastScrollY, 'scrollActive=', this.scrollActive);
      } catch (err) {
        console.warn('[Navbar] bind failed', err);
      }
    }

    onScrollRAF() {
      this.ticking = false;
      this.handleScroll();
    }

    handleScroll() {
      if (!this.nav) return;

      const y = window.pageYOffset || 0;

      // If scrollActive not enabled yet, just update baseline and return
      if (!this.scrollActive) {
        this.lastScrollY = y;
        return;
      }

      const down = y > this.lastScrollY;
      const past = y > this.scrollThreshold;
      const delta = Math.abs(y - this.lastScrollY);

      if (delta < 3) {
        this.lastScrollY = y;
        return;
      }

      if (down && past && !this.isHidden) {
        this.nav.style.transform = 'translateY(-100%)';
        this.isHidden = true;
        this.closeMobile();
      } else if (!down && this.isHidden) {
        this.nav.style.transform = 'translateY(0)';
        this.isHidden = false;
      }

      if (y > 10) this.nav.classList.add('shadow-md'); else this.nav.classList.remove('shadow-md');

      this.lastScrollY = y;
    }

    adjustPadding() {
      if (!this.nav) return;
      const h = this.nav.offsetHeight || 0;
      document.body.style.paddingTop = `${h}px`;
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    }

    toggleHandler(e) {
      e && e.stopPropagation();
      if (!this.mobileMenu || !this.toggleBtn) return;
      const hidden = this.mobileMenu.classList.contains('hidden');
      if (hidden) {
        this.mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
          this.mobileMenu.classList.remove('scale-y-95', 'opacity-0');
          this.mobileMenu.classList.add('scale-y-100', 'opacity-100');
          this.toggleBtn.setAttribute('aria-expanded', 'true');
        });
      } else {
        this.mobileMenu.classList.remove('scale-y-100', 'opacity-100');
        this.mobileMenu.classList.add('scale-y-95', 'opacity-0');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (this.mobileMenu) this.mobileMenu.classList.add('hidden'); }, 200);
      }
    }

    closeMobile() {
      if (!this.mobileMenu) return;
      if (this.mobileMenu.classList.contains('hidden')) return;
      this.mobileMenu.classList.remove('scale-y-100', 'opacity-100');
      this.mobileMenu.classList.add('scale-y-95', 'opacity-0');
      setTimeout(() => { if (this.mobileMenu) this.mobileMenu.classList.add('hidden'); }, 200);
      if