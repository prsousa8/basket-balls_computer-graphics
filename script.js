import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createScorePanel, updateScore, createToggleScoreButton } from './js/score.js';
import { Bolinha } from './js/bolinha.js';

createScorePanel(true); // Ativa o painel de pontuação
createToggleScoreButton(); // Cria o botão para alternar a visibilidade do score

let scene, camera, renderer, controls;
let plate, bolinhas = [], gravity = -0.005;
let plateRadius = 1.5;
let gameRunning = false;
let particleInterval;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x008987);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);
    
    let groundGeometry = new THREE.PlaneGeometry(10, 10);
    let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x008978 });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    createPlate();
    createStartButton();
    animate();
}

function createPlate() {
    plate = new THREE.Group();
    
    let plateGeometry = new THREE.CylinderGeometry(plateRadius, plateRadius, 1, 32, 1, true);
    let plateMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    let plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
    
    plate.add(plateMesh);
    plate.position.set(0, 0.3, 0);  // Eleva o recipiente para que as bolinhas caiam nele
    scene.add(plate);

    // Adicionando o fundo ao recipiente
    let bottomGeometry = new THREE.CircleGeometry(plateRadius, 32); // Gera uma forma circular
    let bottomMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 }); // Material verde para o fundo
    let bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    
    bottomMesh.rotation.x = -Math.PI / 2;  // Rotaciona para que o fundo fique na horizontal
    bottomMesh.position.y = 0;  // Coloca o fundo no mesmo nível do chão

    plate.add(bottomMesh); // Adiciona o fundo ao grupo "plate"
}
function createParticle() {
    //let pontuacaoAleatoria;

    /* esse código é desnecessário
    if (isVenenosa) {
        pontuacaoAleatoria = 0; // Bolinha venenosa tem valor 0 (ou qualquer outro valor que você queira)
    } else {
        pontuacaoAleatoria = Math.ceil(Math.random() * Bolinha.getMaxPoints()); // Bolinha normal
    }
    */

    let isVenenosa = Math.random() < 0.1; // 10% de chance de ser venenosa
    let novaBolinha = new Bolinha(Bolinha.getRandomType(), isVenenosa);

    // Posição aleatória dentro do prato
    let x = (Math.random() - 0.5) * (plateRadius * 2);
    let z = (Math.random() - 0.5) * (plateRadius * 2);

    let particula = novaBolinha.getParticle();
    particula.position.set(x, 5, z); // Mantém a altura fixa para cair de cima
    particula.velocity = new THREE.Vector3(0, gravity, 0);

    scene.add(particula);
    bolinhas.push(novaBolinha);
}
function updateParticles() {
    for (let i = bolinhas.length - 1; i >= 0; i--) {
        let bolinhaIndex = bolinhas[i];
        let bolinhaParticula = bolinhaIndex.getParticle();

        bolinhaParticula.velocity.y += gravity;
        bolinhaParticula.position.add(bolinhaParticula.velocity);

        // Quando a bolinha atinge o chão do prato
        if (bolinhaParticula.position.y <= 0.4) {
            bolinhaParticula.velocity.y *= -0.2; // Rebote menor para evitar vibração
            bolinhaParticula.position.y = 0.4;

            let dx = bolinhaParticula.position.x - plate.position.x;
            let dz = bolinhaParticula.position.z - plate.position.z;
            let distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > plateRadius - 0.2) {
                // Se caiu fora do prato, remove a bolinha
                scene.remove(bolinhaParticula);
                bolinhas.splice(i, 1);
                continue;
            } else {
                if (!bolinhaParticula.captured) {
                    bolinhaParticula.captured = true;

                    updateScore(bolinhaIndex.getScoreValue());

                    /* essa parte do código é desnecessária
                    // Verifica se a bolinha é venenosa
                    if (bolinhaIndex.isVenenosa()) {
                        updateScore(-5); // Tira 10 pontos se for venenosa
                    } else {
                        updateScore(1); // Adiciona pontos normais
                    }
                    */
                }
            }
        }

    
        // Só corrige a posição se realmente estiver saindo do prato
        if (bolinhaParticula.captured) {
            let dx = bolinhaParticula.position.x - plate.position.x;
            let dz = bolinhaParticula.position.z - plate.position.z;
            let distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > plateRadius - 0.2) {
                let normal = new THREE.Vector3(dx, 0, dz).normalize();
                bolinhaParticula.position.x = plate.position.x + normal.x * (plateRadius - 0.21);
                bolinhaParticula.position.z = plate.position.z + normal.z * (plateRadius - 0.21);
                bolinhaParticula.velocity.x *= -0.2; // Menos impacto na velocidade
                bolinhaParticula.velocity.z *= -0.2;
            } else {
                // Ajusta suavemente, mas só se estiver se afastando muito
                let targetX = plate.position.x;
                let targetZ = plate.position.z;

                let diffX = Math.abs(bolinhaParticula.position.x - targetX);
                let diffZ = Math.abs(bolinhaParticula.position.z - targetZ);

                if (diffX > 0.05 || diffZ > 0.05) { 
                    bolinhaParticula.position.x += (targetX - bolinhaParticula.position.x) * 0.05;
                    bolinhaParticula.position.z += (targetZ - bolinhaParticula.position.z) * 0.05;
                }
            }
        }

        // Evitar sobreposição entre partículas
        for (let j = i + 1; j < bolinhas.length; j++) {
            let bolinhaIndex2 = bolinhas[j];
            let bolinhaParticula2 = bolinhaIndex2.getParticle();

            // let p2 = bolinhas[j];

            let dist = bolinhaParticula.position.distanceTo(bolinhaParticula2.position);
            if (dist < 0.2) {
                let direction = new THREE.Vector3().subVectors(bolinhaParticula.position, bolinhaParticula2.position).normalize();
                bolinhaParticula.position.addScaledVector(direction, 0.05);
                bolinhaParticula2.position.addScaledVector(direction, -0.05);
            }
        }
    }
}

window.addEventListener('mousemove', (event) => {
    if (gameRunning && plate) {
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        plate.position.x = x * 3;
    }
});

function createStartButton() {
    let button = document.createElement('button');
    button.innerText = 'Iniciar Jogo';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10%';
    button.style.transform = 'translateX(-50%)';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            particleInterval = setInterval(createParticle, 800); // Inicia o intervalo de partículas
            button.innerText = 'Pausar Jogo'; // Atualiza o text do botão
        } else {
            gameRunning = false;
            clearInterval(particleInterval); // Para a criação das partículas
            button.innerText = 'Iniciar Jogo'; // Restaura o texto do botão
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateParticles();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
