var mongoose = require('mongoose');
var Schema = mongoose.Schema;
promotionsSchema = new Schema({
			labelEN : {type:String},          
            labelAR : {type:String},
            descEN : {type:String},
            descAR : {type:String},
            image : {type:String},
            video :{type:String}
        
});
module.exports = mongoose.model('promotions', promotionsSchema);


