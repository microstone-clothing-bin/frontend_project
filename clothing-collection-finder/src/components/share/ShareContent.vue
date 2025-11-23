<template>
  <div class="screen">
    <div class="frame">
      <div class="content">
        <!-- 현재 위치 섹션 -->
        <div class="etc_wrapper">
          <h5 class="present-location">현재 위치</h5>
        </div>
        <div class="header-row">
          <div class="location-info">
            <div class="location-icon">
              <img src="@/assets/images/sidebar-map-marker.png" alt="현재위치 마커" />
            </div>
            <div class="location-text">
              <span v-if="loading || isGeocodingLoading" class="location-option">
                위치 찾는 중...
              </span>
              <span v-else-if="userLocation" class="location-option">
                {{ userAddress }}
              </span>
              <span v-else class="location-option">
                위치 정보 없음
              </span>
            </div>
          </div>
        </div>
        <div class="search-wrapper">
          <!-- 검색창 영역 -->
          <SearchPost
              @search-results="handleSearchResults"
              @search-cleared="handleSearchCleared"
          />
          <!-- 글쓰기 버튼 영역 -->
          <div v-if="isLoggedIn" class="writing-button" @click="goToWriting('/share-writing')">
            <div class="button-group">
              <FiRrPencil class="fi-rr-pencil" color="white" />
              <div class="write-post">글 쓰기</div>
            </div>
          </div>
        </div>
        <div class="tools-row">
          <div class="count">{{ totalElements }}개</div>
          <div class="filter-wrapper">
            <div class="filter-btn"
                 :class="{ 'filter-active': activeFilter === 'distance', 'filter': activeFilter !== 'distance' }"
                 @click="changeSort('distance')">거리순</div>
            <div class="filter-btn"
                 :class="{ 'filter-active': activeFilter === 'recent', 'filter': activeFilter !== 'recent' }"
                 @click="changeSort('recent')">최신순</div>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="isLoading" class="loading-message">게시글을 불러오는 중입니다...</div>

        <!-- 게시물 리스트 -->
        <div class="overlap board-list-container" ref="listContainerRef" v-else-if="boards.length > 0">
          <div v-for="info in processedBoards" :key="info.boardId"
               class="card"
               @click="goToDetail(info.boardId)">
            <img class="share-img" :src="info.imgSrc" alt="posting image"/>
            <div class="share-title">{{ info.title }}</div>
            <div class="share-location">{{ info.location }}</div>
            <p class="share-distance">내 위치에서 {{ info.distance }} | {{ info.redate }}</p>
          </div>

          <div v-if="nextPage > 0 && isLoading" class="loading-message">더 많은 게시글 불러오는 중...</div>
        </div>

        <div v-else class="loading-message">
          등록된 게시글이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue';
import router from "@/router/index.js";
import FiRrPencil from "@/assets/FiRrPencil.vue";
import { reverseGeocode } from '@/services/geocodingService';
import SearchPost from "@/components/ui/search/SearchPost.vue";
import { useBoard } from '@/composables/useBoard';
import { useAuth } from '@/composables/useAuth';
import { useGeolocation } from '@/composables/currentlocation/useGeolocation';
import { useCoordinates } from '@/composables/currentlocation/useCoordinates';
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator';
import naverMapService from '@/services/naverMapService';

const { boards, totalElements, isLoading, error, isEnd, nextPage, fetchBoards, clearBoards } = useBoard();
const { user, isLoggedIn } = useAuth(); // 사용자 정보

// 현재 위치 좌표 가져오기
const {
  coordinates: geoCoordinates, // GPS로 가져온 좌표 (raw data)
  getCurrentPosition: getGeoPosition, // 위치 요청 함수
  error: geoError
} = useGeolocation();

// 전역 중앙 상태 가져오기
const { currentCoords, setCurrentCoords } = useCoordinates();

const { calculateDistance, formatDistance } = useDistanceCalculator();

const userLocation = currentCoords;

// 상태 초기화
const activeFilter = ref('recent');
const currentSort = ref('boardId');
const currentDirection = ref('DESC');
const isGeocodingLoading = ref(true);
const userAddress = ref('내 위치를 설정해 주세요.');
const listContainerRef = ref(null);   // 무한 스크롤용 DOM 요소 ref

// 검색 관련 상태
const searchResults = ref([]);
const isSearchMode = ref(false);

const goToWriting = (path) => {
  router.push(path);
};

const goToDetail = (boardId) => {
  router.push({
    name: 'share-post',
    query: { id: boardId }
  });
};

// 정렬 기준 변경
const changeSort = (filterName) => {
  // 정렬 기준 변경 시 Store 상태를 초기화
  clearBoards();
  activeFilter.value = filterName;

  if (filterName === 'recent') {
    currentSort.value = 'boardId';
    currentDirection.value = 'DESC';
    loadInitialBoards(); // 새로고침
  } else if (filterName === 'distance') {
    // 거리순은 서버 정렬이 아닌 클라이언트 정렬이므로 서버 요청은 최신순으로 유지하고 위치 확인
    // 정렬 로직은 processedBoards에서 처리
    currentSort.value = 'boardId';
    currentDirection.value = 'DESC';

    if (!userLocation.value) {
      alert('거리순 정렬을 사용하려면 현재 위치를 먼저 설정해주세요.');
    }
    // ⭐️ [나중에 수정 가능성 있음] 거리순 필터 선택 시, 현재 로드된 목록이 0개면 데이터를 다시 로드
    if (boards.value.length === 0) {
      loadInitialBoards();
    }
  }
};

// 게시글 목록을 불러오는 함수
const loadBoards = async () => {
  // Store의 fetchBoards를 사용하여 다음 페이지를 불러옴
  await fetchBoards(10, currentSort.value, currentDirection.value);
};

// 초기 로드 함수
const loadInitialBoards = async () => {
  // 초기 로드 시 Store의 목록을 비우고 fetchBoards 호출
  clearBoards();
  await loadBoards();
};

// 작성 시간 차이를 계산하는 함수
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return `${Math.floor(interval)}년 전`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}개월 전`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}일 전`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}시간 전`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}분 전`;
  return `${Math.floor(seconds)}초 전`;
};

// 현재 위치를 설정하는 함수
const setCurrentLocation = async (isManual = true) => {
  isGeocodingLoading.value = true;

  if (!navigator.geolocation) {
    alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
    isGeocodingLoading.value = false;
    return;
  }

  try {
    // 1. GPS 위치 요청 (geoCoordinates에 좌표 저장됨)
    await getGeoPosition();

    // 2. 좌표가 설정되었는지 확인
    if (!geoCoordinates.value) {
      throw new Error('GPS 위치를 가져올 수 없습니다.');
    }

    const lat = geoCoordinates.value.lat;
    const lng = geoCoordinates.value.lng;

    // geoCoordinates를 useCoordinates의 전역 상태로 설정 (거리 계산기 의존성 만족)
    setCurrentCoords(lat, lng, { source: 'ShareContent', addToHistory: true });

    // 3. Geocoding API 로드 보장
    await naverMapService.loadNaverMapAPI();

    // 4. 주소 변환
    const addressInfo = await reverseGeocode(lat, lng);

    let displayAddress = '현재 위치';
    if (addressInfo.sigungu && addressInfo.dong) {
      displayAddress = `${addressInfo.sigungu} ${addressInfo.dong}`;
    } else if (addressInfo.sigungu) {
      displayAddress = addressInfo.sigungu;
    } else if (addressInfo.sido) {
      displayAddress = addressInfo.sido;
    }

    userAddress.value = displayAddress;

    // 위치 설정 후 게시물 목록 새로고침
    await loadInitialBoards();

    if (isManual) alert(`현재 위치가 "${userAddress.value}"로 설정되었습니다.`);

  } catch (error) {
    console.error('위치 설정 실패:', error);
    userAddress.value = '위치 정보 없음';
    if (isManual) alert('현재 위치를 가져오는 데 실패했습니다. 위치 권한을 확인해주세요.');
  } finally {
    isGeocodingLoading.value = false;
  }
};

// 무한 스크롤 로직
const handleScroll = () => {
  const container = listContainerRef.value;
  if (!container) return;

  // 스크롤이 끝에 도달했는지 확인 (예: 스크롤 영역의 80% 이상 내려갔을 때)
  const threshold = 0.8;
  const scrollPosition = container.scrollTop + container.clientHeight;
  const scrollMax = container.scrollHeight;

  if (scrollPosition / scrollMax > threshold && !isLoading.value && !isEnd.value) {

    loadBoards();
  }
};

// 컴퓨티드 속성, 거리순 정렬 로직
const processedBoards = computed(() => {
  const boardsData = isSearchMode.value ? searchResults.value : boards.value;

  // 거리 계산이 가능한지 확인
  const isLocationSet = !!userLocation.value?.lat && !!userLocation.value?.lng;

  const processed = boardsData.map(board => {

    const address = board.roadAddress || '위치 미지정';

    let distanceValue = Infinity;
    let distanceText = '위치 미설정';  // 기본값 '위치 미설정' 유지

    // 내 위치 정보가 있고, 게시물에도 좌표가 있을 때
    if (isLocationSet && board.latitude && board.longitude) {
      try {
        // 원시 거리(미터) 계산
        distanceValue = calculateDistance(
            userLocation.value.lat,
            userLocation.value.lng,
            board.latitude,
            board.longitude
        );
        // 표시용 텍스트 (예: "1.2KM")
        distanceText = formatDistance(distanceValue);
      } catch (e) {
        console.error("거리 계산 오류:", e);
        distanceText = '계산 오류';
        distanceValue = Infinity;
      }
    }

    const redateText = timeSince(new Date(board.redate));

    return {
      boardId: board.boardId,
      title: board.title,
      location: address,
      distance: distanceText,
      redate: redateText,
      imgSrc: board.imageUrl ? board.imageUrl : 'placeholder.svg',
      _distanceValue: distanceValue,
      latitude: board.latitude,
      longitude: board.longitude,
    };
  });

  // 필터 상태에 따라 정렬
  if (activeFilter.value === 'distance' && isLocationSet) {
    // 거리순일 경우, 이미 계산된 _distanceValue를 기준으로 정렬만 수행
    processed.sort((a, b) => a._distanceValue - b._distanceValue);
  }

  // 최신순('recent')일 경우 별도 정렬 없이 반환 (서버에서 이미 최신순으로 줌)
  return processed;
});

// 라이프사이클 훅
onMounted(async () => {
  await naverMapService.loadNaverMapAPI();

  loadInitialBoards(); // 게시판 목록 초기 로드 (최신순)
  setCurrentLocation(false); // 페이지 로드 시 위치 설정 시도

  // 무한 스크롤 이벤트 리스너 등록 (DOM이 마운트된 후)
  if (listContainerRef.value) {
    listContainerRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  // 무한 스크롤 이벤트 리스너 해제
  if (listContainerRef.value) {
    listContainerRef.value.removeEventListener('scroll', handleScroll);
  }
  clearBoards(); // 컴포넌트 언마운트 시 Store 상태 초기화
});

// 검색 결과 핸들러
const handleSearchResults = (searchData) => {
  searchResults.value = searchData.results;
  isSearchMode.value = true;
};

// 검색 초기화 핸들러
const handleSearchCleared = () => {
  searchResults.value = [];
  isSearchMode.value = false;
};

</script>

<style scoped>
.search-wrapper {
  display: flex;
  width: 84.38vw;                 /* 1620px */
  height: 2.81vw;                 /* 54px */
  justify-content: space-between; /* 양쪽 정렬 (왼쪽 위치 정보, 오른쪽 버튼 그룹) */
  align-items: center;
  margin: 0.78vw 7.81vw 2.34vw 5.71vw;     /* 70px, 네비게이션 바와 header-row 간 높이 조정 */
}

.etc_wrapper {
  display: flex;
  width: 84.38vw;                 /* 1620px */
  height: 1.81vw;                 /* 54px */
  justify-content: flex-start; /* 왼쪽 정렬 (왼쪽 위치 정보, 오른쪽 버튼 그룹) */
  align-items: center;
  margin: 3.35vw 7.81vw -3.81vw 7.81vw;     /* 70px, 네비게이션 바와 header-row 간 높이 조정 */
}

.present-location{
  font-weight: 500;
}

/* 위치 정보 표시 섹션 */
.location-info {
  display: flex;  /* 아이콘과 텍스트 한줄 배치 */
  align-items: center;
  gap: 0.52vw; /* 10px */
  justify-content: flex-start;  /* 내부 요소들 컨테이너의 왼쪽으로 정렬 */
  margin-left: -0.16vw;   /* 3px */
}

.location-icon img {
  width: 1.35vw; /* 26px */
  height: 1.35vw; /* 26px */
  object-fit: contain;
}

/* 현재 위치 표시 섹션 */
.location-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.location-option {
  font-family: 'Pretendard', sans-serif;
  font-size: 1.25vw; /* 24px */
  font-weight: 700;
  color: #1a1a1a;
  max-width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.writing-button {
  display: flex;
  align-items: center;
  margin-right: -2.28vw;
}

/* 게시물 목록 불러오기 로딩/에러 메시지 */
.loading-message, .error-message {
  text-align: center;
  padding: 30px;
  color: #888;
  font-family: 'Pretendard', sans-serif;
  font-size: 1.04vw; /* 20px */
  width: 84.38vw;
  margin: 1.15vw auto 0 auto;
}

.error-message {
  color: #dc3545;
}

/* 무한 스크롤을 위한 컨테이너 스타일 */
.board-list-container {
  max-height: 70vh; /* 화면 높이에 따라 적절히 조정 */
}
</style>