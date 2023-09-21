import './style.css'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let keyboard = {};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 15, 2);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#game'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200, 100, 100),
    new THREE.MeshStandardMaterial({color: 0x00ff00})
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const pointLight = new THREE.PointLight(0xffffff, 5000);
pointLight.position.set(10,50,10);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

const spaceTexture = new THREE.TextureLoader().load('./images/space.jpg');
scene.background = spaceTexture;

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({color: 0xff0000})
);
cube.position.set(0, 1.5, 0);

scene.add(cube);


function followPlayer() {
    camera.position.x = cube.position.x;
    camera.position.y = cube.position.y + 7;
    camera.position.z = cube.position.z + 15;
}

//todo: add controls
// Set initial velocity for player movement
const playerVelocity = new THREE.Vector3();

// Define movement speed and acceleration
const movementSpeed = 0.5;
const acceleration = 0.1;

// Listen for keydown and keyup events to handle player movement
document.addEventListener("keydown", (event) => {
    keyboard[event.key] = true;
    console.log(keyboard);
});

document.addEventListener("keyup", (event) => {
    keyboard[event.key] = false;
});

// Define initial camera rotation angles
let cameraYaw = 0;
let cameraPitch = 0;

// Define mouse sensitivity for camera control
const mouseSensitivity = 0.002;

// Listen for mouse movement to control the camera
document.addEventListener("mousemove", (event) => {
    cameraYaw -= event.movementX * mouseSensitivity;
    cameraPitch -= event.movementY * mouseSensitivity;

    // Limit camera pitch to avoid flipping
    cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraPitch));

    // Apply camera rotation to the player cube
    cube.rotation.set(0, cameraYaw, 0);

    // Update camera position based on player cube's position
    camera.position.x = cube.position.x - 15 * Math.sin(cameraYaw);
    camera.position.y = cube.position.y + 7;
    camera.position.z = cube.position.z - 15 * Math.cos(cameraYaw);

    // Point the camera at the player cube's position
    const cameraLookAt = new THREE.Vector3(
        cube.position.x,
        cube.position.y + 5,
        cube.position.z-20
    );
    camera.lookAt(cameraLookAt);
});

function handlePlayerMovement() {

    if (keyboard["w"]) {
        // Move forward
        playerVelocity.z -= acceleration;
        console.log("W pressed");
    }
    if (keyboard["s"]) {
        // Move backward
        playerVelocity.z += acceleration;
        console.log("S pressed");
    }
    if (keyboard["a"]) {
        // Move left
        playerVelocity.x -= acceleration;
        console.log("A pressed");
    }
    if (keyboard["d"]) {
        // Move right
        playerVelocity.x += acceleration;
        console.log("D pressed");
    }

        // Apply velocity to the player cube's position
    cube.position.add(playerVelocity);

    // Limit the player's maximum speed
    playerVelocity.clampLength(0, movementSpeed);
}


function animate() {
    requestAnimationFrame(animate);
    handlePlayerMovement();
    followPlayer();
    renderer.render(scene, camera);
}


animate();

