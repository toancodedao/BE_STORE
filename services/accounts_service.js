const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { emailOtp } = require('../models/emailotp_models');
const { AccountStore } = require('../models/accounts_models');

const AccountStoreRegister = {
  sendOtpEmail: async (email, name, otp) => {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phuocph1903@gmail.com",
        pass: "kapgmspdigzrwrrd",
      },
    });

    const mailOptions = {
      from: "phuocph1903@gmail.com",
      to: email,
      subject: "Sending Email OTP",
      html: `<table border="0" cellpadding="0" cellspacing="0" class="background_main" style="font-family: Manrope ;background-color: #ffffff; padding-top: 20px; color: #434245; width: 100%; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; " width="100%">
            <tbody>
              <tr>
                <td style="font-size:6px; line-height:10px; padding:38.42px 0px 38.69px 0px;" valign="top" align="center">
                  <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="200" alt="" data-proportionally-constrained="true" data-responsive="false" src="https://uzin.store/img/light_logo.png" height="200">
          
                </td>
              </tr>
              <tr>
                <td align="center">
                  <div style="width: 329px;text-align: start;">
                      <span style="font-family: Manrope, Tahoma ;font-size: 18px;font-weight: 800;line-height: 25px;letter-spacing: 0em;text-align: left;color: #58595B;">
                          Hello ${name}!
                      </span>
                  </div>
                  <br>
                  <br>
                </td>
              </tr>
              <tr>
                <td align="center">
                 <div style="background: #F4F4F5; width:326.59px">
                   <img width="326.59px" src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/51462700-1858-42da-81fc-2f2d753fc769/654x358.png">
                 </div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <div style="background: #F4F4F5; width:326.59px;">
                      <br>
                      <span style="font-family:  Manrope, Tahoma; font-size: 18px;font-weight: 800;line-height: 25px;letter-spacing: 0em;text-align: center;">OTP: ${otp} </span>
                      <br>
                      <br>
                      <span style="font-family:  Manrope, Tahoma;font-style: normal;font-weight: 400;font-size: 13px;line-height: 14px;text-align: center;color: #07213D; padding-left: 8px; padding-right: 8px;">Enter one time password (OTP) to proceed <br>
          with your Login.</span>
                      <br>
                      <br>
                  </div>
                </td>
              </tr>
          
              <tr>
                <td>
                  <div style="font-family: Manrope, Tahoma; text-align: center;padding-top: 45px;"><span style="font-size: 12px; ">Right-Hand
                      Cybersecurity is here to
                      support you against malicious cybercrimes.</span>
                  </div>
                  <br>
                  <br>
                </td>
              </tr>
          
              <tr>
                <td align="center">
                  <hr style="width: 326px; border: 1px solid #58595B; background: #58595B;">
                </td>
              </tr>
          
              <tr style="padding-top: 22px;">
                <td>
                  <div style="font-family: Manrope, Tahoma; text-align: center"><span style="font-size: 9px; ">Built by
                      Right-Hand
                      Cybersecurity.<br>
                      Have a lovely day!</span></div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 22px;">
                  <span>
                   <a href="https://www.facebook.com/profile.php?id=100010536793723"><img src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/28453ea0-6383-459d-a60d-81399f82f2b8/7x13.png"></a>
                   <a href="https://www.linkedin.com/in/h%E1%BB%AFu-ph%C6%B0%E1%BB%9Bc-ph%E1%BA%A1m-754a2b258/"><img src="http://cdn.mcauto-images-production.sendgrid.net/675279fac170805a/1f709a3c-6130-4752-8e89-7dd8c672e9b0/13x13.png"></a>
                  </span>
                  <br>
                  <br>
                  <br>
                  <br>
                </td>
              </tr>
          
            </tbody>
          </table>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
  createTokenOTP: async (formRegister) => {
    console.log(formRegister)
    const jwtotp = jwt.sign(
      {
        tokenotp: formRegister,
      },
      process.env.ACCESS_KEY,
      { expiresIn: "120s" }
    );

    const tokenOtp = new emailOtp({
      tokenOtp: jwtotp,
      otpAcount: formRegister.otpMailStore,
    });
    await tokenOtp.save();

  },
  sumbitOtpEmail: async (otp_req) => {
    try {
      const otp = await emailOtp.findOne({
        otpAcount: otp_req
      });

      var decoded = jwt.decode(otp.tokenOtp, { complete: true });
      const data = decoded.payload.tokenotp;
      const registerotp = async () => {
        const account = new AccountStore({
          nameStore: data.nameStore,
          emailStore: data.emailStore,
          passStore: data.passStore,
          addressStore: data.addressStore,
          phoneStore:data.phoneStore
        });
        await account.save();
      }

      if (otp == null) {
        return 0;
      } else {
        registerotp();
        return 1;
      }
    } catch (error) {
      console.log(error)
    }


  },
  sendOtpRestPassword:async(email,otp)=>{
     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "phuocph1903@gmail.com",
        pass: "kapgmspdigzrwrrd",
      },
    });

    const mailOptions = {
      from: "phuocph1903@gmail.com",
      to: email,
      subject: "Sending Email OTP",
      html: `<!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <!-- NAME: 1 COLUMN -->
          <!--[if gte mso 15]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          <![endif]-->
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Reset Your Lingo Password</title>
          <!--[if !mso]>
            <!-- -->
          <link href='https://fonts.googleapis.com/css?family=Asap:400,400italic,700,700italic' rel='stylesheet'
              type='text/css'>
          <!--<![endif]-->
          <style type="text/css">
              @media only screen and (min-width:768px) {
                  .templateContainer {
                      width: 600px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  body,
                  table,
                  td,
                  p,
                  a,
                  li,
                  blockquote {
                      -webkit-text-size-adjust: none !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  body {
                      width: 100% !important;
                      min-width: 100% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  #bodyCell {
                      padding-top: 10px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnImage {
                      width: 100% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  .mcnCaptionTopContent,
                  .mcnCaptionBottomContent,
                  .mcnTextContentContainer,
                  .mcnBoxedTextContentContainer,
                  .mcnImageGroupContentContainer,
                  .mcnCaptionLeftTextContentContainer,
                  .mcnCaptionRightTextContentContainer,
                  .mcnCaptionLeftImageContentContainer,
                  .mcnCaptionRightImageContentContainer,
                  .mcnImageCardLeftTextContentContainer,
                  .mcnImageCardRightTextContentContainer {
                      max-width: 100% !important;
                      width: 100% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnBoxedTextContentContainer {
                      min-width: 100% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnImageGroupContent {
                      padding: 9px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  .mcnCaptionLeftContentOuter .mcnTextContent,
                  .mcnCaptionRightContentOuter .mcnTextContent {
                      padding-top: 9px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  .mcnImageCardTopImageContent,
                  .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
                      padding-top: 18px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnImageCardBottomImageContent {
                      padding-bottom: 9px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnImageGroupBlockInner {
                      padding-top: 0 !important;
                      padding-bottom: 0 !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcnImageGroupBlockOuter {
                      padding-top: 9px !important;
                      padding-bottom: 9px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  .mcnTextContent,
                  .mcnBoxedTextContentColumn {
                      padding-right: 18px !important;
                      padding-left: 18px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  .mcnImageCardLeftImageContent,
                  .mcnImageCardRightImageContent {
                      padding-right: 18px !important;
                      padding-bottom: 0 !important;
                      padding-left: 18px !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
                  .mcpreview-image-uploader {
                      display: none !important;
                      width: 100% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Heading 1
            @tip Make the first-level headings larger in size for better readability
         on small screens.
            */
                  h1 {
                      /*@editable*/
                      font-size: 20px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Heading 2
            @tip Make the second-level headings larger in size for better
         readability on small screens.
            */
                  h2 {
                      /*@editable*/
                      font-size: 20px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Heading 3
            @tip Make the third-level headings larger in size for better readability
         on small screens.
            */
                  h3 {
                      /*@editable*/
                      font-size: 18px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Heading 4
            @tip Make the fourth-level headings larger in size for better
         readability on small screens.
            */
                  h4 {
                      /*@editable*/
                      font-size: 16px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Boxed Text
            @tip Make the boxed text larger in size for better readability on small
         screens. We recommend a font size of at least 16px.
            */
                  .mcnBoxedTextContentContainer .mcnTextContent,
                  .mcnBoxedTextContentContainer .mcnTextContent p {
                      /*@editable*/
                      font-size: 16px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Preheader Visibility
            @tip Set the visibility of the email's preheader on small screens. You
         can hide it to save space.
            */
                  #templatePreheader {
                      /*@editable*/
                      display: block !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Preheader Text
            @tip Make the preheader text larger in size for better readability on
         small screens.
            */
                  #templatePreheader .mcnTextContent,
                  #templatePreheader .mcnTextContent p {
                      /*@editable*/
                      font-size: 12px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Header Text
            @tip Make the header text larger in size for better readability on small
         screens.
            */
                  #templateHeader .mcnTextContent,
                  #templateHeader .mcnTextContent p {
                      /*@editable*/
                      font-size: 16px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Body Text
            @tip Make the body text larger in size for better readability on small
         screens. We recommend a font size of at least 16px.
            */
                  #templateBody .mcnTextContent,
                  #templateBody .mcnTextContent p {
                      /*@editable*/
                      font-size: 16px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
      
              @media only screen and (max-width: 480px) {
      
                  /*
            @tab Mobile Styles
            @section Footer Text
            @tip Make the footer content text larger in size for better readability
         on small screens.
            */
                  #templateFooter .mcnTextContent,
                  #templateFooter .mcnTextContent p {
                      /*@editable*/
                      font-size: 12px !important;
                      /*@editable*/
                      line-height: 150% !important;
                  }
      
              }
          </style>
      </head>
      
      <body style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       background-color: #ffffff; height: 100%; margin: 0; padding: 0; width: 100%">
          <center>
              <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" id="bodyTable" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; background-color: #fefefe; height: 100%; margin: 0; padding: 0; width:
       100%" width="100%">
                  <tr>
                      <td align="center" id="bodyCell" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; border-top: 0;
       height: 100%; margin: 0; padding: 0; width: 100%" valign="top">
                          <!-- BEGIN TEMPLATE // -->
                          <!--[if gte mso 9]>
                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                      <tr>
                        <td align="center" valign="top" width="600" style="width:600px;">
                        <![endif]-->
                          <table border="0" cellpadding="0" cellspacing="0" class="templateContainer" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; max-width:
       600px; border: 0" width="100%">
                              <tr>
                                  <td id="templatePreheader" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;
       border-top: 0; border-bottom: 0; padding-top: 16px; padding-bottom: 8px" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnTextBlock" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       min-width:100%;" width="100%">
                                          <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                  <td class="mcnTextBlockInner" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                          class="mcnTextContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; min-width:100%;" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="mcnTextContent" style='mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; word-break: break-word;
       color: #2a2a2a; font-family: "Asap", Helvetica, sans-serif; font-size: 12px;
       line-height: 150%; text-align: left; padding-top:9px; padding-right: 18px;
       padding-bottom: 9px; padding-left: 18px;' valign="top">
                                                                      <a href="https://www.lingoapp.com" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #2a2a2a;
       font-weight: normal; text-decoration: none" target="_blank" title="
                                                                          is the
       best way to organize, share and use all your visual assets in one place -
       all on your desktop.">
                                                                      </a>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td id="templateHeader" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f7f7ff;
       border-top: 0; border-bottom: 0; padding-top: 16px; padding-bottom: 0" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnImageBlock" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       min-width:100%;" width="100%">
                                          <tbody class="mcnImageBlockOuter">
                                              <tr>
                                                  <td class="mcnImageBlockInner" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding:0px" valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                          class="mcnImageContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; min-width:100%;" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="mcnImageContent" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-right: 0px;
       padding-left: 0px; padding-top: 0; padding-bottom: 0; text-align:center;" valign="top">
                                                                      <a class="" href="https://www.lingoapp.com" style="mso-line-height-rule:
       exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color:
       #f57153; font-weight: normal; text-decoration: none" target="_blank" title="">
                                                                          <a class="" href="https://www.lingoapp.com/" style="mso-line-height-rule:
       exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color:
       #f57153; font-weight: normal; text-decoration: none" target="_blank" title="">
                                                                              <img align="center" alt="Forgot your password?"
                                                                                  class="mcnImage"
                                                                                  src="https://static.lingoapp.com/assets/images/email/il-password-reset@2x.png"
                                                                                  style="-ms-interpolation-mode: bicubic; border: 0; height: auto; outline: none;
       text-decoration: none; vertical-align: bottom; max-width:1200px; padding-bottom:
       0; display: inline !important; vertical-align: bottom;" width="600"></img>
                                                                          </a>
                                                                      </a>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td id="templateBody" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f7f7ff;
       border-top: 0; border-bottom: 0; padding-top: 0; padding-bottom: 0" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnTextBlock" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; min-width:100%;" width="100%">
                                          <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                  <td class="mcnTextBlockInner" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                          class="mcnTextContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; min-width:100%;" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="mcnTextContent" style='mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; word-break: break-word;
       color: #2a2a2a; font-family: "Asap", Helvetica, sans-serif; font-size: 16px;
       line-height: 150%; text-align: center; padding-top:9px; padding-right: 18px;
       padding-bottom: 9px; padding-left: 18px;' valign="top">
      
                                                                      <h1 class="null" style='color: #2a2a2a; font-family: "Asap", Helvetica,
       sans-serif; font-size: 32px; font-style: normal; font-weight: bold; line-height:
       125%; letter-spacing: 2px; text-align: center; display: block; margin: 0;
       padding: 0'><span style="text-transform:uppercase">Forgot</span></h1>
      
      
                                                                      <h2 class="null" style='color: #2a2a2a; font-family: "Asap", Helvetica,
       sans-serif; font-size: 24px; font-style: normal; font-weight: bold; line-height:
       125%; letter-spacing: 1px; text-align: center; display: block; margin: 0;
       padding: 0'><span style="text-transform:uppercase">your password?</span></h2>
      
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnTextBlock" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace:
       0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       min-width:100%;" width="100%">
                                          <tbody class="mcnTextBlockOuter">
                                              <tr>
                                                  <td class="mcnTextBlockInner" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                          class="mcnTextContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; min-width:100%;" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="mcnTextContent" style='mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; word-break: break-word;
       color: #2a2a2a; font-family: "Asap", Helvetica, sans-serif; font-size: 16px;
       line-height: 150%; text-align: center; padding-top:9px; padding-right: 18px;
       padding-bottom: 9px; padding-left: 18px;' valign="top">Not to worry, we got you! Let’s get you a new password.
                                                                      <br></br>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonBlock" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       min-width:100%;" width="100%">
                                          <tbody class="mcnButtonBlockOuter">
                                              <tr>
                                                  <td align="center" class="mcnButtonBlockInner" style="mso-line-height-rule:
       exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       padding-top:18px; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top">
                                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnButtonBlock"
                                                          style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; min-width:100%;" width="100%">
                                                          <tbody class="mcnButtonBlockOuter">
                                                              <tr>
                                                                  <td align="center" class="mcnButtonBlockInner" style="mso-line-height-rule:
       exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top">
                                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                                          class="mcnButtonContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       border-collapse: separate !important;border-radius: 48px;background-color:
       #F57153;">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td align="center" class="mcnButtonContent"
                                                                                      style="mso-line-height-rule:
       exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;
       font-family: 'Asap', Helvetica, sans-serif; font-size: 16px; padding-top:24px;
       padding-right:48px; padding-bottom:24px; padding-left:48px;" valign="middle">
                                                                                      <a class="mcnButton " href="#" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; display: block; color: #f57153;
       font-weight: normal; text-decoration: none; font-weight: normal;letter-spacing:
       1px;line-height: 100%;text-align: center;text-decoration: none;color:
       #FFFFFF; text-transform:uppercase;" target="_blank" title="Review Lingo kit
       invitation">${otp}</a>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                      <table border="0" cellpadding="0" cellspacing="0" class="mcnImageBlock" style="border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; min-width:100%;" width="100%">
                                          <tbody class="mcnImageBlockOuter">
                                              <tr>
                                                  <td class="mcnImageBlockInner" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding:0px" valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                          class="mcnImageContentContainer" style="border-collapse: collapse; mso-table-lspace: 0;
       mso-table-rspace: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust:
       100%; min-width:100%;" width="100%">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="mcnImageContent" style="mso-line-height-rule: exactly;
       -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-right: 0px;
       padding-left: 0px; padding-top: 0; padding-bottom: 0; text-align:center;" valign="top"></td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
      
      </html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
const AccountStoreLogin = {
  checkLogin: async (email, password) => {

    const emailAccount = await AccountStore.findOne({ emailStore: email });
    console.log(emailAccount)
    if (emailAccount == null) {
      return 0;
    } else {
      const checkPass = await bcrypt.compare(
        password,
        emailAccount.passStore
      );
      console.log(checkPass);
      if (checkPass == true) {
        const token = jwt.sign(
          {
            token: email,
          },
          process.env.ACCESS_KEY,
          { expiresIn: "24h" }
        );
        return token
      } else {
        return 0;
      }

    }
  }
};

module.exports = { AccountStoreRegister, AccountStoreLogin };