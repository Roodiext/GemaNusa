// Dynamic Component Loading System for Gema Nusa

class ComponentLoader {
  constructor() {
    this.loadedComponents = new Set()
    this.componentCache = new Map()
    this.loadingQueue = []
    this.isLoading = false
  }

  // Component configurations for each page
  getPageComponents(page) {
    const components = {
      index: [
        { id: "navbar", file: "components/shared/navbar.html", priority: 1 },
        { id: "hero", file: "components/home/hero-section.html", priority: 1 },
        { id: "tentang", file: "components/home/tentang-section.html", priority: 2 },
        { id: "featured-programs", file: "components/home/featured-programs.html", priority: 2 },
        { id: "luma-quest-intro", file: "components/home/luma-quest-intro.html", priority: 3 },
        { id: "dampak-stats", file: "components/home/dampak-stats.html", priority: 3 },
        { id: "testimonials", file: "components/home/testimonials.html", priority: 4 },
        { id: "ajakan", file: "components/home/ajakan-section.html", priority: 4 },
        { id: "footer", file: "components/shared/footer.html", priority: 5 },
        { id: "luma-chatbot", file: "components/shared/luma-chatbot.html", priority: 5 },
      ],
      program: [
        { id: "navbar", file: "components/shared/navbar.html", priority: 1 },
        { id: "map-hero", file: "components/program/map-hero.html", priority: 1 },
        { id: "program-catalog", file: "components/program/program-catalog.html", priority: 2 },
        { id: "success-stories", file: "components/program/success-stories.html", priority: 3 },
        { id: "footer", file: "components/shared/footer.html", priority: 4 },
        { id: "luma-chatbot", file: "components/shared/luma-chatbot.html", priority: 4 },
      ],
      kolaborasi: [
        { id: "navbar", file: "components/shared/navbar.html", priority: 1 },
        { id: "collaboration-map", file: "components/kolaborasi/collaboration-map.html", priority: 1 },
        { id: "partner-network", file: "components/kolaborasi/partner-network.html", priority: 2 },
        { id: "join-community", file: "components/kolaborasi/join-community.html", priority: 3 },
        { id: "footer", file: "components/shared/footer.html", priority: 4 },
        { id: "luma-chatbot", file: "components/shared/luma-chatbot.html", priority: 4 },
      ],
    }

    return components[page] || []
  }

  // Load component from file
  async loadComponent(componentConfig) {
    const { id, file } = componentConfig

    // Check cache first
    if (this.componentCache.has(file)) {
      return this.componentCache.get(file)
    }

    try {
      let filePath = file
      const currentPath = window.location.pathname

      // If we're in pages/ folder, go up one level
      if (currentPath.includes("/pages/")) {
        filePath = `../${file}`
      }

      console.log(`[v0] Loading component: ${id} from ${filePath}`)

      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`Failed to load component: ${file} (${response.status})`)
      }

      const html = await response.text()
      this.componentCache.set(file, html)
      console.log(`[v0] Component ${id} loaded successfully`)
      return html
    } catch (error) {
      console.error(`[v0] Error loading component ${id}:`, error)
      return `<div class="error-component p-4 bg-red-100 text-red-600 rounded-lg m-4">
        <h3 class="font-bold">Error loading ${id}</h3>
        <p class="text-sm">${error.message}</p>
        <p class="text-xs mt-2">Path: ${file}</p>
        <p class="text-xs">Current URL: ${window.location.pathname}</p>
      </div>`
    }
  }

  // Inject component into DOM
  injectComponent(id, html) {
    const element = document.getElementById(id)
    if (element) {
      element.innerHTML = html
      element.classList.add("component-loaded")
      this.loadedComponents.add(id)

      // Trigger custom event for component loaded
      const event = new CustomEvent("componentLoaded", {
        detail: { componentId: id },
      })
      document.dispatchEvent(event)
    }
  }

  // Load components by priority
  async loadComponentsByPriority(components) {
    const priorityGroups = {}

    // Group components by priority
    components.forEach((component) => {
      const priority = component.priority || 1
      if (!priorityGroups[priority]) {
        priorityGroups[priority] = []
      }
      priorityGroups[priority].push(component)
    })

    // Load each priority group
    const priorities = Object.keys(priorityGroups).sort((a, b) => a - b)

    for (const priority of priorities) {
      const group = priorityGroups[priority]

      // Load all components in this priority group simultaneously
      const loadPromises = group.map(async (component) => {
        const html = await this.loadComponent(component)
        this.injectComponent(component.id, html)
      })

      await Promise.all(loadPromises)

      // Small delay between priority groups for smooth loading
      if (priority < priorities[priorities.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
  }

  // Initialize page loading
  async initializePage() {
    const currentPage = this.getCurrentPage()
    const components = this.getPageComponents(currentPage)

    console.log(`[v0] Initializing page: ${currentPage}`)
    console.log(
      `[v0] Components to load:`,
      components.map((c) => c.id),
    )

    if (components.length === 0) {
      console.warn(`[v0] No components configured for page: ${currentPage}`)
      return
    }

    // Show loading spinner
    this.showLoadingSpinner()

    try {
      await this.loadComponentsByPriority(components)
      console.log(`[v0] Page ${currentPage} loaded successfully`)
    } catch (error) {
      console.error("[v0] Error loading page components:", error)
    } finally {
      this.hideLoadingSpinner()
    }
  }

  // Get current page name from URL
  getCurrentPage() {
    const path = window.location.pathname
    const filename = path.split("/").pop()

    if (filename === "index.html" || filename === "") {
      return "index"
    }

    return filename.replace(".html", "")
  }

  // Loading spinner methods
  showLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner")
    if (spinner) {
      spinner.innerHTML = '<div class="spinner"></div>'
      spinner.style.display = "flex"
      spinner.style.justifyContent = "center"
      spinner.style.alignItems = "center"
      spinner.style.position = "fixed"
      spinner.style.top = "0"
      spinner.style.left = "0"
      spinner.style.width = "100%"
      spinner.style.height = "100%"
      spinner.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
      spinner.style.zIndex = "9999"
    }
  }

  hideLoadingSpinner() {
    const spinner = document.getElementById("loading-spinner")
    if (spinner) {
      setTimeout(() => {
        spinner.style.display = "none"
      }, 500)
    }
  }

  // Preload components for better performance
  preloadComponents(components) {
    components.forEach((component) => {
      if (!this.componentCache.has(component.file)) {
        this.loadComponent(component)
      }
    })
  }
}

// Initialize component loader when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loader = new ComponentLoader()
  loader.initializePage()

  // Make loader available globally
  window.componentLoader = loader
})

// Handle component loaded events
document.addEventListener("componentLoaded", (event) => {
  const { componentId } = event.detail

  // Initialize component-specific functionality
  switch (componentId) {
    case "navbar":
      initializeNavigation()
      break
    case "luma-quest-intro":
    case "luma-quest-full":
    case "quest-progress":
    case "quest-result":
      if (window.lumaQuest) {
        window.lumaQuest.initialize()
      }
      break
    case "luma-chatbot":
      if (window.lumaChatbot) {
        window.lumaChatbot.initialize()
      }
      break
    case "program-catalog":
      console.log("Initializing program-catalog component...")
      // Force initialization of program catalog
      setTimeout(() => {
        if (window.testProgramCatalog) {
          window.testProgramCatalog()
        }
        if (window.forceRenderPrograms) {
          window.forceRenderPrograms()
        }
      }, 100)
      break
    case "dampak-stats":
      initializeCounterAnimations()
      break
  }
})

// Navigation initialization
function initializeNavigation() {
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector("[data-mobile-menu-toggle]")
  const mobileMenu = document.querySelector("[data-mobile-menu]")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  // Active page highlighting
  const currentPage = window.componentLoader.getCurrentPage()
  const navLinks = document.querySelectorAll("[data-nav-link]")

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("data-nav-link")
    if (linkPage === currentPage) {
      link.classList.add("active")
    }
  })
}

// Counter animations for stats
function initializeCounterAnimations() {
  const counters = document.querySelectorAll("[data-counter]")

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-counter"))
        animateCounter(counter, target)
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 100
  const duration = 2000
  const stepTime = duration / 100

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString("id-ID")
  }, stepTime)
}
