document.addEventListener("DOMContentLoaded", () => {
  const leftWords = ["SABANG", "ROTE", "ATAMBUA", "ALOR"];
  const rightWords = ["MERAUKE", "ENDE", "LEMBATA", "TIMIKA"];

  let leftIndex = 0;
  let rightIndex = 0;

  const leftEl = document.getElementById("morph-left");
  const rightEl = document.getElementById("morph-right");

  function morphText(el, words, index) {
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = words[index];
      el.style.opacity = 1;
    }, 400);
  }

  function cycle() {
    leftIndex = (leftIndex + 1) % leftWords.length;
    rightIndex = (rightIndex + 1) % rightWords.length;

    morphText(leftEl, leftWords, leftIndex);
    morphText(rightEl, rightWords, rightIndex);
  }

  // Init pertama
  leftEl.textContent = leftWords[leftIndex];
  rightEl.textContent = rightWords[rightIndex];

  // Jalan tiap 2.5 detik
  setInterval(cycle, 2500);
});
