"use strict";

let speach = new SpeechSynthesisUtterance();
let timeLimit = {getFlg:function(){return false}/*prototype*/};
let ws;

(()=>{
    setList();
    setEvent();    
    let sortable = Sortable.create(taskList, {
        group: "taskList",
        animation: 100
    });
})();


/**
 * Assign events
 */
function setEvent(){
    bt.addEventListener('click',()=>{
        console.dir(taskList);
    });
    bt2.addEventListener('click',()=>{nextTask()});
    bt3.addEventListener('click',()=>{deleteEndTask()});
    bt4.addEventListener('click',()=>{timeCount(document.getElementById('timer'))});
    document.querySelectorAll('li:not(#inputTaskList)').forEach((li)=>{
        li.addEventListener('click',(e)=>{
            let strikethroughFlg = checkClass(e.target,"strikethrough");
            if(strikethroughFlg){
                li.classList.remove('strikethrough');
            }else{
                li.classList.add('strikethrough');
            }
        });
    });

    bt5.addEventListener('click',()=>{        
        start();
    });
    bt6.addEventListener('click',()=>{
        stop();
    });

    bt7.addEventListener('click',()=>{previousTask()});
    bt8.addEventListener('click',()=>{back2()});
    bt9.addEventListener('click',()=>{next2()});
    bt10.addEventListener('click',()=>{initTime()});
    bt11.addEventListener('click',()=>{
        makeWs();
        ws.setSelectorInnerText('li:not(#inputTaskList)',"task");
    });

    inputTask.addEventListener('keypress', function (e) {
        var ele = checkKeyPress(e,13,taskMake);
    });
    back.addEventListener('click',()=>{
        console.log("back");
        activIfMethod(previousTask,back2);
    });
    playstop.addEventListener('click',()=>{
        console.log("playstop");
        activIfMethod(start,stop);
    });
    next.addEventListener('click',()=>{
        console.log("next");
        activIfMethod(nextTask,next2);
    });
}


/**
 * Change execution method in task state
 * @param   {Method} activeMethod
 * @param   {Method} inactiveMethod
 */
function activIfMethod(activeCallBack,inactiveCallBack){
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
    makeWs();
    if(ws.checkItem('task')){
        return;
    }
    let taskArray = ws.getItem('task').split(',');
    for(let task of taskArray){
        let li = document.createElement('li');
        li.innerText = task;
        addTaskList(li);
    }
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
 * Changing the order in the ToDoList 
 * method for clickEvent
 * @return  {HTMLElement[]} task
 */
 let nextTask=()=>{
    console.log('nextTask()');
    let list = document.getElementById('taskList');
    let task = list.getElementsByTagName('li');
    if(task.length > 0){
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
    let list = document.getElementById('taskList');
    return list.getElementsByTagName('li').length;
}

/**
 * Make it the next task during execution
 */
let next2 = () =>{
    timeLimit.stop();
    nextTask();
    initTime();
    playTask();
}

/**
 * Make it the previous task during execution
 */
let back2 = () =>{
    timeLimit.stop();
    previousTask();
    initTime();
    playTask();
}



/**
 * Delete if strikethroughLine is drawn 
 * method for clickEvent
 */
let deleteEndTask=()=>{
    htmlElementAllDelete(document.getElementsByClassName('strikethrough'));
    saveWs();
};

/**
 * Control time
 * method for clickEvent
 */
 let timeCount = async (dispTimer)=>{
    timeLimit = new TimeLimit(dispTimer.innerText,":");
    let timeObj = timeLimit;
    let endObj = await everySecond(()=>{
        let loopFlg = true;
        let limit = timeObj.calcLimitTime();
        let time = timeObj.getTime();
        if(limit <= -1){
            time = "0:00";
            loopFlg = false;
        }else if(limit <= 10 && timeObj.getFlg() != false){
            tts(limit);
        }else if(limit%60==0 && timeObj.getFlg() != false){
            tts("あと"+(limit/60)+"分です");
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
let htmlElementAllDelete=(delElement)=>{
    while (delElement.length > 0) {
        delElement.item(0).remove();
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
    deleteInput();
    playTask();
}

/**
 * Loop if there is a task
 * recursiveCall
 * 
 */
let playTask = async ()=>{
    deleteEndTask();
    changeTitle();
    let endObj = await timeCount(document.getElementById('timer'));
    let taskCount = getTaskLength();
    if(taskCount > 0 && endObj.getFlg() == true){
        nextTask();
        initTime();
        playTask();
    }
}

/**
 * taskStop
 */
let stop = ()=>{
    timeLimit.stop();
    addInput();
}


/**
 * init to timeLimit
 */
let initTime = ()=>{
    document.getElementById('timer').innerText = "3:00";
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
let taskMake = ()=>{
    if(inputTask.value!=""){
        let ele = document.createElement('li');
        ele.innerText = inputTask.value;
        addTaskList(ele);
        ele.addEventListener('click',(e)=>{
            let strikethroughFlg = checkClass(e.target,"strikethrough");
            if(strikethroughFlg){
                ele.classList.remove('strikethrough');
            }else{
                ele.classList.add('strikethrough');
            }
        });
        saveWs();
        inputTask.value = "";
        inputTask.focus();
    }
}

/**
 * save to WebStrage
 */
let saveWs = ()=>{
    ws.setSelectorInnerText('li:not(#inputTaskList)',"task");
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
    console.dir(classes);
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
 */
let changeTitle = ()=>{
    let titleText = taskList.children[0].innerText;
    title.innerText = titleText;
    console.log(title);
    tts(titleText+"開始");
}