<template>
  <router-view />
</template>

<script>
import './styles/global.css'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    // 앱 시작 시 인증 상태 확인
    onMounted(async () => {
      try {
        await authStore.checkAuth()
        console.log('초기 인증 상태 확인 완료')
      } catch (error) {
        console.error('초기 인증 상태 확인 실패:', error)
      }
    })

    return {}
  }
}
</script>