const config = require('../app_conf.js');
const nodemailer = require('nodemailer');
const gmailAuth = {
  type: 'OAuth2',
  user: config.app.mailFrom,
  clientId: config.app.clientId,
  clientSecret: config.app.clientSecret,
  refreshToken: config.app.refreshToken
};
const smtp = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth : gmailAuth
};
const message = {
  from: config.app.mailFrom,
  to: config.app.mailTo,
  subject: 'default subject',
  text: 'default text'
};
const transporter = nodemailer.createTransport(smtp);

module.exports.send = function(subject, text) {
  try {
    message.subject = subject;
    message.text = text;
    transporter.sendMail(message, function(error, info) {
      if (error) {
        console.log("send mail failed");
        console.log(error.message);
        // logger.system.error("send mail failed");
        // logger.system.error(error.message);
        return;
      }
      console.log("send mail successful");
      console.log(info.messageId);
      // logger.system.info("send mail successful");
      // logger.system.info(info.messageId);
    });
  } catch(e) {
    console.log("Error", e);
    // logger.system.error("Error", e);
  }
};

