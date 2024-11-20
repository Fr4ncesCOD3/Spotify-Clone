const albumKey = url(`https://striveschool-api.herokuapp.com/api/deezer/album/{id}`);

// crea un canvas con l'immagine e ne ritorno il context 2d

const draw = function (img) {
  let canvas = document.createElement("canvas");
  let c = canvas.getContext("2d");
  c.width = canvas.width = img.clientWidth;
  c.height = canvas.height = img.clientHeight;
  c.clearRect(0, 0, c.width, c.height);
  c.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
  return c;
};

// scompone pixel per pixel e ritorna un oggetto con una mappa della loro frequenza nell'immagine
const getColors = function (c) {
  let col,
    colors = {};
  let pixels, r, g, b, a;
  r = g = b = a = 0;
  pixels = c.getImageData(0, 0, c.width, c.height);
  for (let i = 0, data = pixels.data; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3];
    if (a < 255 / 2) continue;
    col = rgbToHex(r, g, b);
    if (!colors[col]) colors[col] = 0;
    colors[col]++;
  }
  return colors;
};

// trova il colore più ricorrente data una mappa di frequenza dei colori
const findMostRecurrentColor = function (colorMap) {
  let highestValue = 0;
  let mostRecurrent = null;
  for (const hexColor in colorMap) {
    if (colorMap[hexColor] > highestValue) {
      mostRecurrent = hexColor;
      highestValue = colorMap[hexColor];
    }
  }
  return mostRecurrent;
};

// converte un valore in rgb a un valore esadecimale
const rgbToHex = function (r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw "Invalid color component";
  } else {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
};

// inserisce degli '0' se necessario davanti al colore in esadecimale per renderlo di 6 caratteri
const pad = function (hex) {
  return ("000000" + hex).slice(-6);
};

const generateImage = function () {
  // genero dinamicamente un tag <img /> in un <div> vuoto

  let imageSrc = "/copertina_pingu.jpeg";

  let reference = document.getElementById("container");

  // l'event listener "onload" nel tag <img /> si occupa di lanciare la funzione "start()" solamente
  // al termine del caricamento della src
  reference.innerHTML = `
      
    <div class="row mt-5">
            <div class="col-2 d-md-none ">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left text-white" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </div>
            
            <div class="col-8 d-flex justify-content-center">
            <img
                src=${imageSrc}
                id="img"
                style="width:75%;"
                crossorigin="anonymous"
                onload="start()"
             /></div>
            <div class="col-2"></div>
            <h1 class="text-white mt-3">Gioventú brucata</h1>
            <div class="col-1"> <img src="" alt="" class="rounded-circle"></div>
            <div class="col-11 h6 text-white">Pinguini tattici nucleari</div>
            <div class="col h6 text-white-50"> Album • 2017</div>
        </div>
    </div>`;
};

const start = function () {
  // prendo il riferimento all'immagine del dom
  let imgReference = document.querySelector("#img");

  // creo il context 2d dell'immagine selezionata
  let context = draw(imgReference);

  // creo la mappa dei colori più ricorrenti nell'immagine
  let allColors = getColors(context);

  // trovo colore più ricorrente in esadecimale
  let mostRecurrent = findMostRecurrentColor(allColors);

  // se necessario, aggiunge degli '0' per rendere il risultato un valido colore esadecimale
  let mostRecurrentHex = pad(mostRecurrent);

  //
  // seleziona l'elemento di cui vuoi cambiare lo sfondo
  let element = document.getElementById("container");

  // imposta lo sfondo dell'elemento con il colore più ricorrente

  element.style.backgroundColor = `#${mostRecurrentHex}`;

  // console.log del risultato
  console.log(mostRecurrentHex);
};

generateImage();
