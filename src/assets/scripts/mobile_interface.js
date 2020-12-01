/*export var android_i = window.JsInter;
export var iphone_i;

if (navigator.platform.substr(0,2) === 'iP'){
    //iOS (iPhone, iPod or iPad)
    var lte9 = /constructor/i.test(window.HTMLElement);
    var nav = window.navigator, ua = nav.userAgent, idb = !!window.indexedDB;
    if (ua.indexOf('Safari') !== -1 && ua.indexOf('Version') !== -1 && !nav.standalone){      
        //Safari (WKWebView/Nitro since 6+)
        iphone_i = false;
    } else if ((!idb && lte9) || !window.statusbar.visible) {
        //UIWebView
        iphone_i = true;
    } else if (((window.webkit && window.webkit.messageHandlers) || !lte9 || idb) && ua.indexOf('Mozilla') == -1){
        //WKWebView
        iphone_i = true;
        A.wk_inter.on = true;                                    
    } else {
        iphone_i = false;
    }
}

export function callFilePermissionsAndroid(){
    window.JsInter.accessFile("spotbieAndroidFilePermissions");
    return;
}

window.spotbieAndroidFilePermissions = function(result){
    console.log("File Permissions : ", result);
}

export function accesLocationAndroid(){
    window.JsInter.accessLoc();
}

export function accesCameraAndroid(){
    window.JsInter.accessCam("spotbieAccessCameraCallback");
}

window.spotbieAccessCameraCallback = function(result){
    console.log("Camera Permissions : ", result);
}

export function accesMicAndroid(){
    window.JsInter.accessLoc();
}


window.spotbieSaveToken = function(the_token){
    window.alert("Trying to save token.", the_token);
}

window.spotbieLocationAccepted = function(){
    //window.alert("Spotbie location accepted.");    
}*/