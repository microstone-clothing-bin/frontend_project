<template>
  <MainLayout>
    <div class="find-id-success-page-container">
      <div class="find-id-success-content">
        <div class="find-id-success-header">
          <h1 class="find-id-success-title">아이디 찾기</h1>
          <div class="find-id-success-divider-line"></div>
        </div>
        <!-- 성공 메시지 추가 -->
        <div class="find-id-success-message">
          <p class="find-id-success-text">
            입력하신 정보와 일치하는 아이디 목록입니다.
          </p>
        </div>

        <!-- 로그인 화면으로 돌아가기 버튼 -->
        <div class="find-id-success-back-button" @click="goToLogin">
          <span class="find-id-success-back-btn-text">로그인 화면으로 돌아가기</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

export default {
  name: 'FindIdSuccessView',
  components: {
    MainLayout
  },
  methods: {
    goToLogin() {
      // 로그인 페이지로 이동
      window.location.href = '/login';
    }
  }
}
</script>

<style scoped>
@import '../styles/findidsuccess/findidsuccess-layout.css';
@import '../styles/findidsuccess/findidsuccess-message.css';
@import '../styles/findidsuccess/findidsuccess-button.css';

</style>