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
    <video ref="videoRef" style="display: none"></video>
    <canvas ref="canvasRef" width="640" height="480" style="border: 1px solid black"></canvas>
    <div style="margin-top: 10px; text-align: center">
      <button @click="handleClassify">Classify</button>
    </div>
    <div v-if="classificationResult" style="margin-top: 20px; text-align: center">
      <h3>Classification Result:</h3>
      <p>{{ classificationResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}

.recycle-bg {
  background-color: #5cbf76; /* Light green */
}

.trash-bg {
  background-color: #d98282; /* Light red */
}

canvas {
  display: block;
  margin: 0 auto;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

h3 {
  margin-bottom: 5px;
}
</style>
