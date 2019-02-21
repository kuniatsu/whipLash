"use strict";

/**
 * Get the URL parameter value
 * @param  name {string} parameter key name
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url=false) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * select Log
 */
function log(level,text,dir=false){
    if(getParam()<level){
        return;
    }else if(!dir){
        console.log(text);
    }else{
        console.dir(text);
    }
}





