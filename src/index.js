let map;
let marker;
let markers = [];

async function initMap() {
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -6.88778, lng: -38.55700 },
    zoom: 14,
  });

  map.addListener("click", (event) => {
    console.log(`lat: ${event.latLng.lat()}, lng: ${event.latLng.lng()}`);
    marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    marker.setPosition(event.latLng)
  })
  marker = new google.maps.Marker({
    // position: { lat: -6.88778, lng: -38.55700 },
    map,
    title: "Marcador",
  });
}

initMap();

let buttonSave = document.querySelector('#save-event');
buttonSave.addEventListener('click', salvar);

let buttonMostrar = document.querySelector('#show-event');
buttonMostrar.addEventListener('click', mostrar);


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
  }).then(response => { alert('Salvo com sucesso') })
    .catch(error => alert('Falha ao salvar!'));

}

async function mostrar() {
  console.log(markers.length);
  if (markers.length === 0){
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

    for (let evento of eventos) {
      console.log(evento);
      let markerSalvo = new google.maps.Marker({
        position: { lat: evento.geometria.coordinates[1], lng: evento.geometria.coordinates[0] },
        map,
        title: evento.descricao,
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

  
  console.log(markers.length);
}