const jwt = require('jsonwebtoken');
const { emailOtp } = require('../models/emailotp_models');
const { AccountStore } = require('../models/accounts_models');

const checkAccount ={
    checkRegister :async(req,res,next)=>{
        if(req.body.emailStore == null || req.body.nameStore == null || req.body.passStore == null){
            res.status(400).json({message:"tài khoản đã tồn tại hoặc cú pháp không hợp lệ"})
        }else{
            const emailAccount = await AccountStore.findOne({emailStore: req.body.emailStore});
            const nameAccount = await AccountStore.findOne({nameStore: req.body.nameStore});
            
            if(emailAccount != null || nameAccount != null){
                res.status(400).json({message:"tài khoản đã tồn tại hoặc cú pháp không hợp lệ"});
            }else{
                next();
            }
            
        }
    },
    checkToken:async(req,res,next)=>{
      try {
        const token = req.headers.token
        const token2 = token.split(' ');
        if(!token2[1]){
            res.status(404).json({message:'token not found'})
        }else{
            const data = jwt.verify(token2[1],process.env.ACCESS_KEY);
            if(data){
                next();
            }else{
                res.status(403).json({message:'token is invalid'})
            }
        }   
      } catch (error) {
        res.status(500).json({message:'token is invalid or missing'})
      }
       
    }
}

module.exports = checkAccount;