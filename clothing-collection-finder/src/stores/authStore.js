// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
    // 상태
    const user = ref(null)
    const isLoggedIn = ref(false)
    const isLoading = ref(false)
    const error = ref(null)

    // 로그인
    const login = async (credentials) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await authService.login(credentials)

            if (response === 'success') {
                isLoggedIn.value = true
                // 세션 기반이므로 사용자 정보는 별도 API로 가져와야 함
            }

            return response
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 로그아웃
    const logout = async () => {
        try {
            await authService.logout()
            user.value = null
            isLoggedIn.value = false
        } catch (err) {
            console.error('로그아웃 실패:', err)
        }
    }

    return {
        user,
        isLoggedIn,
        isLoading,
        error,
        login,
        logout
    }
})