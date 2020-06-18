var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
   "userId": {type:String},
   "campaignsId":{type: String, ref:'campaigns'},
   "orderId":{type: String, ref:'orders'},
   "isDoubleTicket" : {type:Boolean,default:false},
   "isCharity" : {type:Boolean,default:false},
   "ticketId" : {type: String,default:''},
   "ticketNumber" : {type: Number,default:0},   
   "ticketCount" : {type: Number,default:0},   
   "points" : {type: Number,default:0},   
   "isWinner" : {type: Number,default:0},   
   "isClose" : {type:Boolean,default:false},
   "created" : {type:Date,default:Date.now},
   "updated" : {type:Date},
},{ collection: "tickets" });
module.exports = mongoose.model('tickets', orderSchema);