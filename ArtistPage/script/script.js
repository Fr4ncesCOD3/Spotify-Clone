//script per ottenere il nome dell'artista dall'API e inserirlo nell'header


//-----------------------------------------------------------//


// Funzione per ottenere gli album dell'artista
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

// Funzione per ottenere i brani popolari dell'artista
const fetchTopTracks = async (artistId) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`);
        const data = await response.json();
        
        const popularSongsList = document.getElementById('popular-songs-list');
        popularSongsList.innerHTML = '';
        
        data.data.forEach((track, index) => {
            const songElement = `
                <div class="song-item d-flex align-items-center text-secondary p-2" data-song='${JSON.stringify(track)}'>
                    <div class="song-number me-3">${index + 1}</div>
                    <div class="song-cover me-3">
                        <img src="${track.album.cover_small}" alt="${track.title}" class="img-fluid">
                    </div>
                    <div class="song-info flex-grow-1">
                        <div class="song-title text-white">${track.title}</div>
                        <div class="song-plays">${track.rank.toLocaleString()} riproduzioni</div>
                    </div>
                    <div class="song-duration">${formatTime(track.duration)}</div>
                </div>
            `;
            popularSongsList.innerHTML += songElement;
        });

        // Aggiungi event listener per il click sulle canzoni
        document.querySelectorAll('.song-item').forEach(songItem => {
            songItem.addEventListener('click', () => {
                const songData = JSON.parse(songItem.dataset.song);
                handleSongClick(songData);
            });
        });
        
    } catch (error) {
        console.log('Errore nel recupero dei brani popolari:', error);
    }
};

// Funzione per ottenere i dati del profilo dell'artista
const fetchArtist = async (artistNameProfile) => {
    try {
        const searchResponse = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${artistNameProfile}`);
        const searchData = await searchResponse.json();
        
        if (searchData.data.length === 0) {
            console.log(`Artista "${artistNameProfile}" non trovato`);
            return;
        }
        
        const artistId = searchData.data[0].artist.id;
        
        // Recupera i dati dell'artista
        const artistResponse = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`);
        const artistData = await artistResponse.json();
        
        // Aggiorna l'interfaccia con i dati dell'artista
        await displayArtist(artistData);
        
        // Aggiorna gli ascoltatori mensili
        const monthlyListenersElement = document.getElementById('monthly-listeners-count');
        monthlyListenersElement.textContent = artistData.nb_fan.toLocaleString();
        
        // Recupera e mostra gli album
        await fetchAlbums(artistId);
        
        // Recupera e mostra i brani popolari
        await fetchTopTracks(artistId);
        
        return artistData;
        
    } catch (error) {
        console.log(`Errore nel recupero del profilo artista:`, error);
    }
};

// Funzione aggiornata per visualizzare i dati dell'artista nell'header
const displayArtist = async (artistData) => {
    try {
        // Aggiorna l'immagine di sfondo
        const headerBg = document.querySelector('.artist-background');
        headerBg.style.backgroundImage = `url('${artistData.picture_xl}')`;
        
        // Ottieni i colori dominanti
        const dominantColors = await getDominantColors(artistData.picture_xl);
        
        // Aggiorna il gradiente di sfondo
        const gradientBg = document.querySelector('.artist-background-gradient');
        const gradient = `
            linear-gradient(
                180deg,
                rgba(${dominantColors[0].r}, ${dominantColors[0].g}, ${dominantColors[0].b}, 0.5) 0%,
                rgba(${dominantColors[1].r}, ${dominantColors[1].g}, ${dominantColors[1].b}, 0.3) 30%,
                rgba(${dominantColors[2].r}, ${dominantColors[2].g}, ${dominantColors[2].b}, 0.2) 60%,
                rgba(18, 18, 18, 0.95) 80%,
                rgba(18, 18, 18, 1) 100%
            )
        `;
        gradientBg.style.background = gradient;
        
        // Aggiorna il nome dell'artista nell'header
        const artistName = document.getElementById('artist-name');
        artistName.textContent = artistData.name;
        
        // Aggiorna il titolo della pagina
        document.title = `${artistData.name} - Spotify Clone`;
        
        // Aggiorna il gradiente della content-area
        await updateContentAreaGradient(artistData.picture_xl);
        
    } catch (error) {
        console.error('Errore nella visualizzazione dei dati dell\'artista:', error);
    }
};


//-----------------------------------------------------------//

// Variabili globali
let audioPlayer = new Audio();
let isPlaying = false;
let currentSong = null;

// Funzione per aggiornare tutte le icone play/pause nell'interfaccia
const updatePlayIcons = (playing) => {
    // Aggiorna tutte le icone play/pause nel footer (sia mobile che desktop)
    const playButtons = document.querySelectorAll('.bi-play-circle-fill, .bi-pause-circle-fill');
    playButtons.forEach(button => {
        button.classList.remove('bi-play-circle-fill', 'bi-pause-circle-fill');
        button.classList.add(playing ? 'bi-pause-circle-fill' : 'bi-play-circle-fill');
    });

    // Aggiorna icona nell'header
    const headerPlayButton = document.querySelector('.play-button i');
    if (headerPlayButton) {
        headerPlayButton.classList.remove('bi-play-fill', 'bi-pause-fill');
        headerPlayButton.classList.add(playing ? 'bi-pause-fill' : 'bi-play-fill');
    }
};

// Funzione per gestire il play/pause
const handlePlayPause = () => {
    if (!currentSong) {
        // Se non c'è nessuna canzone selezionata, riproduci la prima della lista
        const firstSong = document.querySelector('.song-item');
        if (firstSong) {
            firstSong.click();
        }
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(error => console.log('Errore nella riproduzione:', error));
    }
    
    isPlaying = !isPlaying;
    updatePlayIcons(isPlaying);
};

// Funzione per gestire il click su una canzone
const handleSongClick = (song) => {
    const isSameSong = currentSong && currentSong.id === song.id;
    
    if (isSameSong && isPlaying) {
        // Se è la stessa canzone e sta suonando, metti in pausa
        handlePlayPause();
        return;
    }
    
    currentSong = song;
    updateFooterTrackInfo(song);
    
    if (isPlaying) {
        audioPlayer.pause();
    }
    
    audioPlayer.src = song.preview;
    audioPlayer.play().catch(error => console.log('Errore nella riproduzione:', error));
    isPlaying = true;
    updatePlayIcons(true);
    
    // Reset progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        document.querySelector('.current-time').textContent = '0:00';
    }
};

// Event listeners quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    // Event listener per tutti i pulsanti play/pause nel footer
    const playButtons = document.querySelectorAll('.bi-play-circle-fill');
    playButtons.forEach(button => {
        button.addEventListener('click', handlePlayPause);
    });
    
    // Event listener per il pulsante play/pause nell'header
    const headerPlayButton = document.querySelector('.play-button');
    if (headerPlayButton) {
        headerPlayButton.addEventListener('click', handlePlayPause);
    }
    
    // Event listener per la barra di progresso
    const progress = document.querySelector('.progress');
    if (progress) {
        progress.addEventListener('click', handleProgressClick);
    }
    
    // Event listeners per l'audio player
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayIcons(false);
    });
});

// Funzione per aggiornare le informazioni nel footer
const updateFooterTrackInfo = (song) => {
    if (!song) return;
    
    const trackImg = document.getElementById('current-track-img');
    const trackTitle = document.getElementById('current-track-title');
    const trackArtist = document.getElementById('current-track-artist');
    
    if (trackImg && trackTitle && trackArtist) {
        trackImg.src = song.album.cover_small;
        trackImg.alt = song.title;
        trackTitle.textContent = song.title;
        trackArtist.textContent = song.artist.name;
        
        trackImg.style.display = 'block';
        trackTitle.style.display = 'block';
        trackArtist.style.display = 'block';
    }
};


//-----------------------------------------------------------//

// Funzione per ottenere le canzoni dell'artista
const fetchSongs = async (artistNameSongs) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${artistNameSongs}`);
        const data = await response.json();
        
        if (data.data.length === 0) {
            console.log(`Canzoni per "${artistNameSongs}" non trovate`);
            return;
        }
        console.log(data.data);
        const topSongs = data.data.slice(0, 5);
        const songsList = document.getElementById('popular-songs-list');
        songsList.innerHTML = '';
        
        topSongs.forEach((song, index) => {
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

        // Modifica l'event listener per le canzoni
        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', function() {
                const song = JSON.parse(this.dataset.song);
                handleSongClick(song);
            });
        });

        // Imposta la prima canzone come default nel footer
        if (topSongs.length > 0) {
            currentSong = topSongs[0];
            updateFooterTrackInfo(currentSong);
        }
        
        return data.data;
        
    } catch (error) {
        console.log(`Errore nella ricerca delle canzoni:`, error);
    }
};


//-----------------------------------------------------------//

// Funzione per formattare i numeri grandi
// serve per formattare il numero di riproduzioni delle canzoni
// se il numero è maggiore di 1 milione, lo formattiamo in milioni
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

// Modifica la funzione per aggiornare il footer
const updateFooterTrackInfo1 = (song) => {
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

// Esempio di utilizzo
const nomeArtista = "Pink Floyd";
fetchArtist(nomeArtista);  // Stamperà il profilo dell'artista
fetchSongs(nomeArtista);   // Stamperà l'array delle canzoni



//-----------------------------------------------------------//

// Gestione del click sui tre puntini
document.querySelector('.bi-three-dots').addEventListener('click', async () => {
    const artistData = await fetchArtist(nomeArtista); // Riutilizziamo la fetch esistente
    
    // Popoliamo il modale con i dati dell'artista
    document.getElementById('modal-artist-image').src = artistData.picture_medium;
    document.getElementById('modal-artist-fans').textContent = `${artistData.nb_fan.toLocaleString()} fans`;
    document.getElementById('modal-artist-albums').textContent = `${artistData.nb_album} album pubblicati`;
    
    // Mostriamo il modale
    const modal = new bootstrap.Modal(document.getElementById('artistInfoModal'));
    modal.show();
});

// Gestione del click sul pulsante shuffle
document.querySelector('.bi-shuffle').addEventListener('click', function() {
    // Toggle della classe active che cambia il colore
    this.classList.toggle('shuffle-active');
});

// Aggiungi gestione dello scroll smooth
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




//-----------------------------------------------------------//




// Funzione per estrarre pi colori dominanti dall'immagine
const getDominantColors = async (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const colorCounts = {};
            
            // Analizziamo i pixel per trovare i colori più frequenti
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                if (a < 255 / 2) continue;
                
                // Raggruppiamo colori simili per avere una migliore distribuzione
                const key = `${Math.floor(r/10)*10},${Math.floor(g/10)*10},${Math.floor(b/10)*10}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            // Ordiniamo i colori per frequenza e prendiamo i primi 3
            const sortedColors = Object.entries(colorCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([color]) => {
                    const [r, g, b] = color.split(',').map(Number);
                    return { r, g, b };
                });

            resolve(sortedColors);
        };
        img.onerror = reject;
        img.src = imageUrl;
    });
};

// Funzione per aggiornare il gradiente della content-area
const updateContentAreaGradient = async (imageUrl) => {
    try {
        const dominantColors = await getDominantColors(imageUrl);
        const contentArea = document.querySelector('.content-area');
        const gradient = `
            linear-gradient(
                180deg,
                rgba(${dominantColors[0].r}, ${dominantColors[0].g}, ${dominantColors[0].b}, 0.5) 0%,
                rgba(${dominantColors[1].r}, ${dominantColors[1].g}, ${dominantColors[1].b}, 0.3) 50%,
                rgba(${dominantColors[2].r}, ${dominantColors[2].g}, ${dominantColors[2].b}, 0.2) 100%
            )
        `;
        contentArea.style.background = gradient;
    } catch (error) {
        console.error('Errore nell\'aggiornamento del gradiente della content-area:', error);
    }
};

//-----------------------------------------------------------//

// Funzione per formattare il tempo in minuti:secondi
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Funzione per aggiornare la barra di progresso
const updateProgressBar = () => {
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
};

// Funzione per gestire il click sulla barra di progresso
const handleProgressClick = (e) => {
    const progress = document.querySelector('.progress');
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
    audioPlayer.play().catch(error => console.log('Errore nella riproduzione:', error));
    isPlaying = true;
    
    updatePlayIcons(true);
    
    // Reset progress bar
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    document.querySelector('.current-time').textContent = '0:00';
}; 