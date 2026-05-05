require("dotenv").config();
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
// const geocodingClient = mbxGeocoding({ aceessToken: mapToken });
function getGeocoder() {
    return mbxGeocoding({
        accessToken: process.env.MAPBOX_TOKEN,
    });
}

module.exports.index = async (req, res, next) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
};
module.exports.renderNewlisting = (req, res) => {

    res.render("listings/new");
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    // we want all reviews with the post but with that we also want to show the author name with review thats why we used nested populated  {print on show.ejs}
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for  does not exist ");
        return res.redirect("/listings")
    }
    console.log(JSON.stringify(listing.review, null, 2));
    res.render("listings/show", { listing });

};
module.exports.createListing = async (req, res, next) => {
    const geocoder = getGeocoder();

    let response = await geocoder.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();



    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "....", filename);
    const newlisting = new Listing(req.body.listing);

    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    // that would be store in db 
    // listing model new field that would be response.body.features.geometry 
    newlisting.geometry = response.body.features[0].geometry;
    let savedListing = await newlisting.save();
    console.log(savedListing);


    req.flash("success", "New listing created");
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    // first finding id then we check if the person autherized then it will be allowed to chnage data else no

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // checking the variable if it defined or not 
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(`this Obj ${deletedList} is deleted`);
    req.flash("success", "the listing is deleted");
    res.redirect("/listings");
}