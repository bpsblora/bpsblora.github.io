// BASEMAP
            // BASEMAP
var overlayMaps = {};

var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

const BPNBasemap = L.TileLayer.extend({
  createTile: function (coords, done) {
    const tile = document.createElement('img');
    tile.setAttribute('referrerpolicy', 'no-referrer');
    L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
    L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
    tile.src = this.getTileUrl(coords);
    return tile;
  }
});
var googleTerrain = new BPNBasemap('https://petadasar.atrbpn.go.id/main/wms/{x}/{y}/{z}', {
    maxZoom: 19,
    maxNativeZoom: 19,
    attribution: '© Kementerian ATR/BPN - Model Dasar Pertanahan'
});

// Initialize Leaflet Map -- HARUS sebelum layer apapun di-addTo(map)
var map = L.map('map', {
        center: [-6.9697, 111.4189],
        zoom: 11,
        maxZoom: 20,
        minZoom: 6,
        zoomControl: false,
        attributionControl: true
});
map.attributionControl.addAttribution(" BPS Kabupaten Blora");

// Basemap default yang tampil saat load
googleSat.addTo(map);

// Layer group untuk filter
var layerKec = L.geoJson(null, {style:{
                            color:"blue", weight: 2, opacity: 0.5,
                            fillOpacity: 0.2, fillColor: 'blue'
                        }}).addTo(map);
var layerDesa = L.geoJson(null, {style:{
                            color: 'orange', weight: 2, opacity: 0.5,
                            fillOpacity: 0.2, fillColor: 'orange'
                        }}).addTo(map);
var layerSls = L.geoJson(null, {style: {
                            color: 'red', weight: 3, opacity: 1,
                            fillOpacity: 0.2, fillColor: 'red',
                        }}).addTo(map);

var baseMaps = {
    "Satelit": googleSat,
    "Terain atr": googleTerrain,
    "Street": googleStreets,
    "Hibrid": googleHybrid
};

L.control.zoom({ position: 'bottomleft' }).addTo(map);
L.control.layers(baseMaps, overlayMaps, { position: 'bottomleft' }).addTo(map);

         
