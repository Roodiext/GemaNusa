// Luma Ocean Rescue Game Logic
class LumaOceanRescue {
  constructor() {
    this.gameState = 'hero'; // hero, loading, playing, ended
    this.score = 0;
    this.timeLeft = 30;
    this.gameTimer = null;
    this.trashSpawnTimer = null;
    this.trashItems = [];
    this.isGameActive = false;
    
    // Progressive level system
    this.currentLevel = 1;
    this.currentTarget = 10; // Start with 10 trash
    this.levelTargets = [10, 15, 20, 25, 30, 35, 40, 50]; // Target per level (progressive difficulty)
    this.levelCompleted = false;
    this.levelStartScore = 0; // Score when current level started
    
    // Luma chat messages
    this.chatMessages = {
      hero: [
        "Halo! Aku Luma 🐧✨. Ayo kita bersihkan laut dari sampah plastik!",
        "Klik tombol Mulai Game untuk memulai petualanganmu!"
      ],
      gameStart: [
        "Klik sampah yang jatuh sebelum tenggelam ya!",
        "Semakin banyak sampah yang kamu bersihkan, semakin sehat lautan kita!"
      ],
      correctClick: [
        "Mantap! 🌊",
        "Laut makin bersih nih 💙",
        "Keren, teruskan!",
        "Bagus sekali! 🎉",
        "Lautan berterima kasih! 🌊"
      ],
      missClick: [
        "Yah, hampir kena tuh 😅",
        "Jangan menyerah!",
        "Coba lagi! 💪",
        "Fokus, kamu bisa! 🎯"
      ],
      progress50: [
        "Hebat! Kamu sudah membersihkan separuh laut! 🌍",
        "Kamu luar biasa! Teruskan! 🌊"
      ],
      levelComplete: [
        "Level selesai! Siap untuk tantangan berikutnya? 🎉",
        "Hebat! Mari naik ke level selanjutnya! 🚀",
        "Target tercapai! Ayo lanjut ke level yang lebih menantang! ⭐"
      ],
      newLevel: [
        "Level baru dimulai! Target kali ini lebih menantang! 💪",
        "Tantangan baru menanti! Kamu pasti bisa! 🌟",
        "Level naik! Ayo tunjukkan kemampuanmu! 🔥"
      ],
      gameEnd: {
        guardian: "Luar biasa! Kamu benar-benar pahlawan lautan! 🐳",
        hero: "Keren! Pantai kita semakin indah berkatmu! 🏝",
        friend: "Bagus! Kamu sahabat baik untuk lautan 🌊",
        beginner: "Tidak apa-apa, setiap langkah kecil membawa perubahan 🤍"
      }
    };
    
    this.achievements = {
      guardian: { min: 30, title: "Penjaga Laut", emoji: "🥇" },
      hero: { min: 20, title: "Pahlawan Pantai", emoji: "🥈" },
      friend: { min: 10, title: "Sahabat Laut", emoji: "🥉" },
      beginner: { min: 0, title: "Pemula Peduli", emoji: "🤍" }
    };
    
    this.trashTypes = [
      { icon: "🥤", name: "Botol Plastik", color: "bg-blue-500" },
      { icon: "🛍️", name: "Kantong Plastik", color: "bg-red-500" },
      { icon: "🥫", name: "Kaleng", color: "bg-yellow-500" },
      { icon: "🍼", name: "Botol Susu", color: "bg-green-500" },
      { icon: "📦", name: "Kotak Makanan", color: "bg-purple-500" },
      { icon: "🥤", name: "Gelas Plastik", color: "bg-pink-500" }
    ];
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.showHeroMessage();
  }
  
  bindEvents() {
    // Use event delegation for dynamic elements
    document.addEventListener('click', (e) => {
      console.log('Click detected on:', e.target);
      
      // Check if the clicked element or its parent has the start-game-btn id
      const startBtn = e.target.closest('#start-game-btn');
      if (startBtn) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Start game button clicked');
        
        // Prevent multiple clicks
        if (this.gameState === 'loading' || this.gameState === 'playing') {
          console.log('Game already started, ignoring click');
          return;
        }
        
        // Add visual feedback
        startBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          startBtn.style.transform = '';
        }, 150);
        
        this.startGame();
        return;
      }
      
      if (e.target && e.target.id === 'play-again-btn') {
        e.preventDefault();
        console.log('Play again button clicked');
        this.restartGame();
      } else if (e.target && e.target.id === 'back-home-btn') {
        e.preventDefault();
        console.log('Back home button clicked');
        this.backToHome();
      }
    });
    
    // Game area click events - bind when game area is available
    this.bindGameAreaEvents();
  }
  
  bindGameAreaEvents() {
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
      gameArea.addEventListener('click', (e) => this.handleGameAreaClick(e));
    }
  }
  
  showHeroMessage() {
    this.showLumaChat(this.chatMessages.hero[0]);
    setTimeout(() => {
      this.showLumaChat(this.chatMessages.hero[1]);
    }, 3000);
  }
  
  startGame() {
    console.log('Starting game...');
    this.gameState = 'loading';
    
    // Disable button to prevent multiple clicks
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.style.opacity = '0.6';
      startBtn.style.cursor = 'not-allowed';
    }
    
    this.showLoading();
    
    setTimeout(() => {
      this.gameState = 'playing';
      this.showGame();
      this.startGameplay();
    }, 2000);
  }
  
  showLoading() {
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('loading-section').classList.remove('hidden');
  }
  
  showGame() {
    document.getElementById('loading-section').classList.add('hidden');
    document.getElementById('game-section').classList.remove('hidden');
    
    // Re-bind game area events after game section is shown
    setTimeout(() => {
      this.bindGameAreaEvents();
    }, 100);
    
    // Show game start message
    setTimeout(() => {
      this.showLumaChat(this.chatMessages.gameStart[Math.floor(Math.random() * this.chatMessages.gameStart.length)]);
    }, 500);
  }
  
  startGameplay() {
    this.isGameActive = true;
    this.score = 0;
    this.timeLeft = 30;
    this.currentLevel = 1;
    this.currentTarget = this.levelTargets[0];
    this.levelCompleted = false;
    this.levelStartScore = 0;
    this.updateUI();
    
    // Start game timer
    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      this.updateUI();
      
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
    
    // Start trash spawning
    this.spawnTrash();
  }
  
  isPositionTooClose(x, y, minDistance) {
    // Check if the new position is too close to existing trash items
    return this.trashItems.some(item => {
      if (!item.parentNode) return false;
      
      const itemX = parseFloat(item.style.left);
      const itemY = parseFloat(item.style.top);
      const distance = Math.sqrt(Math.pow(x - itemX, 2) + Math.pow(y - itemY, 2));
      
      return distance < minDistance;
    });
  }
  
  spawnTrash() {
    if (!this.isGameActive) return;
    
    // Create 1-2 trash items at once for better gameplay
    const trashCount = Math.random() < 0.4 ? 2 : 1; // 40% chance for 2 items, 60% for 1 item
    
    for (let i = 0; i < trashCount; i++) {
      // Add small delay between multiple spawns to avoid overlap
      setTimeout(() => {
        if (this.isGameActive) {
          this.createTrashItem();
        }
      }, i * 200);
    }
    
    // Schedule next spawn - faster interval for better gameplay
    const spawnInterval = Math.random() * 800 + 300; // 0.3-1.1 seconds for much faster gameplay
    
    this.trashSpawnTimer = setTimeout(() => {
      this.spawnTrash();
    }, spawnInterval);
  }
  
  createTrashItem() {
    if (!this.isGameActive) return;
    
    const trashType = this.trashTypes[Math.floor(Math.random() * this.trashTypes.length)];
    
    // Random position within game area with better margins
    const gameArea = document.getElementById('game-area');
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    // Better margins: 80px from edges, considering header height (~140px)
    const marginX = 80;
    const marginTop = 160; // Account for game header
    const marginBottom = 80;
    
    let x, y;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Try to find a position that doesn't overlap with existing trash
    do {
      x = Math.random() * (gameAreaRect.width - (marginX * 2)) + marginX;
      y = Math.random() * (gameAreaRect.height - marginTop - marginBottom) + marginTop;
      attempts++;
    } while (attempts < maxAttempts && this.isPositionTooClose(x, y, 80));
    
    const trashElement = document.createElement('div');
    trashElement.className = 'trash-item cursor-pointer';
    trashElement.innerHTML = trashType.icon;
    trashElement.style.left = x + 'px';
    trashElement.style.top = y + 'px';
    trashElement.style.fontSize = '2rem';
    trashElement.style.position = 'absolute';
    trashElement.dataset.trashType = trashType.name;
    
    // Add fade-in animation
    trashElement.style.opacity = '0';
    trashElement.style.transform = 'scale(0.5)';
    trashElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add click handler
    trashElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleTrashClick(trashElement);
    });
    
    // Auto remove after 5 seconds if not clicked (longer time for better gameplay)
    const autoRemoveTimer = setTimeout(() => {
      if (trashElement.parentNode) {
        // Fade out before removing
        trashElement.style.opacity = '0';
        trashElement.style.transform = 'scale(0.5)';
        setTimeout(() => {
          if (trashElement.parentNode) {
            trashElement.remove();
            this.trashItems = this.trashItems.filter(item => item !== trashElement);
          }
        }, 300);
      }
    }, 5000);
    
    // Store timer for cleanup
    trashElement.autoRemoveTimer = autoRemoveTimer;
    
    document.getElementById('game-area').appendChild(trashElement);
    this.trashItems.push(trashElement);
    
    // Trigger fade-in animation
    setTimeout(() => {
      trashElement.style.opacity = '1';
      trashElement.style.transform = 'scale(1)';
    }, 50);
  }
  
  handleTrashClick(trashElement) {
    if (!this.isGameActive) return;
    
    // Clear auto-remove timer
    if (trashElement.autoRemoveTimer) {
      clearTimeout(trashElement.autoRemoveTimer);
    }
    
    // Create splash effect
    this.createSplashEffect(trashElement);
    
    // Update score
    this.score++;
    this.updateUI();
    
    // Show positive feedback
    this.showLumaChat(this.chatMessages.correctClick[Math.floor(Math.random() * this.chatMessages.correctClick.length)]);
    
    // Check for level completion based on current level progress
    const currentLevelProgress = this.score - this.levelStartScore;
    console.log(`Level Completion Check: Level=${this.currentLevel}, Score=${this.score}, LevelStartScore=${this.levelStartScore}, CurrentLevelProgress=${currentLevelProgress}, Target=${this.currentTarget}, Completed=${this.levelCompleted}`);
    
    if (currentLevelProgress >= this.currentTarget && !this.levelCompleted) {
      console.log(`Level ${this.currentLevel} completed! Moving to next level...`);
      this.levelCompleted = true;
      setTimeout(() => {
        this.completeLevel();
      }, 1000);
    }
    
    // Check for progress milestones within current level
    const progressPercent = currentLevelProgress / this.currentTarget;
    if (progressPercent >= 0.5 && progressPercent < 0.8 && currentLevelProgress > 2) {
      setTimeout(() => {
        this.showLumaChat(this.chatMessages.progress50[Math.floor(Math.random() * this.chatMessages.progress50.length)]);
      }, 1000);
    }
    
    // Fade out animation before removing
    trashElement.style.opacity = '0';
    trashElement.style.transform = 'scale(0.5)';
    trashElement.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    
    setTimeout(() => {
      if (trashElement.parentNode) {
        trashElement.remove();
        this.trashItems = this.trashItems.filter(item => item !== trashElement);
      }
    }, 200);
  }
  
  handleGameAreaClick(e) {
    if (!this.isGameActive) return;
    
    // Show miss feedback occasionally
    if (Math.random() < 0.3) {
      this.showLumaChat(this.chatMessages.missClick[Math.floor(Math.random() * this.chatMessages.missClick.length)]);
    }
  }
  
  createSplashEffect(trashElement) {
    const rect = trashElement.getBoundingClientRect();
    const splash = document.createElement('div');
    splash.className = 'splash-effect';
    splash.style.left = (rect.left + rect.width / 2 - 20) + 'px';
    splash.style.top = (rect.top + rect.height / 2 - 20) + 'px';
    
    document.body.appendChild(splash);
    
    setTimeout(() => {
      splash.remove();
    }, 600);
  }
  
  completeLevel() {
    if (!this.isGameActive) return;
    
    // Show level completion message
    this.showLumaChat(this.chatMessages.levelComplete[Math.floor(Math.random() * this.chatMessages.levelComplete.length)]);
    
    // Check if there's a next level
    if (this.currentLevel < this.levelTargets.length) {
      setTimeout(() => {
        this.nextLevel();
      }, 3000);
    } else {
      // All levels completed - end game with bonus
      setTimeout(() => {
        this.endGame(true); // true indicates all levels completed
      }, 2000);
    }
  }
  
  nextLevel() {
    if (!this.isGameActive) return;
    
    // Animate progress bar reset
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      // First, make it flash green to show completion
      progressBar.className = 'bg-green-500 h-3 rounded-full transition-all duration-300';
      progressBar.style.width = '100%';
      
      // Then reset to 0 after a brief moment
      setTimeout(() => {
        progressBar.style.width = '0%';
        progressBar.className = 'bg-blue-500 h-3 rounded-full transition-all duration-300';
      }, 300);
    }
    
    this.currentLevel++;
    this.currentTarget = this.levelTargets[this.currentLevel - 1];
    this.levelCompleted = false;
    
    // Set new level start score (current score becomes the baseline for next level)
    this.levelStartScore = this.score;
    
    console.log(`Next Level Setup: Level=${this.currentLevel}, NewTarget=${this.currentTarget}, NewLevelStartScore=${this.levelStartScore}, CurrentScore=${this.score}`);
    
    // Add bonus time for completing level
    this.timeLeft += 10;
    
    // Update UI immediately after setting new values
    this.updateUI();
    
    // Show new level message
    setTimeout(() => {
      this.showLumaChat(this.chatMessages.newLevel[Math.floor(Math.random() * this.chatMessages.newLevel.length)]);
    }, 800);
  }
  
  updateUI() {
    // Update score
    const scoreElement = document.getElementById('game-score');
    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
    
    // Update timer
    const timerElement = document.getElementById('game-timer');
    if (timerElement) {
      timerElement.textContent = this.timeLeft;
    }
    
    // Update level info
    const levelElement = document.getElementById('current-level');
    if (levelElement) {
      levelElement.textContent = this.currentLevel;
    }
    
    // Update progress level
    const progressLevelElement = document.getElementById('progress-level');
    if (progressLevelElement) {
      progressLevelElement.textContent = this.currentLevel;
    }
    
    // Update target info
    const targetElement = document.getElementById('current-target');
    if (targetElement) {
      targetElement.textContent = this.currentTarget;
    }
    
    // Update progress bar based on current level progress (resets each level)
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      // Calculate progress within current level only
      const currentLevelProgress = this.score - this.levelStartScore;
      const levelTarget = this.currentTarget; // Target for current level only
      const progress = Math.max(0, Math.min(100, (currentLevelProgress / levelTarget) * 100));
      
      console.log(`Progress Debug: Level=${this.currentLevel}, Score=${this.score}, LevelStartScore=${this.levelStartScore}, CurrentLevelProgress=${currentLevelProgress}, LevelTarget=${levelTarget}, Progress=${progress.toFixed(1)}%`);
      
      progressBar.style.width = progress + '%';
      
      // Change color based on progress
      if (progress >= 100) {
        progressBar.className = 'bg-green-500 h-3 rounded-full transition-all duration-500';
      } else if (progress >= 75) {
        progressBar.className = 'bg-yellow-500 h-3 rounded-full transition-all duration-500';
      } else {
        progressBar.className = 'bg-blue-500 h-3 rounded-full transition-all duration-500';
      }
    }
  }
  
  endGame() {
    this.isGameActive = false;
    this.gameState = 'ended';
    
    // Clear timers
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    if (this.trashSpawnTimer) {
      clearTimeout(this.trashSpawnTimer);
    }
    
    // Remove all trash items
    this.trashItems.forEach(item => {
      if (item.parentNode) {
        item.remove();
      }
    });
    this.trashItems = [];
    
    // Show final results
    setTimeout(() => {
      this.showGameModal();
    }, 1000);
  }
  
  showGameModal() {
    const modal = document.getElementById('game-modal');
    const modalContent = document.getElementById('modal-content');
    const finalScore = document.getElementById('final-score');
    const achievementTitle = document.getElementById('achievement-title');
    const achievementEmoji = document.getElementById('achievement-emoji');
    const finalMessage = document.getElementById('final-message');
    
    if (modal && finalScore && achievementTitle && achievementEmoji && finalMessage) {
      // Update modal content
      finalScore.textContent = this.score;
      
      const achievement = this.getAchievement();
      achievementTitle.textContent = achievement.title;
      achievementEmoji.textContent = achievement.emoji;
      finalMessage.textContent = this.chatMessages.gameEnd[achievement.key];
      
      // Show modal with animation
      modal.classList.remove('hidden');
      setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
      }, 100);
    }
  }
  
  getAchievement() {
    if (this.score >= this.achievements.guardian.min) {
      return { ...this.achievements.guardian, key: 'guardian' };
    } else if (this.score >= this.achievements.hero.min) {
      return { ...this.achievements.hero, key: 'hero' };
    } else if (this.score >= this.achievements.friend.min) {
      return { ...this.achievements.friend, key: 'friend' };
    } else {
      return { ...this.achievements.beginner, key: 'beginner' };
    }
  }
  
  restartGame() {
    this.hideGameModal();
    this.gameState = 'hero';
    
    // Re-enable start button
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.opacity = '1';
      startBtn.style.cursor = 'pointer';
    }
    
    this.showHero();
    this.showHeroMessage();
  }
  
  backToHome() {
    // Reset button state before navigating
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.opacity = '1';
      startBtn.style.cursor = 'pointer';
    }
    window.location.href = 'index.html';
  }
  
  hideGameModal() {
    const modal = document.getElementById('game-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (modal && modalContent) {
      modalContent.classList.add('scale-95', 'opacity-0');
      modalContent.classList.remove('scale-100', 'opacity-100');
      
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }
  }
  
  showHero() {
    document.getElementById('game-section').classList.add('hidden');
    document.getElementById('loading-section').classList.add('hidden');
    document.getElementById('hero-section').classList.remove('hidden');
  }
  
  showLumaChat(message) {
    const chatBubble = document.getElementById('luma-chat');
    const messageElement = document.getElementById('luma-message');
    
    if (chatBubble && messageElement) {
      messageElement.textContent = message;
      
      // Show chat bubble with animation (mascot stays visible)
      chatBubble.classList.remove('opacity-0', 'translate-y-4');
      chatBubble.classList.add('opacity-100', 'translate-y-0');
      
      // Auto hide chat bubble after 4 seconds (mascot stays visible)
      setTimeout(() => {
        chatBubble.classList.add('opacity-0', 'translate-y-4');
        chatBubble.classList.remove('opacity-100', 'translate-y-0');
      }, 4000);
    }
  }
}

// Initialize game when component loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired, current path:', window.location.pathname);
  
  // Only initialize if we're on the ocean rescue page
  if (window.location.pathname.includes('luma-ocean-rescue')) {
    console.log('On ocean rescue page, initializing game...');
    
    // Add delay to ensure component is loaded
    setTimeout(() => {
      const gameSection = document.getElementById('luma-ocean-rescue');
      console.log('Game section found:', !!gameSection);
      
      if (!window.lumaOceanRescue && gameSection) {
        window.lumaOceanRescue = new LumaOceanRescue();
        console.log('Luma Ocean Rescue game initialized successfully');
      } else if (!gameSection) {
        console.warn('Game section not found, retrying...');
        // Retry after component loading
        setTimeout(() => {
          const retryGameSection = document.getElementById('luma-ocean-rescue');
          if (retryGameSection && !window.lumaOceanRescue) {
            window.lumaOceanRescue = new LumaOceanRescue();
            console.log('Luma Ocean Rescue game initialized on retry');
          }
        }, 1000);
      }
    }, 500);
  }
});

// Export for component loader
window.LumaOceanRescue = LumaOceanRescue;
