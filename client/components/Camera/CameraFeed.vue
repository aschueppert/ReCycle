<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
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
    const result = predictedClass.toLowerCase() === "other" ? "Trash" : "Recycle";
    try {
      const body: Record<string, string> = { type: result };
      await fetchy(`/api/classify`, "POST", { body, alert: false });
    } catch (error) {
      console.error("Error saving classification:", error);
    }
    return result;
  } catch (error) {
    console.error("Error classifying image: ", error);
    try {
      const body: Record<string, string> = { type: "Trash" };
      await fetchy(`/api/classify`, "POST", { body, alert: false });
    } catch (error) {
      console.error("Error saving classification:", error);
    }
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
        <button class="button" @click="handleClassify">Classify</button>

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
      <canvas ref="canvasRef" width="640" height="480"></canvas>
    </div>
  </div>
</template>

<style scoped>
/* Camera section layout */
.camera-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px; /* Spacing between elements */
}

/* Classification result container */
.classify-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 15px;
  gap: 10px; /* Spacing between result and button */
}

/* Classification result styling */
.classification-result {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.classification-result.classifying {
  background-color: rgba(173, 216, 230, 0.2); /* Light blue background */
  color: #003a74; /* Blue text */
}

.recycle-bg .classification-result {
  background-color: #d9f8e6; /* Light green for "Recycle" */
  color: #044120; /* Dark green text */
}

.trash-bg .classification-result {
  background-color: #f8d9d9; /* Light red for "Trash" */
  color: #5d0c0c; /* Darker red text */
}

.result-icon {
  margin-right: 10px;
  font-size: 24px;
  transform: translateY(2px); /* Slight vertical alignment fix */
}

/* Video and canvas styling */
canvas {
  width: auto;
  height: calc(100vh - 220px); /* Dynamically adjust height (subtracting space for other elements) */
  border-radius: 20px;
  border: 4px solid #044120; /* Subtle border for clean design */
}

.button {
  font-size: 24px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .classification-result {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
