import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

    //define ball
    const Ball = new THREE.Mesh(
        new THREE.SphereGeometry(5, 32, 32),
        new THREE.MeshStandardMaterial({
            // color: 0xffff00,
            }));
    Ball.position.set(10, 5, 10);
    Ball.castShadow = true;
    Ball.receiveShadow = true;

    //load balltexture
    const ballTexture = new THREE.TextureLoader().load('../textures/ball.png');
    Ball.material.map = ballTexture;


    export default Ball;




