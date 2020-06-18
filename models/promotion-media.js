var mongoose = require('mongoose');
var promotionMediaSchema = new mongoose.Schema({
	"typeofmedia" : { type: String, default: '' },//"image",video
    "url" : { type: String, default: '' },
    "thumbnail" : { type: String, default: '' },
    "productId" : { type: String, default: '' },
	"labelEN" : { type: String, default: '' },          
    "labelAR" : { type: String, default: '' },
    "descEN" : { type: String, default: '' },
    "descAR" : { type: String, default: '' },    
	"isDelete": { type: Boolean, default: false },
	"keys":[],
	"removeKeys":[],
    "created": { type: Date, default: Date.now },
    "updated": { type: Date }//updated
},{ collection: 'media' });
module.exports = mongoose.model('media', promotionMediaSchema);