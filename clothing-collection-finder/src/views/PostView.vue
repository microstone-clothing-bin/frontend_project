<template>
  <MainLayout>
    <!-- 상단 네비게이션 바만 표시되고 나머지 콘텐츠는 비어있음 -->
    <SharePost>

    </SharePost>
  </MainLayout>
</template>

<script>
import MainLayout from '../layouts/MainLayout.vue'
import SharePost from "@/components/share/SharePost.vue";

export default {
  name: 'PostView',
  components: {
    SharePost,
    MainLayout
  }
}
</script>

<style scoped>
.share-post {
  /* 나중에 스타일링이 필요할 때 여기에 추가 */
}
</style>