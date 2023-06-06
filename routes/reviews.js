const express = require("express");
const router = express.Router({ mergeParams: true }); //merge params important para ma-read yung /:id sa kapag naka express router, hindi ma catch yung req.params (/:id) kasi yung express router sini separate nya
const { reviewSchema } = require("../schemas.js");
const WrapAsync = require("../utility/wrapAsync");
const AppError = require("../utility/AppError");
const Resort = require("../models/resort");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  WrapAsync(async (req, res) => {
    const resort = await Resort.findById(req.params.id);
    const review = new Review(req.body.review);
    resort.reviews.push(review);
    await review.save();
    await resort.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/resorts/${resort._id}`);
  })
);

router.delete(
  "/:reviewId",
  WrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Resort.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/resorts/${id}`);
  })
);

module.exports = router;
