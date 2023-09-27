import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Level from "./level_setting.js";

  //todo: define lights
let lights = [];
    let light = new THREE.PointLight(0xFFFFFF, 1.0);
    light.position.set(0, 100, 0);
    //light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 3000;
    light.shadow.mapSize.height = 3000;
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

// Define background
let bg = new THREE.TextureLoader().load('./images/space.jpg');

// Define ground
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000, 10, 10),
    new THREE.MeshStandardMaterial({
        color: 0x808080,
    })
);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;



// Maze constants and functions
const cellSize = 50;
const rows = Math.floor(1000 / cellSize);
const cols = Math.floor(1000 / cellSize);
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

    return neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
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
    let stack = [];
    stack.push(current);

    while (stack.length) {
        const next = getUnvisitedNeighbors(current);
        if (next) {
            next.visited = true;
            removeWalls(current, next);
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }

    // Marking the start and end cells
    let startCell = grid[0][0];
    let endCell = grid[rows - 1][cols - 1];
    
    // Creating the doorways
    startCell.walls.top = false;
    endCell.walls.bottom = false;
}


function drawEntryExitGround(x, z, color) {
    const entryExitGround = new THREE.Mesh(
        new THREE.PlaneGeometry(cellSize, cellSize, 1, 1),
        new THREE.MeshStandardMaterial({
            color: color,
        })
    );
    entryExitGround.position.set(x, 0.01, z);  // 0.01 to slightly offset it above the main ground
    entryExitGround.rotation.x = -Math.PI / 2;
    return entryExitGround;
}


function drawMaze() {
    const wallTexture = new THREE.TextureLoader().load('../textures/brick_wall.jpg');
    let mazeWalls = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j];
            const x = i * cellSize - 500 + cellSize / 2;
            const z = j * cellSize - 500 + cellSize / 2;

            if (cell.walls.top) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(cellSize, 10, 1), // Adjust height as defined
                    new THREE.MeshStandardMaterial({ map: wallTexture }) // Set the wall texture
                );
                wall.position.set(x, 5, z - cellSize / 2); // Adjust the y-position
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }
            
            // Repeat the above process for right, bottom, and left walls

            if (cell.walls.right) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, cellSize),
                    new THREE.MeshStandardMaterial({ map: wallTexture })
                );
                wall.position.set(x + cellSize / 2, 5, z);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }

            if (cell.walls.bottom) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(cellSize, 10, 10),
                    new THREE.MeshStandardMaterial({ map: wallTexture })
                );
                wall.position.set(x, 5, z + cellSize / 2);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }
            
            if (cell.walls.left) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, cellSize),
                    new THREE.MeshStandardMaterial({ map: wallTexture })
                );
                wall.position.set(x - cellSize / 2, 5, z);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }
        }
    }

    // Drawing special grounds for start and end cells
    const startGround = drawEntryExitGround(-500 + cellSize / 2, -500 + cellSize / 2, 0x00FF00);  // Green for start
    const endGround = drawEntryExitGround(500 - cellSize / 2, 500 - cellSize / 2, 0xFF0000);    // Red for end

    mazeWalls.push(startGround);
    mazeWalls.push(endGround);
    
    return mazeWalls;
}


generateMaze();
const mazeObjects = drawMaze();

//Wall  definition
// const wall = new THREE.Mesh(
//     new THREE.BoxGeometry(250, 300, 10),
//     new THREE.MeshStandardMaterial({
      
//     })
// );
// wall.position.set(0, 50, -50);
// wall.castShadow = true;
// wall.receiveShadow = true;

// const wallTexture = new THREE.TextureLoader().load('../textures/brick_wall.jpg');
// wall.material.map = wallTexture;

// const ball = new THREE.Mesh(
//     new THREE.SphereGeometry(5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: 0xff0000,
//     })
// );
// ball.position.set(10, 5, 10);
// ball.castShadow = true;
// ball.receiveShadow = true;

// Merge maze objects, wall, and ball into a single objects array


let objects = [...mazeObjects];

let Level0 = new Level(lights, bg, plane, objects);

export default Level0;
