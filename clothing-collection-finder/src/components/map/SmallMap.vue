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

    <!-- 이 위치에서 다시 검색 버튼 추가 -->
    <SearchAgainButton
        :visible="true"
        class="search-again-btn"
        @search-again="handleSearchAgain"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNaverMap } from '../../composables/useNaverMap' // 지도 생성/관리
import { useMapMarkers } from '../../composables/useMapMarkers' // 마커 생성/제거
import { useClotheBin } from '../../composables/useClotheBin' // 의류수거함 데이터 관리
import SearchAgainButton from '../ui/SearchAgainButton.vue' // 이 위치에서 다시 검색 버튼
//  현재 위치 로직 분리된 composable import (경로 수정)
import { useNaverMapCurrentLocation } from '../../composables/currentlocation/useNaverMapCurrentLocation'

// 이벤트 정의 (WritingView로 전달할 이벤트)
const emit = defineEmits(['markerClick', 'location-found', 'location-error','address-updated', 'address-error', 'location-selected'])

// Props 정의
const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '100%' },
  center: { type: Object, default: () => null },  // center가 없으면 GPS로 시도 (브라우저에서 위치를 가져와 지도 중심 지정)
  zoom: { type: Number, default: 16 }
})

const mapContainerId = `naver-map-${Date.now()}`

// 초기 위치 로딩 상태 및 에러
const isInitialLocationLoading = ref(true)
const initialLocationError = ref(null)

// 검색 버튼 클릭 핸들러 완성
const handleSearchAgain = async () => {
  if (!map.value) return

  try {


    // 현재 지도의 사각형 영역 가져오기
    const bounds = map.value.getBounds()
    const swLat = bounds.getSW().lat()
    const swLng = bounds.getSW().lng()
    const neLat = bounds.getNE().lat()
    const neLng = bounds.getNE().lng()



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

// 현재 위치 버튼 클릭 핸들러 추가
const handleCurrentLocationClick = () => {

  emit('location-updated')
}

// 현재 줌 레벨 상태
const currentZoom = ref(10)

//  수정: 지도 관련 (현재 위치 기능 추가)
const {
  map,
  isLoading: isMapLoading,
  error: mapError,
  initMap,
  triggerResize,
  //  현재 위치 관련 기능들
  showCurrentLocation,
  hideCurrentLocation,
  getCurrentPosition, // 현재 위치 좌표만 가져오는 함수
  DEFAULT_LOCATION,   // 기본 위치 상수
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
    () => ({ success: true, message: 'N/A' }), // 임시 더미 함수 전달
    emit
)

//  마커 클릭 핸들러
const handleMarkerClick = (binData) => {
  // 부모 컴포넌트로 이벤트 전달
  emit('markerClick', binData)
  // 위치 정보 전달 (ShareWriting.vue의 onLocationSelected 핸들러로 전달됨)
  emit('location-selected', {
    binId: binData.id,  // 수거함 고유 ID
    latitude: binData.latitude || binData.lat,
    longitude: binData.longitude || binData.lng,
    address: binData.roadAddress || binData.address // 주소 정보가 포함되어 있다고 가정
  })
}

// 지도 이동 함수 추가
const moveToLocation = (latitude, longitude) => {
  if (map.value && naver.maps) {
    const newCenter = new naver.maps.LatLng(latitude, longitude)
    map.value.setCenter(newCenter)
    map.value.setZoom(16) // 적당한 확대 레벨
  }
}

// 지도 초기화 로직을 현재 위치 기반으로 변경
const initializeMap = async () => {
  isInitialLocationLoading.value = true;
  initialLocationError.value = null;

  let initialLat = DEFAULT_LOCATION.lat;
  let initialLng = DEFAULT_LOCATION.lng;
  let hasRealLocation = false;

  try {
    // 1. 현재 위치 좌표만 가져오기 (지도 생성 전)
    const position = await getCurrentPosition();

    if (position && !position.isDefault) {
      initialLat = position.lat;
      initialLng = position.lng;
      hasRealLocation = true;

    } else {
      console.warn('현재 위치 가져오기 실패 또는 거부. 기본 위치(서울 시청) 사용.');
      initialLocationError.value = "위치 권한이 없어 기본 위치로 설정되었습니다.";
    }
  } catch (error) {
    initialLocationError.value = error.message || '위치 정보를 가져올 수 없습니다.';
    console.error("초기 위치 가져오기 에러:", error);
  } finally {
    isInitialLocationLoading.value = false;
  }

  try {
    // 2. 지도 초기화 (useNaverMap.js의 initMap은 인자 없이 호출됨을 가정)
    // 현재 위치를 중심으로 설정하기 위해, useNaverMap의 initMap 내부에서
    // DEFAULT_LOCATION을 사용하거나, showCurrentLocation을 호출해야 함.
    // 여기서는 initMap을 먼저 호출하고, 바로 현재 위치로 이동시키는 방식을 사용합니다.
    await initMap(); // 지도 DOM 및 기본 설정 초기화 (DEFAULT_LOCATION)

    // 3. 지도 중심을 현재 위치로 이동 및 마커 표시 (지도 로드 후)
    if (map.value) {
      if (hasRealLocation) {
        // [수정] showCurrentLocation 함수를 사용하여 마커 표시 및 이동
        const result = await showCurrentLocation({
          center: { lat: initialLat, lng: initialLng },
          zoom: props.zoom || 15
        });
        if (!result.success) {
          console.error("지도 이동 및 현재 위치 마커 표시 실패:", result.error);
        }
      } else {
        // 실제 위치가 아닌 경우에도 지도를 기본 위치로 이동 및 표시 (useNaverMap 내부 로직에 의존)
        // 지도 중심은 initMap에서 이미 DEFAULT_LOCATION으로 설정되었을 것

      }

      // 4. 초기 지도 영역 내 의류수거함 데이터 로드 (현재 보이는 영역)
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
    mapError.value = '지도 로드 중 오류가 발생했습니다.';
  }
}

onMounted(async () => {
  // 지도 초기화 로직을 현재 위치 기반으로 변경한 함수 호출
  await initializeMap()
})

// 부모 컴포넌트에서 호출 가능한 함수들을 노출
defineExpose({
  triggerResize,
  moveToLocation,
  hideCurrentLocationMarker: currentLocationHandlers.hideCurrentLocationMarker,
  currentLocationCoordinates: currentLocationHandlers.currentLocationCoordinates,
  currentZoom
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

.search-again-btn {
  font-size: 13px;
  padding: 11.5px 22px;
}
</style>