


const updateAlbumCover = (album) => {
  // Ottieni il contenitore dove visualizzare l'album
  const albumContainer = document.getElementById("album-cover");

  // Crea e aggiorna il contenuto HTML per l'album
  const albumElement = `
      <div class="row mt-5">
          <div class="col-2 d-md-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left text-white" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
          </div>

          <div class="col-8 d-flex justify-content-center">
              <img src="${album.cover_medium}" alt="${album.title}" class="img-fluid">
          </div>
          <div class="col-2"></div>

          <h1 class="text-white mt-3">${album.title}</h1>
          <div class="col-1">
              <img src="${album.artist.picture_small}" alt="${album.artist.name}" class="rounded-circle" style="width:30px;">
          </div>
          <div class="col-11 h6 text-white">${album.artist.name}</div>
          <div class="col h6 text-white-50">Album • ${new Date(album.release_date).getFullYear()}</div>
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
  } catch (error) {
      console.error("Errore nel recupero dell'album:", error);
  }
};

// Chiamata per visualizzare un album specifico, sostituisci "302127" con l'ID dell'album che desideri


const fetchSongs = async (albumId) => {
  try {
      const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/${albumId}`);
      const data = await response.json();
      
      if (data.tracks && data.tracks.data.length > 0) {
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

const idAlbum = "302127"

fetchAlbum(idAlbum);
fetchSongs(idAlbum);