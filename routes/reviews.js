const express = require("express");
const router = express.Router({ mergeParams: true }); //merge params important para ma-read yung /:id sa kapag naka express router, hindi ma catch yung req.params (/:id) kasi yung express router sini separate nya
const WrapAsync = require("../utility/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, WrapAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, WrapAsync(reviews.deleteReview))

module.exports = router;
