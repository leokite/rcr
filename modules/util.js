const moment = require('moment');
const japaneseHolidays = require('japanese-holidays');

module.exports.getOneMonthLaterDateFromToday = function() {
  let today = moment();
  return today.add(1, 'months');
};

module.exports.getHolidayName = function(date) {
  return japaneseHolidays.isHoliday(date);
};
