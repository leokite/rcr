const config = require('./app_conf.js');
const mail = require('./modules/mail.js');
const logger = require('./modules/log.js');
const japaneseHolidays = require('japanese-holidays');

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

  // 今日から1ヶ月後の日時を取得
  let reserveDate = new Date();
  reserveDate.setMonth(reserveDate.getMonth() + 1);
  logger.system.debug('The reservation date is : '
    + reserveDate.toString());

  let month = '';
  if ((reserveDate.getMonth() + 1) < 10) {
    month = '0' + String(reserveDate.getMonth() + 1);
  } else {
    month = String(reserveDate.getMonth() + 1);
  }
  let date = '';
  if (reserveDate.getDate() < 10) {
    date = '0' + String(reserveDate.getDate());
  } else {
    date = String(reserveDate.getDate());
  }

  // 休日(日曜日(0) or 土曜日(6) or 祝日)ならば予約をスキップ
  if ((reserveDate.getDay() == 0) || (reserveDate.getDay() == 6)) {
    logger.system.debug('土日のためロマンスカーを予約しませんでした');
    await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')' + ' 土日のためロマンスカーを予約しませんでした', '');
    return;
  } else {
    let holidayName = japaneseHolidays.isHoliday(reserveDate);
    if (holidayName) {
      logger.system.debug(holidayName + 'のためロマンスカーを予約しませんでした' );
      await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')' + ' ' + holidayName + 'のためロマンスカーを予約しませんでした', '');
      return;
    }
  }

  try {
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
      + ' ロマンスカーを予約しました', message);
    logger.system.debug('ロマンスカーを予約しました');

  } catch(error) {
    await mail.send('[RCR][ERROR] ' + '(' + month + '/' + date + ')'
      + ' ロマンスカーを予約できませんでした', error.message);
    logger.system.error("Error", error.message);
  }
});

// Scenario('holiday', (I) => {
  // let date = new Date('2019/07/15');
  // let holidayName = japaneseHolidays.isHoliday(date);
  // console.log(holidayName);
// });

// Scenario('send mail', (I) => {
  // mail.send('[SUCESS] subject', 'bodybodybody');
// });

// Scenario('test GitHub', (I) => {
  // I.amOnPage('https://github.com');
  // I.see('GitHub');
// });
