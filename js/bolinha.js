import * as THREE from 'three';
import { getIndexedMaterial, getRandomMaterial } from './textures';
import { getTotalTexturesNum } from './textures';
import { rand } from 'three/tsl';

class Bolinha {
    constructor(type) {
        let geometry = new THREE.SphereGeometry(0.1, 16, 16);

        // Define o material com base no tipo de bolinha
        let material;
        switch (type) {
            case 1:
                material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
                this.scoreValue = -5;
                break;
            case 3:
                material = new THREE.MeshBasicMaterial({ color: 0xff00 }); // Verde
                this.scoreValue = 10;
                break;        
            default:
                material = getRandomMaterial(); // material basico de textura aleatoria
                this.scoreValue = 1;
                break;
        }

        /* código legacy
        if (venenosa) {
            // Material específico para a bolinha venenosa (por exemplo, cor vermelha)
            material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
            this.scoreValue = -5;
        } else {
            // Material normal para bolinhas comuns
            material = getIndexedMaterial(0);
            if (type > 0 && type <= getTotalTexturesNum()) {
                material = getIndexedMaterial(type - 1);
            }
            this.scoreValue = type;
        }
        */

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

    static getRandomType(chance_venenosa, chance_especial) {
        let n = Math.random();
        if (n < chance_venenosa) {
            return 1;
        } else if (n > 1 - chance_especial) {
            return 3;
        } else {
            return 2;
        }
    }
}

export { Bolinha };