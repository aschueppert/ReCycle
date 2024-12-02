<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const classificationResult = ref<string | null>(null);
let stream: MediaStream | null = null;

const startVideo = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();
    }
  } catch (error) {
    console.error("Error accessing webcam:", error);
  }
};

const stopVideo = () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    stream = null;
  }
};

const drawToCanvas = () => {
  if (videoRef.value && canvasRef.value) {
    const context = canvasRef.value.getContext("2d");
    if (context) {
      // Adjust canvas to match video input while maintaining aspect ratio
      const videoAspectRatio = videoRef.value.videoWidth / videoRef.value.videoHeight;
      const containerWidth = canvasRef.value.parentElement?.clientWidth || window.innerWidth;

      canvasRef.value.width = containerWidth;
      canvasRef.value.height = containerWidth / videoAspectRatio;

      context.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height);
    }
    requestAnimationFrame(drawToCanvas);
  }
};

const classifyImage = (image: File): string => {
  return Math.random() > 0.5 ? "Recycle" : "Trash";
};

const handleClassify = () => {
  if (canvasRef.value) {
    canvasRef.value.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
          classificationResult.value = classifyImage(file);
        }
      },
      "image/jpeg",
      0.95,
    );
  }
};

onMounted(() => {
  void startVideo();
  window.addEventListener("resize", drawToCanvas);
  requestAnimationFrame(drawToCanvas);
});

onBeforeUnmount(() => {
  stopVideo();
  window.removeEventListener("resize", drawToCanvas);
});
</script>

<template>
  <div
    :class="{
      'recycle-bg': classificationResult === 'Recycle',
      'trash-bg': classificationResult === 'Trash',
    }"
    class="container"
  >
    <div class="classify-section">
      <button @click="handleClassify">Classify</button>

      <div
        v-if="classificationResult"
        class="classification-result"
        :class="{
          'result-recycle': classificationResult === 'Recycle',
          'result-trash': classificationResult === 'Trash',
        }"
      >
        <span class="result-icon">
          {{ classificationResult === "Recycle" ? "♻️" : "🗑️" }}
        </span>
        <span class="result-text">{{ classificationResult }}</span>
      </div>
    </div>

    <div class="camera-section">
      <video ref="videoRef" style="display: none"></video>
      <canvas ref="canvasRef" class="responsive-canvas" style="border: 1px solid black"></canvas>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  transition: background-color 0.3s ease;
  border-radius: 10px;
}

.classify-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.camera-section {
  width: 100%;
}

.responsive-canvas {
  width: 100%;
  height: auto;
}

.recycle-bg {
  background-color: #e6f3e6;
}

.trash-bg {
  background-color: #f3e6e6;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.classification-result {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.result-recycle {
  background-color: rgba(100, 255, 100, 0.2);
  color: darkgreen;
}

.result-trash {
  background-color: rgba(255, 100, 100, 0.2);
  color: darkred;
}

.result-icon {
  margin-right: 10px;
  font-size: 24px;
}
</style>
