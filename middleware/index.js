//all middleware goes here
var middlewareObj = {};
var Service = require("../models/service");
var Review = require("../models/review");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkServiceOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Service.findById(req.params.id, function(err, foundService){
            if(err || !foundService){
                req.flash("error", "Service not found");
            } else{
                if(foundService.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                req.flash("error", "Review not found");
                res.redirect("back");
            } else{
                if(foundReview.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else { 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports = middlewareObj;