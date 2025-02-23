import * as THREE from "three";

const audioLoader = new THREE.AudioLoader();
const collisionSound = new THREE.Audio(new THREE.AudioListener());

audioLoader.load('assets/sound/bubble-pop-283674.mp3', function(buffer) {
    collisionSound.setBuffer(buffer);
    collisionSound.setVolume(0.5); 
});

function playCollisionSound() {
    if (collisionSound.isPlaying) {
        collisionSound.stop();
    }
    collisionSound.play();
}

export function checkCollision(bolinha, plate, plateRadius) {
    const bolinhaPosition = bolinha.getParticle().position;
    const platePosition = plate.position;

    const dx = bolinhaPosition.x - platePosition.x;
    const dz = bolinhaPosition.z - platePosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < plateRadius - 0.2 && bolinhaPosition.y <= 0.4) {
        if (!bolinha.getParticle().captured) {
            bolinha.getParticle().captured = true;
            playCollisionSound(); 
        }
    }
}