const express = require("express");
const router = express.Router();
const resorts = require('../controllers/resorts');
const WrapAsync = require("../utility/wrapAsync");
const { isLoggedIn, isAuthor, validateResort } = require("../middleware");

router.route('/')
    .get(WrapAsync(resorts.index))
    .post(isLoggedIn, validateResort, WrapAsync(resorts.createResort))

router.get('/new', isLoggedIn, resorts.renderNewForm)

router.route('/:id')
    .get(WrapAsync(resorts.showResort))
    .put(isLoggedIn, isAuthor, validateResort, WrapAsync(resorts.updateResort))
    .delete(isLoggedIn, isAuthor, WrapAsync(resorts.deleteResort));

router.get('/:id/edit', isLoggedIn, isAuthor, WrapAsync(resorts.renderEditForm))

module.exports = router;
