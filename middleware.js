const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // if the user not loggedin then we its url (which page he wanted to go )--> then will save it in locals 
        // redirect url 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in first ");
        return res.redirect("/login")
    }
    next();
};
// as we logged in successfully then passport by default delete the session
// that why we define it in the locals and passport doesnt have access to deelete locals 
module.exports.saveREdirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permisson to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
module.exports.isREviewAuther = async (req, res, next) => {
    let { id, reviewId } = req.params;
    console.log("PARAMS:", req.params);
    console.log("reviewId:", req.params.reviewId);

    let review = await Review.findById(reviewId);
    console.log("FOUND REVIEW:", review);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permisson to make this change  ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};