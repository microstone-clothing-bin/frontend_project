<template>
  <MainLayout>
    <div class="mypage-page-container">
    <div class="mypage-content">
      <!-- 프로필 이미지 영역 -->
      <div class="profile-image-container">
        <div class="profile-image-circle">
          <img
              v-if="uploadedImage"
              :src="uploadedImage"
              alt="업로드된 이미지"
              class="profile-image"
          />
          <img
              v-else
              src="/src/assets/images/mypage-image.png"
              alt="프로필 이미지"
              class="profile-image"
          />
        </div>
      </div>

      <!-- 별도 원과 카메라 아이콘 영역 -->
      <div class="separate-elements">
        <div class="ellipse-wrapper" @click="triggerFileInput">
          <img src="/src/assets/images/mypage-ellipse.png" alt="원" class="ellipse-image" />
          <img src="/src/assets/images/mypage-camera.png" alt="카메라" class="camera-image" />
        </div>
      </div>

      <!-- 구분선 -->
      <div class="divider-line"></div>

      <!-- 회원정보 섹션 -->
      <div class="member-info-section">
        <h2 class="section-title">회원정보</h2>
      </div>

      <!-- 아이디 라벨 -->
      <div class="input-label mypage-id-label">
        <span class="label-text">아이디</span>
      </div>

      <!-- 아이디 입력창 -->
      <div class="input-container mypage-id-container">
        <input
            type="text"
            class="input-field"
            placeholder="아이디를 입력하세요"
            v-model="userInfo.userId"
        />
      </div>

      <!-- 이메일 라벨 -->
      <div class="input-label mypage-email-label">
        <span class="label-text">이메일</span>
      </div>

      <!-- 이메일 입력창 -->
      <div class="input-container mypage-email-container">
        <input
            type="email"
            class="input-field"
            placeholder="이메일을 입력하세요"
            v-model="userInfo.email"
        />
      </div>

      <!-- 닉네임 라벨 -->
      <div class="input-label mypage-nickname-label">
        <span class="label-text">닉네임</span>
      </div>

      <!-- 닉네임 입력창 -->
      <div class="input-container mypage-nickname-container">
        <input
            type="text"
            class="input-field"
            placeholder="닉네임을 입력하세요"
            v-model="userInfo.nickname"
        />
      </div>

      <!-- 추가할 구분선 -->
      <div class="divider-line additional-divider"></div>

      <!-- 회원정보 수정 섹션 (위쪽에 위치) -->
      <div class="member-edit-section">
        <h2 class="section-title">회원정보 수정</h2>
      </div>

      <!-- 비밀번호 라벨 -->
      <div class="input-label mypage-password-label">
        <span class="label-text">비밀번호</span>
      </div>

      <!-- 비밀번호 입력창 -->
      <div class="input-container mypage-password-container">
        <input
            type="password"
            class="input-field"
            placeholder="비밀번호를 입력하세요"
            v-model="userInfo.password"
        />
      </div>

      <!-- 비밀번호 확인 라벨 -->
      <div class="input-label mypage-passwordcheck-label">
        <span class="label-text">비밀번호 확인</span>
      </div>

      <!-- 비밀번호 확인 입력창 -->
      <div class="input-container mypage-passwordcheck-container">
        <input
            type="password"
            class="input-field"
            placeholder="새 비밀번호 재입력"
            v-model="userInfo.passwordcheck"
        />
      </div>

      <!-- 변경된 정보 저장 버튼 -->
      <div class="mypage-storage-button" @click="handlePasswordChange">
        <span class="mypage-btn-storage">변경된 정보 저장</span>
      </div>

      <!-- 추가할 구분선  -->
      <div class="divider-line additional-divider"></div>

      <!-- 계정 보안 섹션  -->
      <div class="member-edit-section">
        <h2 class="section-title">계정 보안</h2>
      </div>

      <!-- 로그아웃 버튼 -->
      <div class="mypage-logout-button" @click="handleLogout">
        <span class="mypage-btn-logout">로그아웃</span>
      </div>

      <!-- 회원 탈퇴 버튼 -->
      <div class="mypage-delete-my-account-button" @click="handleDeleteAccount">
        <span class="mypage-btn-delete-my-account">회원 탈퇴</span>
      </div>

      <!-- 숨겨진 파일 입력 -->
      <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileUpload"
          style="display: none;"
      />
    </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import authService from '../services/authService.js'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'MyPageView',
  components: {
    MainLayout
  },
  setup() {  // 추가
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      uploadedImage: null,
      userInfo: {
        userId: '',
        email: '',
        nickname: '',
        password: '',
        passwordcheck: ''
      },
      isLoading: false,
      authStore: useAuthStore()
    }
  },

  async mounted() {

    try {
      // localStorage에서 userId 확인
      const savedUser = localStorage.getItem('auth_user')
      if (!savedUser) {
        alert('로그인이 필요합니다.')
        this.$router.push('/login')
        return
      }

      // 백엔드에서 최신 정보 가져오기
      const response = await authService.getMyPageInfo()

      if (response.status === 'success') {
        this.userInfo.userId = response.id
        this.userInfo.email = response.email
        this.userInfo.nickname = response.nickname

        // 프로필 이미지 설정
        if (response.profileImageUrl) {

          this.uploadedImage = response.profileImageUrl



          // ✅ 이 줄 추가!!!
          this.authStore.updateProfile({
            profileImageUrl: response.profileImageUrl
          })


        }
      }
    } catch (error) {

      alert('사용자 정보를 불러오는데 실패했습니다.')
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          try {
            this.isLoading = true



            // 미리보기용
            const reader = new FileReader();
            reader.onload = (e) => {
              this.uploadedImage = e.target.result;
            };
            reader.readAsDataURL(file);

            // 백엔드에 업로드
            const result = await authService.uploadProfile(file)



            if (result.status === 'success') {
              // ✅ 이렇게 직접 접근!
              this.authStore.updateProfile({
                profileImageUrl: result.profileImageUrl
              })

              this.uploadedImage = result.profileImageUrl

              alert('프로필 이미지가 업로드되었습니다.')
            }
          } catch (error) {
            console.error('❌ 에러 발생:', error)
            alert('이미지 업로드 실패: ' + error.message)
          } finally {
            this.isLoading = false
          }
        } else {
          alert('이미지 파일만 업로드 가능합니다.');
        }
      }
    },

    // 비밀번호 변경
    async handlePasswordChange() {
      // 비밀번호를 입력하지 않은 경우
      if (!this.userInfo.password && !this.userInfo.passwordcheck) {
        alert('새 비밀번호를 입력하세요.')
        return
      }

      // 비밀번호만 입력한 경우
      if (!this.userInfo.password || !this.userInfo.passwordcheck) {
        alert('비밀번호와 비밀번호 확인을 모두 입력해주세요.')
        return
      }

      // 비밀번호 불일치
      if (this.userInfo.password !== this.userInfo.passwordcheck) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      try {
        this.isLoading = true

        //  authStore의 resetPassword 사용 (로그아웃 포함)
        await this.authStore.resetPassword(this.userInfo.password)

        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.')
        this.$router.push('/login') // 로그인 페이지로 이동

      } catch (error) {
        console.error('비밀번호 변경 실패:', error)
        alert('비밀번호 변경 실패: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },

    // 로그아웃
    async handleLogout() {
      try {
        await this.authStore.logout()  // authStore 사용
        alert('로그아웃되었습니다.')
        this.$router.push('/login')    // 로그인 페이지로
      } catch (error) {
        console.error('로그아웃 에러:', error)
        alert('로그아웃에 실패했습니다.')
      }
    },

    // 회원 탈퇴
    async handleDeleteAccount() {
      if (confirm('정말로 회원 탈퇴하시겠습니까?')) {
        try {
          this.isLoading = true

          // ✅ authStore의 deleteAccount 사용 (로그아웃 포함)
          await this.authStore.deleteAccount()

          alert('회원 탈퇴가 완료되었습니다.')
          this.$router.push('/') // 홈으로 이동

        } catch (error) {
          console.error('회원 탈퇴 실패:', error)
          alert('회원 탈퇴 실패: ' + error.message)
        } finally {
          this.isLoading = false
        }
      }
    }
  }
}
</script>

<style scoped>
@import '../styles/mypage/mypage-layout.css';
@import '../styles/mypage/mypage-profile-image.css';
@import '../styles/mypage/mypage-member-section.css';
@import '../styles/mypage/mypage-userid.css';
@import '../styles/mypage/mypage-email.css';
@import '../styles/mypage/mypage-nickname.css';
@import '../styles/mypage/mypage-password.css';
@import '../styles/mypage/mypage-passwordcheck.css';
@import '../styles/mypage/mypage-scrollbar.css';
@import '../styles/mypage/mypage-storage-button.css';
@import '../styles/mypage/mypage-logout-button.css';
@import '../styles/mypage/mypage-delete-my-account-button.css';


</style>