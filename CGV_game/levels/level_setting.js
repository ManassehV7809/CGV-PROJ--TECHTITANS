class Level {
    constructor( lights, effects, background, ground, objects, startPosition ) {

        this.lights = lights;
        this.background = background;
        this.ground = ground;
        this.objects = objects;
        this.startPosition = startPosition;
        this.effects=effects;
       
    }

}

export default Level;