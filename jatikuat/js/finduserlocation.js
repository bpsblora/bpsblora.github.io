// Fungsi untuk Menampilkan Lokasi
            let accuracyCircle;
            function onLocationFound(e) {
                const radius = e.accuracy;

                // Membatasi angka radius hingga dua angka desimal dan mengganti titik dengan koma
                const formattedRadius = radius.toFixed(2).replace('.', ',');

                // Tambahkan marker dengan popup
                L.marker(e.latlng).addTo(map)
                    .bindPopup("Anda di sekitar <strong>" + formattedRadius + "</strong> meter dari titik ini").openPopup();

                // Hapus lingkaran sebelumnya jika ada
                if (accuracyCircle) {
                    map.removeLayer(accuracyCircle);
                }

                // Tambahkan lingkaran baru
                accuracyCircle = L.circle(e.latlng, {
                    radius: radius,
                    color: 'blue',
                    fillColor: '#add8e6',
                    fillOpacity: 0.5
                }).addTo(map);
            }

         

            // Fungsi untuk Menemukan Lokasi Pengguna
            function goToOurLocation() {
                map.locate({ setView: true, maxZoom: 18 });
                map.on('locationfound', onLocationFound);

                // Pantau lokasi pengguna secara terus-menerus
                // if (navigator.geolocation) {
                //     navigator.geolocation.watchPosition(updateUserLocation, handleLocationError, {
                //         enableHighAccuracy: true, // Gunakan lokasi paling akurat
                //         maximumAge: 0,          // Hindari data lokasi yang di-cache
                //         timeout: 10000,         // Timeout dalam milidetik
                //     });
                // } else {
                //     alert('Geolocation tidak didukung oleh browser Anda.');
                // }
            }