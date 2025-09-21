<template>
  <button
      v-if="visible"
      @click="handleSearchAgain"
      class="search-again-btn"
      :disabled="isLoading"
  >
    <span v-if="!isLoading">이 위치에서 다시 검색</span>
  </button>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search-again'])

const handleSearchAgain = () => {
  emit('search-again')
}
</script>

<style scoped>
.search-again-btn {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  z-index: 1000;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
}

.search-again-btn:hover:not(:disabled) {
  background: #7C3AED;
  transform: translateX(-50%) translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.search-again-btn:active:not(:disabled) {
  transform: translateX(-50%) translateY(0px);
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
}

.search-again-btn:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  opacity: 0.7;
  transform: translateX(-50%);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .search-again-btn {
    top: 15px;
    padding: 10px 20px;
    font-size: 13px;
    border-radius: 18px;
  }
}

@media (max-width: 480px) {
  .search-again-btn {
    top: 10px;
    padding: 8px 16px;
    font-size: 12px;
    border-radius: 16px;
  }
}
</style>