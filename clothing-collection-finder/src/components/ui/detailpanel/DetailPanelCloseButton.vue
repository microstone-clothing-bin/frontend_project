<template>
  <button
      class="close-x-button"
      @click="handleClose"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
  >
    <img :src="closeButtonImage" alt="닫기" class="close-icon" />
  </button>
</template>

<script setup>
// assets 이미지 import
import closeButtonImageSrc from '@/assets/images/detailpanelbtn-cross.png'

// 이벤트 정의
const emit = defineEmits(['close'])

// 이미지 경로 설정
const closeButtonImage = closeButtonImageSrc

// 클릭 이벤트 핸들러
const handleClose = () => {
  emit('close')
}

const handleMouseDown = () => {
  // 필요시 구현
}

const handleMouseUp = () => {
  // 필요시 구현
}
</script>

<style scoped>
/* X 닫기 버튼 (PNG 이미지 사용) */
.close-x-button {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;  /* 완전 투명 배경 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10001;
  padding: 0;
  /* 그림자 효과 완전 제거 */
}

.close-x-button:hover {
  transform: scale(1.1);
  background: transparent;  /* 호버시에도 투명 배경 */
}

.close-x-button:active {
  transform: scale(0.95);
}

.close-icon {
  width: 18px;  /* 아이콘 크기 조정 */
  height: 18px;
  object-fit: contain;
  /* 아이콘 그림자 필터도 제거 */
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .close-x-button {
    top: 10px;
    right: 10px;
  }
}
</style>