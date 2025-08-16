<!-- src/layouts/SidebarLayout.vue -->
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
          <SidebarContent
              @moveToLocation="$emit('moveToLocation', $event)"
              @showDetailPanel="$emit('showDetailPanel', $event)"
          />
        </slot>
      </div>
    </aside>

    <!--  분리된 토글 버튼 컴포넌트 -->
    <SidebarToggleButton
        :isCollapsed="isCollapsed"
        :showDetailPanel="showDetailPanel"
        :sidebarWidth="401"
        :detailPanelWidth="335"
        @toggle="handleFullToggle"
    />

    <!-- 사이드바가 열려있을 때 지도 영역 클릭 방지용 오버레이 (모바일용) -->
    <div
        v-if="!isCollapsed"
        class="backdrop"
        @click="handleFullToggle"
    ></div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import SidebarContent from '../components/common/SidebarContent.vue'
import SidebarToggleButton from '../components/ui/SidebarToggleButton.vue'

export default {
  name: 'SidebarLayout',
  components: {
    SidebarContent,
    SidebarToggleButton
  },
  props: {
    showDetailPanel: {
      type: Boolean,
      default: false
    }
  },
  emits: ['sidebar-toggle', 'moveToLocation', 'showDetailPanel', 'closeDetailPanel', 'restoreDetailPanel'],
  setup(props, { emit }) {
    const isCollapsed = ref(false)
    const savedDetailPanelState = ref({
      wasOpen: false,
      binData: null
    }) // 🆕 이전 정보패널 상태 저장

    // 🆕 전체 토글 핸들러
    const handleFullToggle = async () => {
      if (!isCollapsed.value) {
        // 열린 상태 → 접기
        if (props.showDetailPanel) {
          // 정보패널이 열려있으면 상태 저장
          savedDetailPanelState.value.wasOpen = true
          emit('closeDetailPanel') // 정보패널 닫기
        } else {
          savedDetailPanelState.value.wasOpen = false
        }

        isCollapsed.value = true // 사이드바 접기
      } else {
        // 접힌 상태 → 펼치기
        isCollapsed.value = false // 사이드바 먼저 열기

        // 이전에 정보패널이 열려있었으면 복원
        if (savedDetailPanelState.value.wasOpen) {
          emit('restoreDetailPanel') // 정보패널 복원
        }
      }

      await nextTick()

      emit('sidebar-toggle', {
        isCollapsed: isCollapsed.value
      })
    }

    // 기존 함수들
    const toggleSidebar = async () => {
      isCollapsed.value = !isCollapsed.value
      await nextTick()
      emit('sidebar-toggle', {
        isCollapsed: isCollapsed.value
      })
    }

    const handleSidebarToggle = (callback) => {
      if (typeof callback === 'function') {
        callback(isCollapsed.value)
      }
    }

    return {
      isCollapsed,
      handleFullToggle,  // 🆕 전체 토글 핸들러
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
  width: 409px;
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
  overflow: hidden;
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
  display: none;
}

/* 모바일에서만 배경 오버레이 표시 */
@media (max-width: 768px) {
  .backdrop {
    display: block;
  }

  .sidebar {
    width: 320px;
  }
}

/* 큰 화면에서는 배경 오버레이 숨김 */
@media (min-width: 769px) {
  .backdrop {
    display: none !important;
  }
}
</style>