require("dotenv").config();

// if (process.env.NODE_ENV != "production") {

// }


const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
// const listing = require("./models/listing.js");
const path = require("path");
// const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
// const joi = require("joi");
// const { listingschema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
// const review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userrouter = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

// to parse data 
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

// const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";
const dbURL = process.env.ATLASDB_URL
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// using ejsMat
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

main()
    .then((result) => {
        console.log("connected to data base");

    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dbURL);
    console.log("DB URL:", process.env.ATLASDB_URL);
}
const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,

});
store.on("error", (err) => {
    console.log("error in mongo session store ", err);
})
const sessionOptions = {

    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.get("/", (req, res) => {
    res.redirect("/listings")
});
// the interaction between client and server is called session
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
// we use it because we want to check if the request was sended by the same useer or differnt 
// if the the same userr trying to send request on the same browser so the web should not ask him for credential each time 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// if we stored users information in to the session is called serialize 
passport.serializeUser(User.serializeUser());
// if we unstore or remove from session  users information in to the session is called deserialize 
passport.deserializeUser(User.deserializeUser());
// <!-- we cant acceess req obj in ejs templete directly 
//          but use res.locals here  so now we store req.user in local varible in app.js -->
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");


    res.locals.currUser = req.user || null;
    // this toring the current user data  jis user ka current session chal raha just us ka data 
    next();
});
// app.get("/demo", async (req, res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "student"
//     });
//     let registeredUSer = await User.register(fakeUser, "hellowrold");
//     res.send(registeredUSer);

// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userrouter)

// middleWAREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEeee
// handling error if rout or page doesnt exist
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"))
});
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;

    res.render("error.ejs", { message });
});

app.listen(port, () => {
    console.log(`app is listening to ${port}`)
}
)