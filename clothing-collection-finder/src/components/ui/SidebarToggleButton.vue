<!-- src/components/ui/SidebarToggleButton.vue -->
<template>
  <button
      class="sidebar-toggle-btn"
      @click="$emit('toggle')"
      :style="{ left: buttonPosition }"
      :class="{ 'collapsed': isCollapsed }"
  >
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M15 18l-6-6 6-6" v-if="!isCollapsed"></path>
      <path d="M9 18l6-6-6-6" v-if="isCollapsed"></path>
    </svg>
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SidebarToggleButton',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    },
    showDetailPanel: {
      type: Boolean,
      default: false
    },
    sidebarWidth: {
      type: Number,
      default: 400
    },
    detailPanelWidth: {
      type: Number,
      default: 350
    }
  },
  emits: ['toggle'],
  setup(props) {
    // 토글 버튼 위치 계산
    const buttonPosition = computed(() => {
      if (props.isCollapsed) {
        return '0px'  // 사이드바가 접혔을 때
      }
      if (props.showDetailPanel) {
        return `${props.sidebarWidth + props.detailPanelWidth}px`  // 사이드바 + 정보패널
      }
      return `${props.sidebarWidth}px`  // 사이드바만
    })

    return {
      buttonPosition
    }
  }
}
</script>

<style scoped>
.sidebar-toggle-btn {
  position: absolute;
  top: 50%;
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
  transition: all 0.3s ease;  /* 위치 변경 애니메이션 */
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

/* 사이드바가 접혔을 때 버튼 스타일 */
.sidebar-toggle-btn.collapsed {
  border-left: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 0 15px 15px 0;
}

.sidebar-toggle-btn svg {
  width: 12px;
  height: 12px;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .sidebar-toggle-btn {
    /* 모바일에서 필요한 추가 스타일 */
  }
}
</style>