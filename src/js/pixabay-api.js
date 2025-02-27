import axios from 'axios';

const API_KEY = '48874929-f90ec9beeb99fdbae3d7d9b25';
const BASE_URL = 'https://pixabay.com/api/';
export async function fetchImages(query, page = 1, perPage = 40) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    if (response.data.hits.length === 0) {
      throw new Error('No images found for the given query');
    }

    return { hits: response.data.hits, totalHits: response.data.totalHits };
  } catch (error) {
    console.error('Error fetching images:', error.message || error);
    return [];
  }
}
