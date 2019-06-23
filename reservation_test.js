const config = require('./app_conf.js');
const mail = require('./modules/mail.js');
const util = require('./modules/util.js');
const logger = require('./modules/log.js');
const moment = require('moment');

Feature('RomanceCar Reservation');

Before((I) => {
  logger.system.debug("login start");

  I.amOnPage('https://www.web-odakyu.com/wsr/index.jsp');
  I.fillField('#number', config.app.id);
  I.fillField('#pass', config.app.pass);
  I.click('ログイン');
  I.waitForElement('#hyoji_box');
  I.see(config.app.name);

  logger.system.debug("login end");
});

Scenario('reservation', async (I) => {
  try {
    let reserveDate = util.getOneMonthLaterDateFromToday();
    logger.system.debug('The reservation date is : '
      + reserveDate.format("YYYY/MM/DD HH:mm:ss dddd"));

    let month = '';
    if ((reserveDate.month() + 1) < 10) {
      month = '0' + String(reserveDate.month() + 1);
    } else {
      month = String(reserveDate.month() + 1);
    }
    let date = '';
    if (reserveDate.date() < 10) {
      date = '0' + String(reserveDate.date());
    } else {
      date = String(reserveDate.date());
    }

    // 休日(日曜日(0) or 土曜日(6) or 祝日)ならば予約をスキップ
    let day = reserveDate.day();
    if ((day == 0) || (day == 6)) {
      logger.system.debug('土日のためロマンスカーを予約しませんでした');
      await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')' + 'は土日のためロマンスカーを予約しませんでした', day);
      return;

    } else {
      let holidayName = util.getHolidayName(reserveDate.toDate());
      if (holidayName) {
        logger.system.debug(holidayName + 'のためロマンスカーを予約しませんでした' );
      await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')' + 'は' + holidayName + 'のためロマンスカーを予約しませんでした', holidayName);
        return;
      }
    }

    I.click('特急券予約／購入');

    I.waitForElement('#on_month', 5);
    I.selectOption('#on_month', month);
    I.selectOption('#on_day', date);
    I.selectOption('on_hour', config.app.reserveHour);
    I.selectOption('#syuppatu', config.app.departure);
    I.selectOption('#toutyaku', config.app.arrival);
    I.selectOption('adult_num', config.app.adultNum);
    I.selectOption('child_num', config.app.childNum);
    I.click('次へ');

    I.waitForElement('#condition2', 5);
    within('#condition2', () => {
      I.click(config.app.trainName);
    });

    I.waitForElement('#Image44', 5);
    I.click('#Image44'); // 購入/予約
    I.waitForElement("#message", 5);
    I.see('購入できました。');

    I.waitForElement('p.com_zangaku', 5);
    let message  = '乗車日：' +  await I.grabTextFrom('p.com_jousya + p > span');
    message = message +  '\n列車名：' + await I.grabTextFrom('p.train_name');
    message  = message + '\n時間：' + await I.grabTextFrom('p.com_hour + p > span');
    message = message + ' - ' +  await I.grabTextFrom('p.com_hour + p + p + p > span');
    message = message + '\n人数：（おとな)：' + await I .grabTextFrom('p.y_adalt + p > span');
    message = message + ', （こども)：' + await I .grabTextFrom('p.y_child + p > span');
    message = message + '\n座席：' + await I.grabTextFrom('p.com_seet + p > span');
    message = message + '\n購入額：' + await I.grabTextFrom('p.com_kounyu + p > span');
    message = message + '\n残額：' + await I.grabTextFrom('p.com_zangaku + p > span');

    await mail.send('[RCR][SUCCESS] ' + '(' +  month + '/' + date + ')'
      + ' のロマンスカーを予約しました', message);
    logger.system.debug('ロマンスカーを予約しました');

  } catch(error) {
    await mail.send('[RCR][ERROR] ' + '(' + month + '/' + date + ')'
      + ' のロマンスカーを予約できませんでした', error.message);
    logger.system.error("Error", error.message);
  }
});

// Scenario('holiday', (I) => {
  // let date = moment('2019/07/15');
  // let holidayName = util.getHolidayName(date.toDate());
  // console.log(holidayName);
// });

// Scenario('send mail', (I) => {
  // mail.send('[SUCESS] subject', 'bodybodybody');
// });

// Scenario('test GitHub', (I) => {
  // I.amOnPage('https://github.com');
  // I.see('GitHub');
// });
