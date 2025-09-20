// Program Catalog JavaScript
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
    
    // Performance optimization
    this.filteredCache = new Map()
    this.renderTimeout = null
    this.searchTimeout = null
    
    console.log("Program database loaded:", Object.keys(this.programDatabase).length, "programs")
    this.init()
  }

  init() {
    console.log("ProgramCatalog init() called")
    this.setupEventListeners()
    
    // Multiple attempts to render with increasing delays
    setTimeout(() => {
      console.log("First render attempt...")
      this.renderPrograms()
    }, 100)
    
    setTimeout(() => {
      console.log("Second render attempt...")
      this.renderPrograms()
    }, 500)
    
    setTimeout(() => {
      console.log("Third render attempt...")
      this.renderPrograms()
      this.checkForHighlight()
    }, 1000)
  }

  initializeProgramDatabase() {
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
        gradient: "from-blue-500 to-purple-600"
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
        gradient: "from-indigo-500 to-blue-600"
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
        gradient: "from-green-500 to-emerald-600"
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
        gradient: "from-cyan-500 to-blue-600",
        
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
        gradient: "from-orange-500 to-red-600",
        
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
        gradient: "from-yellow-500 to-orange-600",
        
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
        gradient: "from-purple-500 to-pink-600",
        
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
          "Training digital literacy"
        ],
        impact: "20+ desa ter-digitalisasi, 500+ petani terbantu teknologi",
        gradient: "from-teal-500 to-green-600",
        
      }
    }
  }

  setupEventListeners() {
    console.log("Setting up event listeners...")
    
    // Multiple attempts to setup filter buttons
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
        
        // Remove existing listeners to avoid duplicates
        btn.removeEventListener('click', this.handleFilterClick)
        
        // Add new listener with debouncing
        btn.addEventListener('click', (e) => {
          console.log("Filter button clicked:", e.currentTarget.dataset.filter)
          this.currentCategory = e.currentTarget.dataset.filter
          this.updateFilterButtons()
          this.debouncedRender()
        })
      })
      
      console.log("Filter buttons setup completed!")
    }
    
    // Try immediately and with delays
    setupFilters()
    setTimeout(setupFilters, 500)
    setTimeout(setupFilters, 1000)

    // Search input with debouncing
    setTimeout(() => {
      const searchInput = document.getElementById('program-search')
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(this.searchTimeout)
          this.searchTimeout = setTimeout(() => {
            this.currentSearch = e.target.value.toLowerCase()
            this.debouncedRender()
          }, 300) // 300ms debounce
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
          document.getElementById('program-search').value = ''
          this.updateFilterButtons()
          this.renderPrograms()
        })
      }
      
      // Advanced filter modal setup with retry mechanism
      this.setupAdvancedFilterListeners()
    }, 200)
  }

  openAdvancedFilterModal() {
    console.log("Opening advanced filter modal...")
    const modal = document.getElementById('advanced-filter-modal')
    if (modal) {
      modal.classList.remove('hidden')
      // Lock body scroll for better UX
      document.body.style.overflow = 'hidden'
      console.log("Modal opened and body scroll locked")
    } else {
      console.error("Advanced filter modal not found!")
    }
  }

  closeAdvancedFilterModal() {
    console.log("Closing advanced filter modal...")
    const modal = document.getElementById('advanced-filter-modal')
    if (modal) {
      modal.classList.add('hidden')
      // Restore body scroll
      document.body.style.overflow = ''
      console.log("Modal closed and body scroll restored")
    }
  }

  setupAdvancedFilterListeners() {
    // Store reference to this for use in event handlers
    const self = this
    
    // Check if event delegation is already setup
    if (document.hasAttribute('data-advanced-filter-setup')) {
      console.log("Advanced filter listeners already setup, skipping...")
      return
    }
    
    // Use robust event delegation with matches() and closest()
    document.addEventListener('click', function(e) {
      console.log("Document click detected:", e.target.id, e.target.className)
      
      // Advanced filter button click - more robust detection
      if (e.target.matches('#advanced-filter-btn') || 
          e.target.closest('#advanced-filter-btn') ||
          e.target.matches('#advanced-filter-btn *')) {
        e.preventDefault()
        e.stopPropagation()
        console.log("Advanced filter button clicked via robust delegation!")
        self.openAdvancedFilterModal()
        return
      }
      
      // Close button click
      if (e.target.matches('#close-advanced-filter') || 
          e.target.closest('#close-advanced-filter') ||
          e.target.matches('#close-advanced-filter *')) {
        e.preventDefault()
        e.stopPropagation()
        console.log("Close button clicked")
        self.closeAdvancedFilterModal()
        return
      }
      
      // Apply filter button click
      if (e.target.matches('#apply-advanced-filter')) {
        e.preventDefault()
        e.stopPropagation()
        console.log("Apply filter button clicked")
        if (self.applyAdvancedFilters) {
          self.applyAdvancedFilters()
        }
        self.closeAdvancedFilterModal()
        return
      }
      
      // Reset filter button click
      if (e.target.matches('#reset-advanced-filter')) {
        e.preventDefault()
        e.stopPropagation()
        console.log("Reset filter button clicked")
        if (self.resetAdvancedFilters) {
          self.resetAdvancedFilters()
        }
        return
      }
      
      // Click outside modal to close (click on backdrop)
      if (e.target.matches('#advanced-filter-modal')) {
        console.log("Clicked outside modal, closing...")
        self.closeAdvancedFilterModal()
        return
      }
    })
    
    // Also handle Escape key to close modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('advanced-filter-modal')
        if (modal && !modal.classList.contains('hidden')) {
          console.log("Escape key pressed, closing modal...")
          self.closeAdvancedFilterModal()
        }
      }
    })
    
    // Mark as setup
    document.setAttribute('data-advanced-filter-setup', 'true')
    console.log("Advanced filter listeners setup with robust event delegation")
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
        btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300')
        btn.classList.add('bg-nusantara-green', 'text-white', 'shadow-lg')
      } else {
        btn.classList.remove('bg-nusantara-green', 'text-white', 'shadow-lg')
        btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300')
      }
    })
  }

  filterPrograms() {
    // Create cache key
    const cacheKey = JSON.stringify({
      category: this.currentCategory,
      search: this.currentSearch,
      advanced: this.advancedFilters
    })
    
    // Check cache first
    if (this.filteredCache.has(cacheKey)) {
      return this.filteredCache.get(cacheKey)
    }
    
    const filtered = Object.entries(this.programDatabase).filter(([id, program]) => {
      // Filter by category
      const categoryMatch = this.currentCategory === 'all' || program.category === this.currentCategory
      
      // Filter by search
      const searchMatch = !this.currentSearch || 
        program.name.toLowerCase().includes(this.currentSearch) ||
        program.description.toLowerCase().includes(this.currentSearch) ||
        program.skills.some(skill => skill.toLowerCase().includes(this.currentSearch)) ||
        program.tags.some(tag => tag.toLowerCase().includes(this.currentSearch))
      
      // Advanced filters
      const commitmentMatch = this.advancedFilters.commitment.length === 0 || 
        this.advancedFilters.commitment.includes(program.commitment)
      
      const scopeMatch = this.advancedFilters.scope.length === 0 || 
        this.advancedFilters.scope.includes(program.scope)
      
      const skillsMatch = this.advancedFilters.skills.length === 0 || 
        this.advancedFilters.skills.some(skill => program.skills.includes(skill))
      
      const rolesMatch = this.advancedFilters.roles.length === 0 || 
        this.advancedFilters.roles.some(role => program.rolesAvailable.includes(role))
      
      return categoryMatch && searchMatch && commitmentMatch && scopeMatch && skillsMatch && rolesMatch
    })
    
    // Cache result (limit cache size)
    if (this.filteredCache.size > 50) {
      const firstKey = this.filteredCache.keys().next().value
      this.filteredCache.delete(firstKey)
    }
    this.filteredCache.set(cacheKey, filtered)
    
    return filtered
  }

  applyAdvancedFilters() {
    console.log("Applying advanced filters...")
    
    // Get commitment filters
    this.advancedFilters.commitment = Array.from(document.querySelectorAll('.commitment-filter:checked'))
      .map(cb => cb.value)
    
    // Get scope filters
    this.advancedFilters.scope = Array.from(document.querySelectorAll('.scope-filter:checked'))
      .map(cb => cb.value)
    
    // Get skills filters
    this.advancedFilters.skills = Array.from(document.querySelectorAll('.skills-filter:checked'))
      .map(cb => cb.value)
    
    // Get roles filters
    this.advancedFilters.roles = Array.from(document.querySelectorAll('.roles-filter:checked'))
      .map(cb => cb.value)
    
    console.log("Advanced filters applied:", this.advancedFilters)
    
    // Update advanced filter button to show active state
    this.updateAdvancedFilterButton()
    
    // Re-render programs with new filters
    this.renderPrograms()
  }

  resetAdvancedFilters() {
    console.log("Resetting advanced filters...")
    
    // Clear all checkboxes
    document.querySelectorAll('.commitment-filter, .scope-filter, .skills-filter, .roles-filter')
      .forEach(cb => cb.checked = false)
    
    // Reset filter arrays
    this.advancedFilters = {
      commitment: [],
      scope: [],
      skills: [],
      roles: []
    }
    
    // Update button state
    this.updateAdvancedFilterButton()
    
    // Re-render programs
    this.renderPrograms()
  }

  updateAdvancedFilterButton() {
    const advancedBtn = document.getElementById('advanced-filter-btn')
    if (!advancedBtn) return
    
    const hasActiveFilters = Object.values(this.advancedFilters).some(arr => arr.length > 0)
    
    if (hasActiveFilters) {
      advancedBtn.classList.remove('bg-samudra-blue', 'hover:bg-blue-700')
      advancedBtn.classList.add('bg-tradisi-gold', 'hover:bg-yellow-600')
      
      // Add active indicator
      if (!advancedBtn.querySelector('.active-indicator')) {
        const indicator = document.createElement('span')
        indicator.className = 'active-indicator ml-2 bg-white text-tradisi-gold px-2 py-1 rounded-full text-xs font-bold'
        indicator.textContent = 'Aktif'
        advancedBtn.appendChild(indicator)
      }
    } else {
      advancedBtn.classList.remove('bg-tradisi-gold', 'hover:bg-yellow-600')
      advancedBtn.classList.add('bg-samudra-blue', 'hover:bg-blue-700')
      
      // Remove active indicator
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
    console.log("No results element:", noResults)
    console.log("Document ready state:", document.readyState)
    console.log("Program catalog section exists:", !!document.getElementById('program-catalog'))
    
    if (!grid) {
      console.error("Programs grid not found! Available elements:")
      const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id)
      console.log("All element IDs:", allIds)
      console.log("Looking for 'programs-grid' in:", allIds.includes('programs-grid'))
      
      // Try to find the grid in different ways
      const gridByClass = document.querySelector('.grid.grid-cols-1')
      console.log("Grid by class:", gridByClass)
      
      // Check if component is loaded
      const catalogSection = document.getElementById('program-catalog')
      if (catalogSection) {
        console.log("Catalog section innerHTML length:", catalogSection.innerHTML.length)
        console.log("Catalog section contains grid:", catalogSection.innerHTML.includes('programs-grid'))
      }
      
      console.error("Retrying in 300ms...")
      setTimeout(() => this.renderPrograms(), 300)
      return
    }
    
    console.log("Database keys:", Object.keys(this.programDatabase))
    console.log("Current category:", this.currentCategory)
    console.log("Current search:", this.currentSearch)
    
    const filteredPrograms = this.filterPrograms()
    console.log("Filtered programs:", filteredPrograms)
    console.log("Filtered programs count:", filteredPrograms.length)

    if (filteredPrograms.length === 0) {
      console.log("No programs found, showing empty message")
      grid.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-xl">Tidak ada program yang ditemukan</p><p class="text-gray-400">Coba ubah filter atau kata kunci pencarian</p></div>'
      if (noResults) noResults.classList.remove('hidden')
      return
    }

    if (noResults) noResults.classList.add('hidden')
    
    grid.innerHTML = filteredPrograms.map(([id, program]) => `
      <div class="program-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300" 
           data-program-id="${id}" data-category="${program.category}">
        <div class="h-48 bg-gradient-to-br ${program.gradient} relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute top-4 left-4">
            <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              ${this.getCategoryLabel(program.category)}
            </span>
          </div>
          <div class="absolute bottom-4 right-4">
            <div class="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              ${this.getCommitmentLabel(program.commitment)}
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="mb-3">
            <h3 class="text-xl font-bold text-batu-gray">${program.name}</h3>
          </div>
          
          <p class="text-gray-600 mb-4 leading-relaxed">${program.description}</p>
          
          <div class="space-y-2 mb-4 text-sm">
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${this.getScopeLabel(program.scope)}
            </div>
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ${this.getCommitmentLabel(program.commitment)}
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${program.rolesAvailable.map(role => `
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                ${this.getRoleLabel(role)}
              </span>
            `).join('')}
          </div>
          
          <div class="flex gap-2">
            <button class="flex-1 py-2 bg-gradient-to-r from-nusantara-green to-samudra-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all" 
                    onclick="window.programCatalog.joinProgram('${id}')">
              Ikut Program
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all" 
                    onclick="window.programCatalog.showProgramInfo('${id}')">
              Info
            </button>
          </div>
        </div>
      </div>
    `).join('')

    console.log("Programs rendered successfully!")
    
    // Setup filter buttons after successful render
    setTimeout(() => {
      this.setupEventListeners()
      
      // Check if all filter buttons are present
      const filterBtns = document.querySelectorAll('.filter-btn')
      console.log("Filter buttons after render:", filterBtns.length)
      
      if (filterBtns.length < 5) {
        console.log("Missing filter buttons detected, creating them...")
        if (window.createMissingFilterButtons) {
          window.createMissingFilterButtons()
        }
      }
      
      // Check if advanced filter button exists
      const advancedBtn = document.getElementById('advanced-filter-btn')
      console.log("Advanced filter button exists:", !!advancedBtn)
      
      if (!advancedBtn) {
        console.log("Advanced filter button missing, creating it...")
        this.createAdvancedFilterButton()
      }
    }, 100)
  }

  highlightProgram(programId) {
    const targetCard = document.querySelector(`[data-program-id="${programId}"]`)
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      targetCard.classList.add('ring-4', 'ring-indigo-500', 'ring-opacity-50')
      
      setTimeout(() => {
        targetCard.classList.remove('ring-4', 'ring-indigo-500', 'ring-opacity-50')
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
    alert(`Bergabung dengan program: ${this.programDatabase[programId]?.name}`)
  }

  showProgramInfo(programId) {
    console.log("Show program info:", programId)
    alert(`Info program: ${this.programDatabase[programId]?.name}`)
  }

  filterByRegion(regionName) {
    console.log("Filtering programs by region:", regionName)
    
    // Clear current search and category
    this.currentSearch = ''
    this.currentCategory = 'all'
    
    // Update search input
    const searchInput = document.getElementById('program-search')
    if (searchInput) {
      searchInput.value = `Wilayah: ${regionName}`
    }
    
    // Filter programs that are available in this region
    const regionPrograms = Object.entries(this.programDatabase).filter(([id, program]) => {
      // Check if program has locations in this region
      if (window.mapSystem && window.mapSystem.programLocations[id]) {
        const programLocation = window.mapSystem.programLocations[id]
        return programLocation.provinces.includes(regionName) || 
               programLocation.regions.includes(regionName)
      }
      return false
    })
    
    // Update filter buttons to show "all" as active
    this.updateFilterButtons()
    
    // Render filtered programs
    this.renderFilteredPrograms(regionPrograms)
    
    // Show region filter indicator
    this.showRegionFilterIndicator(regionName, regionPrograms.length)
  }

  renderFilteredPrograms(programs) {
    const grid = document.getElementById('programs-grid')
    const noResults = document.getElementById('no-results')
    
    if (!grid) {
      console.error("Programs grid not found")
      return
    }
    
    if (programs.length === 0) {
      grid.innerHTML = ''
      if (noResults) {
        noResults.classList.remove('hidden')
      }
      return
    }
    
    if (noResults) {
      noResults.classList.add('hidden')
    }
    
    grid.innerHTML = programs.map(([id, program]) => `
      <div class="program-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300" 
           data-program-id="${id}" data-category="${program.category}">
        <div class="h-48 bg-gradient-to-br ${program.gradient} relative overflow-hidden">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute top-4 left-4">
            <span class="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              ${this.getCategoryLabel(program.category)}
            </span>
          </div>
          <div class="absolute bottom-4 right-4">
            <div class="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              ${this.getCommitmentLabel(program.commitment)}
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="mb-3">
            <h3 class="text-xl font-bold text-batu-gray">${program.name}</h3>
          </div>
          
          <p class="text-gray-600 mb-4 leading-relaxed">${program.description}</p>
          
          <div class="space-y-2 mb-4 text-sm">
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${this.getScopeLabel(program.scope)}
            </div>
            <div class="flex items-center text-gray-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ${this.getCommitmentLabel(program.commitment)}
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-4">
            ${program.rolesAvailable.map(role => `
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                ${this.getRoleLabel(role)}
              </span>
            `).join('')}
          </div>
          
          <div class="flex gap-2">
            <button class="flex-1 py-2 bg-gradient-to-r from-nusantara-green to-samudra-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all" 
                    onclick="window.programCatalog.joinProgram('${id}')">
              Ikut Program
            </button>
            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    onclick="window.programCatalog.showProgramInfo('${id}')">
              Info
            </button>
          </div>
        </div>
      </div>
    `).join('')
  }

  showRegionFilterIndicator(regionName, programCount) {
    // Create or update region filter indicator
    let indicator = document.getElementById('region-filter-indicator')
    
    if (!indicator) {
      indicator = document.createElement('div')
      indicator.id = 'region-filter-indicator'
      indicator.className = 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl'
      
      // Insert after search bar
      const searchContainer = document.querySelector('.max-w-2xl.mx-auto.mb-8')
      if (searchContainer) {
        searchContainer.insertAdjacentElement('afterend', indicator)
      }
    }
    
    indicator.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="font-semibold text-blue-800">Filter Wilayah: ${regionName}</span>
          <span class="ml-2 px-2 py-1 bg-blue-200 text-blue-800 text-sm rounded-full">${programCount} Program</span>
        </div>
        <button onclick="window.programCatalog.clearRegionFilter()" class="text-blue-600 hover:text-blue-800 font-medium text-sm">
          Hapus Filter
        </button>
      </div>
    `
  }

  clearRegionFilter() {
    // Remove region filter indicator
    const indicator = document.getElementById('region-filter-indicator')
    if (indicator) {
      indicator.remove()
    }
    
    // Clear search
    const searchInput = document.getElementById('program-search')
    if (searchInput) {
      searchInput.value = ''
    }
    
    // Reset filters
    this.currentSearch = ''
    this.currentCategory = 'all'
    
    // Re-render all programs
    this.renderPrograms()
  }

  createAdvancedFilterButton() {
    console.log("Creating advanced filter button...")
    
    // Find search bar container (new position)
    const searchContainer = document.querySelector('.max-w-2xl .flex.gap-4')
    if (searchContainer && !document.getElementById('advanced-filter-btn')) {
      console.log("Adding advanced filter button to search bar area...")
      
      // Create advanced filter button
      const advancedBtnHTML = `
        <button id="advanced-filter-btn" class="px-6 py-3 bg-samudra-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center whitespace-nowrap">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
          Filter Lanjutan
        </button>
      `
      
      searchContainer.insertAdjacentHTML('beforeend', advancedBtnHTML)
    } else {
      console.log("Search container not found or button already exists")
    }
    
    // Create modal if it doesn't exist
    if (!document.getElementById('advanced-filter-modal')) {
      this.createAdvancedFilterModal()
    }
    
    // Setup event listeners
    setTimeout(() => {
      this.setupEventListeners()
    }, 100)
    
    console.log("Advanced filter button created successfully!")
  }

  createAdvancedFilterModal() {
    console.log("Creating advanced filter modal...")
    
    const modalHTML = `
      <div id="advanced-filter-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold text-batu-gray">Filter Lanjutan Program</h3>
              <button id="close-advanced-filter" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Commitment Level Filter -->
              <div class="space-y-3">
                <h4 class="font-semibold text-batu-gray">Tingkat Komitmen</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded" value="low">
                    <span class="text-sm">≤ 2 jam/minggu (Rendah)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded" value="mid">
                    <span class="text-sm">2-5 jam/minggu (Sedang)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="commitment-filter mr-3 rounded" value="high">
                    <span class="text-sm">≥ 5 jam/minggu (Tinggi)</span>
                  </label>
                </div>
              </div>

              <!-- Scope Filter -->
              <div class="space-y-3">
                <h4 class="font-semibold text-batu-gray">Cakupan Program</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded" value="local">
                    <span class="text-sm">Komunitas Lokal</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded" value="city">
                    <span class="text-sm">Kota/Kabupaten</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded" value="national">
                    <span class="text-sm">Nasional</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="scope-filter mr-3 rounded" value="global">
                    <span class="text-sm">Global</span>
                  </label>
                </div>
              </div>

              <!-- Skills Filter -->
              <div class="space-y-3">
                <h4 class="font-semibold text-batu-gray">Keterampilan yang Dibutuhkan</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded" value="leadership">
                    <span class="text-sm">Kepemimpinan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded" value="communication">
                    <span class="text-sm">Komunikasi</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded" value="technical">
                    <span class="text-sm">Teknis</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="skills-filter mr-3 rounded" value="creative">
                    <span class="text-sm">Kreatif</span>
                  </label>
                </div>
              </div>

              <!-- Roles Filter -->
              <div class="space-y-3">
                <h4 class="font-semibold text-batu-gray">Peran yang Tersedia</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded" value="relawan">
                    <span class="text-sm">Relawan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded" value="mentor">
                    <span class="text-sm">Mentor</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" class="roles-filter mr-3 rounded" value="donatur">
                    <span class="text-sm">Donatur</span>
                  </label>
                </div>
              </div>

            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button id="apply-advanced-filter" class="flex-1 py-3 bg-gradient-to-r from-nusantara-green to-samudra-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Terapkan Filter
              </button>
              <button id="reset-advanced-filter" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all">
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
}

// Improved Initialization - Handle both DOM ready and already loaded states
function initializeProgramCatalog() {
  console.log("Initializing Program Catalog...")
  
  // Clear any existing setup flags to ensure fresh initialization
  document.removeAttribute('data-advanced-filter-setup')
  
  setTimeout(() => {
    if (!window.programCatalog) {
      window.programCatalog = new ProgramCatalog()
      console.log("Program Catalog initialized successfully")
    } else {
      console.log("Program Catalog already exists, setting up listeners...")
      window.programCatalog.setupAdvancedFilterListeners()
    }
  }, 100)
}

// Handle different DOM states
if (document.readyState === 'loading') {
  // DOM is still loading
  document.addEventListener('DOMContentLoaded', initializeProgramCatalog)
} else if (document.readyState === 'interactive' || document.readyState === 'complete') {
  // DOM is already loaded
  console.log("DOM already loaded, initializing immediately...")
  initializeProgramCatalog()
}

// Fallback initialization after a delay
setTimeout(() => {
  if (!window.programCatalog) {
    console.log("Fallback initialization triggered...")
    initializeProgramCatalog()
  } else {
    // Ensure listeners are setup even if catalog exists
    console.log("Program Catalog exists, ensuring listeners are setup...")
    if (window.programCatalog.setupAdvancedFilterListeners) {
      document.removeAttribute('data-advanced-filter-setup')
      window.programCatalog.setupAdvancedFilterListeners()
    }
  }
}, 1000)

// Fallback initialization after component loads
setTimeout(() => {
  if (!window.programCatalog) {
    console.log("Fallback initialization...")
    window.programCatalog = new ProgramCatalog()
  }
}, 1000)

// Wait for component-loader to finish
function waitForProgramGrid(callback, maxAttempts = 20) {
  let attempts = 0
  
  function checkGrid() {
    attempts++
    const grid = document.getElementById('programs-grid')
    
    if (grid) {
      console.log(`Grid found after ${attempts} attempts!`)
      callback()
    } else if (attempts < maxAttempts) {
      console.log(`Attempt ${attempts}: Grid not found, retrying...`)
      setTimeout(checkGrid, 200)
    } else {
      console.error(`Grid not found after ${maxAttempts} attempts`)
      // Force create the grid if it doesn't exist
      createProgramGrid()
      callback()
    }
  }
  
  checkGrid()
}

function createProgramGrid() {
  console.log("Creating program grid manually...")
  const catalogSection = document.getElementById('program-catalog')
  
  if (catalogSection && !document.getElementById('programs-grid')) {
    const gridHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="programs-grid">
          <!-- Programs will be rendered dynamically here -->
        </div>
        
        <div id="no-results" class="hidden text-center py-12">
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
    console.log("Program grid created successfully!")
  }
}

// Enhanced initialization that waits for component loading
setTimeout(() => {
  console.log("Enhanced initialization starting...")
  waitForProgramGrid(() => {
    if (!window.programCatalog) {
      window.programCatalog = new ProgramCatalog()
    } else {
      window.programCatalog.renderPrograms()
    }
  })
}, 500)

// Global functions
window.testProgramCatalog = () => {
  console.log("=== TESTING PROGRAM CATALOG ===")
  console.log("Program catalog exists:", !!window.programCatalog)
  
  if (window.programCatalog) {
    console.log("Database:", window.programCatalog.programDatabase)
    console.log("Current category:", window.programCatalog.currentCategory)
    console.log("Current search:", window.programCatalog.currentSearch)
    
    // Test rendering
    console.log("Testing render...")
    window.programCatalog.renderPrograms()
    
    // Test filter buttons
    console.log("Testing filter buttons...")
    const filterBtns = document.querySelectorAll('.filter-btn')
    console.log("Filter buttons found:", filterBtns.length)
    filterBtns.forEach((btn, index) => {
      console.log(`Button ${index}:`, btn.dataset.filter, btn.textContent.trim())
    })
  } else {
    console.log("Program catalog not found - creating new instance...")
    window.programCatalog = new ProgramCatalog()
  }
}

window.forceRenderPrograms = () => {
  console.log("=== FORCE RENDER PROGRAMS ===")
  
  // First ensure grid exists
  if (!document.getElementById('programs-grid')) {
    console.log("Grid not found, creating it...")
    createProgramGrid()
  }
  
  // Then render programs
  if (window.programCatalog) {
    console.log("Using existing catalog...")
    window.programCatalog.renderPrograms()
  } else {
    console.log("Creating new catalog...")
    window.programCatalog = new ProgramCatalog()
  }
  
  // Force fix filter buttons after 500ms
  setTimeout(() => {
    const filterBtns = document.querySelectorAll('.filter-btn')
    console.log("Checking filter buttons after force render:", filterBtns.length)
    
    if (filterBtns.length < 5) {
      console.log("Force creating missing filter buttons...")
      if (window.createMissingFilterButtons) {
        window.createMissingFilterButtons()
      }
    }
  }, 500)
}

// Quick fix function for filter buttons
window.fixFilterButtons = () => {
  console.log("=== QUICK FIX FILTER BUTTONS ===")
  if (window.createMissingFilterButtons) {
    window.createMissingFilterButtons()
  }
  
  // Also check for advanced filter button
  setTimeout(() => {
    const advancedBtn = document.getElementById('advanced-filter-btn')
    if (!advancedBtn && window.programCatalog) {
      console.log("Creating missing advanced filter button...")
      window.programCatalog.createAdvancedFilterButton()
    }
  }, 200)
}

// Force create advanced filter button
window.createAdvancedFilterButton = () => {
  console.log("=== FORCE CREATE ADVANCED FILTER BUTTON ===")
  if (window.programCatalog) {
    window.programCatalog.createAdvancedFilterButton()
  } else {
    console.error("Program catalog not found!")
  }
}

// Debug function to check all buttons visibility
window.debugAllButtons = () => {
  console.log("=== DEBUG ALL BUTTONS ===")
  
  // Check filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn')
  console.log("Filter buttons found:", filterBtns.length)
  
  filterBtns.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect()
    console.log(`Filter Button ${index}:`, {
      filter: btn.dataset.filter,
      text: btn.textContent.trim(),
      visible: rect.width > 0 && rect.height > 0,
      rect: { width: rect.width, height: rect.height, x: rect.x, y: rect.y }
    })
  })
  
  // Check advanced filter button
  const advancedBtn = document.getElementById('advanced-filter-btn')
  console.log("Advanced filter button:", {
    exists: !!advancedBtn,
    visible: advancedBtn ? (advancedBtn.offsetWidth > 0 && advancedBtn.offsetHeight > 0) : false,
    text: advancedBtn ? advancedBtn.textContent.trim() : 'N/A'
  })
  
  // Check modal
  const modal = document.getElementById('advanced-filter-modal')
  console.log("Advanced filter modal:", {
    exists: !!modal,
    hidden: modal ? modal.classList.contains('hidden') : 'N/A'
  })
  
  // Check clear button
  const clearBtn = document.getElementById('clear-search')
  console.log("Clear button:", {
    exists: !!clearBtn,
    visible: clearBtn ? (clearBtn.offsetWidth > 0 && clearBtn.offsetHeight > 0) : false,
    text: clearBtn ? clearBtn.textContent.trim() : 'N/A'
  })
}

// Manual test function for advanced filter
window.testAdvancedFilter = () => {
  console.log("=== TESTING ADVANCED FILTER ===")
  const btn = document.getElementById('advanced-filter-btn')
  const modal = document.getElementById('advanced-filter-modal')
  
  if (!btn) {
    console.error("Advanced filter button not found!")
    return
  }
  
  if (!modal) {
    console.error("Advanced filter modal not found!")
    return
  }
  
  console.log("Button found, simulating click...")
  
  // Create and dispatch a more realistic click event
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })
  
  btn.dispatchEvent(clickEvent)
  
  setTimeout(() => {
    const isVisible = !modal.classList.contains('hidden')
    console.log("Modal visible after click:", isVisible)
    if (!isVisible) {
      console.log("Click simulation failed, trying direct method...")
      if (window.programCatalog && window.programCatalog.openAdvancedFilterModal) {
        window.programCatalog.openAdvancedFilterModal()
      }
    }
  }, 100)
}

// Force open modal function using new method
window.openAdvancedFilter = () => {
  console.log("=== FORCE OPEN ADVANCED FILTER ===")
  if (window.programCatalog && window.programCatalog.openAdvancedFilterModal) {
    window.programCatalog.openAdvancedFilterModal()
  } else {
    console.error("Program catalog or openAdvancedFilterModal method not found!")
    // Fallback to direct DOM manipulation
    const modal = document.getElementById('advanced-filter-modal')
    if (modal) {
      modal.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
      console.log("Modal opened manually via fallback")
    } else {
      console.error("Modal not found!")
    }
  }
}

// Force setup listeners function
window.forceSetupAdvancedFilter = () => {
  console.log("=== FORCE SETUP ADVANCED FILTER ===")
  
  // Clear existing setup flag
  document.removeAttribute('data-advanced-filter-setup')
  
  if (window.programCatalog && window.programCatalog.setupAdvancedFilterListeners) {
    window.programCatalog.setupAdvancedFilterListeners()
    console.log("Advanced filter listeners setup forced")
  } else {
    console.error("Program catalog or setupAdvancedFilterListeners method not found!")
  }
}

window.highlightProgram = (programId) => {
  if (window.programCatalog) {
    window.programCatalog.highlightProgram(programId)
  }
}

// Global function to setup filter buttons manually
window.setupFilterButtons = () => {
  console.log("=== MANUAL FILTER SETUP ===")
  const filterBtns = document.querySelectorAll('.filter-btn')
  console.log("Found filter buttons:", filterBtns.length)
  
  // Debug: List all buttons found
  filterBtns.forEach((btn, index) => {
    console.log(`Button ${index}:`, {
      filter: btn.dataset.filter,
      text: btn.textContent.trim(),
      visible: btn.offsetWidth > 0 && btn.offsetHeight > 0,
      display: window.getComputedStyle(btn).display,
      visibility: window.getComputedStyle(btn).visibility
    })
  })
  
  if (filterBtns.length === 0) {
    console.error("No filter buttons found!")
    return
  }
  
  filterBtns.forEach((btn, index) => {
    console.log(`Setting up button ${index}:`, btn.dataset.filter)
    
    btn.addEventListener('click', (e) => {
      console.log("Manual filter clicked:", e.currentTarget.dataset.filter)
      
      if (window.programCatalog) {
        window.programCatalog.currentCategory = e.currentTarget.dataset.filter
        window.programCatalog.updateFilterButtons()
        window.programCatalog.renderPrograms()
      } else {
        console.error("Program catalog not found!")
      }
    })
  })
  
  console.log("Manual filter setup completed!")
}

// Debug function to check filter buttons visibility
window.debugFilterButtons = () => {
  console.log("=== DEBUG FILTER BUTTONS ===")
  const catalogSection = document.getElementById('program-catalog')
  console.log("Catalog section:", catalogSection)
  console.log("Catalog innerHTML length:", catalogSection?.innerHTML.length)
  
  const filterContainer = document.querySelector('.flex.flex-wrap.justify-center')
  console.log("Filter container:", filterContainer)
  
  const allButtons = document.querySelectorAll('.filter-btn')
  console.log("All filter buttons:", allButtons.length)
  
  allButtons.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect()
    console.log(`Button ${index} (${btn.dataset.filter}):`, {
      text: btn.textContent.trim(),
      visible: rect.width > 0 && rect.height > 0,
      rect: rect,
      classes: btn.className,
      parent: btn.parentElement?.tagName
    })
  })
  
  // If not all buttons found, try to fix
  if (allButtons.length < 5) {
    console.log("Not all buttons found, attempting to create missing ones...")
    createMissingFilterButtons()
  }
}

// Function to create missing filter buttons
window.createMissingFilterButtons = () => {
  console.log("=== CREATING MISSING FILTER BUTTONS ===")
  
  const expectedButtons = [
    { filter: 'all', text: 'Semua', active: true },
    { filter: 'conservation', text: 'Lingkungan & Alam', active: false },
    { filter: 'education', text: 'Pendidikan', active: false },
    { filter: 'social', text: 'Sosial & Pangan', active: false },
    { filter: 'technology', text: 'Teknologi', active: false }
  ]
  
  // Find or create filter container
  let filterContainer = document.querySelector('.flex.flex-wrap.justify-center')
  
  if (!filterContainer) {
    console.log("Filter container not found, creating new one...")
    const catalogSection = document.getElementById('program-catalog')
    if (catalogSection) {
      const containerHTML = `
        <div class="mb-12 w-full">
          <div class="w-full overflow-x-auto">
            <div class="flex flex-wrap justify-center gap-3 min-w-max px-4" id="filter-buttons-container">
            </div>
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
  
  // Clear existing buttons
  filterContainer.innerHTML = ''
  
  // Create all buttons
  expectedButtons.forEach(btnData => {
    const activeClass = btnData.active ? 'bg-nusantara-green text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    
    const buttonHTML = `
      <button class="filter-btn px-6 py-3 ${activeClass} rounded-lg font-semibold transition-all" data-filter="${btnData.filter}">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          ${btnData.text}
        </span>
      </button>
    `
    filterContainer.insertAdjacentHTML('beforeend', buttonHTML)
  })
  
  console.log("All filter buttons created successfully!")
  
  // Setup event listeners for new buttons
  setTimeout(() => {
    if (window.setupFilterButtons) {
      window.setupFilterButtons()
    }
  }, 100)
}
