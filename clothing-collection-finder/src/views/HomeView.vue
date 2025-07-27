<!-- src/views/HomeView.vue -->
<template>
  <MainLayout>  <!-- 상단 네비게이션 바 -->
    <SidebarLayout @moveToLocation="handleMoveToLocation">
      <!-- 메인 콘텐츠 (지도) -->
      <NaverMap
          ref="naverMapRef"
          :width="'100%'"
          :height="'100%'"
          :center="mapCenter"
          :zoom="10"
          @markerClick="handleMarkerClick"
      />
      <!-- 🆕 패널 추가 -->
      <ClothingBinDetailPanel
          v-if="showDetailPanel"
          @close="closeDetailPanel"
      />
    </SidebarLayout>
  </MainLayout>
</template>

<script>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import SidebarLayout from '../layouts/SidebarLayout.vue'
import NaverMap from '../components/map/NaverMap.vue'
import ClothingBinDetailPanel from "@/components/ui/ClothingBinDetailPanel.vue";

export default {
  name: 'HomeView',
  components: {
    MainLayout,
    SidebarLayout,
    NaverMap,
    ClothingBinDetailPanel
  },
  setup() {
    const mapCenter = ref({ lat: 37.5665, lng: 126.9780 }) // 서울시청
    const naverMapRef = ref(null)

    // 🔄 수정: useMapMarkers 제거하고 직접 상태 관리
    const showDetailPanel = ref(false)
    const selectedBinData = ref(null)

    // 🆕 마커 클릭 핸들러 추가
    const handleMarkerClick = (binData) => {
      console.log('HomeView에서 마커 클릭 받음:', binData)
      selectedBinData.value = binData
      showDetailPanel.value = true
    }

    // 🔄 수정: 패널 닫기 함수
    const closeDetailPanel = () => {
      showDetailPanel.value = false
      selectedBinData.value = null
      console.log('❌ 패널 닫힘')
    }

    // 사이드바에서 온 이벤트 처리
    const handleMoveToLocation = (locationData) => {
      console.log('지도 이동 요청:', locationData)

      // NaverMap 컴포넌트의 메서드 호출
      if (naverMapRef.value) {
        naverMapRef.value.moveToLocation(
            locationData.latitude,
            locationData.longitude
        )
      }
    }

    return {
      mapCenter,
      naverMapRef,
      handleMoveToLocation,
      handleMarkerClick,    // 🆕 추가
      showDetailPanel,      // 정보패널 관련
      closeDetailPanel,     // 정보패널 관련
      selectedBinData       // 🆕 선택된 의류수거함 데이터
    }
  }
}
</script>

<style scoped>
/* 페이지별 특별한 스타일이 필요한 경우만 여기에 */
</style>