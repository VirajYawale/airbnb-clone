

let map_api_key = mapapikey;
let coordinates_map = listing.geometry.coordinates;

// Radar.initialize(map_api_key);  ---- we will be not using radar it is very difficult to implement

// const map = Radar.ui.map({
//     container: 'map',
//     style: 'radar-default-v1',
//     center: coordinates_map,
//     // center: [77.2090, 28.6139],
//     zoom: 11
// });

const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets/style.json?key='+map_api_key,
        center: coordinates_map,
        // center: [77.2090, 28.6139],
        zoom: 11
});

// // Enable map interactions
// map.scrollZoom.enable();
// map.dragPan.enable();
// map.boxZoom.enable();
// map.keyboard.enable();
// map.doubleClickZoom.enable();

// console.log("Coordinates:", coordinates_map);
if (!coordinates_map || coordinates_map.length !== 2 || coordinates_map.includes(null)) {
  console.error("Invalid coordinates:", coordinates_map);
}



// popup
const popup = new maplibregl.Popup({ offset: 25}) // offset to avoid overlapping the marker
  .setHTML(`<h4>${listing.title}</h4><h5>${listing.location}</h5><p>Exact Location provided after booking!</p>`); // Customize as needed

console.log((coordinates_map))

map.on("load", () => {
    // Safely add marker after map is fully ready
    const marker = new maplibregl.Marker({ color: "red" })
      .setLngLat(coordinates_map)
      .setPopup(popup)
      .addTo(map);
  
    marker.togglePopup();
    // Scroll back to top after map loads 
  window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  

  