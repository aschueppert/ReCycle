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
  requestAnimationFrame(drawToCanvas);
});

onBeforeUnmount(() => {
  stopVideo();
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
    <div class="camera-section">
      <div class="classify-section">
        <button @click="handleClassify">Classify</button>

        <div v-if="classificationResult" class="classification-result">
          <span class="result-icon">
            {{ classificationResult === "Recycle" ? "♻️" : "🗑️" }}
          </span>
          <span class="result-text">{{ classificationResult }}</span>
        </div>
      </div>
      <video ref="videoRef" style="display: none"></video>
      <canvas ref="canvasRef" width="640" height="480" style="border: 1px solid black"></canvas>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.camera-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.classify-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 15px;
}

.recycle-bg {
  background-color: lightgreen;
}
.trash-bg {
  background-color: lightcoral;
}

canvas {
  max-width: 100%;
  height: auto;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
}

.classification-result {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.result-recycle {
  background-color: rgba(50, 205, 50, 0.1); /* Very subtle green */
  color: #006400; /* Dark green text */
}

.result-trash {
  background-color: rgba(255, 99, 71, 0.1); /* Very subtle red */
  color: #8b0000; /* Dark red text */
}

.result-icon {
  margin-right: 10px;
  font-size: 24px;
}
</style>
