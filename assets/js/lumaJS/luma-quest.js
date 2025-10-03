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
              icon: `<svg class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>`,
              tags: ["education", "social"]
            },
            {
              id: "forest_wildlife",
              text: "Hutan gundul & satwa yang kehilangan rumah",
              icon: `<svg class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>`,
              tags: ["conservation"]
            },
            {
              id: "ocean_pollution",
              text: "Laut tercemar sampah plastik",
              icon: `<svg class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>`,
              tags: ["ocean", "conservation"]
            },
            {
              id: "hunger_malnutrition",
              text: "Keluarga yang kelaparan atau kurang gizi",
              icon: `<svg class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>`,
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
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>`,
              role: "relawan"
            },
            {
              id: "teaching_mentoring",
              text: "Mengajar, membimbing, berbagi ilmu",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>`,
              role: "mentor"
            },
            {
              id: "financial_support",
              text: "Memberi dukungan dana/barang",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>`,
              role: "donatur"
            },
            {
              id: "tech_solutions",
              text: "Menciptakan solusi kreatif dengan teknologi",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>`,
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
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>`,
              commitment: "low"
            },
            {
              id: "mid_time",
              text: "2–5 jam/minggu",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>`,
              commitment: "mid"
            },
            {
              id: "high_time",
              text: "≥ 5 jam/minggu",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
              </svg>`,
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
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>`,
              scope: "local"
            },
            {
              id: "city_level",
              text: "Skala kota/kabupaten",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"></path>
              </svg>`,
              scope: "city"
            },
            {
              id: "national_level",
              text: "Skala nasional",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>`,
              scope: "national"
            },
            {
              id: "global_level",
              text: "Online / global",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>`,
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
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
              </svg>`,
              skill: "communication"
            },
            {
              id: "technical_digital",
              text: "Keterampilan teknis/digital",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>`,
              skill: "technical"
            },
            {
              id: "leadership_organizing",
              text: "Leadership & organizing",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>`,
              skill: "leadership"
            },
            {
              id: "creativity_design",
              text: "Kreativitas & desain",
              icon: `<svg class="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
              </svg>`,
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

    // Generate question HTML with responsive 2x2 grid for mobile, fixed desktop view
    questionContent.innerHTML = `
      <div class="text-center mb-4 sm:mb-6 md:mb-8 px-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-primary to-purple-secondary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span class="text-white text-lg sm:text-xl font-bold">${stepIndex + 1}</span>
        </div>
        <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight px-2">${question.title}</h3>
        <p class="text-gray-600 text-sm sm:text-base">${question.subtitle}</p>
        ${question.type === 'multi' ? `<p class="text-xs sm:text-sm text-red-600 mt-2 hidden" id="error-message">Pilih maksimal ${question.maxChoices} pilihan</p>` : ''}
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto px-4">
        ${question.options.map(option => `
          <div class="option-card group p-2.5 sm:p-3 md:p-5 border-2 border-gray-200 rounded-lg sm:rounded-xl cursor-pointer hover:border-purple-primary hover:bg-purple-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-95" data-option-id="${option.id}">
            <div class="flex flex-col items-center text-center gap-1.5 sm:gap-2 md:gap-3">
              <div class="flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 bg-gray-100 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                ${option.icon}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-base leading-tight sm:leading-snug line-clamp-3">${option.text}</p>
              </div>
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
        card.classList.remove('border-purple-primary', 'bg-purple-50', 'shadow-lg', 'scale-[1.02]')
        const checkbox = card.querySelector('.w-4, .w-5, .w-6, .w-8')
        if (checkbox) {
          const innerDiv = checkbox.querySelector('div')
          if (innerDiv) {
            innerDiv.classList.remove('bg-purple-primary', 'border-purple-primary')
            innerDiv.style.backgroundColor = ''
          }
        }
      })
      
      selectedCard.classList.add('border-purple-primary', 'bg-purple-50', 'shadow-lg', 'scale-[1.02]')
                const checkbox = selectedCard.querySelector('.w-4, .w-5, .w-6, .w-8')
      if (checkbox) {
        const innerDiv = checkbox.querySelector('div')
        if (innerDiv) {
          innerDiv.classList.add('bg-purple-primary')
          innerDiv.style.backgroundColor = '#7C3AED'
        }
      }
      
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
        selectedCard.classList.remove('border-purple-primary', 'bg-purple-50', 'shadow-lg', 'scale-[1.02]')
        const checkbox = selectedCard.querySelector('.w-4, .w-5, .w-6, .w-8')
        if (checkbox) {
          const innerDiv = checkbox.querySelector('div')
          if (innerDiv) {
            innerDiv.classList.remove('bg-purple-primary')
            innerDiv.style.backgroundColor = ''
          }
        }
        if (errorMessage) errorMessage.classList.add('hidden')
      } else {
        // Select if under limit
        if (currentSelections.length < question.maxChoices) {
          currentSelections.push(optionId)
          selectedCard.classList.add('border-purple-primary', 'bg-purple-50', 'shadow-lg', 'scale-[1.02]')
          const checkbox = selectedCard.querySelector('.w-4, .w-5, .w-6, .w-8')
          if (checkbox) {
            const innerDiv = checkbox.querySelector('div')
            if (innerDiv) {
              innerDiv.classList.add('bg-purple-primary')
              innerDiv.style.backgroundColor = '#7C3AED'
            }
          }
          if (errorMessage) errorMessage.classList.add('hidden')
        } else {
          // Show error with animation
          if (errorMessage) {
            errorMessage.classList.remove('hidden')
            errorMessage.classList.add('animate-pulse')
            setTimeout(() => {
              errorMessage.classList.remove('animate-pulse')
            }, 2000)
          }
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

    // Generate program cards with modern styling
    const programsContainer = document.getElementById('recommended-programs')
    programsContainer.innerHTML = topPrograms.map(([programId, program], index) => `
      <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border-2 ${index === 0 ? 'border-purple-primary bg-gradient-to-br from-purple-50 to-white' : 'border-gray-200'} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
        <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <div class="flex-1 w-full">
            <div class="flex items-center gap-3 mb-3">
              ${index === 0 ? '<div class="w-8 h-8 bg-gradient-to-r from-purple-primary to-purple-secondary rounded-full flex items-center justify-center"><span class="text-white text-sm font-bold">★</span></div>' : ''}
              <h3 class="text-xl sm:text-2xl font-bold text-gray-800">${program.name}</h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">${program.description}</p>
          </div>
          <div class="text-center sm:text-right sm:ml-6">
            <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-primary to-purple-secondary bg-clip-text text-transparent">${Math.round(program.matchScore)}%</div>
            <div class="text-xs sm:text-sm text-gray-500 font-medium">Match Score</div>
          </div>
        </div>
        
        <div class="mb-6">
          <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Aktivitas Utama:
          </h4>
          <ul class="text-xs sm:text-sm text-gray-600 space-y-2">
            ${program.activities.slice(0, 3).map(activity => `
              <li class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-primary rounded-full flex-shrink-0"></div>
                ${activity}
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="mb-6 p-3 sm:p-4 bg-white/80 rounded-xl border border-gray-200">
          <h4 class="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-4-4"></path>
            </svg>
            Dampak yang Dicapai:
          </h4>
          <p class="text-xs sm:text-sm text-gray-700 font-medium">${program.impact}</p>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-6">
          ${program.rolesAvailable.map(role => `
            <span class="px-3 sm:px-4 py-1.5 sm:py-2 ${role === userRole ? 'bg-gradient-to-r from-purple-primary to-purple-secondary text-white shadow-lg' : 'bg-gray-100 text-gray-700'} text-xs sm:text-sm font-medium rounded-full transition-all">
              ${roleNames[role] || role}
            </span>
          `).join('')}
        </div>
        
        <button class="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-primary to-purple-secondary text-white rounded-xl font-bold text-sm sm:text-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 transform" 
                onclick="window.lumaQuest.viewProgram('${programId}')">
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Lihat Program
          </span>
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