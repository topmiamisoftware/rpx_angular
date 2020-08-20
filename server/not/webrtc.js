var config = {
  wssHost: 'wss://spotbie.com:49152'
  // wssHost: 'wss://example.com/myWebSocket'
};

var wsc = null;
var urll = window.location.href;
var url = new URL(urll);
var client_id = url.searchParams.get("a");

function pageReady(){
    wsc = new WebSocket(config.wssHost);
    wsc.onopen = function(evt){
        wsc.send('?aMsg=0&!exentriks576='+client_id);
        return;
    };
    wsc.onmessage = function(msg){
        dcodeMessage(msg);
    };
    window.addEventListener('message', function(event){
        // IMPORTANT: Check the origin of the data! 
        if (~event.origin.indexOf('http://127.0.0.1')) { 
            // The data has been sent from your site 
            // The data sent with postMessage is stored in event.data 
            decodeMessage(event.data);
        } else { 
            // The data hasn't been sent from your site! 
            // Be careful! Do not use it. 
            return; 
        }         
    });  
}
function dcodeMessage(msg){
    msg = msg.data;
    msg = msg.split('^$^');
    console.log('the message is ' + msg);
    var ac = msg[0].toString();
    var rmsg = msg[1];
    switch(ac){
        case '0':
            requireAnswer(rmsg);
            break;
        case '1':
            callAccepted(rmsg);
            break;
        case '2':
            msgChtRciv(rmsg);
            break;
        case '3':
            friendRqRc(rmsg);
            break;
    }
}
function decodeMessage(data){
    var ac = data.ac;
    switch(ac){
        case '0':
            liveChatInit(data);
            break;
        case '1':
            acceptCall(data);
            break;
        case '2':
          closeConnection(data);
          break;
        case '3':
          sendChatMsg(data);
          break;
        case '4':
          sendFriendRequest(data);
          break;
    }
}
function sendFriendRequest(data){
  var u_id = data.u_id;
  var f_id = data.from_id;
  var msg = '?aMsg=5&!exentriks576='+u_id+'^x^'+f_id;
  wsc.send(msg);
  return;
}
function sendChatMsg(data){
  var u_id = data.u_id;
  var f_id = data.from_id;
  var msg = '?aMsg=4&!exentriks576='+u_id+'^x^'+f_id;
  wsc.send(msg);
  return;
}
function closeConnection(data){
  /*
  var u_id = data.u_id;
  var msg = '?aMsg=3&!exentriks576='+u_id;
  wsc.send(msg);*/
  wsc.close();
  //console.log('closing eb socket ' + u_id);
  return;
}
function acceptCall(data){
    var u_id = data.u_id;
    var from_id = data.from_id;
    var msg = '?aMsg=2&!exentriks576='+u_id+'^x^'+from_id;
    wsc.send(msg);
}
function friendRqRc(msg){
  //chat message received
    msg = msg.split('^x^');
    var from_id = msg[0];
    var dat = {
        ac : 3,
        from_id : from_id
    };
    parent.window.postMessage(dat, '*');    
}
function msgChtRciv(msg){
  //chat message received
    msg = msg.split('^x^');
    var from_id = msg[0];
    var dat = {
        ac : 2,
        from_id : from_id
    };
    parent.window.postMessage(dat, '*');    
}
function callAccepted(msg){
    msg = msg.split('^x^');
    var from_id = msg[0];
    var dat = {
        ac : 1,
        from_id : from_id
    };
    parent.window.postMessage(dat, '*');    
}
function requireAnswer(msg){
    msg = msg.split('^x^');
    var from_id=msg[0];
    var dat = {
        ac : 0,
        from_id : from_id
    };
    parent.window.postMessage(dat, '*');
}
function liveChatInit(data){
    var u_id = data.u_id;
    var f_id = data.from_id;
    console.log('Trying to call user');
    var msg = '?aMsg=1&!exentriks576='+u_id+'^x^'+f_id;
    wsc.send(msg);
}