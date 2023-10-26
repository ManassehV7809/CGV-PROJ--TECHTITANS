import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


function createCoin() {
    const coinGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1.2, 32);
  
    const coinTexture = new THREE.TextureLoader().load(
      "textures/coinTexture2.png"
    );
  
    const coinMaterial = new THREE.MeshStandardMaterial({
      map: coinTexture, // Apply the texture to the coin
      roughness: 0.1,
    });
  
  // Create the coin mesh
  const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);

  coinMesh.rotation.z = Math.PI / 2;

  const animateRotation = () => {
    // Rotate the coin around its X-axis
    coinMesh.rotation.y += 0.1; // Adjust the rotation speed as needed

    // Request the next animation frame
    requestAnimationFrame(animateRotation);
  };

  // Start the rotation animation
  animateRotation();

  return coinMesh;

  }
  export{createCoin}