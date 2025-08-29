<template>
  <div class="terms-container">
    <div class="terms-content">
      <div class="terms-section">
        <h4 class="section-title">제1조 (목적)</h4>
        <p class="section-content">
          이 약관은 [Drop it(드랍잇)] (이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을
          규정함을 목적으로 합니다.
        </p>
      </div>

      <div class="terms-section">
        <h4 class="section-title">제2조 (용어의 정의)</h4>
        <div class="section-content">
          <p>1. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.</p>
          <p>2. "아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 문자와 숫자의 조합을 말합니다.</p>
          <p>3. "비밀번호"란 회원이 설정한 아이디와 일치하는지 확인하고 회원의 개인정보 보호를 위해 설정한 문자와 숫자의 조합을 말합니다.</p>
          <p>4. "닉네임"이란 서비스 내에서 회원을 식별하기 위해 사용되는 별칭입니다.</p>
          <p>5. "이메일"이란 회사가 회원에게 고지사항 및 서비스 안내 등을 제공하기 위해 수집하는 전자우편 주소를 말합니다.</p>
        </div>
      </div>

      <div class="terms-section">
        <h4 class="section-title">제3조 (약관의 효력 및 변경)</h4>
        <div class="section-content">
          <p>1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.</p>
          <p>2. 회사는 필요 시 약관을 변경할 수 있으며, 변경 시 공지사항을 통해 사전 고지합니다.</p>
          <p>3. 변경된 약관에 동의하지 않을 경우 회원은 탈퇴할 수 있으며, 별도의 이의 제기 없이 서비스를 계속 이용할 경우 변경 약관에 동의한 것으로 간주합니다.</p>
        </div>
      </div>

      <div class="terms-section">
        <h4 class="section-title">제4조 (회원가입 및 정보 수집)</h4>
        <div class="section-content">
          <p>1. 회원가입은 본 약관에 동의하고, 회사가 요청하는 필수 정보를 정확히 입력하여 신청한 후 회사가 이를 승낙함으로써 성립됩니다.</p>
          <p>2. 회원이 가입 시 회사가 수집하는 정보는 다음과 같습니다.</p>
          <div class="sub-list">
            <p>• 아이디 (필수)</p>
            <p>• 비밀번호 (필수)</p>
            <p>• 닉네임 (필수)</p>
            <p>• 이메일 (필수)</p>
          </div>
          <p>3. 회사는 회원의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 수집 목적 외의 용도로 사용하지 않습니다. 자세한 사항은 개인정보처리방침을 따릅니다.</p>
        </div>
      </div>

      <div class="terms-section">
        <h4 class="section-title">제5조 (회원의 의무)</h4>
        <div class="section-content">
          <p>1. 회원은 본 약관 및 회사의 공지사항, 관련 법령을 준수해야 합니다.</p>
          <p>2. 회원은 타인의 정보를 도용하거나, 허위 정보를 제공해서는 안 됩니다.</p>
          <p>3. 회원은 서비스 이용과 관련하여 회사의 명예를 훼손하거나 운영을 방해하는 행위를 하여서는 안 됩니다.</p>
        </div>
      </div>

      <div class="terms-section">
        <h4 class="section-title">제6조 (회원 탈퇴 및 자격 상실)</h4>
        <div class="section-content">
          <p>1. 회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 즉시 회원 탈퇴를 처리합니다.</p>
          <p>2. 다음 각 호에 해당하는 경우, 회사는 사전 통지 없이 회원 자격을 제한 또는 박탈할 수 있습니다.</p>
          <div class="sub-list">
            <p>• 가입 시 허위 정보를 입력한 경우</p>
            <p>• 타인의 서비스 이용을 방해하거나 정보를 도용한 경우</p>
            <p>• 기타 본 약관에 위반되는 행위를 한 경우</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-container {
  width: 100%;
  max-width: 899px;
  margin: 0 auto;
}

.terms-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: #FAFAFA;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}

.terms-section {
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

.section-content p {
  margin-bottom: 8px;
  margin-top: 0;
}

.sub-list {
  margin-left: 15px;
}

.sub-list p {
  margin-bottom: 5px;
}

/* 스크롤바 스타일 */
.terms-content::-webkit-scrollbar {
  width: 8px;
}

.terms-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.terms-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.terms-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .terms-content {
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
  .terms-content {
    padding: 12px;
    max-height: 300px;
  }

  .section-title {
    font-size: 14px;
  }

  .section-content {
    font-size: 12px;
  }

  .terms-container {
    max-width: 95%;
  }
}
</style>