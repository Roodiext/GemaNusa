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
        { id: "hero", file: "components/home/home-hero-section.html", priority: 1 },
        { id: "tentang", file: "components/home/home-about-section.html", priority: 2 },
        { id: "featured-programs", file: "components/home/home-program-gemanusa.html", priority: 2 },
        { id: "luma-quest-intro", file: "components/home/home-luma-ai-bot-section.html", priority: 3 },
        { id: "dampak-stats", file: "components/home/home-testimonials-section.html", priority: 3 },
        { id: "volunteer", file: "components/home/home-role-gemanusa-section.html", priority: 4 },
        { id: "ajakan", file: "components/home/home-contact-section.html", priority: 4 },
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
      "luma-ocean-rescue": [
        { id: "navbar", file: "components/shared/navbar.html", priority: 1 },
        { id: "game-hero", file: "components/game/game-hero.html", priority: 1 },
        { id: "ocean-rescue-game", file: "components/game/clicker-sea.html", priority: 2 },
        { id: "game-instructions", file: "components/game/game-instructions.html", priority: 3 },
        { id: "environmental-impact", file: "components/game/environmental-impact.html", priority: 4 },
        { id: "footer", file: "components/shared/footer.html", priority: 5 },
        { id: "luma-chatbot", file: "components/shared/luma-chatbot.html", priority: 5 },
      ],
    }

    return components[page] || []
  }

  // Load component from file
  async loadComponent(componentConfig) {
    const { id, file } = componentConfig;

    // Return from cache if present
    if (this.componentCache.has(file)) {
      console.log(`[ComponentLoader] (cache) Returning cached component for ${id} (${file})`);
      return this.componentCache.get(file);
    }

    // Build candidate paths to try (handles pages/ and root paths)
    const candidates = [];

    // try the path as given (useful when root served or same-level)
    candidates.push(file);

    // if current URL contains /pages/, try relative one level up
    const currentPath = window.location.pathname || '';
    if (currentPath.includes('/pages/')) {
      candidates.push(`../${file}`);
    }

    // try absolute-from-root path (works if site served from web root)
    candidates.push(`/${file}`);

    // also try ./file (relative)
    candidates.push(`./${file}`);

    let lastError = null;
    for (const filePath of candidates) {
      try {
        console.log(`[ComponentLoader] Loading component: ${id} from candidate path: ${filePath}`);
        const response = await fetch(filePath, { cache: 'no-store' });
        if (!response.ok) {
          // log and try next
          const msg = `HTTP ${response.status} while loading ${filePath}`;
          console.warn(`[ComponentLoader] ${msg}`);
          lastError = new Error(msg);
          continue;
        }
        const html = await response.text();
        this.componentCache.set(file, html);
        console.log(`[ComponentLoader] Component ${id} loaded successfully from ${filePath}`);
        return html;
      } catch (err) {
        console.warn(`[ComponentLoader] Error fetching ${filePath}:`, err);
        lastError = err;
        // try next candidate
      }
    }

    // All candidates failed -> return friendly error component
    console.error(`[ComponentLoader] Error loading component ${id}: all paths failed. Last error:`, lastError);
    return `<div class="error-component p-4 bg-red-100 text-red-600 rounded-lg m-4">
      <h3 class="font-bold">Error loading ${id}</h3>
      <p class="text-sm">Tried paths: ${candidates.join(', ')}</p>
      <p class="text-xs mt-2">Last error: ${lastError && lastError.message}</p>
    </div>`;
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

    console.log(`[ComponentLoader] Initializing page: ${currentPage}`)
    console.log(
      `[ComponentLoader] Components to load:`,
      components.map((c) => c.id),
    )

    if (components.length === 0) {
      console.warn(`[ComponentLoader] No components configured for page: ${currentPage}`)
      return
    }

    // Show loading spinner
    this.showLoadingSpinner()

    try {
      await this.loadComponentsByPriority(components)
      console.log(`[ComponentLoader] Page ${currentPage} loaded successfully`)
    } catch (error) {
      console.error("[ComponentLoader] Error loading page components:", error)
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
    case "featured-programs":
      console.log("Initializing featured-programs component...")
      if (window.featuredPrograms) {
        window.featuredPrograms.initialize()
      }
      break
    case "ocean-rescue-game":
      console.log("Initializing LUMA Ocean Rescue game...")
      setTimeout(() => {
        if (typeof LumaOceanRescue !== 'undefined' && !window.lumaOceanRescue) {
          window.lumaOceanRescue = new LumaOceanRescue()
          console.log("LUMA Ocean Rescue game initialized successfully!")
        }
      }, 100)
      break
    case "game-hero":
      console.log("Game hero section loaded")
      break
    case "game-instructions":
      console.log("Game instructions loaded")
      break
    case "environmental-impact":
      console.log("Environmental impact section loaded")
      initializeCounterAnimations()
      break
  }
})

// Navigation initialization
function initializeNavigation() {
  const mobileMenuButton = document.querySelectorAll("[data-mobile-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  mobileMenuButton.forEach(btn => {
    btn.addEventListener("click", () => {
      if (mobileMenu) {
        mobileMenu.classList.toggle("-translate-x-full");
      }
    });
  });

  // Active page highlighting
  const currentPage = window.componentLoader?.getCurrentPage?.() || '';
  const navLinks = document.querySelectorAll("[data-nav-link]");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("data-nav-link");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
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

// Safe morph text function - only run on home page
function initializeMorphText() {
  // Only run on index page
  const currentPage = window.componentLoader?.getCurrentPage?.() || '';
  if (currentPage !== 'index') {
    return;
  }

  const sabangWords = ["SABANG", "ROTE", "ENDE"];
  const meraukeWords = ["MERAUKE", "ENDE", "SABANG"];

  let sabangIndex = 0;
  let meraukeIndex = 0;

  function morphText(id, words, indexVar, callback) {
    const el = document.getElementById(id);
    if (!el) return; // Safety check
    
    el.classList.add("fade-out");
    setTimeout(() => {
      indexVar = (indexVar + 1) % words.length;
      el.textContent = words[indexVar];
      el.classList.remove("fade-out");
      callback(indexVar);
    }, 600);
  }

  // Only start if elements exist
  if (document.getElementById("sabang") && document.getElementById("merauke")) {
    setInterval(() => {
      morphText("sabang", sabangWords, sabangIndex, i => sabangIndex = i);
      morphText("merauke", meraukeWords, meraukeIndex, i => meraukeIndex = i);
    }, 2500);
  }
}

// jQuery fade scroll effect - with safety check
if (typeof $ !== 'undefined') {
  $(document).ready(function() {
    function checkFade() {
      $('.fade-scroll').each(function(i) {
        var bottom_of_element = $(this).offset().top + $(this).outerHeight() / 4;
        var bottom_of_window = $(window).scrollTop() + $(window).height();

        if (bottom_of_window > bottom_of_element) {
          $(this).delay(i * 200).queue(function(next) {
            $(this).addClass('show');
            next();
          });
        }
      });
    }

    checkFade();
    $(window).on('scroll', function() {
      checkFade();
    });
  });
}

function initProgramCards(cardSelector, programsData) {
  const cards = document.querySelectorAll(cardSelector);
  const detailSection = document.getElementById("programDetail");
  const detailImage = document.getElementById("detailImage");
  const detailTitle = document.getElementById("detailTitle");
  const detailDesc = document.getElementById("detailDesc");
  const detailLink = document.getElementById("detailLink");

  if (!cards.length || !detailSection) return; // Safety check

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const programKey = card.dataset.program;
      const program = programsData[programKey];
      if (!program) return;

      // Update detail section
      if (detailImage) detailImage.src = program.image;
      if (detailImage) detailImage.alt = program.title;
      if (detailTitle) detailTitle.textContent = program.title;
      if (detailDesc) detailDesc.textContent = program.desc;
      if (detailLink) detailLink.href = program.link;

      // Show section
      detailSection.classList.remove("hidden");
      detailSection.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Initialize morph text after components load
document.addEventListener("componentLoaded", (event) => {
  if (event.detail.componentId === "hero") {
    setTimeout(initializeMorphText, 500);
  }
});

// Safe program cards initialization
setTimeout(() => {
  initProgramCards(".card", {
    mengajar: {
      title: "Kegiatan Sosial Mengajar",
      desc: "Kami aktif dalam berbagai program sosial dari kegiatan mengajar, bakti sosial, hingga pemberdayaan masyarakat. Gema Nusa menjadi penggema pendidikan di titik kehampaan gelapnya dunia.",
      image: "/assets/img/mengajar.jpg",
      link: "#"
    },
    bakti: {
      title: "Kegiatan Bakti Sosial",
      desc: "Program bakti sosial Gema Nusa berfokus pada kepedulian dan aksi nyata bagi masyarakat yang membutuhkan.",
      image: "/assets/img/bakti.jpg",
      link: "#"
    },
    bantuan: {
      title: "Bantuan Pangan",
      desc: "Distribusi bantuan pangan bagi mereka yang terdampak ketidakstabilan ekonomi dan bencana alam.",
      image: "/assets/img/bantuan.jpg",
      link: "#"
    },
    lainnya: {
      title: "Program Lainnya",
      desc: "Berbagai program inovatif Gema Nusa lainnya untuk memberdayakan masyarakat.",
      image: "/assets/img/lainnya.jpg",
      link: "#"
    }
  });
}, 2000);