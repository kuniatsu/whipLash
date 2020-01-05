var sync = document.querySelector("#sync");

sync.addEventListener("click",(e)=>{
    console.log("googletasks");
    console.dir(googletasks);
    var syncBox = document.querySelector("#syncBox");
    syncBox.classList.add("displayNone");

    //ACCESS_KEY取得
    console.log("ACCESS_KEY取得");            
    authenticate().then(loadClient);//GoogleAPI
});

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

gapi.load("client:auth2", function() {
    gapi.auth2.init({
        client_id: CLIENT_ID
    });
});







