// Replace top-level DOMContentLoaded wrapper with an init routine that retries until elements exist

// all module-scoped variables (will be assigned in init)
let startBtn, hero, gameArea, board, timerEl, movesEl, progressBar, messageEl, bubble, bubbleText;
let resultModal, resultScore, resultMoves, resultTime, resultTitle, resultBadge, resultDialog;
let playAgainBtn, homeBtn, resetBtn;

// existing game state variables and constants
const icons = ['🚑','📚','💊','🧥','🧸','🚰','🩺','🪣'];
let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer = 0;
let timerInterval = null;
let started = false;

const DIALOG = {
	start: 'Yuk cocokkan pasangan bantuan! ❤️',
	correct: 'Mantap! Tepat sasaran 🎯',
	wrong: 'Coba lagi ya! 🌱',
	almost: 'Sedikit lagi! 💪',
	finished: {
		hero: 'Luar biasa! Kamu pahlawan sejati ✨',
		relawan: 'Kerja bagus! Kamu relawan hebat ❤️',
		pejuang: 'Keren! Pantang menyerah 🌱',
		pemula: 'Jangan khawatir, coba lagi! 🤝'
	}
};

function showBubble(text, timeout = 2500) {
	bubbleText.textContent = text;
	bubble.classList.remove('hidden');
	clearTimeout(bubble._t);
	bubble._t = setTimeout(() => bubble.classList.add('hidden'), timeout);
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function createBoard() {
	board.innerHTML = '';
	deck = shuffle([...icons, ...icons]);
	deck.forEach((val, idx) => {
		const card = document.createElement('button');
		card.className = 'card relative bg-white rounded-lg shadow p-4 h-28 flex items-center justify-center transform-style preserve-3d transition-transform duration-500';
		card.dataset.value = val;
		card.dataset.index = idx;
		card.setAttribute('aria-label', 'card');
		card.innerHTML = `
			<div class="card-inner w-full h-full relative">
				<div class="card-front absolute inset-0 flex items-center justify-center text-2xl">${val}</div>
				<div class="card-back absolute inset-0 bg-white rounded-lg flex items-center justify-center text-gray-200 text-2xl">?</div>
			</div>
		`;
		// style for flip via class
		card.style.perspective = '1000px';
		card.addEventListener('click', onCardClick);
		board.appendChild(card);
	});
	// reset metrics
	moves = 0; matchedPairs = 0; movesEl.textContent = moves; updateProgress();
	timer = 0; timerEl.textContent = timer + 's';
	started = false;
	showMessage(DIALOG.start);
}

function previewCards() {
	// Show all cards for 2 seconds at the start
	const allCards = board.querySelectorAll('.card');
	allCards.forEach(card => {
		card.style.pointerEvents = 'none'; // Disable clicking during preview
		flipToShow(card);
	});
	
	setTimeout(() => {
		allCards.forEach(card => {
			flipToHide(card);
			card.style.pointerEvents = 'auto'; // Re-enable clicking
		});
	}, 2000);
}

function flipToShow(card) {
	card.classList.add('flipped');
	card.style.transform = 'rotateY(180deg)';
	card.querySelector('.card-front').style.transform = 'rotateY(0deg)';
	card.querySelector('.card-back').style.opacity = '0';
}

function flipToHide(card) {
	card.classList.remove('flipped');
	card.style.transform = 'rotateY(0deg)';
	card.querySelector('.card-front').style.transform = 'rotateY(-180deg)';
	card.querySelector('.card-back').style.opacity = '1';
}

function onCardClick(e) {
	const card = e.currentTarget;
	if (lockBoard) return;
	if (card.classList.contains('flipped')) return;

	// start timer on first click
	if (!started) {
		startTimer();
		started = true;
	}

	flipToShow(card);

	if (!firstCard) {
		firstCard = card;
		return;
	}
	secondCard = card;
	moves++;
	movesEl.textContent = moves;
	checkForMatch();
}

function checkForMatch() {
	if (!firstCard || !secondCard) return;
	const isMatch = firstCard.dataset.value === secondCard.dataset.value;
	if (isMatch) {
		// keep open
		firstCard.removeEventListener('click', onCardClick);
		secondCard.removeEventListener('click', onCardClick);
		firstCard.classList.add('matched');
		secondCard.classList.add('matched');
		firstCard = null; secondCard = null;
		matchedPairs++;
		updateProgress();
		showMessage(DIALOG.correct);
		// near finish check
		if (8 - matchedPairs <= 3 && matchedPairs < 8) {
			showMessage(DIALOG.almost);
		}
		if (matchedPairs === 8) {
			endGame();
		}
	} else {
		// wrong
		lockBoard = true;
		showMessage(DIALOG.wrong);
		setTimeout(() => {
			flipToHide(firstCard);
			flipToHide(secondCard);
			firstCard = null;
			secondCard = null;
			lockBoard = false;
		}, 1000);
	}
}

function updateProgress() {
	const pct = (matchedPairs / 8) * 100;
	progressBar.style.width = pct + '%';
}

function startTimer() {
	clearInterval(timerInterval);
	timerInterval = setInterval(() => {
		timer++;
		timerEl.textContent = timer + 's';
	}, 1000);
}

function stopTimer() {
	clearInterval(timerInterval);
	timerInterval = null;
}

function calcScore() {
	let score = 1000 - (moves * 10) - (timer * 2);
	if (score < 0) score = 0;
	return Math.round(score);
}

function titleForScore(score) {
	if (score >= 800) return { title: '🥇 Pahlawan Peduli', dialog: DIALOG.finished.hero };
	if (score >= 600) return { title: '🥈 Relawan Hebat', dialog: DIALOG.finished.relawan };
	if (score >= 400) return { title: '🥉 Pejuang Peduli', dialog: DIALOG.finished.pejuang };
	return { title: '🤝 Pemula Peduli', dialog: DIALOG.finished.pemula };
}

function endGame() {
	stopTimer();
	const sc = calcScore();
	const t = titleForScore(sc);
	resultScore.textContent = sc;
	resultMoves.textContent = moves;
	resultTime.textContent = timer + 's';
	resultBadge.textContent = t.title;
	resultDialog.textContent = t.dialog;
	resultTitle.textContent = 'Selesai!';
	// show modal
	resultModal.classList.remove('hidden');
	showBubble(t.dialog, 4000);
}

function showMessage(text) {
	// only set inline message if element exists (we removed the game-area textual message)
	if (typeof messageEl !== 'undefined' && messageEl && messageEl instanceof Element) {
		messageEl.textContent = text;
	}
	// always show bubble
	showBubble(text);
}

function resetGame(startAfter = false) {
	stopTimer();
	firstCard = null; secondCard = null; lockBoard = false;
	createBoard();
	// hide modal if open
	resultModal.classList.add('hidden');
	// reset flips
	Array.from(document.querySelectorAll('.card')).forEach(c => {
		c.style.transform = 'rotateY(0deg)';
		c.classList.remove('flipped','matched');
	});
	if (startAfter) {
		hero.classList.add('hidden');
		gameArea.classList.remove('hidden');
		startTimer();
		started = true;
	}
}

function initBindings() {
	// try to find critical elements; if not present yet (component not injected) retry shortly
	startBtn = document.getElementById('start-game-btn');
	if (!startBtn) {
		// retry until component is ready (safe short retries)
		return setTimeout(initBindings, 100);
	}
	// now bind the rest
	hero = document.getElementById('luma-hero');
	gameArea = document.getElementById('luma-game');
	board = document.getElementById('board');
	timerEl = document.getElementById('timer');
	movesEl = document.getElementById('moves');
	progressBar = document.getElementById('progress-bar');
	messageEl = document.getElementById('luma-message');
	bubble = document.getElementById('luma-bubble');
	bubbleText = document.getElementById('luma-bubble-text');
	resultModal = document.getElementById('result-modal');
	resultScore = document.getElementById('result-score');
	resultMoves = document.getElementById('result-moves');
	resultTime = document.getElementById('result-time');
	resultTitle = document.getElementById('result-title');
	resultBadge = document.getElementById('result-badge');
	resultDialog = document.getElementById('result-dialog');
	playAgainBtn = document.getElementById('play-again-btn');
	homeBtn = document.getElementById('home-btn');
	resetBtn = document.getElementById('reset-btn');

	// NEW buttons
	const pageHomeBtn = document.getElementById('page-home-btn');
	const toHeroBtn = document.getElementById('to-hero-btn');

	// bind events (handlers reference existing functions)
	startBtn.addEventListener('click', function () {
		hero.classList.add('opacity-0');
		setTimeout(() => hero.classList.add('hidden'), 500);
		gameArea.classList.remove('hidden');
		// fade in
		setTimeout(() => gameArea.classList.add('opacity-100'), 20);
		showMessage(DIALOG.start);
		resetGame(true);
		// Preview cards after game starts
		setTimeout(() => previewCards(), 300);
	});

	playAgainBtn.addEventListener('click', function () {
		resultModal.classList.add('hidden');
		resetGame(true);
		// Preview cards when playing again
		setTimeout(() => previewCards(), 300);
	});

	homeBtn.addEventListener('click', function () {
		window.location.href = '/';
	});

	resetBtn.addEventListener('click', function () {
		resetGame(false);
	});

	// NEW: kembali ke halaman index.html
	if (pageHomeBtn) {
		pageHomeBtn.addEventListener('click', function () {
			window.location.href = '/index.html';
		});
	}

	// NEW: kembali ke hero di dalam halaman (seperti "refresh ke hero")
	if (toHeroBtn) {
		toHeroBtn.addEventListener('click', function () {
			// stop timer and reset board but keep hero visible
			stopTimer();
			resetGame(false);
			// show hero
			hero.classList.remove('hidden');
			// ensure visible (remove opacity-0)
			setTimeout(() => hero.classList.remove('opacity-0'), 20);
			// hide game area
			gameArea.classList.add('hidden');
		});
	}

	// initialize board now component and bindings are ready
	createBoard();
}

// start init immediately (no dependency on DOMContentLoaded)
initBindings();