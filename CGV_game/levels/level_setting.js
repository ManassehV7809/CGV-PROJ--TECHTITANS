class Level {
    constructor( lights, effects, background, ground, objects,coins, startPosition,time, ) {

        this.lights = lights;
        this.background = background;
        this.ground = ground;
        this.objects = objects;
        this.startPosition = startPosition;
        this.effects=effects;
        this.coins=coins;
        if(time){
            this.time = time;
        }
        else{
            this.time = 6000;
        }


       
    }

}

export default Level;