<!-- src/components/common/NavigationBar.vue -->
<template>
  <nav class="navigation-bar">
    <!-- 로고 영역 -->
    <div class="nav-brand">
      <h1 class="brand-text">DropIt 로고 넣기</h1>
    </div>

    <!-- 메뉴 영역 -->
    <div class="nav-menu">
      <a href="#" class="nav-item active">의류수거함</a>
      <a href="#" class="nav-item">나눔</a>
      <a href="#" class="nav-item">즐겨찾기</a>
      <a href="#" class="nav-item">이용가이드</a>
    </div>

    <!-- 사용자 메뉴 영역 -->
    <div class="nav-user">
      <a href="#" class="user-link">마이페이지</a>
      <a href="#" class="user-link">로그인</a>
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