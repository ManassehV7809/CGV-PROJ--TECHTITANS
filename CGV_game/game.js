import Level0 from "./levels/level0.js";
import {BasicCharacterController} from "./character/controls.js";
import {ThirdPersonCamera} from "./camera/camera.js";
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

class Game {
  isPaused = true;

  constructor(thing,height) {

    this._Initialize(thing,height);
  }

  _Initialize(thing,height) {

    //todo: setting up a renderer
    this._threejs = new THREE.WebGLRenderer({
      canvas: document.querySelector('#game'),
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

        //todo: setting up a second renderer
    this._threejs2 = new THREE.WebGLRenderer({
      canvas: document.querySelector('#game_map'),
      antialias: false,
    });
    this._threejs2.outputEncoding = THREE.sRGBEncoding;
    this._threejs2.setPixelRatio(0.5);
    this._threejs2.setSize(window.innerWidth*0.2, window.innerWidth*0.2);

    //todo: setting up a camera
    this._camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.set(25, 10, 25);

    //todo: setting up a scene
    this._scene = new THREE.Scene();

    //loading level
    this._level = null;
    if(thing){
        this._SetLevel(thing);
    }else {
      this._SetLevel(Level0);
    }

    
   // todo: setting up a  map cam
   this.secondCamera = new THREE.PerspectiveCamera(75,1.0, 0.1, 1000);
   this.secondCamera.position.set(0, height, 0);
   this.secondCamera.lookAt(0,0,0);


    this._mixers = [];
    this._previousRAF = null;

    window.totalGameTime = this._level.time; // 5 minutes (300 seconds)
    window.remainingTime = window.totalGameTime;


    window.startGameTimer();

    this._LoadAnimatedModel();
    this._RAF();
  }

  _SetLevel(level) {

    this._level = level;

    //todo: add all lights
      for(let i = 0; i < level.lights.length; i++){
          this._scene.add(level.lights[i]);
      }

      //todo: add background
        this._scene.background = level.background;

      //todo: add ground
        this._scene.add(level.ground);

        //todo: add all objects -
        for(let i = 0; i < level.objects.length; i++){
            this._scene.add(level.objects[i]);
        }
        for(let i = 0; i < level.coinsSpeed.length; i++){
          this._scene.add(level.coinsSpeed[i]);
      }

      for(let i = 0; i < level.coinsTime.length; i++){
        this._scene.add(level.coinsTime[i]);
    }

         // Set the fog for the scene
    this._scene.fog = level.effects;
    this._scene.add(level.effects);

  }

  _LoadAnimatedModel() {

    const params = {
      camera: this._camera,
      scene: this._scene,
      world: this._level,
      startPosition: this._level.startPosition
    }
    this._controls = new BasicCharacterController(params);

    this._thirdPersonCamera = new ThirdPersonCamera({
      camera: this._camera,
      target: this._controls,
    });


  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {

    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();

      this._threejs.render(this._scene, this._camera);
      this._threejs2.render(this._scene, this.secondCamera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });


  }

  _Step(timeElapsed) {
      if(window.isGamePlaying) {
          const timeElapsedS = timeElapsed * 0.001;
          if (this._mixers) {
              this._mixers.map(m => m.update(timeElapsedS));
          }

          if (this._controls) {
              this._controls.Update(timeElapsedS);

          }

          this._thirdPersonCamera.Update(timeElapsedS);
      }
  }

   cleanup() {
    // Release resources
    this._threejs.dispose();
    this._threejs2.dispose();

    // Remove event listeners
    window.removeEventListener('resize', this._OnWindowResize);

    // Remove the controls
       console.log("running the dispose method");
    this._controls._input.removeEventListeners();

    // Remove objects from the scene (if necessary)
    this._scene.remove(this._level.ground);
    for (let i = 0; i < this._level.lights.length; i++) {
      this._scene.remove(this._level.lights[i]);
    }
    for (let i = 0; i < this._level.objects.length; i++) {
      this._scene.remove(this._level.objects[i]);
    }

    // Dispose of any additional resources or objects as needed
    // e.g., Dispose of your animated model, mixers, controls, etc.

    // Reset some properties if necessary
    this._mixers = [];
    this._controls = null;
    this._thirdPersonCamera = null;
  }


}

export {Game}