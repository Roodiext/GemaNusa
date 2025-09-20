class LumaQuestSystem {
  constructor() {
    this.currentStep = 0
    this.userResponses = {}
    this.selectedOptions = {}
    this.isActive = false
    this.questData = this.initializeQuestData()
    this.programDatabase = this.initializeProgramDatabase()
    this.init()
  }

  init() {
    this.setupEventListeners()
    console.log("Luma Quest System initialized")
  }

  // Add initialize method for component loader compatibility
  initialize() {
    console.log("Luma Quest initialized via component loader")
    return this
  }

  initializeQuestData() {
    return {
      questions: [
        {
          id: "q1_motivation",
          title: "Apa yang paling membuat hatimu tergerak ketika melihat kondisi sekitar?",
          subtitle: "Pilih maksimal 2 yang paling menyentuh hatimu",
          type: "multi",
          maxChoices: 2,
          options: [
            {
              id: "children_education",
              text: "Anak-anak putus sekolah dan kehilangan masa depan",
              icon: "👶",
              tags: ["education", "social"]
            },
            {
              id: "forest_wildlife",
              text: "Hutan gundul & satwa yang kehilangan rumah",
              icon: "🌳",
              tags: ["conservation"]
            },
            {
              id: "ocean_pollution",
              text: "Laut tercemar sampah plastik",
              icon: "🌊",
              tags: ["ocean", "conservation"]
            },
            {
              id: "hunger_malnutrition",
              text: "Keluarga yang kelaparan atau kurang gizi",
              icon: "🍽️",
              tags: ["social", "food"]
            }
          ]
        },
        {
          id: "q2_contribution",
          title: "Kalau kamu ingin berkontribusi, cara apa yang paling bikin kamu bersemangat?",
          subtitle: "Pilih satu yang paling sesuai dengan kepribadianmu",
          type: "single",
          options: [
            {
              id: "direct_action",
              text: "Terjun langsung di lapangan",
              icon: "🏃‍♂️",
              role: "relawan"
            },
            {
              id: "teaching_mentoring",
              text: "Mengajar, membimbing, berbagi ilmu",
              icon: "📚",
              role: "mentor"
            },
            {
              id: "financial_support",
              text: "Memberi dukungan dana/barang",
              icon: "💝",
              role: "donatur"
            },
            {
              id: "tech_solutions",
              text: "Menciptakan solusi kreatif dengan teknologi",
              icon: "💻",
              role: "mentor"
            }
          ]
        },
        {
          id: "q3_time_commitment",
          title: "Seberapa banyak waktu yang rela kamu sisihkan untuk gerakan ini?",
          subtitle: "Jujur saja, komitmen yang realistis lebih berharga",
          type: "single",
          options: [
            {
              id: "low_time",
              text: "≤ 2 jam/minggu",
              icon: "⏰",
              commitment: "low"
            },
            {
              id: "mid_time",
              text: "2–5 jam/minggu",
              icon: "📅",
              commitment: "mid"
            },
            {
              id: "high_time",
              text: "≥ 5 jam/minggu",
              icon: "🔥",
              commitment: "high"
            }
          ]
        },
        {
          id: "q4_scope",
          title: "Di mana kamu paling ingin berkontribusi?",
          subtitle: "Setiap skala punya tantangan dan keunikan tersendiri",
          type: "single",
          options: [
            {
              id: "local_community",
              text: "Lingkungan sekitar / komunitas lokal",
              icon: "🏘️",
              scope: "local"
            },
            {
              id: "city_level",
              text: "Skala kota/kabupaten",
              icon: "🏙️",
              scope: "city"
            },
            {
              id: "national_level",
              text: "Skala nasional",
              icon: "🇮🇩",
              scope: "national"
            },
            {
              id: "global_level",
              text: "Online / global",
              icon: "🌍",
              scope: "global"
            }
          ]
        },
        {
          id: "q5_skills",
          title: "Kemampuan apa yang paling ingin kamu gunakan untuk membantu orang lain?",
          subtitle: "Pilih maksimal 2 yang paling kamu kuasai",
          type: "multi",
          maxChoices: 2,
          options: [
            {
              id: "communication_storytelling",
              text: "Komunikasi & storytelling",
              icon: "🎤",
              skill: "communication"
            },
            {
              id: "technical_digital",
              text: "Keterampilan teknis/digital",
              icon: "💻",
              skill: "technical"
            },
            {
              id: "leadership_organizing",
              text: "Leadership & organizing",
              icon: "👑",
              skill: "leadership"
            },
            {
              id: "creativity_design",
              text: "Kreativitas & desain",
              icon: "🎨",
              skill: "creative"
            }
          ]
        }
      ]
    }
  }

  initializeProgramDatabase() {
    return {
      // Pendidikan & Literasi
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
          "Workshop keterampilan hidup",
          "Program beasiswa untuk berprestasi"
        ],
        impact: "1,200+ anak terbimbing, 85% naik kelas dengan nilai baik",
        matchScore: 0
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
          "Storytelling untuk anak",
          "Workshop menulis komunitas"
        ],
        impact: "50+ perpustakaan mini, 3,000+ buku terdistribusi",
        matchScore: 0
      },

      // Lingkungan & Alam
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
          "Edukasi masyarakat sekitar hutan",
          "Patroli anti-illegal logging"
        ],
        impact: "25,000+ pohon ditanam, 1,200 hektar hutan terlindungi",
        matchScore: 0
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
          "Kampanye reduce plastic usage",
          "Pemberdayaan nelayan lokal"
        ],
        impact: "50+ pantai dibersihkan, 25 ton sampah plastik terangkut",
        matchScore: 0
      },

      // Sosial & Pangan
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
          "Edukasi gizi seimbang",
          "Pelatihan memasak ekonomis"
        ],
        impact: "15,000+ porsi makanan terdistribusi, 800+ keluarga terbantu",
        matchScore: 0
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
          "Koordinasi dengan pemerintah daerah",
          "Program bantuan darurat bencana"
        ],
        impact: "2,500+ paket sembako, 1,200+ keluarga terbantu",
        matchScore: 0
      },

      // Teknologi & Inovasi
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
          "Platform edukasi digital",
          "Training teknologi untuk komunitas"
        ],
        impact: "15+ aplikasi diluncurkan, 50+ NGO terbantu teknologi",
        matchScore: 0
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
        matchScore: 0
      }
    }
  }

  setupEventListeners() {
    const setupListeners = () => {
      const startBtn = document.getElementById('start-quest-btn')
      const prevBtn = document.getElementById('prev-btn')
      const nextBtn = document.getElementById('next-btn')
      const viewAllBtn = document.getElementById('view-all-programs')

      if (startBtn) {
        startBtn.addEventListener('click', () => {
          console.log("Start Quest button clicked")
          this.startQuest()
        })
        console.log("Start Quest button listener attached")
      } else {
        console.log("Start Quest button not found")
      }

      if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion())
      if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion())
      if (viewAllBtn) viewAllBtn.addEventListener('click', () => this.scrollToCatalog())
    }

    setupListeners()
    
    document.addEventListener('DOMContentLoaded', setupListeners)
    
    setTimeout(setupListeners, 500)
  }

  startQuest() {
    this.currentStep = 0
    this.userResponses = {}
    this.selectedOptions = {}
    this.isActive = true
    
    // Hide intro, show quest container
    document.getElementById('quest-intro').classList.add('hidden')
    document.getElementById('quest-container').classList.remove('hidden')
    
    this.showQuestion(0)
  }

  showQuestion(stepIndex) {
    const question = this.questData.questions[stepIndex]
    const questionContent = document.getElementById('question-content')
    const progressBar = document.getElementById('progress-bar')
    const progressText = document.getElementById('progress-text')
    const prevBtn = document.getElementById('prev-btn')
    const nextBtn = document.getElementById('next-btn')

    // Update progress
    const progress = ((stepIndex + 1) / this.questData.questions.length) * 100
    progressBar.style.width = `${progress}%`
    progressText.textContent = `Pertanyaan ${stepIndex + 1} dari ${this.questData.questions.length}`

    // Generate question HTML
    questionContent.innerHTML = `
      <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-batu-gray mb-4">${question.title}</h3>
        <p class="text-gray-600">${question.subtitle}</p>
        ${question.type === 'multi' ? `<p class="text-sm text-red-600 mt-2 hidden" id="error-message">Pilih maksimal ${question.maxChoices} pilihan</p>` : ''}
      </div>
      
      <div class="grid gap-4">
        ${question.options.map(option => `
          <div class="option-card p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-nusantara-green hover:bg-green-50 transition-all" data-option-id="${option.id}">
            <div class="flex items-center gap-4">
              <div class="text-3xl">${option.icon}</div>
              <div class="flex-1">
                <p class="font-medium text-batu-gray">${option.text}</p>
              </div>
              <div class="w-6 h-6 border-2 border-gray-300 ${question.type === 'multi' ? 'rounded' : 'rounded-full'}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `

    // Add click listeners
    questionContent.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => this.selectOption(stepIndex, card.dataset.optionId))
    })

    // Update navigation
    prevBtn.disabled = stepIndex === 0
    nextBtn.disabled = !this.isValidSelection(question.id)
    
    // Add visual styling for disabled next button
    if (nextBtn.disabled) {
      nextBtn.classList.add('opacity-50', 'cursor-not-allowed')
      nextBtn.classList.remove('hover:shadow-lg', 'hover:scale-105')
    } else {
      nextBtn.classList.remove('opacity-50', 'cursor-not-allowed')
      nextBtn.classList.add('hover:shadow-lg', 'hover:scale-105')
    }
  }

  selectOption(stepIndex, optionId) {
    const question = this.questData.questions[stepIndex]
    const selectedCard = document.querySelector(`[data-option-id="${optionId}"]`)
    const errorMessage = document.getElementById('error-message')

    if (question.type === 'single') {
      // Single choice - clear previous selections
      document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('border-nusantara-green', 'bg-green-50')
        card.querySelector('.w-6').classList.remove('bg-nusantara-green')
      })
      
      selectedCard.classList.add('border-nusantara-green', 'bg-green-50')
      selectedCard.querySelector('.w-6').classList.add('bg-nusantara-green')
      
      this.selectedOptions[question.id] = [optionId]
      
    } else if (question.type === 'multi') {
      // Multi choice with validation
      if (!this.selectedOptions[question.id]) {
        this.selectedOptions[question.id] = []
      }
      
      const currentSelections = this.selectedOptions[question.id]
      const isSelected = currentSelections.includes(optionId)
      
      if (isSelected) {
        // Deselect
        const index = currentSelections.indexOf(optionId)
        currentSelections.splice(index, 1)
        selectedCard.classList.remove('border-nusantara-green', 'bg-green-50')
        selectedCard.querySelector('.w-6').classList.remove('bg-nusantara-green')
        if (errorMessage) errorMessage.classList.add('hidden')
      } else {
        // Select if under limit
        if (currentSelections.length < question.maxChoices) {
          currentSelections.push(optionId)
          selectedCard.classList.add('border-nusantara-green', 'bg-green-50')
          selectedCard.querySelector('.w-6').classList.add('bg-nusantara-green')
          if (errorMessage) errorMessage.classList.add('hidden')
        } else {
          // Show error
          if (errorMessage) errorMessage.classList.remove('hidden')
        }
      }
    }

    // Update next button state
    const nextBtn = document.getElementById('next-btn')
    nextBtn.disabled = !this.isValidSelection(question.id)
    
    // Update visual styling
    if (nextBtn.disabled) {
      nextBtn.classList.add('opacity-50', 'cursor-not-allowed')
      nextBtn.classList.remove('hover:shadow-lg', 'hover:scale-105')
    } else {
      nextBtn.classList.remove('opacity-50', 'cursor-not-allowed')
      nextBtn.classList.add('hover:shadow-lg', 'hover:scale-105')
    }
  }

  isValidSelection(questionId) {
    const selections = this.selectedOptions[questionId]
    return selections && selections.length > 0
  }

  nextQuestion() {
    const question = this.questData.questions[this.currentStep]
    
    // Validate selection before proceeding
    if (!this.isValidSelection(question.id)) {
      console.log("No valid selection, cannot proceed")
      return
    }
    
    // Store response
    this.userResponses[question.id] = {
      selections: this.selectedOptions[question.id],
      timestamp: Date.now()
    }

    if (this.currentStep < this.questData.questions.length - 1) {
      this.currentStep++
      this.showQuestion(this.currentStep)
    } else {
      this.calculateResults()
    }
  }

  previousQuestion() {
    if (this.currentStep > 0) {
      this.currentStep--
      this.showQuestion(this.currentStep)
    }
  }

  calculateResults() {
    console.log("Calculating quest results...", this.userResponses)

    // Extract user preferences
    const userTags = []
    const userRole = this.getUserRole()
    const userCommitment = this.getUserCommitment()
    const userScope = this.getUserScope()
    const userSkills = this.getUserSkills()

    // Collect tags from Q1 and Q5
    if (this.userResponses.q1_motivation) {
      this.userResponses.q1_motivation.selections.forEach(selectionId => {
        const option = this.questData.questions[0].options.find(opt => opt.id === selectionId)
        if (option) userTags.push(...option.tags)
      })
    }

    // Calculate match scores for each program
    Object.keys(this.programDatabase).forEach(programId => {
      const program = this.programDatabase[programId]
      let score = 0

      // Tag matching (30 points)
      const tagMatches = program.tags.filter(tag => userTags.includes(tag)).length
      score += tagMatches * 3

      // Skill matching (20 points)
      const skillMatches = program.skills.filter(skill => userSkills.includes(skill)).length
      score += skillMatches * 2

      // Commitment matching (10% bonus)
      if (program.commitment === userCommitment) {
        score *= 1.1
      }

      // Scope matching (10% bonus)
      if (program.scope === userScope) {
        score *= 1.1
      }

      // Role availability check
      if (!program.rolesAvailable.includes(userRole)) {
        score *= 0.7 // Penalty if user's preferred role is not available
      }

      program.matchScore = Math.round(score * 10) / 10
    })

    // Get top 3 programs
    const sortedPrograms = Object.entries(this.programDatabase)
      .sort(([,a], [,b]) => b.matchScore - a.matchScore)
      .slice(0, 3)

    this.showResults(sortedPrograms, userRole)
  }

  getUserRole() {
    if (this.userResponses.q2_contribution) {
      const selectionId = this.userResponses.q2_contribution.selections[0]
      const option = this.questData.questions[1].options.find(opt => opt.id === selectionId)
      return option ? option.role : 'relawan'
    }
    return 'relawan'
  }

  getUserCommitment() {
    if (this.userResponses.q3_time_commitment) {
      const selectionId = this.userResponses.q3_time_commitment.selections[0]
      const option = this.questData.questions[2].options.find(opt => opt.id === selectionId)
      return option ? option.commitment : 'mid'
    }
    return 'mid'
  }

  getUserScope() {
    if (this.userResponses.q4_scope) {
      const selectionId = this.userResponses.q4_scope.selections[0]
      const option = this.questData.questions[3].options.find(opt => opt.id === selectionId)
      return option ? option.scope : 'local'
    }
    return 'local'
  }

  getUserSkills() {
    const skills = []
    if (this.userResponses.q5_skills) {
      this.userResponses.q5_skills.selections.forEach(selectionId => {
        const option = this.questData.questions[4].options.find(opt => opt.id === selectionId)
        if (option) skills.push(option.skill)
      })
    }
    return skills
  }

  showResults(topPrograms, userRole) {
    // Hide quest container, show results
    document.getElementById('quest-container').classList.add('hidden')
    document.getElementById('quest-results').classList.remove('hidden')

    // Set main role
    const roleNames = {
      'relawan': 'Relawan',
      'mentor': 'Mentor', 
      'donatur': 'Donatur'
    }
    document.getElementById('main-role').textContent = roleNames[userRole] || 'Relawan'

    // Generate program cards
    const programsContainer = document.getElementById('recommended-programs')
    programsContainer.innerHTML = topPrograms.map(([programId, program], index) => `
      <div class="bg-white rounded-2xl p-6 border-2 ${index === 0 ? 'border-nusantara-green bg-green-50' : 'border-gray-200'} shadow-lg">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-batu-gray mb-2">${program.name}</h3>
            <p class="text-gray-600 mb-3">${program.description}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-nusantara-green">${Math.round(program.matchScore)}%</div>
            <div class="text-sm text-gray-500">Match</div>
          </div>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold text-gray-700 mb-2">Aktivitas Utama:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            ${program.activities.slice(0, 3).map(activity => `<li>• ${activity}</li>`).join('')}
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold text-gray-700 mb-2">Dampak:</h4>
          <p class="text-sm text-gray-600">${program.impact}</p>
        </div>
        
        <div class="flex gap-2 mb-4">
          ${program.rolesAvailable.map(role => `
            <span class="px-3 py-1 bg-${role === userRole ? 'nusantara-green' : 'gray-200'} text-${role === userRole ? 'white' : 'gray-700'} text-xs rounded-full">
              ${roleNames[role] || role}
            </span>
          `).join('')}
        </div>
        
        <button class="w-full py-3 bg-gradient-to-r from-nusantara-green to-samudra-blue text-white rounded-xl font-semibold hover:shadow-lg transition-all" 
                onclick="window.lumaQuest.viewProgram('${programId}')">
          Lihat Program
        </button>
      </div>
    `).join('')

    // Save results to localStorage
    localStorage.setItem('luma_quest_results', JSON.stringify({
      results: topPrograms,
      userRole,
      timestamp: Date.now(),
      responses: this.userResponses
    }))

    console.log("Quest completed successfully")
  }

  viewProgram(programId) {
    // Redirect to program.html with parameters
    const userScope = this.getUserScope()
    const userRole = this.getUserRole()
    
    // Build URL with quest results
    const params = new URLSearchParams({
      highlight: programId,
      scope: userScope,
      role: userRole,
      from: 'quest'
    })
    
    // Store quest results for program page
    localStorage.setItem('quest_program_highlight', JSON.stringify({
      programId,
      scope: userScope,
      role: userRole,
      timestamp: Date.now()
    }))
    
    // Redirect to program page
    window.location.href = `program.html?${params.toString()}`
  }

  scrollToCatalog() {
    // Redirect to program page
    window.location.href = 'program.html'
  }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
  window.lumaQuest = new LumaQuestSystem()
  console.log("Quest system initialized successfully")
})

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading
} else {
  // DOM is already loaded
  if (!window.lumaQuest) {
    window.lumaQuest = new LumaQuestSystem()
    console.log("Quest system initialized immediately")
  }
}

// Global event delegation for start quest button
document.addEventListener('click', function(e) {
  if (e.target && (e.target.id === 'start-quest-btn' || e.target.closest('#start-quest-btn'))) {
    console.log("Start Quest button clicked via delegation")
    if (window.lumaQuest) {
      window.lumaQuest.startQuest()
    } else {
      console.error("lumaQuest not initialized")
    }
  }
})
