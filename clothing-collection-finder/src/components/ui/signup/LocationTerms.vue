<template>
  <div class="location-container">
    <div class="location-content">
      <div class="location-section">
        <h4 class="section-title">제1조 (목적)</h4>
        <div class="section-content">
          <p>이 약관은 [Drop it(드랍잇)] (이하 "회사")이 제공하는 위치기반 서비스와 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
        </div>
      </div>

      <div class="location-section">
        <h4 class="section-title">제2조 (위치정보의 수집 및 이용)</h4>
        <div class="section-content">
          <p>1. 회사는 회원에게 맞춤형 서비스를 제공하기 위해 회원의 위치정보를 수집 및 이용할 수 있습니다.</p>
          <p>2. 수집하는 위치정보는 모바일 기기, 웹 브라우저, GPS 등 다양한 기술을 통해 수집될 수 있습니다.</p>
          <p>3. 위치정보는 다음과 같은 목적에 활용됩니다.</p>
          <div class="sub-list">
            <p>• 가까운 의류수거함 위치 안내</p>
            <p>• 위치 기반 통계 및 서비스 개선</p>
            <p>• 사용자 맞춤 정보 제공</p>
          </div>
        </div>
      </div>

      <div class="location-section">
        <h4 class="section-title">제3조 (위치정보 수집 방법 및 보유 기간)</h4>
        <div class="section-content">
          <p>1. 위치정보는 서비스 이용 시점에 한하여 실시간으로 수집되며, 별도로 저장되지 않습니다.</p>
          <p>2. 실시간 기능 외에 저장이 필요한 경우, 사전 동의를 받은 후 필요한 범위 내에서만 저장합니다.</p>
        </div>
      </div>

      <div class="location-section">
        <h4 class="section-title">제4조 (이용자의 권리)</h4>
        <div class="section-content">
          <p>1. 이용자는 언제든지 위치정보 제공을 거부하거나 동의 철회를 요청할 수 있습니다.</p>
          <p>2. 위치정보 제공 거부 시, 일부 위치기반 서비스 이용이 제한될 수 있습니다.</p>
        </div>
      </div>

      <div class="location-section">
        <h4 class="section-title">제5조 (개인위치정보의 제3자 제공)</h4>
        <div class="section-content">
          <p>1. 회사는 이용자의 동의 없이 개인위치정보를 제3자에게 제공하지 않습니다.</p>
          <p>2. 개인위치정보를 제3자에게 제공할 경우, 제공받는 자, 제공 목적 및 제공 항목을 사전에 명확히 고지하고 동의를 받습니다.</p>
        </div>
      </div>

      <div class="location-section">
        <h4 class="section-title">제6조 (책임의 제한)</h4>
        <div class="section-content">
          <p>회사는 위치정보 제공이 불가능하거나 부정확할 경우라도, 회사의 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-container {
  width: 100%;
  max-width: 899px;
  margin: 0 auto;
}

.location-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background-color: #FAFAFA;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}

.location-section {
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
  margin-top: 0;
}

/* 스크롤바 스타일 */
.location-content::-webkit-scrollbar {
  width: 8px;
}

.location-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.location-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.location-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .location-content {
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
  .location-content {
    padding: 12px;
    max-height: 300px;
  }

  .section-title {
    font-size: 14px;
  }

  .section-content {
    font-size: 12px;
  }

  .location-container {
    max-width: 95%;
  }
}
</style>