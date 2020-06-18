var mongoose = require('mongoose');
var schema = new mongoose.Schema({  
     userId: {type: String, ref: 'users'},
     brandName:{type:String,default:'visa'},
     cardHolderName:{type:String,default:''},
     cardNumber:{type:String,default:''},
     expMonth:{type:Number,default:0},
     expYear:{type:Number,default:1992},
     cvv:{type:Number,default:1234}
},{ collection: 'cards' });
module.exports = mongoose.model('cards', schema);
