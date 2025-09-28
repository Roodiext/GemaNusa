window.addEventListener("load", () => {
      const preloader = document.getElementById("preloader");
      const mainContent = document.getElementById("main-content");

      setTimeout(() => {
        preloader.classList.add("fade-out");
        mainContent.classList.remove("opacity-0");
      }, 900);
    });

    // Debug component loading
    document.addEventListener("componentLoaded", (event) => {
      console.log(`Component loaded: ${event.detail.componentId}`);
    });