<!-- MapZoomInButton.vue ← 지도 확대 버튼 vue-->
<template>
  <div>
    <!-- 지도 확대 버튼 -->
    <button
        @click="handleZoomIn"
        class="map-zoom-in-btn"
        title="지도 확대"
        :disabled="isMaxZoom"
    >
      <!-- 버튼 배경 이미지 -->
      <img src="@/assets/images/mapzoombtn-background.png" class="btn-background" alt="">

      <!-- + 아이콘 이미지 -->
      <img src="@/assets/images/mapzoombtn-background-plus.png" class="btn-plus-icon" alt="확대">
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
  maxZoom: {
    type: Number,
    default: 21
  }
})

// 이벤트 정의
const emit = defineEmits(['zoom-changed'])

// 최대 줌 레벨 체크
const isMaxZoom = computed(() => props.currentZoom >= props.maxZoom)

// 확대 버튼 클릭 핸들러
const handleZoomIn = () => {
  if (!props.map || isMaxZoom.value) {
    return
  }

  try {
    const newZoom = Math.min(props.currentZoom + 1, props.maxZoom)
    props.map.setZoom(newZoom, true) // 애니메이션 적용


    // 부모 컴포넌트에 줌 변경 알림
    emit('zoom-changed', {
      type: 'zoom-in',
      oldZoom: props.currentZoom,
      newZoom: newZoom
    })
  } catch (error) {

  }
}
</script>

<style scoped>
.map-zoom-in-btn {
  position: relative; /* 추가 */
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

/* + 아이콘 이미지 */
.btn-plus-icon {
  position: relative;
  width: 20px;
  height: 20px;
  object-fit: contain;
  z-index: 1;
  transition: transform 0.2s ease;
  pointer-events: none;
}

/* 호버 효과 */
.map-zoom-in-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.map-zoom-in-btn:hover:not(:disabled) .btn-plus-icon {
  transform: scale(1.1);
}

/* 클릭 효과 */
.map-zoom-in-btn:active:not(:disabled) {
  transform: scale(0.95);
}

/* 비활성화 상태 */
.map-zoom-in-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
  pointer-events: none;
}

.map-zoom-in-btn:disabled .btn-plus-icon {
  opacity: 0.6;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .map-zoom-in-btn {
    width: 36px;
    height: 36px;
  }

  .btn-plus-icon {
    width: 18px;
    height: 18px;
  }
}

/* 태블릿 대응 */
@media (max-width: 1024px) {
  .map-zoom-in-btn {

  }
}

/* 접근성 */
.map-zoom-in-btn:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}
</style>