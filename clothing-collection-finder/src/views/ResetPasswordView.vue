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
        <div class="next-button" @click="handleNext" :class="{ disabled: isLoading }">
          <img src="/src/assets/images/next-button.png" alt="버튼 배경" class="next-btn-background" />
          <span class="next-btn-text">{{ isLoading ? '처리 중...' : '다음' }}</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import authService from '@/services/authService'
import eyeImage from '../assets/images/login-eye.png'
import eyeOpenImage from '../assets/images/login-eye1.png'
import checkImage from '../assets/images/check.png'
import checkGreenImage from '../assets/images/check-green.png'
import checkRedImage from '../assets/images/check-red.png'

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
      showPasswordConfirm: false,
      isLoading: false,
      userId: '',
      email: ''
    }
  },

  mounted() {
    // 쿼리에서 아이디와 이메일 가져오기
    this.userId = this.$route.query.userId || ''
    this.email = this.$route.query.email || ''

    // 쿼리 정보가 없으면 비밀번호 찾기 페이지로 리다이렉트
    if (!this.userId || !this.email) {
      alert('잘못된 접근입니다.')
      this.$router.push({ name: 'findPassword' })
    }
  },

  computed: {
    // 비밀번호 요구사항 실시간 체크
    passwordChecks() {
      const password = this.formData.newPassword
      return {
        hasCase: /[A-Z]/.test(password) && /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        hasLength: password.length >= 8 && password.length <= 20
      }
    },

    // 모든 비밀번호 조건 만족 여부
    isPasswordValid() {
      return Object.values(this.passwordChecks).every(check => check === true)
    },

    // 비밀번호 확인 불일치 메시지 표시 조건
    shouldShowPasswordMismatch() {
      return this.formData.passwordConfirm &&
          this.formData.newPassword &&
          this.formData.newPassword !== this.formData.passwordConfirm
    }
  },

  methods: {
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword
    },

    togglePasswordConfirm() {
      this.showPasswordConfirm = !this.showPasswordConfirm
    },

    async handleNext() {
      // 로딩 중이면 중복 실행 방지
      if (this.isLoading) return

      // 입력값 검증
      if (!this.formData.newPassword) {
        alert('새 비밀번호를 입력해주세요.')
        return
      }

      if (!this.isPasswordValid) {
        alert('비밀번호가 요구사항을 만족하지 않습니다.')
        return
      }

      if (!this.formData.passwordConfirm) {
        alert('비밀번호 확인을 입력해주세요.')
        return
      }

      if (this.formData.newPassword !== this.formData.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      try {
        this.isLoading = true

        const response = await authService.resetPasswordWithoutLogin(
            this.userId,
            this.email,
            this.formData.newPassword
        )

        if (response.status === 'success') {
          alert('비밀번호가 변경되었습니다.')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('비밀번호 재설정 실패:', error)
        alert(error.message || '비밀번호 재설정에 실패했습니다.')
      } finally {
        this.isLoading = false
      }
    },

    // 체크 이미지 결정
    getCheckImage(checkType) {
      if (!this.formData.newPassword) {
        return this.checkImage
      }

      if (this.passwordChecks[checkType]) {
        return this.checkGreenImage
      } else {
        return this.checkRedImage
      }
    },

    // 텍스트 색상 클래스 결정
    getTextClass(checkType) {
      if (!this.formData.newPassword) {
        return 'default-text'
      }

      if (this.passwordChecks[checkType]) {
        return 'valid-text'
      } else {
        return 'invalid-text'
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

.next-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>