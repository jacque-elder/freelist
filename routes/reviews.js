var express = require("express");
var router  = express.Router({mergeParams: true});
var Service = require("../models/service");
var Review = require("../models/review");
var middleware = require("../middleware");


// Reviews new
router.get("/new", middleware.isLoggedIn, function(req, res){
    Service.findById(req.params.id, function(err, service){
        if(err || !service){
            req.flash("error", "Service not found");
            console.log(err);
        } else{
            res.render("reviews/new", {service: service}); 
        }
    });
});


//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   Service.findById(req.params.id, function(err, service){
       if(err){
           console.log(err);
           res.redirect("/service");
       } else {
           Review.create(req.body.review, function(err, review){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else{
                   review.author.id = req.user._id;
                   review.author.username = req.user.username;
                   review.save();
                   service.reviews.push(review);
                   service.save();
                   req.flash("success", "Successfully added review");
                   res.redirect("/services/" + service._id);
               }
           });
       }
   });
});

// edit reviews

router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res){
    Service.findById(req.params.id, function(err, foundService){
        if(err || !foundService){
            req.flash("error", "Service not found");
            return res.redirect("back");
        }
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err){
                res.redirect("back");
            } else{
                res.render("reviews/edit", {service_id: req.params.id, review: foundReview}); 
            }
        });
    });
});

// update review route
router.put("/:review_id", middleware.checkReviewOwnership, function(req,res){
   Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/services/" + req.params.id);
       }
   });
});

// destroy route
router.delete("/:review_id", middleware.checkReviewOwnership, function(req, res){
    Review.findByIdAndRemove(req.params.review_id, function(err){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Review deleted");
            res.redirect("/services/" + req.params.id);
        }
    });
});


module.exports = router;