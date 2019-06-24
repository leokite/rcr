const logger = require('./log.js');
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
  text: 'default text',
  attachments: null
};
const transporter = nodemailer.createTransport(smtp);

module.exports.send = function(subject, text) {
  try {
    message.subject = subject;
    message.text = text;
    transporter.sendMail(message, function(error, info) {
      if (error) {
        logger.system.error("send mail failed");
        logger.system.error(error.message);
        return;
      }
      logger.system.debug("send mail successful");
      logger.system.debug(info.messageId);
    });
  } catch(e) {
    logger.system.error("Error", e);
  }
};

module.exports.sendWithAttach = function(subject, text, attachments) {
  try {
    message.subject = subject;
    message.text = text;
    message.attachments = attachments;
    transporter.sendMail(message, function(error, info) {
      if (error) {
        logger.system.error("send mail failed");
        logger.system.error(error.message);
        return;
      }
      logger.system.debug("send mail successful");
      logger.system.debug(info.messageId);
    });
  } catch(e) {
    logger.system.error("Error", e);
  }
};

