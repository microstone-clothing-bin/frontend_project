<!-- 정보패널 -->
<template>
  <div class="detail-panel">
    <!-- 패널 내용 -->
    <div class="panel-content">
      <!-- 닫기 버튼 컴포넌트 -->
      <DetailPanelCloseButton @close="handleClose" />

      <!-- 의류수거함 이미지 영역 -->
      <div class="clothing-bin-image-container">
        <img
            :src="clothingBinImage"
            alt="의류수거함"
            class="clothing-bin-image"
        />
      </div>

      <!-- 정보 표시 영역 -->
      <div class="info-section">
        <div v-if="binData" class="bin-info">
          <!-- 도로명 주소 -->
          <h3 class="road-address">{{ binData.roadAddress }}</h3>

          <!-- 지번 주소 (있을 때만 표시) -->
          <p v-if="binData.landLotAddress" class="land-lot-address">
            {{ binData.landLotAddress }}
          </p>

          <!--  거리 정보 추가 -->
          <div class="distance-info">
            <span class="distance-label">내 위치에서</span>
            <span class="distance-value">{{ calculateDistance(binData) }}</span>
          </div>

          <!-- 즐겨찾기 버튼 영역 -->
          <div class="favorite-section">
            <FavoriteButton
                :is-active="isFavorite(binData?.id)"
                @click="toggleFavorite(binData?.id)"
            />
          </div>
          <div class="divider"></div>
        </div>

        <!-- 데이터가 없을 때 -->
        <div v-else class="no-data">
          <p class="placeholder-text">정보가 여기에 표시됩니다</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 닫기 버튼 컴포넌트 import
import DetailPanelCloseButton from '@/components/ui/detailpanel/DetailPanelCloseButton.vue'
// 의류수거함 이미지 import
import clothingBinImageSrc from '@/assets/images/clothing-bin-panel.png'
// 의류수거함 이미지 css
import '@/styles/detailpanel/clothing-bin-image.css'
// 의류수거함 데이터 글씨 css
import '@/styles/detailpanel/clothing-bin-data.css'
// 거리 정보 css
import '@/styles/detailpanel/distance-info.css'
// 거리 계산을 위한 import
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator'
import { useGeolocation } from '@/composables/currentlocation/useGeolocation'
// 즐겨찾기 관련
import FavoriteButton from '@/components/ui/favorites/FavoriteButton.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'
import '@/styles/detailpanel/favorite-divider.css'

const favoritesStore = useFavoritesStore()
const { isFavorite, toggleFavorite } = favoritesStore

// 거리 계산 composables
const {
  calculateDistance: calculateDistanceRaw,
  formatDistance
} = useDistanceCalculator()

const {
  coordinates: geoCoordinates
} = useGeolocation()

// 거리 계산 함수
const calculateDistance = (bin) => {
  try {
    if (!geoCoordinates.value) {
      return '위치 요청 중'
    }
    if (!bin.latitude || !bin.longitude) {
      return '좌표 정보 없음'
    }
    const distance = calculateDistanceRaw(
        geoCoordinates.value.lat,
        geoCoordinates.value.lng,
        bin.latitude,
        bin.longitude
    )
    if (distance === null) {
      return '거리 계산 실패'
    }
    return formatDistance(distance, {
      precision: 0,
      useKilometers: true,
      kmThreshold: 1000,
      shortUnit: true
    })
  } catch (error) {
    console.error('❌ 거리 계산 중 오류:', error)
    return '계산 오류'
  }
}

// 이벤트 정의
const emit = defineEmits(['close'])

// 닫기 이벤트 핸들러
const handleClose = () => {
  emit('close')
}

// 이미지 경로 설정
const clothingBinImage = clothingBinImageSrc

// Props (사이드바 상태 및 의류수거함 데이터 받기)
const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  },
  binData: {
    type: Object,
    default: null
  }
})
</script>

<style scoped>
/* 정보패널 메인 레이아웃 */
.detail-panel {
  position: fixed;
  top: 105px;
  left: v-bind('props.sidebarCollapsed ? "20px" : "416px"');
  width: 370px;
  height: calc(100vh - 130px);
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
  transition: left 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
  max-height: 800px;
  min-height: 400px;
}

/* 슬라이드 인 애니메이션 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 패널 내용 */
.panel-content {
  padding: 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  position: relative;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .detail-panel {
    width: calc(100% - 40px);
    height: 60vh;
    top: 40vh;
    left: 20px !important;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .panel-content {
    height: 100%;
  }
}

</style>