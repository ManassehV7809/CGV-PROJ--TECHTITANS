import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function createLavaRock() {
    // Black rock material
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black

    // Lava emissive materials
    const deepLavaMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B0000,  // Dark red
        emissive: 0x8B0000,
        emissiveIntensity: 1.5
    });

    const brightLavaMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF4500,  // Bright orange
        emissive: 0xFF4500,
        emissiveIntensity: 1.7
    });

    // Rock geometry
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);

    const lavaMaterials = [deepLavaMaterial, brightLavaMaterial];
    
    for (let i = 0; i < 5; i++) {  // Increased number of veins for more coverage
        const lavaGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2 * Math.random(), 0)), 20, 0.15 * Math.random(), 8, false);
        
        const vein = new THREE.Mesh(lavaGeometry, lavaMaterials[Math.floor(Math.random() * 2)]);  // Randomly pick one of the lava materials
        vein.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        vein.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        
        rock.add(vein);
    }

    // Light source
    const emittedLight = new THREE.PointLight(0xFF4500, 0.5, 3);
    rock.add(emittedLight);

    // Scale the rock
    rock.scale.set(5, 20 * Math.random(), 10 * Math.random());

    return rock;
}

export { createLavaRock };
