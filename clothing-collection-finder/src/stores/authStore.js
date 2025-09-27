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

            // JSON 응답 처리
            if (response && response.success) {
                isLoggedIn.value = true // 이 부분이 실행되어야 함
                user.value = response.user // 사용자 정보 저장
            }

            return response
        } catch (err) {
            error.value = err.message
            isLoggedIn.value = false
            user.value = null
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 회원가입
    const signup = async (userData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await authService.signup(userData)

            if (response === 'success') {
                return { success: true, message: '회원가입이 완료되었습니다.' }
            } else {
                throw new Error(response || '회원가입에 실패했습니다.')
            }
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
            isLoading.value = true
            await authService.logout()
        } catch (err) {
            console.error('로그아웃 API 실패:', err)
        } finally {
            // 항상 상태 초기화
            user.value = null
            isLoggedIn.value = false
            error.value = null
            isLoading.value = false
        }
    }

    // 인증 상태 확인 (간단하게 수정)
    const checkAuth = async () => {
        try {
            isLoading.value = true
            const authStatus = await authService.checkAuthStatus()

            if (authStatus.isAuthenticated) {
                isLoggedIn.value = true
                user.value = authStatus.user
            } else {
                isLoggedIn.value = false
                user.value = null
            }

            return authStatus.isAuthenticated
        } catch (err) {
            console.log('인증 상태 확인 실패 (정상적일 수 있음):', err.message)
            isLoggedIn.value = false
            user.value = null
            return false
        } finally {
            isLoading.value = false
        }
    }

    // 상태 초기화
    const resetState = () => {
        user.value = null
        isLoggedIn.value = false
        isLoading.value = false
        error.value = null
    }

    return {
        // 상태
        user,
        isLoggedIn,
        isLoading,
        error,

        // 액션
        login,
        signup,
        logout,
        checkAuth,
        resetState
    }
})