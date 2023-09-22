import './style.css'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let keyboard = {};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 2);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#game') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 80, 0);  // Position the camera above
camera.lookAt(0, 0, 0);  // Make it look downwards


// Ground setup
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 333, 72, 72),
    new THREE.MeshStandardMaterial({color: 0x00ff00})
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const groundMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('./images/exp.avif')
});
ground.material = groundMaterial;

// Lighting setup
const pointLight = new THREE.PointLight(0x7f7fff, 1000);
pointLight.position.set(10, 50, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// Background
const spaceTexture = new THREE.TextureLoader().load('./images/space.jpg');
scene.background = spaceTexture;

// Player setup
const cellSize = 25; // This means a 20x13 maze for a 500x333 ground.

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(5, 2, 3),
    new THREE.MeshStandardMaterial({color: 0xff0000})
);
cube.position.set(-250 + cellSize / 2, 1.5, -166.5 + cellSize / 2);  // Start at the top-left corner of the maze
scene.add(cube);

// Walls setup
const wallMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('./images/wall texture - vusani.avif')
});

let walls = []; // Array to store all wall meshes

function addWall(x, y, z, width, height, depth) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        wallMaterial
    );
    wall.position.set(x, y, z);
    walls.push(wall); // Save the wall for collision checks
    scene.add(wall);
}

const wallHeight = 10;
const wallThickness = 2;
addWall(0, wallHeight / 2, -166.5 + wallThickness / 2, 500, wallHeight, wallThickness);
addWall(0, wallHeight / 2, 166.5 - wallThickness / 2, 500, wallHeight, wallThickness);
addWall(-250 + wallThickness / 2, wallHeight / 2, 0, wallThickness, wallHeight, 333);
addWall(250 - wallThickness / 2, wallHeight / 2, 0, wallThickness, wallHeight, 333);



// Maze Generation

const rows = Math.floor(500 / cellSize);
const cols = Math.floor(333 / cellSize);
let stack = [];
let grid = Array(rows).fill(null).map(() => Array(cols).fill(null));

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true
    };
}

function getUnvisitedNeighbors(cell) {
    const neighbors = [];
    const top = grid[cell.i][cell.j - 1];
    const right = grid[cell.i + 1] ? grid[cell.i + 1][cell.j] : undefined;
    const bottom = grid[cell.i][cell.j + 1];
    const left = grid[cell.i - 1] ? grid[cell.i - 1][cell.j] : undefined;

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length) {
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
}

function removeWalls(a, b) {
    const x = a.i - b.i;
    if (x === 1) {
        a.walls.left = false;
        b.walls.right = false;
    } else if (x === -1) {
        a.walls.right = false;
        b.walls.left = false;
    }

    const y = a.j - b.j;
    if (y === 1) {
        a.walls.top = false;
        b.walls.bottom = false;
    } else if (y === -1) {
        a.walls.bottom = false;
        b.walls.top = false;
    }
}

function generateMaze() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    let current = grid[0][0];
    current.visited = true;
    stack.push(current);

    while (stack.length) {
        const next = getUnvisitedNeighbors(current);

        if (next) {
            next.visited = true;

            // Remove walls between current and next cells
            removeWalls(current, next);

            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }
}


generateMaze();



// Create Walls based on Maze Grid
function drawMaze() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j];
            const x = i * cellSize - 250 + cellSize / 2; // Offset by half the ground width
            const z = j * cellSize - 166.5 + cellSize / 2; // Offset by half the ground height

            if (cell.walls.top) {
                addWall(x, wallHeight / 2, z - cellSize / 2, cellSize, wallHeight, wallThickness);
            }
            if (cell.walls.right) {
                addWall(x + cellSize / 2, wallHeight / 2, z, wallThickness, wallHeight, cellSize);
            }
            if (cell.walls.bottom) {
                addWall(x, wallHeight / 2, z + cellSize / 2, cellSize, wallHeight, wallThickness);
            }
            if (cell.walls.left) {
                addWall(x - cellSize / 2, wallHeight / 2, z, wallThickness, wallHeight, cellSize);
            }
        }
    }
}

drawMaze();





// Camera follow player setup
function followPlayer() {
    camera.position.x = cube.position.x;
    camera.position.y = cube.position.y + 15; // Make the camera higher for better visibility
    camera.position.z = cube.position.z + 25;
    camera.lookAt(cube.position);
}
// Player movement
const playerVelocity = new THREE.Vector3();
const movementSpeed = 0.7;
const acceleration = 0.2;

document.addEventListener("keydown", (event) => {
    keyboard[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keyboard[event.key] = false;
});

let cameraYaw = 0;
let cameraPitch = 0;
const mouseSensitivity = 0.002;

document.addEventListener("mousemove", (event) => {
    cameraYaw -= event.movementX * mouseSensitivity;
    cameraPitch -= event.movementY * mouseSensitivity;
    cameraPitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraPitch));
    cube.rotation.set(0, cameraYaw, 0);
    camera.position.x = cube.position.x - 15 * Math.sin(cameraYaw);
    camera.position.y = cube.position.y + 7;
    camera.position.z = cube.position.z - 15 * Math.cos(cameraYaw);
    const cameraLookAt = new THREE.Vector3(cube.position.x, cube.position.y + 5, cube.position.z-20);
    camera.lookAt(cameraLookAt);
});



function checkCollision(direction) {
    const playerBox = new THREE.Box3().setFromObject(cube);
    playerBox.expandByVector(new THREE.Vector3(0.5, 0.5, 0.5)); // Expand the bounding box a little for better feel

    const futureBox = playerBox.clone().translate(direction);

    for (let wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (futureBox.intersectsBox(wallBox)) {
            return true;
        }
    }
    return false;
}

function handlePlayerMovement() {
    const direction = new THREE.Vector3();

    if (keyboard["w"]) direction.z = -acceleration;
    if (keyboard["s"]) direction.z = acceleration;
    if (keyboard["a"]) direction.x = -acceleration;
    if (keyboard["d"]) direction.x = acceleration;

    if (!checkCollision(direction)) {
        cube.position.add(direction);
    }
}

function animate() {
    requestAnimationFrame(animate);
    handlePlayerMovement();
    followPlayer();
    renderer.render(scene, camera);
}

animate();
