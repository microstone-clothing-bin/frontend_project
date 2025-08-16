<template>
  <button
      class="sidebar-toggle-btn"
      @click="$emit('toggle')"
      :style="{ left: buttonPosition }"
      :class="{ 'collapsed': isCollapsed }"
  >
    <img
        :src="toggleButtonImage"
        alt="사이드바 토글"
        class="toggle-icon"
    >
  </button>
</template>

<script>
import { computed } from 'vue'
import sidebarToggleImageSrc from '@/assets/images/sidebartogglebutton.png'

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
    const buttonPosition = computed(() => {
      if (props.isCollapsed) {
        return '-6px' //사이드바 접을때 버튼 위치 조절
      }
      if (props.showDetailPanel) {
        return `${props.sidebarWidth + 378}px` // 정보패널 접는 버튼 양 옆으로 조절
      }
      return `${props.sidebarWidth}px`
    })

    const toggleButtonImage = sidebarToggleImageSrc

    return {
      buttonPosition,
      toggleButtonImage
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
  height: 55px;
  background: none !important;
  border: none !important;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  box-shadow: none !important;
  transition: all 0.3s ease;
  color: #6b7280;
}

.sidebar-toggle-btn:hover {
  background: none !important;
  color: #374151;
  transform: translateY(-50%) scale(1.05);
}

.sidebar-toggle-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.sidebar-toggle-btn.collapsed {
  /* 접혔을 때도 동일하게 투명 배경 유지 */
}

.toggle-icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar-toggle-btn {
    /* 모바일에서 필요한 추가 스타일 */
  }
}
</style>