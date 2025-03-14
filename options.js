// options.js
document.addEventListener('DOMContentLoaded', () => {
  const imageListContainer = document.getElementById('imageList');
  const newImageUrl = document.getElementById('newImageUrl');
  const addImageBtn = document.getElementById('addImageBtn');

  // Funkcja ładująca istniejące linki obrazków i wyświetlająca je na liście
  function loadImages() {
    chrome.storage.sync.get({ slideshowImages: [] }, (data) => {
      const images = data.slideshowImages;
      imageListContainer.innerHTML = '';
      images.forEach((url, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = url;
        input.size = 50;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Usuń';
        removeBtn.addEventListener('click', () => {
          images.splice(index, 1);
          chrome.storage.sync.set({ slideshowImages: images }, () => {
            loadImages();
          });
        });

        div.appendChild(input);
        div.appendChild(removeBtn);
        imageListContainer.appendChild(div);
      });
    });
  }

  // Funkcja dodająca nowy link do listy
  function addImage(url) {
    chrome.storage.sync.get({ slideshowImages: [] }, (data) => {
      const images = data.slideshowImages;
      images.push(url);
      chrome.storage.sync.set({ slideshowImages: images }, () => {
        loadImages();
      });
    });
  }

  // Obsługa przycisku "Dodaj obrazek"
  addImageBtn.addEventListener('click', () => {
    const url = newImageUrl.value.trim();
    if (url) {
      addImage(url);
      newImageUrl.value = '';
    }
  });

  // Wczytanie listy na starcie
  loadImages();
});
