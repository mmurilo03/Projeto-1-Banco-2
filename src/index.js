let map;
let marker;
let markers = [];

async function initMap() {
  //@ts-ignore

  const { Map } = await google.maps.importLibrary("maps");
  
  
  map = new Map(document.getElementById("map"), {
    center: { lat: -6.88778, lng: -38.55700 },
    zoom: 14,
    disableDefaultUI: true
  });

  map.addListener("click", (event) => {
    console.log(`lat: ${event.latLng.lat()}, lng: ${event.latLng.lng()}`);
    marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    marker.setPosition(event.latLng)
  })

  const mapPin = {
    url: "./img/map-pin.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  marker = new google.maps.Marker({
    // position: { lat: -6.88778, lng: -38.55700 },
    map,
    title: "Marcador",
    icon: mapPin,
  });
}

initMap();

let buttonSave = document.querySelector('#save-event');
buttonSave.addEventListener('click', async () => { 
  await salvar()
  mostrar()
  mostrar()
});

let buttonMostrar = document.querySelector('#show-event');
buttonMostrar.addEventListener('click', () => {
  mostrar()
});

let inputEvent = document.querySelector('#nome');

async function salvar() {
  const obj = {
    nome: document.getElementById('nome').value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng()
  };

  console.log(obj);

  await fetch("http://localhost:3000/pontos/sincronizar", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/src/index.html'
    }
  })

  fetch("http://localhost:3000/pontos", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(obj)
  }).then(response => { 
    setTimeout(() => {
      buttonSave.style.background = '#011F39'; //blue
      buttonSave.textContent = 'Salvar evento';
      buttonSave.style.cursor = 'pointer'
      buttonSave.disabled = false;
    }, 2000);
    buttonSave.style.transition = '0.2s ease-in'
    buttonSave.style.background = '#53a653'; //green
    buttonSave.textContent = 'Salvo!'
    buttonSave.style.cursor = 'not-allowed'
    buttonSave.disabled = true;
    

    inputEvent.value = '';
   })
    .catch(error => {
      setTimeout(() => {
      buttonSave.style.background = '#011F39'; //blue
      buttonSave.textContent = 'Salvar evento';
      buttonSave.style.cursor = 'pointer'
      buttonSave.disabled = false;
    }, 3000);
    buttonSave.style.transition = '0.3s ease-in'
    buttonSave.style.background = '#ff3333'; //red
    buttonSave.textContent = 'Erro!'
    buttonSave.style.cursor = 'not-allowed'
    buttonSave.disabled = true;
    

    console.log(error)});
}

async function mostrar() {
  if (markers.length === 0 ){
    await fetch("http://localhost:3000/pontos/sincronizar", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    const response = await fetch("http://localhost:3000/pontos", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const eventos = await response.json()
    const mapPinShowEvent = {
      url: "./img/map-pin-show-event.svg", // url
      scaledSize: new google.maps.Size(30, 40), // scaled size
    };

    for (let evento of eventos) {
      
      let markerSalvo = new google.maps.Marker({
        position: { lat: evento.geometria.coordinates[1], lng: evento.geometria.coordinates[0] },
        map,
        title: evento.descricao,
        icon: mapPinShowEvent,
      })
      markers.push(markerSalvo)
    }
    if(markers.length > 0){
      document.querySelector("#show-event-text").textContent = "Ocultar eventos"
    } 
  } else {
    for (let markerSalvo of markers){
      markerSalvo.setMap(null)
    }
    markers = []
    document.querySelector("#show-event-text").textContent = "Mostrar eventos"
  } 
}