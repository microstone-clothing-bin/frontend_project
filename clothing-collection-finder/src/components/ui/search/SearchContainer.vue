<!-- src/components/ui/search/SearchContainer.vue -->
<template>
  <div class="search-section">
    <div class="search-input-wrapper">
      <!-- 검색창 배경 이미지 -->
      <div class="search-input-background">
        <img src="@/assets/images/sidebar-rectangle.png" alt="검색창 배경" />
      </div>

      <!-- 실제 검색 기능 추가된 입력창 -->
      <input
          v-model="searchQuery"
          @input="handleSearch"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="00시 00동"
          class="search-input-overlay"
          :disabled="isSearching"
      />

      <!-- 검색 버튼에 기능 추가 -->
      <button
          @click="handleSearch"
          class="search-button-image"
          :disabled="isSearching"
      >
        <img src="@/assets/images/sidebar-searchbutton.png" alt="검색" />
      </button>

      <!-- 검색 초기화 버튼 (검색 모드일 때만 표시) -->
      <button
          v-if="isSearchMode"
          @click="clearSearch"
          class="clear-search-button"
          title="검색 초기화"
      >
        <img src="@/assets/images/reset-search-button.png" alt="검색 초기화" />
      </button>

    </div>
  </div>
</template>

<script>
import { useSearch } from '@/composables/search/useSearch'

// lodash 없이 debounce 함수 직접 구현
function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export default {
  name: 'SearchContainer',
  props: {
    // 검색할 데이터 배열
    searchData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['search-results', 'search-cleared'],
  setup(props, { emit }) {
    // 검색 기능 Composable 사용
    const {
      searchQuery,
      searchResults,
      isSearchMode,
      isSearching,
      performSearch,
      clearSearch: clearSearchBase
    } = useSearch()

    // Debounced 검색 함수 (300ms 지연)
    const debouncedSearch = debounce((query) => {
      performSearch(props.searchData, query)
      // 검색 결과를 부모 컴포넌트로 전달
      emit('search-results', {
        results: searchResults.value,
        isSearchMode: isSearchMode.value,
        query: query
      })
    }, 300)

    // 검색 핸들러
    const handleSearch = () => {
      debouncedSearch(searchQuery.value)
    }

    // 검색 초기화 핸들러
    const clearSearch = () => {
      clearSearchBase()
      // 검색 초기화를 부모 컴포넌트로 알림
      emit('search-cleared')
    }

    return {
      searchQuery,
      searchResults,
      isSearchMode,
      isSearching,
      handleSearch,
      clearSearch
    }
  }
}
</script>

<style scoped>
.search-section {
  /* 기존 스타일을 그대로 유지 */
}

.search-input-wrapper {
  position: relative;
  /* 기존 스타일을 그대로 유지 */
}

.search-input-background {
  /* 기존 스타일을 그대로 유지 */
}

.search-input-overlay {
  /* 기존 스타일을 그대로 유지 */
}

.search-button-image {
  /* 기존 스타일을 그대로 유지 */
}



/* 검색 초기화 버튼 스타일 */
.clear-search-button {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
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
</style>