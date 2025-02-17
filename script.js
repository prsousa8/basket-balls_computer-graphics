import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createScorePanel, updateScore, createToggleScoreButton } from './js/score.js';
import { getRandomMaterial } from './js/textures.js';


createScorePanel(true); // Ativa o painel de pontuação
createToggleScoreButton(); // Cria o botão para alternar a visibilidade do score

let scene, camera, renderer, controls;
let plate, particles = [], gravity = -0.005;
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
    let geometry = new THREE.SphereGeometry(0.1, 16, 16);
    // let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let material = getRandomMaterial(); // Usa a função do módulo
    let particle = new THREE.Mesh(geometry, material);

    // Posição aleatória **fixa** dentro de um intervalo no eixo X e Z
    let spawnRadius = plateRadius * 0.8;
    let x = (Math.random() - 0.5) * (plateRadius * 2); // Garante que caia dentro de uma área fixa
    let z = (Math.random() - 0.5) * (plateRadius * 2); 

    particle.position.set(x, 5, z); // Mantém a altura fixa para cair de cima
    particle.velocity = new THREE.Vector3(0, gravity, 0);
    
    scene.add(particle);
    particles.push(particle);
}


function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        p.velocity.y += gravity;
        p.position.add(p.velocity);

        // Quando a bolinha atinge o chão do prato
        if (p.position.y <= 0.4) {
            p.velocity.y *= -0.2; // Rebote menor para evitar vibração
            p.position.y = 0.4;

            let dx = p.position.x - plate.position.x;
            let dz = p.position.z - plate.position.z;
            let distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > plateRadius - 0.2) {
                // Se caiu fora do prato, remove a bolinha
                scene.remove(p);
                particles.splice(i, 1);
                continue;
            } else {
                if (!p.captured) {
                    p.captured = true;
                    updateScore(1);
                }
            }
        }

        // Só corrige a posição se realmente estiver saindo do prato
        if (p.captured) {
            let dx = p.position.x - plate.position.x;
            let dz = p.position.z - plate.position.z;
            let distance = Math.sqrt(dx * dx + dz * dz);

            if (distance > plateRadius - 0.2) {
                let normal = new THREE.Vector3(dx, 0, dz).normalize();
                p.position.x = plate.position.x + normal.x * (plateRadius - 0.21);
                p.position.z = plate.position.z + normal.z * (plateRadius - 0.21);
                p.velocity.x *= -0.2; // Menos impacto na velocidade
                p.velocity.z *= -0.2;
            } else {
                // Ajusta suavemente, mas só se estiver se afastando muito
                let targetX = plate.position.x;
                let targetZ = plate.position.z;

                let diffX = Math.abs(p.position.x - targetX);
                let diffZ = Math.abs(p.position.z - targetZ);

                if (diffX > 0.05 || diffZ > 0.05) { 
                    p.position.x += (targetX - p.position.x) * 0.05;
                    p.position.z += (targetZ - p.position.z) * 0.05;
                }
            }
        }

        // Evitar sobreposição entre partículas
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dist = p.position.distanceTo(p2.position);
            if (dist < 0.2) {
                let direction = new THREE.Vector3().subVectors(p.position, p2.position).normalize();
                p.position.addScaledVector(direction, 0.05);
                p2.position.addScaledVector(direction, -0.05);
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
            button.innerText = 'Pausar Jogo'; // Atualiza o texto do botão
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
