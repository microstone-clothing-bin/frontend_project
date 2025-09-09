<!-- src/components/ui/favorites/FavoriteButton.vue - 즐겨찾기 이미지 컴포넌트 -->
<template>
  <div
      class="bookmark-container"
      @click="handleClick"
  >
    <img
        :src="isActive ? '/src/assets/images/bookmark-filled.png' : '/src/assets/images/bookmark.png'"
        alt="즐겨찾기"
        class="bookmark-icon"
        :class="{ 'bookmark-active': isActive }"
    />
  </div>
</template>

<script setup>
// Props 정의
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits 정의
const emit = defineEmits(['click'])

// 클릭 핸들러
const handleClick = (event) => {
  event.stopPropagation() // 부모 클릭 이벤트 방지

  if (props.disabled) return

  emit('click')
}
</script>

<style scoped>
.bookmark-container {
  cursor: pointer;
  transition: transform 0.2s ease;
  display: inline-block;
  padding: 4px;
}

.bookmark-container:hover {
  transform: scale(1.1);
}

.bookmark-container:active {
  transform: scale(0.95);
}

.bookmark-icon {
  width: 20px;
  height: 20px;
  transition: all 0.2s ease;
}

.bookmark-icon.bookmark-active {
  filter: brightness(1.2) saturate(1.3);
}

/* 비활성화 상태 */
.bookmark-container:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.bookmark-container:disabled:hover {
  transform: none;
}
</style>