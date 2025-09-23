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

        <!-- 리뷰 탭 섹션 -->
        <div class="review-section">
          <!-- 탭 버튼 -->
          <div class="review-tabs">
            <button
                class="review-tab"
                :class="{ active: activeTab === 'view' }"
                @click="setActiveTab('view')"
            >
              리뷰 보기
            </button>
            <button
                class="review-tab"
                :class="{ active: activeTab === 'write' }"
                @click="setActiveTab('write')"
            >
              리뷰 쓰기
            </button>
          </div>

          <!-- 탭 내용 -->
          <div class="review-content">
            <!-- 리뷰 보기 내용 -->
            <div v-if="activeTab === 'view'" class="review-view">
              <p>리뷰 목록 내용</p>
            </div>

            <!-- 리뷰 쓰기 내용 -->
            <div v-if="activeTab === 'write'" class="review-write">
              <div class="user-profile">
                <img src="@/assets/images/clothing-bin-group.png" alt="사용자 프로필" class="profile-image">
                <span class="username">user nickname 1</span>
              </div>

              <!-- 댓글 입력창 -->
              <div class="comment-input-wrapper">
    <textarea
        v-model="commentText"
        placeholder="이 의류수거함에 대한 의견을 댓글로 남겨주세요."
        class="comment-input-field"
    ></textarea>
              </div>

              <!-- 하단 버튼 영역 -->
              <div class="comment-actions">
              <!-- 카메라 버튼 -->
              <div class="camera-button-container">
                <button class="camera-btn" @click="openCamera">
                  <div class="camera-button-bg">
                    <img src="@/assets/images/camera-icon.png" alt="카메라" class="camera-icon">
                  </div>
                </button>
              </div>

              <!-- 등록 버튼 -->
              <button class="submit-btn" @click="submitComment">
                <img src="@/assets/images/comment-button.png" alt="등록" class="submit-button-bg">
                <span class="submit-text">등록</span>
              </button>
            </div>

            </div>
          </div>
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
import '@/styles/detailpanel/review-section.css'
import { ref } from 'vue'

const commentText = ref('')

const favoritesStore = useFavoritesStore()

// 즐겨찾기 관련 함수들
const isFavorite = (binId) => {
  if (!binId) return false
  return favoritesStore.isFavorite(binId)
}

const toggleFavorite = async (binId) => {
  if (!binId) {
    console.error('binId가 없습니다.')
    return
  }

  try {
    await favoritesStore.toggleFavorite(binId)
    console.log(`즐겨찾기 토글: ${binId}`)
  } catch (error) {
    console.error('즐겨찾기 토글 실패:', error)
    alert('즐겨찾기 변경에 실패했습니다.')
  }
}

const openCamera = () => {
  console.log('카메라 버튼 클릭')
  // 카메라 기능 구현
}

const submitComment = () => {
  if (commentText.value.trim()) {
    console.log('댓글 등록:', commentText.value)
    commentText.value = ''
  }
}

// 거리 계산 composables
const {
  calculateDistance: calculateDistanceRaw,
  formatDistance
} = useDistanceCalculator()

const {
  coordinates: geoCoordinates
} = useGeolocation()

// 활성 탭 상태 (기본값: 리뷰 보기)
const activeTab = ref('view')

// 탭 전환 함수
const setActiveTab = (tab) => {
  activeTab.value = tab
}

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
    console.error(' 거리 계산 중 오류:', error)
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


</style>