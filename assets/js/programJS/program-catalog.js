// Program Catalog JavaScript - Full restored + image placeholders + detail modal
console.log("=== PROGRAM CATALOG JS LOADED ===")

class ProgramCatalog {
  constructor() {
    this.programDatabase = this.initializeProgramDatabase()
    this.currentCategory = 'all'
    this.currentSearch = ''
    this.advancedFilters = {
      commitment: [],
      scope: [],
      skills: [],
      roles: []
    }

    this._boundHandleOutsideClick = this.handleOutsideClick.bind(this)
    this._boundEscHandler = (e) => {
      if (e.key === 'Escape' && this.isAdvancedFilterOpen) {
        this.closeAdvancedFilter()
      }
      // ESC to close program detail modal if open
      if (e.key === 'Escape' && document.getElementById('program-detail-modal')) {
        const modal = document.getElementById('program-detail-modal')
        if (modal && !modal.classList.contains('hidden')) {
          this.closeProgramDetailModal()
        }
      }
    }
    
    // Performance optimization
    this.filteredCache = new Map()
    this.renderTimeout = null
    this.searchTimeout = null
    
    // Modal open state
    this.isAdvancedFilterOpen = false

    console.log("Program database loaded:", Object.keys(this.programDatabase).length, "programs")
    this.init()
  }

  init() {
    console.log("ProgramCatalog init() called")
    // Ensure small UI fixes for filter texts/images
    this.injectUIFixes()
    this.setupEventListeners()
    
    setTimeout(() => {
      console.log("First render attempt...")
      this.renderPrograms()
    }, 100)
    
    setTimeout(() => {
      console.log("Second render attempt...")
      this.renderPrograms()
      this.checkForHighlight()
    }, 500)
  }

  // Inject small CSS fixes so filter button text/icons show reliably
  injectUIFixes() {
    if (document.getElementById('program-catalog-inline-style')) return
    const style = document.createElement('style')
    style.id = 'program-catalog-inline-style'
    style.innerHTML = `
      /* make sure filter button text is visible and can wrap if needed */
      .filter-btn span { display: inline-flex !important; align-items: center; gap: 0.5rem; white-space: normal !important; }
      .filter-btn svg { flex: 0 0 auto; }
      /* ensure program image covers the top area */
      #programs-grid .program-card img { display:block; width:100%; height:100%; object-fit:cover; }
      /* modal overlay base */
      .program-detail-overlay { position: fixed; inset:0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index: 9999; padding: 20px; }
      .program-detail-overlay.hidden { display: none; }
    `
    document.head.appendChild(style)
  }

  initializeProgramDatabase() {
    // Original program database restored as in previous file (kept content and keys)
    return {
      mentor_muda_nusantara: {
        name: "Mentor Muda Nusantara",
        description: "Program bimbingan belajar untuk anak kurang mampu dengan pendekatan mentoring personal",
        category: "education",
        tags: ["education", "social"],
        commitment: "mid",
        scope: "local",
        skills: ["communication", "leadership"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Bimbingan belajar rutin",
          "Mentoring pengembangan karakter",
          "Workshop keterampilan hidup"
        ],
        impact: "1,200+ anak terbimbing, 85% naik kelas dengan nilai baik",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-mentormudanusantara.jpg"
      },
      perpustakaan_hidup: {
        name: "Perpustakaan Hidup",
        description: "Penggalangan buku dan kelas literasi kreatif untuk meningkatkan minat baca masyarakat",
        category: "education",
        tags: ["education", "social"],
        commitment: "low",
        scope: "local",
        skills: ["creative", "communication"],
        rolesAvailable: ["relawan", "donatur", "mentor"],
        activities: [
          "Penggalangan dan distribusi buku",
          "Kelas literasi kreatif",
          "Storytelling untuk anak"
        ],
        impact: "50+ perpustakaan mini, 3,000+ buku terdistribusi",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-perpustakaanhidup.jpg"
      },
      sahabat_hutan: {
        name: "Sahabat Hutan",
        description: "Program reboisasi dan pelestarian satwa untuk menjaga ekosistem hutan Indonesia",
        category: "conservation",
        tags: ["conservation"],
        commitment: "high",
        scope: "national",
        skills: ["leadership", "technical"],
        rolesAvailable: ["relawan", "mentor"],
        activities: [
          "Penanaman pohon native species",
          "Monitoring satwa liar",
          "Edukasi masyarakat sekitar hutan"
        ],
        impact: "25,000+ pohon ditanam, 1,200 hektar hutan terlindungi",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-sahabathutan.jpg"
      },
      laut_bersih_bersinar: {
        name: "Laut Bersih Bersinar",
        description: "Aksi bersih pantai dan edukasi tentang bahaya plastik sekali pakai",
        category: "conservation",
        tags: ["ocean", "conservation"],
        commitment: "mid",
        scope: "national",
        skills: ["leadership", "communication"],
        rolesAvailable: ["relawan", "mentor"],
        activities: [
          "Beach cleanup massal",
          "Edukasi bahaya sampah plastik",
          "Kampanye reduce plastic usage"
        ],
        impact: "50+ pantai dibersihkan, 25 ton sampah plastik terangkut",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-laut-bersih-bersinar.jpg"
      },
      dapur_peduli: {
        name: "Dapur Peduli",
        description: "Dapur umum dan distribusi makanan sehat untuk keluarga yang membutuhkan",
        category: "social",
        tags: ["social", "food"],
        commitment: "mid",
        scope: "local",
        skills: ["leadership", "communication"],
        rolesAvailable: ["relawan", "donatur"],
        activities: [
          "Memasak makanan bergizi",
          "Distribusi makanan ke keluarga rentan",
          "Edukasi gizi seimbang"
        ],
        impact: "15,000+ porsi makanan terdistribusi, 800+ keluarga terbantu",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-dapur-peduli.jpg"
      },
      gerakan_sembako_harapan: {
        name: "Gerakan Sembako Harapan",
        description: "Distribusi bahan pokok untuk keluarga rentan dan terdampak bencana",
        category: "social",
        tags: ["social", "food"],
        commitment: "low",
        scope: "city",
        skills: ["leadership", "communication"],
        rolesAvailable: ["relawan", "donatur"],
        activities: [
          "Penggalangan dan distribusi sembako",
          "Identifikasi keluarga penerima manfaat",
          "Koordinasi dengan pemerintah daerah"
        ],
        impact: "2,500+ paket sembako, 1,200+ keluarga terbantu",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-gerakan-sembako-harapan.jpg"
      },
      tech_for_good: {
        name: "Tech for Good",
        description: "Pengembangan solusi digital untuk mengatasi isu sosial dan lingkungan",
        category: "technology",
        tags: ["education", "social", "conservation"],
        commitment: "high",
        scope: "national",
        skills: ["technical", "creative"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Develop aplikasi untuk NGO",
          "Sistem monitoring lingkungan",
          "Platform edukasi digital"
        ],
        impact: "15+ aplikasi diluncurkan, 50+ NGO terbantu teknologi",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-tech-for-good.jpg"
      },
      smart_village_project: {
        name: "Smart Village Project",
        description: "Implementasi IoT dan aplikasi sederhana untuk meningkatkan kualitas hidup desa",
        category: "technology",
        tags: ["social", "education"],
        commitment: "high",
        scope: "local",
        skills: ["technical", "leadership"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Deploy sensor IoT untuk pertanian",
          "Aplikasi marketplace produk desa",
          "Training digital literacy",
          "Sistem informasi desa"
        ],
        impact: "20+ desa ter-digitalisasi, 500+ petani terbantu teknologi",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-smart-village-project.jpg"
      },
      global_climate_action: {
        name: "Global Climate Action",
        description: "Aksi kolaboratif lintas negara untuk mengatasi perubahan iklim di Asia Tenggara",
        category: "conservation",
        tags: ["conservation"],
        commitment: "high",
        scope: "global",
        skills: ["leadership", "communication"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Kampanye kesadaran perubahan iklim",
          "Proyek energi terbarukan regional",
          "Workshop sustainability lintas negara",
          "Research kolaboratif dampak iklim"
        ],
        impact: "4 negara terlibat, 50+ proyek energi hijau",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-global-climate-action.jpg"
      },
      asean_youth_exchange: {
        name: "ASEAN Youth Exchange",
        description: "Program pertukaran pemuda ASEAN untuk berbagi pengetahuan dan budaya",
        category: "education",
        tags: ["education"],
        commitment: "mid",
        scope: "global",
        skills: ["communication", "leadership"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Program pertukaran mahasiswa",
          "Cultural immersion workshops",
          "Leadership training internasional",
          "Collaborative social projects"
        ],
        impact: "500+ youth participants, 5 negara ASEAN terlibat",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-asean-youth-exchange.jpg"
      },
      ocean_guardian_network: {
        name: "Ocean Guardian Network",
        description: "Jaringan penjaga laut Asia-Pasifik untuk konservasi ekosistem laut",
        category: "conservation",
        tags: ["conservation", "ocean"],
        commitment: "high",
        scope: "global",
        skills: ["technical", "leadership"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Marine protected area establishment",
          "Coral reef restoration projects",
          "Sustainable fishing practices",
          "Ocean pollution monitoring"
        ],
        impact: "3 negara, 15 marine reserves, 200+ fishermen trained",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-ocean-guardian-network.jpg"
      },
      digital_literacy_asia: {
        name: "Digital Literacy Asia",
        description: "Program literasi digital untuk masyarakat kurang mampu di Asia",
        category: "technology",
        tags: ["education", "technical"],
        commitment: "mid",
        scope: "global",
        skills: ["technical", "communication"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Basic computer skills training",
          "Internet safety workshops",
          "Digital entrepreneurship programs",
          "Online learning platform development"
        ],
        impact: "4 negara, 2000+ people trained, 50+ digital centers",
        color: "#7b00ff", // Merauke Purple
        image: "../assets/img/image-program-catalog/program-digital-literacy-asia.jpg"
      },
      sustainable_cities_initiative: {
        name: "Sustainable Cities Initiative",
        description: "Inisiatif kota berkelanjutan dengan teknologi smart city",
        category: "technology",
        tags: ["social", "technical"],
        commitment: "high",
        scope: "global",
        skills: ["technical", "leadership"],
        rolesAvailable: ["mentor", "relawan"],
        activities: [
          "Smart traffic management systems",
          "Waste management optimization",
          "Green building certifications",
          "Urban farming initiatives"
        ],
        impact: "6 cities, 1M+ residents benefited, 30% waste reduction",
        color: "#B0E638", // Sabang Green
        image: "../assets/img/image-program-catalog/program-sustainable-cities-initiative.jpg"
      }
    }
  }

  setupEventListeners() {
    console.log("Setting up program catalog event listeners...")
    
    const setupFilters = () => {
      const filterBtns = document.querySelectorAll('.filter-btn')
      console.log("Found filter buttons:", filterBtns.length)
      
      if (filterBtns.length === 0) {
        console.log("No filter buttons found, retrying in 200ms...")
        setTimeout(setupFilters, 200)
        return
      }
      
      filterBtns.forEach((btn, index) => {
        console.log(`Setting up button ${index}:`, btn.dataset.filter, btn.textContent.trim())
        
        // remove previous handler if any
        try { btn.removeEventListener('click', btn._pcFilterHandler) } catch (e) {}
        
        const handler = (e) => {
          e.preventDefault()
          console.log("Filter button clicked:", e.currentTarget.dataset.filter)
          this.currentCategory = e.currentTarget.dataset.filter
          this.updateFilterButtons()
          this.debouncedRender()
        }
        btn._pcFilterHandler = handler
        btn.addEventListener('click', handler)
      })
      
      console.log("Filter buttons setup completed!")
    }
    
    setupFilters()
    setTimeout(setupFilters, 500)

    // Search input
    setTimeout(() => {
      const searchInput = document.getElementById('program-search')
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(this.searchTimeout)
          this.searchTimeout = setTimeout(() => {
            this.currentSearch = e.target.value.toLowerCase()
            this.debouncedRender()
          }, 300)
        })
      }
    }, 100)

    // Clear search
    setTimeout(() => {
      const clearBtn = document.getElementById('clear-search')
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.currentSearch = ''
          this.currentCategory = 'all'
          const inp = document.getElementById('program-search')
          if (inp) inp.value = ''
          this.updateFilterButtons()
          this.renderPrograms()
        })
      }
      
      this.setupAdvancedFilterListeners()
    }, 200)

    // Advanced filter button
    let advancedFilterBtn = document.getElementById('advanced-filter-btn')
    if (advancedFilterBtn) {
      const btnClone = advancedFilterBtn.cloneNode(true)
      advancedFilterBtn.parentNode.replaceChild(btnClone, advancedFilterBtn)
      advancedFilterBtn = document.getElementById('advanced-filter-btn')

      advancedFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.openAdvancedFilter()
      })
    }

    // Escape key handler (global)
    document.removeEventListener('keydown', this._boundEscHandler)
    document.addEventListener('keydown', this._boundEscHandler)
  }

  handleOutsideClick(event) {
    const modal = document.getElementById('advanced-filter-modal')
    const advancedFilterBtn = document.getElementById('advanced-filter-btn')
    
    if (modal && !modal.contains(event.target) && 
        advancedFilterBtn && !advancedFilterBtn.contains(event.target)) {
      this.closeAdvancedFilter()
    }
  }

  openAdvancedFilter() {
    let modal = document.getElementById('advanced-filter-modal');
    if (!modal) {
      this.createAdvancedFilterModal()
      modal = document.getElementById('advanced-filter-modal')
    }

    if (!modal) {
      console.error("Could not create advanced filter modal")
      return
    }

    modal.classList.remove('hidden')
    this.isAdvancedFilterOpen = true

    this.setupAdvancedFilterListeners()

    setTimeout(() => {
      document.removeEventListener('click', this._boundHandleOutsideClick)
      document.addEventListener('click', this._boundHandleOutsideClick)
    }, 0)
  }

  closeAdvancedFilter() {
    const modal = document.getElementById('advanced-filter-modal');
    if (modal) {
      modal.classList.add('hidden');
      this.isAdvancedFilterOpen = false;
      document.removeEventListener('click', this._boundHandleOutsideClick);
    }
  }

  resetAdvancedFilters() {
    this.advancedFilters = {
      commitment: [],
      scope: [],
      skills: [],
      roles: []
    }
    
    const checkboxes = document.querySelectorAll('#advanced-filter-modal input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      checkbox.checked = false
    })
  }

  debouncedRender() {
    clearTimeout(this.renderTimeout)
    this.renderTimeout = setTimeout(() => {
      this.renderPrograms()
    }, 100)
  }

  updateFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn')
    
    filterBtns.forEach((btn) => {
      const btnFilter = btn.dataset.filter
      
      if (btnFilter === this.currentCategory) {
        btn.classList.remove('bg-white', 'text-gray-700', 'border-gray-200', 'hover:bg-gray-50')
        btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm')
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm')
        btn.classList.add('bg-white', 'text-gray-700', 'border-gray-200', 'hover:bg-gray-50')
      }
    })
  }

  // Pastikan semua tombol filter menampilkan ikon + label sesuai data-filter
  ensureFilterButtonLabels() {
    // Peta untuk label tombol filter
    const mapping = {
      all: 'Semua',
      conservation: 'Lingkungan & Alam',
      education: 'Pendidikan',
      social: 'Sosial & Pangan',
      technology: 'Teknologi'
    }

    // Update setiap tombol filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const key = btn.dataset.filter || ''
      const label = mapping[key] || (key.charAt(0).toUpperCase() + key.slice(1))

      // Jika tombol sudah memiliki span.filter-label, cukup perbarui teksnya
      const existing = btn.querySelector('span.filter-label')
      const svg = btn.querySelector('svg')
      const svgHTML = svg ? svg.outerHTML : ''

      if (existing) {
        // Perbarui teks label
        const textSpan = existing.querySelector('span')
        if (textSpan) textSpan.textContent = label
        // Pastikan tetap terlihat
        existing.style.display = 'inline-flex'
      } else {
        // Buat markup konsisten: <span.filter-label><svg...><span>Label</span></span>
        btn.innerHTML = `<span class="filter-label inline-flex items-center" style="gap:.5rem;white-space:normal;">${svgHTML}<span>${label}</span></span>`
      }

      // Pastikan tombol tidak menyusut menjadi hanya ikon (gunakan min-width)
      btn.style.minWidth = '120px'
      btn.style.whiteSpace = 'normal'
    })
  }

  filterPrograms() {
    const cacheKey = JSON.stringify({
      category: this.currentCategory,
      search: this.currentSearch,
      advanced: this.advancedFilters
    })
    
    if (this.filteredCache.has(cacheKey)) {
      return this.filteredCache.get(cacheKey)
    }
    
    const filtered = Object.entries(this.programDatabase).filter(([id, program]) => {
      const categoryMatch = this.currentCategory === 'all' || program.category === this.currentCategory
      
      const searchMatch = !this.currentSearch || 
        (program.name && program.name.toLowerCase().includes(this.currentSearch)) ||
        (program.description && program.description.toLowerCase().includes(this.currentSearch)) ||
        (program.skills && program.skills.some(skill => skill.toLowerCase().includes(this.currentSearch))) ||
        (program.tags && program.tags.some(tag => tag.toLowerCase().includes(this.currentSearch)))
      
      const commitmentMatch = this.advancedFilters.commitment.length === 0 || 
        this.advancedFilters.commitment.includes(program.commitment)
      
      const scopeMatch = this.advancedFilters.scope.length === 0 || 
        this.advancedFilters.scope.includes(program.scope)
      
      const skillsMatch = this.advancedFilters.skills.length === 0 || 
        (program.skills && this.advancedFilters.skills.some(skill => program.skills.includes(skill)))
      
      const rolesMatch = this.advancedFilters.roles.length === 0 || 
        (program.rolesAvailable && this.advancedFilters.roles.some(role => program.rolesAvailable.includes(role)))
      
      return categoryMatch && searchMatch && commitmentMatch && scopeMatch && skillsMatch && rolesMatch
    })
    
    if (this.filteredCache.size > 50) {
      const firstKey = this.filteredCache.keys().next().value
      this.filteredCache.delete(firstKey)
    }
    this.filteredCache.set(cacheKey, filtered)
    
    return filtered
  }

  applyAdvancedFilters() {
    console.log("Applying advanced filters...")
    
    this.advancedFilters.commitment = Array.from(document.querySelectorAll('.commitment-filter:checked'))
      .map(cb => cb.value)
    
    this.advancedFilters.scope = Array.from(document.querySelectorAll('.scope-filter:checked'))
      .map(cb => cb.value)
    
    this.advancedFilters.skills = Array.from(document.querySelectorAll('.skills-filter:checked'))
      .map(cb => cb.value)
    
    this.advancedFilters.roles = Array.from(document.querySelectorAll('.roles-filter:checked'))
      .map(cb => cb.value)
    
    console.log("Advanced filters applied:", this.advancedFilters)
    
    this.updateAdvancedFilterButton()
    this.renderPrograms()
  }

  updateAdvancedFilterButton() {
    const advancedBtn = document.getElementById('advanced-filter-btn')
    if (!advancedBtn) return
    
    const hasActiveFilters = Object.values(this.advancedFilters).some(arr => arr.length > 0)
    
    if (hasActiveFilters) {
      advancedBtn.classList.remove('bg-white', 'text-gray-700', 'border-gray-200')
      advancedBtn.classList.add('bg-orange-500', 'text-white', 'border-orange-500')
      
      if (!advancedBtn.querySelector('.active-indicator')) {
        const indicator = document.createElement('span')
        indicator.className = 'active-indicator ml-2 bg-white text-orange-500 px-2 py-1 rounded-full text-xs font-medium'
        indicator.textContent = 'Aktif'
        advancedBtn.appendChild(indicator)
      }
    } else {
      advancedBtn.classList.remove('bg-orange-500', 'text-white', 'border-orange-500')
      advancedBtn.classList.add('bg-white', 'text-gray-700', 'border-gray-200')
      
      const indicator = advancedBtn.querySelector('.active-indicator')
      if (indicator) {
        indicator.remove()
      }
    }
  }

  renderPrograms() {
    console.log("=== RENDER PROGRAMS START ===")
    const grid = document.getElementById('programs-grid')
    const noResults = document.getElementById('no-results')
    
    console.log("Grid element:", grid)
    
    if (!grid) {
      console.error("Programs grid not found!")
      setTimeout(() => this.renderPrograms(), 300)
      return
    }
    
    const filteredPrograms = this.filterPrograms()
    console.log("Filtered programs count:", filteredPrograms.length)

    if (filteredPrograms.length === 0) {
      console.log("No programs found, showing empty message")
      grid.innerHTML = '<div class="col-span-full text-center py-16"><div class="text-gray-400 mb-4"><svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a7.966 7.966 0 00-6-2.5c-1.035 0-2.024.174-2.947.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg></div><h3 class="text-xl font-semibold text-gray-600 mb-2">Tidak ada program yang ditemukan</h3><p class="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p></div>'
      if (noResults) noResults.classList.remove('hidden')
      return
    }

    if (noResults) noResults.classList.add('hidden')

    // placeholder image as lightweight data URI
    const placeholderSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
         <rect width="100%" height="100%" fill="#f3f4f6"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="28">Gambar Program (Placeholder)</text>
       </svg>`
    )

    grid.innerHTML = filteredPrograms.map(([id, program]) => `
      <div class="program-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200" 
           data-program-id="${id}" data-category="${program.category}">
        
        <!-- Image placeholder (pinned at top) -->
        <div class="w-full h-44 overflow-hidden bg-gray-100">
          <img src="${program.image ? program.image : placeholderSrc}" alt="${this.escapeHtml(program.name)}" class="w-full h-full object-cover">
        </div>

        <!-- Header dengan warna solid -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full" style="background-color: ${program.color}"></div>
              <span class="text-sm font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded">
                ${this.getCategoryLabel(program.category)}
              </span>
            </div>
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ${this.getCommitmentLabel(program.commitment)}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${program.name}</h3>
          <p class="text-gray-600 text-sm line-clamp-2">${program.description}</p>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Info ringkas -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${this.getScopeLabel(program.scope)}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              ${program.rolesAvailable.map(role => this.getRoleLabel(role)).join(', ')}
            </div>
          </div>
          
          <!-- Impact -->
          <div class="mb-6">
            <p class="text-xs text-gray-500 font-medium mb-1">DAMPAK</p>
            <p class="text-sm text-gray-700">${program.impact}</p>
          </div>
          
          <!-- Action buttons -->
          <div class="flex space-x-3">
            <button class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200" 
                    onclick="window.programCatalog.joinProgram('${id}')">
              Bergabung
            </button>
            <button class="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200" 
                    onclick="window.programCatalog.showProgramInfo('${id}')">
              Detail
            </button>
          </div>
        </div>
      </div>
    `).join('')

    console.log("Programs rendered successfully!")
    
    setTimeout(() => {
      this.setupEventListeners()
    }, 100)
  }

  // small helper for escaping simple HTML in dynamic text to avoid injection
  escapeHtml(str) {
    if (!str) return ''
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')
  }

  highlightProgram(programId) {
    const targetCard = document.querySelector(`[data-program-id="${programId}"]`)
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetCard.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
      
      setTimeout(() => {
        targetCard.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
      }, 4000)
    }
  }

  checkForHighlight() {
    const highlightProgram = localStorage.getItem('highlighted_program')
    if (highlightProgram) {
      setTimeout(() => {
        this.highlightProgram(highlightProgram)
        localStorage.removeItem('highlighted_program')
      }, 500)
    }
  }

  getCategoryLabel(category) {
    const labels = {
      'education': 'Pendidikan',
      'conservation': 'Lingkungan & Alam',
      'social': 'Sosial & Pangan',
      'technology': 'Teknologi'
    }
    return labels[category] || category
  }

  getScopeLabel(scope) {
    const labels = {
      'local': 'Komunitas Lokal',
      'city': 'Kota/Kabupaten',
      'national': 'Nasional',
      'global': 'Global'
    }
    return labels[scope] || scope
  }

  getCommitmentLabel(commitment) {
    const labels = {
      'low': '≤ 2 jam/minggu',
      'mid': '2-5 jam/minggu',
      'high': '≥ 5 jam/minggu'
    }
    return labels[commitment] || commitment
  }

  getRoleLabel(role) {
    const labels = {
      'relawan': 'Relawan',
      'mentor': 'Mentor',
      'donatur': 'Donatur'
    }
    return labels[role] || role
  }

  joinProgram(programId) {
    console.log("Join program:", programId)
    // Placeholder: open program detail modal or trigger join flow
    // Keep behavior minimal for now
    this.showProgramInfo(programId)
  }

  // Program detail modal creation and show/close functions
  createProgramDetailModal() {
    if (document.getElementById('program-detail-modal')) return
    console.log("Creating program detail modal...")

    const modalHTML = `
      <div id="program-detail-modal" class="program-detail-overlay hidden">
        <div class="max-w-3xl w-full mx-4">
          <div class="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div class="relative">
              <div id="program-detail-image" class="w-full h-48 bg-gray-100"></div>
              <button id="program-detail-close" class="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="p-6">
              <h3 id="program-detail-title" class="text-2xl font-bold mb-2 text-batu-gray"></h3>
              <p id="program-detail-short" class="text-gray-600 mb-4"></p>

              <div id="program-detail-meta" class="text-sm text-gray-500 space-y-3 mb-4"></div>

              <div id="program-detail-desc" class="text-gray-700 mb-6"></div>

              <div class="flex gap-3">
                <button id="program-detail-join" class="flex-1 py-3 bg-nusantara-green text-white rounded-lg font-semibold">Bergabung</button>
                <button id="program-detail-close-2" class="px-4 py-3 bg-gray-100 rounded-lg">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML('beforeend', modalHTML)

    const overlay = document.getElementById('program-detail-modal')
    // close handlers
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeProgramDetailModal()
    })
    overlay.querySelectorAll('#program-detail-close, #program-detail-close-2').forEach(b => {
      b.addEventListener('click', () => this.closeProgramDetailModal())
    })
    overlay.querySelector('#program-detail-join').addEventListener('click', () => {
      const pid = overlay.dataset.currentProgramId
      if (pid) {
        // Implement join logic here; for now just alert and close
        alert(`Terima kasih! Anda memulai proses bergabung untuk program: ${this.programDatabase[pid]?.name || pid}`)
        this.closeProgramDetailModal()
      }
    })
  }

  showProgramInfo(programId) {
    console.log("Show program info:", programId)
    // Create modal if missing
    this.createProgramDetailModal()
    const overlay = document.getElementById('program-detail-modal')
    if (!overlay) return

    const program = this.programDatabase[programId] || Object.values(this.programDatabase).find(p => (p.id == programId || p.programId == programId || p.key == programId))
    if (!program) {
      console.warn('Program not found for id', programId)
      alert(`Info program tidak ditemukan: ${programId}`)
      return
    }

    // placeholder image as lightweight data URI
    const placeholderSrc = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
         <rect width="100%" height="100%" fill="#f3f4f6"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="28">Gambar Program (Placeholder)</text>
       </svg>`
    )

    const imgContainer = overlay.querySelector('#program-detail-image')
    imgContainer.innerHTML = `<img src="${program.image ? program.image : placeholderSrc}" alt="${this.escapeHtml(program.name)}" class="w-full h-full object-cover">`

    overlay.querySelector('#program-detail-title').textContent = program.name || ''
    overlay.querySelector('#program-detail-short').textContent = program.description ? (program.description.substring(0,140) + (program.description.length > 140 ? '...' : '')) : ''
    overlay.querySelector('#program-detail-meta').innerHTML = `
      <div><strong>Kategori:</strong> ${this.getCategoryLabel(program.category)}</div>
      <div><strong>Cakupan:</strong> ${this.getScopeLabel(program.scope)}</div>
      <div><strong>Komitmen:</strong> ${this.getCommitmentLabel(program.commitment)}</div>
      <div><strong>Peran:</strong> ${(program.rolesAvailable && program.rolesAvailable.length) ? program.rolesAvailable.map(r => this.getRoleLabel(r)).join(', ') : '-'}</div>
    `
    overlay.querySelector('#program-detail-desc').innerHTML = program.description ? this.escapeHtml(program.description).replace(/\n/g, '<br>') : '<em>Tidak ada deskripsi lebih lanjut.</em>'

    overlay.dataset.currentProgramId = programId
    overlay.classList.remove('hidden')
    document.addEventListener('keydown', this._boundEscHandler)
  }

  closeProgramDetailModal() {
    const overlay = document.getElementById('program-detail-modal')
    if (!overlay) return
    overlay.classList.add('hidden')
    overlay.dataset.currentProgramId = ''
    document.removeEventListener('keydown', this._boundEscHandler)
  }

  createAdvancedFilterModal() {
    console.log("Creating advanced filter modal...")
    
    const modalHTML = `
      <div id="advanced-filter-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Filter Lanjutan</h3>
              <button id="close-advanced-filter" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Commitment Level Filter -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-900">Tingkat Komitmen</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded border-gray-300" value="low">
                    <span class="text-sm text-gray-700">≤ 2 jam/minggu</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded border-gray-300" value="mid">
                    <span class="text-sm text-gray-700">2-5 jam/minggu</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded border-gray-300" value="high">
                    <span class="text-sm text-gray-700">≥ 5 jam/minggu</span>
                  </label>
                </div>
              </div>

              <!-- Scope Filter -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-900">Cakupan Program</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded border-gray-300" value="local">
                    <span class="text-sm text-gray-700">Komunitas Lokal</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded border-gray-300" value="city">
                    <span class="text-sm text-gray-700">Kota/Kabupaten</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded border-gray-300" value="national">
                    <span class="text-sm text-gray-700">Nasional</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded border-gray-300" value="global">
                    <span class="text-sm text-gray-700">Global</span>
                  </label>
                </div>
              </div>

              <!-- Skills Filter -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-900">Keterampilan yang Dibutuhkan</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded border-gray-300" value="leadership">
                    <span class="text-sm text-gray-700">Kepemimpinan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded border-gray-300" value="communication">
                    <span class="text-sm text-gray-700">Komunikasi</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded border-gray-300" value="technical">
                    <span class="text-sm text-gray-700">Teknis</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded border-gray-300" value="creative">
                    <span class="text-sm text-gray-700">Kreatif</span>
                  </label>
                </div>
              </div>

              <!-- Roles Filter -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-gray-900">Peran yang Tersedia</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded border-gray-300" value="relawan">
                    <span class="text-sm text-gray-700">Relawan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded border-gray-300" value="mentor">
                    <span class="text-sm text-gray-700">Mentor</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded border-gray-300" value="donatur">
                    <span class="text-sm text-gray-700">Donatur</span>
                  </label>
                </div>
              </div>

            </div>
            
            <!-- Action Buttons -->
            <div class="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button id="apply-advanced-filter" class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                Terapkan Filter
              </button>
              <button id="reset-advanced-filter" class="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHTML)
    console.log("Advanced filter modal created successfully!")
  }

  setupAdvancedFilterListeners() {
    let modal = document.getElementById('advanced-filter-modal')
    if (!modal) {
      this.createAdvancedFilterModal()
      modal = document.getElementById('advanced-filter-modal')
    }

    const closeBtn = modal.querySelector('#close-advanced-filter')
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.closeAdvancedFilter()
      })
    }

    const applyBtn = modal.querySelector('#apply-advanced-filter')
    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.applyAdvancedFilters()
        this.closeAdvancedFilter()
      })
    }

    const resetBtn = modal.querySelector('#reset-advanced-filter')
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.resetAdvancedFilters()
      })
    }

    document.removeEventListener('keydown', this._boundEscHandler)
    document.addEventListener('keydown', this._boundEscHandler)
  }

  createAdvancedFilterButton() {
    console.log("Creating advanced filter button...")
    
    const searchContainer = document.querySelector('.max-w-2xl .flex.gap-4')
    if (searchContainer && !document.getElementById('advanced-filter-btn')) {
      console.log("Adding advanced filter button to search bar area...")
      
      const advancedBtnHTML = `
        <button id="advanced-filter-btn" class="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center whitespace-nowrap">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          Filter Lanjutan
        </button>
      `
      
      searchContainer.insertAdjacentHTML('beforeend', advancedBtnHTML)
    }
    
    if (!document.getElementById('advanced-filter-modal')) {
      this.createAdvancedFilterModal()
    }
    
    setTimeout(() => {
      this.setupEventListeners()
    }, 100)
    
    console.log("Advanced filter button created successfully!")
  }
}

// Initialization functions
function initializeProgramCatalog() {
  console.log("=== INITIALIZING PROGRAM CATALOG ===")
  
  setTimeout(() => {
    if (!window.programCatalog) {
      console.log("Creating new ProgramCatalog instance...")
      window.programCatalog = new ProgramCatalog()
      console.log("✅ Program Catalog initialized successfully")
    } else {
      console.log("Program Catalog already exists, refreshing...")
      window.programCatalog.renderPrograms()
      window.programCatalog.setupAdvancedFilterListeners()
    }
  }, 200)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProgramCatalog)
} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
  console.log("DOM already loaded, initializing immediately...")
  initializeProgramCatalog()
}

setTimeout(() => {
  if (!window.programCatalog) {
    console.log("⚠️ Fallback initialization triggered...")
    initializeProgramCatalog()
  }
}, 1500)

// Global utility functions
window.testProgramCatalog = () => {
  console.log("=== TESTING PROGRAM CATALOG ===")
  console.log("Program catalog exists:", !!window.programCatalog)
  
  if (window.programCatalog) {
    console.log("Database:", window.programCatalog.programDatabase)
    console.log("Current category:", window.programCatalog.currentCategory)
    window.programCatalog.renderPrograms()
  } else {
    console.log("Program catalog not found - creating new instance...")
    window.programCatalog = new ProgramCatalog()
  }
}

window.forceRenderPrograms = () => {
  console.log("=== FORCE RENDER PROGRAMS ===")
  
  if (!document.getElementById('programs-grid')) {
    console.log("Grid not found, creating it...")
    const catalogSection = document.getElementById('program-catalog')
    if (catalogSection && !document.getElementById('programs-grid')) {
      const gridHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="programs-grid">
            <!-- Programs will be rendered here -->
          </div>
          <div id="no-results" class="hidden text-center py-16">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a7.966 7.966 0 00-6-2.5c-1.035 0-2.024.174-2.947.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Tidak ada program yang ditemukan</h3>
            <p class="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
          </div>
        </div>
      `
      catalogSection.insertAdjacentHTML('beforeend', gridHTML)
    }
  }
  
  if (window.programCatalog) {
    window.programCatalog.renderPrograms()
  } else {
    window.programCatalog = new ProgramCatalog()
  }
}

window.highlightProgram = (programId) => {
  if (window.programCatalog) {
    window.programCatalog.highlightProgram(programId)
  }
}

window.createMissingFilterButtons = () => {
  console.log("=== CREATING MISSING FILTER BUTTONS ===")
  
  const expectedButtons = [
    { filter: 'all', text: 'Semua', active: true },
    { filter: 'conservation', text: 'Lingkungan & Alam', active: false },
    { filter: 'education', text: 'Pendidikan', active: false },
    { filter: 'social', text: 'Sosial & Pangan', active: false },
    { filter: 'technology', text: 'Teknologi', active: false }
  ]
  
  let filterContainer = document.querySelector('.flex.flex-wrap.justify-center')
  
  if (!filterContainer) {
    const catalogSection = document.getElementById('program-catalog')
    if (catalogSection) {
      const containerHTML = `
        <div class="mb-8 w-full">
          <div class="flex flex-wrap justify-center gap-3" id="filter-buttons-container">
          </div>
        </div>
      `
      catalogSection.insertAdjacentHTML('afterbegin', containerHTML)
      filterContainer = document.getElementById('filter-buttons-container')
    }
  }
  
  if (!filterContainer) {
    console.error("Could not create filter container!")
    return
  }
  
  filterContainer.innerHTML = ''
  
  expectedButtons.forEach(btnData => {
    const activeClass = btnData.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
    
    const buttonHTML = `
      <button class="filter-btn px-4 py-2.5 ${activeClass} border rounded-lg font-medium transition-colors duration-200" data-filter="${btnData.filter}">
        <span>${btnData.text}</span>
      </button>
    `
    filterContainer.insertAdjacentHTML('beforeend', buttonHTML)
  })
  
  console.log("All filter buttons created successfully!")
}