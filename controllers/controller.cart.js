exports.AddToCart = (req, res) => {
    try {
        var campaignsinfo = new Promise(function(resolve, reject) {
            Campaigns.find({
                "_id": req.body.campaignId,
                "isActive": true,
            }).populate([{
                "path": "productId"
            }]).lean().exec(function(err, response) {
                if (err) {
                    console.log('err', err)
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response.length ? reject({
                        'httpCode': 200,
                        'code': 201,
                        'message': 'No campaigns found!!'
                    }) : resolve(response[0]);
                }
            });
        });

        var campaignChatCheck = new Promise(function(resolve, reject) {
            Cart.find({
                "userId": req.userId,
                "items": {
                    "$elemMatch": {
                        "campaignsId": req.body.campaignId
                    }
                }
            }).exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    response.length ? reject({
                        'httpCode': 200,
                        'code': 201,
                        'message': 'Already added into  cart!!'
                    }) : resolve([]);
                }
            });
        });
        
        Promise.all([campaignsinfo, campaignChatCheck]).then(function(results) {
            Cart.findOneAndUpdate({
                "userId": req.userId
            }, {
                '$addToSet': {
                    'items': [{
                        "campaignsId": req.body.campaignId,
                        "quantity": 1
                    }]
                }
            },{new: true}).lean().exec(function(err, response) {
                if (err) {
                    res.status(CodesAndMessages.dbErrHttpCode).json({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                }else{
                    response.items[response.items.length - 1]["cartId"] = response._id
                    var quantity = 0;
                    for (var i = 0; i < response.items.length; i++) {
                        quantity = quantity + response.items[i].quantity
                    }

                    res.status(200).json({
                        "httpCode": 200,
                        "code": 200,
                        "message": "Sucess",
                        "cartInfo": [response.items[response.items.length - 1]],
                        "quantity":quantity
                    })
                }
            })
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });

    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}
exports.UserCart = (req, res) => {
    try {
        var campaignChatCheck = new Promise(function(resolve, reject) {
            Cart.find({
                "userId": req.userId
            }).populate([{
                "path": "items.campaignsId",
                "populate": {
                    "path": 'productId',
                    "model": 'products'
                }
            }]).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response[0].items.length ? reject({
                        'httpCode': 200,
                        'code': 201,
                        'message': 'Empty cart!!'
                    }) : resolve({
                        "cartId": response[0]._id,
                        "items": response[0].items,
                        "isDoubleTicket":response[0].isDoubleTicket
                    });
                }
            });
        });

        Promise.all([campaignChatCheck]).then(function(results) {
            var responseData = [],
                totalAmt = 0,
                totalProdcut = 0,
                totalPoints = 0,
                quantity = 0,
                totalTickets = 0;
            for (var i = 0; i < results[0].items.length; i++) {
                totalAmt = totalAmt + (results[0].items[i].campaignsId.productId.productPrice * results[0].items[i].quantity);
                totalProdcut = totalProdcut + results[0].items[i].quantity
                quantity = quantity + results[0].items[i].quantity                
                totalTickets = totalTickets +  (results[0].items[i].campaignsId.ticket * results[0].items[i].quantity)
                totalPoints = totalPoints +  (results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                responseData.push({
                    "cartId": results[0].cartId,
                    "_id": results[0].items[i]._id,
                    "quantity": results[0].items[i].quantity,
                    'campaignsId': UserUpld.languageFilter(req.query.language, req.query.currency, [results[0].items[i].campaignsId], [], [])
                })
            }
            res.status(200).json({
                'httpCode': 200,
                'code': 200,
                'message': "Sucess.",
                'data': {
                    'totalAmt': totalAmt,
                    'totalProdcut': totalProdcut,
                    'totalTickets': (results[0].isDoubleTicket?(totalTickets * 2):totalTickets),
                    'totalPoints': totalPoints,
                    'isDoubleTicket':results[0].isDoubleTicket,
                    'items': responseData,
                    'quantity':quantity
                }
            })
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}


exports.AddQuantityBack = (req, res) => {
    try {
        var addQuantityUpdate = new Promise(function(resolve, reject) {
            Cart.updateOne({
                '_id': req.body.cartId,
                "userId": req.userId,
                "items._id": req.body.itemId
            }, {
                '$inc': {
                    "items.$.quantity": 1
                },
                '$set': {
                    'items.$.updated': new Date()
                }
            }, {
                new: true
            }).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {

                    Cart.find({
                        "userId": req.userId
                    }).populate([{
                        "path": "items.campaignsId",
                        "populate": {
                            "path": 'productId',
                            "model": 'products'
                        }
                    }]).lean().exec(function(err, response) {
                        if (err) {
                            reject({
                                "httpCode": CodesAndMessages.dbErrHttpCode,
                                "code": CodesAndMessages.dbErrCode,
                                "message": CodesAndMessages.dbErrMessage
                            })
                        } else {
                            !response[0].items.length ? reject({
                                'httpCode': 200,
                                'code': 201,
                                'message': 'Empty cart!!'
                            }) : resolve({
                                "cartId": response[0]._id,
                                "items": response[0].items,
                                "isDoubleTicket":response[0].isDoubleTicket
                            });
                        }
                            });
                        }
            })
        });
        Promise.all([addQuantityUpdate]).then(function(results) {
            var responseData = [],
                totalAmt = 0,
                totalProdcut = 0,
                totalPoints = 0,
                quantity = 0,
                totalTickets = 0;
            for (var i = 0; i < results[0].items.length; i++) {
                totalAmt = totalAmt + (results[0].items[i].campaignsId.productId.productPrice * results[0].items[i].quantity);
                totalProdcut = totalProdcut + results[0].items[i].quantity
                totalTickets = totalTickets +  (results[0].items[i].campaignsId.ticket * results[0].items[i].quantity)
                totalPoints = totalPoints +  (results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                responseData.push({
                    "cartId": results[0].cartId,
                    "_id": results[0].items[i]._id,
                    "quantity": results[0].items[i].quantity,
                    'campaignsId': UserUpld.languageFilter(req.query.language, req.query.currency, [results[0].items[i].campaignsId], [], [])
                })
            }
            res.status(200).json({
                'httpCode': 200,
                'code': 200,
                'message': "Sucess.",
                'data': {
                    'totalAmt': totalAmt,
                    'totalProdcut': totalProdcut,
                    'totalTickets': (results[0].isDoubleTicket?(totalTickets * 2):totalTickets),
                    'totalPoints': totalPoints,
                    'isDoubleTicket':results[0].isDoubleTicket,
                    'items': responseData
                }
            })
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}

exports.AddQuantity = (req, res) => {
    try {
        var quantity = 0;
        var addQuantityUpdate = new Promise(function(resolve, reject) {
            Cart.updateOne({
                '_id': req.body.cartId,
                "userId": req.userId,
                "items._id": req.body.itemId
            }, {
                '$inc': {
                    "items.$.quantity": 1
                },
                '$set': {
                    'items.$.updated': new Date()
                }
            }, {
                new: true
            }).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {

                    Cart.find({
                        "userId": req.userId
                    }).lean().exec(function(err, response) {
                        if (err) {
                            reject({
                                "httpCode": CodesAndMessages.dbErrHttpCode,
                                "code": CodesAndMessages.dbErrCode,
                                "message": CodesAndMessages.dbErrMessage
                            })
                        } else {
                            var CartData =  [];
                            for (var i = 0; i < response[0].items.length; i++) {
                               quantity = quantity + response[0].items[i].quantity;
                            }
                          CartData = response[0].items.filter(cartObject => cartObject._id.toString() === req.body.itemId);
                          CartData[0]['cartId']=response[0]._id;
                          console.log(CartData)
                          resolve(CartData)
                        }
                            });
                        }
            })
        });
        Promise.all([addQuantityUpdate]).then(function(results) {
            console.log(results[0])
                    res.status(200).json({
                        "httpCode": 200,
                        "code": 200,
                        "message": "Sucess",
                        "cartInfo": results[0],
                        "quantity":quantity
                    })
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}

exports.subtractQuantity = (req, res) => {
    try {
        var quantity = 0;        
        var addQuantityUpdate = new Promise(function(resolve, reject) {
            if (req.body.quantity < 2) {
                Cart.updateOne({
                    '_id': req.body.cartId,
                    "userId": req.userId
                }, {
                    $pull: {
                        "items": {
                            "_id": req.body.itemId
                        }
                    }
                }, {
                    new: true
                }).lean().exec(function(err, response) {
                    if (err) {
                        reject({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    } else {
                    Cart.find({
                        "userId": req.userId
                    }).populate([{
                        "path": "items.campaignsId",
                        "populate": {
                            "path": 'productId',
                            "model": 'products'
                        }
                    }]).lean().exec(function(err, response) {
                        if (err) {
                            reject({
                                "httpCode": CodesAndMessages.dbErrHttpCode,
                                "code": CodesAndMessages.dbErrCode,
                                "message": CodesAndMessages.dbErrMessage
                            })
                        } else {
                            resolve([]);
                        }
                            });
                    }
                })

            } else {
                Cart.updateOne({
                    '_id': req.body.cartId,
                    "userId": req.userId,
                    "items._id": req.body.itemId
                }, {
                    '$inc': {
                        "items.$.quantity": -1
                    },
                    '$set': {
                        'items.$.updated': new Date()
                    }
                }, {
                    new: true
                }).lean().exec(function(err, response) {
                    if (err) {
                        reject({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    } else {
                    Cart.find({
                        "userId": req.userId
                    }).lean().exec(function(err, response) {
                        if (err) {
                            reject({
                                "httpCode": CodesAndMessages.dbErrHttpCode,
                                "code": CodesAndMessages.dbErrCode,
                                "message": CodesAndMessages.dbErrMessage
                            })
                        } else {
                            var CartData =  [];
                            for (var i = 0; i < response[0].items.length; i++) {
                                quantity =  quantity + response[0].items[i]
                            }
                          CartData = response[0].items.filter(cartObject => cartObject._id.toString() === req.body.itemId);
                          CartData[0]['cartId']=response[0]._id;
                          resolve(CartData)
                        }
                            });
                        }
                })
            }
        });
        Promise.all([addQuantityUpdate]).then(function(results) {
                    res.status(200).json({
                        "httpCode": 200,
                        "code": 200,
                        "message": "Sucess",
                        "cartInfo": results[0],
                        "quantity": quantity
                    })
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}


exports.subtractQuantityBack = (req, res) => {
    try {
        var addQuantityUpdate = new Promise(function(resolve, reject) {
            if (req.body.quantity === 1) {
                Cart.updateOne({
                    '_id': req.body.cartId,
                    "userId": req.userId
                }, {
                    $pull: {
                        "items": {
                            "_id": req.body.itemId
                        }
                    }
                }, {
                    new: true
                }).lean().exec(function(err, response) {
                    if (err) {
                        reject({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    } else {
                    Cart.find({
                        "userId": req.userId
                    }).populate([{
                        "path": "items.campaignsId",
                        "populate": {
                            "path": 'productId',
                            "model": 'products'
                        }
                    }]).lean().exec(function(err, response) {
                        if (err) {
                            reject({
                                "httpCode": CodesAndMessages.dbErrHttpCode,
                                "code": CodesAndMessages.dbErrCode,
                                "message": CodesAndMessages.dbErrMessage
                            })
                        } else {
                            !response[0].items.length ? reject({
                                'httpCode': 200,
                                'code': 201,
                                'message': 'Empty cart!!'
                            }) : resolve({
                                "cartId": response[0]._id,
                                "items": response[0].items,
                                "isDoubleTicket":response[0].isDoubleTicket
                            });
                        }
                            });
                    }
                })

            } else {
                Cart.updateOne({
                    '_id': req.body.cartId,
                    "userId": req.userId,
                    "items._id": req.body.itemId
                }, {
                    '$inc': {
                        "items.$.quantity": -1
                    },
                    '$set': {
                        'items.$.updated': new Date()
                    }
                }, {
                    new: true
                }).lean().exec(function(err, response) {
                    if (err) {
                        reject({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    } else {
                        Cart.find({
                            "userId": req.userId
                        }).populate([{
                            "path": "items.campaignsId",
                            "populate": {
                                "path": 'productId',
                                "model": 'products'
                            }
                        }]).lean().exec(function(err, response) {
                            if (err) {
                                reject({
                                    "httpCode": CodesAndMessages.dbErrHttpCode,
                                    "code": CodesAndMessages.dbErrCode,
                                    "message": CodesAndMessages.dbErrMessage
                                })
                            } else {
                                !response[0].items.length ? reject({
                                    'httpCode': 200,
                                    'code': 201,
                                    'message': 'Empty cart!!'
                                }) : resolve({
                                    "cartId": response[0]._id,
                                    "items": response[0].items,
                                    "isDoubleTicket":response[0].isDoubleTicket
                                });
                            }
                        });
                    }
                })
            }
        });
        Promise.all([addQuantityUpdate]).then(function(results) {

            var responseData = [],
                totalAmt = 0,
                totalProdcut = 0,
                totalPoints = 0,
                totalTickets = 0;
            for (var i = 0; i < results[0].items.length; i++) {
                totalAmt = totalAmt + (results[0].items[i].campaignsId.productId.productPrice * results[0].items[i].quantity);
                totalProdcut = totalProdcut + results[0].items[i].quantity
                totalTickets = totalTickets +  (results[0].items[i].campaignsId.ticket * results[0].items[i].quantity)
                totalPoints = totalPoints +  (results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                responseData.push({
                    "cartId": results[0].cartId,
                    "_id": results[0].items[i]._id,
                    "quantity": results[0].items[i].quantity,
                    'campaignsId': UserUpld.languageFilter(req.query.language, req.query.currency, [results[0].items[i].campaignsId], [], [])
                })
            }
            res.status(200).json({
                'httpCode': 200,
                'code': 200,
                'message': "Sucess.",
                'data': {
                    'totalAmt': totalAmt,
                    'totalProdcut': totalProdcut,
                    'totalTickets': (results[0].isDoubleTicket?(totalTickets * 2):totalTickets),
                    'totalPoints': totalPoints,
                    'isDoubleTicket':results[0].isDoubleTicket,
                    'items': responseData
                }
            })
        
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}

exports.DoubleTicket = (req, res) => {
    try {
        var addQuantityUpdate = new Promise(function(resolve, reject) {
                Cart.updateOne({
                    "userId": req.userId
                }, {
                    '$set': {
                        'isDoubleTicket': req.body.isDoubleTicket
                    }
                }, {
                    new: true
                }).lean().exec(function(err, response) {
                    if (err) {
                        reject({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    } else {
                        Cart.find({
                            "userId": req.userId
                        }).populate([{
                            "path": "items.campaignsId",
                            "populate": {
                                "path": 'productId',
                                "model": 'products'
                            }
                        }]).lean().exec(function(err, response) {
                            if (err) {
                                reject({
                                    "httpCode": CodesAndMessages.dbErrHttpCode,
                                    "code": CodesAndMessages.dbErrCode,
                                    "message": CodesAndMessages.dbErrMessage
                                })
                            } else {
                                !response[0].items.length ? reject({
                                    'httpCode': 200,
                                    'code': 201,
                                    'message': 'Empty cart!!'
                                }) : resolve({
                                    "cartId": response[0]._id,
                                    "items": response[0].items,
                                    "isDoubleTicket":response[0].isDoubleTicket
                             });
                            }
                        });
                    }
                })
        });
        Promise.all([addQuantityUpdate]).then(function(results) {

            var responseData = [],
                totalAmt = 0,
                totalProdcut = 0,
                totalPoints = 0,
                totalTickets = 0;
            for (var i = 0; i < results[0].items.length; i++) {
                totalAmt = totalAmt + (results[0].items[i].campaignsId.productId.productPrice * results[0].items[i].quantity);
                totalProdcut = totalProdcut + results[0].items[i].quantity
                totalTickets = totalTickets +  (results[0].items[i].campaignsId.ticket * results[0].items[i].quantity)
                totalPoints = totalPoints +  (results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                responseData.push({
                    "cartId": results[0].cartId,
                    "_id": results[0].items[i]._id,
                    "quantity": results[0].items[i].quantity,
                    'campaignsId': UserUpld.languageFilter(req.query.language, req.query.currency, [results[0].items[i].campaignsId], [], [])
                })
            }
            res.status(200).json({
                'httpCode': 200,
                'code': 200,
                'message': "Sucess.",
                'data': {
                    'totalAmt': totalAmt,
                    'totalProdcut': totalProdcut,
                    'totalTickets': (results[0].isDoubleTicket?(totalTickets * 2):totalTickets),
                    'totalPoints': totalPoints,
                    'isDoubleTicket':results[0].isDoubleTicket,
                    'items': responseData
                }
            })
        
        }).catch(function(err) {
            console.log('errerrerrerr', err)
            res.status(err.httpCode).json(err);
        });
    } catch (err) {
        console.log('catch', err)
        res.status(500).json({
            "httpCode": CodesAndMessages.dbErrHttpCode,
            "code": CodesAndMessages.dbErrCode,
            "message": CodesAndMessages.dbErrMessage
        })
    }
}