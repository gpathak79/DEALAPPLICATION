exports.AddPurchasePoint = (req, res) => {

    try {
        PurchasePoint.create({
            
            userId:req.userId,
             points : req.body.points,
            campaignsId:req.body.campaignsId,
            orderId:req.body.orderId
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
                    'message': 'Purchase Point add successful',
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

//PurchasePointList
exports.PurchasePointList = (req, res) => {
PurchasePoint.find({
    'userId': req.userId 
    }).select('points transactiontype').lean().exec(function(err, data) {
        if (err){
            res.send({'code':201,'message':err.message});
          }  else
          {
              if(data.length)
              {
            res.send({ "code": 200,
            "httpcode":200,
            "message":'Sucess',
            'data':data,})
              }
              else{
                  res.send({'code':200,'httpcode':200,'message':'You Have No Points'});  
              }
          }
    });

}