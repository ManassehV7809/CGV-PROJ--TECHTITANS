import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Level from "./level_setting.js";
import Ball from '../models/ball.js'

  //todo: define lights
let lights = [];
    let light = new THREE.PointLight(0xFFFFFF, 1.0);
    light.position.set(-100, 100, 100);
    //light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 500;
    light.shadow.mapSize.height = 500;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;

    lights.push(light);

    light = new THREE.AmbientLight(0xffffff, 0.25);
    lights.push(light);

    //todo: define background
    let bg = new THREE.TextureLoader().load('./images/space.jpg');

    //todo: define ground
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshStandardMaterial({


          }));

    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    const planeTexture = new THREE.TextureLoader().load('../textures/concrete.jpg');
    plane.material.map = planeTexture;

    //todo: define objects

    let objects = [];
    //define wall
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 10),
        new THREE.MeshStandardMaterial({
            }));
    wall.position.set(0, 50, -50);
    wall.castShadow = true;
    wall.receiveShadow = true;

    //load texture
    const wallTexture = new THREE.TextureLoader().load('../textures/brick_wall.jpg');
    wall.material.map = wallTexture;

    objects.push(wall);

    objects.push(Ball);




    let Level1 = new Level(lights, bg, plane, objects);

    export default Level1;