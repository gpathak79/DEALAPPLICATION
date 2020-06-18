exports.checkMobileNumbers = (req, res) => {
    try {
     var userCheck = new Promise(function (resolve, reject) {
            User.find({'mobile': req.body.mobile,'countryCode':req.body.countryCode}).lean().exec(function (err, results) {
                if (err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage })
                } else {

            res.status(200).json({ 'httpCode': 200, 'code': (results.length?201:200), 'message':"Mobile number is already register.",'isRegister': (results.length?true:false)});

                }
            })
        })
    } catch (err) {
        res.status(500).json({
            'httpCode': CodesAndMessages.dbErrHttpCode,
            'code': CodesAndMessages.dbErrCode,
            'message': CodesAndMessages.dbErrMessage
        })
    }
}

exports.resendOtp = (req, res) => {
    try {
              let otp = Math.floor(1000 + Math.random() * 9000);
                otpMaster.updateOne({ 'mobile': req.body.mobile, 'countryCode': req.body.countryCode }, {  'mobile': req.body.mobile , 'countryCode': req.body.countryCode,'otp': 1234 }, { upsert: true }, function (saveErr, saveRes) {
            if (saveErr) {
                   res.json({
                            'code': 209,
                            'httpCode': 200,
                            'message': 'Wrong mobile number.'
                        });
            }else{
                 res.json({
                            'code': 200,
                            'httpCode': 200,
                            'message': 'Sucess..'
                        });
            }
        })
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

exports.VerifyOtp = (req, res) => {
    try {
    var userAccountOTP = new Promise(function (resolve, reject) {
            otpMaster.find({'mobile': req.body.mobile,'countryCode':req.body.countryCode}, function (err, results) {
                if (err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage })
                } else {
                    results.length ? resolve(results[0]) : reject({ 'message': 'OTP expire. Do it again.', 'code': 210,"httpCode":200});
                }
            })
        });


     var userCheck = new Promise(function (resolve, reject) {
            User.find({'mobile': req.body.mobile,'countryCode':req.body.countryCode}).lean().exec(function (err, results) {
                if (err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage })
                } else {
                    results.length ? resolve({'userData':results[0],'isRegister':true}) : resolve({'userData':{},'isRegister':false}); }
            })
        })

        Promise.all([userAccountOTP, userCheck]).then(function (results) {
            res.status(200).json({ 'httpCode': 200, 'code': (results[0].otp===req.body.otp?200:209),'message':(results[0].otp===req.body.otp?"Success.":"Wrong otp."),'isOTPCorrect':(results[0].otp===req.body.otp?true:false),'token':(((results[0].otp===req.body.otp) && (results[1].isRegister))?jwt.sign({"id": results[1].userData._id}, process.env.JWTPASS, {"expiresIn": process.env.JWTEXPIRETIME}):""),'data':(results[0].otp===req.body.otp?results[1].userData:{}),'isRegister':results[1].isRegister});            
        }).catch(function (err) {
            console.log('/////////////////',err)
            res.status(err.httpCode).json(err);
        });        
    } catch (err) {
        res.status(500).json({
            'httpCode': CodesAndMessages.dbErrHttpCode,
            'code': CodesAndMessages.dbErrCode,
            'message': CodesAndMessages.dbErrMessage
        })
    }
}

exports.ApplyCoupon = (req, res) => {
    try {
        const checkuser = new Promise((resolve, reject) => {
            User.find({
                'myPromoCode': req.body.promo_code
            }, (err, results) => {
                if (err) {
                    reject({
                        'httpCode': CodesAndMessages.dbErrHttpCode,
                        'code': CodesAndMessages.dbErrCode,
                        'message': CodesAndMessages.dbErrMessage
                    });
                } else {
                    !results.length ? reject({
                        'message': 'Wrong Promo code.',
                        'code': 210,
                        "httpCode": 200
                    }) : reject({
                        'message': 'Applied.',
                        'code': 200,
                        "httpCode": 200
                    })
                }
            });
        });

        Promise.all([checkuser]).then((results) => {

        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });

    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}
//user registration
exports.Registration = (req, res) => {
    try {
        const emailCheck = new Promise((resolve, reject) => {
            User.find({
                $or: [{
                    'email': req.body.email
                }, {
                    'mobile': req.body.mobile
                }]
            }, (err, results) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    if (results.length){
                    reject({
                        'message': 'Email or Mobile number already registered. Please login into the app',
                        'code': 210,
                        "httpCode": 200
                    })
                    }else{
                        resolve([])
                    }
                }
            });
        });
        Promise.all([emailCheck]).then((results) => {
                User.create({
                    "first_name": req.body.first_name,
                    "last_name": req.body.last_name,
                    "gender": req.body.gender,
                    "email": req.body.email,
                    "password": req.body.password,
                    "countryCode": req.body.countryCode,
                    "mobile": req.body.mobile,
                    "promo_code": req.body.promo_code,
                    "nationality": "",
                    "residence": "",
                    "userimage":"https://res.cloudinary.com/appther-mobility-technologies-pvt-ltd/image/upload/v1589102279/photo_f07gav.png",
                    "myPromoCode":Math.floor(1000000 + Math.random() * 9000000),
                    "language": req.body.language,
                    "isMobileNumberVerify":true
                }, (err, data) => {
                    if (err) {
                        if (err){
                            res.send({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
                        }
                    } else {
                    var token = jwt.sign({
                    "id": data._id
                }, process.env.JWTPASS, {
                    "expiresIn": process.env.JWTEXPIRETIME
                });   
                res.send({
                    'code': 200,
                    'httpcode': 200,
                    'message': 'Sucess.',
                    'data':data,
                    'token':token
                });                    
            Cart.create({'userId':data._id,'items':[],'isDoubleTicket':true},function(err,cartResponse) {
                if (err){
                    console.log('err',err)
                }
            })
                    }
                });
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', err);
    }
}

//User Login 

exports.Login = (req, res) => {
    try {
        /* check user mobile in database*/
        var emailcheck = new Promise(function(resolve, reject) {
            User.find({$or:[{
                                        'email': req.body.mobile
                                    },{
                'mobile': req.body.email,
                'countryCode': req.body.countryCode                
            }]}, function(err, results) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    if (results.length){
                        if (results[0].isMobileNumberVerify === false){
                            resolve({'isSendOTP':true,'user':results[0]})
                        }else{
                            resolve({'isSendOTP':false,'user':results[0]})
                        }
                    }else{
                    reject({
                        'message': 'Email Not found.',
                        'code': 210,
                        "httpCode": 200
                    })
                    }
                }
            })
        });
        Promise.all([emailcheck]).then(function(results) {
                                if (results[0].isSendOTP===false){
    if (results[0].user.password === req.body.password) {
        var token = jwt.sign({
            id: results[0].user._id
        }, process.env.JWTPASS, {
            expiresIn: process.env.JWTEXPIRETIME
        });
        res.send({
                    'code': 200,
                    'message': 'Authentication successful',
                    'data':results[0].user,
                    'token': token
                });
    } else {
        res.send({
            'code': 210,
            'httpcode': 200,
            'message': 'Enter Valid Password',
        });
    }
                                }else{
                const otpMessage = 'OTP for deallapp is: ' + results[0].user.randOtp;
                const phoneWithCountryCode = results[0].user.countryCode + '' + results[0].user.mobile;
                client.messages.create({
                        to: phoneWithCountryCode,
                        from: process.env.TWILIO_PHONE,
                        body: otpMessage
                    }).then((result) => {
                        console.log(result);
                        res.json({
                            'code': 201,
                            'httpCode': 200,
                            'message': 'Mobile number is not verify. Please verify your mobile number.'
                        });
                    }).catch((e) => {
                    res.json({
                            'code': 209,
                            'httpCode': 200,
                            'message': 'Wrong mobile number.'
                        });
                    })
                }
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (e) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', e);
    }
}


//Social Login
exports.SocialLogin = (req, res) => {
    try {
        //check email in database
        const emailCheck = new Promise((resolve, reject) => {
            User.find({
                'email': req.body.email
            }, (err, results) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    !results.length ? reject({
                         'code': 202,
                         "httpCode": 200,
                         'message': 'Email not Registered'
                    }) : resolve({
                        'message': 'Sucess registered',
                        'code': 200,
                        "httpCode": 200,
                        "isRegistred": true,
                        'data': results[0]
                    })
                }
            });
        });
        Promise.all([emailCheck]).then((results) => {
        var token = jwt.sign({
            id: results[0]._id
        }, process.env.JWTPASS, {
            expiresIn: process.env.JWTEXPIRETIME
        });
        res.send({
                    'code': 200,
                    'message': 'Authentication successful',
                    'data':results[0].data,
                    'token': token
                });
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        });
        console.log('catch login', err);
    }
}

//forgot password

exports.ForgotPassword = (req, res) => {

    try {

        var checkemail = new Promise((resolve, reject) => {

            User.find({$or:[{
                                        'email': req.body.mobile
                                    },{
                'mobile': req.body.email,
                'countryCode': req.body.countryCode                
            }]}, (err, results) => {

                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    results.length ? resolve(results[0]) : reject({
                        'message': 'Email Not Found',
                        'code': 210,
                        "httpCode": 200
                    })
                }
            });
        });

        Promise.all([checkemail]).then((results) => {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }

            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // use SSL
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                }
            });
            const mailOptions = {
                from: process.env.EMAIL, // sender address
                to: req.body.email, // list of receivers
                subject: "syb", // Subject line
                text: randomstring
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
            bcrypt.hash(randomstring, 10, (err, hash) => {

                if (err) {
                    res.send({
                        'code': 400,
                        'message': 'User Error.',
                        'data': ""
                    });
                } else {
                    User.findOneAndUpdate({
                        '_id': results[0]._id
                    }, {
                        $set: {
                            'password': randomstring
                        }
                    }, {
                        new: true
                    }, function(err, update) {
                        if (err) {
                            return res.json({
                                httpCode: CodesAndMessages.dbErrHttpCode,
                                code: CodesAndMessages.dbErrCode,
                                message: CodesAndMessages.dbErrMessage
                            })
                        } else {
                            res.json({
                                "HttpCode": 200,
                                "Code": 200,
                                "message": "Password Send To Mobile Number Succesfull And Password Changed"
                            })
                        }
                    })
                }
            })
        }).catch((err) => {

            res.status(err.httpCode).json(err);
        });

    } catch (err) {

        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}


//Logout

exports.Logout = (req, res) => {
    try {
        var finduser = new Promise((resolve, reject) => {
            User.find({
                'email': req.body.email
            }, (err, results) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    });
                } else {
                    results.length ? resolve(results[0]) : reject({
                        'message': 'Email Not Found',
                        'code': 210,
                        "httpCode": 200
                    });
                }
            });
        });

        Promise.all([finduser]).then((results) => {
            User.updateOne({
                '_id': req.userId
            }, {
                $set: {
                    'api_token': ""
                }
            }, function(err, result) {
                if (err) {
                    res.send({
                        'code': 201,
                        'message': err.message
                    });
                } else {

                    res.send({
                        'code': 200,
                        'message': 'Logout Succesfully',
                    })
                }

            });
        }).catch((err) => {

            res.status(err.httpCode).json(err);
        })
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}


//Products

exports.Products = (req, res) => {
    try {
        const checkuser = new Promise((resolve, reject) => {
            Product.find({}).lean().exec((err, response) => {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response.length ? reject({
                        "httpCode": 200,
                        "code": 210,
                        "message": "Products Not Found."
                    }) : resolve(response)
                }
            });
        });
        Promise.all([checkuser]).then((results) => {
            res.send({
                'code': 200,
                'message': 'Sucess',
                'data': UserUpld.languageFilter(req.query.language, req.query.currency, results[0],[],[])
            })
        }).catch((err) => {
            res.status(500).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}


//Product Details

exports.ProductDetails = (req, res) => {

    try {
        const checkuser = new Promise((resolve, reject) => {
            Product.find({
                '_id': req.query.productId,
                "isSoldOut": false
            }).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response.length ? reject({
                        "httpCode": 200,
                        "code": 210,
                        message: "Product Not Found."
                    }) : resolve(response)
                }
            });
        });
        Promise.all([checkuser]).then((results) => {
            res.send({
                'code': 200,
                'message': 'Sucess',
                'data': UserUpld.languageFilter(req.query.language, req.query.currency, results[0],[],[])
            })
        }).catch((err) => {
            res.status(500).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

//Home
exports.Homes = (req, res) => {
    try {
        var quantity = 0;      
        const promotions = new Promise((resolve, reject) => {
            promotionMedia.find({}).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        const closingCampaigns = new Promise((resolve, reject) => {
            Campaigns.find({
                "isActive": true,
                "$or": [{"soldPercentage":{$gte:75}},{"expireDate":{$lte:(new Date()).setDate((new Date()).getDate() + 2)}}],
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        const runningCampaigns = new Promise((resolve, reject) => {
            Campaigns.find({
                "isActive": true,
                "launchDate": {$lte : new Date()},
                "expireDate": {$gte : new Date()}
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });
        const finishCampaigns = new Promise((resolve, reject) => {
            Campaigns.find({
                "isActive": true,
                "expireDate": {$lte : new Date()}
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        const upcommingCampaigns = new Promise((resolve, reject) => {
            Campaigns.find({
                "isActive": true,
                "launchDate": {$gte : new Date()}
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        const winners = new Promise((resolve, reject) => {
            Winners.find({}).populate([{
                "path": "campaignId",
                "populate": {
                "path": 'productId',
                "model": 'products'
             }},{
                "path": "userId","select":{"userimage":1,"first_name":1,"last_name":1}},{
                "path": "ticketId","select":{"ticketId":1}}]).sort({"created":1}).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        const myWishList = new Promise((resolve, reject) => {
            if (req.userId !==''){
                Wish.find({'userId':req.userId}).distinct('campaignsId').lean().exec((err, response) => {
                    if (err) {
                        reject({
                            'httpCode': CodesAndMessages.dbErrHttpCode,
                            'code': CodesAndMessages.dbErrCode,
                            'message': CodesAndMessages.dbErrMessage
                        })
                    } else {
                        resolve(response)
                    }
                });                
            }else{
                    resolve([])
            }
        });

     const myCartList = new Promise((resolve, reject) => {
            if (req.userId !==''){
                Cart.find({"userId": req.userId}).lean().exec((err, response) => {
                    if (err) {
                        reject({
                            'httpCode': CodesAndMessages.dbErrHttpCode,
                            'code': CodesAndMessages.dbErrCode,
                            'message': CodesAndMessages.dbErrMessage
                        })
                    } else {
                        for (var i = 0; i < response[0].items.length; i++) {
                            response[0].items[i]["cartId"] = response[0]._id
                            quantity = quantity + response[0].items[i].quantity
                        }
                        resolve(response[0].items)
                    }
                });                
            }else{
                    resolve([])
            }
        });

        Promise.all([promotions, closingCampaigns, runningCampaigns, finishCampaigns, upcommingCampaigns, winners, myWishList, myCartList]).then((results) => {



var responseData = [];
            for (var i = 0; i < results[5].length; i++) {
                responseData.push({"userId":results[5][i].userId,"ticketId":results[5][i].ticketId,"created":results[5][i].created,"campaignsId":UserUpld.languageFilter(req.query.language, req.query.currency, [results[5][i].campaignId], [], [])})
            }

            res.send({
                'code': 200,
                'message': 'Sucess',
                'data': {
                    "mediaData": UserUpld.languageFilter(req.query.language, req.query.currency, results[0],[],[]),
                    "runningCampaigns": UserUpld.languageFilter(req.query.language, req.query.currency, results[2],results[6],results[7]),
                    "finishCampaigns": UserUpld.languageFilter(req.query.language, req.query.currency, results[3],results[6],results[7]),
                    "closingCampaigns": UserUpld.languageFilter(req.query.language, req.query.currency, results[1],results[6],results[7]),
                    "upcommingCampaigns": UserUpld.languageFilter(req.query.language, req.query.currency, results[4],results[6],results[7])
                },
                "quantity":quantity,
                "campaignsWinners": responseData
            })
        }).catch((err) => {
            console.log('err', err);
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

//Campaigns Details
exports.CampaignDetails = (req, res) => {
    try {
        const campaignInfo = new Promise((resolve, reject) => {
            Campaigns.find({
                "isActive": true,
                "_id":req.query.campaignId
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response.length ? reject({
                        "httpCode": 200,
                        "code": 210,
                        "message": "Campaign Not Found."
                    }) : resolve(response)
                }
            });
        });

        const myWishList = new Promise((resolve, reject) => {
            if (req.userId !==''){
                Wish.find({'userId':req.userId}).distinct('campaignsId').lean().exec((err, response) => {
                    if (err) {
                        reject({
                            'httpCode': CodesAndMessages.dbErrHttpCode,
                            'code': CodesAndMessages.dbErrCode,
                            'message': CodesAndMessages.dbErrMessage
                        })
                    } else {
                        resolve(response)
                    }
                });                
            }else{
                    resolve([])
            }
        });

     const myCartList = new Promise((resolve, reject) => {
            if (req.userId !==''){
                Cart.find({"userId": req.userId}).lean().exec((err, response) => {
                    if (err) {
                        reject({
                            'httpCode': CodesAndMessages.dbErrHttpCode,
                            'code': CodesAndMessages.dbErrCode,
                            'message': CodesAndMessages.dbErrMessage
                        })
                    } else {
                        console.log(response)
                        for (var i = 0; i < response[0].items.length; i++) {
                            response[0].items[i]["cartId"] = response[0]._id
                        }
                        resolve(response[0].items)
                    }
                });                
            }else{
                    resolve([])
            }
        });


        Promise.all([campaignInfo, myWishList, myCartList]).then((results) => {
            res.send({
                'code': 200,
                'message': 'Sucess',
                'data': UserUpld.languageFilter(req.query.language, req.query.currency, results[0],results[1],results[2])
            })
        }).catch((err) => {
            console.log('err', err);
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}


//Personalize

exports.Personalize = (req, res) => {
    try {

        const checklanguage = new Promise((resolve, reject) => {
            Languages.find({}).lean().exec((err, response) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });
        const checkcountry = new Promise((resolve, reject) => {
            Countryies.find({}).lean().exec((err, response) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });
        const checkcurrency = new Promise((resolve, reject) => {
            Currencyies.find({}).lean().exec((err, response) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });

        Promise.all([checklanguage, checkcountry, checkcurrency]).then((results) => {
            res.send({
                'code': 200,
                'httpccode': 200,
                'message': 'sucess',
                'data': {
                    "language": UserUpld.languageFilter(req.query.language, "", results[0],[],[]),
                    "country": UserUpld.languageFilter(req.query.language, "", results[1],[],[]),
                    "currency": UserUpld.languageFilter(req.query.language, "", results[2],[],[]),
                    'ilevels':50,
                    'ipoints':{'etp':50,'etr':0,'te':50,'ts':50,'ab':20}


                }
            })
        }).catch((err) => {
            console.log('err', err);
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

exports.CountryiesData = (req, res) => {
    try {

        const checkcountry = new Promise((resolve, reject) => {
            Countryies.find({}).lean().exec((err, response) => {
                if (err) {
                    reject({
                        httpCode: CodesAndMessages.dbErrHttpCode,
                        code: CodesAndMessages.dbErrCode,
                        message: CodesAndMessages.dbErrMessage
                    })
                } else {
                    resolve(response)
                }
            });
        });
        
        Promise.all([checkcountry]).then((results) => {
            res.send({
                'code': 200,
                'httpccode': 200,
                'message': 'sucess',
                'data': UserUpld.languageFilter(req.query.language, "", results[0],[],[])
            })
        }).catch((err) => {
            console.log('err', err);
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

//Add Product

exports.AddProducts = (req, res) => {

    try {
        Product.create({
            "typeOfProduct": req.body.typeOfProduct,
            "productImageUrl": req.body.productImageUrl,
            "productTaxEN": req.body.productTaxEN,
            "productTaxAR": req.body.productTaxAR,
            "productDetailTitleEN": req.body.productDetailDesEN,
            "productDetailTitleAR": req.body.productDetailTitleAR,
            "productDetailDesEN": req.body.productDetailDesEN,
            "productDetailDesAR": req.body.productDetailDesAR,
            "productPrice": req.body.productPrice,
            "keys": req.body.keys,
            "removeKeys": req.body.removeKeys,
            "objectProcessor" : req.body.objectProcessor

        }, (err, data) => {
            if (err) {
                if (err) return res.send({
                    HttpCode: CodesAndMessages.dbErrHttpCode,
                    Code: CodesAndMessages.dbErrCode,
                    'message': CodesAndMessages.dbErrMessage,
                });
            } else {

                res.send({
                    'code': 200,
                    'message': 'Product Created successful',
                    data
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            httpCode: CodesAndMessages.dbErrHttpCode,
            code: CodesAndMessages.dbErrCode,
            message: CodesAndMessages.dbErrMessage
        })
    }
}

//Add campaign





exports.AddCampaigns = (req, res) => {

    try {
        Campaigns.create({

                "productId" : req.body.productId,
                "campaignUrl" : req.body.campaignUrl,
                "campaignLabelEN" : req.body.campaignLabelEN,    
                "campaignLabelAR" : req.body.campaignLabelAR,
                "campaignDesEN" : req.body.campaignDesEN,          
                "campaignDesAR" : req.body.campaignDesAR,
                "campaignTermEN" : req.body.campaignTermEN,
                "campaignTermAR" : req.body.campaignTermAR,
                "campaignSpecificationEN" : req.body.campaignSpecificationEN,
                "campaignSpecificationAR" : req.body.campaignSpecificationAR,        
                "totalQuantity" : req.body.totalQuantity,
                "soldOut" : req.body.soldOut,
                "launchDate" : req.body.launchDate,
                "expireDate" : req.body.expireDate,   
                "keys" : req.body.keys,
                "removeKeys" :req.body.removeKeys,
                "objectProcessor" : req.body.objectProcessor
        }, (err, data) => {
            if (err) {
                if (err) return res.send({
                    "httpCode": CodesAndMessages.dbErrHttpCode,
                    "code": CodesAndMessages.dbErrCode,
                    'message': CodesAndMessages.dbErrMessage,
                });
            } else {

                res.send({
                    'code': 200,
                    'message': 'Campaign  Created successful',
                    'data':data
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}


//getWishlistProduct
exports.getWishlistProduct = (req, res) => {
    try {
        const checkwishproduct = new Promise((resolve, reject) => {
        Wish.find({'userId':req.userId}).populate([{
                "path": "campaignsId",
                "populate": {
                "path": 'productId',
                "model": 'products'
             }}]).lean().exec((err, response) => {
            if (err) {
                reject({
                    'httpCode': CodesAndMessages.dbErrHttpCode,
                    'code': CodesAndMessages.dbErrCode,
                    'message': CodesAndMessages.dbErrMessage
                })
            } else {
                !response.length ? reject({
                    'httpcode': 200,
                    'code': 202,
                    'message': 'No wishlist found.'
                }) : resolve(response)
            }
        });
    });
    
     const myCartList = new Promise((resolve, reject) => {
            if (req.userId !==''){
                Cart.find({"userId": req.userId}).lean().exec((err, response) => {
                    if (err) {
                        reject({
                            'httpCode': CodesAndMessages.dbErrHttpCode,
                            'code': CodesAndMessages.dbErrCode,
                            'message': CodesAndMessages.dbErrMessage
                        })
                    } else {
                        let quantity = 0;
                        for (var i = 0; i < response[0].items.length; i++) {
                            response[0].items[i]["cartId"] = response[0]._id
                            quantity = quantity + response[0].items[i].quantity
                        }
                        resolve(response[0].items)
                    }
                });                
            }else{
                    resolve([])
            }
        });


        Promise.all([checkwishproduct, myCartList]).then((results) => {
            var responseData  = [];
            for (var i = 0; i < results[0].length; i++) {
                responseData.push({"_id":results[0][i]._id,'campaignsId':UserUpld.languageFilter(req.query.language, req.query.currency, [results[0][i].campaignsId],[],results[1])})
            }
            res.send({'code': 200,'httpcode':200,'message':"Sucess",'data':responseData});
        }).catch((err) => {
            res.status(200).json(err);
        });
    } catch (err) {
        res.status(200).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}



//Wishlist
exports.Wishlist = (req, res) => {
    try {
      
        const checkwishproduct = new Promise((resolve, reject) => {
        Wish.find({'userId':req.userId,'campaignsId':req.body.campaignsId}, (err, response) => {
            if (err) {
                reject({
                    "httpCode": CodesAndMessages.dbErrHttpCode,
                    "code": CodesAndMessages.dbErrCode,
                    "message": CodesAndMessages.dbErrMessage
                })
            } else {
                response.length ? reject({
                    "httpcode": CodesAndMessages.Wishlist.HttpCode,
                    "code": CodesAndMessages.Wishlist.CheckWishProductCode,
                    "message": CodesAndMessages.Wishlist.CheckWishProduct
                }) : resolve(1)
            }
        });
    });
    
        Promise.all([checkwishproduct]).then((results) => {
            Wish.create({'userId':req.userId,'campaignsId':req.body.campaignsId}, (err, data) => {
                if (err) {
                    if (err){
                        res.send({
        "httpCode": CodesAndMessages.dbErrHttpCode,
        "code": CodesAndMessages.dbErrCode,
        "message": CodesAndMessages.dbErrMessage
    });
                    }
                } else {
            res.send({
                "code": CodesAndMessages.code,
                "httpcode":CodesAndMessages.HttpCode,
                "message": CodesAndMessages.Wishlist.WishlistCreate,
                'data':data,
            });
                }
            });

        }).catch((err) => {
            res.status(500).json(err);
        });
    } catch (err) {
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}

//Delete wishlist


exports.DeleteWishlistProduct = (req, res) => {
    try {
        //check user id and contact id
        const DeleteId = new Promise((resolve, reject) => {
            Wish.find({'campaignsId': req.body.campaignsId,'userId': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ "message":"Id not found.","code":210,"httpcode":200}) :
                    resolve(results[0]);
                }
            });
        });
            DeleteId
            .then((results) => {
            Wish.deleteOne({
                '_id' : results._id
            }, function(err) {
                if (err){
                    res.send(err);
                }
                else{
                    res.send({"code":200,"httpcode":200,"message":"Succesfully."});   
                }
            });
        })
            .catch(function (err) {               
                res.status(500).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
    }
}

//Delete User


exports.DeleteUser = (req, res) => {
    try {
        //find user 
        const finduser = new Promise((resolve, reject) => {
            User.find({'_id': req.body.userId}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message':'User Not Find','code':210,'httpcode':200}) :
                    resolve(1);
                }
            });
        });
  
            Promise.all([finduser]).then((results) => {      
            User.remove({
                _id: req.body.userId
            }, function(err) {
                if (err)
                    res.send(err);
                else
                    res.send({'code':200,'httpcode':200,'meesage':'User Deleted Succesfully'}); 
            })
        Wish.remove({
            userId: req.body.userId
        }, function(err) {
            if (err)
                res.send(err);
            else
             console.log(' ');  
        })
    }).catch(function (err) { 
                res.status(500).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
  
    }
}

//Device Signature
exports.DeviceSignature=(req,res)=>{
   
    try{

  const finduser = new Promise((resolve, reject) => {
            DeviceSignature.find({'userId': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    results.length ? reject({ 'message':'User Already Exist','code':210,'httpcode':200}) :
                    resolve(1);
                }
            });
        });
  
            Promise.all([finduser]).then((results) => {   


        DeviceSignature.create({
           
        'userId': req.userId, 'country': req.body.country, 'userType': req.body.userType, 'deviceId': req.body.deviceId, 'deviceToken': req.body.deviceToken, 'deviceModel': req.body.deviceModel, 'deviceType': req.body.deviceType, 'osVersion': req.body.osVersion

        }, (err, data) => {
            if (err) {
                if (err) return res.send({
                    "httpCode": CodesAndMessages.dbErrHttpCode,
                    "code": CodesAndMessages.dbErrCode,
                    'message': CodesAndMessages.dbErrMessage,
                });
            } else {

                res.send({
                    'code': 200,
                    'message': 'Device Signature Createed',
                    'data':data
                });
            }
        });

    }).catch(function (err) { 
        res.status(500).json(err);
    });      
    }
    catch(err){
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage});
    }
}

//Update User Information
exports.UserInformation = (req,res) => {
    try {
        const checkuser = new Promise((resolve, reject) => {
            User.find({'_id': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message': 'User Not Found',  "code": CodesAndMessages.code, "httpcode":CodesAndMessages.HttpCode,}) :
                    resolve(results[0]);


                }
            });
        });
        
            checkuser
            .then((results) => {      
                User.findOneAndUpdate({'_id':req.userId}, {$set:{
                    "first_name": req.body.first_name,
                    "last_name": req.body.last_name,
                    "gender":req.body.gender
             }
                },{upsert: 1,new:true}, (err, result) => {
         
                if(err) {
                    if(err) return res.send({"httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage});
                } else {           
    
                    res.send({
                        "code": CodesAndMessages.code,
                        "message": CodesAndMessages.sucessmessage,
                        "httpcode":CodesAndMessages.HttpCode,
                        'data': result
                    });
                }
            })
        })
            .catch(function (err) {
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

    }
}


//Update User Information
exports.iPoints = (req,res) => {
try {
    console.log('jiji')
const checkuser = new Promise((resolve, reject) => {
User.find({'_id': req.userId}, (err, results) => {
if(err) {
reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
} else {
!results.length ? reject({ 'message': 'User Not Found', "code": CodesAndMessages.code, "httpcode":CodesAndMessages.HttpCode,}) :
resolve(results[0]);


}
});
});

checkuser
.then((results) => {
res.send({
"code": 200,
"message": 'Sucess',
"httpcode":200,
'data': {'etp':50,'etr':0,'te':50,'ts':50,'ab':20}
});
})
.catch(function (err) {
res.status(err.httpCode).json(err);
});
} catch (err) {
res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

}
}

//Update User Information
exports.iLevel = (req,res) => {
    try {
        const checkuser = new Promise((resolve, reject) => {
            User.find({'_id': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message': 'User Not Found',  "code": CodesAndMessages.code, "httpcode":CodesAndMessages.HttpCode,}) :
                    resolve(results[0]);


                }
            });
        });
        
            checkuser
            .then((results) => {
                res.send({
                        "code": 200,
                        "message": 'Sucess',
                        "httpcode":200,
                        'data': {'ilevels':50}
                    });
            })
            .catch(function (err) {
                res.status(500).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

    }
}


//Update User Information
exports.ChangePassword = (req,res) => {
    try {
        const checkuser = new Promise((resolve, reject) => {
            User.find({'_id': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message': 'User Not Found',  "code": CodesAndMessages.code, "httpcode":CodesAndMessages.HttpCode,}) :
                    resolve(results[0]);


                }
            });
        });
        
            checkuser
            .then((results) => { 
            if (results.password !== req.body.oldPassword){
                res.send({
                        "code": 215,
                        "message": "Wrong old password.",
                        "httpcode":200,
                    });
            }else{
                User.findOneAndUpdate({'_id':req.userId}, {$set:{
                    "password":req.body.newPassword
             }
                },{upsert: 1,new:true}, (err, result) => {
                if(err) {
                    if(err) return res.send({"httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage});
                } else {           
                    res.send({
                        "code": CodesAndMessages.code,
                        "message": CodesAndMessages.sucessmessage,
                        "httpcode":CodesAndMessages.HttpCode,
                        'data': result
                    });
                }
            })
            }     
        })
            .catch(function (err) {
                res.status(err.httpCode).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

    }
}


exports.Ipoint =(req,res)=>{
    try{
        const checkuser = new Promise((resolve, reject) => {
            PurchasePoint.find({'userId': req.userId}, (err, results) => {
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else { 
                    if(results.length)
                    {
                       var totalpoint = results.reduce(function (point,total) {
                         return point+total.points;
                      }, 0);
                        resolve({"points":totalpoint})
                    }
                    else
                    {
                        resolve({"points":0})
                    }
                }
            });
        });
            checkuser
            .then((results) => {      
            var PurchasePoint=results.points;
            var ReferralPoint=5;
            var TotalEarned=PurchasePoint+ReferralPoint;
            var TotalSpent=2;
            var AvailablePoint=TotalEarned-TotalSpent;

            res.send({"httpcode":200,"code":200,"data":{purchasepoint:PurchasePoint,referralpoint:ReferralPoint,totalearned:TotalEarned,totalspent:TotalSpent,availablepoint:AvailablePoint}});


        }).catch(function (err) {
            res.status(500).json(err);
        });

    }
    catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

    }
}

//CheckMobileNumber
exports.CheckMobileNumber=(req,res)=>{
    try{

        const checkmobile = new Promise((resolve, reject) => {
            User.find({'countryCode' : req.body.countryCode,'mobile': req.body.mobile}, (err, results) => {
        
                if(err) {
                    reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
                } else {
                    console.log(results)
                    !results.length ? resolve(0) :
                    resolve(1);
                }
            });
        });
        Promise.all([checkmobile]).then((results) => { 
            console.log(results.length)
            if(results[0])
            {
                res.send({"code":200,"httpcode":200,"Message":"Sucess"});
            }
            else
            {
                res.send({"code":210,"httpcode":200,"Message":"Mobile Not Found"});
            }
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }
    catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

    }
}