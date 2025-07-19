

// run this file only once -- it will delete the initial data and add the new data (i.e initialize the data)... 


// mongoose
const mongoose = require('mongoose');

// aquiring the Listing model ...
const Listing = require("../models/listing.js");

const initData = require("./data.js");
const { default: axios } = require('axios');

main().then((res) => {
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

require('dotenv').config({ path: '../.env' });


const map_api_key_radar = process.env.MAP_API_KEY_radar;

// initalise the coordinates
const geocodeLocation = async (location) => {
    try {
      const response = await axios.get('https://api.radar.io/v1/geocode/forward', {
        params: { query: location },
        headers: {
          Authorization: map_api_key_radar
        }
      });
  
      const addresses = response.data.addresses;
      if (addresses.length > 0) {
        const [ longitude, latitude ] = addresses[0].geometry.coordinates;
        return {
          type: "Point",
          coordinates: [longitude, latitude]
        };
      } else {
        console.warn(`No coordinates found for location: ${location}`);
        return {
          type: "Point",
          coordinates: [0, 0] // fallback
        };
      }
    } catch (err) {
      console.error(`Radar API error for "${location}":`, err.message);
      return {
        type: "Point",
        coordinates: [0, 0]
      };
    }
  };
  

//   console.log(map_api_key_radar)


// we are initializing the database here (only one time this file is run to stored the data in DB initially)
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj , owner: "6849a78818422fa2c90b968e"})) // we take the one of the user from the database (here: demo(username))
    // that all the listings are created by the user having the usenamr: demo...
    // we are now adding coordinates to each listing (using forward geocoding from Radar API)
    for (let listing of initData.data) {
        // const geoData = await geocodeLocation(listing.location); // get geometry (lat, lng) from location string
        // listing.geometry = geoData; // assign geometry field
        console.log("Geocoding location:", listing.location);
        const geoData = await geocodeLocation(listing.location);
        console.log("Geo result:", geoData);
        listing.geometry = geoData;
    }
    await Listing.insertMany(initData.data);
    console.log("Data was initialized...");
}

initDB();