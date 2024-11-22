let heart = document.getElementById("heart");
let button = document.getElementById("cancel_button");
let card = document.getElementById("card");
let audioPlayer = document.getElementById('audioPlayer');
let footerPlayButton = document.querySelector('.player-controls i');
let currentTrackImg = document.getElementById('current-track-img');
let currentTrackTitle = document.getElementById('current-track-title');
let currentTrackArtist = document.getElementById('current-track-artist');

let isPlaying = false;
let currentTrack = null;

const green = function () {
  if (heart) {
    heart.addEventListener("click", function (e) {
      heart.classList.toggle("colorGreen");
      e.preventDefault();
    });
  }
};

const toggle = function () {
  if (button) {
    button.addEventListener("click", function (e) {
      card.classList.toggle("toggle");
      e.preventDefault();
    });
  }
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=viola%20fedez%20salmo`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("richiesta non valida");
    }
  })
  .then((data) => {
    const viola = data.data[0];
    updateHeroSection(viola);
    addSong(viola.album);
  })
  .catch((e) => console.log("Hai un errore: " + e));

function updateHeroSection(track) {
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.innerHTML = `
      <div class="row">
        <div class="col-12">
          <div class="featured-content d-flex ${window.innerWidth < 768 ? 'flex-column' : ''} align-items-center gap-3">
            <img src="${track.album.cover_xl}" alt="${track.title}" class="featured-image ${window.innerWidth < 768 ? 'mobile-featured-image' : ''}">
            <div class="featured-info ${window.innerWidth < 768 ? 'text-center' : ''}">
              <span class="text-secondary text-uppercase small">ALBUM</span>
              <h1 class="text-white ${window.innerWidth < 768 ? 'fs-4' : 'display-4'} fw-bold mb-2">${track.title}</h1>
              <p class="text-white mb-2">${track.artist.name}</p>
              <p class="text-secondary mb-3">Ascolta il nuovo singolo di ${track.artist.name}!</p>
              <div class="d-flex ${window.innerWidth < 768 ? 'justify-content-center' : ''} gap-2">
                <button class="btn btn-success rounded-pill px-4" onclick="playSong('${track.id}', '${track.title.replace(/'/g, "\\'")}', '${track.artist.name}', '${track.preview}', '${track.album.cover_medium}')">Play</button>
                <button class="btn btn-outline-light rounded-pill px-4">Salva</button>
                <button class="btn btn-link text-secondary">•••</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

const addSong = (album) => {
  if (card) {
    card.innerHTML = `
      <div class="container mt-4">
        <!-- Sezione Potrebbero interessarti -->
        <div class="row mb-4">
          <div class="col-12">
            <h2 class="text-white mb-3">Altro di ciò che ti piace</h2>
            <div class="scroll-container">
              <div class="scroll-content" id="suggestedTracks">
                <!-- Contenuto dinamico -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Carica i brani suggeriti
    fetchSuggestedTracks();
  }
};

// Nuova funzione per caricare brani suggeriti
async function fetchSuggestedTracks() {
  try {
    const response = await fetch('https://striveschool-api.herokuapp.com/api/deezer/search?q=hits');
    const data = await response.json();
    const suggestedContainer = document.getElementById('suggestedTracks');
    
    if (suggestedContainer) {
      suggestedContainer.innerHTML = data.data.slice(0, 10).map(track => `
        <div class="card-wrapper">
          <div class="card" onclick="playSong('${track.id}', '${track.title.replace(/'/g, "\\'")}', '${track.artist.name}', '${track.preview}', '${track.album.cover_medium}')">
            <img src="${track.album.cover_medium}" class="card-img-top" alt="${track.title}">
            <div class="card-body">
              <h5 class="card-title text-white">${track.title}</h5>
              <p class="card-text">${track.artist.name}</p>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Errore nel caricamento dei brani suggeriti:', error);
  }
}

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
    }, { once: true });

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

function openAlbumPage(albumId) {
  localStorage.setItem('currentAlbumId', albumId);
  window.location.href = '../AlbumPage/album_page.html';
}

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

// Funzione per recuperare e visualizzare gli album nel carosello
async function loadAlbumsCarousel() {
  try {
    const response = await fetch('https://striveschool-api.herokuapp.com/api/deezer/search?q=pop');
    const data = await response.json();
    const albums = data.data.slice(0, 8);

    const albumsCarousel = document.getElementById('albums-carousel');
    if (albumsCarousel) {
      albumsCarousel.innerHTML = albums.map(album => `
        <div class="album-card" onclick="openAlbumPage('${album.album.id}')">
          <img src="${album.album.cover_medium}" alt="${album.album.title}" class="album-img">
          <div class="album-info">
            <h5 class="album-title text-truncate">${album.album.title}</h5>
            <p class="album-artist text-truncate">${album.artist.name}</p>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Errore nel caricamento del carosello degli album:', error);
  }
}

green();
toggle();

// Inizializza il carosello degli album quando il documento è caricato
document.addEventListener('DOMContentLoaded', () => {
  audioPlayer = document.getElementById('audioPlayer');
  if (!audioPlayer) {
    console.error('Elemento audio non trovato al caricamento della pagina');
  }

  // ... Inizializzazione esistente ...
  loadAlbumsCarousel();

  // Aggiungi listener per gli eventi dell'audio player
  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    footerPlayButton.classList.remove('bi-play-circle-fill');
    footerPlayButton.classList.add('bi-pause-circle-fill');
  });

  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    footerPlayButton.classList.remove('bi-pause-circle-fill');
    footerPlayButton.classList.add('bi-play-circle-fill');
  });
});

// Aggiungi questo listener per gestire il resize della finestra
window.addEventListener('resize', () => {
  fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=viola%20fedez%20salmo`)
    .then(response => response.ok ? response.json() : Promise.reject('Richiesta non valida'))
    .then(data => {
      const viola = data.data[0];
      updateHeroSection(viola);
    })
    .catch(e => console.log("Hai un errore: " + e));
});
