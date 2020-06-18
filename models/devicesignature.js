var mongoose = require('mongoose');
var schema = new mongoose.Schema({  
     userId: {type: String, default: ''},
     country : {type: String, default: ''},
     userType : {type: Number,default: 0},
     lastActiveTime: {type:Date, default:Date.now},
     deviceId: {type: String},
     deviceToken: {type: String},
     deviceModel: {type: String},
     deviceType: {type: String},
     osVersion: {type: String},
     deleted: {type:Number, default:0},
     created: { type: Date, default: Date.now },
     updated: { type: Date, default: Date.now },

},{ collection: 'deviceSignature' });
module.exports = mongoose.model('deviceSignature', schema);