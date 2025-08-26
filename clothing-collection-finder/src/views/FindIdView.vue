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
          />
        </div>
        <!-- 다음 버튼 -->
        <div class="find-id-next-button" @click="handleNextClick">
          <span class="find-id-btn-text">다음</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

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
      }
    }
  },
  methods: {
    handleNextClick() {
      // 나중에 아이디 찾기 로직 추가 예정
      console.log('다음 버튼 클릭');
      console.log('닉네임:', this.formData.nickname);
      console.log('이메일:', this.formData.email);
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

</style>