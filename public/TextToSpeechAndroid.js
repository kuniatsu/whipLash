"use strict";
class TextToSpeechAndroid{
    //https://press.monaca.io/atsushi/152
    speak(text){
        console.log("TextToSpeechAndroid.speech:"+text);
        console.log("TTS_plugin");
        TTS.speak({
            text: text,
            locale: 'ja-JP'
        }, function () {
            console.log(text+'  :success!!!!');
        }, function (reason) {
            console.log(reason);
        });
    }

}