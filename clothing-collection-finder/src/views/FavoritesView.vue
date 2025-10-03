<template>
  <MainLayout>
    <div class="favorites-page-container">
    <div class="favorites-content">
      <!-- 고정 헤더 -->
      <div class="page-header fixed-header">
        <div class="header-top">
          <h1 class="page-title">나의 즐겨찾기 목록</h1>
          <span class="sort-label">거리순</span>
        </div>
        <div class="title-line">
          <img src="@/assets/images/line.png" alt="구분선" />
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-message">
        데이터를 불러오는 중...
      </div>

      <!-- 즐겨찾기가 비어있을 때 -->
      <div v-else-if="isEmpty" class="empty-favorites">
        <h3>아직 즐겨찾기한 의류수거함이 없습니다</h3>
        <p>지도에서 의류수거함을 찾아 북마크 버튼을 눌러보세요!</p>
      </div>

      <!-- 즐겨찾기 목록 -->
      <div v-else class="favorites-list">
        <!-- 지역별 그룹으로 표시 -->
        <div
            v-for="group in groupedFavorites"
            :key="group.region"
            class="region-group"
        >
          <!-- 지역 헤더 -->
          <div class="region-header">
            <h3 class="region-name">{{ group.region }}</h3>
          </div>

          <!-- 해당 지역의 의류수거함들 -->
          <div class="region-items">
            <div
                v-for="(bin, index) in group.items"
                :key="bin.id"
                class="clothing-bin-item"
                :class="{ 'no-border': index === group.items.length - 1 }"
            >
              <!-- 의류수거함 이미지 -->
              <div class="item-image">
                <img
                    src="@/assets/images/clothing-bin-panel.png"
                    alt="의류수거함"
                    class="bin-image"
                />
              </div>
              <!-- 주소 정보 -->
              <div class="item-content">
                <div class="road-address">{{ bin.roadAddress }}</div>
                <div v-if="bin.landLotAddress && bin.landLotAddress !== bin.roadAddress"
                     class="land-address">
                  {{ bin.landLotAddress }}
                </div>
              </div>

              <!-- 거리 정보 -->
              <div class="item-distance">
                <span class="distance-label">내 위치에서</span>
                <span class="distance-value">{{ calculateDistance(bin) }}</span>
              </div>

              <!-- 즐겨찾기 버튼 -->
              <div class="item-button">
                <FavoriteButton
                    :is-active="true"
                    @click="removeFavorite(bin.id)"
                />
              </div>
            </div>
            <div class="region-divider">
              <img src="@/assets/images/line.png" alt="구분선" />

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </MainLayout>
</template>

<script>
import { computed, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import FavoriteButton from '@/components/ui/favorites/FavoriteButton.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useClotheBinStore } from '@/stores/clotheBinStore'
import { groupByRegion, convertGroupsToArray } from '@/utils/regionExtractor'
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator'
import { useGeolocation } from '@/composables/currentlocation/useGeolocation'


export default {
  name: 'FavoritesView',
  components: {
    MainLayout,
    FavoriteButton
  },
  setup() {
    const clotheBinStore = useClotheBinStore()
    const favoritesStore = useFavoritesStore()

    const {
      calculateDistance: calculateDistanceRaw,
      formatDistance
    } = useDistanceCalculator()

    const {
      coordinates: geoCoordinates,
      getCurrentPosition: getGeoPosition
    } = useGeolocation()

    // 로딩 상태 (두 스토어 모두 고려)
    const isLoading = computed(() => clotheBinStore.isLoading)

    // 즐겨찾기한 의류수거함 데이터
    const favoriteClothingBins = computed(() => {
      if (!clotheBinStore.clothingBins || favoritesStore.favoriteList.length === 0) {
        return []
      }

      // 즐겨찾기 ID에 해당하는 의류수거함 데이터 필터링
      return clotheBinStore.clothingBins.filter(bin =>
          favoritesStore.isFavorite(bin.id)
      )
    })

    // 빈 상태 확인
    const isEmpty = computed(() => favoritesStore.favoriteCount === 0)

    // 지역별 그룹화된 데이터
    const groupedFavorites = computed(() => {
      if (favoriteClothingBins.value.length === 0) {
        return []
      }

      const grouped = groupByRegion(favoriteClothingBins.value, { includeDistrict: false })
      const groupedArray = convertGroupsToArray(grouped)

      console.log('지역별 그룹화 결과:', groupedArray)
      return groupedArray
    })

    // 거리 계산 함수
    const calculateDistance = (bin) => {
      try {
        if (!geoCoordinates.value) {
          return '위치 요청 중'
        }

        if (!bin.latitude || !bin.longitude) {
          return '좌표 정보 없음'
        }

        const distance = calculateDistanceRaw(
            geoCoordinates.value.lat,
            geoCoordinates.value.lng,
            bin.latitude,
            bin.longitude
        )

        if (distance === null) {
          return '거리 계산 실패'
        }

        return formatDistance(distance, {
          precision: 0,
          useKilometers: true,
          kmThreshold: 1000,
          shortUnit: true
        })

      } catch (error) {
        console.error('거리 계산 중 오류:', error)
        return '계산 오류'
      }
    }

    // 즐겨찾기 제거 핸들러 (API 호출)
    const removeFavorite = async (binId) => {
      try {
        await favoritesStore.removeFavorite(binId)
        console.log(`즐겨찾기에서 제거: ${binId}`)
      } catch (error) {
        console.error('즐겨찾기 제거 실패:', error)
        if (error.message === 'LOGIN_REQUIRED') {
          alert('로그인이 필요합니다.')
        } else {
          alert('즐겨찾기 제거에 실패했습니다.')
        }
      }
    }

    // 컴포넌트 마운트 시 데이터 로드
    onMounted(async () => {
      console.log('FavoritesView 로드 시작')

      try {
        await getGeoPosition()

        if (clotheBinStore.clothingBins.length === 0) {
          await clotheBinStore.fetchClothingBins()
        }

        // ✅ await 추가
        await favoritesStore.loadFavorites()

        console.log('즐겨찾기 개수:', favoritesStore.favoriteCount)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      }
    })

    return {
      // 상태
      isLoading,
      favoriteCount: computed(() => favoritesStore.favoriteCount),
      favoriteClothingBins,
      isEmpty,
      groupedFavorites,

      // 액션
      removeFavorite,
      calculateDistance
    }
  }
}
</script>

<style scoped>
@import '../styles/favorites/favorites-layout.css';
@import '../styles/favorites/favorites-header.css';
@import '../styles/favorites/favorites-line.css';
@import '../styles/favorites/favorites-region-group.css';
@import '../styles/favorites/favorites-clothing-item.css';

/* 페이지 헤더 */
.fixed-header {
  margin-bottom: 30px;
  padding-bottom: 2px;
}

.loading-message {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.empty-favorites {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-favorites h3 {
  margin: 20px 0 10px 0;
  color: #333;
}

.empty-favorites p {
  font-size: 16px;
  line-height: 1.5;
}
.favorites-page-container {
  height: calc(100vh - 80px);  /* 현재 설정 */
  overflow-y: auto;
  padding-top: 20px;           /*  상단 여백 추가 */
  padding-bottom: 20px;        /*  하단 여백 추가 */
  margin-top: 80px;            /*  네비게이션 높이만큼 밀어내기 */
}
</style>