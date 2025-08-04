<template>
  <MainLayout>
    <!-- 상단 네비게이션 바만 표시되고 나머지 콘텐츠는 비어있음 -->
    <div class="guide-content">
      <!-- 나중에 가이드 관련 콘텐츠가 여기에 추가될 예정 -->
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'

export default {
  name: 'GuideView',
  components: {
    MainLayout
  }
}
</script>

<style scoped>
.guide-content {
  /* 나중에 스타일링이 필요할 때 여기에 추가 */
}
</style>