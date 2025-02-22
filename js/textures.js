import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

// Carregando texturas externas
const metalTexture = textureLoader.load("assets/textures/metal.png");
const woodTexture = textureLoader.load("assets/textures/wood.png");
const marbleTexture = textureLoader.load("assets/textures/marble.png");
const lavaTexture = textureLoader.load("assets/textures/lava.png");
const grassTexture = textureLoader.load("assets/textures/grass.png");
const iceTexture = textureLoader.load("assets/textures/ice.png");
const wallTexture = textureLoader.load("assets/textures/wall.png");
const carbonFiberTexture = textureLoader.load(
  "assets/textures/carbon_fiber.png"
);
const neonTexture = textureLoader.load(
  "assets/textures/painted-worn-asphalt.png"
);

// Criando materiais para as bolinhas
const materials = [
  new THREE.MeshStandardMaterial({
    map: grassTexture,
    roughness: 1,
    metalness: 0,
  }), // Grama
  new THREE.MeshStandardMaterial({
    map: iceTexture,
    transparent: true,
    opacity: 0.7,
    roughness: 0.2,
    metalness: 0.1,
  }), // Gelo
  new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.8 }), // Madeira
  new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.9 }), // Pedra
  new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.5 }), // Mármore
  new THREE.MeshStandardMaterial({
    map: metalTexture,
    metalness: 1,
    roughness: 0.3,
  }), // Metal
  new THREE.MeshStandardMaterial({
    map: carbonFiberTexture,
    metalness: 0.6,
    roughness: 0.2,
  }), // Fibra de carbono
  new THREE.MeshStandardMaterial({ map: lavaTexture, emissiveIntensity: 0.01 }), // Lava (brilhante)
  new THREE.MeshStandardMaterial({ map: neonTexture, emissiveIntensity: 1.2 }), // Neon brilhante
];

// Função que retorna o total de texturas
function getTotalTexturesNum() {
  return materials.length;
}

export { getTotalTexturesNum };

// Função que retorna um material especifico
function getIndexedMaterial(index) {
  return materials[index];
}

export { getIndexedMaterial };

// Função que retorna um material aleatório
function getRandomMaterial() {
  return materials[Math.floor(Math.random() * materials.length)];
}

export { getRandomMaterial };
