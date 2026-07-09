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

// ALTERNATIF 1: Esri World Imagery (Paling tajam, mirip citra drone/foto udara detail)
var esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// ALTERNATIF 2: Google Terrain Asli (Menampilkan kontur elevasi, bukan foto udara)
var googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '© Google'
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
map.attributionControl.addAttribution("BPS Kabupaten Blora");

// Basemap default yang tampil saat load
googleSat.addTo(map);

// Layer group untuk filter batas wilayah (Kecamatan, Desa, SLS)
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

// Masukkan ke dalam control layers
var baseMaps = {
    "Satelit (Google)": googleSat,
    "Citra Detail (Esri)": esriImagery, // Menggantikan posisi map ATR/BPN
    "Topografi (Terrain)": googleTerrain,
    "Jalan (Street)": googleStreets,
    "Hibrid": googleHybrid
};

L.control.zoom({ position: 'bottomleft' }).addTo(map);
L.control.layers(baseMaps, overlayMaps, { position: 'bottomleft' }).addTo(map);
