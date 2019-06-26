const config = require('./app_conf.js');
const mail = require('./modules/mail.js');
const logger = require('./modules/log.js');
const japaneseHolidays = require('japanese-holidays');
const fs = require('fs');

Feature('RomanceCar Reservation');

Before((I) => {
  I.amOnPage('https://www.web-odakyu.com/wsr/index.jsp');
  I.fillField('#number', config.app.id);
  I.fillField('#pass', config.app.pass);
  I.click('ログイン');
  I.waitForElement('#hyoji_box');
  I.see(config.app.name);
});

Scenario('reservation', async (I) => {
  // 今日から1ヶ月後の日時を予約日とする
  let reserveDate = new Date();
  reserveDate.setMonth(reserveDate.getMonth() + 1);
  logger.system.debug('The reservation date is : ' + reserveDate.toISOString());

  let month = reserveDate.getMonth() + 1;
  if (month < 10) {
    month = '0' + String(month);
  }
  let date = reserveDate.getDate();
  if (date < 10) {
    date = '0' + String(date);
  }

  // 休日(日曜日(0) or 土曜日(6) or 祝日)なら予約をしない
  if ((reserveDate.getDay() == 0) || (reserveDate.getDay() == 6)) {
    logger.system.info('土日のためロマンスカーを予約しませんでした');
    await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')'
      + ' 土日のためロマンスカーを予約しませんでした', '');
    return;
  } else {
    let holidayName = japaneseHolidays.isHoliday(reserveDate);
    if (holidayName) {
      logger.system.info(holidayName + 'のためロマンスカーを予約しませんでした' );
      await mail.send('[RCR][SKIP] ' + '(' + month + '/' + date + ')'
        + ' ' + holidayName + 'のためロマンスカーを予約しませんでした', '');
      return;
    }
  }

  try {
    I.click('特急券予約／購入');

    I.waitForElement('#on_month', 5);
    I.selectOption('#on_month', String(month));
    I.selectOption('#on_day', String(date));
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
    message = message + '\n人数：（おとな）：' + await I .grabTextFrom('p.y_adalt + p > span');
    message = message + ', （こども）：' + await I .grabTextFrom('p.y_child + p > span');
    message = message + '\n座席：' + await I.grabTextFrom('p.com_seet + p > span');
    message = message + '\n購入額：' + await I.grabTextFrom('p.com_kounyu + p > span');
    let zangakuPoint = await I.grabTextFrom('p.com_zangaku + p > span');
    message = message + '\n残額：' + zangakuPoint;

    logger.system.info('ロマンスカーを予約しました');
    await mail.send('[RCR][SUCCESS] ' + '(' +  month + '/' + date + ')'
      + ' ロマンスカーを予約しました', message);

    logger.system.info('残額が ' + zangakuPoint + ' になりました');
    // 残額が1000円以下の場合のメール送信する
    let zangaku = zangakuPoint.slice(0, -6).replace(/,/g, '');
    if (Number(zangaku) < 1000) {
      await mail.send('[RCR][ALEART] '
        + ' 残額が ' + zangakuPoint + ' になりました', '');
    }
  } catch(error) {
    logger.system.error("ロマンスカーを予約できませんでした", error.message);
    let attachments = [
      { filename: 'reservation.failed.png',
        path : './output/reservation.failed.png',
      }];
    await mail.sendWithAttach('[RCR][ERROR] ' + '(' + month + '/' + date + ')'
      + ' ロマンスカーを予約できませんでした', error.message, attachments);
  }
});

// Scenario('holiday', (I) => {
  // let date = new Date('2019/07/15');
  // let holidayName = japaneseHolidays.isHoliday(date);
  // console.log(holidayName);
// });

// Scenario('send mail', async (I) => {
  // let attachments = [
    // { filename: '_GitHub.failed.png',
      // path : './output/test_GitHub.failed.png',
    // }];
  // await mail.sendWithAttach('[SUCESS] subject', 'bodybodybody', attachments);
// });

// Scenario('test GitHub', (I) => {
  // I.amOnPage('https://github.com');
  // I.see('GitHub------');
// });
