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

        <!-- 비밀번호 요구사항 (동적 체크) -->
        <div class="password-requirements">
          <div class="requirement-item">
            <img :src="getCheckImage('hasCase')" alt="체크" class="check-icon" />
            <span class="requirement-text" :class="getTextClass('hasCase')">
      영문 대/소문자
    </span>
          </div>

          <div class="requirement-item">
            <img :src="getCheckImage('hasNumber')" alt="체크" class="check-icon" />
            <span class="requirement-text" :class="getTextClass('hasNumber')">
      숫자
    </span>
          </div>

          <div class="requirement-item">
            <img :src="getCheckImage('hasSpecial')" alt="체크" class="check-icon" />
            <span class="requirement-text" :class="getTextClass('hasSpecial')">
      특수문자
    </span>
          </div>

          <div class="requirement-item">
            <img :src="getCheckImage('hasLength')" alt="체크" class="check-icon" />
            <span class="requirement-text" :class="getTextClass('hasLength')">
      8~20자
    </span>
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

        <!-- 비밀번호 확인 메시지 영역 (고정 높이) -->
        <div class="password-confirm-message-area">
          <!-- 비밀번호 불일치 메시지 -->
          <div v-if="shouldShowPasswordMismatch" class="password-mismatch-message">
            비밀번호가 일치하지 않습니다.
          </div>
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
import checkImage from '../assets/images/check.png'         // 기본 회색 체크
import checkGreenImage from '../assets/images/check-green.png'  // 초록색 체크
import checkRedImage from '../assets/images/check-red.png'      // 빨간색 체크

export default {
  name: 'ResetPasswordView',
  components: {
    MainLayout
  },
  data() {
    return {
      eyeImage,
      eyeOpenImage,
      checkImage,
      checkGreenImage,
      checkRedImage,
      formData: {
        newPassword: '',
        passwordConfirm: ''
      },
      showNewPassword: false,
      showPasswordConfirm: false
    }
  },

  computed: {
    // 비밀번호 요구사항 실시간 체크
    passwordChecks() {
      const password = this.formData.newPassword
      return {
        hasCase: /[A-Z]/.test(password) && /[a-z]/.test(password),    // 대소문자 포함
        hasNumber: /\d/.test(password),                               // 숫자 포함
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),        // 특수문자 포함
        hasLength: password.length >= 8 && password.length <= 20     // 길이 조건
      }
    },
    // 비밀번호 확인 불일치 메시지 표시 조건 추가
    shouldShowPasswordMismatch() {
      // 비밀번호 확인란에 입력이 있고, 새 비밀번호와 다를 때만 표시
      return this.formData.passwordConfirm &&
          this.formData.newPassword &&
          this.formData.newPassword !== this.formData.passwordConfirm
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
    },

    // === 비밀번호 요구사항 UI 관련 추가 ===
    // 체크 이미지 결정
    getCheckImage(checkType) {
      if (!this.formData.newPassword) {
        return this.checkImage                     // 입력 전: 기본 회색
      }

      if (this.passwordChecks[checkType]) {
        return this.checkGreenImage                // 조건 만족: 초록색
      } else {
        return this.checkRedImage                  // 조건 불만족: 빨간색
      }
    },

    // 텍스트 색상 클래스 결정
    getTextClass(checkType) {
      if (!this.formData.newPassword) {
        return 'default-text'                      // 입력 전: 기본 색상
      }

      if (this.passwordChecks[checkType]) {
        return 'valid-text'                        // 조건 만족: 초록색
      } else {
        return 'invalid-text'                      // 조건 불만족: 빨간색
      }
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