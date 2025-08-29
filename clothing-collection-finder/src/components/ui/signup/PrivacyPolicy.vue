<template>
  <div class="privacy-container">
    <div class="privacy-content">
      <div class="privacy-section">
        <h4 class="section-title">1. 수집하는 개인정보 항목</h4>
        <div class="section-content">
          <p>회사는 회원가입 및 서비스 이용 과정에서 다음과 같은 개인정보를 수집합니다.</p>
          <div class="sub-section">
            <p><strong>필수 항목:</strong></p>
            <div class="sub-list">
              <p>• 아이디, 비밀번호, 닉네임, 이메일</p>
            </div>
          </div>
          <div class="sub-section">
            <p><strong>서비스 이용 중 자동 수집 항목:</strong></p>
            <div class="sub-list">
              <p>• 접속 IP, 방문 일시, 이용 기록, 쿠키 (로그 분석 및 보안 목적)</p>
            </div>
          </div>
          <p>※ 커뮤니티 이용 과정에서 사용자가 자발적으로 입력하는 정보(게시글, 나눔 위치 등)는 이용자가 공개한 것으로 간주됩니다.</p>
        </div>
      </div>

      <div class="privacy-section">
        <h4 class="section-title">2. 개인정보 수집 및 이용 목적</h4>
        <div class="section-content">
          <p>회사는 수집한 개인정보를 다음의 목적에 한하여 사용합니다.</p>
          <div class="sub-list">
            <p>• 회원 가입 및 서비스 이용자 식별, 로그인 기능 제공</p>
            <p>• 커뮤니티 내 글 작성 및 나눔 게시글 운영</p>
            <p>• 의류수거함 위치 기반 안내 서비스 제공</p>
            <p>• 공지사항, 서비스 관련 안내 전달</p>
            <p>• 부정이용 방지, 고객 문의 응대 및 민원 처리</p>
            <p>• 서비스 개선 및 통계 분석</p>
          </div>
        </div>
      </div>

      <div class="privacy-section">
        <h4 class="section-title">3. 개인정보 보유 및 이용 기간</h4>
        <div class="section-content">
          <p>• 회원 탈퇴 시까지 또는 수집·이용 목적이 달성될 때까지 보관 후 지체 없이 파기</p>
          <p>• 단, 다음의 경우 관련 법령에 따라 보관 기간 보관</p>
          <div class="sub-list">
            <p>• 「전자상거래법」 계약 또는 청약철회 기록: 5년</p>
            <p>• 「통신비밀보호법」 로그인 기록(IP 등): 3개월</p>
          </div>
        </div>
      </div>

      <div class="privacy-section">
        <h4 class="section-title">4. 개인정보 제공 및 위탁</h4>
        <div class="section-content">
          <p>• 회사는 원칙적으로 개인정보를 외부에 제공하지 않으며,</p>
          <p style="margin-left: 15px;">필요한 경우 사전에 명확히 고지하고 동의를 받습니다.</p>
          <p>• 서비 운영 등 기술적 관리를 위탁하는 경우, 수탁사 정보를 이용약관 또는 별도 고지사항을 통해 안내합니다.</p>
        </div>
      </div>

      <div class="privacy-section">
        <h4 class="section-title">5. 이용자의 권리</h4>
        <div class="section-content">
          <p>• 이용자는 언제든지 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.</p>
          <p>• 회원 탈퇴 시에는 모든 개인정보가 즉시 삭제됩니다(단, 법적 보관 항목 제외).</p>
        </div>
      </div>

      <div class="privacy-section">
        <h4 class="section-title">6. 개인정보 수집 동의 거부 권리 및 불이익</h4>
        <div class="section-content">
          <p>• 회원은 개인정보 제공 및 이용 동의를 거부할 수 있습니다.</p>
          <p>• 단, 필수 항목에 대한 동의를 거부할 경우, 서비스 이용(회원가입 등)이 제한될 수 있습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-container {
  width: 100%;
  max-width: 899px;
  margin: 0 auto;
}

.privacy-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: #FAFAFA;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}

.privacy-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #6029b7;
  margin-bottom: 10px;
  margin-top: 0;
}

.section-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333333;
}

.section-content > p {
  margin-bottom: 8px;
  margin-top: 0;
}

.sub-section {
  margin-bottom: 10px;
}

.sub-section p {
  margin-bottom: 5px;
  margin-top: 0;
}

.sub-list {
  margin-left: 15px;
}

.sub-list p {
  margin-bottom: 5px;
  margin-top: 0;
}

/* 스크롤바 스타일 */
.privacy-content::-webkit-scrollbar {
  width: 8px;
}

.privacy-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.privacy-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.privacy-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .privacy-content {
    padding: 15px;
    max-height: 350px;
  }

  .section-title {
    font-size: 15px;
  }

  .section-content {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .privacy-content {
    padding: 12px;
    max-height: 300px;
  }

  .section-title {
    font-size: 14px;
  }

  .section-content {
    font-size: 12px;
  }

  .privacy-container {
    max-width: 95%;
  }
}
</style>