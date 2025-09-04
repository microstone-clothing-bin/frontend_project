<template>
  <MainLayout>
    <div class="signup-page-container">
    <div class="signup-content">
      <!-- 회원가입 제목 -->
      <div class="signup-header">
        <h1 class="signup-title">회원가입</h1>
        <!-- 구분선 -->
        <div class="divider-line"></div>
      </div>
      <!-- 아이디 라벨 -->
      <div class="input-label">
        <span class="label-text">아이디</span>
        <span class="required">*</span>
      </div>
      <div class="input-container">
        <input
            type="text"
            class="input-field"
            placeholder="아이디 입력"
            v-model="formData.userId"
        />
      </div>
      <!-- 아이디 설명 텍스트 -->
      <div class="input-description">
        6~12자리 이내 영문 소문자, 숫자 사용 가능
      </div>
      <!-- 중복 확인 버튼 -->
      <div class="duplicate-check-btn" @click="checkDuplicate">
        <img src="/src/assets/images/duplicate-button.png" alt="버튼 배경" class="btn-background" />
        <img src="/src/assets/images/duplicate-check.png" alt="중복확인 텍스트" class="btn-text-image" />
      </div>
      <!-- 비밀번호 라벨 -->
      <div class="input-label password-label">
        <span class="label-text">비밀번호</span>
        <span class="required">*</span>
      </div>
      <!-- 비밀번호 입력창 -->
      <div class="input-container password-container">
        <input
            :type="showPassword ? 'text' : 'password'"
            class="input-field"
            placeholder="비밀번호 입력"
            v-model="formData.password"
        />
        <img
            :src="showPassword ? eyeOpenImage : eyeImage"
            alt="비밀번호 보기"
            class="eye-icon"
            @click="togglePassword"
        />
      </div>
      <!-- 비밀번호 요구사항 (이미지 체크 + 간격) -->
      <div class="password-requirements">
        <div class="requirement-item">
          <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
          <span class="requirement-text">영문 대/소문자</span>
        </div>
        <div class="requirement-item">
          <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
          <span class="requirement-text">숫자</span>
        </div>
        <div class="requirement-item">
          <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
          <span class="requirement-text">특수문자</span>
        </div>
        <div class="requirement-item">
          <img src="/src/assets/images/check.png" alt="체크" class="check-icon" />
          <span class="requirement-text">8-20자</span>
        </div>
      </div>

      <!-- 비밀번호 확인 라벨 -->
      <div class="input-label password-confirm-label">
        <span class="label-text">비밀번호 확인</span>
        <span class="required">*</span>
      </div>

      <!-- 비밀번호 확인 입력창 -->
      <div class="input-container password-container">
        <input
            :type="showPasswordConfirm ? 'text' : 'password'"
            class="input-field"
            placeholder="비밀번호 재입력"
            v-model="formData.passwordConfirm"
        />
        <img
            :src="showPasswordConfirm ? eyeOpenImage : eyeImage"
            alt="비밀번호 보기"
            class="eye-icon"
            @click="togglePasswordConfirm"
        />
      </div>

      <!-- 닉네임 라벨 -->
      <div class="input-label nickname-label">
        <span class="label-text">닉네임</span>
        <span class="required">*</span>
      </div>

      <!-- 닉네임 입력창 -->
      <div class="input-container nickname-container">
        <input
            type="text"
            class="input-field"
            placeholder="닉네임 입력"
            v-model="formData.nickname"
        />
      </div>
      <!-- 닉네임 중복 확인 버튼 -->
      <div class="duplicate-check-btn nickname-duplicate-btn" @click="checkNicknameDuplicate">
        <img src="/src/assets/images/duplicate-button.png" alt="버튼 배경" class="btn-background" />
        <img src="/src/assets/images/duplicate-check.png" alt="중복확인 텍스트" class="btn-text-image" />
      </div>

      <!-- 이메일 라벨 -->
      <div class="input-label email-label">
        <span class="label-text">이메일</span>
        <span class="required">*</span>
      </div>

      <!-- 이메일 입력창 -->
      <div class="input-container email-container">
        <input
            type="email"
            class="input-field"
            placeholder="이메일 주소 입력"
            v-model="formData.email"
        />
      </div>
      <!-- 구분선 -->
      <div class="divider-line" style="margin-top: 3rem;"></div>

      <!-- 이용약관 동의 라벨 -->
      <div class="input-label terms-label">
        <span class="label-text">이용약관동의</span>
        <span class="required">*</span>
      </div>

      <!-- 전체 동의 체크박스 -->
      <div class="terms-agreement">
        <label class="agreement-item all-agreement">
          <input
              type="checkbox"
              v-model="formData.agreeAll"
              @change="handleAgreeAll"
              class="agreement-checkbox"
          />
          <img
              src="/src/assets/images/agree-button.png"
              alt="동의 버튼"
              class="agree-button-image"
          />
          <span class="agreement-text">전체 동의합니다.</span>
        </label>
      </div>

      <!--  회원가입 이용약관 동의 버튼 추가 -->
      <div class="individual-terms">
        <label class="agreement-item individual-agreement">
          <input
              type="checkbox"
              v-model="formData.agreeTerms"
              @change="updateAgreeAll"
              class="agreement-checkbox"
          />
          <img
              src="/src/assets/images/agree-button.png"
              alt="동의 버튼"
              class="agree-button-image"
          />
          <span class="agreement-text">회원가입 이용약관 동의</span>
          <span class="required-text">[필수]</span>
          <button type="button" class="view-details-btn" @click="showTermsModal">약관보기 ></button>
        </label>
      </div>

      <!--  개인정보 수집 및 이용 동의 추가 -->
      <div class="individual-privacy-terms">
        <label class="agreement-item individual-privacy-agreement">
          <input
              type="checkbox"
              v-model="formData.agreePrivacy"
              @change="updateAgreeAll"
              class="agreement-checkbox"
          />
          <img
              src="/src/assets/images/agree-button.png"
              alt="동의 버튼"
              class="agree-button-image"
          />
          <span class="agreement-text">개인정보 수집 및 이용 동의</span>
          <span class="required-text">[필수]</span>
          <button type="button" class="view-privacy-details-btn" @click="showPrivacyModal">약관보기 ></button>
        </label>
      </div>

      <!--  위치기반 서비스 이용약관 동의 추가 -->
      <div class="individual-location-terms">
        <label class="agreement-item individual-location-agreement">
          <input
              type="checkbox"
              v-model="formData.agreeLocation"
              @change="updateAgreeAll"
              class="agreement-checkbox"
          />
          <img
              src="/src/assets/images/agree-button.png"
              alt="동의 버튼"
              class="agree-button-image"
          />
          <span class="agreement-text">위치기반 서비스 이용약관 동의</span>
          <span class="required-text">[필수]</span>
          <button type="button" class="view-location-details-btn" @click="showLocationModal">약관보기 ></button>
        </label>
      </div>

      <!-- 만 14세 이상입니다 추가 -->
      <div class="individual-age-terms">
        <label class="agreement-item individual-age-agreement">
          <input
              type="checkbox"
              v-model="formData.agreeAge"
              @change="updateAgreeAll"
              class="agreement-checkbox"
          />
          <img
              src="/src/assets/images/agree-button.png"
              alt="동의 버튼"
              class="agree-button-image"
          />
          <span class="agreement-text">만 14세 이상입니다.</span>
          <span class="required-text">[필수]</span>
        </label>
      </div>

      <!-- 하단 여백 -->
      <div class="bottom-spacing"></div>
    </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import eyeImage from '../assets/images/login-eye.png'
import eyeOpenImage from '../assets/images/login-eye1.png'


export default {
  name: 'SignupView',
  components: {
    MainLayout
  }, data() {
    return {
      eyeImage,
      eyeOpenImage,
      formData: {
        userId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        email: '',
        agreeAll: false,           // 전체 동의
        agreeTerms: false,
        agreePrivacy: false,       //  개인정보 동의 추가
        agreeLocation: false,      // 위치기반 서비스 동의 추가
        agreeAge: false,           // 🆕 만 14세 이상 동의 추가
      },
      showPassword: false,        // 비밀번호 보이기/숨기기 상태
      showPasswordConfirm: false
    }
  }, methods: {
    checkDuplicate() {
      // 나중에 실제 중복 확인 기능 추가 예정
      console.log('중복 확인 버튼 클릭');
    },
    checkNicknameDuplicate() {        // 닉네임 중복 확인 함수 추가
      console.log('닉네임 중복 확인 버튼 클릭');
    },
    togglePassword() {           // 비밀번호 토글 함수 추가
      this.showPassword = !this.showPassword;
    },
    togglePasswordConfirm() {       // 비밀번호 확인 토글 추가
      this.showPasswordConfirm = !this.showPasswordConfirm;
    }
  }
}
</script>

<style scoped>
@import '../styles/signup/signup-layout.css';
@import '../styles/signup/signup-userid.css';
@import '../styles/signup/signup-password.css';
@import '../styles/signup/signup-password-confirm.css';
@import '../styles/signup/signup-nickname.css';
@import '../styles/signup/signup-email.css';
@import '../styles/signup/signup-agreebutton.css';
@import '../styles/signup/signup-terms-privacy.css';
@import '../styles/signup/signup-terms-location.css';
@import '../styles/signup/signup-terms-age.css';
@import '../styles/signup/signup-agreement-common.css';


/* 빈공간 */
.bottom-spacing {
  height: 3rem;
}
</style>