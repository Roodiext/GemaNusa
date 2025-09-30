// Luma Care Match Game Logic
class LumaCareMatch {
  constructor() {
    this.cards = [
      { id: 1, icon: '🍚', name: 'Sembako' },
      { id: 2, icon: '📚', name: 'Buku' },
      { id: 3, icon: '💊', name: 'Obat' },
      { id: 4, icon: '🧥', name: 'Pakaian' },
      { id: 5, icon: '🏥', name: 'Kesehatan' },
      { id: 6, icon: '🎒', name: 'Tas Sekolah' },
      { id: 7, icon: '🥤', name: 'Minuman' },
      { id: 8, icon: '🧸', name: 'Mainan' }
    ];

    this.gameCards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.canFlip = true;

    this.messages = {
      start: "Halo! Yuk cocokkan pasangan bantuan agar semua orang bisa terbantu ❤️",
      correct: "Mantap! Bantuan tepat sasaran 🎯",
      wrong: "Hmm coba lagi ya, jangan sampai salah sasaran 🌱",
      almostDone: "Sedikit lagi, teruskan perjuanganmu 💪",
      champion: "Luar biasa! Kamu pahlawan sejati, semua bantuan tersalurkan dengan cepat ✨",
      hero: "Kerja bagus! Kamu relawan hebat, bantuannya sampai dengan baik ❤️",
      warrior: "Keren! Kamu pejuang peduli yang pantang menyerah 🌱",
      beginner: "Jangan khawatir, setiap usaha kecil tetap berarti 🤍 Ayo coba lagi!"
    };
  }

  initialize() {
    this.bindEvents();
    console.log('Luma Care Match initialized');
  }

  bindEvents() {
    const startBtn = document.getElementById('startGameBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const backHomeBtn = document.getElementById('backHomeBtn');

    console.log('Binding events... Start button found:', !!startBtn);

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('Start button clicked!');
        this.startGame();
      });
    } else {
      console.error('Start button not found! Retrying in 500ms...');
      setTimeout(() => this.bindEvents(), 500);
    }

    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.resetGame());
    }

    if (backHomeBtn) {
      backHomeBtn.addEventListener('click', () => {
        window.location.href = '/pages/index.html';
      });
    }
  }

  startGame() {
    const heroSection = document.getElementById('heroSection');
    const gameSection = document.getElementById('gameSection');

    heroSection.style.transition = 'opacity 0.7s, transform 0.7s';
    heroSection.style.opacity = '0';
    heroSection.style.transform = 'scale(0.95)';

    setTimeout(() => {
      heroSection.style.display = 'none';
      gameSection.classList.remove('hidden');
      
      setTimeout(() => {
        gameSection.style.opacity = '1';
        gameSection.style.transform = 'scale(1)';
      }, 50);

      this.initializeGame();
      this.showLumaMessage(this.messages.start, 3000);
    }, 700);
  }

  initializeGame() {
    this.matchedPairs = 0;
    this.moves = 0;
    this.timer = 0;
    this.flippedCards = [];
    this.canFlip = true;

    this.gameCards = [];
    this.cards.forEach(card => {
      this.gameCards.push({ ...card, uniqueId: `${card.id}-1` });
      this.gameCards.push({ ...card, uniqueId: `${card.id}-2` });
    });

    this.gameCards = this.shuffleArray(this.gameCards);
    this.renderBoard();
    this.startTimer();
    this.updateUI();
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    this.gameCards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'relative h-28 cursor-pointer';
      cardElement.dataset.index = index;
      cardElement.innerHTML = `
        <div class="card-container w-full h-full card-flip">
          <div class="card-front absolute inset-0 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gray-200 hover:border-green-400 transition-colors">
            <div class="text-4xl">❓</div>
          </div>
          <div class="card-back absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-md flex flex-col items-center justify-center border-2 border-green-700">
            <div class="text-5xl mb-1">${card.icon}</div>
            <div class="text-xs text-white font-medium">${card.name}</div>
          </div>
        </div>
      `;

      cardElement.addEventListener('click', () => this.flipCard(index));
      gameBoard.appendChild(cardElement);
    });
  }

  flipCard(index) {
    if (!this.canFlip) return;

    const card = this.gameCards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    const cardContainer = cardElement.querySelector('.card-container');

    if (cardContainer.classList.contains('card-flipped') || 
        cardContainer.classList.contains('matched')) {
      return;
    }

    cardContainer.classList.add('card-flipped');
    this.flippedCards.push({ index, card });

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateUI();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.canFlip = false;
    const [first, second] = this.flippedCards;

    if (first.card.id === second.card.id) {
      setTimeout(() => {
        const firstElement = document.querySelector(`[data-index="${first.index}"] .card-container`);
        const secondElement = document.querySelector(`[data-index="${second.index}"] .card-container`);
        
        firstElement.classList.add('matched', 'card-match');
        secondElement.classList.add('matched', 'card-match');
        
        this.matchedPairs++;
        this.updateUI();
        this.showLumaMessage(this.messages.correct, 1500);

        if (this.matchedPairs >= 6 && this.matchedPairs < 8) {
          setTimeout(() => {
            this.showLumaMessage(this.messages.almostDone, 2000);
          }, 1500);
        }

        if (this.matchedPairs === 8) {
          setTimeout(() => this.endGame(), 800);
        }

        this.flippedCards = [];
        this.canFlip = true;
      }, 600);
    } else {
      setTimeout(() => {
        const firstElement = document.querySelector(`[data-index="${first.index}"] .card-container`);
        const secondElement = document.querySelector(`[data-index="${second.index}"] .card-container`);
        
        firstElement.classList.add('card-shake');
        secondElement.classList.add('card-shake');
        
        this.showLumaMessage(this.messages.wrong, 1500);

        setTimeout(() => {
          firstElement.classList.remove('card-flipped', 'card-shake');
          secondElement.classList.remove('card-flipped', 'card-shake');
          this.flippedCards = [];
          this.canFlip = true;
        }, 1000);
      }, 600);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      document.getElementById('timer').textContent = `${this.timer}s`;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateUI() {
    document.getElementById('moves').textContent = this.moves;
    document.getElementById('progressText').textContent = `${this.matchedPairs}/8`;
    
    const progressBar = document.getElementById('progressBar');
    const percentage = (this.matchedPairs / 8) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  showLumaMessage(message, duration = 2000) {
    const bubble = document.getElementById('lumaBubble');
    const messageEl = document.getElementById('lumaMessage');
    
    messageEl.textContent = message;
    bubble.classList.remove('hidden');
    bubble.style.animation = 'fadeIn 0.3s ease-out';

    setTimeout(() => {
      bubble.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        bubble.classList.add('hidden');
      }, 300);
    }, duration);
  }

  calculateScore() {
    const baseScore = 1000;
    const movePenalty = this.moves * 10;
    const timePenalty = this.timer * 2;
    return Math.max(0, baseScore - movePenalty - timePenalty);
  }

  getTitle(score) {
    if (score >= 800) return { emoji: '🥇', title: 'Pahlawan Peduli', message: this.messages.champion };
    if (score >= 600) return { emoji: '🥈', title: 'Relawan Hebat', message: this.messages.hero };
    if (score >= 400) return { emoji: '🥉', title: 'Pejuang Peduli', message: this.messages.warrior };
    return { emoji: '🤍', title: 'Pemula Peduli', message: this.messages.beginner };
  }

  endGame() {
    this.stopTimer();
    const score = this.calculateScore();
    const result = this.getTitle(score);

    const modal = document.getElementById('resultModal');
    const modalContent = document.getElementById('modalContent');

    document.getElementById('resultEmoji').textContent = result.emoji;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = `Skor: ${score}`;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalMoves').textContent = this.moves;
    document.getElementById('finalTime').textContent = `${this.timer}s`;
    document.getElementById('lumaFinalMessage').textContent = result.message;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modalContent.style.transform = 'scale(1)';
      modalContent.style.opacity = '1';
    }, 50);
  }

  resetGame() {
    const modal = document.getElementById('resultModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.style.transform = 'scale(0.95)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
      modal.classList.add('hidden');
      this.initializeGame();
      this.showLumaMessage(this.messages.start, 3000);
    }, 300);
  }
}

function initializeLumaCareMatch() {
  if (!window.lumaCareMatch) {
    window.lumaCareMatch = new LumaCareMatch();
    window.lumaCareMatch.initialize();
  }
}

function initializeLumaCareMatch() {
  console.log('=== INITIALIZING LUMA CARE MATCH ===');
  
  // Tunggu sampai button benar-benar ada di DOM
  const checkButton = setInterval(() => {
    const startBtn = document.getElementById('startGameBtn');
    console.log('Checking for start button...', !!startBtn);
    
    if (startBtn) {
      clearInterval(checkButton);
      console.log('Start button found! Creating game instance...');
      
      if (!window.lumaCareMatch) {
        window.lumaCareMatch = new LumaCareMatch();
        window.lumaCareMatch.initialize();
        console.log('✓ Game initialized successfully!');
      }
    }
  }, 100);
  
  // Safety timeout - stop checking after 5 seconds
  setTimeout(() => {
    clearInterval(checkButton);
    if (!window.lumaCareMatch) {
      console.error('Failed to initialize game - button not found after 5 seconds');
    }
  }, 5000);
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeLumaCareMatch, 500);
  });
} else {
  setTimeout(initializeLumaCareMatch, 500);
}