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

            // 수정: 객체의 success 속성 확인
            if (response.success) {
                isLoggedIn.value = true

                // 사용자 정보 가져오기 (선택사항)
                try {
                    const userInfo = await authService.getMyPageInfo()
                    user.value = userInfo
                } catch (err) {
                    console.log('사용자 정보 가져오기 실패 (백엔드 문제):', err.message)
                    // 마이페이지 API가 작동하지 않아도 로그인은 성공으로 처리
                }
            }

            return response
        } catch (err) {
            error.value = err.message
            isLoggedIn.value = false
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