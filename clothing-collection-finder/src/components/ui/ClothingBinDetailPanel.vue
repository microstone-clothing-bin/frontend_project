<template>
  <div class="detail-panel">
    <!-- 패널 내용 (헤더 완전 제거) -->
    <div class="panel-content">
      <!-- 닫기 버튼 -->
      <button
          class="close-button"
          @click="handleClose"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
      >
        CLOSE
      </button>

      <p style="color: black; font-size: 16px; margin-top: 20px;">패널 내용이 여기에 들어갑니다</p>
    </div>
  </div>
</template>

<script setup>
// 이벤트 정의
const emit = defineEmits(['close'])

// 디버깅용 함수들
const handleClose = () => {
  console.log('🔴 CLOSE 버튼 클릭됨!')
  emit('close')  // $emit 대신 emit 사용
}

const handleMouseDown = () => {
  console.log('🔴 마우스 다운!')
}

const handleMouseUp = () => {
  console.log('🔴 마우스 업!')
}

// Props (사이드바 상태 받기)
const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.detail-panel {
  position: fixed;
  top: 90px;
  left: v-bind('props.sidebarCollapsed ? "50px" : "415px"');
  width: 320px;
  height: calc(100vh - 105px);
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
  transition: left 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 닫기 버튼 */
.close-button {
  width: 60px;
  height: 32px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  position: relative;
  pointer-events: auto;
}

.close-button:hover {
  background: #e9ecef;
  color: #495057;
  transform: scale(1.02);
}

.close-button:active {
  transform: scale(0.98);
}

/* 패널 내용 */
.panel-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 20px;
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