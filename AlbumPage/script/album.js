// Variabili globali per gestire la riproduzione
let currentTrack = null;
let isPlaying = false;

// Elementi del DOM per il player nel footer
const audioPlayer = document.getElementById('audioPlayer');
const footerPlayButton = document.querySelector('.player-controls i');
const currentTrackImg = document.getElementById('current-track-img');
const currentTrackTitle = document.getElementById('current-track-title');
const currentTrackArtist = document.getElementById('current-track-artist');

// Funzione debounce
// serve per limitare il numero di richieste al server
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Toggle della barra di ricerca
// serve per mostrare e nascondere la barra di ricerca
document.addEventListener('DOMContentLoaded', () => {
  const searchToggle = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.search-container');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  searchToggle.addEventListener('click', () => {
    searchContainer.classList.toggle('d-none');
    if (!searchContainer.classList.contains('d-none')) {
      searchInput.focus();
    }
  });

  // Gestione della ricerca
  searchInput.addEventListener('input', debounce(async (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length > 1) {
      try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${searchTerm}`);
        const data = await response.json();
        
        // Separa i risultati in brani e artisti
        const songs = data.data.slice(0, 4);
        const artists = [...new Map(data.data.map(item => [item.artist.id, item.artist])).values()].slice(0, 3);
        
        // Visualizza i risultati divisi in sezioni
        searchResults.innerHTML = `
          <div class="search-section">
            <div class="search-category-title text-secondary px-3 py-2">Brani</div>
            ${songs.map(song => `
              <div class="list-group-item bg-dark border-0 py-2 search-result song-result"
                   data-track-id="${song.id}"
                   data-title="${song.title.replace(/"/g, '&quot;')}"
                   data-artist="${song.artist.name.replace(/"/g, '&quot;')}"
                   data-preview="${song.preview}"
                   data-cover="${song.album.cover_small}"
                   onclick="playSong('${song.id}', '${song.title.replace(/'/g, "\\'")}', '${song.artist.name.replace(/'/g, "\\'")}', '${song.preview}', '${song.album.cover_small}')">
                <div class="d-flex align-items-center">
                  <img src="${song.album.cover_small}" alt="" class="me-3" style="width: 40px; height: 40px;">
                  <div>
                    <div class="text-white">${song.title}</div>
                    <div class="text-secondary small">${song.artist.name}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="search-section mt-2">
            <div class="search-category-title text-secondary px-3 py-2">Artisti</div>
            ${artists.map(artist => `
              <div class="list-group-item bg-dark border-0 py-2 search-result artist-result"
                   data-artist-id="${artist.id}"
                   onclick="openArtistPage(${artist.id})">
                <div class="d-flex align-items-center">
                  <img src="${artist.picture_small}" alt="" class="me-3 rounded-circle" style="width: 40px; height: 40px;">
                  <div>
                    <div class="text-white">${artist.name}</div>
                    <div class="text-secondary small">Artista</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } catch (error) {
        console.log('Errore nel recupero dei dati:', error);
      }
    } else {
      searchResults.innerHTML = '';
    }
  }, 300));
});

// Funzione per caricare i dati dell'album all'avvio
async function loadAlbumData() {
  const albumId = localStorage.getItem('currentAlbumId');
  if (!albumId) return;

  try {
    const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`);
    const albumData = await response.json();
    
    // Aggiorna la copertina dell'album
    updateAlbumCover(albumData);
    // Aggiorna la lista delle canzoni
    updateSongsList(albumData.tracks.data);
    // Carica gli album correlati dell'artista
    await fetchAlbums(albumData.artist.id);
  } catch (error) {
    console.error('Errore nel caricamento dell\'album:', error);
  }
}

// Funzione per aggiornare la copertina dell'album
function updateAlbumCover(albumData) {
  const albumCover = document.getElementById('album-cover');
  albumCover.innerHTML = `
    <div class="d-flex flex-column align-items-center">
      <img src="${albumData.cover_medium}" alt="${albumData.title}" class="img-fluid rounded-3" style="width: 300px;">
      <h2 class="text-white mt-3">${albumData.title}</h2>
      <p class="text-secondary">${albumData.artist.name}</p>
    </div>
  `;
}

// Funzione per aggiornare la lista delle canzoni
function updateSongsList(songs) {
  const songsList = document.getElementById('songs-list');
  songsList.innerHTML = `
    <table class="table table-dark table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Titolo</th>
          <th scope="col">Durata</th>
        </tr>
      </thead>
      <tbody>
        ${songs.map((song, index) => `
          <tr class="song-item" onclick="playSong('${song.id}', '${song.title.replace(/'/g, "\\'")}', '${song.artist.name.replace(/'/g, "\\'")}', '${song.preview}', '${song.album.cover_small}')">
            <th scope="row">${index + 1}</th>
            <td>${song.title}</td>
            <td>${formatDuration(song.duration)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Funzione per formattare la durata in minuti e secondi
function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Funzione per fetch degli album correlati (carosello)
const fetchAlbums = async (artistId) => {
  try {
    const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`);
    const data = await response.json();
    
    const albumList = document.getElementById('album-list');
    
    if (!data.data || data.data.length === 0) {
      console.log('Nessun album trovato per questo artista');
      return;
    }

    // Crea il carosello di album
    albumList.innerHTML = data.data.map(album => `
      <div class="album-item mx-2" style="min-width: 200px; cursor: pointer;" onclick="openAlbumPage('${album.id}')">
        <div class="album-cover-container position-relative">
          <img src="${album.cover_medium}" alt="${album.title}" class="img-fluid rounded-3">
          <div class="play-overlay position-absolute top-50 start-50 translate-middle d-none">
            <i class="bi bi-play-circle-fill text-success fs-1"></i>
          </div>
        </div>
        <div class="album-info mt-2 text-white">
          <div class="album-title text-truncate">${album.title}</div>
          <div class="album-year text-secondary">${new Date(album.release_date).getFullYear()}</div>
        </div>
      </div>
    `).join('');

    // Aggiungi effetti hover
    const items = document.querySelectorAll('.album-item');
    items.forEach(item => {
      const overlay = item.querySelector('.play-overlay');
      
      item.addEventListener('mouseenter', () => {
        overlay.classList.remove('d-none');
        item.querySelector('img').style.opacity = '0.7';
      });
      
      item.addEventListener('mouseleave', () => {
        overlay.classList.add('d-none');
        item.querySelector('img').style.opacity = '1';
      });
    });
    
  } catch (error) {
    console.log('Errore nel recupero degli album:', error);
  }
};

// Funzione per aprire la pagina dell'artista
function openArtistPage(artistId) {
  window.location.href = `../ArtistPage/index.html?id=${artistId}`;
}

// Funzione per aprire la pagina dell'album
function openAlbumPage(albumId) {
  localStorage.setItem('currentAlbumId', albumId);
  window.location.href = '../AlbumPage/album_page.html';
}

// Funzione per riprodurre un brano
function playSong(trackId, title, artist, preview, coverUrl) {
  try {
    // Verifica che l'elemento audio esista
    const audioPlayer = document.getElementById('audioPlayer');
    if (!audioPlayer) {
      console.error('Elemento audio non trovato');
      return;
    }

    // Se c'è già un brano in riproduzione
    if (isPlaying) {
      audioPlayer.pause();
      footerPlayButton.classList.remove('bi-pause-circle-fill');
      footerPlayButton.classList.add('bi-play-circle-fill');
      
      // Se è lo stesso brano, lo stoppiamo e usciamo dalla funzione
      if (currentTrack === trackId) {
        isPlaying = false;
        return;
      }
    }

    // Se è un nuovo brano o il brano precedente era stoppato
    currentTrack = trackId;
    audioPlayer.src = preview;
    
    // Gestisci il caricamento dell'audio
    audioPlayer.addEventListener('canplay', () => {
      audioPlayer.play()
        .then(() => {
          // Aggiorna l'interfaccia
          if (currentTrackImg) {
            currentTrackImg.src = coverUrl;
            currentTrackImg.style.display = 'block';
          }
          if (currentTrackTitle) {
            currentTrackTitle.textContent = title;
            currentTrackTitle.style.display = 'block';
          }
          if (currentTrackArtist) {
            currentTrackArtist.textContent = artist;
            currentTrackArtist.style.display = 'block';
          }

          // Aggiorna il pulsante play/pause
          if (footerPlayButton) {
            footerPlayButton.classList.remove('bi-play-circle-fill');
            footerPlayButton.classList.add('bi-pause-circle-fill');
          }
          isPlaying = true;
        })
        .catch(error => {
          console.error('Errore durante la riproduzione:', error);
        });
    }, { once: true }); // Importante: rimuove il listener dopo il primo utilizzo

    // Gestione fine brano
    audioPlayer.onended = () => {
      footerPlayButton.classList.remove('bi-pause-circle-fill');
      footerPlayButton.classList.add('bi-play-circle-fill');
      isPlaying = false;
    };

  } catch (error) {
    console.error('Errore nella riproduzione:', error);
  }
}

// Funzione per gestire il play/pause
function togglePlayPause() {
  const audioPlayer = document.getElementById('audioPlayer');
  if (!audioPlayer || !audioPlayer.src) return;

  if (isPlaying) {
    audioPlayer.pause();
    footerPlayButton.classList.remove('bi-pause-circle-fill');
    footerPlayButton.classList.add('bi-play-circle-fill');
  } else {
    audioPlayer.play()
      .then(() => {
        footerPlayButton.classList.remove('bi-play-circle-fill');
        footerPlayButton.classList.add('bi-pause-circle-fill');
      })
      .catch(error => {
        console.error('Errore durante la riproduzione:', error);
      });
  }
  isPlaying = !isPlaying;
}

// Inizializza la pagina quando il documento è caricato
document.addEventListener('DOMContentLoaded', () => {
  loadAlbumData();

  // Aggiungi event listener per il pulsante play/pause nel footer
  if (footerPlayButton) {
    footerPlayButton.addEventListener('click', togglePlayPause);
  }

  // Aggiungi listener per gli eventi dell'audio player
  if (audioPlayer) {
    audioPlayer.addEventListener('play', () => {
      isPlaying = true;
      if (footerPlayButton) {
        footerPlayButton.classList.remove('bi-play-circle-fill');
        footerPlayButton.classList.add('bi-pause-circle-fill');
      }
    });

    audioPlayer.addEventListener('pause', () => {
      isPlaying = false;
      if (footerPlayButton) {
        footerPlayButton.classList.remove('bi-pause-circle-fill');
        footerPlayButton.classList.add('bi-play-circle-fill');
      }
    });

    audioPlayer.addEventListener('ended', () => {
      isPlaying = false;
      if (footerPlayButton) {
        footerPlayButton.classList.remove('bi-pause-circle-fill');
        footerPlayButton.classList.add('bi-play-circle-fill');
      }
    });
  }
});
