(()=>{
    var mess = document.getElementById("statusMess");
    mess.innerText = "masao";

    bt.addEventListener('click',()=>{
        // console.dir(taskList);
        console.log("buttonClick");
        testLog("test.js");
    });
    
    bt2.addEventListener('click',()=>{nextTask()});
    bt3.addEventListener('click',()=>{deleteEndTask()});
    bt4.addEventListener('click',()=>{timeCount(document.getElementById('timer'))});
    // document.querySelectorAll('.task').forEach((task)=>{
    //     task.addEventListener('click',(e)=>{
    //         let strikethroughFlg = checkClass(e.target,"strikethrough");
    //         if(strikethroughFlg){
    //             task.classList.remove('strikethrough');
    //         }else{
    //             task.classList.add('strikethrough');
    //         }
    //     });
    // });

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
    
    document.querySelectorAll('.listIcon').forEach((icon)=>{
        icon.addEventListener('click',(e)=>{
            // console.log("hamburger");
        });
    });
    
    bt12.addEventListener('click',()=>{
        ani = new Newton(animationBox,timer);
        // ani.changeAnimationBox();
        ani.start();
    });
    
    bt13.addEventListener('click',()=>{
        ani.toggle();
    });

    bt14.addEventListener('click',()=>{
        let obj = new Newton(animationBox,timer);
        console.log(obj.getName());
    });

    insomniaOn.addEventListener('click',()=>{
      mess.innerText = "sleep制御_keepON";
      console.log("sleep制御_keepON");
      window.plugins.insomnia.keepAwake();//sleep制御
    });

    insomniaOff.addEventListener('click',()=>{
      mess.innerText = "sleep制御_keepOFF ./../../";
      console.log("sleep制御_keepOFF");
      window.plugins.insomnia.allowSleepAgain();//sleep制御
    });


})();