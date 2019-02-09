"use strict";
/**
 * 
 */
//時間用のクラス
class TimeLimit{
    constructor(dispTimer,splitTag){
        this.objNum = Math.floor(Math.random()*100);
        this.moveFlg = true;
        this.splitTag = splitTag;
        this.limitSec = this.timeStringToSec(dispTimer,splitTag);
        this.settingSec = this.limitSec;
        this.startTime = this.getCurrentTime();
    }
    getNum(){
        return this.objNum;
    }

    start(){
        this.moveFlg = true;        
    }
    stop(){
        this.moveFlg = false;
    }
    getFlg(){
        return this.moveFlg;
    }

    secToTimeString(){
        // console.log("this.limitSec:"+this.limitSec);
        let min = Math.floor(this.divide60(this.limitSec));
        // console.log("min:"+min);
        return String(min)+this.splitTag+String(this.limitSec-this.multipli60(min));
    }


    getTime(){
        return this.secToTimeString();
    }

    calcLimitTime(){
        this.limitSec=this.settingSec - this.elapsedTime();
        return this.limitSec;
    }

    timeStringToSec(dispTimer,splitTag){
        let tmpTimeArray = dispTimer.split(splitTag);  
        return this.multipli60(Number(tmpTimeArray[0]))+Number(tmpTimeArray[1]);
    }

    getSec(){
        return this.changeSce();
    }

    setSec(sec){}

    /**
     * return current time
     * @return  {Number} current time
     */
    getCurrentTime(){
        return Date.now()/1000;
    }

    /**
     * return start time
     * @return  {Number} current time
     */
    getStartTime(){
        return this.startTime;
    }

    /**
     * Elapsed time since obj was created
     * @return  {Number} elapsed time
     */
    elapsedTime(){
        return Math.floor(this.getCurrentTime()-this.startTime);
    }

    /**
     * Return the remaining time set in obj
     * @return  {Number} remain time
     */
    getRemainTime(){
        return this.calcLimitTime();
    }


    /**
     * 
     */
    changeSec(){
        //時分秒を秒数に変更
        return Number(this.hour*60*60)+Number(this.min*60)+Number(this.sec);
    }

    secToMin(sec){
        return this.divide60(sec);
    }

    secToHour(sec){
        return this.divide60(this.divide60(sec));
    }

    minToSec(min){
        // console.log("min:"+min);
        return min * 60;
    }

    divide60(num){
        return num/60;
    }

    multipli60(num){
        return num*60;
    }

    startSec(){
        this.sec = Number(this.sec)+1;
        return this;
    }
    margeTime(m,s){
        let sec = String(s);
        if(sec.length<2){
            sec="0"+sec;
        }
        return m +":"+ sec;
    }

    getTimeStr(){
        let min = Math.floor(this.secToMin(this.limitSec));
        let sec = this.limitSec - this.minToSec(min);
        let time = this.margeTime(min,sec);
        return time;
    }
}