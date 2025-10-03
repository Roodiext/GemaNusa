class EnhancedLumaAI {
  constructor() {
    this.isInitialized = false;
    this.conversationHistory = [];
    this.userProfile = {
      interests: [],
      completedQuests: [],
      preferredPrograms: [],
      engagementLevel: "beginner",
    };

    // Bubble chat system
    this.bubbleMessages = [
      "Halo! Aku Luma, Selamat datang di Gema Nusa!",
      "Yuk, jelajahi program-program lingkungan kita bersama! 🌱",
      "Ada yang ingin kamu tanyakan tentang konservasi alam? 🌍",
      "Aku bisa bantu kamu temukan program yang cocok! 🎯",
      "Mari bersama-sama jaga bumi untuk masa depan! 💚",
      "Klik aku kalau mau ngobrol lebih lanjut! 💬"
    ];
    this.currentMessageIndex = 0;
    this.bubbleTimer = null;
    this.bubbleVisible = false;

    // Enhanced topic categories dengan lebih banyak kata kunci
    this.topicCategories = {
      environment: [
        "lingkungan", "alam", "bumi", "ekosistem", "polusi", "konservasi",
        "hutan", "laut", "sungai", "pencemaran", "sampah", "plastik",
        "perubahan iklim", "pemanasan global", "emisi", "karbon", "iklim",
        "global warming", "greenhouse", "ozon", "pencemaran udara", "pencemaran air"
      ],
      programs: [
        "program", "kegiatan", "acara", "aktivitas", "proyek", "inisiatif",
        "kampanye", "gerakan", "aksi", "event", "kegiatan lingkungan", "proyek lingkungan"
      ],
      quest: [
        "quest", "kuis", "tes", "rekomendasi", "cocok", "sesuai", 
        "rekomendasi program", "tes minat", "penilaian", "assessment", "quiz"
      ],
      impact: [
        "dampak", "hasil", "pencapaian", "perubahan", "statistik",
        "pencapaian", "kontribusi", "pengaruh", "manfaat", "achievement",
        "result", "outcome", "impact"
      ],
      community: [
        "komunitas", "relawan", "volunteer", "bergabung", "kolaborasi",
        "anggota", "partisipasi", "sukarelawan", "tim", "community",
        "join", "partisipasi", "anggota baru"
      ],
      help: [
        "bantuan", "tanya", "info", "informasi", "cara", "help",
        "bantuan", "support", "tolong", "panduan", "faq", "how to"
      ],
      organization: [
        "gema nusa", "organisasi", "yayasan", "lembaga", "visi", "misi",
        "tujuan", "sejarah", "latar belakang", "tentang kami", "about",
        "foundation", "ngo"
      ],
      donation: [
        "donasi", "sumbangan", "kontribusi", "bantuan dana", "funding",
        "sponsor", "dukungan finansial", "donate", "sponsorship", "fund"
      ],
      contact: [
        "kontak", "hubungi", "alamat", "email", "telepon", "whatsapp",
        "contact", "location", "alamat kantor", "nomor telepon"
      ],
      events: [
        "event", "acara", "webinar", "seminar", "workshop", "pelatihan",
        "training", "lokakarya", "simposium", "konferensi"
      ]
    };

    // Enhanced fallback responses
    this.fallbackResponses = [
      "Terima kasih atas pertanyaannya! Mohon maaf, untuk saat ini saya belum bisa merespons pertanyaan tersebut. Namun saya bisa membantu Anda dengan informasi tentang program lingkungan, Quest Luma, atau cara bergabung dengan komunitas kami.",
      "Pertanyaan yang menarik! Saat ini pengetahuan saya masih terbatas pada topik lingkungan dan program Gema Nusa. Ada hal lain yang bisa saya bantu?",
      "Maaf, saya masih belajar untuk topik itu. Tapi saya bisa membantu Anda menemukan program lingkungan yang sesuai atau menjelaskan tentang Quest Luma!",
      "Wah, pertanyaan yang bagus! Untuk saat ini, saya fokus membantu mengenai program lingkungan Gema Nusa. Mau tahu tentang Quest Luma atau program kami yang lain?"
    ];

    // Enhanced response patterns
    this.responsePatterns = this.initializeResponsePatterns();
    this.contextualResponses = this.initializeAdvancedResponses();
    this.init();
  }

  initializeResponsePatterns() {
    return [
      {
        patterns: [/quest|luma quest|kuis|tes|rekomendasi program|test minat/i],
        response: "Quest Luma adalah fitur interaktif untuk mengetahui program mana yang paling cocok dengan minat dan kemampuan Anda! Quest ini berupa serangkaian pertanyaan singkat yang akan membantu kami memberikan rekomendasi program terbaik. Mau mulai quest sekarang?",
        followUp: "quest"
      },
      {
        patterns: [/program|kegiatan|acara|aktivitas|proyek|inisiatif|kampanye/i],
        response: "Kami memiliki berbagai program lingkungan seperti:\n\n🌲 **Program Hutan** - konservasi dan restorasi hutan\n🌊 **Program Laut** - pelestarian ekosistem laut\n♻️ **Program Daur Ulang** - pengelolaan sampah berkelanjutan\n🌱 **Program Pertanian** - pertanian berkelanjutan\n🏙️ **Program Perkotaan** - green city dan urban farming\n\nProgram mana yang ingin Anda ketahui lebih detail?",
        followUp: "programs"
      },
      {
        patterns: [/gabung|bergabung|daftar|menjadi relawan|volunteer|anggota|partisipasi/i],
        response: "Bergabung dengan Gema Nusa sangat mudah!\n\n1️⃣ **Daftar** di website kami atau melalui aplikasi\n2️⃣ **Pilih program** yang sesuai minat dan lokasi\n3️⃣ **Ikuti orientasi** online atau offline\n4️⃣ **Mulai berkontribusi** sesuai kemampuan!\n\nApakah Anda sudah memiliki program yang diminati?",
        followUp: "join"
      },
      {
        patterns: [/dampak|hasil|pencapaian|statistik|perubahan|kontribusi|pencapaian/i],
        response: "Sampai saat ini, Gema Nusa telah mencapai:\n\n🌳 **15,000+ pohon** ditanam di berbagai wilayah\n🐠 **500+ hektar** ekosistem laut dilindungi\n♻️ **2,500+ ton** sampah berhasil didaur ulang\n👥 **10,000+ relawan** aktif berkontribusi\n🏆 **50+ komunitas** terbentuk di seluruh Indonesia\n\nSemua ini berkat kontribusi orang-orang hebat seperti Anda!",
        followUp: "impact"
      },
      {
        patterns: [/halo|hai|hei|hallo|hi|helo|selamat pagi|selamat siang|selamat malam/i],
        response: "Halo juga! 👋 Senang bertemu dengan Anda. Saya Luma, asisten virtual Gema Nusa. Saya di sini untuk membantu Anda mengenal lebih jauh tentang program lingkungan, Quest Luma, dan cara bergabung dengan komunitas kami. Ada yang ingin Anda ketahui?",
        followUp: "greeting"
      },
      {
        patterns: [/terima kasih|makasih|thanks|thank you|thx|terimakasih/i],
        response: "Sama-sama! 😊 Senang bisa membantu. Jika ada pertanyaan lain tentang Gema Nusa atau program lingkungan, jangan ragu untuk bertanya ya!",
        followUp: "thanks"
      },
      {
        patterns: [/bye|selamat tinggal|sampai jumpa|dadah|goodbye|daah|see you/i],
        response: "Sampai jumpa! 👋 Terima kasih sudah berkunjung. Jangan lupa untuk menjaga bumi kita ya! 🌍💚 Kalau ada yang ingin ditanyakan lagi, saya selalu di sini.",
        followUp: "goodbye"
      },
      {
        patterns: [/apa itu gema nusa|tentang gema nusa|organisasi|visi misi|sejarah gema nusa/i],
        response: "Gema Nusa adalah gerakan sosial dan kreatif yang menyatukan generasi muda Indonesia dalam aksi nyata untuk lingkungan dan keberlanjutan. 🎯\n\n**Visi kami:** Menciptakan Indonesia yang hijau dan berkelanjutan melalui kolaborasi anak muda.\n\n**Misi:**\n• Melestarikan lingkungan melalui aksi nyata\n• Memberdayakan generasi muda\n• Membangun komunitas peduli lingkungan",
        followUp: "about"
      },
      {
        patterns: [/donasi|sumbangan|bantuan dana|kontribusi finansial|sponsor|dukungan dana/i],
        response: "Anda bisa berkontribusi melalui donasi untuk mendukung program-program lingkungan kami. Donasi digunakan untuk:\n• Penanaman pohon\n• Konservasi laut\n• Program edukasi lingkungan\n• Pengembangan komunitas\n\nInfo lebih lanjut bisa dicek di website kami atau hubungi tim kami ya!",
        followUp: "donation"
      },
      {
        patterns: [/lokasi|alamat|kantor|cabang|regional|dimana lokasinya/i],
        response: "Gema Nusa memiliki jaringan komunitas di berbagai kota di Indonesia. Kami berbasis digital dengan komunitas lokal yang tersebar. Untuk info komunitas terdekat, bisa dicek di halaman komunitas website kami atau tanyakan langsung ke admin.",
        followUp: "location"
      },
      {
        patterns: [/kontak|hubungi|email|telepon|whatsapp|nomor hp|contact/i],
        response: "Anda bisa menghubungi kami melalui:\n📧 Email: info@gemanusa.org\n📱 WhatsApp: +62-XXX-XXXX-XXXX\n🌐 Website: www.gemanusa.org\n\nKami akan dengan senang hati membantu Anda!",
        followUp: "contact"
      },
      {
        patterns: [/event|acara|webinar|seminar|workshop|pelatihan|training/i],
        response: "Kami rutin mengadakan berbagai event lingkungan seperti:\n• Webinar lingkungan\n• Workshop daur ulang\n• Aksi tanam pohon\n• Beach cleanup\n• Pelatihan relawan\n\nCek jadwal terbaru di website kami atau media sosial Gema Nusa!",
        followUp: "events"
      },
      {
        patterns: [/bagaimana cara|tutorial|panduan|step by step|cara membuat/i],
        response: "Saya bisa bantu memberikan panduan! Bisa jelaskan lebih detail apa yang ingin Anda ketahui caranya? Misalnya cara bergabung, cara ikut program, atau yang lainnya?",
        followUp: "tutorial"
      }
    ];
  }

  init() {
    if (this.isInitialized) return;
    this.createInterface();
    this.setupEventListeners();
    this.startBubbleChat();
    this.isInitialized = true;
    console.log("Luma Chat initialized successfully");
  }

  initialize() {
    console.log("Luma Chatbot initialized successfully");
    return this;
  }

  createInterface() {
    // Chat Container - Desain seperti WhatsApp Web
    const chatContainer = document.createElement("div");
    chatContainer.id = "luma-chat-container";
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
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 120px);
    `;

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
        <div class="font-product" style="font-weight: 500; font-size: 16px;">Luma AI Bot</div>
        <div class="font-inter" style="font-size: 12px; opacity: 0.8;" id="luma-status">Tim Gema Nusa</div>
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
                transition: opacity 0.2s;
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
            <div class="font-inter" style="
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
                <div class="font-inter" style="font-weight: 500; color: #7b00ffff; margin-bottom: 4px;">Luma</div>
                Halo! Saya Luma dari Gema Nusa. Saya di sini untuk membantu Anda dengan informasi program lingkungan, quest, dan cara bergabung dengan komunitas kami. Ada yang ingin ditanyakan?
                <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
                    ${new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
        
        <!-- Quick Replies -->
        <div style="
            padding: 12px 16px 8px;
            background: #f0f2f5;
            border-top: 1px solid #e5e7eb;
        ">
            <div class="font-inter" style="display: flex; flex-wrap: wrap; gap: 8px;">
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
            <div class="font-inter" style="
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
                        opacity: 0.5;
                    "
                    disabled
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(chatContainer);

    // Luma Mascot Container (Always Visible) - Larger size for desktop
    const mascotContainer = document.createElement("div");
    mascotContainer.id = "luma-mascot-container";
    mascotContainer.style.cssText = `
      position: fixed;
      bottom: 8px;
      right: 16px;
      z-index: 30;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const mascotImg = document.createElement("img");
    mascotImg.id = "luma-mascot";
    mascotImg.src = "/assets/img/luma-ai-bot/luma-ai-bot.svg";
    mascotImg.alt = "Luma";
    mascotImg.style.cssText = `
      width: 64px;
      height: 64px;
      object-fit: contain;
      cursor: pointer;
      transition: all 0.3s ease;
    `;

    mascotImg.addEventListener("mouseenter", () => {
      mascotImg.style.transform = "scale(1.15)";
      mascotImg.style.filter = "drop-shadow(0 0 12px rgba(123, 0, 255, 0.4))";
    });

    mascotImg.addEventListener("mouseleave", () => {
      mascotImg.style.transform = "scale(1)";
      mascotImg.style.filter = "none";
    });

    mascotContainer.appendChild(mascotImg);
    document.body.appendChild(mascotContainer);

    // Bubble Chat (Separate from Mascot)
    const bubbleChat = document.createElement("div");
    bubbleChat.id = "luma-bubble-chat";
    bubbleChat.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      z-index: 30;
      transform: translateY(16px);
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 20rem;
    `;

    bubbleChat.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        border: 1px solid #e5e7eb;
        padding: 16px;
        margin-bottom: 90px;
        margin-right: 50px;
        position: relative;
      ">
        <p id="luma-bubble-message" style="
          color: #374151;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          font-family: 'Inter', sans-serif;
        "></p>
        <!-- Chat bubble tail pointing to mascot -->
        <div style="
          position: absolute;
          bottom: -4px;
          right: 8px;
          width: 12px;
          height: 12px;
          background: white;
          transform: rotate(45deg);
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        "></div>
      </div>
    `;

    document.body.appendChild(bubbleChat);

    // Tambahan CSS
    const style = document.createElement("style");
    style.textContent = `
    .quick-reply-btn:hover {
        background-color: #f3f4f6 !important;
        border-color: #9ca3af !important;
    }
    #luma-send-btn:hover:not(:disabled) {
        background-color: #6a00e6 !important;
        transform: scale(1.05);
    }
    #luma-send-btn:disabled {
        background-color: #9ca3af !important;
        cursor: not-allowed !important;
    }
    #luma-close-btn:hover {
        opacity: 1 !important;
        background: rgba(255,255,255,0.1) !important;
        border-radius: 50%;
    }
`;
    document.head.appendChild(style);
  }

  setupEventListeners() {
    const mascotImg = document.getElementById("luma-mascot");
    const closeBtn = document.getElementById("luma-close-btn");
    const sendBtn = document.getElementById("luma-send-btn");
    const messageInput = document.getElementById("luma-message-input");
    const quickBtns = document.querySelectorAll(".quick-reply-btn");

    // Toggle chat
    mascotImg?.addEventListener("click", () => this.toggleChat());
    closeBtn?.addEventListener("click", () => this.toggleChat());

    // Send message
    sendBtn?.addEventListener("click", () => this.sendMessage());
    messageInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Quick replies
    quickBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const message = btn.getAttribute("data-msg");
        if (message) {
          messageInput.value = message;
          this.sendMessage();
        }
      });
    });

    // Input validation
    messageInput?.addEventListener("input", (e) => {
      const isEmpty = e.target.value.trim().length === 0;
      sendBtn.disabled = isEmpty;
      sendBtn.style.opacity = isEmpty ? "0.5" : "1";
    });
  }

  toggleChat() {
    const container = document.getElementById("luma-chat-container");
    const mascotImg = document.getElementById("luma-mascot");

    if (container.style.display === "none" || !container.style.display) {
      container.style.display = "flex";
      container.classList.add("show");
      mascotImg.style.opacity = "0.7";
      this.stopBubbleChat(); // Stop bubble when chat is open
      setTimeout(() => {
        document.getElementById("luma-message-input")?.focus();
      }, 100);
    } else {
      container.style.display = "none";
      container.classList.remove("show");
      mascotImg.style.opacity = "1";
      this.startBubbleChat(); // Resume bubble when chat is closed
    }
  }

  startBubbleChat() {
    // Show first message after 2 seconds
    setTimeout(() => {
      this.showBubbleMessage();
    }, 2000);
  }

  stopBubbleChat() {
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = null;
    }
    this.hideBubbleMessage();
  }

  showBubbleMessage() {
    const bubbleChat = document.getElementById("luma-bubble-chat");
    const bubbleMessage = document.getElementById("luma-bubble-message");
    
    if (bubbleChat && bubbleMessage && !this.bubbleVisible) {
      // Update message content
      bubbleMessage.textContent = this.bubbleMessages[this.currentMessageIndex];
      
      // Show bubble with animation
      bubbleChat.style.opacity = "1";
      bubbleChat.style.transform = "translateY(0)";
      bubbleChat.classList.add("show");
      this.bubbleVisible = true;
      
      // Hide after 4 seconds
      setTimeout(() => {
        this.hideBubbleMessage();
      }, 4000);
      
      // Move to next message
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.bubbleMessages.length;
    }
  }

  hideBubbleMessage() {
    const bubbleChat = document.getElementById("luma-bubble-chat");
    
    if (bubbleChat && this.bubbleVisible) {
      bubbleChat.style.opacity = "0";
      bubbleChat.style.transform = "translateY(16px)";
      bubbleChat.classList.remove("show");
      this.bubbleVisible = false;
      
      // Schedule next message (8-12 seconds interval)
      const nextInterval = Math.random() * 4000 + 8000; // 8-12 seconds
      this.bubbleTimer = setTimeout(() => {
        this.showBubbleMessage();
      }, nextInterval);
    }
  }

  sendMessage() {
    const input = document.getElementById("luma-message-input");
    const message = input?.value?.trim();

    if (!message) return;

    // Add user message
    this.addMessage(message, "user");
    input.value = "";
    
    // Disable send button after sending
    const sendBtn = document.getElementById("luma-send-btn");
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";

    // Show typing
    this.showTyping();

    // Simulate response delay
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(message);
      this.addMessage(response, "bot");
    }, Math.random() * 1000 + 500);
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById("luma-messages");
    const messageDiv = document.createElement("div");
    const time = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (sender === "user") {
      messageDiv.style.cssText = "align-self: flex-end; max-width: 280px;";
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
        `;
    } else {
      messageDiv.style.cssText = "align-self: flex-start; max-width: 280px;";
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
                ${content.replace(/\n/g, '<br>')}
                <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
                    ${time}
                </div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.conversationHistory.push({ content, sender, timestamp: Date.now() });
  }

  showTyping() {
    const messagesContainer = document.getElementById("luma-messages");
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.style.cssText = "align-self: flex-start; max-width: 80px;";

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
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    document.getElementById("luma-status").textContent = "mengetik...";

    // Add bounce animation if not exists
    if (!document.querySelector("#bounce-animation")) {
      const bounceStyle = document.createElement("style");
      bounceStyle.id = "bounce-animation";
      bounceStyle.textContent = `
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
      document.head.appendChild(bounceStyle);
    }
  }

  hideTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) typingIndicator.remove();
    document.getElementById("luma-status").textContent = "Tim Gema Nusa";
  }

  // Enhanced response generation dengan pattern matching
  generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Cek pattern matching terlebih dahulu
    for (const pattern of this.responsePatterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(lowerMessage)) {
          return pattern.response;
        }
      }
    }

    // Fallback berdasarkan kategori kata kunci
    const detectedCategories = this.detectCategories(lowerMessage);
    
    if (detectedCategories.length > 0) {
      const primaryCategory = detectedCategories[0];
      return this.getCategoryResponse(primaryCategory);
    }

    // Ultimate fallback - random dari fallback responses
    return this.fallbackResponses[
      Math.floor(Math.random() * this.fallbackResponses.length)
    ];
  }

  detectCategories(message) {
    const categories = [];
    for (const [category, keywords] of Object.entries(this.topicCategories)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        categories.push(category);
      }
    }
    return categories;
  }

  getCategoryResponse(category) {
    const responses = {
      environment: "Topik lingkungan memang sangat penting! 🌍 Di Gema Nusa, kami memiliki berbagai program konservasi alam mulai dari hutan hingga laut. Mau tahu program apa saja yang tersedia?",
      programs: "Program kami sangat beragam dan menarik! 🌱 Ada program hutan, laut, daur ulang, pertanian berkelanjutan, dan banyak lagi. Program mana yang ingin Anda ketahui lebih detail?",
      quest: "Quest Luma bisa membantu menemukan program yang cocok untuk Anda! 🎯 Hanya butuh 2-3 menit untuk menyelesaikannya. Dengan quest ini, Anda bisa dapat rekomendasi program yang sesuai minat. Mau mencoba?",
      impact: "Kami bangga dengan dampak yang telah dicapai bersama relawan! 📊 Hingga kini sudah 15,000+ pohon ditanam, 500+ hektar laut dilindungi, dan 10,000+ relawan aktif berkontribusi. Ingin berkontribusi juga?",
      community: "Komunitas Gema Nusa tersebar di seluruh Indonesia! 👥 Bergabung sangat mudah dan Anda bisa memilih program sesuai minat dan lokasi. Mau tahu caranya bergabung?",
      help: "Saya di sini untuk membantu! 😊 Anda bisa bertanya tentang program, Quest Luma, cara bergabung, dampak yang sudah kami capai, atau info lainnya tentang Gema Nusa.",
      organization: "Gema Nusa adalah wadah bagi generasi muda untuk aksi lingkungan yang nyata! 🎯 Visi kami menciptakan Indonesia yang hijau dan berkelanjutan melalui kolaborasi anak muda!",
      donation: "Terima kasih atas ketertarikan untuk mendukung! 💜 Donasi sangat membantu kelangsungan program lingkungan kami seperti penanaman pohon, konservasi laut, dan edukasi lingkungan.",
      contact: "Untuk informasi lebih lanjut, Anda bisa menghubungi kami melalui email, WhatsApp, atau media sosial. Tim kami akan dengan senang hati membantu Anda!",
      events: "Kami rutin mengadakan berbagai event dan kegiatan lingkungan! 🗓️ Mulai dari webinar, workshop, aksi tanam pohon, hingga beach cleanup. Cek jadwal terbaru di website kami!"
    };
    
    return responses[category] || this.fallbackResponses[0];
  }

  initializeAdvancedResponses() {
    return {
      greetings: ["Halo! Saya Luma dari Gema Nusa 🌱"],
      programs: {
        forest: "Program hutan kami sangat menarik!",
        ocean: "Program laut kami luar biasa!",
      },
    };
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.lumaAI = new EnhancedLumaAI();
  window.lumaChatbot = window.lumaChatbot || {};
  window.lumaChatbot.initialize = function () {
    console.log("Luma Chatbot initialized successfully");
    return window.lumaAI;
  };
});