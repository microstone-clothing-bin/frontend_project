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
              리뷰 보기 ({{ reviews.length }})
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
              <!-- 로딩 상태 -->
              <div v-if="reviewsLoading" class="loading-message">
                리뷰를 불러오는 중...
              </div>

              <!-- 리뷰가 없는 경우 -->
              <div v-else-if="reviews.length === 0" class="no-reviews">
                아직 작성된 리뷰가 없습니다.
              </div>

              <!-- 리뷰 목록 -->
              <div v-else class="reviews-container">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="user-profile">
                    <img src="@/assets/images/Ellipse.png" alt="사용자 프로필" class="profile-image">
                    <span class="username">{{ review.nickname }}</span>
                    <span class="review-date">{{ formatDate(review.createDate) }}</span>
                  </div>

                  <!-- 리뷰 이미지 (있는 경우만) -->
                  <div v-if="review.imageBase64" class="review-image-container">
                    <img :src="'data:image/jpeg;base64,' + review.imageBase64" alt="리뷰 이미지" class="review-image">
                  </div>

                  <!-- 리뷰 텍스트 -->
                  <div class="review-text-container">
                    <p class="review-text">{{ review.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 리뷰 쓰기 내용 -->
            <div v-if="activeTab === 'write'" class="review-write">
              <!-- 로그인 확인 -->
              <div v-if="!canWriteReview" class="login-required">
                <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
                <button @click="goToLogin" class="login-button">로그인</button>
              </div>

              <!-- 리뷰 작성 폼 -->
              <div v-else>
                <div class="user-profile">
                  <img src="@/assets/images/clothing-bin-group.png" alt="사용자 프로필" class="profile-image">
                  <span class="username">{{ currentUser?.nickname || 'user nickname 1' }}</span>
                </div>

                <!-- 댓글 입력창 -->
                <div class="comment-input-wrapper">
                  <textarea
                      v-model="commentText"
                      placeholder="이 의류수거함에 대한 의견을 댓글로 남겨주세요."
                      class="comment-input-field"
                  ></textarea>
                </div>

                <!-- 선택된 이미지 미리보기 -->
                <div v-if="selectedImagePreview" class="image-preview">
                  <img :src="selectedImagePreview" alt="미리보기" class="preview-image" />
                  <button @click="removeImage" class="remove-image-btn">삭제</button>
                </div>

                <!-- 하단 버튼 영역 -->
                <div class="comment-actions">
                  <!-- 카메라 버튼 -->
                  <div class="camera-button-container">
                    <input
                        type="file"
                        ref="imageInput"
                        @change="handleImageSelect"
                        accept="image/*"
                        style="display: none"
                    />
                    <button class="camera-btn" @click="openCamera">
                      <div class="camera-button-bg">
                        <img src="@/assets/images/camera-icon.png" alt="카메라" class="camera-icon">
                      </div>
                    </button>
                  </div>

                  <!-- 등록 버튼 -->
                  <button
                      class="submit-btn"
                      @click="submitComment"
                      :disabled="!commentText.trim() || isSubmitting"
                  >
                    <img src="@/assets/images/comment-button.png" alt="등록" class="submit-button-bg">
                    <span class="submit-text">{{ isSubmitting ? '등록 중...' : '등록' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
// 기존 imports
import DetailPanelCloseButton from '@/components/ui/detailpanel/DetailPanelCloseButton.vue'
import clothingBinImageSrc from '@/assets/images/clothing-bin-panel.png'
import '@/styles/detailpanel/clothing-bin-image.css'
import '@/styles/detailpanel/clothing-bin-data.css'
import '@/styles/detailpanel/distance-info.css'
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator'
import { useGeolocation } from '@/composables/currentlocation/useGeolocation'
import FavoriteButton from '@/components/ui/favorites/FavoriteButton.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'
import '@/styles/detailpanel/favorite-divider.css'
import '@/styles/detailpanel/review-section.css'

// 리뷰 서비스 import 추가
import reviewService from '@/services/reviewService'

// 리뷰 관련 반응형 데이터
const reviews = ref([])
const reviewsLoading = ref(false)
const canWriteReview = ref(false)
const currentUser = ref(null)
const isSubmitting = ref(false)

// 기존 데이터
const commentText = ref('')
const activeTab = ref('view')
const selectedImagePreview = ref(null)
const selectedImageFile = ref(null)

const favoritesStore = useFavoritesStore()

// Props
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

// 이벤트 정의
const emit = defineEmits(['close'])

// 리뷰 로드 함수
const loadReviews = async () => {
  if (!props.binData?.id) return

  try {
    reviewsLoading.value = true
    reviews.value = await reviewService.getReviewsByBinId(props.binData.id)
  } catch (error) {
    console.error('리뷰 로드 실패:', error)
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

// 리뷰 작성 권한 확인
const checkWritePermission = async () => {
  try {
    const result = await reviewService.canWriteReview()
    canWriteReview.value = result.canWrite
    currentUser.value = result.user
  } catch (error) {
    console.error('권한 확인 실패:', error)
    canWriteReview.value = false
  }
}

// 이미지 선택 처리
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImageFile.value = file

    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 이미지 제거
const removeImage = () => {
  selectedImageFile.value = null
  selectedImagePreview.value = null
  if (this.$refs.imageInput) {
    this.$refs.imageInput.value = ''
  }
}

// 카메라 버튼 클릭
const openCamera = () => {
  this.$refs.imageInput?.click()
}

// 리뷰 제출
const submitComment = async () => {
  if (!commentText.value.trim()) {
    alert('리뷰 내용을 입력해주세요.')
    return
  }

  if (!props.binData?.id) {
    alert('의류수거함 정보가 없습니다.')
    return
  }

  try {
    isSubmitting.value = true

    const result = await reviewService.createReview(
        props.binData.id,
        commentText.value,
        selectedImageFile.value
    )

    if (result.success) {
      alert(result.message)

      // 폼 초기화
      commentText.value = ''
      removeImage()

      // 리뷰 목록 새로고침
      await loadReviews()

      // 리뷰 보기 탭으로 전환
      activeTab.value = 'view'
    }
  } catch (error) {
    console.error('리뷰 작성 실패:', error)
    alert(error.message || '리뷰 작성에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}

// 로그인 페이지로 이동
const goToLogin = () => {
  // 라우터 이동 (실제 라우터 경로에 맞게 수정)
  window.location.href = '/login'
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 탭 전환 함수
const setActiveTab = (tab) => {
  activeTab.value = tab
}

// binData가 변경될 때 리뷰 로드
watch(() => props.binData?.id, async (newBinId) => {
  if (newBinId) {
    await loadReviews()
  } else {
    reviews.value = []
  }
}, { immediate: true })

// 컴포넌트 마운트시 권한 확인
onMounted(async () => {
  await checkWritePermission()
  if (props.binData?.id) {
    await loadReviews()
  }
})

// 기존 함수들 유지
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

const {
  calculateDistance: calculateDistanceRaw,
  formatDistance
} = useDistanceCalculator()

const {
  coordinates: geoCoordinates
} = useGeolocation()

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

const handleClose = () => {
  emit('close')
}

const clothingBinImage = clothingBinImageSrc
</script>

<style scoped>
/* 기존 스타일 유지 */
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

.review-view {
  max-height: 400px;
  overflow-y: auto;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-item {
  text-align: left;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.user-profile {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  margin-right: 12px;
  object-fit: cover;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #1A1A1A;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  flex: 1;
}

.review-date {
  font-size: 12px;
  color: #666;
  margin-left: auto;
}

.review-image-container {
  margin: 10px 0;
}

.review-image {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.review-text-container {
  margin-top: 8px;
}

.review-text {
  font-size: 14px;
  font-weight: 400;
  color: #1A1A1A;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  line-height: 1.5;
  margin: 0;
  word-break: keep-all;
  white-space: pre-line;
}

.loading-message, .no-reviews {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}

.login-required {
  text-align: center;
  padding: 20px;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}

.login-button {
  background: #6029B7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.image-preview {
  margin: 10px 0;
  position: relative;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>