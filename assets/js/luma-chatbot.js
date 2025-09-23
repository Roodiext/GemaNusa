class EnhancedLumaAI {
  constructor() {
    // Existing constructor properties
    this.isInitialized = false
    this.conversationHistory = []
    this.userProfile = {
      interests: [],
      completedQuests: [],
      preferredPrograms: [],
      engagementLevel: "beginner",
    }
    
    // Enhanced conversation handling
    this.topicCategories = {
      environment: ["lingkungan", "alam", "bumi", "ekosistem", "polusi", "konservasi"],
      programs: ["program", "kegiatan", "acara", "aktivitas", "proyek"],
      quest: ["quest", "kuis", "tes", "rekomendasi", "cocok", "sesuai"],
      impact: ["dampak", "hasil", "pencapaian", "perubahan", "statistik"],
      community: ["komunitas", "relawan", "volunteer", "bergabung", "kolaborasi"],
      help: ["bantuan", "tanya", "info", "informasi", "cara"]
    }

    this.fallbackResponses = [
      "Maaf, saya kurang memahami maksud Anda. Bagaimana kalau kita membahas program-program lingkungan kami? Atau mungkin Anda tertarik untuk mencoba Quest Luma?",
      "Hmm, saya masih belajar untuk topik itu. Tapi saya bisa membantu Anda menemukan program lingkungan yang sesuai dengan minat Anda. Mau coba?",
      "Wah, itu topik yang menarik! Tapi maaf, saya belum bisa membahas itu secara detail. Bagaimana kalau kita eksplorasi program-program unggulan Gema Nusa?"
    ]

    this.contextualResponses = this.initializeAdvancedResponses()
    this.emotionalStates = ["curious", "encouraging", "informative", "playful", "supportive"]
    this.currentMood = "encouraging"
    this.init()
  }

  init() {
    if (this.isInitialized) return

    this.createAdvancedInterface()
    this.setupEventListeners()
    this.loadUserProfile()
    this.isInitialized = true

    console.log("[v0] Enhanced Luma AI initialized successfully")
  }

  // Add initialize function for component loader compatibility
  initialize() {
    console.log("Luma Chatbot initialized successfully")
    return this
  }

  createAdvancedInterface() {
    const chatContainer = document.createElement("div")
    chatContainer.id = "luma-ai-container"
    chatContainer.className = `
        fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] 
        bg-white rounded-2xl shadow-xl z-40 
        transform transition-all duration-300 opacity-0 scale-95 
        border border-purple-100 hidden
    `

    chatContainer.innerHTML = `
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="relative">
                    <img src="/assets/img/luma-ai-bot/robotluma.svg" alt="Luma AI" class="w-10 h-10">
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <h3 class="font-semibold text-lg">Luma AI</h3>
                    <p class="text-xs text-purple-100" id="luma-status">Siap membantu Anda</p>
                </div>
            </div>
            <button id="luma-close" class="text-white hover:text-purple-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <!-- Chat Body -->
        <div id="luma-messages" class="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
            <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full gradient-purple flex items-center justify-center flex-shrink-0">
                    <img src="/assets/img/luma-ai-bot/robotluma.svg" alt="Luma AI" class="w-5 h-5">
                </div>
                <div class="bg-white rounded-2xl rounded-tl-md p-3 max-w-[80%] shadow-sm border border-purple-100">
                    <p class="text-sm text-gray-800">Halo! Saya Luma, asisten AI Gema Nusa. Saya siap membantu Anda menemukan program lingkungan yang tepat dan menjawab pertanyaan tentang gerakan kita. Apa yang ingin Anda ketahui?</p>
                </div>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="px-4 py-2 border-t border-purple-100 bg-white">
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-200">
                <button class="luma-quick-btn whitespace-nowrap px-4 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                    Mulai Quest 🎯
                </button>
                <button class="luma-quick-btn whitespace-nowrap px-4 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                    Program 🌱
                </button>
                <button class="luma-quick-btn whitespace-nowrap px-4 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                    Dampak 📊
                </button>
                <button class="luma-quick-btn whitespace-nowrap px-4 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                    Komunitas 👥
                </button>
            </div>
        </div>
        
        <!-- Input Area -->
        <div class="p-4 border-t border-purple-100 bg-white rounded-b-2xl">
            <div class="flex gap-2">
                <input 
                    type="text" 
                    id="luma-input" 
                    placeholder="Ketik pesan Anda..." 
                    class="flex-1 px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-400"
                >
                <button 
                    id="luma-send" 
                    class="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </button>
            </div>
        </div>
    `

    document.body.appendChild(chatContainer)

    // Create floating trigger button
    const triggerButton = document.createElement("button")
    triggerButton.id = "luma-trigger"
    triggerButton.className = `
        fixed bottom-6 right-6 z-50 w-14 h-14 
        bg-gradient-to-r from-purple-500 to-indigo-600 
        rounded-full shadow-lg 
        flex items-center justify-center
        hover:scale-110 transition-all duration-300
    `
    triggerButton.innerHTML = `
        <img src="/assets/img/luma-ai-bot/robotluma.svg" alt="Luma AI" class="w-8 h-8">
    `

    document.body.appendChild(triggerButton)
}

  setupEventListeners() {
    const trigger = document.getElementById("luma-trigger")
    const container = document.getElementById("luma-ai-container")
    const closeBtn = document.getElementById("luma-close")
    const sendBtn = document.getElementById("luma-send")
    const input = document.getElementById("luma-input")
    const quickBtns = document.querySelectorAll(".luma-quick-btn")

    trigger?.addEventListener("click", () => this.toggleChat())
    closeBtn?.addEventListener("click", () => this.toggleChat())
    sendBtn?.addEventListener("click", () => this.sendMessage())
    input?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage()
    })

    quickBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.textContent.trim()
        this.handleQuickAction(action)
      })
    })
  }

  toggleChat() {
    const container = document.getElementById("luma-ai-container")
    const trigger = document.getElementById("luma-trigger")

    if (container.classList.contains("hidden")) {
        container.classList.remove("hidden", "opacity-0", "scale-95")
        container.classList.add("opacity-100", "scale-100")
        trigger.classList.add("opacity-0")
    } else {
        container.classList.add("opacity-0", "scale-95")
        trigger.classList.remove("opacity-0")
        setTimeout(() => {
            container.classList.add("hidden")
        }, 300)
    }
  }

  async sendMessage() {
    const input = document.getElementById("luma-input")
    const message = input.value.trim()

    if (!message) return

    this.addMessage(message, "user")
    input.value = ""

    this.showTypingIndicator()

    setTimeout(() => {
      const response = this.generateAdvancedResponse(message)
      this.hideTypingIndicator()
      this.addMessage(response, "ai")
      this.updateUserProfile(message)
    }, 1500)
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById("luma-messages")
    const messageDiv = document.createElement("div")
    messageDiv.className = "flex items-start gap-3"

    if (sender === "user") {
        messageDiv.innerHTML = `
            <div class="ml-auto message-bubble user-message">
                <p class="text-sm">${content}</p>
            </div>
        `
    } else {
        messageDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full gradient-purple flex items-center justify-center flex-shrink-0">
                <img src="/assets/img/luma-ai-bot/robotluma.svg" alt="Luma AI" class="w-5 h-5">
            </div>
            <div class="message-bubble bot-message">
                <p class="text-sm">${content}</p>
            </div>
        `
    }

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    this.conversationHistory.push({ content, sender, timestamp: Date.now() })
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById("luma-messages")
    const typingDiv = document.createElement("div")
    typingDiv.id = "typing-indicator"
    typingDiv.className = "flex items-start gap-3"
    typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full gradient-nusantara flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
            </div>
            <div class="bg-muted/50 rounded-2xl rounded-tl-md p-3">
                <div class="flex gap-1">
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `

    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight

    document.getElementById("luma-status").textContent = "Sedang mengetik..."
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
    document.getElementById("luma-status").textContent = "Online"
  }

  // Enhanced context analysis
  analyzeContext(message) {
    const context = {
      intent: "general",
      entities: [],
      sentiment: this.analyzeSentiment(message),
      topics: this.identifyTopics(message),
      confidence: 0
    }

    // Enhanced intent detection
    if (this.matchesTopics(message, this.topicCategories.quest)) {
      context.intent = "quest"
      context.confidence = 0.9
    } else if (this.matchesTopics(message, this.topicCategories.programs)) {
      context.intent = "program"
      context.confidence = 0.8
    } else if (this.matchesTopics(message, this.topicCategories.impact)) {
      context.intent = "impact"
      context.confidence = 0.8
    } else if (this.matchesTopics(message, this.topicCategories.community)) {
      context.intent = "community"
      context.confidence = 0.8
    }

    // Entity extraction
    const environmentalTerms = ["hutan", "laut", "sampah", "plastik", "pohon", "air", "udara", "energi"]
    environmentalTerms.forEach(term => {
      if (message.includes(term)) {
        context.entities.push(term)
        context.confidence += 0.1
      }
    })

    return context
  }

  // New method to analyze sentiment
  analyzeSentiment(message) {
    const positiveWords = ["bagus", "suka", "hebat", "keren", "mantap", "wow", "amazing", "tertarik"]
    const negativeWords = ["buruk", "jelek", "gagal", "kecewa", "susah", "sulit", "bingung"]
    
    let sentiment = "neutral"
    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach(word => {
      if (message.includes(word)) positiveCount++
    })

    negativeWords.forEach(word => {
      if (message.includes(word)) negativeCount++
    })

    if (positiveCount > negativeCount) sentiment = "positive"
    else if (negativeCount > positiveCount) sentiment = "negative"

    return sentiment
  }

  // New method to identify topics
  identifyTopics(message) {
    const topics = []
    
    Object.entries(this.topicCategories).forEach(([category, keywords]) => {
      if (this.matchesTopics(message, keywords)) {
        topics.push(category)
      }
    })

    return topics
  }

  // New method to match topics
  matchesTopics(message, keywords) {
    return keywords.some(keyword => message.toLowerCase().includes(keyword))
  }

  // Enhanced response generation
  generateAdvancedResponse(message) {
    const context = this.analyzeContext(message.toLowerCase())
    
    // Handle low confidence responses
    if (context.confidence < 0.5) {
      return this.generateFallbackResponse(context)
    }

    // Enhanced intent-based responses
    switch (context.intent) {
      case "quest":
        return this.generateQuestResponse(context)
      case "program":
        return this.generateProgramResponse(context)
      case "impact":
        return this.generateImpactResponse(context)
      case "community":
        return this.generateCommunityResponse(context)
      default:
        return this.generateContextualResponse(context)
    }
  }

  // New method for fallback responses
  generateFallbackResponse(context) {
    const response = this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)]
    
    // Add personalized suggestions based on user profile
    if (this.userProfile.interests.length > 0) {
      return `${response}\n\nBerdasarkan minat Anda di bidang ${this.userProfile.interests.join(', ')}, mungkin Anda tertarik dengan program-program kami di area tersebut?`
    }
    
    return response
  }

  // Enhanced program response
  generateProgramResponse(context) {
    let response = ""
    
    if (context.entities.length > 0) {
      const programs = {
        hutan: "Program Konservasi Hutan kami melibatkan penanaman pohon dan edukasi masyarakat lokal",
        laut: "Program Bersih Laut fokus pada pembersihan pantai dan pelestarian ekosistem laut",
        sampah: "Program Zero Waste Community mengajarkan pengolahan sampah dan ekonomi sirkular",
        energi: "Program Smart Energy Initiative mendorong penggunaan energi terbarukan"
      }

      const relevantPrograms = context.entities
        .filter(entity => programs[entity])
        .map(entity => programs[entity])

      if (relevantPrograms.length > 0) {
        response = `Wah, Anda tertarik dengan ${context.entities.join(' dan ')}? ${relevantPrograms.join('. ')}!`
      }
    }

    if (!response) {
      response = "Kami punya 8+ program unggulan yang bisa Anda pilih! Mulai dari konservasi hutan, pembersihan laut, hingga smart city green. Mau saya bantu menemukan yang paling cocok untuk Anda?"
    }

    return response + "\n\nMau coba Quest Luma untuk rekomendasi yang lebih personal? 😊"
  }

  // New method for community response
  generateCommunityResponse(context) {
    const responses = [
      "Di Gema Nusa, kita punya komunitas yang luar biasa! Sudah ada 5000+ changemaker yang bergabung. Mau jadi bagian dari gerakan ini?",
      "Komunitas kami tersebar di 34 provinsi Indonesia, dengan berbagai latar belakang tapi satu tujuan: menjaga lingkungan! Siap bergabung?",
      "Setiap minggu ada kegiatan seru di komunitas kami, dari workshop lingkungan sampai aksi lapangan. Mau tau lebih lanjut?"
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  generateQuestResponse(context) {
    const responses = [
      "Wah, seru! Quest Luma dirancang khusus untuk menemukan program lingkungan yang paling cocok dengan kepribadian dan minat Anda. Mau mulai sekarang? Saya akan tanya beberapa hal menarik tentang Anda!",
      "Quest Luma adalah fitur favorit saya! Dengan 5 pertanyaan cerdas, saya bisa merekomendasikan program yang benar-benar sesuai dengan passion Anda. Siap untuk petualangan menemukan misi lingkungan Anda?",
      "Perfect timing! Quest Luma menggunakan AI untuk menganalisis preferensi Anda dan mencocokkannya dengan 8+ program unggulan kami. Hasilnya? Program yang bikin Anda excited untuk berkontribusi!",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  initializeAdvancedResponses() {
    return {
      greetings: [
        "Halo! Saya Luma, AI companion Gema Nusa yang siap membantu Anda menemukan cara terbaik berkontribusi untuk lingkungan Indonesia! 🌱",
        "Hai eco-warrior! Senang bertemu dengan Anda. Saya Luma, siap memandu perjalanan lingkungan Anda di Gema Nusa!",
        "Selamat datang di Gema Nusa! Saya Luma, AI assistant yang passionate tentang lingkungan. Ada yang bisa saya bantu?",
      ],
      programs: {
        forest:
          "Program hutan kami amazing! 'Penjaga Hutan Nusantara' untuk petualangan konservasi, dan 'Smart Forest Guardian' yang menggabungkan teknologi IoT dengan pelestarian hutan.",
        ocean:
          "Untuk pecinta laut, ada 'Bersih Laut Nusantara' dan 'Kampanye Laut Bersih' yang fokus menyelamatkan ekosistem laut Indonesia dari polusi plastik.",
        urban:
          "Program kota hijau kami keren! 'Smart City Green' dan 'Taman Kota Hijau' mengubah area urban jadi lebih sustainable dan livable.",
        community:
          "Program komunitas seperti 'Garda Hijau Komunitas' dan 'Duta Lingkungan Cilik' memberdayakan masyarakat lokal untuk jadi agen perubahan.",
      },
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.lumaAI = new EnhancedLumaAI()
  
  // Global chatbot interface for component loader
  window.lumaChatbot = window.lumaChatbot || {}
  window.lumaChatbot.initialize = function() {
    console.log("Luma Chatbot initialized successfully")
    return window.lumaAI
  }
})