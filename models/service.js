var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   email: String,
   website: String,
   phone: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   reviews: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
      }]
});

module.exports = mongoose.model("Service", serviceSchema);