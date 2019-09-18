"use strict";
/**
 * class for counting limitTime
 */
class TimeLimit{
    constructor(dispTimer,splitTag){
        this.objID = Math.floor(Math.random()*100);
        this.moveFlg = true;
        this.splitTag = splitTag;
        this.limitSec = this.timeStringToSec(dispTimer,splitTag);
        this.settingSec = this.limitSec;
        this.startTime = this.getCurrentTime();
    }

    /**
     * return ObjectID
     * @return  {Number} ObjectID  
     */
    getID(){
        return this.objID;
    }

    /**
     * Change the object to active
     */
    start(){
        this.moveFlg = true;        
    }

    /**
     * Change the object to inactivity
     */
    stop(){
        this.moveFlg = false;
    }

    /**
     * Check if Object is active
     * @return  {boole} moveFlag  
     */ 
    getFlg(){
        return this.moveFlg;
    }

    /**
     * Change seconds to displayString
     * @return  {String} second  
     */ 
    secToTimeString(){        
        let min = Math.floor(this.divide60(this.limitSec));
        return String(min)+this.splitTag+String(this.limitSec-this.multipli60(min));
    }

    /**
     * Get second in Object
     * @return  {String} second  
     */ 
    getTime(){
        return this.secToTimeString();
    }

    /**
     * Calculate LimitTime
     * @return  {Number} second  
     */ 
    calcLimitTime(mode=null){
        console.dir("calcLimitTime() ");
        console.dir("mode:"+mode);

        if(this.limitSec > 10){
            //正確な時間を返却 50/60でここを通過
            console.log("this.limitSec > 10");
            this.limitSec=this.settingSec - this.elapsedTime();
        }else if(mode == "COUNT"){
            //10秒以内なら必ず１づつ数えること
            console.log("modeはcountで10秒以内");
            this.limitSec-= 1;
        }else{
            console.log("else");
            this.limitSec=this.settingSec - this.elapsedTime();
        }
        return this.limitSec;
    }


    /**
     * Calculate LimitTime
     * @return  {Number} second  
     */ 
    timeStringToSec(dispTimer,splitTag){
        let tmpTimeArray = dispTimer.split(splitTag);  
        return this.multipli60(Number(tmpTimeArray[0]))+Number(tmpTimeArray[1]);
    }

    /**
     * return currentTime
     * @return  {Number} current time
     */
    getCurrentTime(){
        return Date.now()/1000;
    }

    /**
     * return startTime
     * @return  {Number} start time
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
     * Convert minutes to seconds
     * @return  {Number} seconds
     */
    changeSec(){
        return Number(this.hour*60*60)+Number(this.min*60)+Number(this.sec);
    }

    /**
     * Convert seconds to minutes
     * @param   {Number} seconds
     * @return  {Number} minutes
     */
    secToMin(sec){
        return this.divide60(sec);
    }

    /**
     * Convert seconds to hour
     * @param   {Number} seconds
     * @return  {Number} hour
     */
    secToHour(sec){
        return this.divide60(this.divide60(sec));
    }

    /**
     * Convert minutes to seconds
     * @param   {Number} minutes
     * @return  {Number} seconds
     */
    minToSec(min){
        return min * 60;
    }

    /**
     * Calculate the Number divided by 60
     * @param   {Number} num
     * @return  {Number} num
     */
    divide60(num){
        return num/60;
    }

    /**
     * Calculate the Number multipli by 60
     * @param   {Number} num
     * @return  {Number} num
     */
    multipli60(num){
        return num*60;
    }

    /**
     * Create timeString for display
     * @param   {Number} minutes
     * @param   {Number} seconds
     * @return  {String} time
     */
    margeTime(m,s){
        let sec = String(s);
        if(sec.length<2){
            sec="0"+sec;
        }
        return m +":"+ sec;
    }

    /**
     * get timeString for display
     * @return  {String} time
     */
    getTimeStr(){
        let min = Math.floor(this.secToMin(this.limitSec));
        let sec = this.limitSec - this.minToSec(min);
        let time = this.margeTime(min,sec);
        return time;
    }
}