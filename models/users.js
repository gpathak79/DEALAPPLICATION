var mongoose = require('mongoose');
var Schema = mongoose.Schema;
userSchema = new Schema({
        userimage:{type:String,default:''},
        first_name:{type:String},
        last_name:{type:String},
        gender: {type:Number},
        email:{type:String},
        password:{type:String},
        countryCode:{type:String},
        mobile:{type:String},
        promo_code:{type:String},
        myPromoCode:{type:String},
        nationality:{type:String},
        residence: {type:String},
        language:{type:String},
        randOtp:{type:Number},
        updated:{type: Date,default:Date.now},
        created:{type: Date, default: Date.now},
        api_token:{type:String},
        isMobileNumberVerify: { type: Boolean, default: false }
});
module.exports = mongoose.model('users', userSchema);