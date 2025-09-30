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
            let slsFiltered = batas_sls.features.filter(f => selectedSls.includes(f.properties.idsls));
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
                    <p class="mb-0"><strong>SLS : [${f.properties.kdsls}]</strong>  ${f.properties.nmsls}</p>
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
            
