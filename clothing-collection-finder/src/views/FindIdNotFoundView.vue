<template>
  <MainLayout>
    <div class="find-id-not-found-page-container">
      <div class="find-id-not-found-content">
        <div class="find-id-not-found-header">
          <h1 class="find-id-not-found-title">아이디 찾기</h1>
          <div class="find-id-not-found-divider-line"></div>
        </div>
        <!-- 실패 메시지 추가 -->
        <div class="find-id-not-found-message">
          <p class="find-id-not-found-text">
            회원님의 정보와 일치한 <strong class="find-id-bold-text">계정을 찾지 못하였습니다.</strong>
          </p>
          <p class="find-id-not-found-text">다시 시도해주세요.</p>
        </div>

        <!-- 로그인 화면으로 돌아가기 버튼 -->
        <div class="find-id-back-button" @click="goToLogin">
          <span class="find-id-back-btn-text">로그인 화면으로 돌아가기</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

export default {
  name: 'FindIdNotFoundView',
  components: {
    MainLayout
  },
  methods: {
    goToLogin() {
      window.location.href = '/login'  // ✅ 수정
    }
  }
}
</script>

<style scoped>
@import '@/styles/findidnotfound/findidnotfound-layout.css';
@import '@/styles/findidnotfound/findidnotfound-message.css';
@import '@/styles/findidnotfound/findidnotfound-button.css';
</style>