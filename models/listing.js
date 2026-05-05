const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true

    },
    description: String,
    image: {
        // type:String,
        filename: String,
        url: String
    },

    price: {
        type: Number,
        default: 0
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // dont doo '{location:{type:Sting}}'
            enum: ["Point"],// 'location.type' must be point 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category:{
        type:String,
        enum:["mountains","arctic","farms","desert","pool","rainy","castles"]
    }

});
// mongoose midd
// deleting all reviews that come inside that perticular listing oneTo Many db relation
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})
const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;