class EnhancedLumaAI {
  constructor() {
    this.isInitialized = false
    this.conversationHistory = []
    this.userProfile = {
      interests: [],
      completedQuests: [],
      preferredPrograms: [],
      engagementLevel: "beginner",
    }
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
            fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] 
            bg-card/95 backdrop-blur-xl border border-border/50 
            rounded-2xl shadow-2xl transform transition-all duration-500 ease-out
            translate-y-full opacity-0
        `

    chatContainer.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-border/30">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-10 h-10 rounded-full gradient-nusantara flex items-center justify-center animate-glow">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                        <h3 class="font-heading font-bold text-foreground">Luma AI</h3>
                        <p class="text-xs text-muted-foreground" id="luma-status">Siap membantu Anda</p>
                    </div>
                </div>
                <button id="luma-close" class="p-2 hover:bg-muted rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div id="luma-messages" class="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full gradient-nusantara flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="bg-muted/50 rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                        <p class="text-sm text-balance">Halo! Saya Luma, asisten AI Gema Nusa. Saya siap membantu Anda menemukan program lingkungan yang tepat dan menjawab pertanyaan tentang gerakan kita. Apa yang ingin Anda ketahui?</p>
                    </div>
                </div>
            </div>
            
            <div class="p-4 border-t border-border/30">
                <div class="flex gap-2 mb-3" id="luma-quick-actions">
                    <button class="luma-quick-btn px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                        Mulai Quest
                    </button>
                    <button class="luma-quick-btn px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                        Program Terbaru
                    </button>
                    <button class="luma-quick-btn px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                        Dampak Saya
                    </button>
                </div>
                
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="luma-input" 
                        placeholder="Ketik pesan Anda..." 
                        class="flex-1 px-4 py-2 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    >
                    <button 
                        id="luma-send" 
                        class="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            fixed bottom-6 right-6 z-40 w-14 h-14 
            gradient-nusantara rounded-full shadow-lg 
            flex items-center justify-center
            hover:scale-110 transition-all duration-300 animate-glow
        `
    triggerButton.innerHTML = `
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
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

    if (container.classList.contains("translate-y-full")) {
      container.classList.remove("translate-y-full", "opacity-0")
      container.classList.add("translate-y-0", "opacity-100")
      trigger.style.display = "none"
    } else {
      container.classList.add("translate-y-full", "opacity-0")
      container.classList.remove("translate-y-0", "opacity-100")
      trigger.style.display = "flex"
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

    if (sender === "user") {
      messageDiv.className = "flex justify-end"
      messageDiv.innerHTML = `
                <div class="bg-primary text-primary-foreground rounded-2xl rounded-tr-md p-3 max-w-[80%]">
                    <p class="text-sm">${content}</p>
                </div>
            `
    } else {
      messageDiv.className = "flex items-start gap-3"
      messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full gradient-nusantara flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="bg-muted/50 rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                    <p class="text-sm text-balance">${content}</p>
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

  generateAdvancedResponse(message) {
    const lowerMessage = message.toLowerCase()
    const context = this.analyzeContext(lowerMessage)

    // Advanced intent recognition
    if (context.intent === "quest") {
      return this.generateQuestResponse(context)
    } else if (context.intent === "program") {
      return this.generateProgramResponse(context)
    } else if (context.intent === "impact") {
      return this.generateImpactResponse(context)
    } else if (context.intent === "collaboration") {
      return this.generateCollaborationResponse(context)
    } else if (context.intent === "greeting") {
      return this.generatePersonalizedGreeting(context)
    }

    return this.generateContextualResponse(context)
  }

  analyzeContext(message) {
    const context = {
      intent: "general",
      entities: [],
      sentiment: "neutral",
      topics: [],
    }

    // Intent detection
    if (message.includes("quest") || message.includes("rekomendasi") || message.includes("cocok")) {
      context.intent = "quest"
    } else if (message.includes("program") || message.includes("kegiatan") || message.includes("aktivitas")) {
      context.intent = "program"
    } else if (message.includes("dampak") || message.includes("hasil") || message.includes("pencapaian")) {
      context.intent = "impact"
    } else if (message.includes("kolaborasi") || message.includes("kerjasama") || message.includes("bergabung")) {
      context.intent = "collaboration"
    } else if (message.includes("halo") || message.includes("hai") || message.includes("hello")) {
      context.intent = "greeting"
    }

    // Entity extraction
    const environmentalTerms = ["hutan", "laut", "sampah", "plastik", "pohon", "air", "udara", "energi"]
    environmentalTerms.forEach((term) => {
      if (message.includes(term)) {
        context.entities.push(term)
        context.topics.push("environment")
      }
    })

    return context
  }

  generateQuestResponse(context) {
    const responses = [
      "Wah, seru! Quest Luma dirancang khusus untuk menemukan program lingkungan yang paling cocok dengan kepribadian dan minat Anda. Mau mulai sekarang? Saya akan tanya beberapa hal menarik tentang Anda!",
      "Quest Luma adalah fitur favorit saya! Dengan 5 pertanyaan cerdas, saya bisa merekomendasikan program yang benar-benar sesuai dengan passion Anda. Siap untuk petualangan menemukan misi lingkungan Anda?",
      "Perfect timing! Quest Luma menggunakan AI untuk menganalisis preferensi Anda dan mencocokkannya dengan 8+ program unggulan kami. Hasilnya? Program yang bikin Anda excited untuk berkontribusi!",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  generateProgramResponse(context) {
    if (context.entities.includes("hutan")) {
      return "Program hutan kami keren banget! Ada 'Penjaga Hutan Nusantara' untuk yang suka petualangan, dan 'Smart Forest Guardian' yang menggabungkan teknologi dengan konservasi. Mana yang lebih menarik buat Anda?"
    } else if (context.entities.includes("laut")) {
      return "Untuk pecinta laut, kami punya 'Bersih Laut Nusantara' dan 'Kampanye Laut Bersih'. Keduanya fokus pada pelestarian ekosistem laut Indonesia. Mau tahu lebih detail tentang aktivitas dan dampaknya?"
    }

    return "Kami punya 8 program unggulan yang bisa Anda pilih! Mulai dari konservasi hutan, pembersihan laut, hingga smart city green. Setiap program punya pendekatan unik. Mau saya rekomendasikan yang paling cocok lewat Quest?"
  }

  generateImpactResponse(context) {
    return "Dampak Gema Nusa sudah luar biasa! Lebih dari 50,000 pohon ditanam, 25 ton sampah plastik dikumpulkan, dan 150+ komunitas lokal terlibat aktif. Yang paling membanggakan? 85% peserta melanjutkan aksi lingkungan setelah program selesai!"
  }

  generateCollaborationResponse(context) {
    return "Kolaborasi adalah jantung Gema Nusa! Kami bermitra dengan 50+ organisasi, dari startup teknologi hingga komunitas adat. Platform kami menghubungkan Anda dengan ribuan changemaker muda Indonesia. Mau bergabung dengan gerakan ini?"
  }

  generatePersonalizedGreeting(context) {
    const greetings = [
      `Halo, eco-warrior! 🌱 Senang bertemu dengan Anda di Gema Nusa. Saya Luma, siap membantu Anda menemukan cara terbaik berkontribusi untuk lingkungan Indonesia!`,
      `Hai there! Saya Luma, AI companion Anda di perjalanan menyelamatkan bumi. Ada yang ingin Anda ketahui tentang program-program keren kami?`,
      `Selamat datang di Gema Nusa! Saya Luma, dan saya excited banget bisa membantu Anda menemukan passion lingkungan Anda. Dari mana kita mulai?`,
    ]

    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  generateContextualResponse(context) {
    const responses = [
      "Pertanyaan menarik! Sebagai AI yang peduli lingkungan, saya selalu excited membahas topik ini. Bisa Anda ceritakan lebih spesifik apa yang ingin Anda ketahui?",
      "Hmm, saya ingin memahami lebih dalam apa yang Anda maksud. Mungkin bisa dijelaskan dengan contoh? Saya siap membantu dengan informasi yang lebih tepat!",
      "Saya menangkap ada ketertarikan pada topik lingkungan dari pertanyaan Anda. Mari kita explore lebih dalam! Apa aspek yang paling menarik buat Anda?",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  handleQuickAction(action) {
    switch (action) {
      case "Mulai Quest":
        this.addMessage("Saya ingin memulai Quest untuk menemukan program yang cocok!", "user")
        setTimeout(() => {
          this.addMessage(
            "Fantastic! Mari kita mulai Quest Luma. Saya akan menanyakan 5 pertanyaan untuk memahami kepribadian dan preferensi Anda. Siap? Pertanyaan pertama: Apa yang paling memotivasi Anda untuk peduli lingkungan?",
            "ai",
          )
        }, 1000)
        break
      case "Program Terbaru":
        this.addMessage("Apa saja program terbaru yang tersedia?", "user")
        setTimeout(() => {
          this.addMessage(
            'Program terbaru kami super exciting! Ada "Smart Forest Guardian" yang menggunakan IoT untuk monitoring hutan, dan "Ocean Plastic Innovation" yang mengubah sampah plastik jadi produk berguna. Mau tahu lebih detail?',
            "ai",
          )
        }, 1000)
        break
      case "Dampak Saya":
        this.addMessage("Bagaimana cara melihat dampak kontribusi saya?", "user")
        setTimeout(() => {
          this.addMessage(
            "Great question! Setiap aksi Anda di Gema Nusa terekam dalam dashboard personal. Anda bisa lihat pohon yang ditanam, sampah yang dikumpulkan, dan komunitas yang terbantu. Plus ada badge achievement yang keren!",
            "ai",
          )
        }, 1000)
        break
    }
  }

  updateUserProfile(message) {
    // Simple learning mechanism
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hutan")) {
      this.userProfile.interests.push("forest_conservation")
    } else if (lowerMessage.includes("laut")) {
      this.userProfile.interests.push("ocean_cleanup")
    } else if (lowerMessage.includes("teknologi")) {
      this.userProfile.interests.push("green_technology")
    }

    // Remove duplicates
    this.userProfile.interests = [...new Set(this.userProfile.interests)]

    // Save to localStorage
    localStorage.setItem("luma_user_profile", JSON.stringify(this.userProfile))
  }

  loadUserProfile() {
    const saved = localStorage.getItem("luma_user_profile")
    if (saved) {
      this.userProfile = { ...this.userProfile, ...JSON.parse(saved) }
    }
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
