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
  I.see(config.app.name);
  logger.system.debug("login end");
});

Scenario('reservation', async (I) => {
  try {
    // 1ヶ月後が休日かどうかを確認（土曜日(6)、日曜日(0)、「祝日」）
    let oneMonthLater = util.getOneMonthLater();
    logger.system.debug("The reservation date is : "
      + oneMonthLater.format("YYYY/MM/DD HH:mm:ss dddd"));

    // 休日ならば、予約しなかったというメールを送信
    let day = oneMonthLater.day();
    if ((day == 0) || (day == 6)) {
      logger.system.debug("ロマンスカーを予約しませんでした" + day);
      await mail.send('[SKIP] ロマンスカーを予約しませんでした', day);
      return;
    } else {
      let holidayName = util.getHolidayName(oneMonthLater.toDate());
      if (holidayName) {
        logger.system.debug("ロマンスカーを予約しませんでした" + holidayName);
        await mail.send('[SKIP] ロマンスカーを予約しませんでした', holidayName);
        return;
      }
    }

    I.click('特急券予約／購入');

    let month = '';
    if ((oneMonthLater.month() + 1) < 10) {
      month = '0' + String(oneMonthLater.month() + 1);
    } else {
      month = String(oneMonthLater.month() + 1);
    }
    let date = '';
    if (oneMonthLater.date() < 10) {
      date = '0' + String(oneMonthLater.date());
    } else {
      date = String(oneMonthLater.date());
    }
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

    await mail.send('[SUCCESS] ' + month + '/' + date  + ' ロマンスカーを予約しました', message);

  } catch(error) {
    await mail.send('[ERROR] ロマンスカーを予約できませんでした', error.message);
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
