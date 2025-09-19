<template>
  <div>
    <!-- 현재 위치 버튼 -->
    <button
        @click="handleLocationClick"
        :disabled="isLoading"
        class="current-location-btn"
        title="현재 위치로 이동"
        :class="{ 'loading': isLoading, 'error': hasError }"
    >
      <!-- 버튼 배경 이미지 -->
      <img src="@/assets/images/locationbtn-background.png" class="btn-background" alt="">

      <!-- 타겟 아이콘 이미지 -->
      <img src="@/assets/images/locationbtn-backgroundtarget.png" class="btn-target-icon" alt="현재위치">
    </button>

    <!-- 위치 권한 설정 안내 모달 -->
    <LocationPermissionModal
        :isVisible="showPermissionModal"
        @close="showPermissionModal = false"
        @retry-permission="handleRetryPermission"
        @show-instructions="handleShowInstructions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCurrentLocation } from '@/composables/currentlocation/useCurrentLocation'
import LocationPermissionModal from './LocationPermissionModal.vue'

// 이벤트 정의
const emit = defineEmits(['location-success', 'location-error'])

// 현재 위치 composable 사용
const {
  getCurrentPosition,
  isLoading,
  error,
  coordinates
} = useCurrentLocation()

// 에러 상태 관리
const hasError = ref(false)
const showPermissionModal = ref(false)
const deniedCount = ref(0) // 권한 거부 횟수 추적

// 버튼 클릭 핸들러
const handleLocationClick = async () => {

  try {
    hasError.value = false

    // 먼저 권한 상태 확인
    const permissionStatus = await checkLocationPermissionStatus()
    console.log(' 권한 상태:', permissionStatus)

    if (permissionStatus === 'denied') {
      // 이미 거부된 상태면 바로 모달 표시
      console.log(' 권한이 이미 거부됨, 모달 표시')
      showPermissionModal.value = true
      return
    }

    // 현재 위치 가져오기 시도
    console.log(' 위치 정보 요청 시작')
    const position = await getCurrentPosition()
    console.log(' 위치 정보 가져오기 성공:', position)

    // 권한 거부 횟수 초기화 (성공 시)
    deniedCount.value = 0

    // 성공 시 부모 컴포넌트에 전달
    emit('location-success', {
      position,
      isRealLocation: !position.isDefault,
      message: position.isDefault ?
          '위치 권한이 없어 기본 위치로 설정되었습니다' :
          '현재 위치를 찾았습니다'
    })

  } catch (err) {
    console.error(' 위치 찾기 실패:', err)
    hasError.value = true

    // 권한 거부인 경우 특별 처리
    if (err.message.includes('위치 권한이 거부되었습니다')) {
      console.log(' 위치 권한 거부됨')
      deniedCount.value++

      // 첫 번째 거부 후에는 바로 모달 표시
      console.log(' 첫 번째 거부 후 모달 표시')
      showPermissionModal.value = true
      return
    }

    // 다른 에러의 경우 일반적인 에러 처리
    const errorMessage = err.message || '위치를 가져올 수 없습니다'
    alert(errorMessage)

    // 부모 컴포넌트에 에러 전달
    emit('location-error', {
      error: errorMessage,
      code: err.code || 'UNKNOWN_ERROR'
    })
  }
}

// 권한 상태 확인 함수
const checkLocationPermissionStatus = async () => {
  if (!navigator.permissions) {
    return 'unknown'
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state // 'granted', 'denied', 'prompt'
  } catch (err) {
    return 'unknown'
  }
}

// 권한이 이미 거부된 상태일 때 안내
const showPermissionDeniedGuide = () => {
  const message = `위치 권한이 차단되어 있습니다.

권한을 다시 허용하려면:
1. 주소창 왼쪽의  아이콘을 클릭하세요
2. "위치" 설정을 "허용"으로 변경하세요
3. 페이지를 새로고침하고 다시 시도하세요

현재는 기본 위치(서울 시청)로 이동합니다.`

  alert(message)

  // 기본 위치로 이동
  handleUseDefaultLocation()
}

// 모달에서 재시도 선택 시
const handleRetryPermission = () => {
  console.log(' 모달에서 재시도 선택')
  showPermissionModal.value = false
  hasError.value = false

  // 브라우저 설정 변경 후 재시도하라는 메시지
  alert('브라우저 설정에서 위치 권한을 허용으로 변경한 후, 페이지를 새로고침하고 다시 시도해주세요.')

  // 기본 위치로 이동
  handleUseDefaultLocation()
}

// 모달에서 위치 권한 설정 방법 보기 선택 시
const handleShowInstructions = () => {
  console.log('ℹ 위치 권한 설정 방법 안내')
  showPermissionModal.value = false
}

// 기본 위치(서울 시청) 사용
const handleUseDefaultLocation = () => {
  hasError.value = false
  deniedCount.value = 0

  const defaultPosition = {
    lat: 37.5665,
    lng: 126.9780,
    accuracy: null,
    timestamp: Date.now(),
    isDefault: true
  }

  emit('location-success', {
    position: defaultPosition,
    isRealLocation: false,
    message: '기본 위치(서울 시청)로 설정되었습니다'
  })
}
</script>

<style scoped>
.current-location-btn {
  position: relative; /* 추가 */
  z-index: 1000;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  padding: 0;
  margin-top: 17px;
  left: 0px;
}

/* 버튼 배경 이미지 */
.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

/* 타겟 아이콘 이미지 */
.btn-target-icon {
  position: relative;
  width: 24px;
  height: 24px;
  object-fit: contain;
  z-index: 1;
  transition: transform 0.2s ease;
  pointer-events: none;
}

/* 호버 효과 */
.current-location-btn:hover {
  transform: translateY(-1px);
}

.current-location-btn:hover .btn-target-icon {
  transform: scale(1.1);
}

/* 클릭 효과 */
.current-location-btn:active {
  transform: translateY(0);
}

/* 비활성화 상태 */
.current-location-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  pointer-events: none;
}

/* 로딩 상태 */
.current-location-btn.loading .btn-target-icon {
  animation: spin 1s linear infinite;
}

/* 에러 상태 */
.current-location-btn.error {
  animation: shake 0.5s ease-in-out;
}

/* 회전 애니메이션 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 에러 시 흔들림 애니메이션 */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .current-location-btn {
    width: 36px;
    height: 36px;
    margin-top: 1vw;
  }

  .btn-target-icon {
    width: 22px;
    height: 22px;
  }
}

/* 접근성 */
.current-location-btn:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}
</style>