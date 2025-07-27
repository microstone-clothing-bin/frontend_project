<!-- src/components/common/SidebarContent.vue -->
<template>
  <div class="sidebar-content-wrapper">
    <!-- 검색창 섹션 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <input
            type="text"
            placeholder="00시 00동"
            class="search-input"
        />
        <button class="search-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 현재 위치 섹션 -->
    <div class="current-location">
      <h3>현재 위치</h3>
      <div class="location-info">
        <div class="location-icon">📍</div>
        <div class="location-text">
          <span class="location-name">의정부시 호원동</span>
        </div>
      </div>
    </div>

    <!-- 주변 의류수거함 섹션 -->
    <div class="nearby-section">
      <div class="section-header">
        <h3>주변 의류수거함</h3>
        <span class="filter-text">거리순
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6"></path>
      </svg>
    </span>
      </div>

      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading" class="loading-message">
        데이터를 불러오는 중...
      </div>

      <!-- 의류수거함 리스트 -->
      <div v-else class="bins-container">
        <div
            v-for="bin in first2Bins"
            :key="bin.id"
            class="bin-item"
            @click="handleBinClick(bin)"
        >
          <div class="bin-icon">
            <img src="@/assets/images/clothing-bin-default.jpg" alt="의류수거함" />
          </div>
          <div class="bin-info">
            <div class="bin-distance">{{ calculateDistance(bin) }}</div>
            <div class="bin-address">{{ formatAddress(bin.roadAddress) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useClotheBinStore } from '@/stores/clotheBinStore'

export default {
  name: 'SidebarContent',
  setup(props, { emit }){
    // 스토어 가져오기
    const clotheBinStore = useClotheBinStore()

    // 데이터 연결
    const allBins = computed(() => clotheBinStore.clothingBins)
    const isLoading = computed(() => clotheBinStore.isLoading)

    // 처음 2개만 표시
    const first2Bins = computed(() => {
      return allBins.value.slice(0, 5)
    })

    // 데이터 로드
    onMounted(async () => {
      await clotheBinStore.fetchClothingBins()
      console.log('로드된 데이터 개수:', allBins.value.length)
      console.log('표시할 데이터:', first2Bins.value)
    })

    // 클릭 핸들러
    const handleBinClick = (bin) => {
      console.log('클릭된 수거함:', bin)
      emit('moveToLocation', {
        latitude: bin.latitude,
        longitude: bin.longitude,
        binId: bin.id,
        address: bin.roadAddress
      })
    }

    // 거리 계산
    const calculateDistance = (bin) => {
      return Math.floor(Math.random() * 200) + 10 + 'M'
    }

    // 주소 포맷팅
    const formatAddress = (address) => {
      return address.replace('서울특별시 ', '')
    }

    return{
      isLoading,
      first2Bins,
      handleBinClick,
      calculateDistance,
      formatAddress
    }
  }
}
</script>

<style scoped>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>