var mongoose = require('mongoose');
var Schema = mongoose.Schema;
campaignSchema = new Schema({
    "productId" : {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    "campaignUrl" : { type: String, default: '' },
    "campaignType" : { type: String, default: '' },    
    "campaignLabelEN" : {type:String},    
    "campaignLabelAR" : {type:String},
    "campaignDesEN" : { type: String, default: '' },          
    "campaignDesAR" : { type: String, default: '' },
    "campaignTermEN" : [],
    "campaignTermAR" : [],
    "campaignSpecificationEN" : [],
    "campaignSpecificationAR" : [],      
    "newSpecificationEN":{type:String},
    "newSpecificationAR":{type:String},
    "totalQuantity" : { type: Number, default: 0 },
    "ticket" : { type: Number, default: 0 },
    "points" : { type: Number, default: 0 },
    "soldOut" : { type: Number, default: 0 },
    "campaignsPrize" : { type: Number, default: 0 },
    "isSoldOut" : { type: Boolean, default: false },
    "launchDate" : { type: Date },
    "expireDate" : { type: Date },    
    "isActive" :{type:Boolean,default:false},
    "keys" : [],
    "removeKeys" : [],
    "objectProcessor" : [],    
    "created": { type: Date, default: Date.now },
    "updated" : { type: Date }
});
module.exports = mongoose.model('campaigns', campaignSchema);


