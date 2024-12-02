<script setup lang="ts">
import axios from "axios";
import { onBeforeUnmount, onMounted, ref } from "vue";

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const classificationResult = ref<string | null>(null);
const isClassifying = ref(false);
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

const classifyImage = async (image: File): Promise<string> => {
  try {
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(image);
    });

    const base64Data = base64Image.split(",")[1];

    const response = await axios.post("https://classify.roboflow.com/recycling-xqwwn/1", base64Data, {
      params: {
        api_key: "7kErDwvYPZAVUblhm8Ta",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const predictedClass = response.data?.predictions?.[0]?.class || "other";
    return predictedClass.toLowerCase() === "other" ? "Trash" : "Recycle";
  } catch (error) {
    console.error("Error classifying image: ", error);
    return "Trash";
  }
};

const handleClassify = () => {
  if (canvasRef.value) {
    isClassifying.value = true;
    classificationResult.value = null;

    canvasRef.value.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        void classifyImage(file)
          .then((result) => {
            classificationResult.value = result;
            isClassifying.value = false;
          })
          .catch(() => {
            isClassifying.value = false;
          });
      }
    }, "image/jpeg");
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

        <div v-if="isClassifying" class="classification-result classifying">
          <span class="result-icon">🔍</span>
          <span class="result-text">Classifying...</span>
        </div>
        <div v-else-if="classificationResult" class="classification-result">
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

.classifying {
  background-color: rgba(173, 216, 230, 0.2); /* Light blue background */
  color: #0066cc; /* Blue text */
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
