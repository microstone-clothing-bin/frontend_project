<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 닫기 버튼 -->
      <button class="close-btn" @click="closeModal">✕</button>

      <!-- 제목 -->
      <h2 class="modal-title">위치 서비스 사용기능이<br>허용되어 있지 않습니다.</h2>

      <!-- 설명 -->
      <div class="modal-description">
        <p>기본 값인 서울시의 정보로 지도가 노출되며,</p>
        <p>위치 서비스를 허용 하여 접속하세요</p>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px 24px 24px;
  max-width: 480px;
  width: 90%;
  position: relative;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9E9E9E;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  margin-bottom: 20px;
  line-height: 1.4;
  margin-top: 0;
}

.modal-description {
  color: #9E9E9E;
  font-size: 16px;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  line-height: 1.6;
  margin-bottom: 0;
}

.modal-description p {
  margin: 0 0 4px 0;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    padding: 24px 20px 20px;
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-description {
    font-size: 14px;
  }
}
</style>