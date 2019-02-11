"use strict";
/**
 * class for Animation
 */
class Animation{
    constructor(animationBox,timer){
        this.animationBox = animationBox;
        this.timer = timer;
    }

    animationBoxStyle = {
        'backgroundColor':'black'
    }
    
    getElementStyle(elementId){
        let ele = document.getElementById(elementId);
        console.dir(ele);
        return ele.style;
    }

    changeCss(eleStyle,style){
        for(var prop in style) {
            eleStyle[prop] = style[prop];   
        }
    }

    changeAnimationBox(){
        console.dir(this.animationBox);
        this.changeCss(this.animationBox.style,this.animationBoxStyle);
    }

    getAnimationBox(){
        return this.animationBox;
    }

    getTimer(){
        return this.timer;
    }

    start(){}
    toggle(){}
    last(num){}
    end(){}


}

class Newton extends Animation {
    constructor(animationBox,timer){
        super(animationBox,timer);
        this.img = document.createElement('img');
        this.img.src = "./image/apple.png";
    }

    start(){
        this.img.classList.add('apple0');
        super.getAnimationBox().appendChild(this.img);
    }

    toggle(){
        let activeClass = this.img.className;
        let i = Number(activeClass.replace(/[^0-9^\.]/g,""));
        i = (i+1)%5;
        this.img.classList.replace( activeClass, 'apple'+i );
    }

    last(num){
        if(num==0){
            this.img.src = "./image/neko.png";
            this.img.classList.replace( this.img.className, 'appleEnd' )
        }else if(num<10){
            let i = 4 - (num%5);
            this.img.classList.replace( this.img.className, 'apple'+i );
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
    }

    start(){
        super.getAnimationBox().classList.add('darwin0');
        super.getTimer()
    }

    toggle(){}
    last(num){}
    end(){}

}