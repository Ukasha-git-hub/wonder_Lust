const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validatereview, isLoggedin, isREviewAuther } = require("../middleware.js");
const reviewController= require("../controllers/reviews.js");


//reviews
// post review Rout
router.post("/",
    validatereview,
    isLoggedin, wrapasync(reviewController.createReview));
// dekete reviews rout
router.delete("/:reviewId",
    isLoggedin,
    isREviewAuther, wrapasync(reviewController.destroyReview));
module.exports = router;