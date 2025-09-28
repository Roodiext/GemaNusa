// assets/js/clicker-sea.js
class LumaOceanRescue {
  constructor() {
    this.score = 0;
    this.timeLeft = 30;
    this.gameActive = false;
    this.spawnInterval = null;
    this.countdownInterval = null;
    this.trashItems = ['🗑️', '🥤', '🍾', '🛴', '📦', '👕', '👟', '💊', '🔋', '📱'];
    
    // Wait for elements to be available before initializing
    this.waitForElements();
  }

  // Wait for DOM elements to be available
  waitForElements() {
    const checkElements = () => {
      if (this.initElements()) {
        this.bindEvents();
        console.log('LUMA Ocean Rescue: Game initialized successfully');
      } else {
        console.log('LUMA Ocean Rescue: Waiting for elements...');
        setTimeout(checkElements, 500);
      }
    };
    checkElements();
  }

  initElements() {
    // Check if all required elements exist
    const requiredElements = [
      'score-display', 'timer-display', 'game-area', 'start-button',
      'start-button-container', 'luma-bubble', 'luma-text',
      'game-end-popup', 'final-score', 'motivation-text', 'play-again-button'
    ];

    for (const elementId of requiredElements) {
      if (!document.getElementById(elementId)) {
        console.log(`LUMA Ocean Rescue: Missing element ${elementId}`);
        return false;
      }
    }

    // All elements found, initialize them
    this.scoreDisplay = document.getElementById('score-display');
    this.timerDisplay = document.getElementById('timer-display');
    this.gameArea = document.getElementById('game-area');
    this.startButton = document.getElementById('start-button');
    this.startContainer = document.getElementById('start-button-container');
    this.lumaBubble = document.getElementById('luma-bubble');
    this.lumaText = document.getElementById('luma-text');
    this.gameEndPopup = document.getElementById('game-end-popup');
    this.finalScore = document.getElementById('final-score');
    this.motivationText = document.getElementById('motivation-text');
    this.playAgainButton = document.getElementById('play-again-button');

    return true;
  }

  bindEvents() {
    if (this.startButton) {
      this.startButton.addEventListener('click', () => this.startGame());
    }
    
    if (this.playAgainButton) {
      this.playAgainButton.addEventListener('click', () => this.resetGame());
    }
    
    // Prevent right-click context menu on game area
    if (this.gameArea) {
      this.gameArea.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }

  startGame() {
    this.gameActive = true;
    this.score = 0;
    this.timeLeft = 30;
    
    // Hide start button
    if (this.startContainer) {
      this.startContainer.classList.add('hidden');
    }
    
    // Update LUMA bubble
    this.updateLumaBubble("Ayo bantu aku membersihkan laut Nusantara 🌊");
    
    // Start spawning trash
    this.startSpawningTrash();
    
    // Start countdown
    this.startCountdown();
    
    // Update displays
    this.updateScore();
    this.updateTimer();
  }

  startSpawningTrash() {
    this.spawnInterval = setInterval(() => {
      if (this.gameActive && this.gameArea) {
        this.spawnTrash();
      }
    }, 800);
  }

  spawnTrash() {
    if (!this.gameArea) return;
    
    const trash = document.createElement('div');
    const trashIcon = this.trashItems[Math.floor(Math.random() * this.trashItems.length)];
    
    // Random position within game area bounds
    const maxX = this.gameArea.offsetWidth - 60;
    const maxY = this.gameArea.offsetHeight - 120; // Account for header and bottom margin
    const randomX = Math.random() * maxX;
    const randomY = 80 + (Math.random() * (maxY - 80)); // Start below header
    
    trash.className = 'absolute cursor-pointer text-4xl select-none transition-transform hover:scale-110 z-10';
    trash.style.left = randomX + 'px';
    trash.style.top = randomY + 'px';
    trash.textContent = trashIcon;
    
    // Add click handler
    trash.addEventListener('click', () => this.clickTrash(trash));
    
    // Auto-remove after 3 seconds if not clicked
    setTimeout(() => {
      if (trash.parentNode) {
        trash.remove();
      }
    }, 3000);
    
    this.gameArea.appendChild(trash);
  }

  clickTrash(trashElement) {
    if (!this.gameActive) return;
    
    // Add click animation
    trashElement.style.transform = 'scale(1.3)';
    trashElement.style.opacity = '0.5';
    
    setTimeout(() => {
      if (trashElement.parentNode) {
        trashElement.remove();
      }
    }, 100);
    
    // Update score
    this.score++;
    this.updateScore();
    
    // Update LUMA bubble based on score milestones
    this.checkScoreMilestones();
  }

  checkScoreMilestones() {
    if (this.score === 5) {
      this.updateLumaBubble("Bagus! Terus semangat bersihkan lautnya! 💪");
    } else if (this.score === 10) {
      this.updateLumaBubble("Wow! Kamu hebat sekali! Ikan-ikan pasti senang 🐟");
    } else if (this.score === 20) {
      this.updateLumaBubble("Luar biasa! Kamu adalah pahlawan laut sejati! ⭐");
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimer();
      
      // Warning when time is running out
      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        this.updateLumaBubble("Cepat, waktunya hampir habis ⏰!");
        if (this.timerDisplay) {
          this.timerDisplay.classList.add('animate-pulse');
        }
      }
      
      // Game over
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    this.gameActive = false;
    
    // Clear intervals
    clearInterval(this.spawnInterval);
    clearInterval(this.countdownInterval);
    
    // Remove remaining trash
    if (this.gameArea) {
      const remainingTrash = this.gameArea.querySelectorAll('div:not(#start-button-container):not(#luma-bubble)');
      remainingTrash.forEach(trash => trash.remove());
    }
    
    // Show end popup
    this.showEndPopup();
    
    // Update LUMA bubble based on final score
    this.updateFinalLumaBubble();
    
    // Dispatch custom event for analytics
    const gameCompletedEvent = new CustomEvent('gameCompleted', {
      detail: { score: this.score, timeLeft: this.timeLeft }
    });
    document.dispatchEvent(gameCompletedEvent);
  }

  showEndPopup() {
    if (this.finalScore) {
      this.finalScore.textContent = `Kamu berhasil membersihkan ${this.score} sampah!`;
    }
    
    // Set motivation message based on score
    let motivationMsg = "";
    if (this.score < 10) {
      motivationMsg = "Masih banyak sampah tersisa… ayo coba lagi dan jaga kebersihan laut! 💪";
    } else if (this.score >= 10 && this.score <= 20) {
      motivationMsg = "Bagus! Kamu sudah menyelamatkan banyak ikan dan menjaga ekosistem laut! 🐟";
    } else {
      motivationMsg = "Hebat sekali! Laut Nusantara jadi bersih berkat kamu! Kamu pahlawan lingkungan! 🌊✨";
    }
    
    if (this.motivationText) {
      this.motivationText.textContent = motivationMsg;
    }
    
    if (this.gameEndPopup) {
      this.gameEndPopup.classList.remove('hidden');
      
      // Animation for popup
      setTimeout(() => {
        const popupContent = this.gameEndPopup.querySelector('div');
        if (popupContent) {
          popupContent.style.transform = 'scale(1)';
        }
      }, 50);
    }
  }

  updateFinalLumaBubble() {
    let finalMsg = "";
    if (this.score < 10) {
      finalMsg = "Masih banyak sampah tersisa… ayo coba lagi 💪";
    } else if (this.score >= 10 && this.score <= 20) {
      finalMsg = "Bagus! Kamu sudah menyelamatkan banyak ikan 🐟";
    } else {
      finalMsg = "Hebat sekali! Laut Nusantara jadi bersih berkat kamu 🌊✨";
    }
    
    this.updateLumaBubble(finalMsg);
  }

  resetGame() {
    // Hide popup
    if (this.gameEndPopup) {
      this.gameEndPopup.classList.add('hidden');
    }
    
    // Reset values
    this.score = 0;
    this.timeLeft = 30;
    this.gameActive = false;
    
    // Clear intervals
    clearInterval(this.spawnInterval);
    clearInterval(this.countdownInterval);
    
    // Remove any remaining trash
    if (this.gameArea) {
      const allTrash = this.gameArea.querySelectorAll('div:not(#start-button-container)');
      allTrash.forEach(trash => {
        if (!trash.id || (trash.id !== 'start-button-container')) {
          trash.remove();
        }
      });
    }
    
    // Reset displays
    this.updateScore();
    this.updateTimer();
    if (this.timerDisplay) {
      this.timerDisplay.classList.remove('animate-pulse');
    }
    
    // Show start button
    if (this.startContainer) {
      this.startContainer.classList.remove('hidden');
    }
    
    // Reset LUMA bubble
    this.updateLumaBubble("Siap untuk membersihkan laut lagi? Ayo mulai! 🌊");
  }

  updateScore() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `Skor: ${this.score}`;
    }
  }

  updateTimer() {
    if (this.timerDisplay) {
      this.timerDisplay.textContent = `Waktu: ${this.timeLeft}s`;
      
      // Change color based on time left
      if (this.timeLeft <= 5) {
        this.timerDisplay.classList.remove('text-red-600');
        this.timerDisplay.classList.add('text-red-800');
      } else if (this.timeLeft <= 10) {
        this.timerDisplay.classList.remove('text-red-800');
        this.timerDisplay.classList.add('text-red-600');
      }
    }
  }

  updateLumaBubble(message) {
    if (this.lumaText) {
      this.lumaText.textContent = message;
    }
    
    // Add animation effect
    if (this.lumaBubble) {
      this.lumaBubble.style.transform = 'scale(1.05)';
      setTimeout(() => {
        this.lumaBubble.style.transform = 'scale(1)';
      }, 200);
    }
  }
}

// Safe initialization - only create instance when DOM is ready AND elements exist
document.addEventListener('DOMContentLoaded', () => {
  // Don't auto-initialize, let component loader handle it
  console.log('LUMA Ocean Rescue script loaded, waiting for component...');
});

// Safe initialization for component system
function initializeLumaOceanRescue() {
  if (!window.lumaOceanRescue) {
    window.lumaOceanRescue = new LumaOceanRescue();
    return true;
  }
  return false;
}

// Export for component loader
if (typeof window !== 'undefined') {
  window.LumaOceanRescue = LumaOceanRescue;
  window.initializeLumaOceanRescue = initializeLumaOceanRescue;
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LumaOceanRescue;
} 