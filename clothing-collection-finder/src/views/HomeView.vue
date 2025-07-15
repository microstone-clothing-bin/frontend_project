<!-- src/views/HomeView.vue -->
<template>
  <MainLayout>  <!-- 상단 네비게이션 바 -->
    <SidebarLayout>
      <!-- 메인 콘텐츠 (지도) -->
      <NaverMap
          :width="'100%'"
          :height="'100%'"
          :center="mapCenter"
          :zoom="10"
      />
    </SidebarLayout>
  </MainLayout>
</template>

<script>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import SidebarLayout from '../layouts/SidebarLayout.vue'
import NaverMap from '../components/map/NaverMap.vue'

export default {
  name: 'HomeView',
  components: {
    MainLayout,
    SidebarLayout,
    NaverMap
  },
  setup() {
    const mapCenter = ref({ lat: 37.5665, lng: 126.9780 }) // 서울시청

    return {
      mapCenter
    }
  }
}
</script>

<style scoped>
/* 페이지별 특별한 스타일이 필요한 경우만 여기에 */
</style>