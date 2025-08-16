<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 닫기 버튼 -->
      <button class="close-btn" @click="closeModal">✕</button>

      <!-- 위치 아이콘 -->
      <div class="location-icon">
        <div class="location-pin">📍</div>
      </div>

      <!-- 제목 -->
      <h2 class="modal-title">위치 서비스 사용기능이<br>허용되어 있지 않습니다.</h2>

      <!-- 설명 -->
      <div class="modal-description">
        <p>기본 값인 서울시의 정보로 지도가 노출되며,</p>
        <p>위치 서비스를 허용 하여 제 접속하시거나,</p>
        <p>지도 위치를 변경한 뒤 지도 하단의 버튼을 클릭하면</p>
        <p>해당 위치 주변 여행정보를 확인할 수 있습니다.</p>
      </div>

      <!-- 버튼들 -->
      <div class="modal-buttons">
        <button class="cancel-btn" @click="useDefaultLocation">
          위치 서비스 허용 방법 보기
        </button>
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

const emit = defineEmits(['close', 'show-instructions'])

const closeModal = () => {
  emit('close')
}

const useDefaultLocation = () => {
  emit('show-instructions')
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
  color: #666;
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

.location-icon {
  margin-bottom: 24px;
}

.location-pin {
  width: 80px;
  height: 80px;
  background-color: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto;
  position: relative;
}

.location-pin::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid #ff6b6b;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.modal-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.modal-description p {
  margin: 0 0 4px 0;
}

.modal-buttons {
  display: flex;
  justify-content: center;
}

.cancel-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #495057;
  min-width: 200px;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .modal-content {
    margin: 20px;
    padding: 24px 20px 20px;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-description {
    font-size: 13px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .cancel-btn {
    width: 100%;
  }
}
</style>