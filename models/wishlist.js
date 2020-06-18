var mongoose = require('mongoose');
var Schema = mongoose.Schema;
wishlistSchema = new Schema({
   userId:{type:String},
   campaignsId:{ type:String,ref:'campaigns'},
   created_at:{type:Date,default:Date.now} 
});
module.exports = mongoose.model('wishlists', wishlistSchema);



