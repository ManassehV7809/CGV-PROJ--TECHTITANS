import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

function createFlag() {
    const fabricMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Blue color for the flag fabric
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color for the flag pole

    // Create the flag pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 5, 32),
        poleMaterial
    );
    pole.position.y = 2.5;  // half of the height of the pole

    // Create the flag fabric
    const flagWidth = 4;
    const flagHeight = 2;
    const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, 50, 50);  // Width and height of the flag
    const flag = new THREE.Mesh(flagGeometry, fabricMaterial);
    flag.position.set(2, 4, 0);  // Adjust the flag's position to be on the pole

    // Variables for the flag's animation
    let time = 0;
    const speed = 0.1;
    const wavelength = 5;
    const amplitude = 0.5;

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

    const flagGroup = new THREE.Group();
    flagGroup.add(pole, flag);

    flagGroup.scale.set(3, 8, 3);

    return flagGroup;
}

export { createFlag };
