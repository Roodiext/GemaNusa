// Contact Form Handler - Fixed untuk Component Loading System
(function() {
    let initialized = false;

    function initContactForm() {
        if (initialized) return;
        
        const form = document.getElementById('contactForm');
        const modal = document.getElementById('thankYouModal');
        const modalContent = document.getElementById('modalContent');
        const closeBtn = document.getElementById('closeModal');

        // Pastikan semua element ada sebelum inisialisasi
        if (!form || !modal || !modalContent || !closeBtn) {
            console.log('Contact form elements not found yet, waiting...');
            return;
        }

        console.log('Initializing contact form...');
        initialized = true;

        // Function to show modal with animation
        function showModal() {
            modal.classList.remove('hidden');
            // Trigger animation after a small delay for smooth transition
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        // Function to hide modal with animation
        function hideModal() {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            
            // Hide modal after animation completes
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Form submit event handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                nama: formData.get('nama'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                saran: formData.get('saran')
            };

            // Log form data (for testing purposes)
            console.log('Form submitted with data:', data);
            
            // Show thank you modal
            showModal();
            
            // Reset form after successful submission
            form.reset();
        });

        // Close modal button handler
        closeBtn.addEventListener('click', function() {
            hideModal();
        });
        
        // Close modal when clicking outside of it
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                hideModal();
            }
        });

        // Optional: Add form validation feedback
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('border-red-400');
                    this.classList.remove('border-gray-400');
                } else {
                    this.classList.remove('border-red-400');
                    this.classList.add('border-gray-400');
                }
            });
        });

        console.log('Contact form initialized successfully!');
    }

    // Try to initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

    // Listen for component loaded events (untuk component loading system)
    document.addEventListener('componentLoaded', function(event) {
        if (event.detail.componentId === 'ajakan') {
            console.log('Contact section component loaded, initializing form...');
            setTimeout(initContactForm, 100); // Small delay to ensure DOM is ready
        }
    });

    // Fallback: coba inisialisasi setiap 500ms sampai berhasil (max 10 detik)
    let attempts = 0;
    const maxAttempts = 20;
    const retryInterval = setInterval(() => {
        attempts++;
        if (initialized || attempts >= maxAttempts) {
            clearInterval(retryInterval);
            if (!initialized && attempts >= maxAttempts) {
                console.error('Failed to initialize contact form after maximum attempts');
            }
            return;
        }
        initContactForm();
    }, 500);

    // Make function available globally for debugging
    window.initContactForm = initContactForm;
})();