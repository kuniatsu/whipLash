"use strict";
class TextToSpeech{
    constructor(){
            this.speach = new SpeechSynthesisUtterance();
            this.speach.lang = 'ja-JP';//言語
            this.speach.rate = 1;//速度
    }

    async speak(text){
        this.speach.text = text;// 喋る内容
        speechSynthesis.speak(this.speach);// 発話実行
        return true;
    }
}