"use strict";

//let speach = new SpeechSynthesisUtterance();//#48
//let tts = new TextToSpeech();
//将来的にはTTSもラップして、newのタイミングで速さと言語を指定できるようにする。
//let tts = device.platform=="Android"? new TextToSpeechAndroid() : new TextToSpeech();
let tts = new TextToSpeechAndroid();
let timeLimit = {getFlg:function(){return false}/*prototype*/};
let ani;
let ws;
let config;
let device;
let prefix="";

(()=>{    
    setParam();
    setList();//addTask
    setEvent();
    initTime(); 
    setAnimetion();
    let sortable = Sortable.create(taskList, {
        group: "taskList",
        handle:".listIcon",
        animation: 100
    });

    //デバイス確認、環境確認
    device = platformInfo();
    console.log(device.deviceType);
    console.log(device.deviceSeries);
    console.log(device.platform);

    if((device.deviceSeries == 'Android'||
        device.deviceSeries == 'AndroidTab')&&
        device.platform=='spApp'){
        console.log("Androidアプリ");
        tts = new TextToSpeechAndroid();
    }else{
        console.log("Androidアプリではない");
        tts = new TextToSpeech();
    }     
    

    //β版か確認
    if(location.href.match(/firebase/)){
        prefix = "(β)";
        document.title = prefix + "whipLashToDo"; //Prefix追加(β)
    }


})();

function arrayShuffle(arg){
    var array = arg;
    var len = array.length;
    while(len > 0){
        var rnd = Math.floor(Math.random() * len);
        var tmp = array[len-1];
        array[len-1] = array[rnd];
        array[rnd] = tmp;
        len-=1;
    }
    return array;
}

function htmlCollectionShuffle(hc){
    // console.dir(hc);
    var len = hc.children.length;
    // console.log("hcの個数:"+len);
    while(len > 0){
        var rnd = Math.floor(Math.random() * len);
        hc.appendChild(hc.children[rnd]);
        len-=1;
    }
    return hc;
}


function setAnimetion(){
    // console.log("setAnimetion:"+config.animetion);
    ani = new Animation();
    ani.setFlg(config.animetion);
}

function setParam(){
    // console.log("setParam()");
    config = new Config();
    var paramObj = getParam();
    if(Object.keys(paramObj).length > 1){
        config.timelimit = paramObj["timelimit"];
        config.order = paramObj["order"];
        config.showlist = paramObj["showlist"];
        config.animetion = paramObj["animetion"];
        config.timeORcount = paramObj["timeORcount"];
    }
}


function getParam(){
    // console.log("getParam()");
    let param = location.search;
    param = param.slice(1) ;//?の削除
    let paramArray = param.split('&');
    let paramObj = {};
    for(let i in paramArray) {
        // console.dir(paramArray[i]);
        var pair = paramArray[i].split('=');
        paramObj[pair[0]] = pair[1];
    }
    return paramObj;
}


/**
 * Assign events
 */
function setEvent(){
    back.addEventListener('click',()=>{
        console.log("back");
        activeIfMethod(previousTask,back2);
    });
    playstop.addEventListener('click',()=>{
        console.log("playstop");
        activeIfMethod(start,stop);
    });
    next.addEventListener('click',()=>{
        console.log("next");
        activeIfMethod(nextTask,next2);
    });
    inputTask.addEventListener('keypress', (e)=> {
        var ele = checkKeyPress(e,13,makeTask);
    });
    //スマホだった場合フォーカスが外れるだけで入力したい
    inputTask.addEventListener('blur', (e)=> {
        if(device.deviceType=="sp"||device.deviceType=="tab"){
            makeTask();
        }
    });   
}



/**
 * Change execution method in task state
 * @param   {Method} activeMethod
 * @param   {Method} inactiveMethod
 */
function activeIfMethod(activeCallBack,inactiveCallBack){
    if(timeLimit.getFlg()){
        inactiveCallBack();
    }else{
        activeCallBack();
    }
}



/**
 * init WebStorage
 */
function makeWs(){
    if(ws == undefined || ws == null){
        ws = new WebStorage();
    }        
    ws.log();
}

/**
 * add task to taskList from webstorage
 */
function setList(){
    makeWs();//create object
    if(!ws.checkItem('task')){
        //disp GuideLine
        inputTask.placeholder = "→  タスク入力してENTER";
        createTaskElement("タスクを登録する");
        createTaskElement("終了タスク削除");
        return;
    }
    let taskArray = ws.getItem('task').split(',');

    //task nothing 
    if(taskArray.length == 1 && taskArray[0] == ""){
        inputTask.placeholder = "→  タスク入力してENTER";
        createTaskElement("タスクを登録する");
    }

    //タンスの順番をRandomにする。
    // console.log(config.order);
    if(config.order !== "Sequential"){
        taskArray = arrayShuffle(taskArray);
    }
    for(let task of taskArray){
        if(task!==""){
            createTaskElement(task);
        }
    }

    //Listの表示がOFFの場合
    if(config.showlist == "OFF"){
        document.querySelector("#taskList").classList.add('displayNone');
    }
}

/**
 * create task element
 * @param   {String} taskName
 */
function createTaskElement(taskName){
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.classList.add('task');
    span.innerText = taskName;
    span.addEventListener('click',(e)=>{
        let strikethroughFlg = checkClass(e.target,"strikethrough");
        if(strikethroughFlg){
            span.classList.remove('strikethrough');
        }else{
            span.classList.add('strikethrough');
            console.log("add");
        }
    });
    let img = document.createElement('img');
    img.classList.add('listIcon');
    img.src = "./image/menu.png";
    li.appendChild(span);
    li.appendChild(img);
    addTaskList(li);
}





/**
 * add taskElements to taskListElements
 * @param   {HTMLElement} element
 */
function addTaskList(Ele){
    taskList.appendChild(Ele);
    taskList.appendChild(inputTaskList);
}

/**
 * init to timeLimit
 */
function initTime(){
    // console.log("initTime:"+config.timelimit);
    if(config.timelimit != ""){
        document.getElementById('timer').innerText = config.timelimit;
    }else{
        document.getElementById('timer').innerText = "3:00";
    }
    // document.getElementById('timer').innerText = "0:20";
}






/**
 * Changing the order in the ToDoList 
 * method for clickEvent
 * @return  {HTMLElement[]} task
 */
 let nextTask=()=>{
    // console.log('nextTask()');
    let list = document.getElementById('taskList');
    let task = list.getElementsByTagName('li');
    if(task.length > 0){
        initTime();
        loopList(list);
        list.appendChild(inputTaskList);
        return task;
    }
    return null;
};


function loopList(list){
    if(config.order !== "Random"){
        sequentialLoopList(list);
    }else{
        randomLoopList(list);
    }
}



/**
 * Changing the order in the ToDoList 
 * method for clickEvent
 * @return  {HTMLElement[]} task
 */
let previousTask=()=>{
    // console.log('previousTask()');
    let list = document.getElementById('taskList');
    let task = list.getElementsByTagName('li');
    console.dir(task);
    if(task.length > 0){
        initTime();
        reverseLoopList(list);
        list.appendChild(inputTaskList);
        return task;
    }
    return null;
};

/**
 * Get the count number of tasks
 * @return  {Number} countTask
 */
let getTaskLength=()=>{
    // console.log("getTaskLength()");
    let list = document.getElementById('taskList');
    return list.querySelectorAll('li:not(#inputTaskList)').length;
}

/**
 * Make it the next task during execution
 */
let next2 = () =>{
    deleteEndTask();
    timeLimit.stop();
    let task = document.querySelectorAll('li:not(#inputTaskList)');
    if(task.length > 0){
        nextTask();
        initTime();
        playTask();
    }else{
        addInput();
        changeStartImage();
    }
}

/**
 * Make it the previous task during execution
 */
let back2 = () =>{
    deleteEndTask();
    timeLimit.stop();
    let task = document.querySelectorAll('li:not(#inputTaskList)');
    if(task.length > 0){
        previousTask();
        initTime();
        playTask();
    }else{
        addInput();
        changeStartImage();
    }
}



/**
 * Delete if strikethroughLine is drawn 
 * method for clickEvent
 */
let deleteEndTask=()=>{
    // console.log("deleteEndTask()");
    htmlParentElementAllDelete(document.getElementsByClassName('strikethrough'));
    saveWs();
};

/**
 * Control time
 * method for clickEvent
 */
 let timeCount = async (dispTimer)=>{
    timeLimit = new TimeLimit(dispTimer.innerText,":");
    ani.start();
    let timeObj = timeLimit;
    let endObj = await everySecond(()=>{
        // console.log("everySecond_callBack");
        let loopFlg = true;
        let limit = timeObj.calcLimitTime(config.timeORcount);//問題点
        let time;

        // console.log(limit);
        if(limit <= -1){
            time = "0:00";
            loopFlg = false;
        }else if(limit <= 10 && timeObj.getFlg() != false){
            tts.speak(limit);
            ani.last(limit);
        }else if(limit%60==0 && timeObj.getFlg() != false){
            tts.speak("あと"+(limit/60)+"分です");
        }else if(timeObj.getFlg() != false){
            ani.toggle();
        }

        if(timeObj.getFlg() != false){   
            //タブが非表示なら不要。 
            time = timeObj.getTime();        
            dispTimer.innerText = timeObj.getTimeStr(time);
        }
        return loopFlg;
    },timeObj);
    return endObj;
};

/**
 * Changing the order in the List
 * @param   {HTMLElement} List
 */
let sequentialLoopList=(list)=>{
    // addTaskList(list.children[0]);
    list.appendChild(list.children[0]);
};

let randomLoopList=(list)=>{
    // console.log("randomLoopList");
    list.appendChild(list.children[0]);
    htmlCollectionShuffle(list);    
};




/**
 * Changing the order in the List
 * @param   {HTMLElement} List
 */
let reverseLoopList=(list)=>{
    //Since there is inputbox twice
    list.insertBefore(list.lastElementChild, list.children[0]);
    list.insertBefore(list.lastElementChild, list.children[0]);
};

/**
 * Delete All HTMLElement 
 * @param   {HTMLElement} Delete target
 */
let htmlParentElementAllDelete=(delElement)=>{
    while (delElement.length > 0) {
        delElement.item(0).parentNode.remove();
    }
}

/**
 * What to do every second
 * recursiveCall
 * @param   {callback} callback everySecond
 */
let everySecond = (callback,timeLimitObj)=>{
    return new Promise((res)=>{
        setTimeout(async ()=>{
            let loopFlg = callback();
            if(loopFlg==true && timeLimitObj.getFlg() == true){
                //recursiveCall
                await everySecond(callback,timeLimitObj);
            }
            res(timeLimitObj);
        },1000);
    });
}

/**
 * taskStart
 */
let start = ()=>{
    // console.log("start()");
    deleteEndTask();
    if(getTaskLength()>0){
        playTask();
    }else{
        inputTask.placeholder = "→  タスク入力してENTER";
        createTaskElement("タスクを登録する");
    }
}


/**
 * Change to playButton
 */
let changeStartImage = ()=>{
    changeImageSrc(playstop,"./image/play.png");
}

/**
 * Change to stopButton
 */
let changeStopImage = ()=>{
    changeImageSrc(playstop,"./image/stop.png");
}

/**
 * Change to stopButton
 * @param   {HTMLElement} imageTag
 * @param   {String} URL
 */
let changeImageSrc = (imageTag,url)=>{
    imageTag.src = url;
}





/**
 * Loop if there is a task
 * recursiveCall
 */
let playTask = async ()=>{
    // console.log("playTask()");
    ani = aniObjToggle(ani);
    changeStopImage();
    changeTitle();
    let endObj = await timeCount(document.getElementById('timer'));
    deleteEndTask();
    let taskCount = getTaskLength();
    if(taskCount > 0 && endObj.getFlg() == true){
        initTime();
        nextTask();
        playTask();
    }else{
        // changeStartImage();
        // addInput();
    }
}

/**
 * Change animation alternately
 * @param   {Animation} ani obj
 */
let aniObjToggle = (ani)=>{
    // console.log("aniObjToggle()  aniflg:"+ani.flg);
    ani.end();
    if(ani.flg && ani.getName() == 'darwin'){
        ani = new Newton(animationBox,timer);
    }else if(ani.flg && ani.getName() == 'newton'){
        ani =  new Darwin(animationBox,timer);
    }else if(ani.flg){
        ani =  new Darwin(animationBox,timer);
    }else if(!ani.flg){
        ani =  new Animation();
    }
    return ani;
}






/**
 * taskStop
 */
let stop = ()=>{
    changeStartImage();
    timeLimit.stop();
    addInput();
}

/**
 * Confirm whether the enter key is pressed
 * @param   {Event} e EventObject
 * @param   {Integer} keyNum Enter Key is No.13
 * @param   {method} method callbackMethod
 * @return  {callBackResult} 
 */
let checkKeyPress = (e,keyNum,method)=>{
    var key = e.which || e.keyCode;
    if (key === keyNum) { // 13 is enter
        return method();
    }
};

/**
 * init to timeLimit
 */
let makeTask = ()=>{
    if(inputTask.value!=""){
        createTaskElement(inputTask.value);
        saveWs();
        inputTask.value = "";
        inputTask.focus();
    }
}

/**
 * save to WebStrage
 */
let saveWs = ()=>{
    // ws.setSelectorInnerText('li:not(#inputTaskList)',"task");
    ws.setSelectorInnerText('span.task',"task");    
}

/**
 * Add class to hide input box 
 */
let deleteInput = ()=>{
    inputTaskList.classList.add("displayNone");
}

/**
 * Delete class hiding input box 
 */
let addInput = ()=>{
    inputTaskList.classList.remove('displayNone');
}


/**
 * check to specified class in the specified Element
 * @param   {HTMLElement} ele
 * @param   {String} checkClass
 * @return  {bool} checkFlag
 */
let checkClass = (ele,checkClass)=>{
    let checkFlag = false;
    let classes = ele.className;
    if(!classes)return checkFlag;
    let classArray = classes.split(' ');
    classArray.forEach((className)=>{
        checkFlag = className == checkClass?true:checkFlag;
    });
    return checkFlag;
} 

/**
 * Set titleDisplay and speak title
 * ControlDom
 */
let changeTitle = ()=>{
    let titleText = taskList.children[0].innerText;
    title.innerText = titleText; //表示タスク名
    tts.speak(titleText+"開始");
}




//deviceType
function checkDeviceType(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
}

//deviceSeries
function checkDevice(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 ){
        return 'iPhone';
    }else if(ua.indexOf('iPod') > 0){
        return 'iPod';
    }else if(ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'Android';
    }else if(ua.indexOf('iPad') > 0){
        return 'iPad';
    }else if(ua.indexOf('Android') > 0){
        return 'AndroidTab';
    }else if(ua.indexOf('Windows') > 0){
        return 'Windows';
    }else{
        return 'otherDevice';
    }
}

//webアプリかAndroidアプリかiOSアプリか
//platform
function checkUseing(){
    var fileName = location.href.split("/").slice(-1)[0];//htmlファイル情報で環境確認
    if(fileName =="index.html"){
        return "webApp";
    }else if(fileName =="index_monaca.html"){
        return "spApp";
    }else{
        return "otherApp";
    }
}

function platformInfo(){
    return {
        'deviceType':checkDeviceType(),
        'deviceSeries':checkDevice(),
        'platform':checkUseing()
    }
}

