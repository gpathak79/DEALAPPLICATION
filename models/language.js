var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    "languageEN" : { type: String, default: '' },
    "languageAR" : { type: String, default: '' },
    "languageCode" : { type: String, default: '' },
    "keys":["language"],
    "objectProcessor" : [],    
    "removeKeys":["languageEN","languageAR"]
},{ collection: 'languages' });
module.exports = mongoose.model('languages', productSchema);