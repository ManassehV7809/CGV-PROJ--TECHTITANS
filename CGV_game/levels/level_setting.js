class Level {
    constructor( lights, effects, background, ground, objects,coinsSpeed,coinsTime, startPosition,time, ) {
        this.lights = lights;
        this.background = background;
        this.ground = ground;
        this.objects = objects;
        this.startPosition = startPosition;
        this.effects=effects;
        this.coinsTime=coinsTime;
        this.coinsSpeed=coinsSpeed;
        if(time){
            this.time = time;
        }
        else{
            this.time = 6000;
        }
    }

}

export default Level;