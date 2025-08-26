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
          />
        </div>
        <!-- 다음 버튼 -->
        <div class="find-password-next-button" @click="handleNextClick">
          <span class="find-password-btn-text">다음</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

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
      }
    }
  },
  methods: {
    handleNextClick() {
      // 나중에 비밀번호 찾기 로직 추가 예정
      console.log('다음 버튼 클릭');
      console.log('아이디:', this.formData.userid);
      console.log('이메일:', this.formData.email);
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

</style>