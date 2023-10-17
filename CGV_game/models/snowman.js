import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


function createSnowman() {

// Base of the snowman
const base = new THREE.Mesh(
    new THREE.SphereGeometry(7, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF })  // white color
);
base.position.set(0, 7, 0);
base.castShadow = true;
base.receiveShadow = true;

// Middle part of the snowman
const middle = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF })  // white color
);
middle.position.set(0, 13, 0);
middle.castShadow = true;
middle.receiveShadow = true;

// Head of the snowman
const head = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF })  // white color
);
head.position.set(0, 20, 0);
head.castShadow = true;
head.receiveShadow = true;

// Eyes of the snowman
const eyeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });  // black color

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-1.5, 20.5, 3.8);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(1.5, 20.5, 3.8);

// Nose of the snowman (carrot-like shape)
const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 3, 32),
    new THREE.MeshStandardMaterial({ color: 0xFF9933 })  // orange color
);
nose.position.set(0, 20, 4.5);
nose.rotation.set(0, Math.PI, 0);

// Assemble the snowman
const snowman = new THREE.Group();
snowman.add(base);
snowman.add(middle);
snowman.add(head);
snowman.add(leftEye);
snowman.add(rightEye);
snowman.add(nose);

snowman.scale.set(1.5*Math.random(), 1.5*Math.random(), 1.5*Math.random());

return snowman;
}
export { createSnowman };

