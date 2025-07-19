const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  // we connect the backend with cloudinary
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({ // this is for, in cloud, in which folder we have to save the data...
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormat: ["png", "jpg", "jpeg"], // supports promises as well
    },
  });

module.exports = {
    cloudinary,
    storage
}
// use this in listing.js(route)
  