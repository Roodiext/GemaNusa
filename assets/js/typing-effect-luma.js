
    document.addEventListener("DOMContentLoaded", () => {
      const startTyping = () => {
        const texts = ["Hai, saya Luma", "Si Pintar", "Lumen AI-mu"];
        const typedText = document.getElementById("typed-text");
        const cursor = document.getElementById("cursor");

        if (!typedText || !cursor) return;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
          const currentText = texts[textIndex];

          if (!isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
              isDeleting = true;
              setTimeout(type, 1500); // jeda sebelum hapus
              return;
            }
          } else {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
              isDeleting = false;
              textIndex = (textIndex + 1) % texts.length;
              setTimeout(type, 500); // jeda sebelum mulai teks baru
              return;
            }
          }

          setTimeout(type, isDeleting ? 60 : 120);
        }

        type();
      };

      // observer menunggu #luma-quest-intro muncul
      const observer = new MutationObserver(() => {
        if (document.querySelector("#luma-quest-intro #typed-text")) {
          startTyping();
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
