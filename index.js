"use strict";

let speach = new SpeechSynthesisUtterance();
let timeLimit;
let ws;

(()=>{
    setList();
    setEvent();    
    let sortable = Sortable.create(taskList, {
        group: "taskList",
        animation: 100
    });
})();

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
}



function makeWs(){
    if(ws == undefined || ws == null){
        ws = new WebStorage();
    }        
    ws.log();
}

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

function addTaskList(Ele){
    taskList.appendChild(Ele);
    taskList.appendChild(inputTaskList);
}

/*   clickEvent  */

/**
 * Changing the order in the ToDoList 
 * method for clickEvent
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


let getTaskLength=()=>{
    let list = document.getElementById('taskList');
    return list.getElementsByTagName('li').length;
}

let next2 = () =>{
    // stopFlg.value = "stop";
    timeLimit.stop();

    nextTask();
    initTime();
    playTask();
}


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
     console.log('deleteEndTask()');
    //取り消し線が書かれているものを消す
    htmlElementAllDelete(document.getElementsByClassName('strikethrough'));
    saveWs();
};

/**
 * display of time
 * method for clickEvent
 */
 let timeCount = async (dispTimer)=>{
    console.log("timeCount()");
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
 * @return  {HTMLElement} List  
 */
let sequentialLoopList=(list)=>{
    // addTaskList(list.children[0]);
    list.appendChild(list.children[0]);
};

/**
 * Changing the order in the List
 * @param   {HTMLElement} List
 * @return  {HTMLElement} List  
 */
let reverseLoopList=(list)=>{
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
 * @param   {callback} callback every second
 */
let everySecond = (callback,timeLimitObj)=>{
    return new Promise((res)=>{
        setTimeout(async ()=>{
            let loopFlg = callback();
            if(loopFlg==true && timeLimitObj.getFlg() == true){
                await everySecond(callback,timeLimitObj);
            }
            res(timeLimitObj);
        },1000);
    });
}

/**
 * Loop if there is a task
 * recursiveCall
 * 
 */
let start = ()=>{
    console.log("start()");
    deleteInput();
    playTask();
}

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

let stop = ()=>{
    timeLimit.stop();
    addInput();
}



let initTime = ()=>{
    document.getElementById('timer').innerText = "3:00";
}







/**
 * Confirm whether the enter key is pressed
 * @param   {Event} e EventObject
 * @param   {Integer} keyNum Enter Key is No.13
 * @param   {method} method callbackMethod
 */
let checkKeyPress = (e,keyNum,method)=>{
    var key = e.which || e.keyCode;
    if (key === keyNum) { // 13 is enter
        return method();
    }
};


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

let saveWs = ()=>{
    ws.setSelectorInnerText('li:not(#inputTaskList)',"task");
}

let deleteInput = ()=>{
    console.log("deleteInput()");
    inputTaskList.classList.add("displayNone");
}

let addInput = ()=>{
    inputTaskList.classList.remove('displayNone');
}

let checkClass = (ele,checkClass)=>{
    let checkFlag = false;
    let classes = ele.className;
    console.dir(classes);
    if(!classes)return checkFlag;
    classArray = classes.split(' ');
    classArray.forEach((className)=>{
        checkFlag = className == checkClass?true:checkFlag;
    });
    console.log(checkFlag);
    return checkFlag;
} 


//text to speechの実行
//シングルトンパターンに変更する
let tts = (speak)=> {
    var speach = new SpeechSynthesisUtterance();
    speach.text = speak; // 喋る内容
    speechSynthesis.speak(speach);// 発話実行
};

let changeTitle = ()=>{
    let titleText = taskList.children[0].innerText;
    title.innerText = titleText;
    console.log(title);
    tts(titleText+"開始");
}