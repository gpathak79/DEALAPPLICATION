var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    "nameEN" : { type: String, default: '' },
    "nameAR" : { type: String, default: '' },
    "countryCode" : { type: String, default: '' },
    "countryFlag" : { type: String, default: '' },    
    "keys":["name"],
    "objectProcessor" : [],    
    "removeKeys":["nameAR","nameEN"]
},{ collection: 'countries' });
module.exports = mongoose.model('countries', productSchema);