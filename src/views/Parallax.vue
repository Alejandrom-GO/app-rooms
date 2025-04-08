<template>
    <div class="parallax-container">
        <div class="parallax-card" ref="cardRef">
            <!-- Fondo con gradiente -->
            <div class="parallax-bg"></div>
            
            <!-- Capas con diferentes profundidades -->
            <div class="parallax-layer layer-back">
                <img src="/images/placeholder.svg?height=200&width=300" alt="Fondo" class="w-full h-full object-cover" />
            </div>
            
            <div class="parallax-layer layer-middle">
                <div class="text-center p-4">
                    <h2 class="text-2xl font-bold text-white">Efecto Parallax</h2>
                    <p class="text-white">Mueve el cursor sobre esta tarjeta</p>
                </div>
            </div>
            
            <div class="parallax-layer layer-front">
                <div class="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg">
                    Detalles
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const cardRef = ref(null);
let isHovered = false;
let mouseX = 0;
let mouseY = 0;
let cardRect = null;

// Función para manejar el movimiento del mouse
const handleMouseMove = (e) => {
    if (!isHovered || !cardRef.value) return;
    
    // Obtener la posición del mouse relativa a la tarjeta
    const rect = cardRef.value.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Calcular el centro de la tarjeta
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calcular el desplazamiento relativo al centro (normalizado entre -1 y 1)
    const offsetX = (mouseX - centerX) / centerX;
    const offsetY = (mouseY - centerY) / centerY;
    
    // Aplicar transformaciones a las capas
    const backLayer = cardRef.value.querySelector('.layer-back');
    const middleLayer = cardRef.value.querySelector('.layer-middle');
    const frontLayer = cardRef.value.querySelector('.layer-front');
    
    if (backLayer) {
        backLayer.style.transform = `translate(${offsetX * 15}px, ${offsetY * 15}px)`;
    }
    
    if (middleLayer) {
        middleLayer.style.transform = `translate(${offsetX * 5}px, ${offsetY * 5}px)`;
    }
    
    if (frontLayer) {
        frontLayer.style.transform = `translate(${offsetX * -5}px, ${offsetY * -5}px)`;
    }
    
    // Aplicar rotación a la tarjeta
    cardRef.value.style.transform = `perspective(1000px) rotateX(${offsetY * -5}deg) rotateY(${offsetX * 5}deg)`;
};

// Función para manejar cuando el mouse entra en la tarjeta
const handleMouseEnter = () => {
    isHovered = true;
    if (cardRef.value) {
        cardRef.value.classList.add('hovered');
    }
};

// Función para manejar cuando el mouse sale de la tarjeta
const handleMouseLeave = () => {
    isHovered = false;
    if (cardRef.value) {
        cardRef.value.classList.remove('hovered');
        
        // Restaurar las posiciones originales
        const backLayer = cardRef.value.querySelector('.layer-back');
        const middleLayer = cardRef.value.querySelector('.layer-middle');
        const frontLayer = cardRef.value.querySelector('.layer-front');
        
        if (backLayer) backLayer.style.transform = '';
        if (middleLayer) middleLayer.style.transform = '';
        if (frontLayer) frontLayer.style.transform = '';
        
        cardRef.value.style.transform = '';
    }
};

onMounted(() => {
    if (cardRef.value) {
        cardRef.value.addEventListener('mousemove', handleMouseMove);
        cardRef.value.addEventListener('mouseenter', handleMouseEnter);
        cardRef.value.addEventListener('mouseleave', handleMouseLeave);
    }
});

onUnmounted(() => {
    if (cardRef.value) {
        cardRef.value.removeEventListener('mousemove', handleMouseMove);
        cardRef.value.removeEventListener('mouseenter', handleMouseEnter);
        cardRef.value.removeEventListener('mouseleave', handleMouseLeave);
    }
});
</script>

<style>
.parallax-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 20px;
}

.parallax-card {
    width: 320px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.parallax-card.hovered {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.parallax-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}

.parallax-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}

.layer-back {
    z-index: 1;
}

.layer-middle {
    z-index: 2;
}

.layer-front {
    z-index: 3;
}
</style>