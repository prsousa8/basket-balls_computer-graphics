import * as THREE from 'three';
import { getIndexedMaterial } from './textures';
import { getTotalTexturesNum } from './textures';

class Bolinha {
    constructor(pointValue, venenosa = false) {
        this.venenosa = venenosa;
        let geometry = new THREE.SphereGeometry(0.1, 16, 16);

        // Define o material com base no tipo de bolinha
        let material;
        if (venenosa) {
            // Material específico para a bolinha venenosa (por exemplo, cor vermelha)
            material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
            this.scoreValue = -5;
        } else {
            // Material normal para bolinhas comuns
            material = getIndexedMaterial(0);
            if (pointValue > 0 && pointValue <= getTotalTexturesNum()) {
                material = getIndexedMaterial(pointValue - 1);
            }
            this.scoreValue = pointValue;
        }

        this.particle = new THREE.Mesh(geometry, material);
    }

    getParticle() {
        return this.particle;
    }

    getScoreValue() {
        /* essa parte do código é desnecessária
        // Se a bolinha for venenosa, retorna -10 pontos
        if (this.venenosa) {
            return -10;
        }
        */
        return this.scoreValue;
    }

    isVenenosa() {
        return this.venenosa;
    }

    static getMaxPoints() {
        return getTotalTexturesNum();
    }

    static getRandomType() {
        return Math.ceil(Math.random() * Bolinha.getMaxPoints());
    }
}

export { Bolinha };