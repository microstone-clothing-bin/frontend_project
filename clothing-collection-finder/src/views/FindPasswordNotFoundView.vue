<template>
  <MainLayout>
    <div class="find-password-not-found-page-container">
      <div class="find-password-not-found-content">
        <div class="find-password-not-found-header">
          <h1 class="find-password-not-found-title">비밀번호 찾기</h1>
          <div class="find-password-not-found-divider-line"></div>
        </div>
        <!-- 실패 메시지 추가 -->
        <div class="find-password-not-found-message">
          <p class="find-password-not-found-text">
            회원님의 정보와 일치한 <strong class="find-password-bold-text">계정을 찾지 못하였습니다.</strong>
          </p>
          <p class="find-password-not-found-text">다시 시도해주세요.</p>
        </div>

        <!-- 로그인 화면으로 돌아가기 버튼 -->
        <div class="find-password-back-button" @click="goToLogin">
          <span class="find-password-back-btn-text">로그인 화면으로 돌아가기</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

export default {
  name: 'FindPasswordNotFoundView',
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
@import '@/styles/findpasswordnotfound/findpasswordnotfound-layout.css';
@import '@/styles/findpasswordnotfound/findpasswordnotfound-message.css';
@import '@/styles/findpasswordnotfound/findpasswordnotfound-button.css';

</style>