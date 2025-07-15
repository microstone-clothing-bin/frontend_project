<template>
  <div class="sidebar-layout">
    <!-- 메인 콘텐츠 (지도) - 전체 배경 -->
    <main class="main-content">
      <slot :onSidebarToggle="handleSidebarToggle">
        <!-- 메인 콘텐츠가 여기에 들어감 -->
      </slot>
    </main>

    <!-- 사이드바 - 오버레이 -->
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-content">
        <slot name="sidebar">
          <!-- 기본 사이드바 내용으로 SidebarContent 사용 -->
          <SidebarContent />
        </slot>
      </div>
    </aside>

    <!-- 사이드바 토글 버튼 -->
    <button
        class="sidebar-toggle-btn"
        @click="toggleSidebar"
        :class="{ 'collapsed': isCollapsed }"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M15 18l-6-6 6-6" v-if="!isCollapsed"></path>
        <path d="M9 18l6-6-6-6" v-if="isCollapsed"></path>
      </svg>
    </button>

    <!-- 사이드바가 열려있을 때 지도 영역 클릭 방지용 오버레이 (모바일용) -->
    <div
        v-if="!isCollapsed"
        class="backdrop"
        @click="toggleSidebar"
    ></div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import SidebarContent from '../components/common/SidebarContent.vue'

export default {
  name: 'SidebarLayout',
  components: {
    SidebarContent
  },
  emits: ['sidebar-toggle'],
  setup(props, { emit }) {
    const isCollapsed = ref(false)

    const toggleSidebar = async () => {
      isCollapsed.value = !isCollapsed.value

      // 애니메이션 완료 후 이벤트 발생
      await nextTick()

      // 이벤트 emit (부모 컴포넌트에서 사용 가능)
      emit('sidebar-toggle', {
        isCollapsed: isCollapsed.value
      })
    }

    // 슬롯으로 전달할 핸들러 (이제 리사이즈는 불필요)
    const handleSidebarToggle = (callback) => {
      if (typeof callback === 'function') {
        callback(isCollapsed.value)
      }
    }

    return {
      isCollapsed,
      toggleSidebar,
      handleSidebarToggle
    }
  }
}
</script>

<style scoped>
/* 레이아웃 스타일 - 오버레이 방식 */
.sidebar-layout {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 메인 콘텐츠 (지도) - 전체 배경 고정 */
.main-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 사이드바 - 오버레이 */
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 100%;
  padding-top: 70px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

/* 사이드바 접힘 상태 */
.sidebar.collapsed {
  transform: translateX(-100%);
}

/* 사이드바 내용 */
.sidebar-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 사이드바 토글 버튼 */
.sidebar-toggle-btn {
  position: absolute;
  top: 50%;
  left: 400px;
  transform: translateY(-50%);
  width: 30px;
  height: 60px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: none;
  border-radius: 0 15px 15px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: #6b7280;
}

.sidebar-toggle-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar-toggle-btn:active {
  transform: translateY(-50%) scale(0.95);
}

/* 사이드바가 접혔을 때 버튼 위치 변경 */
.sidebar-toggle-btn.collapsed {
  left: 0;
  border-left: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 0 15px 15px 0;
}

.sidebar-toggle-btn svg {
  width: 12px;
  height: 12px;
}

/* 배경 오버레이 (모바일에서 사이드바 외부 클릭 시 닫기용) */
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 50;
  display: none; /* 기본적으로 숨김 */
}

/* 모바일에서만 배경 오버레이 표시 */
@media (max-width: 768px) {
  .backdrop {
    display: block;
  }

  .sidebar {
    width: 320px; /* 모바일에서 사이드바 폭 줄임 */
  }

  .sidebar-toggle-btn {
    left: 320px;
  }

  .sidebar-toggle-btn.collapsed {
    left: 0;
  }
}

/* 큰 화면에서는 배경 오버레이 숨김 */
@media (min-width: 769px) {
  .backdrop {
    display: none !important;
  }
}
</style>