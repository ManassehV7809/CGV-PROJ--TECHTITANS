import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {exp} from "three/nodes";

function createCoin(position) {
    const coinGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1.2, 32);

    const coinTexture = new THREE.TextureLoader().load(
      "textures/coinTexture.png"
    );

    const coinMaterial = new THREE.MeshStandardMaterial({
      map: coinTexture, // Apply the texture to the coin
      roughness: 0.1,
    });

    // Create the coin mesh
    const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);

    coinMesh.rotation.z = Math.PI/2;

    // Set the initial position of the coin
    coinMesh.position.copy(position);

    // Add a property to track whether the coin is collected
    coinMesh.isCollected = false;

    const animateRotation =  () =>{

      coinMesh.rotation.y += 0.1;

      requestAnimationFrame(animateRotation);
    }

    animateRotation();

    return coinMesh;
  }

let createFlagWithStick = (
    position,
  ) => {
    let flagColor = 0x00ff00;
    let stickColor =0x8B4513;
    let flagWidth =10;
    let flagHeight =20;
    let stickHeight =20;
    let wavelength =5;
    let amplitude =1;
    let speed =0.4;

    const group = new THREE.Group();

    // Create the stick
    const stickGeometry = new THREE.CylinderGeometry(0.5, 0.5, stickHeight, 32);
    const stickMaterial = new THREE.MeshStandardMaterial({ color: stickColor });
    const stickMesh = new THREE.Mesh(stickGeometry, stickMaterial);
    stickMesh.position.copy(position);


    // Create the flag
    const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, 50, 50);

    // Define a time variable to control the animation
    let time = 0;

    const flagTexture=new THREE.TextureLoader().load("textures/flag.png");

    // Create a flag material with the specified color
    const flagMaterial = new THREE.MeshStandardMaterial({
      map:flagTexture,
      side: THREE.DoubleSide,
    });

    const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);
    flagMesh.position.set(
      position.x - flagWidth / 2,  // Adjust the flag's position to align with the stick
      position.y + stickHeight / 2 + flagHeight / 2,
      position.z
    );

    // Update the flag's vertices to create a waving effect
    flagGeometry.vertices.forEach((vertex, index) => {
      const x = vertex.x - flagWidth / 2;
      const y =
        Math.sin(
          (x / flagWidth) * (2 * Math.PI * (wavelength / flagWidth) - time)
        ) * amplitude;
      vertex.z = y;
    });

    // Create an animation loop to update the flag's vertices over time
    const animateFlag = () => {
      time += speed; // Increase time to create animation
      flagGeometry.vertices.forEach((vertex, index) => {
        const x = vertex.x - flagWidth / 2;
        const y =
          Math.sin(
            (x / flagWidth) * (2 * Math.PI * (wavelength / flagWidth) - time)
          ) * amplitude;
        vertex.z = y;
      });
      flagGeometry.verticesNeedUpdate = true; // Notify Three.js to update the vertices
      requestAnimationFrame(animateFlag);
    };

    animateFlag(); // Start the animation loop

    // Add the stick and flag to the group
    group.add(stickMesh);
    group.add(flagMesh);

    return group;
  }

  export {createCoin, createFlagWithStick};
