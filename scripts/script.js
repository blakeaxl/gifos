/**
 * imports
 */
import { API } from './api.js';
/**
 * trending Logic
 */
API.Trending();
/**
 * search gifs logic
 */
const searchButton = document.querySelector('.search_button');
searchButton.addEventListener('click', () => { API.Search(); });
/**
 * Load More button logic
 */
const loadMoreButton = document.querySelector('.loadButonSeach');
loadMoreButton.addEventListener('click', () => {
  API.LoadMore(document.querySelector('.search_gifs'), loadMoreButton);
});
/**
 * suggestions logic
 */
document.querySelector('.search_text').addEventListener('keydown', () => {
  API.Suggestion(document.querySelector('.suggested_list'), document.querySelector('.search_text'))
})
const xButton = document.getElementById('close');
xButton.addEventListener('click', () => {
  API.CloseSearch(document.querySelector('.search_gifs'), document.querySelector('.search_results'), document.querySelector('.search_text'))
})
/**
 * header buttons logic
 */
document.querySelectorAll('.header_button').forEach(button => {
  button.addEventListener('click', () => {
    API.ChangeSection(button);
  })
})
/**
 * Close Max window
 */
const closeMaxButton = document.querySelector('.max_close');
closeMaxButton.addEventListener('click', () => {
  const maxSection = document.querySelector('.gif_max');
  maxSection.style.display = 'none';
})
/**
 * SlideBar Logic
 */
const nextButton = document.querySelector('.next_trending');
const backButton = document.querySelector('.back_trending');
const sliderContainer = document.querySelector('.trendig_gifs_container');
let position = 0;
nextButton.addEventListener('click', () => {
  if(position <= -80)
  {
    position = -75
  }
  else
  {
    position = position - 20;
  }
  sliderContainer.style.transform = API.SlideBar(position);
})
backButton.addEventListener('click', () => {
  if(position >= 0)
  {
    position = 0;
  }
  else
  {
    position = position + 20;
  }
  sliderContainer.style.transform = API.SlideBar(position);
})
/**
 * Create Gif logic
 */
const startButton = document.querySelector('.create_gif_start');
const buttonSection = document.querySelector('.create_buttons_container');
startButton.addEventListener('click', async () => {API.RecordGifSteps(startButton, buttonSection)})
/**
 * dark mode
 */
const darkModeBtn = document.querySelector('.night_button');
darkModeBtn.addEventListener('click', () => {
  document.querySelector('.home_search').id = 'homeId';
  if(darkModeBtn.id == 'day')
  {
    darkModeBtn.innerHTML = 'MODO DIURNO';
    darkModeBtn.id = 'night';
    document.querySelector('.home_header_logo').src = 'images/logo-desktop-modo-noc.svg';
    document.querySelector('.cam').src = 'images/camara-modo-noc.svg';
    document.querySelector('.film').src = 'images/pelicula-modo-noc.svg';
  }
  else
  {
    darkModeBtn.innerHTML = 'MODO NOCTURNO'
    darkModeBtn.id = 'day';
    document.querySelector('.home_header_logo').src = 'images/logo-desktop.svg'
    document.querySelector('.cam').src = 'images/camara.svg';
    document.querySelector('.film').src = 'images/pelicula.svg';
  }
  document.body.classList.toggle('dark');
  API.ChanngeToDayAndNight(darkModeBtn);
})
/**
 * Trending terms logic
 */
API.TrendingTerms()
/**
 * hamburger menu
 */
const hamburgerBtn = document.querySelector('.hamburguer_menu');
hamburgerBtn.addEventListener('click', () => {
  document.querySelector('.home_header_nav_list').classList.toggle('menu_toggle');
  document.querySelector('.l1').classList.toggle('menu_l1');
  document.querySelector('.l2').classList.toggle('menu_l2');
  document.querySelector('.l3').classList.toggle('menu_l3');
})
/**
 * Favorites and my gifos logic
 */
API.StartFavoritesSection();
API.CreateGifosTemplate();

