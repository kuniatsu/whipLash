"use strict";
class WebStorage{
    constructor(){
        this.storage = localStorage;
    }
    checkWs(){
        if (typeof(Storage) === "undefined") {
            console.log("保存機能が使えません");
            return false;
        }
        return true;
    }
    checkItem(key){
        if(this.storage.getItem(key) == undefined){
            return true;
        }
        return false;
    }

    log(){
        console.dir(this.getAllItem());
    }
    setItem(name,item){
        //webstorageに保存
        console.log(name+":"+item);
        this.storage.setItem(name,item);
    }
    getWsCount(){
        return this.storage.length;
    }
    getItem(name){
        //webstorageから読み出し
        return this.storage.getItem(name);
    }
    getAllItem(){
        return this.storage;
    }
    removeItem(key){
        this.storage.removeItem(key);
    }
    clear(){
        this.storage.clear();
    }
    setSelectorInnerText(selector,key){
        let textArray = [];
        let eleArray = document.querySelectorAll(selector);
        eleArray.forEach((ele)=>{
            textArray.push(ele.innerText);
        });
        this.setItem(key,textArray);
    }

}