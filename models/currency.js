var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    "nameEN" : { type: String, default: '' },
    "nameAR" : { type: String, default: '' },
    "currencyCode" : { type: String, default: '' },
    "keys":["name"],
    "objectProcessor" : [],    
    "removeKeys":["nameAR","nameEN"]
},{ collection: 'currencyies' });
module.exports = mongoose.model('currencyies', productSchema);