import { SUB } from './subFunctions.js'
/**
 * API object
 * @description object with all the endpoints necessary for the correct functioning of the web application and the functions
 */
const API = {
  trending: "https://api.giphy.com/v1/gifs/trending?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C&limit=12",
  search: "https://api.giphy.com/v1/gifs/search?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C&limit=12",
  suggestions: "https://api.giphy.com/v1/tags/related/",
  upload: "https://upload.giphy.com/v1/gifs?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C",
  Trending: Trending,
  Search: Search,
  LoadMore: LoadMore,
  Suggestion: Suggestion,
  CloseSearch: CloseSearch,
  StartFavoritesSection: StartFavoritesSection,
  SlideBar: SlideBar,
  ChangeSection: ChangeSection,
  CreateCamara: CreateCamara,
  RecordGifSteps: RecordGifSteps,
  CreateGifosTemplate: CreateGifosTemplate,
  ChanngeToDayAndNight: ChanngeToDayAndNight,
  TrendingTerms: TrendingTerms,
};
/**
 * @method Trending
 * @description function that brings and creates the trending gifs
 * @param {}
 * @returns {}
*/
function Trending(section = document.querySelector('.trendig_gifs_container'), url = API.trending) {
  fetch(url)
    .then(response => response.json())
    .then(content => {
      SUB.CreateTemplate(section, content.data)
      SUB.CreateFavEvent(section, content.data);
      SUB.MaxWindow(section, content.data);
      SUB.CreateDownload(section, content.data);
    })
    .catch(err => console.log(err));
}
/**
 * @method Search
 * @description function that receives what the user wants to search, fetch and create the results
 * @param {}
 * @returns {}
 */
function Search(searchUrl = API.search, userValue = document.querySelector('.search_text'), resultHide = document.querySelector('.search_results'), gifList = []) {
  const section = document.querySelector('.search_gifs')
  const suggestionsContainer = document.querySelector('.suggested_list');
  suggestionsContainer.querySelectorAll('div').forEach(item => {
    suggestionsContainer.removeChild(item);
  })
  section.querySelectorAll('.search_gif_result').forEach(gif => {
    section.removeChild(gif);
  })
  const url = searchUrl.concat('&q=' + userValue.value.trim())
  resultHide.querySelector('.search_gifs_name').innerHTML = 'Cargando...';
  resultHide.style.display = "flex";
  fetch(url)
    .then(response => response.json())
    .then(content => {
      gifList = content.data;
      SUB.DetectIfTHeresAnyGifInSearchSection(section, gifList);
      SUB.CreateTemplate(section, content.data);
      resultHide.querySelector('.search_gifs_name').innerHTML = userValue.value;
      SUB.CreateFavEvent(section, gifList);
      SUB.MaxWindow(section, gifList);
      SUB.CreateDownload(section, gifList);
    })
    .catch(err => console.error(err));
}
/**
 * @method LoadMore
 * @description function that load another 12 results from the giphy endpoint
 */
function LoadMore(section, button) {
  const loadMoreName = document.querySelector('.search_gifs_name').textContent;
  const url = API.search.concat(`&offset=${section.childElementCount}`).concat('&q=' + loadMoreName);
  button.innerHTML = 'Cargando...';
  fetch(url)
    .then(response => response.json())
    .then(content => {
      SUB.CreateTemplate(section, content.data);
      SUB.CreateFavEvent(section, content.data);
      SUB.MaxWindow(section, content.data);
      SUB.CreateDownload(section, content.data);
      button.innerHTML = 'ver más';
    })
    .catch(err => console.log(err));
}
/**
 * @method Suggestion
 * @description function that fetch the suggestions and shows them in the search bar
 */
function Suggestion(section, userValue) {
  const url = API.suggestions.concat(userValue.value + '?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C');
  fetch(url)
    .then(response => response.json())
    .then(content => {
      if (userValue.value.trim() !== '') {
        section.style.height = '';
      }
      SUB.OpenSearchBar(userValue.value);
      section.querySelectorAll('div').forEach(item => {
        section.removeChild(item);
      })
      content.data.forEach(sugg => {
        section.innerHTML += `<div class="suggested_item_container">
      <img src="images/icon-search.svg" alt="" class="sugg_icon">
      <p class="suggested_list_item">${sugg.name}</p>
      </div`;
        //`<li class="suggested_list_item"><img src="images/icon-search.svg" alt="" class="sugg_icon">${sugg.name}<li>`
      })
      section.querySelectorAll('.suggested_list_item').forEach(item => {
        item.addEventListener('click', () => {
          section.querySelectorAll('div').forEach(item => {
            section.removeChild(item);
          })
          userValue.value = item.textContent;
        })
      })
    })
}
/**
 * @method CloseSearch
 * @description function that close the curent results of the last search function
 * @param {}
 * @returns {}
 */
function CloseSearch(section = document.querySelector('.search_gifs'), resultHide = document.querySelector('.search_results'), value = document.querySelector('.search_text')) {
  section.querySelectorAll('.search_gif_result').forEach(gif => {
    section.removeChild(gif);
  })
  resultHide.style.display = "none";
  value.value = '';
  document.querySelector('.suggested_list').querySelectorAll('div').forEach(item => {
    document.querySelector('.suggested_list').removeChild(item);
  })
  SUB.OpenSearchBar(value.value);
  //WIP!!!
}
/**
 * @method StartFavoritesSection
 * @description function that create all the gifs in favorite section
 */
function StartFavoritesSection() {
  const favSection = document.querySelector('.fav_gifs');
  let jsonItems = JSON.parse(localStorage.getItem('gifos')) || [];
  jsonItems.map(gif => {
    if (favSection.childElementCount < 12) {
      favSection.innerHTML += `
    <div class="search_gif_result" id="${gif.id}">
    <div class="trending_card_icons">
    <div class="trending_icon">
      <i class="fas fa-times remove" id="${gif.id}"></i>
    </div>
    <div class="trending_icon">
      <img src="images/icon-download.svg" alt="" class="download_icon cards_icon" id="${gif.id}">
    </div>
    <div class="trending_icon">
      <img src="images/icon-max.svg" class="max_icon cards_icon" id="${gif.id}">
    </div>
    </div>
    <div class="trending_card_text">
      <h3>${gif.title}</h3>
    </div>
  <div class="purple_screen"></div>
  <img src="${gif.images.downsized.url}" alt="" class="home_trending_img">
  </div>`;
    }
  })
  favSection.querySelectorAll('.remove').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      SUB.RemoveGif(deleteButton.id, favSection);
    })
  })
  SUB.MaxWindow(favSection, jsonItems);
  SUB.CreateDownload(favSection, jsonItems);
  document.querySelector('.more_fav_section').addEventListener('click', () => {
    SUB.LoadMoreInFavAndMyGifos(favSection, document.querySelector('.more_fav_section'));
  })
  SUB.DetectIfTheresAnyGifInFavSection()
}
/**
 * @method SlideBar
 * @description logic behind the slide bar in the trending section
 */
function SlideBar(position) {
  if (position >= 0) return `translateX(0%)`
  if (position <= -80) return `translateX(-75%)`
  return `translateX(${position}%)`;
}
/**
 * @method ChangeSection
 * @description function that is used to change into the diferents section of the gifos web page
 */
function ChangeSection(button) {
  const sectionArray = [
    document.querySelector('.home_search'),
    document.querySelector('.home_fav'),
    document.querySelector('.home_my_gifos'),
    document.querySelector('.create_gif_section')
  ];
  sectionArray[0].id = 'homeId';
  sectionArray[1].id = 'favoritesId';
  sectionArray[2].id = 'MyGifosId';
  sectionArray[3].id = 'createGifId';
  const CreateGifosButton = document.getElementById('createGifId');
  const nightBtn = document.querySelector('.night_button');
  if(window.screen.width > 800)
  {
    sectionArray.map(section => {
      if (section.id == button.id) {
        section.style.display = "flex";
        API.CloseSearch();
        if (button == document.querySelector('#createGifId')) {
          CreateGifosButton.style.backgroundColor = "#9CAFC3";
          CreateGifosButton.style.borderColor = "#9CAFC3";
          CreateGifosButton.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = 'white';
          })
        }
      }
      else {
        section.style.display = "none";
        if (nightBtn.id == 'day') {
          CreateGifosButton.style.backgroundColor = "white";
          CreateGifosButton.style.borderColor = "#572EE5";
          CreateGifosButton.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = '#572EE5';
          })
        }
        else {
          CreateGifosButton.style.backgroundColor = "#37383C";
          CreateGifosButton.style.borderColor = "white";
          CreateGifosButton.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = 'white';
          })
        }
      }
    })
    document.querySelectorAll('.header_button').forEach(item => {
      if (item.id == button.id) {
        if (nightBtn.id == 'day') {
          button.style.color = "lightgrey";
        }
        else {
          button.style.color = "#9CAFC3";
        }
      }
      else {
        if (nightBtn.id == 'day') {
          item.style.color = "#572EE5";
        }
        else {
          item.style.color = "white";
        }
      }
    })
  }
  if(window.screen.width < 800){
    sectionArray.map(section => {
      if (section.id == button.id) {
        section.style.display = "flex";
        API.CloseSearch();
        if (button == document.querySelector('#createGifId')) {
          CreateGifosButton.style.backgroundColor = "#9CAFC3";
          CreateGifosButton.style.borderColor = "#9CAFC3";
          CreateGifosButton.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = 'white';
          })
        }
      }
      else {
        section.style.display = "none";
      }
    })
    document.querySelectorAll('.header_button').forEach(item => {
      if (item.id == button.id) {
        if (nightBtn.id == 'day') {
          button.style.color = "white";
        }
        else {
          button.style.color = "white";
        }
      }
      else {
        if (nightBtn.id == 'day') {
          item.style.color = "white";
        }
        else {
          item.style.color = "white";
        }
      }
    })
  }
}
/**
 * @method CreateCamara
 * @description function that create de camera to record your own gif
 */
function CreateCamara(button) {
  const infoText = document.querySelector('.video_text_container');
  let steps = [document.querySelector('.step1'), document.querySelector('.step2'), document.querySelector('.step3')];
  infoText.innerHTML = `<h2>¿Nos das acceso a tu cámara?</h2>
  <p>El acceso a tu camara será válido sólo</br>por el tiempo en el que estés creando el GIFO.</p>`;
  steps[0].style.backgroundColor = '#572EE5';
  steps[0].style.color = 'white';
  button.style.visibility = 'hidden';
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(webCam => {
    let video = document.querySelector('.create_gif_cam');
    video.srcObject = webCam;
    button.style.visibility = 'visible';
    button.innerHTML = 'Grabar';
    button.id = 'record';
    steps[0].style.backgroundColor = 'white';
    steps[0].style.color = '#572EE5';
    steps[1].style.backgroundColor = '#572EE5';
    steps[1].style.color = 'white';
  })
    .catch(err => console.error(err))
}
/**
 * @method RecordGifSteps
 * @description the principal logic behind the creation of your own gif
 */
async function RecordGifSteps(startButton, buttonSection) {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  let recorder = new RecordRTCPromisesHandler(stream, { type: 'gif' });
  let steps = [document.querySelector('.step1'), document.querySelector('.step2'), document.querySelector('.step3')];
  steps[0].style.backgroundColor = 'white';
  steps[0].style.color = '#572EE5';
  steps[1].style.backgroundColor = 'white';
  steps[1].style.color = '#572EE5';
  steps[2].style.backgroundColor = 'white';
  steps[2].style.color = '#572EE5';
  if (startButton.id == 'start') {
    CreateCamara(startButton);
  }
  if (startButton.id == 'record') {
    console.log('start');
    recorder.startRecording();
    buttonSection.innerHTML = `<button class="create_gif_start finish">finalizar</button>`;
    const finishButton = buttonSection.querySelector('.finish');
    finishButton.style.display = 'flex';
    finishButton.addEventListener('click', () => {
      buttonSection.innerHTML = `<button class="create_gif_start upload">SUBIR GIFO</button>`;
      const upButton = document.querySelector('.upload');
      recorder.stopRecording();
      console.log(recorder.getBlob());
      upButton.addEventListener('click', async () => {
        document.querySelector('.create_purple_screen').style.display = 'flex';
        steps[0].style.backgroundColor = 'white';
        steps[0].style.color = '#572EE5';
        steps[1].style.backgroundColor = 'white';
        steps[1].style.color = '#572EE5';
        steps[2].style.backgroundColor = '#572EE5';
        steps[2].style.color = 'white';
        upButton.style.visibility = 'hidden';
        let form = new FormData();
        let blob = await recorder.getBlob();
        form.append('file', blob, 'myGif.gif');
        const uploadGifToGiphy = fetch(API.upload, {
          method: 'POST',
          mode: 'cors',
          body: form
        })
        const content = (await uploadGifToGiphy).json();
        const data = await content;
        SaveMyGif(data.data.id);
      });
    })
  }
}
/**
 * @method SaveMyGif
 * @description function that save a gif in favorites section and locale storage
 */
async function SaveMyGif(id) {
  const getGif = await fetch('https://api.giphy.com/v1/gifs/' + id + '?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C');
  const response = await getGif.json();
  const content = await response;
  let myGifsStorage = JSON.parse(localStorage.getItem('myOwnGifos')) || [];
  myGifsStorage.push(content.data);
  localStorage.setItem('myOwnGifos', JSON.stringify(myGifsStorage));
  CreateGifAfterSteps(content.data)
  document.querySelector('.create_purple_screen').innerHTML = `<img src="images/success-svgrepo-com.svg" alt="">
  <p>GIFO subido con éxito</p>`;
}
/**
 * @method CreateGifAfterSteps
 * @description function that create the template in my gifos section after your gif is done in create my gifo section
 */
function CreateGifAfterSteps(gif) {
  const MyGifosSection = document.querySelector('.my_gifos_results');
  let myGifsStorage = JSON.parse(localStorage.getItem('myOwnGifos')) || [];
  MyGifosSection.innerHTML += `
  <div class="search_gif_result" id="${gif.id}">
  <div class="trending_card_icons">
  <div class="trending_icon">
    <i class="fas fa-times remove" id="${gif.id}"></i>
  </div>
  <div class="trending_icon">
    <img src="images/icon-download.svg" alt="" class="download_icon cards_icon" id="${gif.id}">
  </div>
  <div class="trending_icon">
    <img src="images/icon-max.svg" class="max_icon cards_icon" id="${gif.id}">
  </div>
  </div>
  <div class="trending_card_text">
    <h3>${gif.title}</h3>
  </div>
<div class="purple_screen"></div>
<img src="${gif.images.downsized.url}" alt="" class="home_trending_img">
</div>`;
  SUB.DetectIfTheresAnyGidInMyGifoSection();
  MyGifosSection.querySelectorAll('.remove').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      SUB.RemoveGif(deleteButton.id, MyGifosSection);
    })
  })
  SUB.MaxWindow(MyGifosSection, myGifsStorage);
  SUB.CreateDownload(MyGifosSection, myGifsStorage);
  const buttonSection = document.querySelector('.create_buttons_container');
  buttonSection.innerHTML = `<button class="create_gif_start restar" id="start">Crear nuevo</button>`;
  const newGiftButton = document.querySelector('.restar');
  newGiftButton.addEventListener('click', async () => {
    document.querySelector('.create_purple_screen').style.display = 'none';
    document.querySelector('.create_purple_screen').innerHTML = `<img src="images/loading.svg" alt="" class="loading">
    <p>Estamos subiendo tu GIFO</p>`;
    API.RecordGifSteps(newGiftButton, buttonSection)
  })
}
/**
 * @method CreateGifosTemplate
 * @description function that create the template in search and trending section
 */
function CreateGifosTemplate() {
  let myGifsStorage = JSON.parse(localStorage.getItem('myOwnGifos')) || [];
  const MyGifosSection = document.querySelector('.my_gifos_results');
  myGifsStorage.map(gif => {
    MyGifosSection.innerHTML += `
    <div class="search_gif_result" id="${gif.id}">
    <div class="trending_card_icons">
    <div class="trending_icon">
      <i class="fas fa-times remove" id="${gif.id}"></i>
    </div>
    <div class="trending_icon">
      <img src="images/icon-download.svg" alt="" class="download_icon cards_icon" id="${gif.id}">
    </div>
    <div class="trending_icon">
      <img src="images/icon-max.svg" class="max_icon cards_icon" id="${gif.id}">
    </div>
    </div>
    <div class="trending_card_text">
      <h3>${gif.title}</h3>
    </div>
  <div class="purple_screen"></div>
  <img src="${gif.images.downsized.url}" alt="" class="home_trending_img">
  </div>`;
  })
  MyGifosSection.querySelectorAll('.remove').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      SUB.RemoveGif(deleteButton.id, MyGifosSection);
    })
  })
  SUB.MaxWindow(MyGifosSection, myGifsStorage);
  SUB.CreateDownload(MyGifosSection, myGifsStorage);
  document.querySelector('.more_my_gifos').addEventListener('click', () => {
    SUB.LoadMoreInFavAndMyGifos(MyGifosSection, document.querySelector('.more_my_gifos'));
  })
  SUB.DetectIfTheresAnyGidInMyGifoSection();
}
/**
 * @method ChanngeToDayAndNight
 * @description day and night button logic
 */
function ChanngeToDayAndNight(darkButton) {
  const sectionArray = [
    document.querySelector('.home_search'),
    document.querySelector('.home_fav'),
    document.querySelector('.home_my_gifos'),
    document.querySelector('.create_gif_section')
  ];
  const CreateGifosButton = document.getElementById('createGifId');
  if(window.screen.width > 800){
    document.querySelectorAll('.header_button').forEach(button => {
      if (darkButton.id == 'day') {
        button.style.color = '#572EE5';
        CreateGifosButton.style.backgroundColor = "white";
          CreateGifosButton.style.borderColor = "#572EE5";
          CreateGifosButton.querySelectorAll('div').forEach(div => {
            div.style.backgroundColor = '#572EE5';
          })
      }
      else {
        button.style.color = 'white';
        CreateGifosButton.style.backgroundColor = "#37383C";
        CreateGifosButton.style.borderColor = "white";
        CreateGifosButton.querySelectorAll('div').forEach(div => {
          div.style.backgroundColor = 'white';
        })
      }
    })
  
    sectionArray.forEach(section => {
      if (section.id == 'homeId') {
        section.style.display = 'flex';
      }
      else {
        section.style.display = 'none';
      }
    })
  }
  if(window.screen.width < 800){
    document.querySelectorAll('.header_button').forEach(button => {
      if (darkButton.id == 'day') {
        button.style.color = 'white';
        button.style.borderColor = 'transparent';
        darkButton.style.borderColor = 'transparent';
      }
      else {
        button.style.color = 'white';
        button.style.borderColor = 'transparent';
        darkButton.style.borderColor = 'transparent';
      }
    })
    sectionArray.forEach(section => {
      if (section.id == 'homeId') {
        section.style.display = 'flex';
      }
      else {
        section.style.display = 'none';
      }
    })
  }
}
/**
 * @method TrendingTerms
 * @description logic behind the trending terms
 */
async function TrendingTerms(){
  const userValue = document.querySelector('.search_text');
  const terms = await fetch('https://api.giphy.com/v1/trending/searches?api_key=FLYCbnE9HCzy3AOD5rgrUXif2pMomG9C');
  const items = await terms.json();
  const content = await items;
  const section = document.querySelector('.search_trending_terms');
  for(let i = 0; i < 7; i++){
    section.innerHTML += `<li class="search_term_item">${content.data[i]}</li>`;
  }
  document.querySelectorAll('.search_term_item').forEach(item => {
    item.addEventListener('click', () => {
      userValue.value = item.innerHTML;
      SUB.OpenSearchBar(userValue.value);
      Search();
    })
  })
}
/**
 * exports
 */
export { API };