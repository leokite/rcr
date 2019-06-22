const config = require('./app_conf.js');
const mail = require('./modules/mail.js');
const util = require('./modules/util.js');

Feature('RomanceCar Reservation');

Before((I) => {
  // login
  I.amOnPage('https://www.web-odakyu.com/wsr/index.jsp');
  I.fillField('#number', config.app.id);
  I.fillField('#pass', config.app.pass);
  I.click('ログイン');
  I.see(config.app.name);
});

// Scenario('send mail', (I) => {
  // mail.send('[SUCESS] subject', 'bodybodybody');
// });

// Scenario('test GitHub', (I) => {
  // I.amOnPage('https://github.com');
  // I.see('GitHub');
// });

Scenario('reservation', async (I) => {
  try {
    // チャージが足りているか確認
    // 足りない場合、チャージしたことをメールし以降の処理を行う
    // 足りている場合、何もせずに以降の処理を行う

    // 1ヶ月後が休日かどうかを確認（土曜日(6)、日曜日(0)、「祝日」）
    let oneMonthLater = util.getOneMonthLater();

    // 休日ならば、休日のため予約しなかったというメールを送信

    // 休日でなければ、予約をして結果をメール送信
    I.click('特急券予約／購入');

    let month = '';
    let date = '';
    if ((oneMonthLater.month() + 1) < 10) {
      month = '0' + String(oneMonthLater.month() + 1);
    }
    if (oneMonthLater.date() < 10) {
      date = '0' + String(oneMonthLater.date() + 1);
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

    I.waitForElement('p.zom_zangaku', 5);
    let message  = '乗車日：' +  await I.grabTextFrom('p.com_jousya + p > span');
    message = message +  '\n列車名：' + await I.grabTextFrom('p.train_name');
    message  = message + '\n時間：' + await I.grabTextFrom('p.com_hour + p:nth-of-type(1) > span');
    message = message + ' ' +  await I.grabTextFrom('p.com_hour + p:nth-of-type(3) > span');
    message = message + '\n人数：（おとな)：' + await I .grabTextFrom('p.y_adalt + p > span');
    message = message + ', （こども)：' + await I .grabTextFrom('p.y_child + p > span');
    message = message + '\n座席：' + await I.grabTextFrom('p.com_seet + p > span');
    message = message + '\n購入額：' + await I.grabTextFrom('p.com_kounyu + p > span');
    message = message + '\n残額：' + await I.grabTextFrom('p.com_zangaku + p > span');
    await mail.send('[SUCCESS] ' + month + '/' + date  + ' ロマンスカーを予約しました', message);
  } catch(error) {
    await mail.send('[ERROR] ロマンスカーを予約できませんでした', error.message);
    console.log("Error!", e);
    // logger.system.error("Error", e);
  }

});

