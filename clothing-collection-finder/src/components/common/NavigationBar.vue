<!-- src/components/common/NavigationBar.vue 상단 네비게이션 바-->
<template>
  <nav class="navigation-bar">
    <!-- 로고 영역 -->
    <div class="nav-brand">
      <h1 class="brand-text">DropIt 로고 넣기</h1>
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
/* 동적 스타일이 필요한 경우만 여기에 */
</style>