<!-- 네이버 지도 -->
<template>
  <div class="naver-map-container">
    <!-- 로딩 에러 -->
    <div v-if="mapError || dataError" class="error">
      <p>{{ mapError || dataError }}</p>
    </div>

    <!-- 지도 -->
    <div :id="mapContainerId" class="map"></div>

    <!-- 이 위치에서 다시 검색 버튼 추가 -->
    <SearchAgainButton
        :visible="true"
        @search-again="handleSearchAgain"
    />

    <!-- 지도 컨트롤 버튼들을 하나의 컨테이너로 묶기 -->
    <div class="map-controls-container">
      <!-- 줌 컨트롤 그룹 -->
      <div class="zoom-controls-group">
        <MapZoomInButton
            :map="map"
            :current-zoom="currentZoom"
            :max-zoom="21"
            @zoom-changed="handleZoomChanged"
        />
        <MapZoomOutButton
            :map="map"
            :current-zoom="currentZoom"
            :min-zoom="6"
            @zoom-changed="handleZoomChanged"
        />
      </div>

      <!-- 현재 위치 버튼 -->
      <CurrentLocationButton
          @location-success="currentLocationHandlers.handleLocationSuccess"
          @location-error="currentLocationHandlers.handleLocationError"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNaverMap } from '../../composables/useNaverMap' // 지도 생성/관리
import { useMapMarkers } from '../../composables/useMapMarkers' //  마커 생성/제거
import { useClotheBin } from '../../composables/useClotheBin' // 의류수거함 데이터 관리
import SearchAgainButton from '../ui/SearchAgainButton.vue' // 이 위치에서 다시 검색 버튼
//  현재 위치 버튼 컴포넌트 import
import CurrentLocationButton from '../ui/CurrentLocationButton.vue'
//  줌 버튼 컴포넌트들 import
import MapZoomInButton from '../ui/mapzoom/MapZoomInButton.vue'
import MapZoomOutButton from '../ui/mapzoom/MapZoomOutButton.vue'
//  현재 위치 로직 분리된 composable import (경로 수정)
import { useNaverMapCurrentLocation } from '../../composables/currentlocation/useNaverMapCurrentLocation'

//  이벤트 정의 (HomeView로 전달할 이벤트)
const emit = defineEmits(['markerClick', 'location-found', 'location-error','address-updated', 'address-error'])

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
  }
})

const mapContainerId = `naver-map-${Date.now()}`


// 검색 버튼 클릭 핸들러 완성
const handleSearchAgain = async () => {
  if (!map.value) return

  try {
    console.log('현재 지도 영역에서 검색 시작...')

    // 현재 지도의 사각형 영역 가져오기
    const bounds = map.value.getBounds()
    const swLat = bounds.getSW().lat()
    const swLng = bounds.getSW().lng()
    const neLat = bounds.getNE().lat()
    const neLng = bounds.getNE().lng()

    console.log('검색 영역:', { swLat, swLng, neLat, neLng })

    // 기존 마커 제거
    clearMarkers()

    // 사각형 영역 내 데이터 로드
    await loadClothingBinsInBounds(swLat, swLng, neLat, neLng)

    // 새 마커 추가
    if (clothingBins.value && clothingBins.value.length > 0) {
      addMarkersToMap(map.value, clothingBins.value, handleMarkerClick)
    } else {
      console.log('현재 영역에서 검색된 의류수거함이 없습니다.')
    }

  } catch (error) {
    console.error('영역 검색 실패:', error)
  }
}

//  현재 줌 레벨 상태 추가
const currentZoom = ref(10)

//  수정: 지도 관련 (현재 위치 기능 추가)
const {
  map,
  isLoading: isMapLoading,
  error: mapError,
  initMap,
  triggerResize,
  //  현재 위치 관련 기능들 추가
  showCurrentLocation,
  hideCurrentLocation,
  showCurrentLocationWithNearbyData,

  currentLocationCoordinates
} = useNaverMap(mapContainerId)

//   마커 관련
const { addMarkersToMap, clearMarkers } = useMapMarkers()

// 의류수거함 데이터 관련
const {
  clothingBins,
  isLoading: isDataLoading,
  error: dataError,
  loadClothingBins,
  loadClothingBinsInBounds
} = useClotheBin()

//  현재 위치 로직을 분리된 composable로 처리
const currentLocationHandlers = useNaverMapCurrentLocation(
    map,
    clothingBins,
    showCurrentLocation,
    hideCurrentLocation,
    showCurrentLocationWithNearbyData,
    emit
)

//  줌 변경 핸들러 추가
const handleZoomChanged = (zoomInfo) => {
  currentZoom.value = zoomInfo.newZoom
}

//  마커 클릭 핸들러 추가
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
    // 1. 지도 초기화
    await initMap()

    //  지도 초기화 후 줌 이벤트 리스너 추가
    if (map.value) {
      map.value.setZoom(15)  // 원하는 줌 레벨
    }

    // 2. 초기 화면의 사각형 영역 내 의류수거함 데이터 로드
    if (map.value) {
      const bounds = map.value.getBounds()
      const swLat = bounds.getSW().lat()
      const swLng = bounds.getSW().lng()
      const neLat = bounds.getNE().lat()
      const neLng = bounds.getNE().lng()



      await loadClothingBinsInBounds(swLat, swLng, neLat, neLng)

      // 마커 추가
      if (clothingBins.value && clothingBins.value.length > 0) {
        addMarkersToMap(map.value, clothingBins.value, handleMarkerClick)

      }
    }
  } catch (error) {
    console.error('NaverMap 초기화 에러:', error)
  }
})

//  수정: 부모 컴포넌트에서 리사이즈를 호출할 수 있도록 expose (현재 위치 기능 추가)
defineExpose({
  triggerResize,
  moveToLocation,
  hideCurrentLocationMarker: currentLocationHandlers.hideCurrentLocationMarker,  //  현재 위치 숨기기
  showCurrentLocationWithOptions: currentLocationHandlers.showCurrentLocationWithOptions, //  옵션으로 현재 위치 표시
  currentLocationCoordinates,  //  현재 위치 좌표 (읽기 전용)
  currentZoom  //  현재 줌 레벨 (읽기 전용)
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
  color: #6029b7;
}

/* 지도 컨트롤 버튼들 컨테이너 */
.map-controls-container {
  position: absolute;
  right: 20px;
  bottom: 50px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

/* 줌 버튼들 그룹 */
.zoom-controls-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 반응형 */
@media (max-width: 768px) {
  .map-controls-container {
    right: 15px;
    bottom: 15px;
    gap: 10px;
  }
}
</style>