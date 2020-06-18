var mongoose = require('mongoose');
var Schema = mongoose.Schema;
userPointSchema = new Schema({
   userId:{type:String,ref:'users'},
   points : {type: Number,default:0},
   campaignsId:{ type:String,ref:'campaigns'},
   orderId:{type: String, ref:'orders'},
   transactiontype:{type:String,default:'add'},
   created: { type: Date, default: Date.now },
   updated: { type: Date, default: Date.now },
});
module.exports = mongoose.model('purchasepoints', userPointSchema);