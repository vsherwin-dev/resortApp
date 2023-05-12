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
        const resort = new Resort({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await resort.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})