<!-- MapZoomOutButton.vue ← 지도 축소 버튼 vue -->
<template>
  <div>
    <!-- 지도 축소 버튼 -->
    <button
        @click="handleZoomOut"
        class="map-zoom-out-btn"
        title="지도 축소"
        :disabled="isMinZoom"
    >
      <!-- 버튼 배경 이미지 (확대 버튼과 동일) -->
      <img src="@/assets/images/mapzoombtn-background.png" class="btn-background" alt="">

      <!-- - 아이콘 이미지 -->
      <img src="@/assets/images/mapzoombtn-background-minus.png" class="btn-minus-icon" alt="축소">
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props 정의
const props = defineProps({
  map: {
    type: Object,
    default: null
  },
  currentZoom: {
    type: Number,
    default: 10
  },
  minZoom: {
    type: Number,
    default: 6
  }
})

// 이벤트 정의
const emit = defineEmits(['zoom-changed'])

// 최소 줌 레벨 체크
const isMinZoom = computed(() => props.currentZoom <= props.minZoom)

// 축소 버튼 클릭 핸들러
const handleZoomOut = () => {
  if (!props.map || isMinZoom.value) {
    console.warn('지도 축소 불가능 - 최소 줌 레벨 도달')
    return
  }

  try {
    const newZoom = Math.max(props.currentZoom - 1, props.minZoom)
    props.map.setZoom(newZoom, true) // 애니메이션 적용

    console.log(`지도 축소: ${props.currentZoom} → ${newZoom}`)

    // 부모 컴포넌트에 줌 변경 알림
    emit('zoom-changed', {
      type: 'zoom-out',
      oldZoom: props.currentZoom,
      newZoom: newZoom
    })
  } catch (error) {
    console.error('지도 축소 중 오류:', error)
  }
}
</script>

<style scoped>
.map-zoom-out-btn {
  position: absolute;
  top: 697px;    /* 확대 버튼(20px) + 버튼 높이(40px) + 간격(10px) */
  right: 20px;
  z-index: 1000;
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  padding: 0;
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

/* - 아이콘 이미지 */
.btn-minus-icon {
  position: relative;
  width: 20px;
  height: 20px;
  object-fit: contain;
  z-index: 1;
  transition: transform 0.2s ease;
  pointer-events: none;
}

/* 호버 효과 */
.map-zoom-out-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.map-zoom-out-btn:hover:not(:disabled) .btn-minus-icon {
  transform: scale(1.1);
}

/* 클릭 효과 */
.map-zoom-out-btn:active:not(:disabled) {
  transform: scale(0.95);
}

/* 비활성화 상태 */
.map-zoom-out-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
  pointer-events: none;
}

.map-zoom-out-btn:disabled .btn-minus-icon {
  opacity: 0.6;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .map-zoom-out-btn {
    width: 36px;
    height: 36px;
    top: 61px;    /* 모바일에서 확대 버튼 아래 */
    right: 15px;
  }

  .btn-minus-icon {
    width: 18px;
    height: 18px;
  }
}

/* 태블릿 대응 */
@media (max-width: 1024px) {
  .map-zoom-out-btn {
    top: 68px;    /* 태블릿에서 확대 버튼 아래 */
    right: 18px;
  }
}

/* 접근성 */
.map-zoom-out-btn:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}
</style>