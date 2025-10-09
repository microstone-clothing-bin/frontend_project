<!-- src/views/HomeView.vue -->
<template>
  <MainLayout>
    <SidebarLayout
        :sidebar-collapsed="sidebarCollapsed"
        :showDetailPanel="showDetailPanel"
        :hide-toggle-for-modal="showLoginModal"
        @sidebar-toggle="handleSidebarToggle"
        @moveToLocation="handleMoveToLocation"
        @showDetailPanel="handleShowPanel"
        @closeDetailPanel="handleCloseDetailPanel"
        @restoreDetailPanel="handleRestoreDetailPanel"
        @loginModalStateChanged="handleLoginModalStateChanged"
    >
      <!-- 메인 콘텐츠 (지도) -->
      <NaverMap
          ref="naverMapRef"
          :width="'100%'"
          :height="'100%'"
          :center="mapCenter"
          :zoom="10"
          @markerClick="handleMarkerClick"
      />

      <!-- 정보패널 -->
      <ClothingBinDetailPanel
          v-if="showDetailPanel"
          :binData="selectedBinData"
          :sidebar-collapsed="false"
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
import ClothingBinDetailPanel from "@/components/ui/ClothingBinDetailPanel.vue"

// Composable 가져오기
import { useDetailPanel } from '@/composables/useDetailPanel'

export default {
  name: 'HomeView',
  components: {
    MainLayout,
    SidebarLayout,
    NaverMap,
    ClothingBinDetailPanel
  },
  setup() {
    const mapCenter = ref({ lat: 37.5665, lng: 126.9780 })
    const naverMapRef = ref(null)
    const sidebarCollapsed = ref(false) //  사이드바 상태 추가
    const showLoginModal = ref(false)

    // 정보패널 로직을 Composable로 분리
    const {
      showDetailPanel,
      selectedBinData,
      handleMarkerClick: originalHandleMarkerClick,
      handleShowPanel,
      closeDetailPanel
    } = useDetailPanel()

    const handleMarkerClick = (binData) => {
      // 1. 정보패널 표시
      originalHandleMarkerClick(binData)

      // 2. 사이드바가 접혀있다면 열기
      if (sidebarCollapsed.value) {
        sidebarCollapsed.value = false
      }
    }

//  사이드바 토글 이벤트 핸들러 추가
    const handleSidebarToggle = (toggleData) => {
      sidebarCollapsed.value = toggleData.isCollapsed
    }

    //  토글용 임시 저장소
    const tempSavedBinData = ref(null)

    //  토글에 의한 패널 닫기 (데이터 보존)
    const handleCloseDetailPanel = () => {
      if (selectedBinData.value) {
        tempSavedBinData.value = { ...selectedBinData.value } // 🆕 데이터 임시 저장
      }
      closeDetailPanel()
    }

    //  토글에 의한 패널 복원
    const handleRestoreDetailPanel = () => {
      if (tempSavedBinData.value) {
        selectedBinData.value = tempSavedBinData.value
        showDetailPanel.value = true
      }
    }

    // 지도 이동 핸들러
    const handleMoveToLocation = (locationData) => {
      console.log('지도 이동 요청:', locationData)

      if (naverMapRef.value) {
        naverMapRef.value.moveToLocation(
            locationData.latitude,
            locationData.longitude
        )
      }
    }
    // ✅ 로그인 모달 상태 변경 핸들러 추가
    const handleLoginModalStateChanged = (isVisible) => {
      showLoginModal.value = isVisible
    }

    return {
      mapCenter,
      naverMapRef,
      showDetailPanel,
      selectedBinData,
      handleMoveToLocation,
      handleMarkerClick,
      handleShowPanel,
      closeDetailPanel,           // 일반 닫기 (X 버튼용)
      handleCloseDetailPanel,     //  토글용 닫기
      handleRestoreDetailPanel,    //  토글용 복원
      sidebarCollapsed,
      handleSidebarToggle,
      showLoginModal,  // ✅ 추가
      handleLoginModalStateChanged  // ✅ 추가
    }
  }
}
</script>

<style scoped>
/* 페이지별 특별한 스타일이 필요한 경우만 여기에 */
</style>