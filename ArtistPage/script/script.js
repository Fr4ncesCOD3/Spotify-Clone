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
        await fetchAlbums(artistId);
        const artistResponse = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`);
        const artistData = await artistResponse.json();
        
        // Chiamiamo displayArtist per gestire l'immagine e il gradiente
        await displayArtist(artistData);
        
        // Aggiorniamo gli altri elementi
        const monthlyListenersElement = document.getElementById('monthly-listeners-count');
        monthlyListenersElement.textContent = artistData.nb_fan.toLocaleString();
        
        return artistData;
        
    } catch (error) {
        console.log(`Errore nel recupero del profilo artista:`, error);
    }
};

// Funzione aggiornata per visualizzare i dati dell'artista nell'header
const displayArtist = async (artistData) => {
    try {
        // Impostiamo l'immagine dell'artista
        const headerBg = document.querySelector('.artist-background');
        headerBg.style.backgroundImage = `url('${artistData.picture_xl}')`;
        
        // Otteniamo i colori dominanti
        const dominantColors = await getDominantColors(artistData.picture_xl);
        
        // Creiamo il gradiente di background con opacità ridotta
        const gradientBg = document.querySelector('.artist-background-gradient');
        const gradient = `
            linear-gradient(
                180deg,
                rgba(${dominantColors[0].r}, ${dominantColors[0].g}, ${dominantColors[0].b}, 0.3) 0%,
                rgba(${dominantColors[1].r}, ${dominantColors[1].g}, ${dominantColors[1].b}, 0.2) 50%,
                rgba(${dominantColors[2].r}, ${dominantColors[2].g}, ${dominantColors[2].b}, 0.1) 75%,
                rgba(18, 18, 18, 1) 100%
            )
        `;
        
        // Applichiamo il gradiente
        gradientBg.style.background = gradient;
        
        // Impostiamo il nome dell'artista
        const artistName = document.getElementById('artist-name');
        artistName.textContent = artistData.name;
        
    } catch (error) {
        console.error('Errore nell\'elaborazione dell\'immagine:', error);
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

        // Aggiungi event listener per il click sulle canzoni
        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', function() {
                const song = JSON.parse(this.dataset.song);
                updateFooterTrackInfo(song);
            });
        });

        // Imposta la prima canzone come default nel footer
        if (topSongs.length > 0) {
            updateFooterTrackInfo(topSongs[0]);
        }
        
        return data.data;
        
    } catch (error) {
        console.log(`Errore nella ricerca delle canzoni:`, error);
    }
};

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

// Esempio di utilizzo
const nomeArtista = "The Weeknd";
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
});

// Funzione per estrarre più colori dominanti dall'immagine
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