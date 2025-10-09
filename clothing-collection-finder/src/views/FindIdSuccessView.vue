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
            입력하신 정보와 일치하는 아이디입니다.
          </p>
          <div class="found-user-id">
            {{ foundUserId }}
          </div>
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
  data() {
    return {
      foundUserId: ''
    }
  },
  mounted() {
    // 쿼리에서 찾은 아이디 가져오기
    this.foundUserId = this.$route.query.userId || '아이디를 찾을 수 없습니다.'
  },
  methods: {
    goToLogin() {
      window.location.href = '/login'  // ✅ 수정
    }
  }
}
</script>

<style scoped>
@import '../styles/findidsuccess/findidsuccess-layout.css';
@import '../styles/findidsuccess/findidsuccess-message.css';
@import '../styles/findidsuccess/findidsuccess-button.css';

.found-user-id {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
}
</style>