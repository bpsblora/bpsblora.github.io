// BASEMAP
            var overlayMaps
            var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });
            var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });
            var googleTerrain = L.tileLayer('https://petadasar.atrbpn.go.id/main/wms/{x}/{y}/{z}', {
                maxZoom: 22,
                maxNativeZoom: 22,
                attribution: '© Kementerian ATR/BPN - Model Dasar Pertanahan'
            });


            // Initialize Leaflet Map
            var map = L.map('map', {
                    center: [-6.9697, 111.4189],
                    zoom: 11,
                    maxZoom: 20,
                    minZoom: 6,
                    zoomControl: false,
                    attributionControl: true
            }); 
            map.attributionControl.addAttribution(" BPS Kabupaten Blora");



            // Layer group untuk filter
            var layerKec = L.geoJson(null, {style:{
                                        color:"blue",
                                        weight: 2,
                                        opacity: 0.5,
                                        fillOpacity: 0.2,
                                        fillColor: 'blue'
                                    }})
                                    .addTo(map);
            var layerDesa = L.geoJson(null, {style:{
                                        color: 'orange',
                                        weight: 2,
                                        opacity: 0.5,
                                        fillOpacity: 0.2,
                                        fillColor: 'orange'
                                    }})
                                    .addTo(map);
            var layerSls = L.geoJson(null, {style: {
                                        color: 'red',
                                        weight: 3,
                                        opacity: 1, // Transparansi garis
                                        fillOpacity: 0.2, // Transparansi area
                                        fillColor: 'red',
                                    }})
                                    .addTo(map);


            var baseMaps = {
                // "Overlay": petaOverlay
                // "Overlay": petaOverlay,
                "Satelit": googleSat,
                "Terain atr": googleTerrain,
                "Street": googleStreets,
                "Hibrid": googleHybrid
            };
            L.control.zoom({
                    position: 'bottomleft'
            }).addTo(map);
            L.control.layers(baseMaps, overlayMaps, {
                position: 'bottomleft'
            }).addTo(map);

            // Add OpenStreetMap tiles
             var tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                        maxZoom: 20,
                        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
                }).addTo(map);
