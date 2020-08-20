const WebSocketServer = require('ws').Server;
const WebSocket = require('ws');
const express = require('express');
const https = require('https');
const app = express();
const fs = require('fs');
const pkey = fs.readFileSync("/opt/lampp/etc/ssl.key/server.key");
const pcert = fs.readFileSync("/opt/lampp/etc/ssl.crt/server.crt");

const options = {key: pkey, cert: pcert};
var wss = null;
var sslSrv = null;
var connections = [];
 
// use express static to deliver resources HTML, CSS, JS, etc)
// from the public folder 
app.use(express.static('./not'));

// start server (listen on port 49152 - SSL)
sslSrv = https.createServer(options, app).listen(49152);
console.log("The HTTPS server is up and running");

// create the WebSocket server
wss = new WebSocketServer({server: sslSrv});  
console.log("WebSocket Secure server is up and running.");

/** successful connection */
wss.on('connection', function (client) {
  /** incomming message */
  client.on('message', function (msg_obj) {
    var art = [msg_obj, client];
    wss.messageDecoder(art);
  });
  client.on('close', function(){
    var idx = connections.indexOf(client)-1;
    console.log("User : " + connections[idx] + " has disconnected.");
    connections.splice(idx, 2);
    console.log('The connections are : ' + connections.toString());      
  });
});
// broadcasting the message to all WebSocket clients.
wss.messageDecoder = function(art){
    var msg = art[0];
    var client = art[1];
    var msg_bar = msg.split('&!exentriks576=');
    var cid = msg_bar[0].split('?aMsg=');
    cid = cid[1].toString();
    switch(cid){
        case '0':
            wss.setClient(msg_bar[1], client);
            break;
        case '1':
            wss.makeCall(msg_bar[1], client);
            break;
        case '2':
            wss.acceptCall(msg_bar[1], client);
            break;
        case '3':
          //wss.disconnect(msg_bar[1], client);
          break;
        case '4':
          wss.sendChatMsg(msg_bar[1], client);
          break;
        case '5':
          wss.sendFriendReq(msg_bar[1], client);
          break;
    }
    return;
};
wss.sendFriendReq = function(msg, client){
  msg = msg.split('^x^');
  var to_id = msg[0];
  var from_id = msg[1];
  var idx = connections.indexOf(to_id);
  var idx_1 = idx + 1;  
  console.log(from_id + ' send friend request to ' + to_id);
  client = connections[idx_1];
  var dat = "3^$^"+from_id;
  client.send(dat);    
};
wss.sendChatMsg = function(msg, client){
  msg = msg.split('^x^');
  var to_id = msg[0];
  var from_id = msg[1];
  var idx = connections.indexOf(to_id);
  var idx_1 = idx + 1;  
  console.log(from_id + ' send message to ' + to_id);
  client = connections[idx_1];
  var dat = "2^$^"+from_id;
  if(idx > -1){
    client.send(dat); 
  }
};
wss.disconnect = function(msg, client){
  client.close();
  var client_id = msg;
  var idx = connections.indexOf(client_id);
  console.log("User : " + connections[idx] + " has disconnected.");
  connections.splice(idx, 2);
  console.log(connections.toString());  
};
wss.acceptCall = function(msg, client){
    msg = msg.split('^x^');
    var u_id = msg[0];
    var from_id = msg[1];
    var idx = connections.indexOf(u_id);
    var idx_1 = idx + 1;
    console.log('Accepting call from user ' + u_id);
    client = connections[idx_1];
    var dat = "1^$^"+from_id;
    client.send(dat);    
}
wss.makeCall = function(msg, client){
    msg = msg.split('^x^');
    var to_id = msg[0];
    var from_id = msg[1];
    console.log('User' + from_id + ' trying to call user: ' + to_id);
    var idx = connections.indexOf(to_id);
    var idx_1 = idx + 1;
    client = connections[idx_1];
    var dat = "0^$^"+from_id;
    client.send(dat);
}
wss.setClient = function(client_id, client){
    var exists = connections.indexOf(client_id);
    if(exists > -1){
        //user already exists
        return;
    }
    console.log("User : "+client_id+" has connected.");
    connections.push(client_id, client);   
};
wss.sendToUser = function(msg){
    var clt_id = msg.client_id;
    var client = connections[connections.indexOf(clt_id) + 1];
    var mesg = msg.msg;
    client.send(mesg);
};