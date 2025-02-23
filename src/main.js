import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.createElement('button');

loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('load-more');
loadMoreBtn.style.display = 'none';
document.body.appendChild(loadMoreBtn);

gallery.style.display = 'grid';
gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
gallery.style.gap = '10px';

gallery.querySelectorAll('.gallery-image').forEach(img => {
  img.style.width = '100%';
  img.style.height = 'auto';
});

let query = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = input.value.trim();
  page = 1;

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  gallery.innerHTML = '';
  loader.style.display = 'block';
  loadMoreBtn.style.display = 'none';

  const images = await fetchImages(query, page, perPage);
  loader.style.display = 'none';

  if (images.length === 0) {
    iziToast.warning({
      title: 'No Results',
      message: 'No images found. Try again!',
    });
  } else {
    renderGallery(images);
    loadMoreBtn.style.display = 'block';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  loader.style.display = 'block';

  const images = await fetchImages(query, page, perPage);
  loader.style.display = 'none';

  if (images.length === 0) {
    loadMoreBtn.style.display = 'none';
    iziToast.info({
      title: 'End of Results',
      message: "We're sorry, but you've reached the end of search results.",
    });
    return;
  }

  renderGallery(images);

  const cardHeight = document
    .querySelector('.gallery-item')
    .getBoundingClientRect().height;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
});
