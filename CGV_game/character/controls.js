import {CharacterFSM} from "./stateMachines.js";
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';

class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
}

class BasicCharacterController {
    constructor(params) {
        this._Init(params);
        this._hasCompleted = false;
    }

    _Init(params) {
        this._params = params;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.25, 120.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3(params.startPosition.x, params.startPosition.y, params.startPosition.z);
        this._world = params.world;
        this.startPosition = params.startPosition;

        this._animations = {};
        this._input = new BasicCharacterControllerInput();
        this._stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this._animations));

        this._LoadModels();

        setTimeout(() => {
            this._activateSpeedBoost();
        }, 5000);
    }

    _LoadModels() {
        const loader = new FBXLoader();
        loader.setPath('./resources/dancer/');
        loader.load('dancer.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });

            this._target = fbx;
            this._params.scene.add(this._target);
            this._target.position.set(this._params.startPosition.x, this._params.startPosition.y, this._params.startPosition.z);
            this._mixer = new THREE.AnimationMixer(this._target);

            this._manager = new THREE.LoadingManager();
            this._manager.onLoad = () => {
                this._stateMachine.SetState('idle');
            };

            const _OnLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);
                this._animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const loader = new FBXLoader(this._manager);
            loader.setPath('./resources/zombie/');
            loader.load('walk.fbx', (a) => { _OnLoad('walk', a); });
            loader.load('run.fbx', (a) => { _OnLoad('run', a); });
            loader.load('idle.fbx', (a) => { _OnLoad('idle', a); });
            loader.load('dance.fbx', (a) => { _OnLoad('dance', a); });
        });
    }

    get Position() {
        return this._position;
    }

    get Rotation() {
        if (!this._target) {
            return new THREE.Quaternion();
        }
        return this._target.quaternion;
    }

    Update(timeInSeconds) {
        if (!this._stateMachine._currentState) {
            return;
        }

        this._stateMachine.Update(timeInSeconds, this._input);

        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z)
        );

        velocity.add(frameDecceleration);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();
        if (this._input._keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (this._stateMachine._currentState.Name === 'dance') {
            acc.multiplyScalar(0.0);
        }

        if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);

        const potentialPosition = controlObject.position.clone().add(forward).add(sideways);
        const characterBox = new THREE.Box3().setFromObject(this._target);
        const translation = potentialPosition.clone().sub(controlObject.position);
        characterBox.min.add(translation);
        characterBox.max.add(translation);

        if (!this._isBoundingBoxColliding(characterBox)) {
            controlObject.position.copy(potentialPosition);
            this._position.copy(controlObject.position);
        }

        if (this._isAtDestination() && !this._hasCompleted) {
            this._stateMachine.SetState('dance');
            const popup = document.getElementById('levelCompletionPopup');
            const CompletionSound = document.getElementById('CompletionSound');
            CompletionSound.volume = 1.0;
            CompletionSound.play();
            popup.style.display = 'block';
            console.log("Completed the maze!");
            window.remainingTime = 6000;
            this._hasCompleted = true;
        }

        if (this._mixer) {
            this._mixer.update(timeInSeconds);
        }
    }

    _isBoundingBoxColliding(box) {
        const center = box.getCenter(new THREE.Vector3());
        const shrinkFactor = 0.6;
        box.min.lerp(center, shrinkFactor);
        box.max.lerp(center, shrinkFactor);

        for (let obj of this._world.objects) {
            const objBox = new THREE.Box3().setFromObject(obj);
            if (box.intersectsBox(objBox)) {
              const crashSound = document.getElementById('crashSound');
            crashSound.volume = 1.0;
            crashSound.play();
                return true;

            }
        }

        return false;
    }

    _isAtDestination() {
        const distance = this._position.distanceTo(this._world.objects[this._world.objects.length - 1].position);
        return distance < 15;
    }

    _activateSpeedBoost() {
        console.log("speed boost activated")
        const speedIcon = document.getElementById('speed-icon');
        speedIcon.style.display = 'block';
        this._acceleration = new THREE.Vector3(1.5, 0.3, 200.0);

        setTimeout(() => {
            speedIcon.style.display = 'none';
            console.log("speed boost deactivated")
            this._acceleration = new THREE.Vector3(1, 0.25, 120.0);
        }, 5000)
    }



    _stopSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}

class BasicCharacterControllerInput {
  constructor() {
    this._Init();
    this._isFootStep = false;
    this._isRunning = false;
    // this._footSteps = new Audio('./music/walkSound.mp3');
    // this._run = new Audio('./music/runningSound.mp3');
    window.singletons._footSteps.playbackRate = 0.75;
  }

  _Init() {
    this._keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    console.log("key down");
    switch (event.keyCode) {
      case 87: // w
        this._keys.forward = true;
        window.singletons._footSteps.playbackRate = 0.75;
        window.singletons._footSteps.play().then(r => r).catch(e => console.log(e));
        break;
      case 65: // a
        this._keys.left = true;
        break;
      case 83: // s
        this._keys.backward = true;
        window.singletons._footSteps.playbackRate = 0.75;
        window.singletons._footSteps.play().then(r => r).catch(e => console.log(e));
        break;
      case 68: // d
        this._keys.right = true;
        break;
      case 32: // SPACE
        this._keys.space = true;
        break;
      case 16: // SHIFT
        this._keys.shift = true;
      window.singletons._footSteps.playbackRate = 1.2;
        //this._footSteps.play().then(r => r).catch(e => console.log(e));
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this._keys.forward = false;
         window.singletons._footSteps.pause();
          window.singletons._footSteps.currentTime = 0;
        break;
      case 65: // a
        this._keys.left = false;
        break;
      case 83: // s
        this._keys.backward = false;
        window.singletons._footSteps.playbackRate = 0.75;
        window.singletons._footSteps.pause();
      window.singletons._footSteps.currentTime = 0;
        break;
      case 68: // d
        this._keys.right = false;
        break;
      case 32: // SPACE
        this._keys.space = false;
        break;
      case 16: // SHIFT
        this._keys.shift = false;
        window.singletons._footSteps.playbackRate = 0.75;
        //this._footSteps.pause();
        //this._footSteps.currentTime = 0;
        break;
    }
  }

    removeEventListeners() {
    console.log("removing event listeners")
    document.removeEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.removeEventListener('keyup', (e) => this._onKeyUp(e), false);
    console.log("removed!!!!!!")
  }

}

export { BasicCharacterControllerProxy, BasicCharacterControllerInput, BasicCharacterController };
