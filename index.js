const Container = require('codeceptjs').container;
const Codecept = require('codeceptjs').codecept;
const event = require('codeceptjs').event;
const path = require('path');

module.exports.reservation = async (req, res) => {

  let message = '';

  // helpers config
  let config = {
    helpers: {
      Puppeteer: {
        url: 'http://localhost', // base url
        disableScreenshots: true, // don't store screenshots on failure
        windowSize: '1200x1000', // set window size dimensions
        waitForAction: 1000, // increase timeout for clicking
        waitForNavigation: 'domcontentloaded', // wait for document to load
        chrome: {
          args: ['--no-sandbox'] // IMPORTANT! Browser can't be run without this!
        }
      }
    },

    // Once a tests are finished - send back result via HTTP
    teardown: (done) => {
      if (res != null) {
        res.send(`Finished\n${message}`);
      }
    }
  };

  // pass more verbose output
  let opts = { debug: true };

  // a simple reporter, let's collect all passed and failed tests
  event.dispatcher.on(event.test.passed, (test) => {
    message += `- Test "${test.title}" passed 😎`;
  });
  event.dispatcher.on(event.test.failed, (test) => {
    message += `- Test "${test.title}" failed 😭`;
  });

  // create runner
  let codecept = new Codecept(config, opts);

  codecept.initGlobals(__dirname);

  // create helpers, support files, mocha
  Container.create(config, opts);

  // initialize listeners
  // codecept.bootstrap();
  codecept.runHooks();

  // run bootstrap function from config
  codecept.runBootstrap();

  // load tests
  codecept.loadTests('*_test.js');

  // run tests
  codecept.run();
}
