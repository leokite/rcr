const config = require('./app_conf.js');
const mail = require('./modules/mail.js');
const util = require('./modules/util.js');

Feature('RomanceCar Reservation');

// Before((I) => {
  // I.amOnPage('https://www.web-odakyu.com/wsr/index.jsp');
  // I.retry().fillField('#number', config.app.id);
  // I.retry().fillField('#pass', config.app.pass);
  // I.click('ログイン');
  // I.retry(2).see(config.app.name);
// });

// Scenario('send mail', (I) => {
  // mail.send('[SUCESS] subject', 'bodybodybody');
// });

Scenario('test GitHub', (I) => {
  I.amOnPage('https://github.com');
  I.see('GitHub');
});

// Scenario('reservation', (I) => {
  // // TODO try catch

  // // チャージが足りているか確認

  // // 足りない場合、チャージしたことをメールし以降の処理を行う

  // // 足りている場合、何もせずに以降の処理を行う

  // // 現在日時を取得
  // // 1ヶ月後が休日かどうかを確認（土曜日、日曜日、祭日）
  // var oml = util.getOneMonthLater();
  // console.log(oml);
  // console.log(oml.month() + 1  + "月");
  // console.log(oml.date() + "日");
  // console.log(oml.day()); // 0 - 6


  // // 休日ならば、休日のため予約しなかったというメールを送信

  // // 休日でなければ、予約をして結果をメール送信

// });

