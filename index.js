const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
env = require('dotenv').config();
global.path=require('path');
global.fs=require('fs');
global.bcrypt = require('bcryptjs');
global.crypto = require('crypto');
global.nodemailer = require('nodemailer');
global.jwt = require("jsonwebtoken");
//global.payfort = require("payfort-node");
//global.fx=require('money');
global.otpMaster=require("./models/otp");
global.multer=require('multer');
global.User=require("./models/users");
global.requestt = require('request');
global.PersonalizeUser=require("./models/language");
global.Campaigns=require("./models/campaign");
global.Product=require("./models/products");
global.Wish=require("./models/wishlist");
global.PurchasePoint=require("./models/purchasepoint");
global.promotionMedia=require("./models/promotion-media");
global.CodesAndMessages = require("./helpers/error-sucess-codes");
global.DeviceSignature = require("./models/devicesignature");
global.Card=require("./models/card");
global.UserUpld = require('./helpers/common-service'); /*Media Upload */
global.Languages=require("./models/language");
global.Countryies=require("./models/country");
global.Currencyies=require("./models/currency");
global.Cart=require("./models/cart");
global.Orders=require("./models/orders");
global.Tickets=require("./models/tickets");
global.Winners=require("./models/winners");
global.cloudinary = require('cloudinary').v2
global.client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DBCONN, { useNewUrlParser: true, useCreateIndex: true });
const apiUser = require('./routes/api.user')(router);
const apiCart = require('./routes/api.cart')(router);
const apiTickets = require('./routes/api.tickets')(router);
const apiImage = require('./routes/api.image')(router);
const apiCarD = require('./routes/api.card')(router);
const apiPurchasePoint = require('./routes/api.purchasepoint')(router);
const app = express();
app.use(bodyParser.json({ limit: '5000mb' }));
app.use(bodyParser.urlencoded({ limit: '5000mb', extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authtoken, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "*");
    console.log('--------------------------------request Details----------------------------------------', req.originalUrl);
    console.log('-----------------------------------------ENDS------------------------------------------');
    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
});
app.use('/api/user', apiUser);
app.use('/api/cart', apiCart);
app.use('/api/ticket', apiTickets);
app.use('/api/image', apiImage);
app.use('/api/card', apiCarD);
app.use('/api/purchase', apiPurchasePoint);
app.use(function (req, res, next) {
    const err = new Error('Bad Request');
    err.status = 400;
    console.log('err', err);
    res.json({ message: 'Bad Request', code: 400, result: {} });
    return;
});

process.on('uncaughtException', function (err) {
    console.log(err);
});
module.exports = app;