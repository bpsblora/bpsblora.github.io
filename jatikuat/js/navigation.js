// Variabel tujuan
            let routingPath;
            var selectedLatitude = null;
            var selectedLongitude = null;
            
            // Fungsi untuk Menampilkan Rute
            function showRoute() {
                if (!navigator.geolocation) {
                    return alert('Geolocation tidak didukung oleh browser Anda.');
                }

                navigator.geolocation.getCurrentPosition(
                    ({ coords: { latitude, longitude } }) => {
                        // Hapus routingPath sebelumnya jika ada
                        if (routingPath) {
                            map.removeControl(routingPath);
                        }

                        // Atur tampilan peta ke lokasi saat ini
                        map.setView([latitude, longitude], 13);
                        console.log(latitude,longitude);
                        // Tambahkan routing baru
                        routingPath = L.Routing.control({
                            waypoints: [
                                L.latLng(latitude, longitude), // Lokasi pengguna
                                L.latLng(selectedLatitude, selectedLongitude) // Lokasi tujuan
                            ],
                            routeWhileDragging: true,

                            lineOptions: {
                                styles: [
                                    { color: '#ffffff', opacity: 0.8, weight: 7 }, // Outline 
                                    { color: '#0f53ff', opacity: 0.9, weight: 5 }  // Garis utama 
                                ]
                            },

                            showAlternatives: true, // Menampilkan rute alternatif
                            altLineOptions: { // Konfigurasi visual rute alternatif
                                styles: [
                                    { color: '#6a83d7', opacity: 0.7, weight: 6 }, // Outline
                                    { color: '#bccefb', opacity: 0.8, weight: 4 } // Garis Utama
                                ]
                            },
                            position: 'bottomright', // Posisi kontrol di pojok kanan bawah
                            router: L.Routing.osrmv1({
                                serviceUrl: 'https://router.project-osrm.org/route/v1',
                                language: 'id' // Mengatur bahasa Indonesia
                            }),
                            formatter: new L.Routing.Formatter({
                                units: 'metric', // Satuan jarak (kilometer dan meter)
                            }),
                            createMarker(i, waypoint) {
                                const customIcon = L.divIcon({
                                    className: 'custom-glyph-icon',
                                    html: `<div style="
                                        background-color: ${i === 0 ? '#3498db' : '#e74c3c'};
                                        color: white;
                                        border-radius: 50%;
                                        width: 30px;
                                        height: 30px;
                                        font-size: 16px;
                                        font-weight: bold;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        ">
                                        ${i === 0 ? 'A' : i === 1 ? 'B' : ''}
                                    </div>`,
                                    iconSize: [30, 30],
                                    iconAnchor: [15, 15],
                                    popupAnchor: [0, -15]
                                });

                                return L.marker(waypoint.latLng, {
                                    draggable: true,
                                    icon: customIcon
                                }).bindPopup(i === 0 ? 'Titik awal' : 'Titik tujuan');
                            }
                        }).addTo(map);

                        // Tambahkan event untuk menampilkan popup dengan jarak
                        routingPath.on('routesfound', function (e) {
                            const routes = e.routes;

                            // Iterasi melalui semua rute (utama dan alternatif)
                            routes.forEach((route, index) => {
                                const summary = route.summary;
                                const distanceKm = (summary.totalDistance / 1000).toFixed(2);

                                // Cari titik tengah dari rute
                                const midPoint = route.coordinates[Math.floor(route.coordinates.length / 2)];

                                // Tambahkan popup untuk masing-masing rute
                                L.popup()
                                    .setLatLng(midPoint)
                                    .setContent(`<strong>Rute ${index + 1}:</strong><br>Jarak: ${distanceKm} km`)
                                    .addTo(map); // Tambahkan popup ke peta tanpa menutup popup lain
                            });
                        });

                        // Buat tombol toggle untuk collapsible
                        createRoutingToggle();
                    },
                    (error) => alert(`Gagal mendapatkan lokasi Anda. Error: ${error.message}`)
                );
            }

            // Fungsi untuk membuat tombol toggle
            function createRoutingToggle() {
                // Cari atau buat div tombol di dalam map
                let toggleButton = document.getElementById('routing-toggle');
                if (!toggleButton) {
                    // Buat tombol dengan kelas Bootstrap
                    toggleButton = document.createElement('button');
                    toggleButton.id = 'routing-toggle';
                    toggleButton.innerHTML = 'Sembunyikan Rute';
                    toggleButton.className = 'btn btn-danger btn-xs'; // Kelas Bootstrap untuk tombol kecil dan berwarna biru
                    toggleButton.style.cssText = `
                        position: absolute;
                        bottom: 20px;
                        right: 10px;
                        z-index: 1000;
                    `;

                    // Tambahkan tombol ke elemen map
                    document.getElementById('map').appendChild(toggleButton);
                }

                // Tambahkan event listener untuk toggle
                toggleButton.addEventListener('click', () => {
                    const container = document.querySelector('.leaflet-routing-container');
                    if (container) {
                        const isHidden = container.style.display === 'none';
                        container.style.display = isHidden ? 'block' : 'none';
                        toggleButton.innerHTML = isHidden ? 'Sembunyikan Rute' : 'Tampilkan Rute';
                        toggleButton.className = isHidden ? 'btn btn-danger btn-xs' : 'btn btn-info btn-xs'; // Ubah warna tombol
                    }
                });
            }