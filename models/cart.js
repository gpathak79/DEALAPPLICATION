var mongoose = require('mongoose');
var cartSchema = new mongoose.Schema({
   "userId":{type:String},
   "items": [{"campaignsId":{type: String, ref:'campaigns'},'quantity':{type: Number,default:0}}],
   "isDoubleTicket":{type:Boolean,default:false},
   "created_at":{type:Date,default:Date.now},
   "updated":{type:Date},
},{ collection: 'carts' });
module.exports = mongoose.model('carts', cartSchema);