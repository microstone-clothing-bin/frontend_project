// src/composables/useAuth.js
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
    const authStore = useAuthStore()

    // storeToRefs로 반응성 유지
    const { user, isLoggedIn, isLoading, error } = storeToRefs(authStore)

    // 로그인
    const login = async (credentials) => {
        return await authStore.login(credentials)
    }

    // 로그아웃
    const logout = async () => {
        return await authStore.logout()
    }

    // 회원가입
    const signup = async (userData) => {
        return await authStore.signup(userData)
    }

    return {
        // 상태
        user,
        isLoggedIn,
        isLoading,
        error,

        // 액션
        login,
        logout,
        signup
    }
}