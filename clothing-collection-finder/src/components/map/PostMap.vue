<template>
  <div class="map-container">
    <div v-if="isLoading" class="loading">
      <p>지도 로딩 중...</p>
    </div>
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div :id="mapContainerId" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useNaverMap } from '@/composables/useNaverMap'; // 지도 생성/관리

const props = defineProps({
  center: {   // { lat, lng } 객체를 필수로 받음
    type: Object,
    required: true,
  },
  zoom: {
    type: Number,
    default: 17
  }
});

const mapContainerId = `post-map-${Date.now()}`;
const marker = ref(null);

// useNaverMap 훅 사용 (initMap만 사용)
const {
  map,
  isLoading,
  error,
  initMap
} = useNaverMap(mapContainerId);

// 지도 초기화 함수 : 마커 1개만 생성
const initializeMap = async () => {
  if (!props.center || !props.center.lat || !props.center.lng) {
    console.warn('PostMap: 유효한 center prop이 없습니다.');
    return;
  }

  try {
    // 1. 지도 DOM 및 기본 설정 초기화
    await initMap();

    if (map.value && window.naver) {
      const { lat, lng } = props.center;
      const centerPosition = new naver.maps.LatLng(lat, lng);

      // 2. 지도를 props.center로 즉시 이동
      map.value.setCenter(centerPosition);
      map.value.setZoom(props.zoom);

      // 3. 마커 1개 생성 (표준 API를 사용)
      marker.value = new window.naver.maps.Marker({
        position: centerPosition,
        map: map.value,
      });
    }
  } catch (err) {
    console.error('PostMap 초기화 에러:', err);
  }
};

// 컴포넌트가 마운트되면 지도 초기화
onMounted(initializeMap);

// 만약 게시물 데이터가 비동기로 로드되어 center prop이 늦게 변경된다면, watch를 사용하여 지도 중심을 업데이트
watch(() => props.center, (newCenter) => {
  if (map.value && newCenter && window.naver) {
    const centerPosition = new naver.maps.LatLng(newCenter.lat, newCenter.lng);
    map.value.setCenter(centerPosition);
    if (marker.value) {
      marker.value.setPosition(centerPosition);
    } else {
      // prop이 늦게 업데이트되어 마커가 없는 경우를 대비해 재생성
      marker.value = new window.naver.maps.Marker({
        position: centerPosition,
        map: map.value,
      });
    }
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
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