<!-- src/components/common/NavigationBar.vue 상단 네비게이션 바-->
<template>
  <nav class="navigation-bar">
    <!-- 로고 영역 -->
    <div class="nav-brand">
      <a href="/" to="/" class="brand-link">
        <img src="@/assets/images/logo.png" alt="DropIt Logo" class="brand-logo" />
        <img src="@/assets/images/dropit.png" alt="DropIt Text" class="brand-text-img" />
      </a>
    </div>

    <!-- 메뉴 영역 -->
    <div class="nav-menu">
      <router-link to="/" class="nav-item">의류수거함</router-link>
      <router-link to="/share" class="nav-item">나눔</router-link>
      <router-link to="/favorites" class="nav-item">즐겨찾기</router-link>
<!--      <router-link to="/guide" class="nav-item">이용가이드</router-link>-->
    </div>

    <!-- 사용자 메뉴 영역 -->
    <div class="nav-user">
      <router-link to="/mypage" class="nav-item">마이페이지</router-link>
      <router-link to="/login" class="nav-item">로그인</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<style scoped>
/* 로고 영역 스타일 */
.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 2px; /* 로고와 텍스트 사이 간격 */
}

.brand-logo {
  height: 40px; /* 로고 높이 조정 */
  width: 40px;  /* 정사각형으로 맞춤 */
  padding: 8px; /* 내부 여백 */
  margin-bottom: 6px;
  object-fit: contain;
  box-sizing: border-box;
}

.brand-text-img {
  height: 32px; /* 텍스트 이미지 높이 조정 */
  width: auto;
  object-fit: contain;
  margin-top: 5px;
}

/* 반응형 처리 */
@media (max-width: 768px) {
  .brand-logo {
    height: 32px;
    width: 32px;
    padding: 6px;
  }

  .brand-text-img {
    height: 24px;
  }
}
</style>