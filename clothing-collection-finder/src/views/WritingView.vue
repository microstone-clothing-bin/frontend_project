<template>
  <MainLayout>
    <!-- 상단 네비게이션 바만 표시되고 나머지 콘텐츠는 비어있음 -->
    <ShareWriting>

    </ShareWriting>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import ShareWriting from "@/components/share/ShareWriting.vue";

export default {
  name: 'WritingView',
  components: {
    ShareWriting,
    MainLayout
  }
}
</script>

<style scoped>
.share-writing {
  /* 나중에 스타일링이 필요할 때 여기에 추가 */
}
</style>