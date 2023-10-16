import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Level from "./level_setting.js";


// board dimension
const dim = 350;

  //todo: define lights
let lights = [];
    let light = new THREE.PointLight(0xFFFFFF, 1.0)
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


     // Increase the intensity of the point light and make it a blue color
  let moonlight = new THREE.PointLight(0x0000FF, 1.5);
 
  moonlight.position.set(-100, 100, 100);
  moonlight.castShadow = true;
  moonlight.shadow.bias = -0.001;
  moonlight.shadow.mapSize.width = 500;
  moonlight.shadow.mapSize.height = 500;
  moonlight.shadow.camera.near = 0.1;
  moonlight.shadow.camera.far = 500.0;
  moonlight.shadow.camera.near = 0.5; // This line seems redundant due to the previous line
  moonlight.shadow.camera.far = 1000.0;
  moonlight.shadow.camera.left = 50;
  moonlight.shadow.camera.right = -50;
  moonlight.shadow.camera.top = 50;
  moonlight.shadow.camera.bottom = -50;
  lights.push(moonlight);

    // Ambient light with a colder hue for atmosphere
light = new THREE.AmbientLight(0x8888aa, 0.4);
lights.push(light);  
   // Add soft directional light
   const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
   directionalLight.position.set(5, 10, 5);
   directionalLight.target.position.set(0, 0, 0);
   directionalLight.castShadow = true;
   lights.push(directionalLight);

   // Additional directional light from the opposite direction for balanced lighting
const oppositeDirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.25);
oppositeDirectionalLight.position.set(-5, 10, -5);
oppositeDirectionalLight.target.position.set(0, 0, 0);
lights.push(oppositeDirectionalLight);

// Point lights with different colors, intensities, and positions
const pointLightConfigs = [
    {color: 0xFF0000, intensity: 0.4, distance: 150},
    {color: 0x00FF00, intensity: 0.3, distance: 150},
    {color: 0x0000FF, intensity: 0.5, distance: 150},
    {color: 0xFFFFFF, intensity: 0.3, distance: 150},
   //more..?
];

for (let config of pointLightConfigs) {
    let pointLight = new THREE.PointLight(config.color, config.intensity, config.distance);
    pointLight.position.set((Math.random() - 0.5) * dim, 5, (Math.random() - 0.5) * dim); // Random positions
    lights.push(pointLight);
}
   
   // Add some point lights to highlight crystal walls
   const pointLightColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFFFF];
   for (let color of pointLightColors) {
       let pointLight = new THREE.PointLight(color, 0.3, 150);
       pointLight.position.set((Math.random() - 0.5) * dim, 5, (Math.random() - 0.5) * dim); // Random positions 
       lights.push(pointLight);
   }

// Define background
let bg = new THREE.TextureLoader().load('../images/moon.jpg');



const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(dim, dim, 10, 10),
    new THREE.MeshStandardMaterial({
      color: 0x808080,
    })
  );
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  
  // Create a new texture loader
  const loader2 = new THREE.TextureLoader();
  
  // Load the ground texture
  const groundTexture = loader2.load('../textures/pave.jpg');
  
  // Set the map property of the ground material to the loaded texture
  plane.material.map = groundTexture;
  



// Maze constants and functions
const cellSize = 50;
const rows = Math.floor(dim/ cellSize);
const cols = Math.floor(dim / cellSize);
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

   
}


function drawEntryExitGround(x, z, color) {
    const entryExitGround = new THREE.Mesh(
        new THREE.PlaneGeometry(cellSize, cellSize, 1, 1),
        new THREE.MeshStandardMaterial({
            color: color,
        })
    );
    entryExitGround.position.set(x, 0.008, z);  // 0.01 to slightly offset it above the main ground
    entryExitGround.rotation.x = -Math.PI / 2;
    return entryExitGround;
}


function drawMaze() {
    // Load your crystal texture
    const crystalTexture = new THREE.TextureLoader().load('../images/crystal2.avif'); 

    let mazeWalls = [];

    // Create a crystal material using the texture
    const crystalMaterial = new THREE.MeshStandardMaterial({
        map: crystalTexture,
        transparent: true,
        opacity: 0.87,
        roughness: 0.1, // less roughness for more shine
        metalness: 1
    })

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = grid[i][j];
            const x = i * cellSize - (dim/2) + cellSize / 2;
            const z = j * cellSize - (dim/2) + cellSize / 2;

            if (cell.walls.top) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(cellSize, 10, 1), 
                    crystalMaterial
                );
                wall.position.set(x, 5, z - cellSize / 2);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }

            if (cell.walls.right) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, cellSize),
                    crystalMaterial
                );
                wall.position.set(x + cellSize / 2, 5, z);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }

            if (cell.walls.bottom) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(cellSize, 10, 10),
                    crystalMaterial
                );
                wall.position.set(x, 5, z + cellSize / 2);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }
            
            if (cell.walls.left) {
                const wall = new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, cellSize),
                    crystalMaterial
                );
                wall.position.set(x - cellSize / 2, 5, z);
                wall.castShadow = true;
                wall.receiveShadow = true;
                mazeWalls.push(wall);
            }
        }
    }

    // Drawing special grounds for start and end cells
    const startGround = drawEntryExitGround(-(dim/2) + cellSize / 2, -(dim/2) + cellSize / 2, 0x00FF00);  // Green for start
    const endGround = drawEntryExitGround((dim/2) - cellSize / 2, (dim/2) - cellSize / 2, 0xFF0000);    // Red for end

    mazeWalls.push(startGround);
    mazeWalls.push(endGround);
    
    return mazeWalls;
}



generateMaze();
const mazeObjects = drawMaze();

let objects = [...mazeObjects];

let effects = null;

let startPosition = {x:-(dim/2) + cellSize / 2, y:0.01, z:-(dim/2) + cellSize / 2}

let Level0 = new Level(lights,effects, bg, plane, objects, startPosition, 60);

export default Level0;
