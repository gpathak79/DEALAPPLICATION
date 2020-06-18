var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
   "userId": {type:String},
   "items": [{"campaignsId":{type: String, ref:'campaigns'},'quantity':{type: Number,default:0},"ticket" : {type: Number,default:0},"points" : {type: Number,default:0}}],
   "cardInfo" : [],
   "totalAmt" : {type: Number,default:0},
   "totalProdcut" : {type: Number,default:0},
   "totalTickets" : {type: Number,default:0},
   "totalPoints" : {type: Number,default:0},
   "isDoubleTicket" : {type:Boolean,default:false},
   "isCharity" : {type:Boolean,default:false},
   "orderId" : {type: String,default:''},
   "orderNumber" : {type: Number,default:0},   
   "created" : {type:Date,default:Date.now},
   "updated" : {type:Date},
},{ collection: 'orders' });
module.exports = mongoose.model('orders', orderSchema);