import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function createLavaRock() {
    const textureLoader = new THREE.TextureLoader();
    const rockTexture = textureLoader.load('../textures/lava texture.jpg'); 

    // Rock material with texture
    const rockMaterial = new THREE.MeshStandardMaterial({ 
        map: rockTexture  // Assign the loaded texture here
    });

    // Rock geometry
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);

    // Light source
    const emittedLight = new THREE.PointLight(0xFF4500, 0.5, 3);
    rock.add(emittedLight);

    // Scale the rock
    rock.scale.set(5, 20 * Math.random(), 10 * Math.random());

    return rock;
}

export { createLavaRock };
