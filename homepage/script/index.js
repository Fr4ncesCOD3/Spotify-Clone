let heart = document.getElementById("heart");
let button = document.getElementById("cancel_button");
let card = document.getElementById("card");

const green = function () {
  heart.addEventListener("click", function (e) {
    heart.classList.toggle("colorGreen");
    e.preventDefault;
  });
};

const toggle = function () {
  button.addEventListener("click", function (e) {
    card.id = "toggle";
    if (window.on) e.preventDefault;
  });
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/75628072`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    addSong(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const addSong = (album) => {
  const card = document.getElementById("card");
  card.innerHTML = `
   <div class="row">
                <div class="col col-12">
                  <div class="d-flex flex-row">
                    <div class="col-6 my-4 mx-4 resizing_img">
                      <img src="${album.cover_medium}" width="200px" class="radius-Top margin-align" alt="" />
                    </div>
                    <div class="d-flex flex-column ms-3 mt-1">
                      <div class="container">
                        <div class="row">
                          <div class="col col-5">
                            <p class="text-white mt-3 align-content-start">album</p>
                          </div>
                          <div class="col col-"></div>
                          <button type="button" class="btn btn-secondary mt-3" id="cancel_button" onclick="toggle()">nascondi annuncio</button>
                        </div>
                      </div>
                      <h1 class="text-white fw-bold">${album.title}</h1>
                      <p class="text-white">${album.name}</p>
                      <p class="text-white">ascolta il nuovo singolo di Phrogres</p>
                      <div class="d-flex flex-row">
                        <button type="button" class="btn btn-success w-25 rounded-5">play</button>
                        <button type="button" class="btn btn-secondary w-25 rounded-5 ms-2">salva</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `;
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/75731272`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card_mobile(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card_mobile = (album) => {
  const parent = document.getElementById("mobile_card");
  parent.innerHTML = `
           <div class="col col-12">
<div class="d-flex flex-row">
<div class="col-6 my-3 ms-2 resizing_img">
<img src="${album.cover_medium}" width="110px" class="radius-Top margin-align" alt="" />
</div>
<div class="d-flex flex-column">
<p class="text-white mt-3 align-content-start">playlist</p>
<p class="text-white fw-bold">${album.title}</p>
</div>
</div>
</div>


`;
  console.log(album);
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/75631072`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card1(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));
const card1 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.title}</a>
                    </div>
  `;
  parent.appendChild(col);
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/	75621062`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card2(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card2 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.artist.name}</a>
                    </div>
  `;
  parent.appendChild(col);
};
fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/55622572`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card3(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card3 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.title}</a>
                    </div>
  `;
  parent.appendChild(col);
};
fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/79622372`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card4(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card4 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.title}</a>
                    </div>
  `;
  parent.appendChild(col);
};
fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/70622072`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card5(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card5 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.title}</a>
                    </div>
  `;
  parent.appendChild(col);
};
fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/75622072`)
  .then((album) => {
    if (album.ok) {
      return album.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album) => {
    card6(album);
    console.log(album);
  })
  .catch((e) => console.log("hai un errore " + e));

const card6 = (album) => {
  const parent = document.getElementById("container_6card");
  const col = document.createElement("div");
  col.classList.add("col", "col-6", "col-sm-4", "mt-1", "fix", "p-0", "rounded-2");
  col.innerHTML = `
            <div class="d-flex flex-row">
                      <div>
                        <img src="${album.cover}" width="50px" class="radius-Top" alt="" />
                      </div>
                      <a href="#" class="text-white ms-1 align-content-center">${album.title}</a>
                    </div>
  `;
  parent.appendChild(col);
};

fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/75629072`)
  .then((album_1) => {
    if (album_1.ok) {
      return album_1.json();
    } else {
      throw new Error("bad-request");
    }
  })
  .then((album_1) => {
    createCard(album_1);
    console.log(album_1);
  })
  .catch((e) => console.log("hai un errore " + e));

const createCard = (album_1) => {
  const card = document.getElementById("card_Container");
  card.innerHTML = `
  <div class="row">
                <div class="col col-md-2">
                  <div class="card border-0 rounded-5 color" style="width: 10rem">
                    <img src="${album_1.cover_medium}" alt="..." />
                    <div class="card-body color_ rounded-bottom-4">
                      <h5 class="card-title text-white">${album_1.title}</h5>
                      <p class="card-text text-white">${album_1.label}</p>
                    </div>
                  </div>
                </div>
              </div>
  `;
};

// tasto cerca
const searchToggle = document.querySelector(".search-toggle");

searchToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  searchToggle.classList.toggle("d-none");
  searchInput.classList.toggle("d-none");
  searchInput.focus();
});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Funzione per aggiornare la barra di progresso
const updateProgressBar = () => {
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeEl = document.querySelector(".current-time");
  const totalTimeEl = document.querySelector(".total-time");

  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
  }
};

// Funzione per gestire il click sulla barra di progresso
const handleProgressClick = (e) => {
  const progress = document.querySelector(".progress");
  const progressRect = progress.getBoundingClientRect();
  const percent = (e.clientX - progressRect.left) / progressRect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;
};

// Aggiorna la funzione handleSongClick per resettare la barra di progresso
const handleSongClock = (song) => {
  currentSong = song;

  updateFooterTrackInfo(song);

  if (isPlaying) {
    audioPlayer.pause();
  }

  audioPlayer.src = song.preview;
  audioPlayer.play().catch((error) => console.log("Errore nella riproduzione:", error));
  isPlaying = true;

  updatePlayIcons(true);

  // Reset progress bar
  const progressBar = document.querySelector(".progress-bar");
  progressBar.style.width = "0%";
  document.querySelector(".current-time").textContent = "0:00";
};

document.addEventListener("DOMContentLoaded", () => {
  // Previeni il bounce dello scroll su iOS
  document.body.addEventListener(
    "touchmove",
    function (e) {
      if (e.target.closest(".main-container")) {
        e.stopPropagation();
      }
    },
    { passive: true }
  );

  // Gestisci la visibilità del footer durante lo scroll
  let lastScroll = 0;
  const footer = document.querySelector("footer");

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
  const searchToggle = document.querySelector(".search-toggle");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  searchToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    searchToggle.classList.toggle("d-none");
    searchInput.classList.toggle("d-none");
    searchInput.focus();
  });

  // event listener al document per rilevare i clic al di fuori dell'input di ricerca e dei risultati
  document.addEventListener("click", (event) => {
    if (!searchInput.contains(event.target) && !searchToggle.contains(event.target) && !searchResults.contains(event.target)) {
      searchInput.classList.add("d-none");
      searchToggle.classList.remove("d-none");
      searchResults.innerHTML = "";
    }
  });

  searchInput.addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length > 2) {
      try {
        const response = await fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}");
        const data = await response.json();
        displaySearchResults(data.data);
      } catch (error) {
        console.error("Errore nella ricerca delle canzoni:", error);
      }
    } else {
      searchResults.innerHTML = "";
    }
  });

  const displaySearchResults = (songs) => {
    searchResults.innerHTML = "";

    // Crea un Set per tenere traccia degli artisti unici
    const uniqueArtists = new Set();

    // Aggiungi prima gli artisti
    songs.forEach((song) => {
      uniqueArtists.add(
        JSON.stringify({
          id: song.artist.id,
          name: song.artist.name,
          picture_xl: song.artist.picture_xl, // Aggiungi l'immagine dell'artista
        })
      );
    });

    // Crea i bottoni degli artisti
    uniqueArtists.forEach((artistJson) => {
      const artist = JSON.parse(artistJson);
      const artistItem = document.createElement("div");
      artistItem.className = "list-group-item list-group-item-action d-flex align-items-center gap-2";
      artistItem.innerHTML = `
              <i class="bi bi-person-circle text-secondary"></i>
              <div class="d-flex flex-column">
                  <span class="text-white">${artist.name}</span>
                  <small class="text-secondary">Artista</small>
              </div>
          `;

      // Aggiungi event listener per il click sull'artista
      artistItem.addEventListener("click", async () => {
        // Aggiorna la pagina con il nuovo artista
        await fetchArtist(artist.name);
        // Pulisci e nascondi la ricerca
        searchInput.value = "";
        searchInput.classList.add("d-none");
        searchToggle.classList.remove("d-none");
        searchResults.innerHTML = "";
      });

      searchResults.appendChild(artistItem);
    });

    // Aggiungi un separatore se ci sono sia artisti che canzoni
    if (uniqueArtists.size > 0 && songs.length > 0) {
      const separator = document.createElement("div");
      separator.className = "list-group-item disabled text-secondary small";
      separator.textContent = "Brani";
      searchResults.appendChild(separator);
    }

    // Aggiungi le canzoni
    songs.forEach((song) => {
      const songItem = document.createElement("div");
      songItem.className = "list-group-item list-group-item-action d-flex align-items-center gap-2";
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
