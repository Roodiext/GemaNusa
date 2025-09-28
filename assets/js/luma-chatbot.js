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
    
    this.topicCategories = {
      environment: ["lingkungan", "alam", "bumi", "ekosistem", "polusi", "konservasi"],
      programs: ["program", "kegiatan", "acara", "aktivitas", "proyek"],
      quest: ["quest", "kuis", "tes", "rekomendasi", "cocok", "sesuai"],
      impact: ["dampak", "hasil", "pencapaian", "perubahan", "statistik"],
      community: ["komunitas", "relawan", "volunteer", "bergabung", "kolaborasi"],
      help: ["bantuan", "tanya", "info", "informasi", "cara"]
    }

    this.fallbackResponses = [
      "Maaf, saya kurang memahami maksud Anda. Bagaimana kalau kita membahas program-program lingkungan kami?",
      "Hmm, saya masih belajar untuk topik itu. Tapi saya bisa membantu Anda menemukan program lingkungan yang sesuai.",
      "Wah, itu topik yang menarik! Bagaimana kalau kita eksplorasi program-program Gema Nusa?"
    ]

    this.contextualResponses = this.initializeAdvancedResponses()
    this.init()
  }

  init() {
    if (this.isInitialized) return
    this.createInterface()
    this.setupEventListeners()
    this.isInitialized = true
    console.log("Luma Chat initialized successfully")
  }

  initialize() {
    console.log("Luma Chatbot initialized successfully")
    return this
  }

  createInterface() {
    // Chat Container - Desain seperti WhatsApp Web
    const chatContainer = document.createElement("div")
    chatContainer.id = "luma-chat-container"
    chatContainer.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 380px;
        height: 500px;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        border: 1px solid #e5e7eb;
        z-index: 1000;
        display: none;
        flex-direction: column;
    `

    chatContainer.innerHTML = `
        <!-- Header seperti WhatsApp -->
        <div style="
            background: #7b00ffff;
            color: white;
            padding: 16px 20px;
            border-radius: 8px 8px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
        " class="font-sans">
            <div style="display: flex; align-items: center; gap: 12px;">
    <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    ">
        <img src="/assets/img/luma-ai-bot/luma-ai-bot.svg" alt="Icon" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div>
        <div style="font-weight: 500; font-size: 16px;">Luma AI Bot</div>
        <div style="font-size: 12px; opacity: 0.8;" id="luma-status">Lumens Nusantara AI Bot</div>
    </div>
</div>

            <button id="luma-close-btn" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 4px;
                opacity: 0.8;
            ">×</button>
        </div>
        
        <!-- Messages Area -->
        <div id="luma-messages" style="
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #f0f2f5;
            display: flex;
            flex-direction: column;
            gap: 12px;
        ">
            <div style="
                background: white;
                padding: 12px 16px;
                border-radius: 12px 12px 12px 4px;
                max-width: 280px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                font-size: 14px;
                line-height: 1.4;
                color: #374151;
                position: relative;
            ">
                <div style="font-weight: 500; color: #7b00ffff; margin-bottom: 4px;">Luma</div>
                Halo! Saya Luma dari Gema Nusa. Saya di sini untuk membantu Anda dengan informasi program lingkungan, quest, dan cara bergabung dengan komunitas kami. Ada yang ingin ditanyakan?
                <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
                    ${new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>
        
        <!-- Quick Replies -->
        <div style="
            padding: 12px 16px 8px;
            background: #f0f2f5;
            border-top: 1px solid #e5e7eb;
        ">
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <button class="quick-reply-btn" data-msg="Apa itu Quest Luma?" style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                ">🎯 Quest Luma</button>
                <button class="quick-reply-btn" data-msg="Program apa saja yang tersedia?" style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                ">🌱 Program Kami</button>
                <button class="quick-reply-btn" data-msg="Bagaimana cara bergabung?" style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                ">👥 Gabung</button>
                <button class="quick-reply-btn" data-msg="Dampak apa yang sudah dicapai?" style="
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 6px 12px;
                    font-size: 12px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                ">📊 Dampak</button>
            </div>
        </div>
        
        <!-- Input Area -->
        <div style="
            padding: 12px 16px;
            background: white;
            border-radius: 0 0 8px 8px;
            border-top: 1px solid #e5e7eb;
        ">
            <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                background: #f9fafb;
                border-radius: 24px;
                padding: 8px 16px;
                border: 1px solid #e5e7eb;
            ">
                <input 
                    type="text" 
                    id="luma-message-input" 
                    placeholder="Ketik pesan..." 
                    style="
                        flex: 1;
                        background: none;
                        border: none;
                        outline: none;
                        font-size: 14px;
                        color: #374151;
                        font-family: inherit;
                    "
                >
                <button 
                    id="luma-send-btn" 
                    style="
                        background: #7b00ffff;
                        border: none;
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                    "
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `

    document.body.appendChild(chatContainer)

    // Floating Button - Desain seperti WhatsApp
    const floatingBtn = document.createElement("button")
floatingBtn.id = "luma-floating-btn"
floatingBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 200px; /* jauh lebih besar */
    height: 200px;
    background: transparent; /* transparan biar full image */
    border: none;
    cursor: pointer;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding: 0;
    overflow: hidden;
`


// Ganti emoji jadi image
const img = document.createElement("img")
img.src = "/assets/img/luma-ai-bot/luma-ai-greeting.svg" // contoh: logo WA
img.alt = "Chat"  
img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
`

floatingBtn.appendChild(img)

floatingBtn.addEventListener('mouseenter', () => {
    floatingBtn.style.transform = 'scale(1.15)'
})

floatingBtn.addEventListener('mouseleave', () => {
    floatingBtn.style.transform = 'scale(1)'
})

document.body.appendChild(floatingBtn)

// Tambahan CSS
const style = document.createElement('style')
style.textContent = `
    .quick-reply-btn:hover {
        background-color: #f3f4f6 !important;
        border-color: #9ca3af !important;
    }
    #luma-send-btn:hover {
        background-color: #7b00ffff !important;
    }
    #luma-send-btn:disabled {
        background-color: #9ca3af !important;
        cursor: not-allowed !important;
    }
`
document.head.appendChild(style)
  }

  setupEventListeners() {
    const floatingBtn = document.getElementById("luma-floating-btn")
    const closeBtn = document.getElementById("luma-close-btn")
    const sendBtn = document.getElementById("luma-send-btn")
    const messageInput = document.getElementById("luma-message-input")
    const quickBtns = document.querySelectorAll(".quick-reply-btn")

    // Toggle chat
    floatingBtn?.addEventListener("click", () => this.toggleChat())
    closeBtn?.addEventListener("click", () => this.toggleChat())

    // Send message
    sendBtn?.addEventListener("click", () => this.sendMessage())
    messageInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    // Quick replies
    quickBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const message = btn.getAttribute("data-msg")
        if (message) {
          messageInput.value = message
          this.sendMessage()
        }
      })
    })

    // Input validation
    messageInput?.addEventListener("input", (e) => {
      const isEmpty = e.target.value.trim().length === 0
      sendBtn.disabled = isEmpty
      sendBtn.style.opacity = isEmpty ? "0.5" : "1"
    })
  }

  toggleChat() {
    const container = document.getElementById("luma-chat-container")
    const floatingBtn = document.getElementById("luma-floating-btn")
    
    if (container.style.display === "none" || !container.style.display) {
        container.style.display = "flex"
        floatingBtn.style.opacity = "0.5"
        setTimeout(() => {
            document.getElementById("luma-message-input")?.focus()
        }, 100)
    } else {
        container.style.display = "none"
        floatingBtn.style.opacity = "1"
    }
  }

  sendMessage() {
    const input = document.getElementById("luma-message-input")
    const message = input?.value?.trim()
    
    if (!message) return

    // Add user message
    this.addMessage(message, "user")
    input.value = ""
    
    // Show typing
    this.showTyping()
    
    // Simulate response delay
    setTimeout(() => {
      this.hideTyping()
      const response = this.generateResponse(message)
      this.addMessage(response, "bot")
    }, Math.random() * 1000 + 500)
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById("luma-messages")
    const messageDiv = document.createElement("div")
    const time = new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})

    if (sender === "user") {
        messageDiv.style.cssText = "align-self: flex-end; max-width: 280px;"
        messageDiv.innerHTML = `
            <div style="
                background: #f1ebf8ff;
                padding: 12px 16px;
                border-radius: 12px 12px 4px 12px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                font-size: 14px;
                line-height: 1.4;
                color: #374151;
                word-wrap: break-word;
            ">
                ${content}
                <div style="font-size: 11px; color: #6b7280; margin-top: 6px; text-align: right;">
                    ${time}
                </div>
            </div>
        `
    } else {
        messageDiv.style.cssText = "align-self: flex-start; max-width: 280px;"
        messageDiv.innerHTML = `
            <div style="
                background: white;
                padding: 12px 16px;
                border-radius: 12px 12px 12px 4px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                font-size: 14px;
                line-height: 1.4;
                color: #374151;
                word-wrap: break-word;
            ">
                <div style="font-weight: 500; color: #7b00ffff; margin-bottom: 4px;">Luma</div>
                ${content}
                <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
                    ${time}
                </div>
            </div>
        `
    }

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    this.conversationHistory.push({ content, sender, timestamp: Date.now() })
  }

  showTyping() {
    const messagesContainer = document.getElementById("luma-messages")
    const typingDiv = document.createElement("div")
    typingDiv.id = "typing-indicator"
    typingDiv.style.cssText = "align-self: flex-start; max-width: 80px;"
    
    typingDiv.innerHTML = `
        <div style="
            background: white;
            padding: 16px;
            border-radius: 12px 12px 12px 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            display: flex;
            gap: 4px;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
            "></div>
            <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
                animation-delay: 0.2s;
            "></div>
            <div style="
                width: 8px;
                height: 8px;
                background: #9ca3af;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
                animation-delay: 0.4s;
            "></div>
        </div>
    `

    messagesContainer.appendChild(typingDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
    document.getElementById("luma-status").textContent = "mengetik..."

    // Add bounce animation if not exists
    if (!document.querySelector('#bounce-animation')) {
        const bounceStyle = document.createElement('style')
        bounceStyle.id = 'bounce-animation'
        bounceStyle.textContent = `
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `
        document.head.appendChild(bounceStyle)
    }
  }

  hideTyping() {
    const typingIndicator = document.getElementById("typing-indicator")
    if (typingIndicator) typingIndicator.remove()
    document.getElementById("luma-status").textContent = "Tim Gema Nusa"
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes("quest")) {
        return "Quest Luma adalah fitur interaktif untuk mengetahui program mana yang paling cocok dengan minat dan kemampuan Anda! Quest ini berupa serangkaian pertanyaan singkat yang akan membantu kami memberikan rekomendasi program terbaik."
    } else if (lowerMessage.includes("program")) {
        return "Kami memiliki berbagai program lingkungan seperti:\n\n🌲 Program Hutan - konservasi dan restorasi hutan\n🌊 Program Laut - pelestarian ekosistem laut\n♻️ Program Daur Ulang - pengelolaan sampah berkelanjutan\n🌱 Program Pertanian - pertanian berkelanjutan\n\nMau tahu lebih detail program yang mana?"
    } else if (lowerMessage.includes("gabung") || lowerMessage.includes("bergabung")) {
        return "Bergabung dengan Gema Nusa sangat mudah!\n\n1️⃣ Daftar di website kami\n2️⃣ Pilih program yang sesuai minat\n3️⃣ Ikuti orientasi online\n4️⃣ Mulai berkontribusi!\n\nApakah Anda sudah memiliki program yang diminati?"
    } else if (lowerMessage.includes("dampak")) {
        return "Sampai saat ini, Gema Nusa telah mencapai:\n\n🌳 15,000+ pohon ditanam\n🐠 500+ hektar laut dilindungi\n♻️ 2,500+ ton sampah didaur ulang\n👥 10,000+ relawan aktif\n\nSemua ini berkat kontribusi orang-orang hebat seperti Anda!"
    } else if (lowerMessage.includes("halo") || lowerMessage.includes("hai")) {
        return "Halo juga! Senang bertemu dengan Anda. Saya di sini untuk membantu Anda mengenal lebih jauh tentang Gema Nusa dan program-program lingkungan kami. Ada yang ingin Anda ketahui?"
    } else {
        return "Terima kasih atas pertanyaannya! Saya akan dengan senang hati membantu Anda. Anda bisa bertanya tentang program kami, cara bergabung, atau mencoba Quest Luma untuk menemukan program yang tepat untuk Anda."
    }
  }

  initializeAdvancedResponses() {
    return {
      greetings: ["Halo! Saya Luma dari Gema Nusa 🌱"],
      programs: { 
        forest: "Program hutan kami sangat menarik!", 
        ocean: "Program laut kami luar biasa!" 
      },
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.lumaAI = new EnhancedLumaAI()
  window.lumaChatbot = window.lumaChatbot || {}
  window.lumaChatbot.initialize = function() {
    console.log("Luma Chatbot initialized successfully")
    return window.lumaAI
  }
})