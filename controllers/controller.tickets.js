exports.UserOrder = (req, res) => {
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

        let ordersIdGenrate = new Promise(function(resolve, reject) {
            Orders.find({},['orderNumber','orderId','created'],{skip:0,limit:0, sort:{'created': -1}}, function (err, results) {
                if (err) {
                    reject({ 'httpCode': CodesAndMessages.dbErrHttpCode, 'code': CodesAndMessages.dbErrCode, 'message': CodesAndMessages.dbErrMessage })
                } else {
        if (results.length){
                    resolve({'orderId':('0000000'+(Number.parseInt(results[0].orderId)+1)).slice(-8),'orderNumber':(Number.parseInt(results[0].orderNumber)+1)})
        }else{
                    resolve({'orderId':'00000001','orderNumber':1})
        }
                }
            })
        });

        let ticketIdGenrate = new Promise(function(resolve, reject) {
            Tickets.find({},['ticketId','ticketNumber','created'],{skip:0,limit:0, sort:{'created': -1}}, function (err, results) {
                if (err) {
                    reject({ 'httpCode': CodesAndMessages.dbErrHttpCode, 'code': CodesAndMessages.dbErrCode, 'message': CodesAndMessages.dbErrMessage })
                } else {
        if (results.length){
                    resolve({'ticketId':('0000000'+(Number.parseInt(results[0].ticketId))).slice(-8),'ticketNumber':(Number.parseInt(results[0].ticketNumber))})
        }else{
                    resolve({'ticketId':'00000000','ticketNumber':0})
        }
                }
            })
        });        

        Promise.all([campaignChatCheck, ordersIdGenrate, ticketIdGenrate]).then(function(results) {
            var responseData = [],
                saveTickets = [],
                updateCampaginQty = [],
                ticketId = results[2].ticketId,
                ticketNumber = results[2].ticketNumber,
                totalAmt = 0,
                totalProdcut = 0,
                totalPoints = 0,
                totalTickets = 0;
            for (var i = 0; i < results[0].items.length; i++) {
                totalAmt = totalAmt + (results[0].items[i].campaignsId.productId.productPrice * results[0].items[i].quantity);
                totalProdcut = totalProdcut + results[0].items[i].quantity
                totalTickets = totalTickets +  (results[0].items[i].campaignsId.ticket * results[0].items[i].quantity)
                totalPoints = totalPoints +  (results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                updateCampaginQty.push({'_id' : results[0].items[i].campaignsId._id  , 'soldOut':results[0].items[i].quantity})
                responseData.push({
                    "quantity": results[0].items[i].quantity,
                    "campaignsId": results[0].items[i].campaignsId._id,
                    "ticket":results[0].items[i].campaignsId.ticket,
                    "points":(results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                })  
                     ticketId =  ('0000000'+(Number.parseInt(ticketId)+1)).slice(-8);
                     ticketNumber =  (Number.parseInt(ticketNumber)+1);               
                saveTickets.push({
                        "userId": req.userId,
                        "campaignsId": results[0].items[i].campaignsId._id,
                        "orderId": results[1].orderId,
                        "isDoubleTicket": results[0].isDoubleTicket,
                        "isCharity": req.body.isCharity,
                        "ticketId": ticketId,
                        "ticketNumber": ticketNumber,
                        "isClose": false,
                        "ticketCount":(results[0].isDoubleTicket?(results[0].items[i].campaignsId.ticket * 2):results[0].items[i].campaignsId.ticket),
                        "points":(results[0].items[i].campaignsId.points * results[0].items[i].quantity)
                    })
            }
                Orders.create({"userId":req.userId, "items":responseData, "isCharity" : req.body.isCharity, 'totalAmt': totalAmt, "totalProdcut": totalProdcut, "totalTickets": (results[0].isDoubleTicket?(totalTickets * 2):totalTickets), "totalPoints": totalPoints, "isDoubleTicket":results[0].isDoubleTicket, "updated": new Date(), "orderId":results[1].orderId, "orderNumber":results[1].orderNumber},function (err,argument) {
                    if (err){
                        res.status(500).json({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    }else{
            Tickets.create(saveTickets,function (err,ticketsCreateResponse) {
                    if (err){
                        res.status(500).json({
                            "httpCode": CodesAndMessages.dbErrHttpCode,
                            "code": CodesAndMessages.dbErrCode,
                            "message": CodesAndMessages.dbErrMessage
                        })
                    }else{
                        res.status(200).json({
                            "httpCode": 200,
                            "code": 200,
                            "message": "Sucess.",
                            "data": ticketsCreateResponse
                        });
Cart.updateOne({'_id': results[0].cartId,"userId": req.userId},{'$set': {'isDoubleTicket':true,'items': []}},{new: true}).lean().exec(function(err, response) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Sucess')
                }
            });
    var process = function(x) {
            if (x < updateCampaginQty.length) {
            Campaigns.updateOne({'_id': updateCampaginQty[x]._id},{'$inc': {"soldOut": -(updateCampaginQty[x].soldOut)}},{new: true}).lean().exec(function(err,pushres){
                if (err){
                    process(x+1)
                }else{
                    process(x+1)
                }
            });
            }
        };
process(0);
}
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


exports.MyTickets = (req, res) => {
    try {
    var campaignChatCheck = new Promise(function(resolve, reject) {
            Tickets.find({
                "userId": req.userId
            }).populate([{
                "path": "campaignsId",
                "populate": {
                    "path": 'productId',
                    "model": 'products'
                }
            }]).sort({"created":-1}).lean().exec(function(err, response) {
                if (err) {
                    reject({
                        "httpCode": CodesAndMessages.dbErrHttpCode,
                        "code": CodesAndMessages.dbErrCode,
                        "message": CodesAndMessages.dbErrMessage
                    })
                } else {
                    !response.length ? reject({
                        'httpCode': 200,
                        'code': 201,
                        'message': 'No ticket forund'
                    }) : resolve(response);
                }
            });
        });
        Promise.all([campaignChatCheck]).then(function(results) {
            var responseData = [];
            for (var i = 0; i < results[0].length; i++) {
                responseData.push({"ticketId":results[0][i].ticketId,"ticketCount":results[0][i].ticketCount,"isClose":results[0][i].isClose,"isWinner":results[0][i].isWinner,"orderId":results[0][i].orderId,"created":results[0][i].created,"isCharity":results[0][i].isCharity,"address":process.env.ADDRESS,"campaignsId":UserUpld.languageFilter(req.query.language, req.query.currency, [results[0][i].campaignsId], [], [])})
            }
        res.status(200).json({
            "httpCode": 200,
            "code": 200,
            "message": "Sucess.",
            "data":responseData
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


