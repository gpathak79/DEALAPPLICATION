exports.UploadImage = async (req, res) => {
    try {
      if (!req.files.length) {
        res.status(400).json({'code': 400, 'httpCode': 400, 'message': 'Try uploading the images again!!!'});
      } else {
        req.files.forEach(element => {
            console.log(element.path);
          cloudinary.uploader.upload(element.path, async (err, results) => {
            if (err) {
              res.status(503).json({'code': 400, 'httpCode': 400, 'message': 'Service Unavilable'});
            } else {
                User.findOneAndUpdate({
                    _id: req.userId
                }, {
                    $set: {
                        userimage: results.url
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
                            'code': 200 ,
                            'httpcode':200,
                            'message': 'Sucess',
                            'data': update
                        })
                    }
                })
            }
          });
        });
      }
    } catch (err) {
      res.status(500).json({ httpCode: CodesAndMessages.dbErrHttpCode, code: CodesAndMessages.dbErrCode, message: CodesAndMessages.dbErrMessage });
     
    }
  }