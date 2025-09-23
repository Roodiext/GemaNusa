// Navbar sticky helper
// - Menjaga navbar tetap "fixed" di atas (jika belum diset oleh CSS/Tailwind).
// - Mengatur padding-top pada konten agar tidak tertutup navbar.
// - Update otomatis pada resize / perubahan ukuran navbar.

(function () {
  const NAV_SELECTOR = '#navbar-wrapper'
  const CONTENT_TARGET_SELECTORS = [
    'main',
    '#page-content',
    '.page-wrapper',
    '#program-catalog',
    '.site-content',
    '.container',
    '.max-w-7xl'
  ]

  // Debounce util
  function debounce(fn, wait = 100) {
    let t
    return function (...args) {
      clearTimeout(t)
      t = setTimeout(() => fn.apply(this, args), wait)
    }
  }

  // Hitung tinggi navbar dan terapkan padding pada target
  function updateNavbarOffset() {
    const nav = document.querySelector(NAV_SELECTOR)
    if (!nav) return

    // Pastikan posisi fixed (fallback) — jika Tailwind sudah melakukan ini, style ini harmless
    nav.style.position = 'fixed'
    nav.style.top = '0'
    nav.style.left = '0'
    nav.style.right = '0'
    nav.style.zIndex = '9999'
    // Pastikan lebar penuh
    nav.style.width = '100%'

    // Hitung tinggi aktual (diperhitungkan setelah rendering)
    const rect = nav.getBoundingClientRect()
    const height = Math.ceil(rect.height) || 0

    // Simpan variabel CSS juga (berguna di CSS jika dibutuhkan)
    document.documentElement.style.setProperty('--navbar-height', `${height}px`)

    // Terapkan padding-top ke target konten yang ditemukan (jangan ubah margin navbar)
    let applied = false
    for (const sel of CONTENT_TARGET_SELECTORS) {
      const els = document.querySelectorAll(sel)
      if (!els || els.length === 0) continue
      els.forEach(el => {
        // Jika target memiliki attribute data-navbar-manual, abaikan (biarkan layout manual)
        if (el.hasAttribute('data-navbar-manual')) return
        // set atau update paddingTop
        // Jangan menimpa nilai paddingTop yang sudah diatur developer jika ada attribute data-navbar-ignore
        const current = el.style.paddingTop
        if (current !== `${height}px`) {
          el.style.paddingTop = `${height}px`
        }
        applied = true
      })
    }

    // Jika tidak ada target spesifik ditemukan, terapkan pada body
    if (!applied) {
      // gunakan safe-area-inset-top untuk iOS jika tersedia
      const safeArea = (typeof window !== 'undefined' && window.CSS && CSS.supports && CSS.supports('padding-top: env(safe-area-inset-top)'))
        ? ` + env(safe-area-inset-top)` : ''
      // Override body padding-top (hati-hati jika developer sudah menambahkan padding manual; user bisa override dengan data-navbar-manual)
      document.body.style.paddingTop = `${height}px`
      // optional CSS var also set above
    }
  }

  // Setup observers to react when navbar height changes or when nav is added dynamically
  function ensureObservers() {
    const nav = document.querySelector(NAV_SELECTOR)
    if (nav) {
      // Observe size changes
      if (window.ResizeObserver) {
        try {
          const ro = new ResizeObserver(debounce(() => {
            updateNavbarOffset()
          }, 60))
          ro.observe(nav)
        } catch (e) {
          // ignore
        }
      }
      // Also run update now
      updateNavbarOffset()
    } else {
      // If nav not present yet, wait for it via MutationObserver
      const mo = new MutationObserver((mutations, obs) => {
        const n = document.querySelector(NAV_SELECTOR)
        if (n) {
          updateNavbarOffset()
          ensureObservers() // re-run to attach ResizeObserver
          obs.disconnect()
        }
      })
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true })
    }
  }

  // Initialize: run on DOMContentLoaded and on load (covers different inclusion timing)
  function init() {
    ensureObservers()

    // Update on resize (debounced)
    window.addEventListener('resize', debounce(updateNavbarOffset, 120))

    // If page content changes dynamically, run again after short delay
    // (some frameworks mutate layout; safe to call periodically)
    window.addEventListener('load', () => {
      setTimeout(updateNavbarOffset, 50)
    })

    // Also re-run when fonts load (can change layout)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(updateNavbarOffset, 50)).catch(() => {})
    }
  }

  // Run init at appropriate time
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Expose helper for manual recalculation if needed
  window.__navbarUpdateOffset = updateNavbarOffset
})()

