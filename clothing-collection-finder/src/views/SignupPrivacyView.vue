<template>
  <MainLayout>
    <div class="signup-privacy-page-container">
      <div class="signup-privacy-content">
        <div class="privacy-header">
          <h1 class="privacy-title">[개인정보 수집 및 이용 동의서]</h1>
        </div>
        <!-- 구분선 추가 -->
        <div class="signup-privacy-divider-line"></div>

        <div class="privacy-body">
          <!-- 1. 수집하는 개인정보 항목 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">1. 수집하는 개인정보 항목</h3>
            <p class="privacy-text">회사는 회원가입 및 서비스 이용 과정에서 다음과 같은 개인정보를 수집합니다.</p>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">필수 항목:</p>
              </div>
              <div class="privacy-sublist">
                <div class="privacy-subitem">
                  <span class="privacy-bullet">•</span>
                  <p class="privacy-text">아이디, 비밀번호, 닉네임, 이메일</p>
                </div>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">서비스 이용 중 자동 수집 항목:</p>
              </div>
              <div class="privacy-sublist">
                <div class="privacy-subitem">
                  <span class="privacy-bullet">•</span>
                  <p class="privacy-text">접속 IP, 방문 일시, 이용 기록, 쿠키 (로그 분석 및 보안 목적)</p>
                </div>
              </div>
            </div>
            <p class="privacy-text">※ 커뮤니티 이용 과정에서 사용자가 자발적으로 입력하는 정보(게시글, 나눔 위치 등)는 이용자가 공개한 것으로 간주됩니다.</p>
          </div>

          <!-- 2. 개인정보 수집 및 이용 목적 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">2. 개인정보 수집 및 이용 목적</h3>
            <p class="privacy-text">회사는 수집한 개인정보를 다음의 목적에 한하여 사용합니다.</p>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">회원 가입 및 서비스 이용자 식별, 로그인 기능 제공</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">커뮤니티 내 글 작성 및 나눔 게시글 운영</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">의류수거함 위치 기반 안내 서비스 제공</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">공지사항, 서비스 관련 안내 전달</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">부정이용 방지, 고객 문의 응대 및 민원 처리</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">서비스 개선 및 통계 분석</p>
              </div>
            </div>
          </div>

          <!-- 3. 개인정보 보유 및 이용 기간 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">3. 개인정보 보유 및 이용 기간</h3>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">회원 탈퇴 시까지 또는 수집 이용 목적이 달성될 때까지 보관 후 지체 없이 파기</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">단, 다음의 경우 관련 법령에 따라 일정 기간 보관</p>
              </div>
              <div class="privacy-sublist">
                <div class="privacy-subitem">
                  <span class="privacy-bullet">•</span>
                  <p class="privacy-text">「전자상거래법」 계약 또는 청약철회 기록: 5년</p>
                </div>
                <div class="privacy-subitem">
                  <span class="privacy-bullet">•</span>
                  <p class="privacy-text">「통신비밀보호법」 로그인 기록(IP 등): 3개월</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 개인정보 제공 및 위탁 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">4. 개인정보 제공 및 위탁</h3>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">회사는 원칙적으로 개인정보를 외부에 제공하지 않으며,</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">필요한 경우 사전에 명확히 고지하고 동의를 받습니다.</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">서버 운영 등 기술적 관리를 위탁하는 경우, 수탁사 정보를 이용약관 또는 별도 고지사항을 통해 안내합니다.</p>
              </div>
            </div>
          </div>

          <!-- 5. 이용자의 권리 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">5. 이용자의 권리</h3>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">회원 탈퇴 시에는 모든 개인정보가 즉시 삭제됩니다(단, 법적 보관 항목 제외).</p>
              </div>
            </div>
          </div>

          <!-- 6. 개인정보 수집 동의 거부 권리 및 불이익 -->
          <div class="privacy-section">
            <h3 class="privacy-section-title">6. 개인정보 수집 동의 거부 권리 및 불이익</h3>
            <div class="privacy-list">
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">회원은 개인정보 제공 및 이용 동의를 거부할 수 있습니다.</p>
              </div>
              <div class="privacy-item">
                <span class="privacy-bullet">•</span>
                <p class="privacy-text">단, 필수 항목에 대한 동의를 거부할 경우, 서비스 이용(회원가입 등)이 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>
          <!-- 하단 구분선 추가 -->
          <div class="signup-privacy-bottom-divider-line"></div>

          <!-- 확인 버튼 추가 -->
          <div class="signup-privacy-agree-button" @click="handleAgree">
            <span class="signup-privacy-agree-btn-text">확인</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

export default {
  name: 'SignupPrivacyView',
  components: {
    MainLayout
  },
  methods: {
    handleAgree() {
      // 확인 버튼 클릭 시 회원가입 페이지로 돌아가기
      this.$router.push('/signup');
      console.log('개인정보 약관 동의 완료');
    }
  }
}
</script>

<style scoped>
@import '../styles/signupprivacy/privacy-layout.css';
@import '../styles/signupprivacy/privacy-content.css';
@import '../styles/signupprivacy/privacy-dividers.css';
@import '../styles/signupprivacy/privacy-confirm-button.css';


</style>