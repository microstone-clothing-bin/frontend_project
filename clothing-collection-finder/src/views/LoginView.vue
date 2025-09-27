<template>
  <MainLayout>
    <div class="login-content">
      <div class="logo-container">
        <img :src="loginLogoImage" alt="DropIt 로고" class="logo" />
      </div>

      <!-- 로그인 폼 -->
      <div class="login-form">
        <!-- 아이디 입력 -->
        <div class="input-container">
          <input
              type="text"
              v-model="username"
              placeholder="아이디"
              class="login-input"
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="input-container">
          <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="비밀번호"
              class="login-input"
          />
          <img :src="showPassword ? eyeOpenImage : eyeImage" alt="비밀번호 보기" class="eye-icon" @click="togglePassword" />
        </div>
        <!-- 로그인 버튼 -->
        <div class="button-container">
          <button type="button" @click="handleLogin" class="login-button">
            <span class="button-text">로그인</span>
          </button>
        </div>
        <div class="auth-links">
          <a @click="goToSignup" class="auth-link">회원가입</a>
          <a @click="goToFindId" class="auth-link">아이디 찾기</a>
          <a @click="goToFindPassword" class="auth-link">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import rectangleImage from '../assets/images/login-rectangle.png'
import eyeImage from '../assets/images/login-eye.png'
import eyeOpenImage from '../assets/images/login-eye1.png'
import loginLogoImage from '@/assets/images/login-logo.png'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'LoginView',
  components: {
    MainLayout
  },
  data() {
    return {
      loginLogoImage,
      rectangleImage,
      eyeImage,
      eyeOpenImage,
      username: '',
      password: '',
      showPassword: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        this.errorMessage = '아이디와 비밀번호를 입력해주세요.'
        return
      }

      try {
        this.isLoading = true
        this.errorMessage = ''

        // authStore 사용으로 변경
        const authStore = useAuthStore()
        const result = await authStore.login({
          userId: this.username,
          password: this.password
        })

        if (result && result.success) {
          console.log('로그인 성공!')
          console.log('authStore 상태:', authStore.isLoggedIn) // 디버깅용

          setTimeout(() => {
            this.$router.push('/')
          }, 100)
        } else {
          this.errorMessage = result?.message || '로그인에 실패했습니다.'
        }
      } catch (error) {
        console.error('로그인 에러:', error)
        this.errorMessage = error.message || '로그인 중 오류가 발생했습니다.'
      } finally {
        this.isLoading = false
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    goToFindId() {
      this.$router.push('/find-id');
    },
    goToFindPassword() {
      this.$router.push('/find-password');
    }
  }
}
</script>

<style scoped>
@import '../styles/login/login-layout.css';
@import '../styles/login/login-inputs.css';
@import '../styles/login/login-button.css';
@import '../styles/login/login-links.css';

/* 로고 컨테이너 스타일 */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.logo {
  width: 300px;
  height: 190px;
}

/* 반응형 처리 */
@media (max-width: 768px) {
  .logo {
    width: 300px;
    height: 190px;
    padding: 16px;
  }
}
</style>