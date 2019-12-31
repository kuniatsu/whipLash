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

var sync = document.querySelector("#sync");


var set = document.querySelector("#set");
var googletasks = document.querySelector("#googletasks");



(()=>{
    console.log("()=>{}");
    document.querySelector('#host').value=window.location.href;　//host欄を入力する

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

    //同期のclickイベント
    sync.addEventListener("click",(e)=>{
        console.log("googletasks");
        console.dir(googletasks);
        var syncBox = document.querySelector("#syncBox");
        syncBox.classList.add("displayNone");

        //ACCESS_KEY取得
        console.log("ACCESS_KEY取得");            
        authenticate().then(loadClient);//GoogleAPI
    });

    set.addEventListener("click",()=>{
        //wsにタスクを登録する
        if(changeTaskFlg){
            console.log("changeTaskFlg:"+changeTaskFlg);
            var tasks = document.querySelectorAll('#disptasks > input[type=text]');
            console.dir(tasks);
            ws.setSelectorValue("task",'#disptasks > input[type=text]');  
        }
        var referrerUrl = document.referrer;
        console.log(referrerUrl);
        var url = "./index.html";
        if(referrerUrl.match(/monaca/)){
            console.log("monaca含む");
            url = "./index_monaca.html";
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
function loadClient() {
    console.log("loadClient()");
    if(gApiFlg==true){
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/tasks/v1/rest").then(function() {
            console.log("GAPI client loaded for API");
            //タスクリストの作成
            getTaskList();             
        }, function(err) {
            console.error("Error loading GAPI client for API", err);
            return null;
        });
    }else{
        console.log("Google API async");
    }
}

//GoogleAPIで取得したタスクリストを出力する。
function getTaskList(){
    console.log("getTaskList()");
    var disptaskList = document.querySelector("#disptaskList");
    //タスクリストの初期化
    disptaskList.textContent = null;//削除
    return gapi.client.tasks.tasklists.list({}).then(function(response) {
        var getListStr=[];
        getListStr = makeTaskListLabel(response.result.items);

        //wsに保存
        if(getListStr.length){
            console.dir(getListStr);
            ws.setItem("List",getListStr);
        }
        document.querySelector('#taskLists').classList.remove("displayNone");

        changeTaskFlg = true;
    }, function(err) {
        console.error("Execute error", err);
    });
}

//タスクリストのLIを作成する
function makeTaskListLabel(List){
    var disptaskList = document.querySelector("#disptaskList");
    var getListStr=[];
    for(item of List){
        getListStr.push('{"'+ item.title +'" : "'+ item.id +'"}');
        var label = document.createElement('label');
        label.innerText = item.title;
        label.code = item.id;
        label.addEventListener('click',(event)=>{
            console.dir(event.target);
            console.log("taskId:"+event.target.code);
            console.log("taskName:"+event.target.value);

            //wsから取得
            if(ws.checkItem(event.target.value)){
                console.log("wsにある");
            }else{
                console.log("wsにない");
            }

            //GoogleApiから取得
            execute(event.target);
        });
        disptaskList.appendChild(label);
        addBR(disptaskList);
    }
    return getListStr;
}

// //タスクリストのLIを作成する
// function setTaskListLi(List){
//     var disptaskList = document.querySelector("#disptaskList");
//     for(item of List){
//         var obj = JSON.parse(item);

//         var label = document.createElement('label');
//         label.innerText = Object.keys(obj)[0];
//         label.code = obj[Object.keys(obj)[0]];
//         // label.type = "text";
//         // label.readOnly="readonly";
//         label.addEventListener('click',(event)=>{
//             console.dir(event.target);
//             console.log("taskId:"+event.target.code);

//             console.log("wsにあったならexecuteではなくwsから引っ張る");
//             //wsから取得
//             if(ws.checkItem(event.target.value)){
//                 console.log("このリストwsにある");
//             }else{
//                 console.log("このリストwsにない");
//             }

//             execute(event.target);

//         });
//         disptaskList.appendChild(label);
//     }
// }

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

//TaskAPIを叩いて、タスクリストのコードからタスクを取得する
function execute(tasklist="") {
    console.log("execute()");
    if(tasklist.code==""){
        console.log("return");
        return;
    }else{
        console.log("tasklist:"+tasklist.code);                    
    }
    
    console.dir(gapi.client.tasks);
    if(undefined == gapi.client.tasks){
        //GoogleにログインしていないのでAPIが叩けない状態
        authenticate().then(loadClient);
        return;
    }
    return gapi.client.tasks.tasks.list({
        "tasklist": tasklist.code
    }).then(function(response) {
        let dispTasks = document.querySelector("#disptasks");
        dispTasks.textContent = null;//削除
        // addLabel(dispTasks,"TASKS");
        
        console.log("ここでリスト名が取れるなら並べるのと一緒にwsにも登録");
        console.dir(response);
        ws.removeItem("task");
        for(item of response.result.items){
            if(item!=""&&item!=null){
                makeTaskLabel(item.title,dispTasks);
                //wsに登録
                ws.addCommaItem("task",item.title);
            }
        }
    }, function(err) {
        console.error("Execute error", err);
    });
}
// gapi.load("client:auth2", function() {
//     gapi.auth2.init({
//         client_id: CLIENT_ID
//     });
// });