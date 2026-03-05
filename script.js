let map;
let markers = [];
let searchCircle = null;
let attractionCount = 0;

function initMap() {
    // Initialize map centered on San Marcos, TX
    map = L.map('map').setView([28.890661, -97.911530], 4);

    // Add OpenStreetMap tiles (no watermark, completely free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add Locate Me button
    addLocateMeButton();
}

function addLocateMeButton() {
    const locateMeControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: function(map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('a', 'leaflet-control-locate', container);
            button.href = '#';
            button.title = 'Locate Me';
            // Blue pin icon that matches the map marker style
            button.innerHTML = '<svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#2196F3"/></svg>';
            button.style.padding = '5px 8px';
            button.style.cursor = 'pointer';

            L.DomEvent.on(button, 'click', L.DomEvent.preventDefault);
            L.DomEvent.on(button, 'click', handleLocateMe);

            return container;
        }
    });

    new locateMeControl().addTo(map);
}

function handleLocateMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Center map on user's location
                    map.setView([latitude, longitude], 12);

                    // Add a marker for current location
                    L.marker([latitude, longitude], {
                        icon: L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    }).addTo(map).bindPopup('Your Location');

                    // Use reverse geocoding to get zip code
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    // Extract zip code from address
                    const zipCode = data.address?.postcode || data.address?.postal_code;

                    if (zipCode) {
                        document.getElementById('zipCode').value = zipCode;
                    } else {
                        alert('Could not find zip code for your location. Please enter manually.');
                    }
                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    alert('Error finding zip code. Please try again.');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Could not access your location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function geocodeLocation(address) {
    // Using Nominatim (OpenStreetMap's free geocoding service)
    // Add ", USA" to ensure we search in the United States
    const searchQuery = address.includes('USA') || address.includes('US') ? address : `${address}, USA`;
    return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json`)
        .then(response => response.json())
        .then(results => {
            if (results.length === 0) {
                throw new Error('Location not found');
            }
            return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
        });
}

function clearMarkers() {
    // Remove all existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    attractionCount = 0;
    document.getElementById('attractionCount').textContent = 'Found: 0 attractions';

    // Remove search circle
    if (searchCircle) {
        map.removeLayer(searchCircle);
        searchCircle = null;
    }
}

function searchNearby(lat, lng, radiusMeters) {
    // Using Nominatim to search for places with "zoo" or "aquarium" in the name
    // This is more reliable than Overpass API

    const searchTerms = ['zoo', 'aquarium', 'wildlife park', 'safari park'];
    let searchesCompleted = 0;

    searchTerms.forEach((term, index) => {
        // Add delay between requests to avoid rate limiting (429 errors)
        setTimeout(() => {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&limit=50&bounded=1&viewbox=${lng - 1.5},${lat - 1.5},${lng + 1.5},${lat + 1.5}`;

            console.log(`Searching for "${term}" near ${lat}, ${lng}`);

            fetch(url, {
                headers: {
                    'User-Agent': 'ZooMapFinder/1.0 (Local App)'
                }
            })
                .then(response => response.json())
                .then(results => {
                    console.log(`Found ${results.length} results for "${term}"`);
                    results.forEach(result => {
                        const resultLat = parseFloat(result.lat);
                        const resultLng = parseFloat(result.lon);

                        // Check if within radius
                        const distance = getDistance([resultLat, resultLng], [lat, lng]);
                        if (distance <= radiusMeters) {
                            console.log(`Adding ${result.name} (distance: ${(distance/1609.34).toFixed(2)} miles)`);
                            createMarker(resultLat, resultLng, result.name);
                        }
                    });

                    searchesCompleted++;
                    if (searchesCompleted === searchTerms.length) {
                        console.log(`Search complete: found ${attractionCount} total attractions`);
                    }
                })
                .catch(error => {
                    console.error(`Error searching for "${term}":`, error);
                    searchesCompleted++;
                });
        }, index * 500); // 500ms delay between each search term
    });
}

function getDistance(coord1, coord2) {
    // Haversine formula to calculate distance between two coordinates
    const R = 6371000; // Earth's radius in meters
    const lat1 = coord1[0] * Math.PI / 180;
    const lat2 = coord2[0] * Math.PI / 180;
    const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function createMarker(lat, lng, name) {
    // Use orange markers for attractions
    const marker = L.marker([lat, lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    // Create popup with name and directions link
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    const popupContent = `<div style="text-align: center;"><strong>${name}</strong><br><a href="${directionsUrl}" target="_blank" style="color: #2196F3; text-decoration: none; font-size: 12px; margin-top: 5px; display: inline-block;">Get Directions</a></div>`;
    marker.bindPopup(popupContent);
    markers.push(marker);
    attractionCount++;
    document.getElementById('attractionCount').textContent = `Found: ${attractionCount} attraction${attractionCount !== 1 ? 's' : ''}`;
}

function performSearch(address, distance) {
    clearMarkers();

    try {
        geocodeLocation(address).then(([lat, lng]) => {
            // Save search to sessionStorage for restoration
            sessionStorage.setItem('lastSearch', JSON.stringify({ address, distance }));

            // Add search radius circle - Green to represent wildlife/nature
            searchCircle = L.circle([lat, lng], {
                radius: distance * 1609.34, // Convert miles to meters
                color: '#228B22',
                fillColor: '#228B22',
                fillOpacity: 0.1,
                weight: 2,
                opacity: 0.8
            }).addTo(map);

            // Fit map to search circle bounds - disable animation for smooth transition
            map.fitBounds(searchCircle.getBounds(), { padding: [50, 50], animate: true, duration: 0.5 });

            // Search for animal attractions
            searchNearby(lat, lng, distance * 1609.34);

            console.log(`Searching for animal attractions within ${distance} miles of ${address}`);
        }).catch(error => {
            console.error('Error:', error);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Event listeners
document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const address = document.getElementById('zipCode').value;
    const distance = parseInt(document.getElementById('distance').value);
    performSearch(address, distance);
});

// Initialize on page load
window.onload = function() {
    initMap();

    // Restore previous search if available
    const savedSearch = sessionStorage.getItem('lastSearch');
    if (savedSearch) {
        try {
            const search = JSON.parse(savedSearch);
            document.getElementById('zipCode').value = search.address;
            document.getElementById('distance').value = search.distance;

            // Automatically re-run the search
            performSearch(search.address, search.distance);

            // Clear the saved search so it only restores once
            sessionStorage.removeItem('lastSearch');
        } catch (error) {
            console.error('Error restoring search:', error);
        }
    }
};