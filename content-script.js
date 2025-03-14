// content-script.js
let overlay;
let timerElement;
let activityWarning;
let slideshowContainer;
let images = [];
let currentImageIndex = 0;
let countdown = 300; // 5 minut = 300 sekund
let userActive = false;
let lastActivityTime = Date.now();
let intervalId = null;
let slideshowIntervalId = null;
let videoPaused = false;

(async function init() {
  // Pobierz listę obrazów z chrome.storage
  const data = await new Promise((resolve) => {
    chrome.storage.sync.get({ slideshowImages: [] }, (res) => resolve(res));
  });
  images = data.slideshowImages.length ? data.slideshowImages : [];

  // Stwórz overlay, timer, container Slideshow
  createOverlay();

  // Zablokuj wideo (dla pewności, żeby się nie odtwarzało w tle)
  pauseVideoIfNeeded();

  // Uruchom slideshow, o ile są przygotowane jakiekolwiek obrazy
  startSlideshow();

  // Uruchom odliczanie, śledzenie aktywności
  startCountdown();
})();

// ==========================
// 1. Tworzenie Overlaya
// ==========================
function createOverlay() {
  overlay = document.createElement('div');
  overlay.id = 'slideshow-overlay';

  slideshowContainer = document.createElement('div');
  slideshowContainer.id = 'slideshow-container';

  timerElement = document.createElement('div');
  timerElement.id = 'timer';
  timerElement.textContent = formatTime(countdown);

  activityWarning = document.createElement('div');
  activityWarning.id = 'activity-warning';
  activityWarning.textContent = 'Brak aktywności! Porusz myszką lub kliknij, aby kontynuować odliczanie.';

  overlay.appendChild(slideshowContainer);
  overlay.appendChild(timerElement);
  overlay.appendChild(activityWarning);

  document.body.appendChild(overlay);

  // Dodaj nasłuchiwacze aktywności: ruch myszą, kliknięcia, klawiaturę
  document.addEventListener('mousemove', onUserActivity);
  document.addEventListener('keydown', onUserActivity);
  document.addEventListener('click', onUserActivity);
}

// ==========================
// 2. Slideshow
// ==========================
function startSlideshow() {
  if (!images.length) {
    // Jeśli nie ma obrazków w storage, można wstawić domyślny slajd, albo nie
    const defaultImage = document.createElement('div');
    defaultImage.style.fontSize = '24px';
    defaultImage.style.textAlign = 'center';
    defaultImage.textContent = 'Brak obrazków w slideshow. Dodaj je w opcjach rozszerzenia.';
    slideshowContainer.appendChild(defaultImage);
    return;
  }

  // Dodaj elementy img do kontenera, ukryj wszystkie
  images.forEach((imgUrl) => {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.className = 'slideshow-image';
    slideshowContainer.appendChild(img);
  });

  // Wyświetl pierwszy slajd
  showSlide(0);

  // Ustaw interwał np. co 5 sekund
  slideshowIntervalId = setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showSlide(currentImageIndex);
  }, 5000);
}

function showSlide(index) {
  const allSlides = slideshowContainer.querySelectorAll('.slideshow-image');
  allSlides.forEach((slide) => (slide.style.display = 'none'));
  allSlides[index].style.display = 'block';
}

// ==========================
// 3. Timer i aktywność
// ==========================
function startCountdown() {
  intervalId = setInterval(() => {
    // Sprawdź aktywność użytkownika
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityTime;

    // Przykład logiki: jeżeli użytkownik nie był aktywny przez 10 sekund, 
    // wstrzymujemy odliczanie (lub wydłużamy – zależy od wymagań).
    if (timeSinceLastActivity > 10_000) {
      activityWarning.style.display = 'block';
      return; // pomijamy decrement odliczania
    } else {
      activityWarning.style.display = 'none';
    }

    countdown--;
    if (countdown <= 0) {
      // Koniec odliczania
      clearInterval(intervalId);
      clearInterval(slideshowIntervalId);
      removeOverlay();
      resumeVideoIfPaused();
    } else {
      timerElement.textContent = formatTime(countdown);
    }
  }, 1000);
}

function onUserActivity() {
  userActive = true;
  lastActivityTime = Date.now();
  activityWarning.style.display = 'none';
}

// ==========================
// 4. Blokada i wznawianie wideo
// ==========================
function pauseVideoIfNeeded() {
  // Znajdź element wideo
  const videoEl = document.querySelector('video');
  if (videoEl && !videoEl.paused) {
    videoEl.pause();
    videoPaused = true;
  }
}

function resumeVideoIfPaused() {
  const videoEl = document.querySelector('video');
  if (videoEl && videoPaused) {
    videoEl.play();
  }
}

function removeOverlay() {
  document.removeEventListener('mousemove', onUserActivity);
  document.removeEventListener('keydown', onUserActivity);
  document.removeEventListener('click', onUserActivity);

  if (overlay) {
    overlay.remove();
  }
}

// ==========================
// 5. Pomocnicze
// ==========================
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${padZero(min)}:${padZero(sec)}`;
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}
