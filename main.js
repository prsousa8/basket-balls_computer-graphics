import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let plate, particles = [], gravity = -0.01;

function init() {
    scene = new THREE.Scene();
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
    let groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    createPlate();
    animate();
}

function createPlate() {
    let outerGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    let innerGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32);
    
    let outerMesh = new THREE.Mesh(outerGeometry);
    let innerMesh = new THREE.Mesh(innerGeometry);
    innerMesh.position.y += 0.1;
    
    let plateMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    
    let plateCSG = new THREE.Group();
    plateCSG.add(outerMesh);
    innerMesh.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    plateCSG.add(innerMesh);
    
    plate = plateCSG;
    plate.position.set(0, 0.5, 0);
    scene.add(plate);
}

function createParticle() {
    let geometry = new THREE.SphereGeometry(0.1, 16, 16);
    let material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    let particle = new THREE.Mesh(geometry, material);
    particle.position.set((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3);
    particle.velocity = new THREE.Vector3(0, gravity, 0);
    scene.add(particle);
    particles.push(particle);
}

function updateParticles() {
    particles.forEach((p, index) => {
        p.position.add(p.velocity);
        if (p.position.y < 0) {
            scene.remove(p);
            particles.splice(index, 1);
        }
    });
}

window.addEventListener('mousemove', (event) => {
    if (plate) {
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        plate.position.x = x * 3;
    }
});

setInterval(createParticle, 1000);

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

