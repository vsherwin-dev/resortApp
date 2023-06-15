const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./utility/AppError");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const resortRoutes = require("./routes/resorts.js");
const reviewRoutes = require("./routes/reviews.js");

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
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session)
  // console.log(req.user)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



app.get('/fakeUser', async (req, res) => {
  const user = new User({email: 'test@gmail.com', username: 'testUser'})
  const newUser = await User.register(user, 'secret');
  res.send(newUser);
})

app.get("/", (req, res) => {
  res.send("This is the homepage!");
});

app.use('/', userRoutes);
app.use("/resorts", resortRoutes);
app.use("/resorts/:id/reviews", reviewRoutes);

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
