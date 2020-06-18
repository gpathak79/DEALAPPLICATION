/* 
 *
 * Project: Deal
 * File: otp.js
 * Purpose: Driver for the application - Collection Name: OTP
 */

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    mobile: {type: String,default:''},
    countryCode: {type: String,default:''},
    otp: {type: String,default:"123456"},
    expiryDate:{type: Date},
    created:{type: Date, default: Date.now}
},{ collection: 'otp' });
module.exports = mongoose.model('otp', schema);