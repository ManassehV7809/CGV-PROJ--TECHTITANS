//todo: new things
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {BasicCharacterController} from "./character/controls.js";
import {ThirdPersonCamera} from "./camera/camera.js";
import Level0 from "./levels/level0.js";
import Level1 from "./levels/level1.js";
import Level2 from "./levels/level2.js";


// // Get a reference to the audio element
const audio = document.getElementById("myAudio");
audio.volume = 0.4;

// const menu = document.getElementById("score");
// menu.style.display = "none";


class Game {
  isPaused = true;
  constructor() {
    this._Initialize();
  }

  _Initialize() {

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

    //todo: setting up a camera
    this._camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    this._camera.position.set(25, 10, 25);

    //todo: setting up a scene
    this._scene = new THREE.Scene();

    //loading level
    this._SetLevel(Level1);

    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    this._RAF();
  }

  _SetLevel(level) {

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

  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
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
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
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


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Game();
});
