// Luma Green Mission Game Logic - Optimized UX
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
        this.isMobile = this.checkMobile();
        // Audio elements
        this.bgmAudio = null;
        this.collectSfx = null;
        this.failSfx = null;
        this.winnerSfx = null;
        this.isMuted = false;
        this.init();
    }

    checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth < 1024;
    }

    init() {
        this.initAudio();
        this.setupEventListeners();
        this.handleResize();
        this.showLumaMessage("Halo! Aku Luma! Yuk mulai misi hijau kita! 🌱", 3500);
    }

    initAudio() {
        this.bgmAudio = document.getElementById('bgm-audio');
        this.collectSfx = document.getElementById('collect-sfx');
        this.failSfx = document.getElementById('fail-sfx');
        this.winnerSfx = document.getElementById('winner-sfx');
        
        // Set volume levels
        if (this.bgmAudio) this.bgmAudio.volume = 0.5;
        if (this.collectSfx) this.collectSfx.volume = 0.7;
        if (this.failSfx) this.failSfx.volume = 0.8;
        if (this.winnerSfx) this.winnerSfx.volume = 0.8;
        
        // Handle page visibility changes for background music
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseBGM();
            } else {
                this.resumeBGM();
            }
        });
    }

    playSound(audioElement) {
        if (!audioElement || this.isMuted) return;
        
        try {
            audioElement.currentTime = 0;
            audioElement.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        } catch (error) {
            console.log('Audio error:', error);
        }
    }

    playBGM() {
        if (!this.bgmAudio || this.isMuted) return;
        
        try {
            this.bgmAudio.play().catch(error => {
                console.log('BGM play failed:', error);
            });
        } catch (error) {
            console.log('BGM error:', error);
        }
    }

    pauseBGM() {
        if (this.bgmAudio && !this.bgmAudio.paused) {
            this.bgmAudio.pause();
        }
    }

    resumeBGM() {
        if (this.bgmAudio && this.bgmAudio.paused && !this.isMuted) {
            this.bgmAudio.play().catch(error => {
                console.log('BGM resume failed:', error);
            });
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pauseBGM();
        } else {
            this.resumeBGM();
        }
        
        return this.isMuted;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.isMobile = this.checkMobile();
        });
    }

    setupEventListeners() {
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        const playAgainBtn = document.getElementById('play-again-btn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.resetGame());
        }

        const backHomeBtn = document.getElementById('back-home-btn');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => this.backToHome());
        }

        const lumaMascot = document.getElementById('luma-mascot');
        if (lumaMascot) {
            lumaMascot.addEventListener('click', () => this.showRandomTip());
        }

        const muteToggle = document.getElementById('mute-toggle');
        if (muteToggle) {
            muteToggle.addEventListener('click', () => {
                const muted = this.toggleMute();
                muteToggle.textContent = muted ? '🔇' : '🔊';
                muteToggle.title = muted ? 'Unmute Sound' : 'Mute Sound';
            });
        }
    }

    startGame() {
        const heroSection = document.getElementById('hero-section');
        const loadingSection = document.getElementById('loading-section');
        
        if (heroSection && loadingSection) {
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
                setTimeout(() => this.showGameSection(), 500);
            }
        }, 100);
    }

    showGameSection() {
        const loadingSection = document.getElementById('loading-section');
        const gameSection = document.getElementById('game-section');
        
        if (loadingSection && gameSection) {
            loadingSection.classList.add('hidden');
            gameSection.classList.remove('hidden');
            
            // Start background music when game begins
            this.playBGM();
            
            this.generateGameItems();
            this.setupDragAndDrop();
            
            const message = this.isMobile 
                ? "Sekarang pilah sampah dengan benar ya! Sentuh dan seret item ke kategori yang tepat! 💪"
                : "Sekarang pilah sampah dengan benar ya! Seret item ke kategori yang tepat! 💪";
            this.showLumaMessage(message, 4500);
        }
    }

    generateGameItems() {
        const containerDesktop = document.getElementById('items-container');
        const containerMobile = document.getElementById('items-container-mobile');
        const container = containerMobile || containerDesktop;
        
        if (!container) return;
        
        // Clear both containers if they exist
        if (containerDesktop) containerDesktop.innerHTML = '';
        if (containerMobile) containerMobile.innerHTML = '';
        
        const shuffledItems = [...this.gameItems].sort(() => Math.random() - 0.5);
        
        shuffledItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'draggable-item bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 text-center cursor-move hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gray-100 hover:border-emerald-300 select-none touch-manipulation';
            itemElement.draggable = true;
            itemElement.dataset.itemId = item.id;
            itemElement.dataset.category = item.category;
            
            itemElement.innerHTML = `
                <div class="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 pointer-events-none">${item.name}</div>
                <p class="text-xs sm:text-sm lg:text-base text-gray-600 font-medium pointer-events-none">${item.description}</p>
            `;
            
            // Add to both containers if they exist
            if (containerDesktop) {
                const cloneDesktop = itemElement.cloneNode(true);
                cloneDesktop.draggable = true;
                cloneDesktop.dataset.itemId = item.id;
                cloneDesktop.dataset.category = item.category;
                containerDesktop.appendChild(cloneDesktop);
            }
            if (containerMobile) {
                const cloneMobile = itemElement.cloneNode(true);
                cloneMobile.draggable = true;
                cloneMobile.dataset.itemId = item.id;
                cloneMobile.dataset.category = item.category;
                containerMobile.appendChild(cloneMobile);
            }
        });
    }

    setupDragAndDrop() {
        const draggableItems = document.querySelectorAll('.draggable-item');
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItem = e.target;
                e.target.style.opacity = '0.5';
                e.target.classList.add('border-emerald-400', 'scale-110', 'shadow-2xl');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
                e.target.classList.remove('border-emerald-400', 'scale-110', 'shadow-2xl');
            });

            item.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e, item);
            }, { passive: false });
        });

        // Setup ALL drop zones (mobile and desktop)
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                this.highlightDropZone(zone, true);
            });
            
            zone.addEventListener('dragleave', (e) => {
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
            zone.classList.add('ring-4', 'ring-opacity-50', 'scale-105', 'shadow-lg');
            if (zone.id === 'organic-zone') {
                zone.classList.add('ring-emerald-400', 'bg-emerald-100', 'border-emerald-400');
            }
            if (zone.id === 'recycle-zone') {
                zone.classList.add('ring-blue-400', 'bg-blue-100', 'border-blue-400');
            }
            if (zone.id === 'nonrecycle-zone') {
                zone.classList.add('ring-red-400', 'bg-red-100', 'border-red-400');
            }
        } else {
            zone.classList.remove('ring-4', 'ring-opacity-50', 'ring-emerald-400', 'ring-blue-400', 'ring-red-400', 'scale-105', 'shadow-lg');
            if (zone.id === 'organic-zone') {
                zone.classList.remove('bg-emerald-100', 'border-emerald-400');
            }
            if (zone.id === 'recycle-zone') {
                zone.classList.remove('bg-blue-100', 'border-blue-400');
            }
            if (zone.id === 'nonrecycle-zone') {
                zone.classList.remove('bg-red-100', 'border-red-400');
            }
        }
    }

    handleTouchStart(e, item) {
        e.preventDefault();
        
        this.draggedItem = item;
        item.style.opacity = '0.8';
        item.classList.add('border-emerald-400', 'scale-110', 'shadow-2xl');
        
        const clone = item.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '1000';
        clone.style.opacity = '0.9';
        clone.style.transform = 'scale(1.1)';
        clone.id = 'drag-clone';
        
        const touch = e.touches[0];
        const rect = item.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        
        clone.style.left = (touch.clientX - offsetX) + 'px';
        clone.style.top = (touch.clientY - offsetY) + 'px';
        clone.style.width = rect.width + 'px';
        
        document.body.appendChild(clone);
        
        const moveHandler = (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const dragClone = document.getElementById('drag-clone');
            
            if (dragClone) {
                dragClone.style.left = (touch.clientX - offsetX) + 'px';
                dragClone.style.top = (touch.clientY - offsetY) + 'px';
            }
            
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            document.querySelectorAll('.drop-zone').forEach(zone => {
                this.highlightDropZone(zone, zone === dropZone);
            });
        };
        
        const endHandler = (e) => {
            e.preventDefault();
            
            const dragClone = document.getElementById('drag-clone');
            if (dragClone) dragClone.remove();
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone) this.handleDrop(e, dropZone);
            
            item.style.opacity = '1';
            item.classList.remove('border-emerald-400', 'scale-110', 'shadow-2xl');
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
        
        // Map zone IDs to categories (support both mobile and desktop zones)
        const zoneId = dropZone.id;
        if (zoneId === 'organic-zone' || zoneId === 'organic-zone-desktop') {
            zoneCategory = 'organic';
        } else if (zoneId === 'recycle-zone' || zoneId === 'recycle-zone-desktop') {
            zoneCategory = 'recycle';
        } else if (zoneId === 'nonrecycle-zone' || zoneId === 'nonrecycle-zone-desktop') {
            zoneCategory = 'nonrecycle';
        }
        
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
        
        // Get item ID to remove all instances
        const itemId = item.dataset.itemId;
        
        // Visual feedback - item disappears
        item.style.transition = 'all 0.4s ease-out';
        item.style.transform = 'scale(0) rotate(360deg)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            // Remove all items with the same ID from both containers
            document.querySelectorAll(`[data-item-id="${itemId}"]`).forEach(el => {
                if (el.parentNode) el.remove();
            });
        }, 400);
        
        zone.classList.add('bg-emerald-200', 'scale-110');
        setTimeout(() => {
            zone.classList.remove('bg-emerald-200', 'scale-110');
        }, 600);
        
        this.updateUI();
        
        // Play collect sound
        this.playSound(this.collectSfx);
        
        const correctMessages = [
            "Benar! Bagus sekali! 🎉",
            "Hebat! Kamu pintar! ⭐",
            "Luar biasa! Teruskan! 🌟",
            "Perfect! Luma bangga! 💚"
        ];
        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        this.showLumaMessage(randomMessage, 2000);
        
        if (this.itemsCompleted >= this.totalItems) {
            setTimeout(() => this.completeGame(), 1000);
        }
    }

    handleWrongPlacement(item) {
        item.classList.add('border-red-500', 'bg-red-50');
        item.style.animation = 'shake 0.5s ease-in-out';
        
        // Play fail sound
        this.playSound(this.failSfx);
        
        setTimeout(() => {
            item.classList.remove('border-red-500', 'bg-red-50');
            item.style.animation = '';
        }, 500);
        
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
        // Stop background music and play winner sound
        this.pauseBGM();
        this.playSound(this.winnerSfx);
        
        const finalScore = document.getElementById('final-score');
        if (finalScore) finalScore.textContent = this.score;
        
        const modal = document.getElementById('game-complete-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalContent) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 100);
        }
    }

    resetGame() {
        this.score = 0;
        this.itemsCompleted = 0;
        
        const modal = document.getElementById('game-complete-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalContent) {
            modalContent.classList.add('scale-95', 'opacity-0');
            modalContent.classList.remove('scale-100', 'opacity-100');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
        
        this.updateUI();
        this.generateGameItems();
        this.setupDragAndDrop();
        
        // Resume background music
        this.playBGM();
        
        this.showLumaMessage("Yay! Mari kita mulai misi baru! 🚀", 2000);
    }

    backToHome() {
        const modal = document.getElementById('game-complete-modal');
        const gameSection = document.getElementById('game-section');
        const heroSection = document.getElementById('hero-section');
        
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
        
        if (gameSection && heroSection) {
            gameSection.classList.add('hidden');
            heroSection.classList.remove('hidden');
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'scale(1)';
        }
        
        this.score = 0;
        this.itemsCompleted = 0;
        this.updateUI();
        
        // Stop background music when going back to home
        this.pauseBGM();
        
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

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
        20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
    
    .draggable-item {
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
        min-height: 100px;
    }
    
    .drop-zone {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @media (max-width: 640px) {
        .draggable-item {
            min-height: 110px;
        }
        
        .drop-zone {
            min-height: 120px;
        }
    }
    
    .draggable-item * {
        pointer-events: none;
    }
    
    button {
        -webkit-tap-highlight-color: transparent;
    }
    
    #drag-clone {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
`;
document.head.appendChild(style);

// Initialize game
function initLumaGreenGame() {
    if (document.getElementById('hero-section')) {
        new LumaGreenGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLumaGreenGame);
} else {
    initLumaGreenGame();
}

if (typeof window !== 'undefined') {
    window.LumaGreenGame = LumaGreenGame;
    
    setTimeout(() => {
        if (document.getElementById('hero-section') && !window.lumaGameInitialized) {
            new LumaGreenGame();
            window.lumaGameInitialized = true;
        }
    }, 100);
}