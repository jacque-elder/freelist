var express = require("express");
var router  = express.Router();
var Service = require("../models/service");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Service.find({}, function(err, allServices){
       if(err){
           console.log(err);
       } else {
          res.render("services/index", {services: allServices});
       }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var email = req.body.email;
    var website = req.body.website;
    var phone = req.body.phone;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newService = {name: name, price: price, image: image, email: email, website: website, phone: phone, description: desc, author: author};
    Service.create(newService, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/services");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("services/new.ejs"); 
});

// SHOW
router.get("/:id", function(req, res){
    Service.findById(req.params.id).populate("reviews").exec(function(err, foundService){
        if(err || !foundService){
            req.flash("error", "Service not found");
            res.redirect("back");
        } else {
            console.log(foundService);
            res.render("services/show", {service: foundService});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkServiceOwnership, function(req, res){
    Service.findById(req.params.id, function(err, foundService){
        res.render("services/edit", {service: foundService});
    });
});


// UPDATE
router.put("/:id", middleware.checkServiceOwnership, function(req, res){
    Service.findByIdAndUpdate(req.params.id, req.body.service, function(err, updatedService){
        if(err){
            res.redirect("/services");
        } else{
            res.redirect("/services/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkServiceOwnership, function(req, res){
    Service.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/service");
        } else{
            res.redirect("/services");
        }
    });
});

module.exports = router;
