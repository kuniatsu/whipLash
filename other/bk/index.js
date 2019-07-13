var timerId;
var timeTmp;
var buttonFlg;
var countDarwin=0;
var darwinFlg = false;
var insertLI;
var tasklist;


window.onload = ()=>{
    taskLoad();
}


(function(){
    'use strict';
    var timer = document.getElementById('timer');
    var hour = document.getElementById('hour');
    var min = document.getElementById('min');
    var sec = document.getElementById('sec');    
    var timeText = document.getElementById('timeText');    
    var taskAdd = document.getElementById('taskAdd');
    var taskAdd2 = document.getElementById('taskAdd2');
    var taskNext = document.getElementById('taskNext');
    var taskText = document.getElementById('taskText');
    var taskText2 = document.getElementById('taskText2');
    var areaAddchange = document.getElementById('areaAddchange');
    var areaAddchange2 = document.getElementById('areaAddchange2');
    var startAndstop = document.getElementById('startAndstop');
    insertLI = document.getElementById('insertLI');
    tasklist = document.getElementsByClassName('tasklist')[0];
    var h2 = document.getElementsByTagName('h2')[0];
    var ws = document.getElementById('ws');
    var ws_c = document.getElementById('delete_id');
    var setUpDisp = document.getElementById('setUpDisp');
    var setUphidden = document.getElementById('setUphidden');
    var testbutton = document.getElementById('testbutton');
    var checkLoop = document.getElementById('checkLoop');
    
    /*
    testbutton.addEventListener('click',()=>{
        var ws = new webStorage();
        alert(
            ws.getItem("menu")
        );
    });
    */    

    /*左上メニューのid配列*/
    var selectBox = [
        document.getElementById('selectAnime'),
        document.getElementById('hour'),
        document.getElementById('min'),
        document.getElementById('sec'),
        document.getElementById('checkLoop')
    ];
    //タスクのループを許可する、この機能はいらない
    checkLoop.addEventListener('click',()=>{
        checkLoop.value = checkLoop.checked;
    });
    //メニューに変更があった場合okにテキストを変える
    selectBox.forEach((item)=>{
        item.addEventListener('change',()=>{
            changeCrossToOk('OK');
        });
    });
    
    setUpDisp.addEventListener('click',()=>{
        //setUp要素のいちを下げる
        var setUp = document.getElementById('setUp');
        setUp.removeAttribute('class');
        setUp.setAttribute('class', 'setUpdisp');
    });
             
     
    setUphidden.addEventListener('click',()=>{
        //setUp要素のいちを下げる
        var setUp = document.getElementById('setUp');
        setUp.removeAttribute('class');
        setUp.setAttribute('class', 'setUphidden');
        //OKを×に変更
        changeCrossToOk('×');
        //webstoにmenuの内容を保存する。
        var ws = new webStorage();
        ws.setMenu(ws,selectBox);
    });


    ws_c.addEventListener('click',()=>{
        console.log("clear");
        var ws = new webStorage();
        ws.clear();
        //全てのtodoにチェックを入れる
        // document.getElementById("checkbox").checked = true;
        var a = document.getElementsByTagName('li');
        // console.dir(a);
        // console.dir(a.length);
        for(var i=0;i<a.length;i++){
            if(a[i].id == 'insertLI')continue;
            //取り消し線追加
            a[i].setAttribute('class', 'through');
        }
        //h1やタイトルも戻す
        changeTitle("タスク未設定");
        // //Listを削除
        var tasklist = document.getElementsByClassName('tasklist')[0];
        deleteEndTask(tasklist);//取り消し線が書かれているものを消す
        //設定時間も初期化
        initTime();
        changeCrossToOk('ok');
    });
    timeTmp = null;
    buttonFlg　= true;
    var startTime;
    var elapsedTime = 0;
    taskText.addEventListener('keypress', function (e) {
        var ele = checkKeyPress(e,13,taskMake);
        var ws = new webStorage();
        if(ws.checkWS()&&ele!==undefined){
            console.log("ws{");
            // console.dir(ele);
            console.log("ele.innerText:"+ele.innerText);            
            console.log("}ws");
            ws.setItem(ele.outerText, ele.outerHTML);
        }
    });


    //フォーカスが外れた時
    taskText2.addEventListener('blur',()=>{
        var array = bRtoArray(taskText2.value);
        aRraytoPara(array,taskEleMake);
        taskText2.value="";
    });


    taskText.addEventListener('dblclick', function (e) {
        changeTextBox('singleAdd','areaAdd');    
    });
    
    taskText2.addEventListener('dblclick', function (e) {
        changeTextBox('areaAdd','singleAdd');        
    });
    startAndstop.addEventListener('click',function(){
        if(buttonFlg){
            startMethod();
            //最大時間を表示
            maxTime();
        }else{
            stopMethod();
        }
        buttonFlg = !buttonFlg;
    });
    tasklist.addEventListener('click',()=>{
        taskText.focus();
    });
    h2.addEventListener('click',()=>{
        taskText.focus();
    });
})();



/**
 * Changing the order in the ToDoList
 * @return {boolean}  
 */
var nextTask = ()=>{
    var obj = checkTask();    
    if(obj != undefined && obj != ""){
        var tasklist = document.getElementsByClassName('tasklist')[0];
        tasklist.appendChild(obj);    
        deleteEndTask(tasklist);
        return true;
    }else{
        return false;
    } 
};

/**
 * Delete if strikethroughLine is drawn 
 * @param  {Object} tasklist
 */
var deleteEndTask = (tasklist)=>{
    //取り消し線を消す
    var selects = Array.prototype.slice.call(tasklist.children);//配列に変換
    selects.forEach(function(item) {
        if(item.getAttribute("class") != null && item.getAttribute("class").indexOf("through")>=0){
            item.parentNode.removeChild(item);
            // console.dir(item);
            new webStorage().removeItem(item.innerText);
        }
    });
};
/**
 * Confirm whether task is registered 
 * @return  {String} first task name
 */
var checkTask = ()=>{
    console.log("checkTask");
    var tasklist = document.getElementsByClassName('tasklist')[0];
    var firstList = tasklist.firstElementChild;
    if(firstList != null){
        return firstList;
    }else{
        return "";
    } 
};
/**
 * Register task
 * @return  {Element} 
 */
var taskMake = ()=>{
    var taskText = document.getElementById('taskText');
    var ele = taskEleMake(taskText.value);
    taskText.value = "";
    return ele;
};
/**
 * Register task
 * @return  {Element} 
 */
var taskEleMake = (text)=>{
    var LInode = document.createElement("LI");//リストelement作成
    if(text != ""){
        var tasklist = document.getElementsByClassName('tasklist')[0];
        var textnode = document.createTextNode(text);        
        var label = document.createElement('label');        
        var checkbox = document.createElement('input');//チェックボックスelement作成
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('class', 'hidden');
        checkbox.addEventListener('click',(e)=>{
            // console.dir(e);
            // console.dir(checkbox.checked);
            if(checkbox.checked==true){
                console.log("取り消し線");
                //取り消し線
                LInode.setAttribute('class', 'through');
            }else{
                console.log("線を消す");                
                //線を消す
                LInode.removeAttribute('class');
            }
        });
        label.appendChild(checkbox);
        label.appendChild(textnode);
        LInode.appendChild(label);
        
        //topの中のidの前に挿入
        tasklist.insertBefore(LInode, document.getElementById('insertLI'));        
    }
    return LInode;
};
/**
 * Count 
 * @param   {Date} startTime
 * @param   {Object} times
 * @param   {Object} aniObj
 */
var count = (startTime,times,aniObj)=>{
    console.log("------------------------"+startTime);
    setTimeObj(times);
    timerId = setTimeout(function(){
        var now = Date.now()/1000;        
        elapsedTime = now - startTime;        
        var alertTime = times.changeSce();
        console.log("alertTime:"+alertTime);
        console.log("elapsedTime:"+elapsedTime);
        alertTime = Number(alertTime) - Number(elapsedTime);
        var flg = times.setSec(alertTime,aniObj);
        console.log("flg:"+flg);
        if(flg==true){
            // console.dir(aniObj);
            aniObj.changeImg();//アニメーション
            timeText.innerText = printTimeObj(times);
            count(now,times,aniObj);
        }else{
            if(!oneStop() &&　nextTask()){
                
                console.log("nextTask");
                aniObj = aniObj.nextTaskSet();
                var tasklist = document.getElementsByClassName('tasklist')[0];
                var firstList = tasklist.firstElementChild;
                if(firstList == undefined)return;
                tts(firstList.innerText+"開始");
                console.log(firstList.innerText+"開始");
                
                changeTitle(firstList.innerText);
                //document.getElementsByTagName('title')[0].innerText = firstList.innerText+"実施中";
                //addH1(firstList.innerText);
                var time = new Time(hour.value , min.value , sec.value);
                count(Date.now()/1000 ,time,aniObj);
            }else{
                //カウントが止まるのでボタンを変更？
                changePlayButton("stop.png");
                console.log("nextTask is else");
            }
        }
    },1000);
};

//メニュー内の繰り返しのチェックをするmethod
var oneStop = ()=>{
    console.log("oneStopCheck");
    var checkLoop = document.getElementById('checkLoop');
    console.dir(checkLoop);    
    return checkLoop.checked;
}

//表示用の時間文字列を作成
var printTimeObj = (t)=>{
    var disph = "0"+Math.floor(t.hour);
    var dispm = Math.floor(t.min)<10? "0"+Math.floor(t.min):Math.floor(t.min);
    var disps = Math.floor(t.sec)<10? "0"+Math.floor(t.sec):Math.floor(t.sec);
    //timeText.innerText = t.margeTime(disph,dispm,disps);
    return t.margeTime(disph,dispm,disps);
};

//時間用のクラス
class Time{
    constructor(hour,min,sec){
        this.hour = hour;
        this.min = min;
        this.sec = sec;
        this.moveFlg = Number(this.hour)+Number(this.min)+Number(this.sec)>0;
    }
    changeSce(){
        //時分秒を秒数に変更
        return Number(this.hour*60*60)+Number(this.min*60)+Number(this.sec);
    }
    getSec(){
        return this.changeSce();
    }
    setSec(sec,aniObj){
        if(sec > 0){
            this.hour = Math.floor(Number(sec/(60*60)));
            this.min = Math.floor(Number(sec-this.hour*60)/60);
            this.sec = Number(sec) - (Number(this.hour)*60*60) - (Number(this.min)*60);
            this.moveFlg = Number(this.hour)+Number(this.min)+Number(this.sec)>0;
            if(sec<=5+1){   
                var num = Math.floor(sec);
                darwinFlg = true;  
                console.log("カウント:"+(5-num));  
                //カウント
                aniObj.setCount(5-num);
                tts(num);
                console.log("カウント："+sec);                
            }else if(Math.floor(sec)%60==0){
                tts("のこり"+(Math.floor(sec/60))+"分");  
            }
        }else{
            this.hour = 0;
            this.min = 0;
            this.sec = 0;
            this.moveFlg = false;
        }
        return this.moveFlg;
    }
    startSec(){
        this.sec = Number(this.sec)+1;
        return this;
    }
    margeTime(h,m,s){
        return h +":"+ m +":"+ s;
    }
    getTimeStr(){
        return this.hour +":"+ this.min +":"+ this.sec;
    }
}

//text to speechの実行
//シングルトンパターンに変更する
var tts = (speak)=> {
    var msg = new SpeechSynthesisUtterance();
    msg.text = speak; // 喋る内容
    speechSynthesis.speak(msg);// 発話実行
};

//実行中のタスクをh1タイトル表示にする
var addH1 = (text)=>{
    var h1 = document.getElementById('activeTaskName');
    h1.innerText = text;
};
var setTimeObj = (time)=>{
    timeTmp = time;
};


///表示非表示を切り替える
///hiddenId:隠す要素のid
///dispId:表示要素のid
var changeTextBox = (hiddenId,dispId)=>{
    var hidd = document.getElementById(hiddenId);
    hidd.setAttribute('class', 'dispnon');
    var disp = document.getElementById(dispId);
    disp.removeAttribute('class');    
};


var startMethod = ()=>{
    var times = null;
    if(timeTmp==null){
        times = new Time(hour.value , min.value , sec.value);
    }else{
        console.log("restart");
        times = new Time(timeTmp.hour , timeTmp.min , timeTmp.sec);
    }
    changePlayButton("stop.png");
    dispAnime(true);
    
    //アニメーション設定
    var animetionObj = selectAnime();
    // console.dir(animetionObj);
    timeText.innerText = printTimeObj(times);
    //inputBox削除
    removeInputBox();
    var task = checkTask();
    if(task.innerText != undefined){
        tts(task.innerText+"開始");
        addH1(task.innerText);
    }
    console.log("蹴り出し");
    console.log(Date.now()/1000);
    console.log(times.startSec());
    count(Date.now()/1000,times.startSec(),animetionObj);
};


var stopMethod = ()=>{
    clearTimeout(timerId);
    changePlayButton("play.png");
    dispAnime(false);
    makeInputBox();
};


var changePlayButton = (text)=>{
    var startAndstop = document.getElementById('startAndstop');
    startAndstop.removeAttribute('src');  
    startAndstop.setAttribute('src', text);
};


var dispAnime = (flg)=>{  
    var anime = document.getElementById('selectAnime');
    var animetion = document.getElementById("animetion");
    var newton_ = document.getElementById("newton");
    //stop時非表示
    animetion.setAttribute('class', "dispnon");
    newton_.setAttribute('class', "dispnon");
    if(flg==true){
        // console.dir(anime);
        //play表示
        if(anime.value==="darwin"){
            animetion.removeAttribute('class');
            obj =  new Darwin().changeImg();
        }else if(anime.value==="newton"){
            newton_.removeAttribute('class');
            obj = new Newton().changeImg();
        }else{
            console.log("アニメなし");
            obj = new noneAnime().changeImg();
        }
    }
    return obj;
};


/**
 * Confirm whether the enter key is pressed
 * @param   {Event} e EventObject
 * @param   {Integer} keyNum Enter Key is No.13
 * @param   {method} method callbackMethod
 */
var checkKeyPress = (e,keyNum,method)=>{
    var key = e.which || e.keyCode;
    if (key === keyNum) { // 13 is enter
        return method();
    }
};


var bRtoArray = (text)=>{
    //改行区切りの配列に変換
    var a = text;
    if(a.length>=0){
        return a.split(/\r\n|\r|\n/);
    }
    return new Array();
};


var aRraytoPara = (array,method)=>{
    array.forEach((item)=>{
        method(item);
    });
};



//アニメーションのクラス
class Darwin{
    constructor(){
        console.log("darwinConstructor");
        this.activeNum = 0;
        this.darwinImg = [
            "darwin00001.png",//0_10
            "darwin00010.png",//1_9
            "darwin00100.png",//2_8
            "darwin01000.png",//3_7
            "darwin10000.png",//4_6
            "darwin00001.png",//5_5 
            "darwin00011.png",//6_4
            "darwin00111.png",//7_3
            "darwin01111.png",//8_2
            "darwin11111.png",//9_1
            "darwin1_11111.png",//10_0
        ];
    }
    nextImg(){
        // console.log("darwinFlg:"+darwinFlg);
        // console.log("activeNum:"+this.activeNum);
        
        let imgnum;
        if(darwinFlg===false){
            imgnum = this.activeNum++;
            this.activeNum = this.activeNum>=5?this.activeNum-5:this.activeNum;
        }else{
            imgnum = (this.activeNum++)+5;
        }
        // console.dir(this.darwinImg[imgnum]);
        return this.darwinImg[imgnum];
    }
    changeImg(){
        var darwin = document.getElementById("darwin");
        darwin.removeAttribute("class"); 
        void darwin.offsetWidth; // ！！！！！おまじない！！！！！
        darwin.setAttribute('src', this.nextImg());
        darwin.setAttribute('class', "darwinAnime");
        return this;
    }
    flgChange(flg){
        darwinFlg = flg;
    }
    setCount(num){
        this.activeNum = num;
    }
    nextTaskSet(){
        this.setCount(0);
        this.flgChange(false);
        this.changeImg();//アニメーション
        return dispAnime(true);
    }
}
class Newton{
    constructor(){
        this.activeNum = 0;
        this.Img = [
            "apple0.png",//0
            "tama.png"//1
        ];
        this.styleClass = [
            "moveNewTom0",
            "moveNewTom1",
            "moveNewTom2",
            "moveNewTom3",
            "moveNewTom4"
        ];
    }
    nextImg(){        
        let imgnum;
        console.log("this.activeNum:"+this.activeNum);
        console.log("darwinFlg:"+darwinFlg);
        if(this.activeNum===5 && darwinFlg==true){
            console.log("nextImgElse");
            imgnum = 1;
        }else{
            console.log("donot last");
            imgnum = 0;
        }
        return this.Img[imgnum];
    }
    nextStyle(){
        let stylenum = rotary(this.activeNum,this.styleClass.length);
        if(this.activeNum===5&&darwinFlg==true){
            // console.dir("stylenum:"+stylenum);
            // console.dir(this.styleClass[stylenum]);
            stylenum = 4;
        }
        this.activeNum++;
        return this.styleClass[stylenum];
    }
    changeImg(){
        var newtonImg = document.getElementById("newtonImg");
        var newton = document.getElementById("newton");
        newtonImg.removeAttribute("class"); 
        newton.removeAttribute("class"); 
        void newtonImg.offsetWidth; // ！！！！！おまじない！！！！！
        void newton.offsetWidth; // ！！！！！おまじない！！！！！
        newtonImg.setAttribute('src', this.nextImg());
        newton.setAttribute('class', this.nextStyle());
        return this;
    }
    flgChange(flg){
        darwinFlg = flg;
    }
    setCount(num){
        this.activeNum = num;
    }
    nextTaskSet(){
        this.setCount(0);
        this.flgChange(false);
        this.changeImg();//アニメーション
        return dispAnime(true);
    }
}
class noneAnime{
    constructor(){
        this.activeNum = 0;
        this.Img = [];
        this.styleClass = [];
    }
    nextTaskSet(){
        return dispAnime(true);
    }
    nextImg(){}
    nextStyle(){}
    changeImg(){}
    flgChange(flg){}
    setCount(num){}
}
var removeInputBox = ()=>{
    insertLI = document.getElementById('insertLI');
    insertLI.remove();
    // console.dir(insertLI);
};
var makeInputBox = ()=>{
    var tasklist = document.getElementsByClassName('tasklist')[0];
    tasklist.appendChild(insertLI);  
};
class webStorage{
    constructor(){
        this.storage = localStorage;
    }
    checkWS(){
        if (typeof(Storage) === "undefined") {
            console.log("保存機能が使えません");
            return false;
        }
        return true;
    }
    setItem(name,item){
        //webstorageに保存
        console.log("123456781234567812345678");
        console.log(name+":"+item);
        this.storage.setItem(name,item);
    }
    getWSCount(){
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
    setMenu(ws,selectBox){
        var selectMenu = [];
        selectBox.forEach((selectBox)=>{
            selectMenu.push(selectBox.value);
        });
        ws.setItem("menu",selectMenu);
    }
}
var taskLoad = ()=>{
    var ws = new webStorage(); 
    //保存されているリストを表示
    var s = ws.getAllItem();
    for (var i = 0; i < s.length; i++) {
        if(s.key(i)==="menu")continue;
        taskEleMake(s.key(i));
    }
    //保存されているmenuを表示
    var menu = ws.getItem('menu');
    initMenu(menu);
};
var initMenu = (menu)=>{
    if(menu===null)return;
    var selectAnime = document.getElementById('selectAnime');
    var hour = document.getElementById('hour');
    var min = document.getElementById('min');
    var sec = document.getElementById('sec'); 
    var checkLoop = document.getElementById('checkLoop'); 
    selectAnime.value = menu.split(",")[0];
    hour.value = menu.split(",")[1];
    min.value = menu.split(",")[2];
    sec.value = menu.split(",")[3];
    if(menu.split(",")[4]==="true"){
        checkLoop.checked = true;
    }else{
        checkLoop.checked = false;    
    }
}
var initTime = ()=>{
    document.getElementById('hour').value = 0;
    document.getElementById('min').value = 5;
    document.getElementById('sec').value = 0;  
};
var rotary = (num,max)=>{
    console.log("num,max:"+num+","+max);
    if(num<max){
        return num;
    }else{
        return num%max;
    }
};
var selectAnime = ()=>{
    var anime = document.getElementById('selectAnime');
    // console.dir(anime);
    if(anime.value==="darwin"){
        console.log("darwin");
        return new Darwin().changeImg();
    }else if(anime.value==="newton"){
        console.log("newton");        
        return new Newton().changeImg();
    }else{
        console.log("noneAnime");  
        return new noneAnime().changeImg();
    }
};
var changeTitle = (text)=>{
    document.getElementsByTagName('title')[0].innerText = text+"実施中";
    addH1(text);
}
var maxTime = ()=>{
    var timeLimit = document.getElementById('timeLimit');
    times = new Time(hour.value , min.value , sec.value);
    console.dir(times);
    timeLimit.innerText = printTimeObj(times);
}
var changeCrossToOk = (text)=>{
    document.getElementById('settingSubmit').innerText = text;
}
//次へボタン
//<!--NG後-->
//秒数を飛ばす、別画面の時の読み上げなど
//ガリレオアニメーション
//個々のタスクの編集
//タスクリスト順番変更
//タスクに＋＠の時間を追加する。
//タスクsend機能(複数人対応)
//時間を止めているときは時間表示はヘッダーに収納される。開始するとアニメーションで出てくる。
