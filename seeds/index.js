const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Resort = require("../models/resort");

mongoose
  .connect("mongodb://127.0.0.1:27017/resortApp")
  .then(() => console.log("Seeds saved!"))
  .catch((err) => console.error("Error connecting to MONGODB", err));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Resort.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const resort = new Resort({
      author: "6499a95188df11e6b51f9895",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dv8edxhcu/image/upload/v1687978240/resortApp/qgoi5lre5a7mjsezu1ab.jpg",
          filename: "resortApp/qgoi5lre5a7mjsezu1ab",
        },
        {
          url: "https://res.cloudinary.com/dv8edxhcu/image/upload/v1687978240/resortApp/qgoi5lre5a7mjsezu1ab.jpg",
          filename: "resortApp/qgoi5lre5a7mjsezu1ab",
        },
      ],
    });
    await resort.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
