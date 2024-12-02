<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let stream: MediaStream | null = null;

const startVideo = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      void videoRef.value.play();
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

onMounted(async () => {
  try {
    await startVideo();
    requestAnimationFrame(drawToCanvas);
  } catch (error) {
    console.error("Error starting video:", error);
  }
});

onBeforeUnmount(() => {
  stopVideo();
});
</script>

<template>
  <div>
    <video ref="videoRef" style="display: none"></video>
    <canvas ref="canvasRef" width="640" height="480" style="border: 1px solid black"></canvas>
  </div>
</template>

<style scoped>
canvas {
  display: block;
  margin: 0 auto;
}
</style>
