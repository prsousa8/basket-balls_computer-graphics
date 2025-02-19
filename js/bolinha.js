import * as THREE from 'three';
import { getIndexedMaterial } from './textures';
import { getTotalTexturesNum } from './textures';

class Bolinha {
    constructor(pointValue) {
        let geometry = new THREE.SphereGeometry(0.1, 16, 16);
        let material = getIndexedMaterial(0);
        if (pointValue > 0 && pointValue <= getTotalTexturesNum())
            material = getIndexedMaterial(pointValue - 1);

        this.particle = new THREE.Mesh(geometry, material);
        this.scoreValue = pointValue;
    }    
}

export { Bolinha }