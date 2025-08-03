<!-- 네이버 지도 -->
<template>
  <div class="naver-map-container">
    <!-- 로딩 중 -->
    <div v-if="isMapLoading || isDataLoading" class="loading">
      <p>지도 로딩 중...</p>
    </div>

    <!-- 에러 -->
    <div v-if="mapError || dataError" class="error">
      <p>{{ mapError || dataError }}</p>
    </div>

    <!-- 지도 -->
    <div :id="mapContainerId" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNaverMap } from '../../composables/useNaverMap' // 지도 생성/관리
import { useMapMarkers } from '../../composables/useMapMarkers' //  마커 생성/제거
import { useClotheBin } from '../../composables/useClotheBin' // 의류수거함 데이터 관리

// 🆕 이벤트 정의 (HomeView로 전달할 이벤트)
const emit = defineEmits(['markerClick'])

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

// 지도 관련
const {
  map,
  isLoading: isMapLoading,
  error: mapError,
  initMap,
  triggerResize
} = useNaverMap(mapContainerId)

// 🔄 수정: 마커 관련 (showDetailPanel, closeDetailPanel 제거)
const { addMarkersToMap, clearMarkers } = useMapMarkers()

// 의류수거함 데이터 관련
const {
  clothingBins,
  isLoading: isDataLoading,
  error: dataError,
  loadClothingBins
} = useClotheBin()

// 🆕 마커 클릭 핸들러 추가
const handleMarkerClick = (binData) => {
  console.log('NaverMap에서 마커 클릭 받음:', binData)
  // HomeView로 이벤트 전달
  emit('markerClick', binData)
}

// 지도 이동 함수 추가 - 여기에 추가!
const moveToLocation = (latitude, longitude) => {
  if (map.value) {
    const newCenter = new naver.maps.LatLng(latitude, longitude)
    map.value.setCenter(newCenter)
    map.value.setZoom(16) // 적당한 확대 레벨
    console.log(`지도 이동: ${latitude}, ${longitude}`)
  }
}

onMounted(async () => {
  try {
    // 1. 지도 초기화
    await initMap({
      zoom: props.zoom
    })

    // 2. 의류수거함 데이터 로드
    await loadClothingBins()

    // 🔄 수정: 콜백 함수와 함께 마커 추가
    if (map.value && clothingBins.value && clothingBins.value.length > 0) {
      addMarkersToMap(map.value, clothingBins.value, handleMarkerClick)
      console.log('🎯 마커 생성 완료 - 이벤트 방식으로 연결됨')
    }
  } catch (error) {
    console.error('NaverMap 초기화 에러:', error)
  }
})

// 🔄 수정: 부모 컴포넌트에서 리사이즈를 호출할 수 있도록 expose (패널 상태 제거)
defineExpose({
  triggerResize,
  moveToLocation
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