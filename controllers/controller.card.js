exports.AddUserCard = (req, res) => {
            Card.create({
            'userId':req.userId,
            'cardHolderName':req.body.cardHolderName,
            'cardNumber':req.body.cardNumber,
            'expMonth':req.body.expMonth,
            'expYear':req.body.expYear,
            'cvv':req.body.cvv
        }, (err, data) => {
                
                    if (err){
    res.send({
        "httpCode": CodesAndMessages.dbErrHttpCode,
        "code": CodesAndMessages.dbErrCode,
        "message": CodesAndMessages.dbErrMessage
    });
                    
                } else {
            res.send({
                "code": 200,
                "httpcode":200,
                "message":'Sucess',
                'data':data,
            });
                }
            });       
}

//Delete Card
exports.DeleteCard = (req, res) => {
    try {
        //find user 
        const findcard = new Promise((resolve, reject) => {
            Card.find({'_id': req.body.cardId,'userId':req.userId}, (err, results) => {
                if(err) {
                    reject({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
                } else {
                    !results.length ? reject({ 'message':'Card Not Find','code':210,'httpcode':200}) :
                    resolve(1);
                }
            });
        });
  
            Promise.all([findcard]).then((results) => {      
            Card.remove({
                _id: req.body.cardId
            }, function(err) {
                if (err)
                    res.send(err);
                else
                    res.send({'code':200,'httpcode':200,'meesage':'Card Deleted Succesfully'}); 
            })
           
    }).catch(function (err) { 
                res.status(500).json(err);
            });
    } catch (err) {
        res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
  
    }
}

//CardList
exports.CardList = (req, res) => {
            Card.find({'userId': req.userId}, function(err,data){
                if (err){
              res.send({'code':201,'message':err.message});
            }
            else
            {
                if(data.length)
                {
              res.send({ "code": 200,
              "httpcode":200,
              "message":'Sucess',
              'data':data,})
                }
                else{
                    res.send({'code':210,'httpcode':200,'message':'You Have No Card'})
                }
            }
            });
}
//Delete User
exports.DeleteUser = (req,res) => {
try {
const checkuser = new Promise((resolve, reject) => {
User.find({mobile: req.body.mobile}, (err, results) => {
console.log(results);
if(err) {
reject({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });
} else {
!results.length ? reject({ 'message': 'Mobile Not Found', "code": CodesAndMessages.code, "httpcode":CodesAndMessages.HttpCode,}) :
resolve(results[0]);
}
});
});

checkuser
.then((results) => {

var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
var string = '';
for(var ii=0; ii<20; ii++){
    string += chars[Math.floor(Math.random() * chars.length)];
}
var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
User.findOneAndUpdate({'_id':results._id}, {$set:{ 
"mobile": digits,
"email":(string + '@domain.com')
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
res.status(500).json(err);
});
} catch (err) {
res.status(500).json({ "httpCode": CodesAndMessages.dbErrHttpCode, "code": CodesAndMessages.dbErrCode, "message": CodesAndMessages.dbErrMessage });

}
}

//Email check

//CardList
exports.EmailCheck = (req, res) => {
User.find({'email': req.body.email}, function(err,data){
if (err){
res.send({'code':201,'message':err.message});
}
else
{
if(data.length)
{
res.send({ "code": 201,
"httpcode":200,
"message":'Email Already Exist'})
}
else{
res.send({'code':200,'httpcode':200,'message':'Email Not Found'})
}
}
});
}
