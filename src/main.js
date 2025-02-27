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
let totalHits = 0;
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

  try {
    const { hits, totalHits: totalImages } = await fetchImages(
      query,
      page,
      perPage
    );
    totalHits = totalImages;
    loader.style.display = 'none';

    if (hits.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'No images found. Try again!',
      });
    } else {
      renderGallery(hits);
      if (totalHits > perPage) {
        loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: 'Failed to load images. Please try again later.',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  if (page * perPage < totalHits) {
    page++;
    loader.style.display = 'block';

    try {
      const { hits } = await fetchImages(query, page, perPage);
      renderGallery(hits);
      loader.style.display = 'none';

      window.scrollBy({
        top:
          document.querySelector('.gallery').getBoundingClientRect().height * 2,
        behavior: 'smooth',
      });

      if (page * perPage >= totalHits) {
        loadMoreBtn.style.display = 'none';
      }
    } catch (error) {
      loader.style.display = 'none';
      iziToast.error({
        title: 'Error',
        message: 'Failed to load images. Please try again later.',
      });
    }
  }
});
