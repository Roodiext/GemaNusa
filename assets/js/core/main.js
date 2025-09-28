// Main JavaScript for Gema Nusa

// Global variables
window.gemaNusa = {
  initialized: false,
  currentPage: "",
  userPreferences: {},
  analytics: {
    pageViews: 0,
    interactions: 0,
  },
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  console.log("Initializing Gema Nusa application...")

  // Set current page
  window.gemaNusa.currentPage = getCurrentPageName()

  // Load user preferences from localStorage
  loadUserPreferences()

  // Initialize smooth scrolling
  initializeSmoothScrolling()

  // Initialize intersection observer for animations
  initializeScrollAnimations()

  // Initialize form handlers
  initializeFormHandlers()

  // Initialize program page specific features
  if (window.gemaNusa.currentPage === "program") {
    initializeProgramFilters()
    initializeQuestModal()
  }

  // Track page view
  trackPageView()

  window.gemaNusa.initialized = true
  console.log("Gema Nusa application initialized successfully")
}

function getCurrentPageName() {
  const path = window.location.pathname
  const filename = path.split("/").pop()
  return filename.replace(".html", "") || "index"
}

function loadUserPreferences() {
  const saved = localStorage.getItem("gemaNusaPreferences")
  if (saved) {
    try {
      window.gemaNusa.userPreferences = JSON.parse(saved)
    } catch (error) {
      console.error("Error loading user preferences:", error)
      window.gemaNusa.userPreferences = {}
    }
  }
}

function saveUserPreferences() {
  localStorage.setItem("gemaNusaPreferences", JSON.stringify(window.gemaNusa.userPreferences))
}

function initializeSmoothScrolling() {
  // Handle anchor links
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]')
    if (link) {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Track interaction
        trackInteraction("scroll_to_section", targetId)
      }
    }
  })
}

function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target
        const animation = element.getAttribute("data-animate")

        switch (animation) {
          case "fade-in-up":
            element.classList.add("fade-in-up")
            break
          case "slide-in-right":
            element.classList.add("slide-in-right")
            break
          default:
            element.classList.add("fade-in-up")
        }

        observer.unobserve(element)
      }
    })
  }, observerOptions)

  animatedElements.forEach((element) => {
    element.classList.add("component-loading")
    observer.observe(element)
  })
}

function initializeFormHandlers() {
  // Newsletter subscription
  const newsletterForms = document.querySelectorAll("[data-newsletter-form]")
  newsletterForms.forEach((form) => {
    form.addEventListener("submit", handleNewsletterSubmission)
  })

  // Contact forms
  const contactForms = document.querySelectorAll("[data-contact-form]")
  contactForms.forEach((form) => {
    form.addEventListener("submit", handleContactSubmission)
  })

  // Join community forms
  const joinForms = document.querySelectorAll("[data-join-form]")
  joinForms.forEach((form) => {
    form.addEventListener("submit", handleJoinSubmission)
  })
}

function handleNewsletterSubmission(e) {
  e.preventDefault()
  const form = e.target
  const email = form.querySelector('input[type="email"]').value

  if (validateEmail(email)) {
    // Simulate API call
    showNotification("Terima kasih! Anda telah berlangganan newsletter Gema Nusa.", "success")
    form.reset()
    trackInteraction("newsletter_signup", email)
  } else {
    showNotification("Mohon masukkan email yang valid.", "error")
  }
}

function handleContactSubmission(e) {
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)

  // Basic validation
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  if (!name || !email || !message) {
    showNotification("Mohon lengkapi semua field yang diperlukan.", "error")
    return
  }

  if (!validateEmail(email)) {
    showNotification("Mohon masukkan email yang valid.", "error")
    return
  }

  // Simulate API call
  showNotification("Pesan Anda telah terkirim! Tim Gema Nusa akan segera menghubungi Anda.", "success")
  form.reset()
  trackInteraction("contact_form_submit", { name, email })
}

function handleJoinSubmission(e) {
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)

  // Process join form
  showNotification(
    "Selamat datang di komunitas Gema Nusa! Kami akan mengirimkan informasi lebih lanjut ke email Anda.",
    "success",
  )
  form.reset()
  trackInteraction("join_community", formData.get("email"))
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Style notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#2D5A27" : type === "error" ? "#dc2626" : "#1B4B73"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Handle close button
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification)
  }, 5000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

function trackPageView() {
  window.gemaNusa.analytics.pageViews++
  console.log(`Page view tracked: ${window.gemaNusa.currentPage}`)
}

function trackInteraction(action, data = null) {
  window.gemaNusa.analytics.interactions++
  console.log(`Interaction tracked: ${action}`, data)

  // Store interaction data
  const interactions = JSON.parse(localStorage.getItem("gemaNusaInteractions") || "[]")
  interactions.push({
    action,
    data,
    timestamp: new Date().toISOString(),
    page: window.gemaNusa.currentPage,
  })

  // Keep only last 100 interactions
  if (interactions.length > 100) {
    interactions.splice(0, interactions.length - 100)
  }

  localStorage.setItem("gemaNusaInteractions", JSON.stringify(interactions))
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments

    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Export functions for global access
window.gemaNusaUtils = {
  showNotification,
  trackInteraction,
  validateEmail,
  debounce,
  throttle,
}

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("Page hidden")
  } else {
    console.log("Page visible")
    trackPageView()
  }
})

// Handle errors
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  trackInteraction("javascript_error", {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
  })
})

// Program filtering functionality
function initializeProgramFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]")
  const programCards = document.querySelectorAll("[data-category]")

  if (filterButtons.length === 0) return

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("bg-nusantara-green", "text-white")
        btn.classList.add("bg-gray-200", "text-gray-700")
      })
      button.classList.remove("bg-gray-200", "text-gray-700")
      button.classList.add("bg-nusantara-green", "text-white")

      // Filter programs
      programCards.forEach((card) => {
        const category = card.getAttribute("data-category")
        if (filter === "all" || category === filter) {
          card.style.display = "block"
          card.classList.add("fade-in-up")
        } else {
          card.style.display = "none"
        }
      })

      trackInteraction("program_filter_used", filter)
    })
  })
}

// Quest modal functionality
function initializeQuestModal() {
  const questModal = document.querySelector("[data-quest-modal]")
  const closeQuestBtn = document.querySelector("[data-close-quest]")

  if (!questModal) return

  // Open quest modal
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-start-quest]")) {
      e.preventDefault()
      questModal.classList.remove("hidden")
      document.body.style.overflow = "hidden"

      // Initialize quest if not already done
      if (window.lumaQuest && !window.lumaQuest.isActive) {
        setTimeout(() => {
          window.lumaQuest.startQuest()
        }, 300)
      }
    }
  })

  // Close quest modal
  if (closeQuestBtn) {
    closeQuestBtn.addEventListener("click", () => {
      questModal.classList.add("hidden")
      document.body.style.overflow = "auto"
    })
  }

  // Close on backdrop click
  questModal.addEventListener("click", (e) => {
    if (e.target === questModal) {
      questModal.classList.add("hidden")
      document.body.style.overflow = "auto"
    }
  })
}
