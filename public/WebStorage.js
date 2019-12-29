"use strict";
/**
 * class for using webstorage
 */
class WebStorage{
    constructor(){
        this.storage = localStorage;
    }

    /**
     * Check if Webstorage can be used for browsers
     * @return  {bool} Check result
     */
    checkWs(){
        if (typeof(Storage) === "undefined") {
            console.log("can't use webstorage");
            return false;
        }
        return true;
    }

    /**
     * check is key exists in webstorage
     * @param   {String} keyName
     * @return  {bool} 
     */
    checkItem(key){
        if(this.storage.getItem(key) == undefined){
            return false;
        }
        return true;
    }

    /**
     * set to webstorage
     * @param   {String} key
     * @param   {String} value 
     */
    setItem(key,value){
        console.log(key+":"+value);
        this.storage.setItem(key,value);
    }

    /**
     * add CommaSeparatorData to webstorage
     * @param   {String} key
     * @param   {String} value 
     */
    addCommaItem(key,value){
        if(this.checkItem(key)){
            console.log("addCommaItem ->"+ key+":"+this.getItem(key)+","+value);
            this.setItem(key,this.getItem(key)+","+value);
        }else{
            //存在しないリストにaddする場合
            console.log("addCommaItem.make ->"+ key+":"+value);
            this.setItem(key,value);
        }
    }

    /**
     * Count the contents of webStrage
     * @return  {Number} count Number 
     */
    getWsCount(){
        return this.storage.length;
    }

    /**
     * Specified item to be get
     * @param   {String} key
     * @return  {Number} count Number 
     */
    getItem(key){
        return this.storage.getItem(key);
    }

    /**
     * All item to be get
     * @return  {Number} count Number 
     */
    getAllItem(){
        return this.storage;
    }

    /**
     * Specified item to be delete
     * @param   {String} key
     */
    removeItem(key){
        this.storage.removeItem(key);
    }

    /**
     * All item to be delete
     */
    clear(){
        this.storage.clear();
    }

    /**
     * Specified selector to be get and save to webStrage
     * @param  {String} selector
     * @param   {String} key
     */
    setSelectorInnerText(selector,key){
        console.log("setSelectorInnerText");
        let textArray = [];
        let eleArray = document.querySelectorAll(selector);
        eleArray.forEach((ele)=>{
            if(ele.innerText != ""){
                textArray.push(ele.innerText);
            }
        });
        this.setItem(key,textArray);
    }

    /**
     * Specified selector to be get and save to webStrage
     * @param  {String} selector
     * @param   {String} key
     */
    setSelectorValue(selector,key){
        console.log("setSelectorValue");
        let textArray = [];
        let eleArray = document.querySelectorAll(selector);
        eleArray.forEach((ele)=>{
            if(ele.value != ""){
                textArray.push(ele.value);
            }
        });
        console.dir(textArray);
        this.setItem(key,textArray);
    }

    /**
     * Output contents of webstorage to log
     */
    log(){
        console.dir(this.getAllItem());
    }
}