<template>
  <MainLayout>
    <div class="reset-password-page-container">
      <div class="reset-password-content">
        <div class="reset-password-header">
          <h1 class="reset-password-title">비밀번호 재설정</h1>
          <div class="reset-password-divider-line"></div>
        </div>

        <!-- 새 비밀번호 라벨 -->
        <div class="input-label new-password-label">
          <span class="label-text">새 비밀번호</span>
          <span class="required">*</span>
        </div>

        <!-- 새 비밀번호 입력창 -->
        <div class="input-container new-password-container">
          <input
              :type="showNewPassword ? 'text' : 'password'"
              class="input-field"
              placeholder="새로운 비밀번호 입력"
              v-model="formData.newPassword"
          />
          <img
              :src="showNewPassword ? eyeOpenImage : eyeImage"
              alt="비밀번호 보기"
              class="eye-icon"
              @click="toggleNewPassword"
          />
        </div>

        <!-- 비밀번호 요구사항 -->
        <div class="password-requirements">
          <div class="requirement-item">
            <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
            <span class="requirement-text">영문 대/소문자</span>
          </div>
          <div class="requirement-item">
            <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
            <span class="requirement-text">숫자</span>
          </div>
          <div class="requirement-item">
            <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
            <span class="requirement-text">특수문자</span>
          </div>
          <div class="requirement-item">
            <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
            <span class="requirement-text">8~20자</span>
          </div>
        </div>
        <!-- 비밀번호 확인 라벨 -->
        <div class="input-label password-confirm-label">
          <span class="label-text">비밀번호 확인</span>
          <span class="required">*</span>
        </div>

        <!-- 비밀번호 확인 입력창 -->
        <div class="input-container password-confirm-container">
          <input
              :type="showPasswordConfirm ? 'text' : 'password'"
              class="input-field"
              placeholder="비밀번호 확인"
              v-model="formData.passwordConfirm"
          />
          <img
              :src="showPasswordConfirm ? eyeOpenImage : eyeImage"
              alt="비밀번호 보기"
              class="eye-icon"
              @click="togglePasswordConfirm"
          />
        </div>
        <!-- 다음 버튼 -->
        <div class="next-button" @click="handleNext">
          <img src="/src/assets/images/next-button.png" alt="버튼 배경" class="next-btn-background" />
          <span class="next-btn-text">다음</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import eyeImage from '../assets/images/login-eye.png'
import eyeOpenImage from '../assets/images/login-eye1.png'

export default {
  name: 'ResetPasswordView',
  components: {
    MainLayout
  },
  data() {
    return {
      eyeImage,
      eyeOpenImage,
      formData: {
        newPassword: '',
        passwordConfirm: ''
      },
      showNewPassword: false,
      showPasswordConfirm: false
    }
  },
  methods: {
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    togglePasswordConfirm() {
      this.showPasswordConfirm = !this.showPasswordConfirm;
    },
    handleNext() {  // 추가
      console.log('다음 버튼 클릭:', this.formData);
      // 나중에 실제 다음 단계 로직 추가
      // 예: this.$router.push({ name: 'nextStep' });
    }
  }
}
</script>

<style scoped>
@import '../styles/resetpassword/resetpassword-layout.css';
@import '../styles/resetpassword/resetpassword-input-label.css';
@import '../styles/resetpassword/resetpassword-new-password.css';
@import '../styles/resetpassword/resetpassword-eye-icon.css';
@import '../styles/resetpassword/resetpassword-requirements.css';
@import '../styles/resetpassword/resetpassword-confirm.css';
@import '../styles/resetpassword/resetpassword-button.css';

</style>