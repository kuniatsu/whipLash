"use strict";
/**
 * class for config
 */
class Config{
    constructor(){
        this._timelimit = "3:00";
        this._order = "Sequential";
        this._showlist = "ON";
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

    get showlist(){
        return this._showlist
    }
    set showlist(arg){
        this._showlist = arg;
    }

    get animetion(){
        return this._animetion
    }
    set animetion(arg){
        this._animetion = arg;
    }
}