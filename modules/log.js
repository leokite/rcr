const log4js = require('log4js');
log4js.configure('log4js_setting.json');
module.exports.system = log4js.getLogger();
