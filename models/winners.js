var mongoose = require('mongoose');
var winnerSchema = new mongoose.Schema({
   "userId": {type: String, ref:'users'},
   "campaignId":{type: String, ref:'campaigns'},
   "ticketId":{type: String, ref:'tickets'},
   "ticketNumber" : {type:Number,default:0},
   "created" : {type:Date,default:Date.now},
   "updated" : {type:Date},
},{ collection: "winners" });
module.exports = mongoose.model('winners', winnerSchema);