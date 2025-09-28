// Luma Green Mission Game Logic
class LumaGreenGame {
    constructor() {
        this.score = 0;
        this.totalItems = 8;
        this.itemsCompleted = 0;
        this.gameItems = [
            { id: 1, name: '🍎', category: 'organic', description: 'Sisa Apel' },
            { id: 2, name: '🥤', category: 'recycle', description: 'Botol Plastik' },
            { id: 3, name: '🍃', category: 'organic', description: 'Daun Kering' },
            { id: 4, name: '📄', category: 'recycle', description: 'Kertas Bekas' },
            { id: 5, name: '🥫', category: 'recycle', description: 'Kaleng' },
            { id: 6, name: '🍌', category: 'organic', description: 'Kulit Pisang' },
            { id: 7, name: '🔋', category: 'nonrecycle', description: 'Baterai' },
            { id: 8, name: '💡', category: 'nonrecycle', description: 'Lampu Bekas' }
        ];
        this.draggedItem = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLumaMessage("Halo! Aku Luma! Yuk mulai misi hijau kita! 🌱", 3000);
    }

    setupEventListeners() {
        // Start game button
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        // Play again button
        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }

        // Back to home button
        const backHomeBtn = document.getElementById('back-home-btn');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
                this.backToHome();
            });
        }

        // Luma mascot click
        const lumaMascot = document.getElementById('luma-mascot');
        if (lumaMascot) {
            lumaMascot.addEventListener('click', () => {
                this.showRandomTip();
            });
        }
    }

    startGame() {
        const heroSection = document.getElementById('hero-section');
        const loadingSection = document.getElementById('loading-section');
        
        if (heroSection && loadingSection) {
            // Add transition styles
            heroSection.style.transition = 'all 0.5s ease-out';
            heroSection.style.opacity = '0';
            heroSection.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                heroSection.classList.add('hidden');
                loadingSection.classList.remove('hidden');
                this.startLoading();
            }, 500);
        }
    }

    startLoading() {
        const progressBar = document.getElementById('loading-progress');
        if (!progressBar) return;
        
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.showGameSection();
                }, 500);
            }
        }, 100);
    }

    showGameSection() {
        const loadingSection = document.getElementById('loading-section');
        const gameSection = document.getElementById('game-section');
        
        if (loadingSection && gameSection) {
            loadingSection.classList.add('hidden');
            gameSection.classList.remove('hidden');
            
            this.generateGameItems();
            this.setupDragAndDrop();
            this.showLumaMessage("Sekarang pilah sampah dengan benar ya! Seret item ke kategori yang tepat! 💪", 4000);
        }
    }

    generateGameItems() {
        const container = document.getElementById('items-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Shuffle items for randomness
        const shuffledItems = [...this.gameItems].sort(() => Math.random() - 0.5);
        
        shuffledItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'draggable-item bg-white rounded-xl shadow-md p-4 text-center cursor-move hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-transparent select-none';
            itemElement.draggable = true;
            itemElement.dataset.itemId = item.id;
            itemElement.dataset.category = item.category;
            
            itemElement.innerHTML = `
                <div class="text-4xl mb-2 pointer-events-none">${item.name}</div>
                <p class="text-xs text-gray-600 font-medium pointer-events-none">${item.description}</p>
            `;
            
            container.appendChild(itemElement);
        });
    }

    setupDragAndDrop() {
        // Setup draggable items
        const draggableItems = document.querySelectorAll('.draggable-item');
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = e.target;
                e.target.style.opacity = '0.5';
                e.target.classList.add('border-blue-400', 'scale-110');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                e.target.classList.remove('border-blue-400', 'scale-110');
            });

            // Touch support for mobile
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(e, item);
            }, { passive: false });
        });

        // Setup drop zones
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.highlightDropZone(zone, true);
            });
            
            zone.addEventListener('dragleave', (e) => {
                // Only remove highlight if we're actually leaving the zone
                if (!zone.contains(e.relatedTarget)) {
                    this.highlightDropZone(zone, false);
                }
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.handleDrop(e, zone);
                this.highlightDropZone(zone, false);
            });
        });
    }

    highlightDropZone(zone, highlight) {
        if (highlight) {
            zone.classList.add('ring-4', 'ring-opacity-50', 'scale-105');
            if (zone.id === 'organic-zone') zone.classList.add('ring-green-400', 'bg-green-200');
            if (zone.id === 'recycle-zone') zone.classList.add('ring-blue-400', 'bg-blue-200');
            if (zone.id === 'nonrecycle-zone') zone.classList.add('ring-red-400', 'bg-red-200');
        } else {
            zone.classList.remove('ring-4', 'ring-opacity-50', 'ring-green-400', 'ring-blue-400', 'ring-red-400', 'scale-105');
            if (zone.id === 'organic-zone') zone.classList.remove('bg-green-200');
            if (zone.id === 'recycle-zone') zone.classList.remove('bg-blue-200');
            if (zone.id === 'nonrecycle-zone') zone.classList.remove('bg-red-200');
        }
    }

    handleTouchStart(e, item) {
        // Simple touch-based drag simulation for mobile
        this.draggedItem = item;
        item.style.opacity = '0.7';
        item.classList.add('border-blue-400', 'scale-110');
        
        const moveHandler = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone) {
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    this.highlightDropZone(zone, zone === dropZone);
                });
            }
        };
        
        const endHandler = (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone) {
                this.handleDrop(e, dropZone);
            }
            
            item.style.opacity = '1';
            item.classList.remove('border-blue-400', 'scale-110');
            document.querySelectorAll('.drop-zone').forEach(zone => {
                this.highlightDropZone(zone, false);
            });
            
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
            this.draggedItem = null;
        };
        
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler, { passive: false });
    }

    handleDrop(e, dropZone) {
        if (!this.draggedItem) return;
        
        const itemCategory = this.draggedItem.dataset.category;
        let zoneCategory = '';
        
        // Map zone IDs to categories
        if (dropZone.id === 'organic-zone') zoneCategory = 'organic';
        else if (dropZone.id === 'recycle-zone') zoneCategory = 'recycle';
        else if (dropZone.id === 'nonrecycle-zone') zoneCategory = 'nonrecycle';
        
        if (itemCategory === zoneCategory) {
            this.handleCorrectPlacement(this.draggedItem, dropZone);
        } else {
            this.handleWrongPlacement(this.draggedItem);
        }
        
        this.draggedItem = null;
    }

    handleCorrectPlacement(item, zone) {
        this.score += 10;
        this.itemsCompleted++;
        
        // Visual feedback - item disappears
        item.style.transition = 'all 0.3s ease-out';
        item.style.transform = 'scale(0) rotate(360deg)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            if (item.parentNode) {
                item.remove();
            }
        }, 300);
        
        // Zone success animation
        zone.classList.add('bg-green-300', 'scale-110');
        setTimeout(() => {
            zone.classList.remove('bg-green-300', 'scale-110');
        }, 500);
        
        // Update UI
        this.updateUI();
        
        // Luma feedback
        const correctMessages = [
            "Benar! Bagus sekali! 🎉",
            "Hebat! Kamu pintar! ⭐",
            "Luar biasa! Teruskan! 🌟",
            "Perfect! Luma bangga! 💚"
        ];
        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        this.showLumaMessage(randomMessage, 2000);
        
        // Check if game completed
        if (this.itemsCompleted >= this.totalItems) {
            setTimeout(() => {
                this.completeGame();
            }, 1000);
        }
    }

    handleWrongPlacement(item) {
        // Visual feedback for wrong placement
        item.classList.add('border-red-500', 'bg-red-50');
        item.style.transform = 'scale(1.1)';
        
        // Add shake animation
        item.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            item.classList.remove('border-red-500', 'bg-red-50');
            item.style.transform = 'scale(1)';
            item.style.animation = '';
        }, 500);
        
        // Wrong placement messages
        const wrongMessages = [
            "Ups! Coba lagi ya! Baca petunjuknya dengan teliti! 🤔",
            "Hmm, sepertinya salah kategori. Yuk coba lagi! 💭",
            "Jangan menyerah! Periksa lagi kategorinya! 🔍",
            "Oops! Mari kita coba sekali lagi! 😊"
        ];
        const randomMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        this.showLumaMessage(randomMessage, 2500);
    }

    updateUI() {
        const scoreDisplay = document.getElementById('score-display');
        const itemsLeft = document.getElementById('items-left');
        const gameProgress = document.getElementById('game-progress');
        
        if (scoreDisplay) scoreDisplay.textContent = this.score;
        if (itemsLeft) itemsLeft.textContent = this.totalItems - this.itemsCompleted;
        
        if (gameProgress) {
            const progress = (this.itemsCompleted / this.totalItems) * 100;
            gameProgress.style.width = progress + '%';
        }
    }

    completeGame() {
        const finalScore = document.getElementById('final-score');
        if (finalScore) finalScore.textContent = this.score;
        
        const modal = document.getElementById('game-complete-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalContent) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 100);
        }
    }

    resetGame() {
        // Reset game state
        this.score = 0;
        this.itemsCompleted = 0;
        
        // Hide modal with animation
        const modal = document.getElementById('game-complete-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalContent) {
            modalContent.classList.add('scale-95', 'opacity-0');
            modalContent.classList.remove('scale-100', 'opacity-100');
            
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
        
        // Reset UI and regenerate game
        this.updateUI();
        this.generateGameItems();
        this.setupDragAndDrop();
        
        this.showLumaMessage("Yay! Mari kita mulai misi baru! 🚀", 2000);
    }

    backToHome() {
        const modal = document.getElementById('game-complete-modal');
        const gameSection = document.getElementById('game-section');
        const heroSection = document.getElementById('hero-section');
        
        // Hide modal
        if (modal) modal.classList.add('hidden');
        
        // Show hero section
        if (gameSection && heroSection) {
            gameSection.classList.add('hidden');
            heroSection.classList.remove('hidden');
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'scale(1)';
        }
        
        // Reset game state
        this.score = 0;
        this.itemsCompleted = 0;
        this.updateUI();
        
        this.showLumaMessage("Sampai jumpa lagi! Terima kasih sudah bermain! 👋", 3000);
    }

    showLumaMessage(message, duration = 3000) {
        const bubble = document.getElementById('luma-bubble');
        const messageElement = document.getElementById('luma-message');
        
        if (bubble && messageElement) {
            messageElement.textContent = message;
            bubble.classList.remove('hidden');
            
            setTimeout(() => {
                bubble.classList.add('hidden');
            }, duration);
        }
    }

    showRandomTip() {
        const tips = [
            "Ingat! Sisa makanan masuk ke organik ya! 🍎",
            "Botol plastik bisa didaur ulang! ♻️",
            "Baterai dan lampu masuk ke non-organik! 🔋",
            "Kertas bekas bisa didaur ulang lho! 📄",
            "Daun-daun kering itu organik! 🍃",
            "Kaleng minuman bisa didaur ulang! 🥫",
            "Yuk kita jaga bumi dengan memilah sampah! 🌍",
            "Pemilahan sampah itu mudah kalau kita tahu caranya! 💡"
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showLumaMessage(randomTip, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .draggable-item {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    
    .drop-zone {
        transition: all 0.3s ease;
    }
    
    .drop-zone.highlight {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Initialize the game when DOM is loaded
function initLumaGreenGame() {
    // Check if we're in the correct context
    if (document.getElementById('hero-section')) {
        new LumaGreenGame();
    }
}

// Handle different loading scenarios
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLumaGreenGame);
} else {
    // DOM is already loaded
    initLumaGreenGame();
}

// Also handle the case where this script is loaded dynamically
if (typeof window !== 'undefined') {
    window.LumaGreenGame = LumaGreenGame;
    
    // Auto-initialize if elements are present
    setTimeout(() => {
        if (document.getElementById('hero-section') && !window.lumaGameInitialized) {
            new LumaGreenGame();
            window.lumaGameInitialized = true;
        }
    }, 100);
}