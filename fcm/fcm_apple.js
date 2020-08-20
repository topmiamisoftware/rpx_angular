var admin = require("firebase-admin");

var serviceAccount = require("rcp.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spotmee-68934.firebaseio.com"
});

var ads=[];
process.argv.forEach((val, index) => {
  ads[index] = val;
  ads[index] = ads[index].replace(/\\/g, '');
});
var registrationToken = ads[6];
// See documentation on defining a message payload.
var message = {
  apns: {
   headers : {
       "apns-priority" : "10"
    },    
    payload : {
      aps: {
        alert: {
          title: ads[3],
          body: ads[2]
        },
        //badge : ads[11],
        sound : "default"
      }
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
  console.log(error);
  process.exit();
});