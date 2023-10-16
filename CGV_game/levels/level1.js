import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Level from "./level_setting.js";
import { createLavaRock } from '../models/lavarock.js';

//todo: define lights
let lights = [];

// Point light
let light = new THREE.PointLight(0xFF9900, 1.5);
light.position.set(-100, 100, 100);
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

// Ambient light
light = new THREE.AmbientLight(0xFF4500, 0.5);
lights.push(light);

// Spotlight
let light1 = new THREE.SpotLight(0xFF9900, 0.5);
light1.position.set(0, 100, 100);
light1.target.position.set(0, 0, 0);
light1.castShadow = true;
light1.shadow.mapSize.width = 512;
light1.shadow.mapSize.height = 512;
light1.shadow.camera.near = 0.1;
light1.shadow.camera.far = 1000.0;

lights.push(light1);




    //todo: define background
    let bg = new THREE.TextureLoader().load('../images/red day.jpg');

    const dim = 500;

 // Load the lava texture and bump map
const planeTexture = new THREE.TextureLoader().load('../textures/lava.jpg');
const planeBumpMap = new THREE.TextureLoader().load('../textures/lava_bump.jpg');

// Define the plane with the lava material
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(dim, dim, 10, 10),
    new THREE.MeshStandardMaterial({
        map: planeTexture,          // Set the texture as the material's map
        bumpMap: planeBumpMap,      // Set the bump map
        bumpScale: 0.5              // Set the bump scale
    })
);

plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;



    
    // Maze constants and functions
      const cellSize = 50;
      const rows = Math.floor(dim / cellSize);
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
          entryExitGround.position.set(x, 0.01, z);  // 0.01 to slightly offset it above the main ground
          entryExitGround.rotation.x = -Math.PI / 2;
          return entryExitGround;
      }


      const start = {x: -(dim/2) + cellSize / 2, z: -(dim/2) + cellSize / 2};
      const end = {x: (dim/2) - cellSize / 2, z: (dim/2) - cellSize / 2};


      function positionCollidesWithStartOrEnd(x, z, start, end) {
        return (x === start.x && z === start.z) || (x === end.x && z === end.z);
    }
    
    function placeRandomlavarock(objects) {
        const lavarock = createLavaRock();
    
        // Calculate random position inside the maze
        let x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
        let z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
    
        while (positionCollidesWithStartOrEnd(x, z, start, end)) {
            x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
            z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
        }
    
        lavarock.position.set(x, 0, z);
        objects.push(lavarock);
    }

     
    


      function drawMaze() {
          const wallTexture = new THREE.TextureLoader().load('../textures/lavawall.jpg');
          let mazeWalls = [];
          for (let i = 0; i < rows; i++) {
              for (let j = 0; j < cols; j++) {
                  const cell = grid[i][j];
                  const x = i * cellSize - (dim/2) + cellSize / 2;
                  const z = j * cellSize - (dim/2) + cellSize / 2;

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
          const startGround = drawEntryExitGround(-(dim/2) + cellSize / 2, -(dim/2) + cellSize / 2, 0x00FF00);  // Green for start
          const endGround = drawEntryExitGround((dim/2)- cellSize / 2, (dim/2) - cellSize / 2, 0xFF0000);    // Red for end

          mazeWalls.push(startGround);
          let  mazeObj=[]
          for(let i = 0; i < 20; i++) {
              placeRandomlavarock(mazeObj)
                  
                }
          
                mazeWalls.push(...mazeObj);
          
                    mazeWalls.push(endGround);
          

        
            
          
          
                    return mazeWalls;
                }
          

      


      generateMaze();
      const mazeObjects = drawMaze();

      let objects = [...mazeObjects];


          let startPosition = {x:-(dim/2) + cellSize / 2, y:0.01, z:-(dim/2) + cellSize / 2}

         
          let effect = null;


    let Level1 = new Level(lights, effect, bg, plane, objects, startPosition, 120);
    export default Level1;