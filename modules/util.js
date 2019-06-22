const moment = require('moment');

module.exports.getOneMonthLater = function() {
  var today = moment();
  return today.add(1, 'months');
};
