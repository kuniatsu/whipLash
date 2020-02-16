"use strict";
class TextToSpeechAndroid{
    constructor(){
        this.audio_0 = new Audio("./AndroidVoice/0.mp3");
        this.audio_1 = new Audio("./AndroidVoice/1.mp3");
        this.audio_2 = new Audio("./AndroidVoice/2.mp3");
        this.audio_3 = new Audio("./AndroidVoice/3.mp3");
        this.audio_4 = new Audio("./AndroidVoice/4.mp3");
        this.audio_5 = new Audio("./AndroidVoice/5.mp3");
        this.audio_6 = new Audio("./AndroidVoice/6.mp3");
        this.audio_7 = new Audio("./AndroidVoice/7.mp3");
        this.audio_8 = new Audio("./AndroidVoice/8.mp3");
        this.audio_9 = new Audio("./AndroidVoice/9.mp3");
        this.audio_nextTask = new Audio("./AndroidVoice/nextTask.mp3");
        this.audio_setTask = new Audio("./AndroidVoice/setTask.mp3");
    }

    async speak(text){
        console.log("TextToSpeechAndroid.speech:"+text);
        switch(text){
            case "0":
                this.audio_0.play();
                break;
            case "1":
                this.audio_1.play();
                break;
            case "2":
                this.audio_2.play();
                break;
            case "3":
                this.audio_3.play();
                break;
            case "4":
                this.audio_4.play();
                break;                                                            
            case "5":
                this.audio_5.play();
                break;
            case "6":
                this.audio_6.play();
                break;                                                           
            case "7":
                this.audio_7.play();
                break;
            case "8":
                this.audio_8.play();
                break;
            case "9":
                this.audio_9.play();
                break;     
            case "10":
                this.audio_9.play();
                break;     
            case 0:
                this.audio_0.play();
                break;
            case 1:
                this.audio_1.play();
                break;
            case 2:
                this.audio_2.play();
                break;
            case 3:
                this.audio_3.play();
                break;
            case 4:
                this.audio_4.play();
                break;                                                            
            case 5:
                this.audio_5.play();
                break;
            case 6:
                this.audio_6.play();
                break;                                                           
            case 7:
                this.audio_7.play();
                break;
            case 8:
                this.audio_8.play();
                break;
            case 9:
                this.audio_9.play();
                break;        
            case 10:
                break;        

            case "あと1分です":
                break;
            case "あと2分です":
                break;
            case "あと3分です":
                break;
            case "あと4分です":
                break;
            case "あと5分です":
                break;
            case "タスクを登録する":
                this.audio_setTask.play();
                break;
            default:
                this.audio_nextTask.play();
                break;
        }
    }

}