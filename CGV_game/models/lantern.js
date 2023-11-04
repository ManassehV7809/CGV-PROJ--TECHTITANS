import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function createLantern() {
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // A gray color for metal
    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 2 });


    

    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
        metalMaterial
    );

    // Light inside
    const lightBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        lightMaterial
    );
    lightBulb.position.y = 0.5;

    // Emitting light from the light bulb
    const emittedLight = new THREE.PointLight(0x00FFFF, 5, 12);  // tEAL color, intensity of 2, and distance of 10 units
    emittedLight.position.copy(lightBulb.position);
    emittedLight.castShadow = true;

    // Handle
    const handleGeometry = new THREE.TorusGeometry(0.7, 0.1, 16, 100, Math.PI);
    const handle = new THREE.Mesh(handleGeometry, metalMaterial);
    handle.rotation.x = Math.PI / 2;
    handle.position.y = 1.5;

    const lantern = new THREE.Group();
    lantern.add(base, lightBulb, handle, emittedLight); // Include the emittedLight in the lantern group

    // Scale the lantern 3x in all directions
    lantern.scale.set(3, 5, 3);

    return lantern;
}
export {createLantern}