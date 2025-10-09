<template>
  <MainLayout>
    <div class="find-id-page-container">
      <div class="find-id-content">
        <div class="find-id-header">
          <h1 class="find-id-title">아이디 찾기</h1>
          <div class="find-id-divider-line"></div>
        </div>

        <!-- 닉네임 라벨 -->
        <div class="find-id-nickname-label">
          <span class="find-id-label-text">닉네임</span>
          <span class="find-id-required">*</span>
        </div>

        <!-- 닉네임 입력창 -->
        <div class="find-id-input-container">
          <input
              type="text"
              class="find-id-input-field"
              placeholder="닉네임 입력"
              v-model="formData.nickname"
              @keyup.enter="handleNextClick"
          />
        </div>

        <!-- 이메일 라벨 -->
        <div class="find-id-email-label">
          <span class="find-id-label-text">이메일</span>
          <span class="find-id-required">*</span>
        </div>

        <!-- 이메일 입력창 -->
        <div class="find-id-email-container">
          <input
              type="email"
              class="find-id-input-field"
              placeholder="이메일 주소 입력"
              v-model="formData.email"
              @keyup.enter="handleNextClick"
          />
        </div>

        <!-- 다음 버튼 -->
        <div class="find-id-next-button" @click="handleNextClick" :class="{ disabled: isLoading }">
          <span class="find-id-btn-text">{{ isLoading ? '처리 중...' : '다음' }}</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import authService from '@/services/authService'

export default {
  name: 'FindIdView',
  components: {
    MainLayout
  },
  data() {
    return {
      formData: {
        nickname: '',
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
      if (!this.formData.nickname.trim()) {
        alert('닉네임을 입력해주세요.')
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

        const response = await authService.findUserId(
            this.formData.nickname,
            this.formData.email
        )

        // 성공 시 - 찾은 아이디를 쿼리로 전달
        if (response.status === 'success' && response.userId) {
          this.$router.push({
            name: 'findIdSuccess',
            query: { userId: response.userId }
          })
        }
      } catch (error) {
        console.error('아이디 찾기 실패:', error)

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
@import '../styles/findid/findid-layout.css';
@import '../styles/findid/findid-nickname.css';
@import '../styles/findid/findid-email.css';
@import '../styles/findid/findid-button.css';
@import '../styles/findid/findid-input.css';

.find-id-next-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>