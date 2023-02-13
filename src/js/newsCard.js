import { NewsAPI } from './API/fetchAPI';
import getRefs from './refs';
import { renderMarkup, clear, renderWether } from './renderMarkup';
import * as key from './const';
import * as storage from './storageLogic';
import { addToFavorite, setFavoritesOnLoad } from './addToFavorites';
import { cards } from '..';

const newsFetch = new NewsAPI();
const refs = getRefs();

newsFetch.query = 'apple';

//listener update main page with popular news//
window.addEventListener('load', fetchByPopular);

async function fetchByPopular() {
  const docs = await newsFetch.getPopularNews();
  cards.length = 0;
  cards.push(...docs);
  let collectionByPopular = [];
  collectionByPopular = docs.map(result => {
    const { uri, section, title, abstract, published_date, url, media } =
      result;
    if (result.media[0] !== undefined) {
      imgUrl = result.media[0]['media-metadata'][2]['url'];
    } else {
      imgUrl =
        'https://www.shutterstock.com/image-photo/canadian-national-flag-overlay-false-260nw-1720481365.jpg';
    }

    let newDateFormat = published_date.split('-');
    newDateFormat = newDateFormat.join('/');

    let obj = {
      imgUrl,
      title,
      text: abstract,
      date: newDateFormat,
      url,
      categorie: section,
      id: uri,
    };
    return obj;
  });

  storage.saveToLocal(key.KEY_COLLECTION, collectionByPopular.slice(0, 9));
  categoriesOnPageLoad();
  categoriesOnResize();
}

export function categoriesOnResize() {
  window.addEventListener('resize', e => {
    let collection = storage.loadFromLocal(key.KEY_COLLECTION);
    if (e.currentTarget.innerWidth <= 768) {
      collection = collection.slice(0, 3);
    } else if (e.currentTarget.innerWidth <= 1280) {
      collection = collection.slice(0, 7);
    } else {
      collection = collection.slice(0, 8);
    }
    clear(refs.gallery);
    collectionByPopular = collection.map(renderMarkup).join(``);
    renderGallery(collectionByPopular);
    wetherRender();
  });
}

export function categoriesOnPageLoad() {
  let collection = storage.loadFromLocal(key.KEY_COLLECTION);
  let collectionByPopular;
  if (window.matchMedia('(max-width: 768px)').matches) {
    collection = collection.slice(0, 3);
  } else if (window.matchMedia('(max-width: 1280px)').matches) {
    collection = collection.slice(0, 7);
  } else {
    collection = collection.slice(0, 8);
  }
  collectionByPopular = collection.map(renderMarkup).join(``);

  renderGallery(collectionByPopular);
  wetherRender();
}

function renderGallery(markup) {
  refs.gallery.insertAdjacentHTML(`beforeend`, markup);
  refs.gallery.addEventListener('click', addToFavorite);
}

//*******renderedWether******************* */
export function wetherRender() {
  if (window.matchMedia('(min-width: 1279.98px)').matches) {
    replacedItem = refs.gallery.childNodes[1];

    const markup = renderWether();
    replacedItem.insertAdjacentHTML(`afterend`, markup);
  } else if (window.matchMedia('(min-width: 767.98px)').matches) {
    replacedItem = refs.gallery.firstElementChild;
    const markup = renderWether();
    replacedItem.insertAdjacentHTML(`afterend`, markup);
  } else {
    replacedItem = refs.gallery.firstElementChild;
    const markup = renderWether();
    replacedItem.insertAdjacentHTML(`beforebegin`, markup);
  }
}
//*********corect dateformat for the card*********** */
export function corectDate(date) {
  let newDateFormat = date.split('-');
  let maxElement = { index: length };

  newDateFormat.forEach((el, index) => {
    maxElement.index = index;
    maxElement.length = length;
  });
  newDateFormat[maxElement.index] = newDateFormat[maxElement.index].slice(0, 2);
  newDateFormat = newDateFormat.slice(0, 3);
  newDateFormat = newDateFormat.join('/');
  //   if (newDateFormat.length > 3) {
  //     newDateFormat[2] = newDateFormat[2].slice(0, 2)
  //     newDateFormat = newDateFormat.slice(0, 3);

  //  newDateFormat = newDateFormat.join('/');
  //   }
  return newDateFormat;
}
//******rendered count of outputlist*********** */
function renderedCountOfCardItem(docs) {
  if (window.matchMedia('(min-width: 1279.98px)').matches) {
    docs.length = 9;
  } else if (window.matchMedia('(min-width: 767.98px)').matches) {
    docs.length = 8;
  } else {
    docs.length = 4;
  }
}
