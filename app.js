const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const { resortSchema } = require('./schemas.js');
const WrapAsync = require("./utility/wrapAsync");
const AppError = require("./utility/AppError");
const methodOverride = require("method-override");
const Resort = require("./models/resort");
// const { error } = require("console");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/resortApp")
  .then(() => console.log("Connected to MONGODB"))
  .catch((err) => console.error("Error connecting to MONGODB", err));

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//used to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateResort = (req, res, next) => {
  const { error } = resortSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new AppError(msg, 400); // Use a status code of 400
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send("This is the homepage!");
});

app.get(
  "/resorts",
  WrapAsync(async (req, res) => {
    const resorts = await Resort.find({});
    res.render("resorts/index", { resorts });
  })
);

app.get("/resorts/new", (req, res) => {
  res.render("resorts/new");
});

app.post(
  "/resorts", validateResort,
  WrapAsync(async (req, res, next) => {
    const resort = new Resort(req.body.resort);
    await resort.save();
    res.redirect(`/resorts/${resort._id}`);
  })
);

app.get(
  "/resorts/:id",
  WrapAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id);
    if (!resort) {
      throw new AppError("Resort not found!", 404);
    }
    res.render("resorts/show", { resort });
  })
);

app.get(
  "/resorts/:id/edit",
  WrapAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id);
    if (!resort) {
      throw new AppError("Resort not found!", 404);
    }
    res.render("resorts/edit", { resort });
  })
);

app.put(
  "/resorts/:id", validateResort,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    res.redirect(`/resorts/${resort._id}`);
  })
);

app.delete(
  "/resorts/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    res.redirect("/resorts");
  })
);

const handleValidationErr = (err) => {
  return new AppError(`ValidationError: ${err.message}`, 404);
};

const handleCastErr = (err) => {
  return new AppError(`CastError: ${err.message}`, 500);
};

// // //error handlers
// app.use((err, req, res, next) => {
//   if (err.name === "ValidationError") {
//     // Handle validation errors
//     err = handleValidationErr(err);
//     next(err);
//   } else if (err.name === "CastError") {
//     // Handle cast errors
//     err = handleCastErr(err);
//     next(err);
//   } else {
//     // Handle other errors not from mongoose
//     const { status = 500, message = "Something Went Wrong" } = err;
//     console.log(err);
//     res.status(status).send(message);
//   }
// });

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
