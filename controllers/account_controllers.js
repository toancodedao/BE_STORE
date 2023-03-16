const { AccountStoreRegister, AccountStoreLogin } = require('../services/accounts_service');
const { AccountStore } = require('../models/accounts_models');
const { emailOtp } = require('../models/emailotp_models');
const bcrypt = require("bcrypt");
const randomstring = require('randomstring');

const account_controllers = {
    sendOtpEmail: async (req, res) => {
        try {
            // tạo biến check trường trong model
            const allowedFields = Object.keys(AccountStore.schema.paths);
            const requestFields = Object.keys(req.body);
            // check xem có trường nào không hợp lệ so với model
            const isValid = requestFields.every(field => allowedFields.includes(field));
            if (!isValid) {
                return res.status(400).json({ error: 'có trường không hợp lệ' });
            } else {
                const otp = randomstring.generate({
                    length: 6,
                    charset: 'numeric'
                });

                const formRegister = new AccountStore({
                    nameStore: req.body.nameStore,
                    emailStore: req.body.emailStore,
                    passStore: bcrypt.hashSync(req.body.passStore, Number(process.env.SALTROUNDS)),
                    addressStore: req.body.addressStore,
                    phoneStore:req.body.phoneStore,
                    otpMailStore: otp
                });
                await AccountStoreRegister.createTokenOTP(formRegister);
                AccountStoreRegister.sendOtpEmail(formRegister.emailStore, formRegister.nameStore,otp)
                res.status(200).json({
                    message: 'Dữ liệu đã được nhận'
                });
            }

        } catch (error) {
            res.status(500).json({
                message: 'lấy dữ liệu thất bại'
            });
            console.log(error)
        }
    },
    checkOtpEmail: async (req, res) => {
        try {
            // tạo biến check trường trong model
            const allowedFields = Object.keys(emailOtp.schema.paths);
            const requestFields = Object.keys(req.body);
            // check xem có trường nào không hợp lệ so với model
            const isValid = requestFields.every(field => allowedFields.includes(field));

            if (!isValid) {
                return res.status(400).json({ error: 'có trường không hợp lệ' });
            } else {
                const a = await AccountStoreRegister.sumbitOtpEmail(req.body.otpAcount);

                if (a == 1) {
                    res.status(200).json({
                        message: "đăng ký thành công"
                    });
                } else {
                    res.status(404).json({
                        message: "mã OTP không hợp lệ"
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                message: error
            })
        }

    },
    forgotPassword: async(req,res) => {
       try {
        const email = req.body.emailAccount
        const emailAccount = await AccountStore.findOne({ emailAccount: email });
        if(emailAccount){
            // tạo otp reset password
            const otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            // gửi otp reset password
            AccountStoreRegister.sendOtpRestPassword(email,otp);
            //
            const formRegister ={
                emailAccount:email,
                otpEmailAccount:otp,
            }
            // khởi tạo otp trong database
            AccountStoreRegister.createTokenOTP(formRegister);

            res.status(200).json({
                message:"gửi OTP tới email thành công"
            })
        }else{
            res.status(404).json({
                message:"tài khoản không tồn tại"
            })
        }
       } catch (error) {
            res.status(500).json({
                message:"lỗi hệ thống"
            })
       }
    }
}

const account_login_controllers = {
    checklogin: async (req, res) => {
        try {
            const email = req.body.emailStore;
            const password = req.body.passStore;

            const checklogin = await AccountStoreLogin.checkLogin(email, password);

            if (checklogin == 0) {
                res.status(404).json({
                    message: 'tài khoản hoặc mật khẩu không chính xác'
                });
            } else {
                res.status(200).json({
                    message: 'đăng nhập thành công',
                    token:checklogin
                })
            }
        } catch (error) {
            res.status(500).json({
                message: error
            });
        }

    }
}

module.exports = { account_controllers, account_login_controllers }