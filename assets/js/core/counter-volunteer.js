// Counter Animation untuk Section Volunteer
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    // Function untuk animasi counter
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 detik
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                element.textContent = Math.floor(current).toLocaleString('id-ID');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('id-ID');
            }
        };
        
        updateCounter();
    }

    // Intersection Observer untuk trigger animasi saat elemen terlihat
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                // Delay setiap counter untuk efek berurutan
                counters.forEach((counter, index) => {
                    setTimeout(() => {
                        animateCounter(counter);
                    }, index * 200); // Delay 200ms antar counter
                });
            }
        });
    }, {
        threshold: 0.5 // Trigger saat 50% elemen terlihat
    });

    // Observe semua counter elements
    counters.forEach(counter => {
        counter.textContent = '0'; // Set initial value
        observer.observe(counter);
    });
});