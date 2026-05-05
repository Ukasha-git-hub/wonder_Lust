const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";


main()
    .then((result) => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(mongo_url);
}
// initiallizing database

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"69f36deba629305cbcf1281b"}))
    await Listing.insertMany(initData.data);
    console.log("data is initiallized");
}

initDB();