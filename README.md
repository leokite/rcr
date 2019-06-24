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

Set up Cloud Functions with HTTP Trigger
----------
   $ gcloud config set project <PROJECT-NAME>
   $ gcloud config set compute/region asia-northeast1
   $ gcloud config set compute/zone asia-northeast1-a
   $ gcloud beta functions deploy reservation --trigger-resource <TOPIC-NAME> --trigger-event google.pubsub.topic.publish --runtime nodejs8 --memory 1024MB --region asia-northeast1 --set-env-vars TZ=Asia/Tokyo

Call Cloud Functions Manually
-----------
   $ gcloud functions call reservation

//
