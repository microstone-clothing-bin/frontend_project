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
      <div v-if="userIdCheckResult === 'default'" class="input-description">
        6~12자리 이내 영문 소문자, 숫자 사용 가능
      </div>

      <!-- 성공 메시지 -->
      <div v-if="userIdCheckResult === 'available'" class="userid-success-message">
        사용 가능한 아이디입니다.
      </div>

      <!-- 에러 메시지 -->
      <div v-if="userIdCheckResult === 'unavailable'" class="userid-error-message">
        사용 불가능한 아이디입니다.
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
      <!-- 비밀번호 요구사항 (동적 체크) -->
      <div class="password-requirements">
        <div class="requirement-item">
          <img :src="getCheckImage('hasCase')" alt="체크" class="check-icon" />
          <span class="requirement-text" :class="getTextClass('hasCase')">
      영문 대/소문자
    </span>
        </div>

        <div class="requirement-item">
          <img :src="getCheckImage('hasNumber')" alt="체크" class="check-icon" />
          <span class="requirement-text" :class="getTextClass('hasNumber')">
      숫자
    </span>
        </div>

        <div class="requirement-item">
          <img :src="getCheckImage('hasSpecial')" alt="체크" class="check-icon" />
          <span class="requirement-text" :class="getTextClass('hasSpecial')">
      특수문자
    </span>
        </div>

        <div class="requirement-item">
          <img :src="getCheckImage('hasLength')" alt="체크" class="check-icon" />
          <span class="requirement-text" :class="getTextClass('hasLength')">
      8-20자
    </span>
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
      <!-- 비밀번호 확인 메시지 영역 (고정 높이) -->
      <div class="password-confirm-message-area">
        <!-- 비밀번호 불일치 메시지 -->
        <div v-if="shouldShowPasswordMismatch" class="password-mismatch-message">
          비밀번호가 일치하지 않습니다.
        </div>
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
      <!-- 닉네임 메시지 영역 (고정 높이) -->
      <div class="nickname-message-area">
      <!-- 닉네임 성공 메시지 -->
      <div v-if="nicknameCheckResult === 'available'" class="nickname-success-message">
        사용 가능한 닉네임입니다.
      </div>

      <!-- 닉네임 에러 메시지 -->
      <div v-if="nicknameCheckResult === 'unavailable'" class="nickname-error-message">
        사용 불가능한 닉네임입니다.
      </div>
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

      <!-- 가입하기 버튼 -->
      <div class="signup-submit-container">
        <button type="button" @click="handleSignup" class="signup-submit-btn">
          <span class="signup-btn-text">가입하기</span>
        </button>
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
import authService from '../services/authService.js'
import { validationUtils } from '../utils/validationUtils.js'
import checkImage from '../assets/images/check.png'         // 기본 회색 체크
import checkGreenImage from '../assets/images/check-green.png'  // 초록색 체크 추가
import checkRedImage from '../assets/images/check-red.png'      // 빨간색 체크 추가



export default {
  name: 'SignupView',
  components: {
    MainLayout
  }, data() {
    return {    // 이미지 파일
      eyeImage, // 비밀번호 숨김 상태 눈 아이콘
      eyeOpenImage, // 비밀번호 보임 상태 눈 아이콘
      checkImage, // 기본 회색 체크 아이콘 (비밀번호 요구사항용)
      checkGreenImage, // 초록색 체크 아이콘 (조건 만족 시)
      checkRedImage,    // 빨간색 체크 아이콘 (조건 불만족 시)
      formData: {  // 폼 입력 데이터
        userId: '', // 사용자 아이디
        password: '', // 비밀번호
        passwordConfirm: '', // 비밀번호 확인
        nickname: '', // 닉네임
        email: '',  // 이메일
        agreeAll: false,          // 전체 약관 동의 여부
        agreeTerms: false,         // 회원가입 이용약관 동의 여부
        agreePrivacy: false,       // 개인정보 수집 및 이용 동의 여부
        agreeLocation: false,      // 위치기반 서비스 이용약관 동의 여부
        agreeAge: false,           // 만 14세 이상 동의 여부
      },  // UI 상태 관리
      showPassword: false,        // 비밀번호 입력창 보이기/숨기기 상태
      showPasswordConfirm: false, // 비밀번호 확인창 보이기/숨기기 상태
      isLoading: false,     // 전역 로딩 상태 (API 호출 중 표시)
      // 유효성 검증 관련
      errors: {}, // 각 필드별 에러 메시지 저장
      duplicateChecks: {    // 중복 확인 완료 상태
        userId: false,      // 아이디 중복 확인 완료 여부
        nickname: false     // 닉네임 중복 확인 완료 여부
      },  // 동적 메시지 상태
      userIdCheckResult: 'default',  // 아이디 중복 확인 결과
      nicknameCheckResult: 'default' // 닉네임 중복 확인 결과
    }
  },

  computed: {  //  computed 섹션
    // 아이디 상태별 설명 텍스트 반환
    userIdDescriptionText() {
      switch (this.userIdCheckResult) {
        case 'available':
          return '사용 가능한 아이디입니다.'
        case 'unavailable':
          return '사용 불가능한 아이디입니다.'
        default:
          return '6~12자리 이내 영문 소문자, 숫자 사용 가능'
      }
    },
    // 비밀번호 요구사항 실시간 체크
    passwordChecks() {
      const password = this.formData.password
      return {
        hasCase: /[A-Z]/.test(password) && /[a-z]/.test(password), // 대소문자 포함
        hasNumber: /\d/.test(password), // 숫자 포함
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),  // 특수문자 포함
        hasLength: password.length >= 8 && password.length <= 20 // 길이 조건
      }
    },
    // 비밀번호 불일치 시 메시지 표시 여부
    shouldShowPasswordMismatch() {
      return this.formData.passwordConfirm &&
          this.formData.password &&
          this.formData.password !== this.formData.passwordConfirm
    }
  }, // <- computed 끝
  methods: { // === 중복 확인 관련 ===
    // 아이디 중복 확인 API 호출
    async checkDuplicate() {
      // 아이디 유효성 검사 먼저 실행
      const validation = validationUtils.validateUserId(this.formData.userId)
      if (!validation.isValid) {
        alert(validation.message)
        return
      }

      try {
        this.isLoading = true
        const response = await authService.checkUserIdDuplicate(this.formData.userId)

        // 백엔드 응답에 맞게 수정
        if (response === 'ok') {  // response.isAvailable → response === 'ok'
          this.userIdCheckResult = 'available'
          this.duplicateChecks.userId = true
        } else if (response === 'duplicate') {  // 명시적으로 처리
          this.userIdCheckResult = 'unavailable'
          this.duplicateChecks.userId = false
        }
      } catch (error) {
        alert(error.message)
        this.userIdCheckResult = 'unavailable'
        this.duplicateChecks.userId = false
      } finally {
        this.isLoading = false
      }
    },

// === 비밀번호 요구사항 UI 관련 ===
    getCheckImage(checkType) { // 비밀번호 조건별 체크 이미지 반환
      if (!this.formData.password) {
        return this.checkImage  // 입력 전: 기본 회색
      }

      if (this.passwordChecks[checkType]) {
        return this.checkGreenImage  // 조건 만족: 초록색
      } else {
        return this.checkRedImage    // 조건 불만족: 빨간색
      }
    },

    // 비밀번호 조건별 텍스트 색상 클래스 반환
    getTextClass(checkType) {
      if (!this.formData.password) {
        return 'default-text'  // 입력 전: 기본 색상
      }

      // 조건 체크 후 클래스 결정
      if (this.passwordChecks[checkType]) {
        return 'valid-text'    // 조건 만족: 초록색
      } else {
        return 'invalid-text'  // 조건 불만족: 빨간색
      }
    },

    // 닉네임 중복 확인 API 호출
    async checkNicknameDuplicate() {
      // 유효성 검사 먼저 실행
      const validation = validationUtils.validateNickname(this.formData.nickname)
      if (!validation.isValid) {
        alert(validation.message)
        return
      }

      try {
        this.isLoading = true
        const response = await authService.checkNicknameDuplicate(this.formData.nickname)

        // 백엔드 응답에 맞게 수정
        if (response === 'ok') {  // response.isAvailable → response === 'ok'
          this.nicknameCheckResult = 'available'
          this.duplicateChecks.nickname = true
          this.errors.nickname = ''
        } else if (response === 'duplicate') {  // 명시적으로 처리
          this.nicknameCheckResult = 'unavailable'
          this.duplicateChecks.nickname = false
        }
      } catch (error) {
        alert(error.message)
        this.nicknameCheckResult = 'unavailable'
        this.duplicateChecks.nickname = false
      } finally {
        this.isLoading = false
      }
    },
    // === UI 토글 관련 ===
    togglePassword() { // 비밀번호 보기/숨기기 토글
      this.showPassword = !this.showPassword
    },

    togglePasswordConfirm() {  // 비밀번호 확인 보기/숨기기 토글
      this.showPasswordConfirm = !this.showPasswordConfirm
    },
    // === 약관 페이지 이동 ===
    // 이용약관 페이지로 이동
    showTermsModal() {
      this.$router.push('/signup/terms')
    },
    // 개인정보 약관 페이지로 이동
    showPrivacyModal() {
      this.$router.push('/signup/privacy')
    },
    // 위치기반 서비스 약관 페이지로 이동
    showLocationModal() {
      this.$router.push('/signup/location')
    },
    // === 약관 동의 관리 ===
    // 전체 동의 체크박스 처리
    handleAgreeAll() {
      const isChecked = this.formData.agreeAll
      this.formData.agreeTerms = isChecked    // 모든 개별 약관을
      this.formData.agreePrivacy = isChecked  // 전체 동의 상태와
      this.formData.agreeLocation = isChecked // 동일하게 설정
      this.formData.agreeAge = isChecked
    },
    // 개별 약관 변경 시 전체 동의 상태 업데이트
    updateAgreeAll() {
      this.formData.agreeAll = (        // 모든 개별 약관이 체크되었을 때만
          this.formData.agreeTerms &&   // 전체 동의 체크박스도 체크
          this.formData.agreePrivacy &&
          this.formData.agreeLocation &&
          this.formData.agreeAge
      )
    },
    // === 유효성 검증 ===
    // 필드별 실시간 유효성 검사
    validateField(fieldName) {
      switch (fieldName) {
        case 'userId':
          const userIdValidation = validationUtils.validateUserId(this.formData.userId)
          this.errors.userId = userIdValidation.isValid ? '' : userIdValidation.message
          if (!userIdValidation.isValid) this.duplicateChecks.userId = false // 유효하지 않으면 중복확인 초기화
          break
        case 'password':
          const passwordValidation = validationUtils.validatePassword(this.formData.password)
          this.errors.password = passwordValidation.isValid ? '' : passwordValidation.message
          break
        case 'passwordConfirm':
          const confirmValidation = validationUtils.validatePasswordConfirm(
              this.formData.password,
              this.formData.passwordConfirm
          )
          this.errors.passwordConfirm = confirmValidation.isValid ? '' : confirmValidation.message
          break
        case 'nickname':
          const nicknameValidation = validationUtils.validateNickname(this.formData.nickname)
          this.errors.nickname = nicknameValidation.isValid ? '' : nicknameValidation.message
          if (!nicknameValidation.isValid) this.duplicateChecks.nickname = false // 유효하지 않으면 중복확인 초기화
          break
        case 'email':
          const emailValidation = validationUtils.validateEmail(this.formData.email)
          this.errors.email = emailValidation.isValid ? '' : emailValidation.message
          break
      }
    },
    // === 회원가입 처리 ===
    // 최종 회원가입 API 호출
    async handleSignup() {
      // 전체 폼 유효성 검사
      const validation = validationUtils.validateSignupForm(this.formData)
      if (!validation.isValid) {
        alert(validation.errors[0]) // 첫 번째 에러 메시지 표시
        return
      }
      // 중복 확인 완료 여부 체크
      if (!this.duplicateChecks.userId) {
        alert('아이디 중복 확인을 해주세요.')
        return
      }
      if (!this.duplicateChecks.nickname) {
        alert('닉네임 중복 확인을 해주세요.')
        return
      }
      try {
        this.isLoading = true
        const response = await authService.signup(this.formData)
        // 회원가입 성공 시 로그인 페이지로 이동
        alert('회원가입이 완료되었습니다!')
        this.$router.push('/login')
      } catch (error) {  // 회원가입 실패
        alert(error.message)
      } finally {
        this.isLoading = false
      }
    }
  },

  watch: {
    // === 입력값 변경 감지 및 상태 초기화 ===
    // 아이디 입력 변경 시: 중복확인 상태 초기화 + 유효성 검사
    'formData.userId'() {
      this.userIdCheckResult = 'default'     // 중복확인 결과 초기화
      this.validateField('userId')  // 실시간 유효성 검사
    },
    // 비밀번호 입력 변경 시: 실시간 유효성 검사
    'formData.password'() {
      this.validateField('password')
    },
    // 비밀번호 확인 입력 변경 시: 일치 여부 검사
    'formData.passwordConfirm'() {
      this.validateField('passwordConfirm')
    },
    // 닉네임 입력 변경 시: 중복확인 상태 초기화 + 유효성 검사
    'formData.nickname'() {
      this.nicknameCheckResult = 'default'
      this.validateField('nickname')
    },
    // 이메일 입력 변경 시: 실시간 유효성 검사
    'formData.email'() {
      this.validateField('email')
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
@import '../styles/signup/signup-submit-button.css';


/* 빈공간 */
.bottom-spacing {
  height: 3rem;
}
</style>