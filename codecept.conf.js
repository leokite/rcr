exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost',
      waitForAction: 1000,
      waitForNavigation: [ "domcontentloaded", "networkidle0" ],
      show: true,
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'romancecar-reservation'
}
