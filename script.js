import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { startTimer, createTimer, stopTimer, clearTimer } from "./js/timer.js";
import { checkCollision } from "./js/collision.js";

import {
  createScorePanel,
  updateScore,
  createToggleScoreButton,
  clearScore
} from "./js/score.js";
import { Bolinha } from "./js/bolinha.js";

createScorePanel(true); // Ativa o painel de pontuação
createToggleScoreButton(); // Cria o botão para alternar a visibilidade do score

let scene, camera, renderer, controls;
let plate,
  bolinhas = [],
  gravity = -0.005;
let plateRadius = 1.5;
let gameRunning = false;
let particleInterval;
let button; 

// Variáveis para controle de gravidade e velocidade
let gravityControl = -0.005;
let velocityControl = 0.8;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x008987);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
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
  createRestartButton(); 
  createGUI();
  createTimer();
  animate();
}

function createPlate() {
  plate = new THREE.Group();

  let plateGeometry = new THREE.CylinderGeometry(
    plateRadius,
    plateRadius,
    1,
    32,
    1,
    true
  );
  let plateMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  let plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);

  plate.add(plateMesh);
  plate.position.set(0, 0.3, 0); // Eleva o recipiente para que as bolinhas caiam nele
  scene.add(plate);

  // Adicionando o fundo ao recipiente
  let bottomGeometry = new THREE.CircleGeometry(plateRadius, 32); // Gera uma forma circular
  let bottomMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 }); // Material verde para o fundo
  let bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);

  bottomMesh.rotation.x = -Math.PI / 2; // Rotaciona para que o fundo fique na horizontal
  bottomMesh.position.y = 0; // Coloca o fundo no mesmo nível do chão

  plate.add(bottomMesh); // Adiciona o fundo ao grupo "plate"
}

function createParticle() {
  let novaBolinha = new Bolinha(Bolinha.getRandomType(0.1, 0.2));

  // Posição aleatória dentro do prato
  let x = (Math.random() - 0.5) * (plateRadius * 2);
  let z = (Math.random() - 0.5) * (plateRadius * 2);

  let particula = novaBolinha.getParticle();
  particula.position.set(x, 5, z); // Mantém a altura fixa para cair de cima
  particula.velocity = new THREE.Vector3(0, gravityControl, 0);

  scene.add(particula);
  bolinhas.push(novaBolinha);
}

function updateParticles() {
  if (!gameRunning) return; // Se o jogo estiver pausado, não atualiza as partículas

  for (let i = bolinhas.length - 1; i >= 0; i--) {
    let bolinhaIndex = bolinhas[i];
    let bolinhaParticula = bolinhaIndex.getParticle();

    bolinhaParticula.velocity.y += gravityControl;
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
          checkCollision(bolinhaIndex, plate, plateRadius);
          bolinhaParticula.captured = true;
          updateScore(bolinhaIndex.getScoreValue());
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
        bolinhaParticula.position.x =
          plate.position.x + normal.x * (plateRadius - 0.21);
        bolinhaParticula.position.z =
          plate.position.z + normal.z * (plateRadius - 0.21);
        bolinhaParticula.velocity.x *= -0.2; // Menos impacto na velocidade
        bolinhaParticula.velocity.z *= -0.2;
      } else {
        // Ajusta suavemente, mas só se estiver se afastando muito
        let targetX = plate.position.x;
        let targetZ = plate.position.z;

        let diffX = Math.abs(bolinhaParticula.position.x - targetX);
        let diffZ = Math.abs(bolinhaParticula.position.z - targetZ);

        if (diffX > 0.05 || diffZ > 0.05) {
          bolinhaParticula.position.x +=
            (targetX - bolinhaParticula.position.x) * 0.05;
          bolinhaParticula.position.z +=
            (targetZ - bolinhaParticula.position.z) * 0.05;
        }
      }
    }

    // Evitar sobreposição entre partículas
    for (let j = i + 1; j < bolinhas.length; j++) {
      let bolinhaIndex2 = bolinhas[j];
      let bolinhaParticula2 = bolinhaIndex2.getParticle();

      let dist = bolinhaParticula.position.distanceTo(
        bolinhaParticula2.position
      );
      if (dist < 0.2) {
        let direction = new THREE.Vector3()
          .subVectors(bolinhaParticula.position, bolinhaParticula2.position)
          .normalize();
        bolinhaParticula.position.addScaledVector(direction, 0.05);
        bolinhaParticula2.position.addScaledVector(direction, -0.05);
      }
    }
  }
}

function createGUI() {
  const gui = new GUI();

  // Ajustando a posição do painel de controle
  gui.domElement.style.position = "absolute";
  gui.domElement.style.top = "60px"; // Desloca o painel para baixo
  gui.domElement.style.right = "10px"; // Mantém o painel à direita

  // Controle de gravidade
  gui.add({ gravity: gravityControl }, "gravity", -0.1, 0).onChange((value) => {
    gravityControl = value;
  });

  // Controle de velocidade
  gui
    .add({ velocity: velocityControl }, "velocity", 0.1, 2)
    .onChange((value) => {
      velocityControl = value;
      particleInterval = setInterval(createParticle, 1000 / velocityControl);
    });
}

window.addEventListener("mousemove", (event) => {
  if (gameRunning && plate) {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    plate.position.x = x * 3;
  }
});

function createStartButton() {
  button = document.createElement("button");
  button.innerText = "Iniciar Jogo";
  button.style.position = "absolute";
  button.style.top = "10px";
  button.style.left = "10%";
  button.style.transform = "translateX(-50%)";
  button.style.padding = "10px 20px";
  button.style.fontSize = "16px";
  button.style.cursor = "pointer";
  document.body.appendChild(button);

  button.addEventListener("click", () => {
    if (!gameRunning) {
      gameRunning = true;
      particleInterval = setInterval(createParticle, 1000 / velocityControl); // Inicia o intervalo de partículas
      button.innerText = "Pausar Jogo"; 
      startTimer();
    } else {
      gameRunning = false;
      clearInterval(particleInterval); // Para a criação das partículas
      button.innerText = "Iniciar Jogo"; 
      stopTimer(); 
    }
  });
}

function restartGame() {
  for (let i = bolinhas.length - 1; i >= 0; i--) {
    let bolinhaParticula = bolinhas[i].getParticle();
    scene.remove(bolinhaParticula);
    bolinhas.splice(i, 1);
  }

  updateScore(0); 

  plate.position.set(0, 0.3, 0); 

  clearTimer(); 
  clearScore(); 

  if (gameRunning) {
    clearInterval(particleInterval); 
    gameRunning = false;
    button.innerText = "Iniciar Jogo"; 
    stopTimer(); 
  }
}

function createRestartButton() {
  let restartButton = document.createElement("button");
  restartButton.innerText = "Reiniciar Jogo";
  restartButton.style.position = "absolute";
  restartButton.style.top = "10px";
  restartButton.style.left = "70%";
  restartButton.style.transform = "translateX(-50%)";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "16px";
  restartButton.style.cursor = "pointer";
  document.body.appendChild(restartButton);

  restartButton.addEventListener("click", () => {
    restartGame();
  });
}

function animate() {
  requestAnimationFrame(animate);
  updateParticles();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
