"use strict";

let speach = new SpeechSynthesisUtterance();
let timeLimit = {getFlg:function(){return false}/*prototype*/};
let ani = {end:function(){return false},getName:function(){return ""},flg:"" /*prototype*/};
let ws;

(()=>{
    setParam();
    setList();//addTask
    setEvent();   
    initTime(); 
    let sortable = Sortable.create(taskList, {
        group: "taskList",
        handle:".listIcon",
        animation: 100
    });
})();

function setParam(){
    console.log("setParam()");
    var paramObj = getParam();
    if(Object.keys(paramObj).length){
        ani.flg = paramObj["animetion"] == "OFF"?"NO":"";
        console.log("ani.flg:"+ani.flg);
    }

}


function getParam(){
    // console.log("getParam()");
    let param = location.search;
    param = param.slice(1) ;//?の削除
    let paramArray = param.split('&');
    let paramObj = {};
    for(let i in paramArray) {
        console.dir(paramArray[i]);
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
}


/**
 * Change execution method in task state
 * @param   {Method} activeMethod
 * @param   {Method} inactiveMethod
 */
function activeIfMethod(activeCallBack,inactiveCallBack){
    console.log("timeLimit.getFlg()"+timeLimit.getFlg());
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

    for(let task of taskArray){
        if(task!==""){
            createTaskElement(task);
        }
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
   document.getElementById('timer').innerText = "3:00";
    // document.getElementById('timer').innerText = "0:20";
}





/**
 * Changing the order in the ToDoList 
 * method for clickEvent
 * @return  {HTMLElement[]} task
 */
 let nextTask=()=>{
    console.log('nextTask()');
    let list = document.getElementById('taskList');
    let task = list.getElementsByTagName('li');
    if(task.length > 0){
        initTime();
        sequentialLoopList(list);
        list.appendChild(inputTaskList);
        return task;
    }
    return null;
};

/**
 * Changing the order in the ToDoList 
 * method for clickEvent
 * @return  {HTMLElement[]} task
 */
let previousTask=()=>{
    console.log('previousTask()');
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
    console.log("getTaskLength()");
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
    console.log("deleteEndTask()");
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
        // changeStopImage();
        // deleteInput();
        let loopFlg = true;
        let limit = timeObj.calcLimitTime();
        let time = timeObj.getTime();
        if(limit <= -1){
            time = "0:00";
            loopFlg = false;
        }else if(limit <= 10 && timeObj.getFlg() != false){
            tts(limit);
            ani.last(limit);
        }else if(limit%60==0 && timeObj.getFlg() != false){
            tts("あと"+(limit/60)+"分です");
        }else if(timeObj.getFlg() != false){
            ani.toggle();
        }

        if(timeObj.getFlg() != false){            
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
    console.log("start()");
    deleteEndTask();
    if(getTaskLength()>0){
        playTask();
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
    console.log("playTask()");
    ani = aniObjToggle(ani);
    changeStopImage();
    // deleteInput();//check!!
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
    console.log("aniObjToggle()  aniflg:"+ani.flg);
    ani.end();
    if(ani.flg == 'NO'){
        return new Animation(animationBox,timer);
    }else if(ani.getName() != 'newton'){
        return new Newton(animationBox,timer);
    }else{
        return new Darwin(animationBox,timer);
    }
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
 * Speak parameters
 * @param   {String} speak
 */
let tts = (speak)=> {
    var speach = new SpeechSynthesisUtterance();
    speach.text = speak; // 喋る内容
    speechSynthesis.speak(speach);// 発話実行
};

/**
 * Set titleDisplay and speak title
 * ControlDom
 */
let changeTitle = ()=>{
    let titleText = taskList.children[0].innerText;
    title.innerText = titleText;
    tts(titleText+"開始");
}

