import * as THREE from 'three';
import { getIndexedMaterial } from './textures';
import { getTotalTexturesNum } from './textures';

class Bolinha {
    constructor(pointValue, venenosa = false) {
        let geometry = new THREE.SphereGeometry(0.1, 16, 16);

        // Define o material com base no tipo de bolinha
        let material;
        if (venenosa) {
            // Material específico para a bolinha venenosa (por exemplo, cor vermelha)
            material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
        } else {
            // Material normal para bolinhas comuns
            material = getIndexedMaterial(0);
            if (pointValue > 0 && pointValue <= getTotalTexturesNum()) {
                material = getIndexedMaterial(pointValue - 1);
            }
        }

        this.particle = new THREE.Mesh(geometry, material);
        this.scoreValue = pointValue;
        this.venenosa = venenosa;
    }

    getParticle() {
        return this.particle;
    }

    getScoreValue() {
        // Se a bolinha for venenosa, retorna -10 pontos
        if (this.venenosa) {
            return -10;
        }
        return this.scoreValue;
    }

    isVenenosa() {
        return this.venenosa;
    }

    static getMaxPoints() {
        return getTotalTexturesNum();
    }
}

export { Bolinha };