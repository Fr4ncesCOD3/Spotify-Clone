const updateAlbumCover = (album) => {
  // Ottieni il contenitore dove visualizzare l'album
  const albumContainer = document.getElementById("album-cover");

  // Crea e aggiorna il contenuto HTML per l'album
  const albumElement = `
      <div class="row mt-4 align-items-center d-lg-flex flex-lg-nowrap ">
          <div class="col-2 d-md-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left text-white" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
          </div>

          <div class="col-12 col-lg-3 text-center text-lg-start">
              <img src="${album.cover_medium}" alt="${album.title}" class="img-fluid" >
          </div>
          <div class="col-12 col-lg-10 text-lg-start ">

          <h3 class="text-white mt-3">${album.title}</h3>
          <div class="d-flex  justify-content-lg-start align-items-center mt-3">
              <img src="${album.artist.picture_small}" alt="${album.artist.name}" class="rounded-circle" style="width:30px;">
               <div class=" h6 text-white ms-2 mb-0">${album.artist.name}</div>
          </div>
         
          <div class="h6 text-white-50 mt-2">Album • ${new Date(album.release_date).getFullYear()}</div>
      </div>
      </div>
  `;
  
  // Inserisci l'elemento nell'HTML
  albumContainer.innerHTML = albumElement;
};

// Funzione per ottenere un album specifico
const fetchAlbum = async (albumId) => {
  try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
      const albumData = await response.json();
      updateAlbumCover(albumData); // Visualizza solo l'album selezionato
      fetchAlbums(albumData.artist.id);
  } catch (error) {
      console.error("Errore nel recupero dell'album:", error);
  }
};

// Chiamata per visualizzare un album specifico, sostituisci "302127" con l'ID dell'album che desideri


const fetchSongs = async (albumId) => {
  try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
      const data = await response.json();
      
      if (!data.tracks || data.tracks.data.length === 0) {
          console.log(`Canzoni per "${albumId}" non trovate`);
          return;
      }
      console.log(data.tracks.data);
      const allSongs = data.tracks.data;
      const songsList = document.getElementById('songs-list');
      songsList.innerHTML = '';
      
      allSongs.forEach((song, index) => {
          const songElement = `
              <div class="song-item d-flex align-items-center justify-content-between py-2 px-3" data-song='${JSON.stringify(song)}'>
                  <div class="d-flex align-items-center song-main-info">
                      <span class="song-number text-secondary me-3">${index + 1}</span>
                      <img src="${song.album.cover_small}" alt="${song.title}" class="song-cover me-3">
                      <div class="song-info">
                          <div class="song-title text-white mb-1">${song.title}</div>
                          <div class="song-streams text-secondary">${formatNumber(song.rank)}</div>
                      </div>
                  </div>
                  <div class="song-duration text-secondary ms-2">
                      ${formatDuration(song.duration)}
                  </div>
              </div>
          `;
          songsList.innerHTML += songElement;
      });

      // Aggiungi event listener per il click sulle canzoni
      document.querySelectorAll('.song-item').forEach(item => {
          item.addEventListener('click', function() {
              const song = JSON.parse(this.dataset.song);
              updateFooterTrackInfo(song);
          });
      });

      // Imposta la prima canzone come default nel footer
      if (allSongs.length > 0) {
          updateFooterTrackInfo(allSongs[0]);
      }
      
      return data.data;
      
  } catch (error) {
      console.log(`Errore nella ricerca delle canzoni:`, error);
  }
  
};
const formatNumber = (number) => {
    if (number >= 1000000) {
        return Math.floor(number / 1000000) + '.' + Math.floor((number % 1000000) / 100000) + 'M';
    }
    return number.toLocaleString();
};

// Funzione per formattare la durata
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
const fetchAlbums = async (artistId) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`);
        const data = await response.json();
        
        const albumList = document.getElementById('album-list');
        albumList.innerHTML = '';
        
        data.data.forEach(album => {
            const albumElement = `
                <div class="album-item">
                    <div class="album-cover-container">
                        <img src="${album.cover_medium}" alt="${album.title}" class="album-cover">
                    </div>
                    <div class="album-title text-white text-truncate">${album.title}</div>
                    <!-- data di rilascio dell'album, Date serve per ottenere l'anno dalla data-->
                    <div class="album-year text-secondary">${new Date(album.release_date).getFullYear()}</div>
                </div>
            `;
            albumList.innerHTML += albumElement;
        });
        
    } catch (error) {
        console.log('Errore nel recupero degli album:', error);
    }
};
const updateFooterTrackInfo = (song) => {
    const trackImg = document.getElementById('current-track-img');
    const trackTitle = document.getElementById('current-track-title');
    
    if (song) {
        trackImg.src = song.album.cover_small;
        trackTitle.textContent = song.title;
        
        // Aggiungi classe per animazione fade
        trackImg.classList.add('fade-in');
        trackTitle.classList.add('fade-in');
        
        // Rimuovi classe dopo animazione
        setTimeout(() => {
            trackImg.classList.remove('fade-in');
            trackTitle.classList.remove('fade-in');
        }, 500);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    // Previeni il bounce dello scroll su iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.main-container')) {
            e.stopPropagation();
        }
    }, { passive: true });

    // Gestisci la visibilità del footer durante lo scroll
    let lastScroll = 0;
    const footer = document.querySelector('footer');
    
    /*
    document.querySelector('.main-container').addEventListener('scroll', function(e) {
        const currentScroll = this.scrollTop;
        
        // Nascondi/mostra footer in base alla direzione dello scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            footer.style.transform = 'translateY(100%)';
            footer.style.transition = 'transform 0.3s ease';
        } else {
            footer.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    */

    // Logica per il tasto cerca
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        searchToggle.classList.toggle('d-none');
        searchInput.classList.toggle('d-none');
        searchInput.focus();
    });

    // event listener al document per rilevare i clic al di fuori dell'input di ricerca e dei risultati
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !searchToggle.contains(event.target) && !searchResults.contains(event.target)) {
            searchInput.classList.add('d-none');
            searchToggle.classList.remove('d-none');
            searchResults.innerHTML = '';
        }
    });

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value.trim();
        if (query.length > 2) {
            try {
                const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`);
                const data = await response.json();
                displaySearchResults(data.data);
            } catch (error) {
                console.error('Errore nella ricerca delle canzoni:', error);
            }
        } else {
            searchResults.innerHTML = '';
        }
    });

    const displaySearchResults = (songs) => {
        searchResults.innerHTML = '';
        
        // Crea un Set per tenere traccia degli artisti unici
        const uniqueArtists = new Set();
        
        // Aggiungi prima gli artisti
        songs.forEach(song => {
            uniqueArtists.add(JSON.stringify({
                id: song.artist.id,
                name: song.artist.name,
                picture_xl: song.artist.picture_xl // Aggiungi l'immagine dell'artista
            }));
        });
        
        // Crea i bottoni degli artisti
        uniqueArtists.forEach(artistJson => {
            const artist = JSON.parse(artistJson);
            const artistItem = document.createElement('div');
            artistItem.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
            artistItem.innerHTML = `
                <i class="bi bi-person-circle text-secondary"></i>
                <div class="d-flex flex-column">
                    <span class="text-white">${artist.name}</span>
                    <small class="text-secondary">Artista</small>
                </div>
            `;
            
            // Aggiungi event listener per il click sull'artista
            artistItem.addEventListener('click', async () => {
                // Aggiorna la pagina con il nuovo artista
                await fetchArtist(artist.name);
                // Pulisci e nascondi la ricerca
                searchInput.value = '';
                searchInput.classList.add('d-none');
                searchToggle.classList.remove('d-none');
                searchResults.innerHTML = '';
            });
            
            searchResults.appendChild(artistItem);
        });
        
        // Aggiungi un separatore se ci sono sia artisti che canzoni
        if (uniqueArtists.size > 0 && songs.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'list-group-item disabled text-secondary small';
            separator.textContent = 'Brani';
            searchResults.appendChild(separator);
        }
        
        // Aggiungi le canzoni
        songs.forEach(song => {
            const songItem = document.createElement('div');
            songItem.className = 'list-group-item list-group-item-action d-flex align-items-center gap-2';
            songItem.innerHTML = `
                <img src="${song.album.cover_small}" alt="" style="width: 32px; height: 32px;">
                <div class="d-flex flex-column">
                    <span class="text-white">${song.title}</span>
                    <small class="text-secondary">${song.artist.name}</small>
                </div>
            `;
            searchResults.appendChild(songItem);
        });
    };
});





const idAlbum = "75621062"

fetchAlbum(idAlbum);
fetchSongs(idAlbum);
fetchAlbums("13");
