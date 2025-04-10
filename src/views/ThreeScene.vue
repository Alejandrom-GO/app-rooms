<template>
<AppLayout>
  <div class="three-container">
    <div ref="container" class="three-canvas"></div>
    <div class="controls">
      <button @click="toggleRotation" class="control-btn">
        {{ isRotating ? 'Detener Rotación' : 'Iniciar Rotación' }}
      </button>
      <button @click="toggleLights" class="control-btn">
        {{ lightsOn ? 'Apagar Luces' : 'Encender Luces' }}
      </button>
      <button @click="changeView" class="control-btn">
        Cambiar Vista
      </button>
    </div>
  </div>
</AppLayout>
</template>

<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

// Referencias
const container = ref(null);
const isRotating = ref(true);
const lightsOn = ref(true);

// Variables para Three.js
let scene, camera, renderer, room;
let animationFrameId;
let currentView = 0;
const views = [
  { position: new THREE.Vector3(0, 3, 7.2), target: new THREE.Vector3(0, 3.5, 0) },
  { position: new THREE.Vector3(7.2, 3, 0), target: new THREE.Vector3(0, 3.5, 0) },
  { position: new THREE.Vector3(0, 5.4, 0), target: new THREE.Vector3(0, 0, 0) }
];

// Inicializar la escena Three.js
const initThree = () => {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Crear cámara
  const aspect = container.value.clientWidth / container.value.clientHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.copy(views[currentView].position);
  camera.lookAt(views[currentView].target);

  // Crear renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.shadowMap.enabled = true;
  container.value.appendChild(renderer.domElement);

  // Crear habitación
  createRoom();

  // Añadir luces
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const ceilingLight = new THREE.PointLight(0xffffff, 1, 10);
  ceilingLight.position.set(0, 2.9, 0);
  ceilingLight.castShadow = true;
  ceilingLight.shadow.mapSize.width = 1024;
  ceilingLight.shadow.mapSize.height = 1024;
  scene.add(ceilingLight);

  const bedsideLight1 = new THREE.PointLight(0xffcc99, 0.5, 5);
  bedsideLight1.position.set(-1.5, 0.5, 1.5);
  scene.add(bedsideLight1);

  const bedsideLight2 = new THREE.PointLight(0xffcc99, 0.5, 5);
  bedsideLight2.position.set(1.5, 0.5, 1.5);
  scene.add(bedsideLight2);

  // Manejar redimensionamiento de ventana
  window.addEventListener('resize', onWindowResize);
};

// Función para crear la habitación
const createRoom = () => {
  // Dimensiones de la habitación
  const width = 4;
  const height = 3;
  const depth = 4;

  // Materiales
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
  const ceilingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const furnitureMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
  const bedMaterial = new THREE.MeshPhongMaterial({ color: 0x4a90e2 });
  const pillowMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

  // Pared trasera
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    wallMaterial
  );
  backWall.position.z = -depth / 2;
  backWall.position.y = height / 2 + 2;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Pared izquierda
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    wallMaterial
  );
  leftWall.position.x = -width / 2;
  leftWall.position.y = height / 2 + 2;
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Pared derecha
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    wallMaterial
  );
  rightWall.position.x = width / 2;
  rightWall.position.y = height / 2 + 2;
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  scene.add(rightWall);

  // Suelo
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    floorMaterial
  );
  floor.position.y = 2;
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Techo
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    ceilingMaterial
  );
  ceiling.position.y = height + 2;
  ceiling.rotation.x = Math.PI / 2;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Cama
  const bedFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 3),
    furnitureMaterial
  );
  bedFrame.position.set(0, 2.25, -0.5);
  bedFrame.castShadow = true;
  bedFrame.receiveShadow = true;
  scene.add(bedFrame);

  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.2, 2.9),
    bedMaterial
  );
  mattress.position.set(0, 2.6, -0.5);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  scene.add(mattress);

  // Almohadas
  const pillow1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.1, 0.4),
    pillowMaterial
  );
  pillow1.position.set(-0.5, 2.75, -1);
  pillow1.castShadow = true;
  scene.add(pillow1);

  const pillow2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.1, 0.4),
    pillowMaterial
  );
  pillow2.position.set(0.5, 2.75, -1);
  pillow2.castShadow = true;
  scene.add(pillow2);

  // Mesita de noche
  const nightstand1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    furnitureMaterial
  );
  nightstand1.position.set(-1.2, 2.25, -0.5);
  nightstand1.castShadow = true;
  nightstand1.receiveShadow = true;
  scene.add(nightstand1);

  const nightstand2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    furnitureMaterial
  );
  nightstand2.position.set(1.2, 2.25, -0.5);
  nightstand2.castShadow = true;
  nightstand2.receiveShadow = true;
  scene.add(nightstand2);

  // Armario
  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 0.5),
    furnitureMaterial
  );
  wardrobe.position.set(0, 3, 1.7);
  wardrobe.castShadow = true;
  wardrobe.receiveShadow = true;
  scene.add(wardrobe);

  // Ventana
  const windowFrame = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshPhongMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 })
  );
  windowFrame.position.set(0, 3.5, -depth / 2 + 0.01);
  scene.add(windowFrame);

  // Guardar referencia a la habitación para animaciones
  room = scene;
};

// Función para manejar el redimensionamiento de la ventana
const onWindowResize = () => {
  if (!container.value) return;
  
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

// Función de animación
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  if (isRotating.value && room) {
    // Rotar ligeramente la cámara alrededor de la habitación
    const time = Date.now() * 0.0005;
    const radius = 7.2; // Reducido de 8 a 7.2 (10% más cerca)
    const x = Math.sin(time) * radius;
    const z = Math.cos(time) * radius;
    
    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt(0, 3.5, 0);
  }
  
  renderer.render(scene, camera);
};

// Función para alternar la rotación
const toggleRotation = () => {
  isRotating.value = !isRotating.value;
};

// Función para alternar las luces
const toggleLights = () => {
  lightsOn.value = !lightsOn.value;
  
  // Encontrar todas las luces en la escena
  scene.traverse((object) => {
    if (object instanceof THREE.PointLight || object instanceof THREE.AmbientLight) {
      object.intensity = lightsOn.value ? 1 : 0;
    }
  });
};

// Función para cambiar la vista
const changeView = () => {
  currentView = (currentView + 1) % views.length;
  
  // Animar la transición de la cámara
  const targetPosition = views[currentView].position;
  const targetLookAt = views[currentView].target;
  
  // Usar GSAP o una animación simple
  const duration = 1000; // ms
  const startTime = Date.now();
  const startPosition = camera.position.clone();
  const startLookAt = new THREE.Vector3();
  camera.getWorldDirection(startLookAt);
  startLookAt.multiplyScalar(5).add(camera.position);
  
  const animateCamera = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Interpolación lineal
    camera.position.lerpVectors(startPosition, targetPosition, progress);
    
    const currentLookAt = new THREE.Vector3();
    currentLookAt.lerpVectors(startLookAt, targetLookAt, progress);
    camera.lookAt(currentLookAt);
    
    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      camera.lookAt(targetLookAt);
    }
  };
  
  animateCamera();
};

// Inicializar cuando el componente se monta
onMounted(() => {
  initThree();
  animate();
});

// Limpiar cuando el componente se desmonta
onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationFrameId);
  
  if (renderer) {
    renderer.dispose();
  }
  
  if (container.value && renderer.domElement) {
    container.value.removeChild(renderer.domElement);
  }
});
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #ffffff;
  position: relative;
  padding-top: 0;
}

.three-canvas {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.controls {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  background-color: #4a5568;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background-color: #2d3748;
}
</style> 