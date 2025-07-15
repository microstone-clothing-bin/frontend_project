<template>
  <div class="naver-map-container">
    <!-- 로딩 중 -->
    <div v-if="isLoading" class="loading">
      <p>지도 로딩 중...</p>
    </div>

    <!-- 에러 -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <!-- 지도 -->
    <div :id="mapContainerId" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNaverMap } from '../../composables/useNaverMap'

// Props 정의
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  center: {
    type: Object,
    default: () => ({ lat: 37.5665, lng: 126.9780 })
  },
  zoom: {
    type: Number,
    default: 10
  }
})

const mapContainerId = `naver-map-${Date.now()}`

const {
  isLoading,
  error,
  initMap,
  triggerResize
} = useNaverMap(mapContainerId)

onMounted(async () => {
  await initMap({
    zoom: props.zoom
  })
})

// 부모 컴포넌트에서 리사이즈를 호출할 수 있도록 expose
defineExpose({
  triggerResize
})
</script>

<style scoped>
/* 동적 크기만 컴포넌트에 유지 */
.naver-map-container {
  width: v-bind(width);
  height: v-bind(height);
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error {
  color: #e74c3c;
}
</style>