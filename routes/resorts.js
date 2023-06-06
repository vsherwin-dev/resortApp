const express = require("express");
const router = express.Router();
const { resortSchema } = require("../schemas.js");
const WrapAsync = require("../utility/wrapAsync");
const AppError = require("../utility/AppError");
const Resort = require("../models/resort");

const validateResort = (req, res, next) => {
  const { error } = resortSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400); // Use a status code of 400
  } else {
    next();
  }
};


router.get(
  "/",
  WrapAsync(async (req, res) => {
    const resorts = await Resort.find({});
    res.render("resorts/index", { resorts });
  })
);

router.get("/new", (req, res) => {
  res.render("resorts/new");
});

router.post(
  "/",
  validateResort,
  WrapAsync(async (req, res, next) => {
    const resort = new Resort(req.body.resort);
    await resort.save();
    req.flash('success', 'Successfully made a new resort!');
    res.redirect(`/resorts/${resort._id}`);
  })
);

router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id).populate("reviews");
    if (!resort) {
      req.flash('error', 'Cannot find that resort!');
      return res.redirect('/resorts');
    }
    res.render("resorts/show", { resort });
  })
);

router.get(
  "/:id/edit",
  WrapAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id);
    if (!resort) {
      req.flash('error', 'Cannot find that resort!');
      return res.redirect('/resorts');
    }
    res.render("resorts/edit", { resort });
  })
);

router.put(
  "/:id",
  validateResort,
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    const resort = await Resort.findByIdAndUpdate(id, { ...req.body.resort });
    req.flash('success', 'Successfully updated resort!');
    res.redirect(`/resorts/${resort._id}`);
  })
);

router.delete(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Resort.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect("/resorts");
  })
);

module.exports = router;
