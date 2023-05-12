const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/resort");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/resortApp")
  .then(() => console.log("Connected to MONGODB"))
  .catch((err) => console.error("Error connecting to MONGODB", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//used to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    res.send('Working')
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
