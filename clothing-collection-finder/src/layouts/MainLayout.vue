<!-- src/layouts/MainLayout.vue 상단 네비게이션바 레이아웃 -->
<template>
  <div class="main-layout">
    <!-- 상단 네비게이션 바 -->
    <NavigationBar />

    <!-- 나머지 콘텐츠 영역 (slot으로 SidebarLayout이 들어갈 곳) -->
    <div class="content-below-nav">
      <slot />
    </div>
  </div>
</template>

<script>
import NavigationBar from '../components/common/NavigationBar.vue'

export default {
  name: 'MainLayout',
  components: {
    NavigationBar
  }
}
</script>

<style scoped>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>