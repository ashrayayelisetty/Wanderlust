let mapToken = window.mapToken;
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: window.coordinates,
    zoom: 9
});

console.log("Coordinates from server:", window.coordinates);
 const marker1 = new mapboxgl.Marker({color: 'red'})
        .setLngLat(window.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML("<h6>Exact location provided after booking</h6>"))
        .addTo(map);


// Geocode the location if available
// if (window.location_name) {
//     const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(window.location_name)}.json?access_token=${mapToken}`;
    
//     fetch(geocodingUrl)
//         .then(response => response.json())
//         .then(data => {
//             if (data.features && data.features.length > 0) {
//                 const coordinates = data.features[0].geometry.coordinates;
//                 map.setCenter(coordinates);
//                 map.setZoom(10);
                
//                 new mapboxgl.Marker()
//                     .setLngLat(coordinates)
//                     .addTo(map);
//             }
//         });
// }