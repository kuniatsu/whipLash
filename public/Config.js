"use strict";
/**
 * class for config
 */
class Config{
    //timelimit=3:00&order=Random&hidelist=OFF&animetion=ON
    constructor(){
        this._timelimit = "3:00";
        this._order = "Sequential";
        this._hidelist = "OFF";
        this._animetion = "ON";
    }

    get timelimit(){
        return this._timelimit
    }
    set timelimit(time){
        this._timelimit = time;
    }

    get order(){
        return this._order;
    }
    set order(arg){
        this._order = arg;
    }

    get hidelist(){
        return this._hidelist
    }
    set hidelist(arg){
        this._hidelist = arg;
    }

    get animetion(){
        return this._animetion
    }
    set animetion(arg){
        this._animetion = arg;
    }
}