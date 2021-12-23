const ipForm = document.querySelector('.header__form')
const ipInput = ipForm.querySelector('.header__form--input')
const mapContainer = document.querySelector('.map-container')

const infoValueEl = {
    ipAddress: document.getElementById('ip-address'),
    location: document.getElementById('location'),
    timezone: document.getElementById('timezone'),
    isp: document.getElementById('isp')
}

ipForm.addEventListener('submit', (e) => {
    e.preventDefault()
    getLocation(ipInput.value)
})

const getLocation = async (ipInput) => {
    let url

    if(ipInput) {
        url = `https://api.techniknews.net/ipgeo/${ipInput}`
    } else {
        url = 'https://api.techniknews.net/ipgeo/'
    }
    
    const response = await fetch(url)
    const result = await response.json()
    const data = await result

    if(data && data.status !== 'fail') {
        showInfo(data)
        mapContainer.innerHTML = ''
        showMap(data)
    } else {
        let notyf = new Notyf()
        notyf.error('IP Address not eligible')
    }
}

const showMap = (data) => {
    mapContainer.innerHTML = '<div class="map" id="map"></div>'
    let lat = data.lat
    let long = data.lon

    let map = L.map('map',{
        center: [lat, long],
        zoom: 20,
        zoomControl: false
    })
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    
    L.control.zoom({ position: 'bottomleft' }).addTo(map)
    
    let markerIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    L.marker([lat, long], { icon: markerIcon }).addTo(map)
}

const showInfo = (data) => {
    infoValueEl.ipAddress.textContent = data.ip
    infoValueEl.location.textContent = `${data.city}, ${data.countryCode}`
    infoValueEl.timezone.textContent = data.timezone
    infoValueEl.isp.textContent = data.isp
}

getLocation()