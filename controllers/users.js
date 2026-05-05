const User = require("../models/user");


module.exports.rendersignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUSer = await User.register(newUser, password);
        console.log(registeredUSer);
        // as user registered successfully so we bypass the function login automatically 
        // it stores the registered user info then it use callback
        req.login(registeredUSer, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to WonderLust");
            res.redirect("/listings");
        })

    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
};

module.exports.renderloginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login =
    async (req, res) => {
        req.flash("success", "welcome to wonderLust");
        // for now redirect value is undefined becase passport has deleted it --> go to middlewahre.js
        //  res.redirect(res.locals.redirectUrl); ---->>>>// this will fail if we try to loggin  directly from home cause in that case the redirect url will be empty 
        // so have to add a condition here to check if url is empty or not 
        // if it is exist then save it in redirectUrl otherwise we navigate to listings 
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
        // let { username, password } = req.body;

    };
    module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listings");
    });
};
