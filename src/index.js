let map;
let marker;
let markers = [];
let listEvents = document.querySelector('.event-list');

async function initMap() {
  //@ts-ignore
  listEvents.classList.add('hide')

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
  await mostrar()
  await mostrar()
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
    sucessButton()
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


      console.log(error)
    });
}

async function mostrar() {
  if (markers.length === 0) {
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
      createCard(evento, eventos.indexOf(evento))
      markers.push(markerSalvo)
    }
    if (markers.length > 0) {
      document.querySelector("#show-event-text").textContent = "Ocultar eventos"
      listEvents.classList.remove('hide')
    }
  } else {
    for (let markerSalvo of markers) {
      markerSalvo.setMap(null)
      let card = document.querySelector('.event-card');
      listEvents.removeChild(card)
    }
    markers = []
    document.querySelector("#show-event-text").textContent = "Mostrar eventos"
      listEvents.classList.add('hide')
      
  }
}

function createCard(evento, index){
  let card = document.createElement('div')
  card.classList.add('event-card')
  
  let iconDiv = document.createElement('div')
  iconDiv.classList.add('icon-event-list')
  let icon = document.createElement('img')
  icon.src = './img/icon-event-list.svg'

  let eventInfoDiv = document.createElement('div')
  eventInfoDiv.classList.add('event-info')

  let eventLocalDiv = document.createElement('event-local')
  eventLocalDiv.classList.add('event-local')
  
  let localEvent = document.createElement('h3')
  localEvent.textContent = evento.geometria.coordinates[1]
  let descEvent = document.createElement('p')
  descEvent.textContent = evento.descricao

  let eventDescDiv = document.createElement('event-desc')
  eventDescDiv.classList.add('event-desc')

  let buttonDiv = document.createElement('div')
  buttonDiv.classList.add('button-go-to-event')
  let buttonGoToEvent = document.createElement('button')
  buttonGoToEvent.id = 'go-to-event'
  buttonGoToEvent.textContent = 'Ver'

  buttonGoToEvent.addEventListener('click', () => {
    console.log(index)
    map.setCenter(markers[index].getPosition())
  })

  eventLocalDiv.classList.add('event-local')

  
  listEvents.appendChild(card)
  card.appendChild(iconDiv)
  card.appendChild(eventInfoDiv)
  card.appendChild(buttonDiv)
  iconDiv.appendChild(icon)
  eventInfoDiv.appendChild(eventLocalDiv)
  eventLocalDiv.appendChild(localEvent)
  eventInfoDiv.appendChild(eventDescDiv)
  eventDescDiv.appendChild(descEvent)
  buttonDiv.appendChild(buttonGoToEvent)
}

function sucessButton(){
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
}