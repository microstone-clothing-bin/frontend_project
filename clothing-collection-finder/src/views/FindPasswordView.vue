<template>
  <MainLayout>
    <div class="find-password-page-container">
      <div class="find-password-content">
        <div class="find-password-header">
          <h1 class="find-password-title">비밀번호 찾기</h1>
          <div class="find-password-divider-line"></div>
        </div>
        <!-- 아이디 라벨 -->
        <div class="find-password-userid-label">
          <span class="find-password-label-text">아이디</span>
          <span class="find-password-required">*</span>
        </div>

        <!-- 아이디 입력창 -->
        <div class="find-password-userid-container">
          <input
              type="text"
              class="find-password-input-field"
              placeholder="아이디 입력"
              v-model="formData.userid"
              @keyup.enter="handleNextClick"
          />
        </div>

        <!-- 이메일 라벨 -->
        <div class="find-password-email-label">
          <span class="find-password-label-text">이메일</span>
          <span class="find-password-required">*</span>
        </div>

        <!-- 이메일 입력창 -->
        <div class="find-password-email-container">
          <input
              type="email"
              class="find-password-input-field"
              placeholder="이메일 주소 입력"
              v-model="formData.email"
              @keyup.enter="handleNextClick"
          />
        </div>
        <!-- 다음 버튼 -->
        <div class="find-password-next-button" @click="handleNextClick" :class="{ disabled: isLoading }">
          <span class="find-password-btn-text">{{ isLoading ? '처리 중...' : '다음' }}</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import authService from '@/services/authService'

export default {
  name: 'FindPasswordView',
  components: {
    MainLayout
  },
  data() {
    return {
      formData: {
        userid: '',
        email: ''
      },
      isLoading: false
    }
  },
  methods: {
    async handleNextClick() {
      // 로딩 중이면 중복 실행 방지
      if (this.isLoading) return

      // 입력값 검증
      if (!this.formData.userid.trim()) {
        alert('아이디를 입력해주세요.')
        return
      }

      if (!this.formData.email.trim()) {
        alert('이메일을 입력해주세요.')
        return
      }

      // 이메일 형식 검증
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(this.formData.email)) {
        alert('올바른 이메일 형식이 아닙니다.')
        return
      }

      try {
        this.isLoading = true

        const response = await authService.findPassword(
            this.formData.userid,
            this.formData.email
        )

        // 성공 시 - 비밀번호 재설정 페이지로 이동 (아이디, 이메일 전달)
        if (response.status === 'success') {
          this.$router.push({
            name: 'resetPassword',
            query: {
              userId: this.formData.userid,
              email: this.formData.email
            }
          })
        }
      } catch (error) {
        console.error('비밀번호 찾기 실패:', error)

        // 모든 에러를 alert로 표시
        alert(error.message || '일치하는 계정을 찾을 수 없습니다.')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
@import '../styles/findpassword/findpassword-layout.css';
@import '../styles/findpassword/findpassword-userid.css';
@import '../styles/findpassword/findpassword-email.css';
@import '../styles/findpassword/findpassword-button.css';
@import '../styles/findpassword/findpassword-input.css';

.find-password-next-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>