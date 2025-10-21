//LEFT SIDEBAR MENU
$(function() {
                'use strict';
                $('.js-menu-toggle').click(function(e) {
                    var $this = $(this);
                    if ( $('body').hasClass('show-sidebar') ) {
                        $('body').removeClass('show-sidebar');
                        $this.removeClass('active');
                    } else {
                        $('body').addClass('show-sidebar'); 
                        $this.addClass('active');
                    }
                    e.preventDefault();
                });

                // click outisde offcanvas
                $(document).mouseup(function(e) {
                    var container = $(".sidebar");
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        if ( $('body').hasClass('show-sidebar') ) {
                            $('body').removeClass('show-sidebar');
                            $('body').find('.js-menu-toggle').removeClass('active');
                        }
                    }
                }); 
            });


            

            document.querySelector('.numberkec').textContent = batas_kec.features.filter(function(feature) {
                return feature.type === "Feature";
            }).length;
            document.querySelector('.numberdesa').textContent = batas_desa.features.filter(function(feature) {
                return feature.type === "Feature";
            }).length;
            document.querySelector('.numbersls').textContent = batas_sls.features.filter(function(feature) {
                return feature.type === "Feature";
            }).length;



//RIGHT DROPDOWN FILTER

function getGeoJSONCentroid(feature) {

          // Menghitung centroid menggunakan Turf.js
          const centroid = turf.centroid(feature);

          // Mengembalikan latitude dan longitude dari centroid
          return {
              latitude: centroid.geometry.coordinates[1],
              longitude: centroid.geometry.coordinates[0]
          };
        }


        // ==== Tombol Tampilkan Peta ====
        $("#btnShow").on("click", function() {
            if (accuracyCircle) {
                map.removeLayer(accuracyCircle);
            }
            if (routingPath) {
                routingPath.remove(); // Hapus routing lama jika ada
                routingControl = null; 
            }
          let selectedSls = $("#sls").val() || [];
          let selectedDesa = $("#desa").val() || [];
          let selectedKec = $("#kecamatan").val() || [];

          // clear semua layer
          layerKec.clearLayers(); 
          layerDesa.clearLayers(); 
          layerSls.clearLayers();

          if (selectedSls.length > 0) {
            // render SLS
            let slsFiltered = batas_sls.features.filter(f => selectedSls.includes(f.properties.idsubsls));
            layerSls.addData(slsFiltered).eachLayer(function(layer) {
              
              let f = layer.feature;
              const { latitude, longitude } = getGeoJSONCentroid(f);
              selectedLatitude = latitude;
              selectedLongitude = longitude;

              layer.bindPopup(`
                <div class="card shadow-sm border-0" style="min-width: 220px;">
                  <div class="card-header bg-danger text-white py-2">
                    <h6 class="m-0 text-center">Informasi SLS</h6>
                  </div>
                  <div class="card-body p-2">
                    <p class="mb-1"><strong>Kecamatan : [${f.properties.kdkec}]</strong> ${f.properties.nmkec}</p>
                    <p class="mb-1"><strong>Desa : [${f.properties.kddesa}]</strong>  ${f.properties.nmdesa}</p>
                    <p class="mb-0"><strong>SLS : [${f.properties.kdsls}${f.properties.kdsubsls}]</strong>  ${f.properties.nmsls}</p>
                    <button id="openstreetmap-btn" onclick="showRoute()" class="mt-1 btn btn-warning btn-xs w-100">
                      <strong>Dapatkan Rute</strong>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" target="_blank" class="mt-1 btn btn-info btn-xs w-100">
                      <strong>Navigasi Gmaps↪️</strong>
                    </a>
                  </div>
                </div>
              `);
            });
            if (slsFiltered.length) map.fitBounds(layerSls.getBounds());

          } else if (selectedDesa.length > 0) {
            // render Desa
            let desaFiltered = batas_desa.features.filter(f => selectedDesa.includes(f.properties.iddesa));
            layerDesa.addData(desaFiltered).eachLayer(function(layer) {
              let f = layer.feature;
              layer.bindPopup(`
                <div class="card shadow-sm border-0" style="min-width: 220px;">
                  <div class="card-header bg-orange text-white py-2">
                    <h6 class="m-0 text-center">Informasi Desa</h6>
                  </div>
                  <div class="card-body p-2">
                    <p class="mb-1"><strong>Kecamatan:</strong> ${f.properties.nmkec}</p>
                    <p class="mb-0"><strong>Desa:</strong> ${f.properties.nmdesa}</p>
                  </div>
                </div>
              `);
            });
            if (desaFiltered.length) map.fitBounds(layerDesa.getBounds());

          } else if (selectedKec.length > 0) {
            // render Kecamatan
            let kecFiltered = batas_kec.features.filter(f => selectedKec.includes(f.properties.idkec));
            layerKec.addData(kecFiltered).eachLayer(function(layer) {
              let f = layer.feature;
              layer.bindPopup(`
                <div class="card shadow-sm border-0" style="min-width: 220px;">
                  <div class="card-header bg-info text-white py-2">
                    <h6 class="m-0 text-center" >Informasi Kecamatan</h6>
                  </div>
                  <div class="card-body p-2">
                    <p class="mb-0"><strong>Kecamatan:</strong> ${f.properties.nmkec}</p>
                  </div>
                </div>
              `);
            });
            if (kecFiltered.length) map.fitBounds(layerKec.getBounds());
          }
        });

var lastMarker = null;
var markerongeojsonsls = null;
// Fungsi untuk memproses input koordinat
            document.getElementById('searchButton').addEventListener('click', function () {
                var input = document.getElementById('searchInput').value.trim();
                var coords = input.split(',');

                // Validasi input
                if (coords.length === 2) {
                    var lat = parseFloat(coords[0]);
                    var lon = parseFloat(coords[1]);

                    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                        
                        ////MENGHAPUS SEMUA ELEMEN YANG MUNCUL PADA MAP DARI FITUR FILTER
                        // Jika marker sebelumnya ada, hapus marker tersebut
                        if (lastMarker) {
                            map.removeLayer(lastMarker);
                        }

                        // Jika GeoJSON sebelumnya ada, hapus layer tersebut
                        if (markerongeojsonsls) {
                            map.removeLayer(markerongeojsonsls);
                        }

                        
                        if (accuracyCircle) {
                            map.removeLayer(accuracyCircle);
                        }
                        if (routingPath) {
                            routingPath.remove(); // Hapus routing lama jika ada
                            routingControl = null; 
                        }
                        selectedKdkec = document.getElementById('kecamatan').value;
                        selectedKddesa = document.getElementById('desa').value;
                        selectedRT = document.getElementById('sls').value;

                        // Hapus layer GeoJSON sebelumnya
                        if (layerKec) {
                            map.removeLayer(layerKec);
                        }
                        if (layerDesa) {
                            map.removeLayer(layerDesa);
                        }
                        if (layerSls) {
                            map.removeLayer(layerSls);
                        }



                        // Membuat ikon kustom
                        var customIcon = L.icon({
                            iconUrl: 'images/landmark.png',  // Ganti dengan URL ikon yang diinginkan
                            iconSize: [40, 40],  // Ukuran ikon (dalam pixel)
                            iconAnchor: [20, 40],  // Titik jangkar ikon, biasanya setengah dari ukuran ikon
                            popupAnchor: [0, -40]  // Menentukan jarak popup relatif terhadap ikon
                        });

                        // Tambahkan marker baru ke peta
                        lastMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
                        lastMarker.bindPopup(`Koordinat: ${lat}, ${lon}`).openPopup();

                        // Memuat GeoJSON yang berisi batas RT (batas_sls)
                        var filteredFeatures = [];

                        // Periksa apakah marker berada di dalam batas RT
                        L.geoJSON(batas_sls).eachLayer(function (layer) {
                            // Periksa jika layer adalah Polygon atau MultiPolygon
                            if (layer instanceof L.Polygon || layer instanceof L.MultiPolygon) {
                                var geoJsonPolygon = layer.toGeoJSON(); // Mengkonversi ke GeoJSON
                                var point = turf.point([lon, lat]); // Membuat titik dari koordinat

                                // Gunakan turf.js untuk mengecek apakah titik berada dalam polygon
                                var isInside = turf.booleanPointInPolygon(point, geoJsonPolygon);

                                if (isInside) {
                                    // Menambahkan data yang relevan ke filteredFeatures
                                    filteredFeatures.push(geoJsonPolygon);

                                    // Tambahkan popup dengan informasi RT, Desa, dan Kecamatan
                                    lastMarker.bindPopup(`
                                        <div>
                                            <h5>Informasi Koordinat yang Dicari</h5>
                                            <p>Koordinat: <strong>${lat}, ${lon}</strong></p>
                                            <p>Nama RT: <strong>${layer.feature.properties.nmsls}</strong></p>
                                            <p>Nama Desa: <strong>${layer.feature.properties.nmdesa}</strong></p>
                                            <p>Nama Kecamatan: <strong>${layer.feature.properties.nmkec}</strong></p>
                                        
                                            

                                            
                                            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat} , ${lon} +
                                            " target="_blank" class="mt-1 btn btn-info btn-xs w-100">
                                            <strong>Navigasi Gmaps↪️</strong>
                                            </a>
                                        </div>
                                    `).openPopup();
                                }
                            }
                        });

                        // Tambahkan GeoJSON yang relevan ke peta
                        if (filteredFeatures.length > 0) {
                            markerongeojsonsls = L.geoJSON(
                                {
                                    type: 'FeatureCollection',
                                    features: filteredFeatures,
                                },
                                {
                                    style: {
                                        color: 'red',
                                        weight: 2,
                                        opacity: 0.5, // Transparansi garis
                                        fillOpacity: 0.2, // Transparansi area
                                        fillColor: 'red',
                                    },
                                    // Menambahkan popup dan event listener untuk setiap fitur
                                    onEachFeature: function (feature, layer) {
                                        if (feature.properties && feature.properties.nmsls) {
                                            

                                            // Menambahkan popup dengan informasi SLS dan tombol navigasi
                                            layer.bindPopup(
                                                '<div>' +
                                                    '<h5>Informasi SLS</h5>' +
                                                    '<p>Kecamatan: <strong>' + feature.properties.nmkec + '</strong></p>' +
                                                    '<p>Desa: <strong>' + feature.properties.nmdesa + '</strong></p>' +
                                                    '<p>SLS: <strong>' + feature.properties.nmsls + '</strong></p>' +
                                                '</div>'
                                            );
                                        }
                                    },
                                }
                            ).addTo(map);

                            // Zoom ke fitur yang difilter
                            map.fitBounds(markerongeojsonsls.getBounds());
                        }

                        // Pindahkan peta ke lokasi marker
                        map.setView([lat, lon], 15);
                    } else {
                        alert('Koordinat tidak valid! Pastikan dalam format latitude,longitude.');
                    }
                } else {
                    alert('Masukkan koordinat dalam format latitude,longitude (contoh: -6.200000,106.816666).');
                }
            });
