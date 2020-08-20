var admin = require("firebase-admin");

var serviceAccount = require("rcp.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spotmee-68934.firebaseio.com"
});

/*
// This registration token comes from the client FCM SDKs.
var registrationToken = "eeFFnDpwH6c:APA91bEUCtvCZGE8FAAjZCsD7B49pQFM2lU6Uep5CMS7sYAZHSBRIBz3b4YEZpwurwF6WeS41mcNrj87Q6hf8NVhduWZQlVSapsXWCxt2VSCCoQZ5HhiHAtka70fML2mI_6Iq4qDlUeu";

// See documentation on defining a message payload.
var message = {
  notification : {
      body : "This is an FCM notification message!",
      title : "FCM Message",
  },
  android : {
    notification : {
        body : "This is an android FCM notification message!",
        title : "FCM Message",
        sound : "default",
        icon : "message_noti"
    }       
  },
  token: registrationToken
};*/
var ads=[];
process.argv.forEach((val, index) => {
  ads[index] = val;
  ads[index] = ads[index].replace(/\\/g, '');
});
var registrationToken = ads[6];
// See documentation on defining a message payload.
var message = {
  notification : {
      body : ads[2],
      title : ads[3],
  },
  android : {
    notification : {
        body : ads[2],
        title : ads[3],
        sound : "default",
        icon : ads[5]
    }       
  },
  data : {
    username : ads[7],
    user_id : ads[8],
    msg : ads[9],
    chat_id : ads[8]
  },
  token: registrationToken
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
.then((response) => {
  // Response is a message ID string.
  process.exit();
})
.catch((error) => {
  process.exit();
});