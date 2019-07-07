Romancecar Reservation Tool
----------

Getting Started
----------
  $ git clone https://github.com/leokite/rcr.git
  $ cd rcr
  $ npm install
  $ ./node_modules/.bin/codeceptjs run --steps

Config
----------
// 6:44 町田始発
trainName : 'メトロモーニングウェイ４０号'
// 8:33 町田始発
trainName : 'メトロモーニングウェイ４２号'

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

Set up Cloud Functions
----------
   $ gcloud config set project <PROJECT-NAME>
   $ gcloud config set compute/region asia-northeast1
   $ gcloud config set compute/zone asia-northeast1-a
   $ gcloud beta functions deploy reservation --trigger-http --runtime nodejs8 --memory 1024MB --region asia-northeast1 --set-env-vars TZ=Asia/Tokyo

   Note: Need to set up Cloud Scheduler to trigger this Cloud Functions using HTTP.

//
