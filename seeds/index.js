const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Resort = require('../models/resort');

mongoose
  .connect("mongodb://127.0.0.1:27017/resortApp")
  .then(() => console.log("Seeds saved!"))
  .catch((err) => console.error("Error connecting to MONGODB", err));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Resort.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const resort = new Resort({
            author: '648b138261ead14a1601fa2b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/1079731',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel egestas ex. Praesent convallis nulla non pulvinar ultrices. Aenean nec nisl quis arcu condimentum mollis. Nam risus sapien, iaculis non ligula a, bibendum pulvinar ante. Cras vitae libero sapien. In ultrices nisl et nibh consectetur bibendum. Donec nec tempus orci, sed auctor orci. Vestibulum ut ipsum eget ex commodo pharetra ut eu lacus. Aenean euismod libero a nibh vehicula tempus.',
            price: price
        })
        await resort.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})