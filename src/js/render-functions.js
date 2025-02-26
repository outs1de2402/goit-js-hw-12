import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');

  // Додаємо нові зображення до галереї
  const galleryItems = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="gallery-item">
        <a href="${largeImageURL}" class="gallery-link">
          <img src="${webformatURL}" alt="${tags}" class="gallery-image" />
        </a>
        <div class="info">
          <p>❤️ ${likes}</p>
          <p>👀 ${views}</p>
          <p>💬 ${comments}</p>
          <p>⬇️ ${downloads}</p>
        </div>
      </div>`
    )
    .join('');

  // Додаємо нові елементи до існуючої галереї
  gallery.insertAdjacentHTML('beforeend', galleryItems);

  // Ініціалізуємо SimpleLightbox, оновлюючи його після додавання нових карток
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh(); // Оновлюємо SimpleLightbox, щоб обробляти нові елементи
}
