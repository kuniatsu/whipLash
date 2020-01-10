const CLIENT_ID ="500100005158-lkuvjh25mvsc4kbfqqssfg9n1bdl8h5m.apps.googleusercontent.com";
var changeTaskFlg = false;   //同期によりタスクに変更があった時にtrue
let ws;                      //WebStorageのObject用
let gApiFlg = false;

//DOM取得
var hostValue = document.querySelector("#host").value;
var timeLimit_1 = document.querySelector("#timelimit_1");
var timeLimit_3 = document.querySelector("#timelimit_3");
var timeLimit_5 = document.querySelector("#timelimit_5");

var sequential = document.querySelector("#sequential");
var random = document.querySelector("#random");
var shuffle = document.querySelector("#shuffle");

var dispList = document.querySelector("#dispList");
var hiddenList = document.querySelector("#hiddenList");

var dispAnime = document.querySelector("#dispAnime");
var hiddenAnime = document.querySelector("#hiddenAnime");

var countMain = document.querySelector("#countMain");
var timeMain = document.querySelector("#timeMain");

var set = document.querySelector("#set");
var googletasks = document.querySelector("#googletasks");



(()=>{
    console.log("()=>{}");
    document.querySelector('#host').value=window.location.href;　//host欄を入力する

    var referrerUrl = document.referrer;
    var ua = navigator.userAgent.toLowerCase();
    var url = "./index.html";
    var fileName = location.href.split("/").slice(-1)[0];//htmlファイル情報で環境確認

    if(fileName =="setting.html"){
        url = "./index.html";
    }else if(fileName =="setting_monaca.html"){
        url = "./index_monaca.html";
    }else{
        alert(referrerUrl);
        alert(ua);
        alert(location.href);
        alert(typeof cordova);
    }
    console.log(referrerUrl);
    console.log(ua);
    console.log(location.href);
    console.log(typeof cordova);
    
    makeWs();//create object
    if(ws.checkItem('task')){
        let taskArray = ws.getItem('task').split(',');
        let dispTasks = document.querySelector("#disptasks");
        for(let task of taskArray){
            if(task!==""){
                addLabel(dispTasks,task);
                addBR(dispTasks); //br追加
            }
        }
    }

    // 制限時間
    var timeLimit="3:00";
    timeLimit_1.addEventListener("click",(e)=>{
        timeLimit="1:00";
    });
    timeLimit_3.addEventListener("click",(e)=>{
        timeLimit="3:00";
    });
    timeLimit_5.addEventListener("click",(e)=>{
        timeLimit="5:00";
    });

    //順番
    var order = "Sequential";
    sequential.addEventListener("click",(e)=>{
        order="Sequential";
    });
    random.addEventListener("click",(e)=>{
        order="Random";
    });
    shuffle.addEventListener("click",(e)=>{
        order="Shuffle";
    });

    //タスクリスト表示
    var showList = "ON";
    dispList.addEventListener("click",(e)=>{
        showList = "ON";
    });
    hiddenList.addEventListener("click",(e)=>{
        showList = "OFF";
    });
    

    //アニメーション表示
    var animetion = "ON";
    dispAnime.addEventListener("click",(e)=>{
        animetion = "ON";
    });
    hiddenAnime.addEventListener("click",(e)=>{
        animetion = "OFF";
    });

    //カウントダウン
    var timeORcount = "COUNT";
    countMain.addEventListener("click",(e)=>{
        timeORcount = "COUNT";
    });
    timeMain.addEventListener("click",(e)=>{
        timeORcount = "TIME";
    });

    set.addEventListener("click",()=>{
        //wsにタスクを登録する
        if(changeTaskFlg){
            console.log("changeTaskFlg:"+changeTaskFlg);
            var tasks = document.querySelectorAll('#disptasks > input[type=text]');
            console.dir(tasks);
            ws.setSelectorValue("task",'#disptasks > input[type=text]');  
        }

        window.location.href=url+"?"
        +"timelimit="+timeLimit
        +"&order="+order
        +"&showlist="+showList
        +"&animetion="+animetion            
        +"&timeORcount="+timeORcount;
    });
})();

//タスクのLabelを作成する
function makeTaskLabel(task,dispTasks){
    var Label = document.createElement('Label');
    Label.innerText = task;
    dispTasks.appendChild(Label);
    addBR(dispTasks);
}

function makeWs(){
    if(ws == undefined || ws == null){
        console.log("makeWs");
        ws = new WebStorage();
    }
    ws.log();
}

function authenticate() {
    console.log("authenticate()");
    return gapi.auth2.getAuthInstance().signIn({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/tasks.readonly"
    }).then(function() {
        console.log("Sign-in successful");
        gApiFlg = true;//APIが成功した場合
    }, function(err) {
        console.error("Error signing in", err);
    });
}

//指定のタグの子要素にLabelを追加
function addLabel(parent,text){
    var label = document.createElement('label');
    label.innerText = text;
    parent.appendChild(label);
}

//指定のタグの子要素にbrを追加
function addBR(parent){
    var br = document.createElement('br');
    parent.appendChild(br);
}

