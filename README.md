Romancecar Reservation Tool
----------

Getting Started
----------
  $ git clone https://github.com/leokite/rcr.git
  $ cd rcr
  $ npm install
  $ ./node_modules/.bin/codeceptjs run --steps

Set up Launchd
----------
  $ cd rcr
  $ chmod +x run.sh
  $ sudo cp ./my.app.rcr.run.plist /Library/LaunchDaemons/my.app.rcr.run.plist
  $ sudo chown root /Library/LaunchDaemons/my.app.rcr.run.plist
  $ sudo lauchctl load /Library/LaunchDaemons/my.app.rcr.run.plist

Tear down Launchd
----------
  $ sudo lauchctl unload /Library/LaunchDaemons/my.app.rcr.run.plist

