import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    plate.position.set(0, 0.3, 0);
    scene.add(plate);
}

function createParticle() {
    let geometry = new THREE.SphereGeometry(0.1, 16, 16);
    let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let particle = new THREE.Mesh(geometry, material);
    particle.position.set((Math.random() - 0.5) * 3, 5, (Math.random() - 0.5) * 3);
    particle.velocity = new THREE.Vector3(0, gravity, 0);
    scene.add(particle);
    particles.push(particle);
}

function updateParticles() {
    particles.forEach((p, index) => {
        p.velocity.y += gravity; 
        p.position.add(p.velocity);
        
        // Colisão com o chão
        if (p.position.y <= 0) {
            scene.remove(p);
            particles.splice(index, 1);
        }

        // Colisão com a cesta
        let dx = p.position.x - plate.position.x;
        let dz = p.position.z - plate.position.z;
        let distance = Math.sqrt(dx * dx + dz * dz);
        
        if (p.position.y <= 0.4 && distance < plateRadius - 0.2) {
            p.velocity.y *= -0.5; // Rebote
            p.position.y = 0.4;
            plate.add(p); // Adiciona a partícula como filha da cesta para mover junto
        }
    });
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
    button.style.left = '50%';
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
