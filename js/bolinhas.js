import * as THREE from 'three';
import { getTypeMaterial } from './textures.js';

class Bolinha {
    constructor(type) {
        let geometry = new THREE.SphereGeometry(0.1, 16, 16);
        let material = getTypeMaterial(type);
        this.particle = new THREE.Mesh(geometry, material);
        this.captured = false;
        if (type > 0)
            this.points = type;
        else
            this.points = 1;
    }
}

export {Bolinha};