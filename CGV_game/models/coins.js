import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function createCoin() {
    const coinGeometry = new THREE.CylinderGeometry(2.5, 2.5, 1.2, 32);
    
    // Randomly determine the coin type
    const coinTypes = ['speedBoost', 'timeIncrease'];
    const randomType = coinTypes[Math.floor(Math.random() * coinTypes.length)];

    let texturePath;
    switch (randomType) {
        case 'speedBoost':
            texturePath = "../textures/SB2.jpeg"; // replace with your speed boost coin texture path
            break;
        case 'timeIncrease':
            texturePath = "../textures/clock.png"; 
            break;
    }

    const coinTexture = new THREE.TextureLoader().load(texturePath);
    
    const coinMaterial = new THREE.MeshStandardMaterial({
        map: coinTexture,
        roughness: 0.1,
    });

    const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);
    coinMesh.rotation.z = Math.PI / 2;
    coinMesh.coinType = randomType; // Assign the coin type to the mesh for identification later

    const animateRotation = () => {
        coinMesh.rotation.y += 0.1;
        requestAnimationFrame(animateRotation);
    };

    animateRotation();

    return coinMesh;
}

export { createCoin };
