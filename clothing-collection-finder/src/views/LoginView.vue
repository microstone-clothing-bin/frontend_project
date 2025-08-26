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
            <img :src="loginTextImage" alt="로그인" class="button-text" />
          </button>
        </div>
        <div class="auth-links">
          <a href="#" class="auth-link">회원가입</a>
          <a href="#" class="auth-link">아이디 찾기</a>
          <a href="#" class="auth-link">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<script>

import MainLayout from '../layouts/MainLayout.vue'
import logoImage from '../assets/images/DropIt-logo.png'
import rectangleImage from '../assets/images/login-rectangle.png'
import loginTextImage from '../assets/images/login.png'
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
      loginTextImage,
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
    },
    togglePassword() {          // ← 이 함수 추가!
      this.showPassword = !this.showPassword
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