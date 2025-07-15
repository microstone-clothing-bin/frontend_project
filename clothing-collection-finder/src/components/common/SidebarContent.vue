<!-- src/components/common/SidebarContent.vue -->
<template>
  <div class="sidebar-content-wrapper">
    <!-- 검색창 섹션 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <input
            type="text"
            placeholder="장소, 주소 검색"
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
        <select class="distance-filter">
          <option value="">거리순</option>
          <option value="latest">최신순</option>
        </select>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'SidebarContent'
}
</script>

<style scoped>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>