<!-- src/components/ui/modals/LoginRequiredModal.vue -->
<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <!-- 모달 헤더 -->
        <div class="modal-header">
          <h2 class="modal-title">로그인이 필요합니다</h2>
        </div>

        <!-- 모달 바디 -->
        <div class="modal-body">
          <p class="modal-message">
            즐겨찾기 기능은 로그인 후 이용 가능합니다.<br>
            로그인 페이지로 이동하시겠습니까?
          </p>
        </div>

        <!-- 모달 푸터 (버튼) -->
        <div class="modal-footer">
          <button class="modal-btn cancel-btn" @click="handleCancel">
            취소
          </button>
          <button class="modal-btn login-btn" @click="handleLogin">
            로그인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close', 'login'])

const handleCancel = () => {
  emit('close')
}

const handleLogin = () => {
  emit('login')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
/* 모달 오버레이 (배경 어둡게) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999998;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 모달 컨테이너 */
.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
  z-index: 999999;

}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모달 콘텐츠 */
.modal-content {
  padding: 32px 24px 24px;

}

/* 모달 헤더 */
.modal-header {
  margin-bottom: 20px;
  text-align: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  margin: 0;
}

/* 모달 바디 */
.modal-body {
  margin-bottom: 28px;
  text-align: center;
}

.modal-message {
  font-size: 15px;
  font-weight: 400;
  color: #666;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
}

/* 모달 푸터 (버튼 영역) */
.modal-footer {
  display: flex;
  gap: 12px;
}

/* 버튼 공통 스타일 */
.modal-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 취소 버튼 */
.cancel-btn {
  background: #F5F5F5;
  color: #666;
}

.cancel-btn:hover {
  background: #E8E8E8;
}

.cancel-btn:active {
  transform: scale(0.98);
}

/* 로그인 버튼 */
.login-btn {
  background: #6029B7;
  color: white;
}

.login-btn:hover {
  background: #5020A0;
}

.login-btn:active {
  transform: scale(0.98);
}

/* 버튼 포커스 스타일 */
.modal-btn:focus {
  outline: 2px solid #6029B7;
  outline-offset: 2px;
}
</style>