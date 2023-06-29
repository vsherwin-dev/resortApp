const express = require("express");
const router = express.Router();
const resorts = require('../controllers/resorts');
const WrapAsync = require("../utility/wrapAsync");
const { isLoggedIn, isAuthor, validateResort } = require("../middleware");

//to parse file upload/ multipart-formdata
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(WrapAsync(resorts.index))
    .post(isLoggedIn, upload.array('image'), validateResort, WrapAsync(resorts.createResort))
    // .post(upload.array('image'), (req, res, next) => {
    //     console.log(req.body, req.files);
    //     res.send('successful')
    // })

router.get('/new', isLoggedIn, resorts.renderNewForm)

router.route('/:id')
    .get(WrapAsync(resorts.showResort))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateResort, WrapAsync(resorts.updateResort))
    .delete(isLoggedIn, isAuthor, WrapAsync(resorts.deleteResort));

router.get('/:id/edit', isLoggedIn, isAuthor, WrapAsync(resorts.renderEditForm))

module.exports = router;
