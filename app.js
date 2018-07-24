var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Service        = require("./models/service"),
    Review        = require("./models/review"),
    User           = require("./models/user");
    
var reviewRoutes    = require("./routes/reviews"),
    serviceRoutes    = require("./routes/services"),
    indexRoutes      = require("./routes/index");

//mongoose.connect("mongodb://localhost/freelist_app");
mongoose.connect("mongodb://jacque-elder:52j2-gP4@ds147461.mlab.com:47461/freelist");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hamsters are cute",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/services", serviceRoutes);
app.use("/services/:id/reviews/", reviewRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started");
});