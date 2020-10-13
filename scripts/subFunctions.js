/**
 * @method DownloadFunction
 * @description logic behind download button
 */
function DownloadFunction(id, gifList) {
  gifList.forEach(gif => {
    if (id == gif.id) {
      const a = document.createElement("a");
      document.querySelector('body').appendChild(a);
      const myRequest = new Request(gif.images.original.url);
      fetch(myRequest)
        .then((response) => response.blob())
        .then(function (myBlob) {
          const objectURL = URL.createObjectURL(myBlob);
          a.href = objectURL;
          a.download = gif.title + ".gif";
          a.click();
          a.remove();
        });
    }
  })
}
/**
 * @method CreateDownload
 * @description function that gifs to download button the logic behind itself
 */
function CreateDownload(section, gifList) {
  section.querySelectorAll('.download_icon').forEach(downItem => {
    downItem.addEventListener('click', () => {
      DownloadFunction(downItem.id, gifList);
    })
  })
}
/**
 * @method MaxWindowAddGif
 * @description function that gives the logic to maxwindow
 */
function MaxWindowAddGif(id, gifList) {
  const section = document.querySelector('.gif_max');
  const gifImg = section.querySelector('.max_gif_item');
  const gifTitle = section.querySelector('.gif_max_title');
  const gifsContainer = section.querySelector('.max_icons_container');
  gifsContainer.innerHTML = `<img src="images/icon-fav-hover.svg" alt="" class="max_icon fav_max">
    <img src="images/icon-download.svg" alt="" class="max_icon download_icon">`;
  const gifFavButton = gifsContainer.querySelector('.fav_max');
  const gifmaxButton = gifsContainer.querySelector('.download_icon');
  let favGifsStorage = JSON.parse(localStorage.getItem('gifos')) || [];
  favGifsStorage.forEach(fav => {
    if (fav.id == id) {
      gifFavButton.src = 'images/icon-fav-active.svg';
    }
  })
  gifList.forEach(gif => {
    if (id == gif.id) {
      gifImg.src = gif.images.downsized.url;
      gifTitle.innerHTML = gif.title;
      gifmaxButton.addEventListener('click', () => {
        DownloadFunction(id, gifList);
      })
      gifFavButton.addEventListener('click', () => {
        let favGifsStorage = JSON.parse(localStorage.getItem('gifos')) || [];
        if (favGifsStorage[0] == undefined) {
          gifFavButton.src = 'images/icon-fav-active.svg';
          Favorites(id, gifList);
          document.querySelectorAll('.fav_icon').forEach(fav => {
            if (id == fav.id) {
              fav.src = 'images/icon-fav-active.svg';
            }
          })
        }
        else {
          for (let i = 0; i < favGifsStorage.length; i++) {
            if (id == favGifsStorage[i].id) {
              alert('este gif ya se encuentra en favoritos');
              break
            }
            if (i == favGifsStorage.length - 1) {
              gifFavButton.src = 'images/icon-fav-active.svg';
              Favorites(id, gifList);
              document.querySelectorAll('.fav_icon').forEach(fav => {
                if (id == fav.id) {
                  fav.src = 'images/icon-fav-active.svg';
                }
              })
              break
            }
          }
        }
      })
    }
  })
}
/**
 * @method MaxWindow
 * @description logic for max button
 */
function MaxWindow(section, gifList) {
  const maxSection = document.querySelector('.gif_max');
  section.querySelectorAll('.max_icon').forEach(maxGif => {
    maxGif.addEventListener('click', () => {
      maxSection.style.display = 'flex';
      MaxWindowAddGif(maxGif.id, gifList);
    })
  })
}
/**
 * @method OpenSearchBar
 * @description function that detect the value of search bar and change the css
 */
function OpenSearchBar(value) {
  const xButton = document.getElementById('close');
  const defaultButton = document.getElementById('default');
  const searchButtonAfterX = document.getElementById('searchAfter');
  if (value !== '') {
    defaultButton.style.display = 'none';
    xButton.style.display = 'inline-block';
    searchButtonAfterX.style.display = 'inline-block';
  }
  else {
    defaultButton.style.display = 'inline-block';
    xButton.style.display = 'none';
    searchButtonAfterX.style.display = 'none';
  }
}
/**
 * @method FavIconActive
 * @description function that change the img url depending on the status of the gif in favorites
 */
function FavIconActive(gif) {
  const arrayFav = JSON.parse(localStorage.getItem('gifos')) || [];
  let text = 'images/icon-fav-hover.svg';
  for (let i = 0; i < arrayFav.length; i++) {
    if (arrayFav[i].id == gif.id) {
      text = 'images/icon-fav-active.svg';
      break
    }
  }
  return text
}
/**
 * @method DetectIfTheresAnyGifInFavSection
 */
function DetectIfTheresAnyGifInFavSection() {
  const favGifsStorage = JSON.parse(localStorage.getItem('gifos')) || [];
  if (document.querySelector('.fav_gifs').childElementCount !== 0) {
    document.querySelector('.fav_no_results').style.display = 'none';
    document.querySelector('.more_fav_section').style.visibility = 'hidden';
    if(favGifsStorage.length > 12){
      document.querySelector('.more_fav_section').style.visibility = 'visible';
    }
  }
  else {
    document.querySelector('.fav_no_results').style.display = 'flex';
    document.querySelector('.more_fav_section').style.visibility = 'hidden';
  }
}
/**
 * @method RemoveGif
 */
function RemoveGif(id, section) {
  let gifsArray = JSON.parse(localStorage.getItem(section == document.querySelector('.my_gifos_results') ? 'myOwnGifos' : 'gifos')) || [];
  gifsArray.map(gif => {
    if (gif.id === id) {
      gifsArray.splice(gif, 1);
      localStorage.setItem(section == document.querySelector('.my_gifos_results') ? 'myOwnGifos' : 'gifos', JSON.stringify(gifsArray));
    }
    section.querySelectorAll('.search_gif_result').forEach(gif => {
      if (gif.id === id) {
        gif.parentNode.removeChild(gif);
      }
    })
    if (section !== document.querySelector('.my_gifos_results')) {
      DetectIfTheresAnyGifInFavSection();
      changefavWhenisremoveIntrending(id);
    }
    else {
      DetectIfTheresAnyGidInMyGifoSection()
    }
  });
}
/**
 * @method DetectIfTheresAnyGidInMyGifoSection
 */
function DetectIfTheresAnyGidInMyGifoSection() {
  const myOwnGifosStorage = JSON.parse(localStorage.getItem('myOwnGifos')) || [];
  if (document.querySelector('.my_gifos_results').childElementCount !== 0) {
    document.querySelector('.my_gif_no_results').style.display = 'none';
    document.querySelector('.more_my_gifos').style.visibility = 'hidden';
    if(myOwnGifosStorage.length > 12){
      document.querySelector('.more_my_gifos').style.visibility = 'visible';
    }
  }
  else {
    document.querySelector('.my_gif_no_results').style.display = 'flex';
    document.querySelector('.more_my_gifos').style.visibility = 'hidden';
  }
}
/**
 * @method CreateFavEvent
 */
function CreateFavEvent(section, gifList) {
  section.querySelectorAll('.fav_icon').forEach(fav => {
    fav.addEventListener('click', () => {
      let favGifsStorage = JSON.parse(localStorage.getItem('gifos')) || [];
      if (favGifsStorage[0] == undefined) {
        fav.src = 'images/icon-fav-active.svg';
        Favorites(fav.id, gifList);
      }
      else {
        for (let i = 0; i < favGifsStorage.length; i++) {
          if (fav.id == favGifsStorage[i].id) {
            alert('este gif ya se encuentra en favoritos');
            break
          }
          console.log(favGifsStorage.length - 1)
          if (i == favGifsStorage.length - 1) {
            fav.src = 'images/icon-fav-active.svg';
            Favorites(fav.id, gifList);
            break
          }
        }
      }
      //fav.src = 'images/icon-fav-active.svg';
      //Favorites(fav.id, gifList);
      //tratar mirando si el primer item de el array es undefind que ejecute si no que haga la comprobacion con el for
    });
  })
}
/**
 * @method Favorites
 * @description WIP
 */
function Favorites(id, gifList) {
  gifList.forEach(gif => {
    if (gif.id == id) {
      if (document.querySelector('.fav_gifs').childElementCount < 12) {
        document.querySelector('.fav_gifs').innerHTML += `
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
      let favGifsStorage = JSON.parse(localStorage.getItem('gifos')) || [];
      favGifsStorage.push(gif);
      localStorage.setItem('gifos', JSON.stringify(favGifsStorage));
    }
  })
  document.querySelector('.fav_gifs').querySelectorAll('.remove').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      RemoveGif(deleteButton.id, document.querySelector('.fav_gifs'));
    })
  })
  DetectIfTheresAnyGifInFavSection()
  MaxWindow(document.querySelector('.fav_gifs'), gifList);
  CreateDownload(document.querySelector('.fav_gifs'), gifList);
}
/**
 * @method CreateTemplate
 * @description function that creates the results used in the functions that need to create a template
 * @param {}
 * @returns {}
 */
function CreateTemplate(section, jsonItem) {
  let gifClassContainer = section === document.querySelector('.search_gifs') ? 'search_gif_result' : 'home_trending_gifs_card';
  const arrayFav = JSON.parse(localStorage.getItem('gifos')) || [];
  jsonItem.map(gif => {
    let favIcon = FavIconActive(gif);
    section.innerHTML += `
        <div class="${gifClassContainer}">
        <div class="trending_card_icons">
        <div class="trending_icon">
            <img src="${favIcon}" alt="favorites icon" class="fav_icon cards_icon" id="${gif.id}">
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
  if (section === document.querySelector('.search_gifs')) {
    if (section.childElementCount < 12) {
      document.querySelector('.loadButonSeach').style.visibility = 'hidden';
    }
    else {
      document.querySelector('.loadButonSeach').style.visibility = 'visible';
    }
  }
}
/**
 * @method DetectIfTHeresAnyGifInSearchSection
 */
function DetectIfTHeresAnyGifInSearchSection(section, gifList) {
  const loadMoreButton = document.querySelector('.search_more');
  if (gifList.length == 0) {
    section.innerHTML = `
    <div class="no_gifs_in_search">
      <img src="images/sinBusqueda.svg">
      <p class="no_gifs_title">Intenta con otra búsqueda.</p>
    </div>
    `;
    loadMoreButton.style.visibility = 'hidden';
  }
  else {
    section.innerHTML = '';
    loadMoreButton.style.visibility = 'visible';
  }
}
/**
 * @method changefavWhenisremoveIntrending
 */
function changefavWhenisremoveIntrending(id) {
  const section = document.querySelector('.trendig_gifs_container');
  section.querySelectorAll('.fav_icon').forEach(fav => {
    if (fav.id == id) {
      fav.src = 'images/icon-fav-hover.svg';
    }
  })
}
/**
 * @method LoadMoreInFavAndMyGifos
 */
function LoadMoreInFavAndMyGifos(section, button) {
  let arrayStorage = JSON.parse(localStorage.getItem(section == document.querySelector('.my_gifos_results') ? 'myOwnGifos' : 'gifos')) || []
  let count = 0;
  button.innerHTML = 'cargando...';
  arrayStorage.forEach(gif => {
    count++
    if (count > section.childElementCount) {
      if (section == document.querySelector('.my_gifos_results')) {
        section.innerHTML += `
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
      else{
        section.innerHTML += `
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
      
    }
  })
  button.innerHTML = 'refrescar';
  section.querySelectorAll('.remove').forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      RemoveGif(deleteButton.id, section);
    })
  })
  MaxWindow(section, arrayStorage);
  CreateDownload(section, arrayStorage);
  DetectIfTheresAnyGidInMyGifoSection();
}
/**
 * Import object
 */
const SUB = {
  CreateTemplate: CreateTemplate,
  Favorites: Favorites,
  CreateFavEvent: CreateFavEvent,
  RemoveGif: RemoveGif,
  DetectIfTheresAnyGifInFavSection: DetectIfTheresAnyGifInFavSection,
  FavIconActive: FavIconActive,
  OpenSearchBar: OpenSearchBar,
  MaxWindow: MaxWindow,
  MaxWindowAddGif: MaxWindowAddGif,
  CreateDownload: CreateDownload,
  DownloadFunction: DownloadFunction,
  DetectIfTHeresAnyGifInSearchSection: DetectIfTHeresAnyGifInSearchSection,
  changefavWhenisremoveIntrending: changefavWhenisremoveIntrending,
  DetectIfTheresAnyGidInMyGifoSection: DetectIfTheresAnyGidInMyGifoSection,
  LoadMoreInFavAndMyGifos : LoadMoreInFavAndMyGifos,
}

export { SUB };