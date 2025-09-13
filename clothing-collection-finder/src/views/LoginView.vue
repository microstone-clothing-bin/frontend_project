<template>
  <MainLayout>
    <div class="login-content">
      <img :src="logoImage" alt="DropIt 로고" class="logo" />

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
        <!-- 로그인 버튼 - 여기에 추가! -->
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
import logoImage from '../assets/images/DropIt-logo.png'
import rectangleImage from '../assets/images/login-rectangle.png'
import eyeImage from '../assets/images/login-eye.png'
import eyeOpenImage from '../assets/images/login-eye1.png'

export default {
  name: 'LoginView',
  components: {
    MainLayout
  },
  data() {
    return {
      logoImage,
      rectangleImage,
      eyeImage,
      eyeOpenImage,
      username: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    handleLogin() {
      console.log('로그인 시도:', {
        username: this.username,
        password: this.password
      })
      // 홈페이지로 이동
      this.$router.push('/');
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
</style>