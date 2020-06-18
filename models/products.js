var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    "typeOfProduct" : { type: String, default: '' },//"gold",goods,phonenumber,"cash"
    "productImageUrl" : { type: String, default: '' },
    "productTaxEN" : { type: String, default: '' },
    "productTaxAR" : { type: String, default: '' },
    "productDetailTitleEN" : { type: String, default: '' },
    "productDetailTitleAR" : { type: String, default: '' },
    "productDetailDesEN" : { type: String, default: '' },
    "productDetailDesAR" : { type: String, default: '' },
    "productPrice":{ type: Number, default: 0 },
    "keys":[],
    "removeKeys":[],
    "objectProcessor" : [],
    "isDelete": { type: Boolean, default: false },
    "created": { type: Date, default: Date.now },
    "updated": { type: Date }//updated
},{ collection: 'products' });
module.exports = mongoose.model('products', productSchema);