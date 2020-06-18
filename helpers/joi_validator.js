const Joi = require('joi');

//Signup validation
exports.Signup=(req,res,cb)=>{
    Joi.validate({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        gender: req.body.gender,
        email:req.body.email,
        password:req.body.password,
        language:req.body.language
    },
    {
        first_name: Joi.string().min(1).required(), 
        last_name: Joi.string().min(1).required(),
        gender: Joi.number().integer().max(1).required(),
        email:Joi.string().email().required(),
        password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        language:Joi.string().valid('EN','AR','en','ar')
    }, (err, value) => {
        if (err) {
          return res.status(400).json({
            message: err.details[0].message,
            code: 400,
            errorName: err.name
          });
        } else {
            cb(null, true)
         } }
         )
}

//User validation
exports.UserInformation=(req,res,cb)=>{
  Joi.validate({
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      gender: req.body.gender
  },
  {
      first_name: Joi.string().min(1).required(), 
      last_name: Joi.string().min(1).required(),
      gender: Joi.number().integer().max(1).required()
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}

//Login Validation
exports.Login=(req,res,cb)=>{
  Joi.validate({
     
      email:req.body.email,
      password:req.body.password,
      language:req.body.language             
  },
  {

      email:Joi.string().email().required(),
      password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      language:Joi.string().valid('EN','AR','en','ar')
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}

//Forgot Password
exports.ForgotPassword=(req,res,cb)=>{
  Joi.validate({  
      email:req.body.email,
      language:req.body.language             
  },
  {
      email:Joi.string().email().required(),
      language:Joi.string().valid('EN','AR','en','ar')
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}

exports.VerifyOtp=(req,res,cb)=>{
  Joi.validate({  
      mobile:req.body.mobile,
      otp:req.body.otp,
      countryCode:req.body.countryCode,
      language:req.body.language             
  },
  {
     mobile:Joi.number().integer().min(1000000000).max(9999999999),
     otp:Joi.number().integer().min(1000).max(9999),
      countryCode:Joi.string().min(1).max(3).required(),
      language:Joi.string().valid('EN','AR','en','ar')
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}


exports.Wishlist=(req,res,cb)=>{
  Joi.validate({  
      campaignsId:req.body.campaignsId            
  },
  {
     campaignsId:Joi.string().min(1).required()
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}

exports.removeWishlist=(req,res,cb)=>{
  Joi.validate({  
      campaignsId:req.body.campaignsId            
  },
  {
     campaignsId:Joi.string().min(1).required()
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}

//AddUserCard

exports.AddUserCard=(req,res,cb)=>{
  Joi.validate({  
       
            cardHolderName:req.body.cardHolderName,
            cardNumber:req.body.cardNumber,
            expMonth:req.body.expMonth,
            expYear:req.body.expYear,
            cvv:req.body.cvv         
  },
  {
      cardHolderName: Joi.string().min(1).required(), 
      cardNumber:Joi.number().integer().min(1000000000000000).max(9999999999999999),
      expMonth:Joi.number().integer().min(1).max(99),
      expYear:Joi.number().integer().min(1000).max(9999),
      cvv:Joi.number().integer().min(100).max(999),

      
  }, (err, value) => {
      if (err) {
        return res.status(400).json({
          message: err.details[0].message,
          code: 400,
          errorName: err.name
        });
      } else {
          cb(null, true)
       } }
       )
}