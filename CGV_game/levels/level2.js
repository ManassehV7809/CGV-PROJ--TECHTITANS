import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import Level from "./level_setting.js";
import { createSnowman } from '../models/snowman';
import {  createLantern } from '../models/lantern.js';


//board dimension
const dim = 850 ;
  //todo: define lights
  let lights = [];

 // Add a directional light to simulate sunlight
const sunlight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
sunlight.intensity = 0.5;
sunlight.position.set(100, 100, 100);
sunlight.target.position.set(0, 0, 0);
sunlight.castShadow = true;
sunlight.shadow.mapSize.width = 500;
sunlight.shadow.mapSize.height = 500;
lights.push(sunlight);

// Decrease the intensity of the ambient light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
lights.push(ambientLight);

  // Increase the intensity of the point light and make it a blue color
  let moonlight = new THREE.PointLight(0x0000FF, 0.5);
  moonlight.intensity = 1.5;
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
    

    //todo: define background
    let bg = new THREE.TextureLoader().load('../images/space.jpg');

  

    //todo: define ground
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(dim, dim, 10, 10),
        new THREE.MeshStandardMaterial({


          }));

    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;

    const planeTexture = new THREE.TextureLoader().load('../textures/p.jpg');
    plane.material.map = planeTexture;

    //todo: define objects

    // let objects = [];
    //define wall
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 10),
        new THREE.MeshStandardMaterial({
            }));
    wall.position.set(0, 50, -50);
    wall.castShadow = true;
    wall.receiveShadow = true;

    //load texture
    // const wallTexture = new THREE.TextureLoader().load('../textures/brick_wall.jpg');
    // wall.material.map = wallTexture;

    // objects.push(wall);

    // objects.push(Ball);
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
    
    function placeRandomSnowman(objects) {
        const snowman = createSnowman();
    
        // Calculate random position inside the maze
        let x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
        let z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
    
        while (positionCollidesWithStartOrEnd(x, z, start, end)) {
            x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
            z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
        }
    
        snowman.position.set(x, 0, z);
        objects.push(snowman);
    }
    
    function placeRandomLanterns(objects) {
        const lantern = createLantern();


    
        // Calculate random position inside the maze
        let x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
        let z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
    
        while (positionCollidesWithStartOrEnd(x, z, start, end)) {
            x = Math.floor(Math.random() * rows) * cellSize - (dim/2) + cellSize / 2;
            z = Math.floor(Math.random() * cols) * cellSize - (dim/2) + cellSize / 2;
        }
    
        lantern.position.set(x, 0, z);
        
        const lanternLight = new THREE.PointLight(0xFFFF00, 1, 100);
        lanternLight.position.set(x, 5, z);  // Adjust the height (y value) as needed
        objects.push(lanternLight);
        objects.push(lantern);
    }
    
    


      function drawMaze() {
          const wallTexture = new THREE.TextureLoader().load('../textures/p.jpg');
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
          mazeWalls.push(endGround);

                    // Place random snowmen
                  let  mazeObj=[]
for(let i = 0; i < 25; i++) {
    placeRandomSnowman(mazeObj)
        
      }

      for(let i = 0; i < 100; i++) {
        placeRandomLanterns(mazeObj)
            
          }

      mazeWalls.push(...mazeObj);


          return mazeWalls;
      }


      generateMaze();
      const mazeObjects = drawMaze();

      let objects = [...mazeObjects];


          let startPosition = {x:-(dim/2) + cellSize / 2, y:0.01, z:-(dim/2) + cellSize / 2}

          let fog = new THREE.FogExp2(0xA7ADD0, 0.0009);
        
    let Level2 = new Level(lights,fog, bg, plane, objects, startPosition);
    export default Level2;