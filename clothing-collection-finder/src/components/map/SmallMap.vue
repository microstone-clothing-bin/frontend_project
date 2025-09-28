<!-- 글쓰기 페이지 지도 -->

<template>
  <div class="map-container">
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
import { useMapMarkers } from '../../composables/useMapMarkers' // 마커 생성/제거
import { useClotheBin } from '../../composables/useClotheBin' // 의류수거함 데이터 관리
// 현재 위치 로직 분리된 composable import (경로 수정)
import { useNaverMapCurrentLocation } from '../../composables/currentlocation/useNaverMapCurrentLocation'

// 이벤트 정의 (WritingView로 전달할 이벤트)
const emit = defineEmits(['markerClick', 'location-found', 'location-error','address-updated', 'address-error'])

// Props 정의
const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  center: { type: Object, default: () => null },  // center가 없으면 GPS로 시도 (브라우저에서 위치를 가져와 지도 중심 지정)
  zoom: { type: Number, default: 16 }
})

const mapContainerId = `naver-map-${Date.now()}`

// 현재 줌 레벨 상태
const currentZoom = ref(10)

// 지도 관련
const {
  map,
  isLoading: isMapLoading,
  error: mapError,
  initMap,
  triggerResize,
  // 현재 위치 관련 기능들 추가
  showCurrentLocation,
  hideCurrentLocation,
  showCurrentLocationWithNearbyData,

  currentLocationCoordinates
} = useNaverMap(mapContainerId)

// 마커 관련
const { addMarkersToMap, clearMarkers } = useMapMarkers()

// 의류수거함 데이터 관련
const {
  clothingBins,
  isLoading: isDataLoading,
  error: dataError,
  loadClothingBins
} = useClotheBin()

// 현재 위치 로직을 분리된 composable로 처리
const currentLocationHandlers = useNaverMapCurrentLocation(
    map,
    clothingBins,
    showCurrentLocation,
    hideCurrentLocation,
    showCurrentLocationWithNearbyData,
    emit
)

// 마커 클릭 핸들러 추가
const handleMarkerClick = (binData) => {

  // HomeView로 이벤트 전달
  emit('markerClick', binData)
}

// 지도 이동 함수 추가 - 여기에 추가!
const moveToLocation = (latitude, longitude) => {
  if (map.value) {
    const newCenter = new naver.maps.LatLng(latitude, longitude)
    map.value.setCenter(newCenter)
    map.value.setZoom(16) // 적당한 확대 레벨

  }
}

onMounted(async () => {
  try {
    // 사용자 GPS 먼저 시도
    let initialCenter = { lat: 37.5665, lng: 126.9780 } // fallback: 서울시청

    if (navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
              initialCenter = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              }
              console.log("✅ GPS로 받은 초기 좌표:", initialCenter)
              resolve()
            },
            (err) => {
              console.error("GPS 에러:", err)
              resolve() // fallback 그대로 사용
            }
        )
      })
    }

    // 1. 지도 초기화 (GPS 좌표 반영)
    await initMap({
      center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
      zoom: props.zoom
    })

    if (map.value) {
      currentZoom.value = map.value.getZoom()
      naver.maps.Event.addListener(map.value, "zoom_changed", () => {
        currentZoom.value = map.value.getZoom()

      })
    }

    // 2. 의류수거함 데이터 로드
    await loadClothingBins()

    if (map.value && clothingBins.value && clothingBins.value.length > 0) {
      addMarkersToMap(map.value, clothingBins.value, handleMarkerClick)

    }
  } catch (error) {
    console.error("NaverMap 초기화 에러:", error)
  }
})

// 부모 컴포넌트에서 리사이즈를 호출할 수 있도록 expose
defineExpose({
  triggerResize,
  moveToLocation,
  hideCurrentLocationMarker: currentLocationHandlers.hideCurrentLocationMarker,  // 🆕 현재 위치 숨기기
  showCurrentLocationWithOptions: currentLocationHandlers.showCurrentLocationWithOptions, // 🆕 옵션으로 현재 위치 표시
  currentLocationCoordinates,  // 현재 위치 좌표 (읽기 전용)
  currentZoom  // 현재 줌 레벨 (읽기 전용)
})
</script>

<style scoped>
/* 동적 크기만 컴포넌트에 유지 */
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
  padding: 1.04vw;                               /* 20px */
  border-radius: 0.42vw;                         /* 8px */
  box-shadow: 0 0.10vw 0.52vw rgba(0,0,0,0.1);   /* 0 2px 10px */
}

.error {
  color: #e74c3c;
}
</style>