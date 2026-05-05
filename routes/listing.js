const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");



const { listingschema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const listing = require("../models/listing.js");
// to parse form data we use mululter
const multer = require('multer');
const { storage } = require("../cloudconfig.js")
// multer will extract files from form data and save it to uploads folder it will automatically create uploads folder 
const upload = multer({ storage })






// merging get and post rout by using router.rout
router.route("/").get(wrapasync(listingController.index))
    .post(
        isLoggedin,

        upload.single('listing[image]'),
        // validatelisting,
        wrapasync(listingController.createListing));

// add new rout
router.get("/new", isLoggedin, listingController.renderNewlisting)
router.route("/:id")
    .get(wrapasync(listingController.showListing))
    .put(isLoggedin, isOwner,
        upload.single('listing[image]'),
        validatelisting, wrapasync(listingController.updateListing))
    .delete(
        isLoggedin,
        isOwner,
        wrapasync(listingController.destroyListing));
// edit rout
router.get("/:id/edit", isLoggedin, isOwner, wrapasync(listingController.renderEditForm));

module.exports = router;
// adding data in db
// app.get("/listing", async (req, res) => {
//     let samplelisting = new Listing({
//         title: "My new villa ",
//         description: "By the beach",
//         price: 1200,
//         location: "karachi",
//         country: "Pakistan",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("app is working ")
// })
// app.get("/listing", async (req, res) => {
//     console.log("ROUTE HIT"); // ADD THIS

//     let samplelisting = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "karachi",
//         country: "Pakistan",
//     });

//     await samplelisting.save();
//     console.log("sample was saved");

//     res.send("app is working ");
// });