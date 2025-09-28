<!-- src/components/common/SidebarContent.vue (FavoriteButton 적용 수정 버전) -->
<template>
  <div class="sidebar-content-wrapper">
    <!--  검색창 섹션을 컴포넌트로 교체 -->
    <SearchContainer
        :search-data="allBins"
        @search-results="handleSearchResults"
        @search-cleared="handleSearchCleared"
    />
    <!-- 현재 위치 섹션 -->
    <div class="current-location">
      <h3>현재 위치</h3>
      <div class="location-info">
        <div class="location-icon">
          <img src="@/assets/images/sidebar-map-marker.png" alt="현재위치" />
        </div>
        <div class="location-text">
          <span v-if="isGeocodingLoading" class="location-name loading">
            위치 찾는 중...
          </span>
          <span v-else-if="currentLocationAddress" class="location-name">
            {{ displayAddress }}
          </span>
          <span v-else class="location-name no-location">
            위치 정보 없음
          </span>
        </div>
      </div>

      <div v-if="geocodingError && !isGeocodingLoading" class="location-error">
        ⚠️ {{ geocodingError }}
      </div>
    </div>

    <!-- 주변 의류수거함 섹션 -->
    <div class="nearby-section">
      <div class="section-header">
        <h3>{{ sectionTitle }}</h3>
        <span class="filter-text">{{ filterText }}</span>
      </div>

      <!-- 로딩 상태 표시 -->
      <div v-if="isLoading || isSearching" class="loading-message">
        {{ isSearching ? '검색 중...' : '데이터를 불러오는 중...' }}
      </div>

      <!-- 검색 결과 없음 메시지 -->
      <div v-else-if="isSearchMode && searchResults.length === 0" class="no-results-message">
        검색 결과가 없습니다.<br>
        다른 키워드로 검색해보세요.
      </div>

      <!-- 의류수거함 리스트 -->
      <div v-else class="bins-container">
        <div
            v-for="bin in displayBins"
            :key="bin.id"
            class="bin-item"
            :class="{ 'search-result': isSearchMode }"
            @click="handleBinClick(bin)"
        >
          <div class="bin-icon">
            <img src="@/assets/images/clothing-bin-default.jpg" alt="의류수거함" />
          </div>
          <div class="bin-info">
            <div class="bin-distance-container">
              <span class="distance-label">내 위치에서</span>
              <span class="bin-distance">{{ calculateDistance(bin) }}</span>
            </div>
            <div class="bin-details">
              <div class="bin-address road-address">
                {{ formatAddress(bin.roadAddress) }}
              </div>
              <div
                  v-if="bin.landLotAddress"
                  class="bin-address road-address"
              >
                {{ formatAddress(bin.landLotAddress) }}
              </div>
            </div>
          </div>

          <!-- FavoriteButton -->
          <FavoriteButton
              :is-active="isFavorite(bin.id)"
              @click="(event) => handleBookmarkClick(bin.id, event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from 'vue'
import { useClotheBinStore } from '@/stores/clotheBinStore'
import { useGeocoding } from '@/composables/useGeocoding'
import { useCoordinates } from '@/composables/currentlocation/useCoordinates'
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator'
import { useGeolocation } from '@/composables/currentlocation/useGeolocation'
import { useSortedDistance } from '@/composables/sorted/useSortedDistance'
//  검색 컴포넌트 import
import SearchContainer from '@/components/ui/search/SearchContainer.vue'
//  FavoriteButton과 즐겨찾기 기능 import 추가
import FavoriteButton from '@/components/ui/favorites/FavoriteButton.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'

export default {
  name: 'SidebarContent',
  components: {
    SearchContainer,  //  컴포넌트 등록
    FavoriteButton
  },
  props: {
    locationUpdate: Number
  },
  setup(props, { emit }) {
    const clotheBinStore = useClotheBinStore()

    //  검색 상태를 로컬에서 관리
    const searchResults = ref([])
    const isSearchMode = ref(false)
    const isSearching = ref(false)

    //  즐겨찾기 기능 추가
    const favoritesStore = useFavoritesStore()

    const isFavorite = (binId) => {
      if (!binId) return false
      return favoritesStore.isFavorite(binId)
    }

    // 지오코딩 관련
    const {
      currentAddress: currentLocationAddress,
      isLoading: isGeocodingLoading,
      error: geocodingError,
      getSimpleAddress
    } = useGeocoding()

    // 좌표 관리
    const {
      setCurrentCoords,
      getCurrentLatLng,
      currentCoords
    } = useCoordinates()

    // 거리 계산
    const {
      getDistanceFromCurrentLocation,
      formatDistance,
      calculateDistance: calculateDistanceRaw
    } = useDistanceCalculator()

    //  거리순 정렬
    const { sortByDistanceComputed, sortByDistance } = useSortedDistance()

    // 위치 정보
    const {
      coordinates: geoCoordinates,
      isRealLocation,
      getCurrentPosition: getGeoPosition,
      error: geoError
    } = useGeolocation()

    // 데이터 연결
    const allBins = computed(() => clotheBinStore.clothingBins)
    const isLoading = computed(() => clotheBinStore.isLoading)

    // 표시할 주소 계산
    const displayAddress = computed(() => {
      if (!currentLocationAddress.value) return '위치를 찾아주세요'
      const simple = getSimpleAddress()
      return simple || '알 수 없는 위치'
    })

    const first2Bins = computed(() => {
      if (allBins.value.length === 0) return []

      // 거리순으로 정렬한 후 상위 15개
      const sorted = sortByDistanceComputed(allBins, 'latitude', 'longitude') // 실제 필드명으로 변경 필요
      return sorted.value.slice(0, 15)
    })

    // 표시할 데이터 결정
    const displayBins = computed(() => {
      if (isSearchMode.value) {
        return searchResults.value
      } else {
        return first2Bins.value
      }
    })

    // 섹션 제목 동적 계산
    const sectionTitle = computed(() => {
      if (isSearchMode.value) {
        if (isSearching.value) {
          return '검색 중...'
        } else if (searchResults.value.length === 0) {
          return '검색 결과'
        } else {
          return `검색 결과 (${searchResults.value.length}개)`
        }
      } else {
        return '주변 의류수거함'
      }
    })

    // 필터 텍스트 동적 계산
    const filterText = computed(() => {
      if (isSearchMode.value) {
        return isSearching.value ? '검색 중...' : '거리순'
      } else {
        return '거리순'
      }
    })

    //  검색 결과 핸들러
    const handleSearchResults = (searchData) => {
      const sortedResults = sortByDistance(searchData.results, 'latitude', 'longitude')
      searchResults.value = sortedResults
      isSearchMode.value = searchData.isSearchMode
      isSearching.value = false
    }

    //  검색 초기화 핸들러
    const handleSearchCleared = () => {
      searchResults.value = []
      isSearchMode.value = false
      isSearching.value = false
    }

    //  즐겨찾기 클릭 핸들러 추가
    const handleBookmarkClick = async (binId, event) => {
      event?.stopPropagation() // 이벤트 버블링 방지

      if (!binId) {
        console.error('binId가 없습니다.')
        return
      }
      console.log('버튼 클릭 전 isActive:', isFavorite(binId))  // 추가
      try {
        await favoritesStore.toggleFavorite(binId)
        console.log(`사이드바에서 즐겨찾기 토글: ${binId}`)
        console.log('버튼 클릭 후 isActive:', isFavorite(binId))  // 추가
      } catch (error) {
        console.error('즐겨찾기 토글 실패:', error)
        alert('즐겨찾기 변경에 실패했습니다.')
      }
    }

    // 위치 업데이트 감지
    watch(() => props.locationUpdate, async (newValue, oldValue) => {
      if (newValue > 0 && newValue !== oldValue) {
        console.log(' SidebarContent: 위치 업데이트 감지 (', oldValue, '→', newValue, ')')

        try {
          await getGeoPosition()

        } catch (error) {
          console.error(' 위치 업데이트 중 오류:', error)
        }
      }
    }, { immediate: false })

    // 데이터 로드
    onMounted(async () => {

      await getGeoPosition()
      await clotheBinStore.fetchClothingBins()



      if (geoError.value) {
        console.log('위치 에러:', geoError.value)
      }
    })

    // 클릭 핸들러
    const handleBinClick = (bin) => {

      if (isSearchMode.value) {
      }

      emit('moveToLocation', {
        latitude: bin.latitude,
        longitude: bin.longitude,
        binId: bin.id,
        address: bin.roadAddress
      })

      emit('showDetailPanel', bin)
    }

    // 거리 계산 함수
    const calculateDistance = (bin) => {
      try {
        if (!geoCoordinates.value) {
          console.warn(' geoCoordinates가 없습니다.')
          return '위치 요청 중'
        }

        if (!bin.latitude || !bin.longitude) {
          console.warn(' 의류수거함 좌표 정보 없음:', bin)
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
        console.error(' 거리 계산 중 오류:', error)
        return '계산 오류'
      }
    }

    // 주소 포맷팅
    const formatAddress = (address) => {
      return address.replace('서울특별시 ', '')
    }

    return {
      // 기존
      isLoading,
      first2Bins,
      handleBinClick,
      calculateDistance,
      formatAddress,
      allBins,  //  SearchContainer에 전달하기 위해 추가

      // 현재 위치 관련
      currentLocationAddress,
      isGeocodingLoading,
      geocodingError,
      displayAddress,

      // 좌표 관련
      currentCoords,
      setCurrentCoords,

      // useGeolocation 관련
      geoCoordinates,
      isRealLocation,
      geoError,

      //  검색 관련 (로컬 상태)
      searchResults,
      isSearchMode,
      isSearching,
      handleSearchResults,
      handleSearchCleared,

      // 동적 계산된 값들
      displayBins,
      sectionTitle,
      filterText,

      //  즐겨찾기 관련 추가
      isFavorite,
      handleBookmarkClick
    }
  }
}
</script>

<style scoped>
/* 검색 결과 없음 메시지 */
.no-results-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
  font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
}
</style>