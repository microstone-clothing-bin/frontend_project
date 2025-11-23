<!-- 게시판 검색창 -->
<template>
  <div class="search-section">
    <div class="search-input-wrapper">
      <!-- 검색창 배경 이미지 -->
      <div class="search-input-background">
        <img src="@/assets/images/sidebar-rectangle.png" alt="검색창 배경" />
      </div>

      <!-- 검색 기능 추가된 입력창 -->
      <input
          v-model="searchQuery"
          @input="debouncedSearch"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="제목 또는 도로명 주소를 입력하세요"
          class="search-input-overlay"
          :disabled="isSearching"
      />

      <!--검색 버튼 -->
      <button
          @click="handleSearch"
          class="search-button-image"
          :disabled="isSearching"
      >
        <img src="@/assets/images/sidebar-searchbutton.png" alt="검색" />
      </button>

      <!-- 검색 초기화 버튼 (검색 모드일 때만 표시) -->
      <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-search-button"
          title="검색 초기화"
      >
        <img src="@/assets/images/reset-search-button.png" class="reset-button" alt="검색 초기화" />
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBoard } from '@/composables/useBoard'; // Store에서 전체 게시물 목록 가져옴

// props 정의 - props 대신 Store에서 직접 데이터를 가져오는 방식 사용
const props = defineProps({
  // searchData: { type: Array, default: () => [] }
});

const emit = defineEmits(['search-results', 'search-cleared']);

const { boards: allBoards } = useBoard(); // useBoard가 Store의 boards를 ref로 제공

// 검색 로직
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

// 검색 점수 계산 (게시물 제목 + 주소)
const calculateScore = (board, query) => {
  const title = (board.title || '').toLowerCase();
  const roadAddress = (board.roadAddress || '').toLowerCase();
  const searchTerm = query.toLowerCase();

  if (!searchTerm) return 0;

  let score = 0;

  // 1. 제목에서 점수 계산 (가중치 높음)
  if (title.includes(searchTerm)) {
    score += 60;
    if (title.startsWith(searchTerm)) {
      score += 40; // 제목이 검색어로 시작하면 100점
    }
  }

  // 2. 주소에서 점수 계산 (가중치 낮음)
  if (roadAddress.includes(searchTerm)) {
    score += 30;
    if (roadAddress.startsWith(searchTerm)) {
      score += 20; // 주소가 검색어로 시작하면 50점
    }
  }

  return score;
};

// 메인 검색 함수
const performSearch = (query) => {
  const trimmedQuery = query.trim();

  // 빈 검색어 처리
  if (!trimmedQuery) {
    searchResults.value = [];
    emit('search-cleared'); // 검색어가 비면 초기화 이벤트 발생
    return;
  }

  isSearching.value = true;

  try {
    // Store의 allBoards.value를 검색 대상으로 사용
    const scoredResults = allBoards.value
        .map(board => {
          const score = calculateScore(board, trimmedQuery);
          return {
            ...board,
            searchScore: score,
          };
        })
        .filter(board => board.searchScore > 0) // 점수가 있는 것만
        .sort((a, b) => b.searchScore - a.searchScore); // 점수 높은 순 정렬

    searchResults.value = scoredResults;

    emit('search-results', {
      results: searchResults.value,
      query: trimmedQuery
    });

  } catch (error) {
    console.error('게시판 검색 중 오류:', error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// 마지막 이벤트 발생 후 일정 시간이 지났을 때 한 번만 함수를 실행시킴
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);  // 이전에 설정된 타이머가 있다면 취소
    // 새로운 타이머 설정 (delay 시간 뒤에 func 실행)
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 0.4초 기다렸다가 검색 실행 - 불필요한 연산 방지 (성능 최적화)
const debouncedSearch = debounce(() => {
  performSearch(searchQuery.value);
}, 400);

// 즉시 검색 핸들러 (Enter 또는 검색 버튼을 눌렀을 때 400ms 딜레이 없이 즉시 결과 보여줌)
const handleSearch = () => {
  // debounce 중인 것을 취소하고 즉시 실행
  clearTimeout(debouncedSearch.timeoutId);
  performSearch(searchQuery.value);
};

// 검색 초기화 핸들러
const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  isSearching.value = false;
  emit('search-cleared'); // 초기화 이벤트 발생
};

</script>

<style scoped>
/* 검색 초기화 버튼 스타일 */
.clear-search-button {
  position: absolute;
  right: 2.95vw;    /* 53px */
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  width: 1.25vw;    /* 24px */
  height: 1.25vw;    /* 24px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.clear-search-button:hover {
  background-color: #f0f0f0;
  color: #666;
}

/* 검색 입력창 비활성화 상태 */
.search-input-overlay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-button-image:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  width: 0.78vw;
  height: 0.78vw;
}
</style>