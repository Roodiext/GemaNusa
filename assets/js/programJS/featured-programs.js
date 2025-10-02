// Featured Programs JavaScript - featured-programs.js

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeFeaturedPrograms, 100);
});

// Also initialize when component is loaded dynamically
document.addEventListener('componentLoaded', function(event) {
    if (event.detail.componentId === 'featured-programs') {
        console.log('Initializing featured programs...');
        setTimeout(initializeFeaturedPrograms, 200);
    }
});

function initializeFeaturedPrograms() {
    const cards = document.querySelectorAll('.card');
    const tabButtons = document.querySelectorAll('.tab-button');
    let isAnimating = false;
    
    if (!cards || cards.length === 0) {
        console.log('Featured programs cards not found, retrying...');
        setTimeout(initializeFeaturedPrograms, 500);
        return;
    }

    console.log('Initializing featured programs with', cards.length, 'cards');

    // Remove any existing event listeners to prevent conflicts
    cards.forEach(card => {
        // Clone node to remove all event listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
    });

    // Get fresh references after cloning
    const freshCards = document.querySelectorAll('.card');
    const freshTabButtons = document.querySelectorAll('.tab-button');

    // Setup event listeners on fresh cards
    freshCards.forEach(card => {
        const cardDetail = card.querySelector('.card-detail');
        const closeBtn = card.querySelector('.close-detail');
        
        if (!cardDetail || !closeBtn) return;

        // Click handler for card expansion
        card.addEventListener('click', function(e) {
            // Prevent if clicking on close button or if animation is running
            if (e.target.closest('.close-detail') || isAnimating) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            // Prevent if clicking inside detail area when expanded
            if (card.classList.contains('expanded') && e.target.closest('.card-detail')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            expandCard(card);
        });

        // Close button handler
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            collapseCard(card);
        });

        // Prevent detail area from triggering card click when expanded
        cardDetail.addEventListener('click', function(e) {
            if (card.classList.contains('expanded')) {
                e.stopPropagation();
            }
        });
    });

    // Tab navigation
    freshTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = button.dataset.program;
            updateActiveTab(button);
            filterCards(category);
            closeAllCards();
        });
    });

    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllCards();
        }
    });

    function expandCard(card) {
        if (isAnimating || card.classList.contains('expanded')) return;
        
        isAnimating = true;
        
        const cardsGrid = document.getElementById('cardsGrid');
        
        // Close all other cards first (auto-close feature)
        const expandedCards = document.querySelectorAll('.card.expanded');
        expandedCards.forEach(expandedCard => {
            if (expandedCard !== card) {
                expandedCard.classList.remove('expanded');
                expandedCard.classList.remove('non-expanded');
                expandedCard.style.order = '';
            }
        });
        
        // Add has-expanded class to container
        if (cardsGrid) {
            cardsGrid.classList.add('has-expanded');
        }
        
        // Add expanded class to clicked card
        card.classList.add('expanded');
        card.style.order = '-1';
        
        // Mark other cards as non-expanded
        freshCards.forEach(c => {
            if (c !== card) {
                c.classList.add('non-expanded');
                c.style.order = '0';
            }
        });
        
        // Force layout recalculation
        card.offsetHeight;
        
        // Set animation complete after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);

        console.log('Card expanded');
    }

    function collapseCard(card) {
        if (isAnimating || !card.classList.contains('expanded')) return;
        
        isAnimating = true;
        
        const cardsGrid = document.getElementById('cardsGrid');
        
        // Remove expanded class
        card.classList.remove('expanded');
        card.style.order = '';
        
        // Remove has-expanded class from container
        if (cardsGrid) {
            cardsGrid.classList.remove('has-expanded');
        }
        
        // Remove non-expanded class from other cards
        freshCards.forEach(c => {
            c.classList.remove('non-expanded');
            c.style.order = '';
        });
        
        // Set animation complete after transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);

        console.log('Card collapsed');
    }

    // Close all expanded cards
    function closeAllCards() {
        if (isAnimating) return;
        
        const expandedCards = document.querySelectorAll('.card.expanded');
        if (expandedCards.length === 0) return;
        
        isAnimating = true;
        
        const cardsGrid = document.getElementById('cardsGrid');
        
        expandedCards.forEach(card => {
            card.classList.remove('expanded');
            card.style.order = '';
        });
        
        // Remove has-expanded class from container
        if (cardsGrid) {
            cardsGrid.classList.remove('has-expanded');
        }
        
        // Remove non-expanded class from all cards
        freshCards.forEach(c => {
            c.classList.remove('non-expanded');
            c.style.order = '';
        });
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Filter cards by category
    function filterCards(category) {
        freshCards.forEach(card => {
            if (category === 'all' || card.dataset.program === category) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (category !== 'all' && card.dataset.program !== category) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    // Update active tab
    function updateActiveTab(activeButton) {
        freshTabButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-purple-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });
        activeButton.classList.add('active', 'bg-purple-600', 'text-white');
        activeButton.classList.remove('bg-gray-100', 'text-gray-600');
    }

    console.log('Featured programs initialized successfully');
}

// Global function for external access
window.featuredPrograms = {
    initialize: initializeFeaturedPrograms
};