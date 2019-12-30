"use strict";
/**
 * class for Animation
 */
class Animation{
    constructor(animationBox,timer){
        this.name = "prent";
        this.flg = false;
        this.animationBox = animationBox;
        this.timer = timer;
    }

    // animationBoxStyle = {
    //     'backgroundColor':'black'
    // }
    
    getElementStyle(elementId){
        console.log("getElementStyle()");
        let ele = document.getElementById(elementId);
        console.dir(ele);
        return ele.style;
    }

    changeCss(eleStyle,style){
        for(var prop in style) {
            eleStyle[prop] = style[prop];   
        }
    }

    // changeAnimationBox(){
    //     console.dir(this.animationBox);
    //     this.changeCss(this.animationBox.style,this.animationBoxStyle);
    // }

    getAnimationBox(){
        return this.animationBox;
    }

    getTimer(){
        return this.timer;
    }

    getName(){
        return this.name;
    }

    getFlg(){
        return this.flg;
    }
    setFlg(arg){
        if(arg == 'OFF'){
            this.flg = false;
        }else if(arg == 'ON'){
            this.flg = true;
        }else {
            this.flg = arg;
        }
    }

    //abstract method
    start(){}
    toggle(){}
    last(num){}
    end(){}

}

// function getNewton(a,b){
//     console.log("getNewton()");
//     return new Newton(a,b);
// }

class Newton extends Animation {
    constructor(animationBox,timer){
        super(animationBox,timer);
        this.name = "newton";
        this.flg = true;
        this.img = document.createElement('img');
        this.img.src = "./image/apple.png";
    }

    start(){
        this.img.classList.add('apple0');
        super.getAnimationBox().appendChild(this.img);
        //super.getTimer().classList.replace( 'timer2', 'timer1' );
        super.getTimer().className = 'timer1'; //#17
    }

    toggle(){
        let activeClass = this.img.className;
        let i = Number(activeClass.replace(/[^0-9^\.]/g,""));
        i = (i+1)%5;
        //this.img.classList.replace( activeClass, 'apple'+i );
        this.img.className = 'apple'+i; //#17
    }

    last(num){
        if(num==0){
            this.img.src = "./image/neko.png";
            //this.img.classList.replace( this.img.className, 'appleEnd' );
            this.img.className = "appleEnd";
        }else if(num<10){
            let i = 4 - (num%5);
            //this.img.classList.replace( this.img.className, 'apple'+i );
            this.img.className = 'apple'+i;
        }else{
            this.toggle();
        }
    }
    end(){
        console.dir(this.img);
        if(this.img){
            this.img = null;
            super.getAnimationBox().innerHTML = "";
            super.getAnimationBox().appendChild(super.getTimer());
        }
    }
}




class Darwin extends Animation {
    constructor(animationBox,timer){
        super(animationBox,timer);
        this.name = "darwin";
        this.flg = true;
    }

    start(){
        super.getAnimationBox().classList.add('darwin0');
        //super.getTimer().classList.replace( 'timer1', 'timer2' );
        super.getTimer().className = 'timer2'; //#17
        super.getAnimationBox().style.border = "none";        
    }

    toggle(){
        let div = super.getAnimationBox();
        let activeClass = div.className;
        let i = Number(activeClass.replace(/[^0-9^\.]/g,""));
        i = (i+1)%5;
        // console.dir(activeClass);
        //div.classList.replace( activeClass, 'darwin'+i );
        div.className = 'darwin'+i; //#17
    }

    last(num){
        let div = super.getAnimationBox();
        if(num==0){
            // div.classList.replace( div.className, 'darwin_end' );
            div.className = 'darwin_end';//#17
        }else if(num==1){
            // div.classList.replace( div.className, 'darwin8' );
            div.className = 'darwin8';//#17
        }else if(num==2){
            // div.classList.replace( div.className, 'darwin7' );
            div.className = 'darwin7';//#17
        }else if(num==3){
            // div.classList.replace( div.className, 'darwin6' );
            div.className = 'darwin6';//#17
        }else if(num==4){
            // div.classList.replace( div.className, 'darwin5' );
            div.className = 'darwin5';//#17
        }else if(num==5){
            // div.classList.replace( div.className, 'darwin0' );
            div.className = 'darwin0';//#17
        }else{
            this.toggle();
        }
    }

    end(){
        super.getAnimationBox().className = "";
        super.getAnimationBox().style.border = "";
    }

}