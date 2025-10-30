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

    // localStorage에서 초기 상태 복원
    const initializeState = () => {
        try {
            const savedUser = localStorage.getItem('auth_user')
            const savedIsLoggedIn = localStorage.getItem('auth_isLoggedIn')

            if (savedUser && savedIsLoggedIn === 'true') {
                user.value = JSON.parse(savedUser)
                isLoggedIn.value = true
                console.log('로그인 상태 복원:', user.value)
            }
        } catch (error) {
            console.error('로그인 상태 복원 실패:', error)
            clearLocalStorage()
        }
    }

    // localStorage 저장
    const saveToLocalStorage = (userData) => {
        try {
            localStorage.setItem('auth_user', JSON.stringify(userData))
            localStorage.setItem('auth_isLoggedIn', 'true')
        } catch (error) {
            console.error('로그인 상태 저장 실패:', error)
        }
    }

    // localStorage 삭제
    const clearLocalStorage = () => {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_isLoggedIn')
    }

    // 로그인
    const login = async (credentials) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await authService.login(credentials)

            // JSON 응답 처리
            if (response && response.success) {
                console.log('로그인 응답:', response.user)
                isLoggedIn.value = true
                user.value = {
                    userId: response.user.userId,
                    nickname: response.user.nickname,
                    profileImageUrl: response.user.profileImageUrl || null
                }

                // localStorage에 저장
                saveToLocalStorage(user.value)

                console.log('로그인 성공, 상태 저장:', user.value)
            }

            return response
        } catch (err) {
            error.value = err.message
            isLoggedIn.value = false
            user.value = null
            clearLocalStorage()
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 회원가입 - ApiController JSON 응답에 맞게 수정
    const signup = async (userData) => {
        try {
            isLoading.value = true
            error.value = null

            const response = await authService.signup(userData)

            // ApiController는 Map<String, Object> 형태로 응답
            if (response.status === 'success') {
                return { success: true, message: response.message || '회원가입이 완료되었습니다.' }
            } else {
                throw new Error(response.message || '회원가입에 실패했습니다.')
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

            // localStorage도 삭제
            clearLocalStorage()
            console.log('로그아웃 완료, 상태 초기화')
        }
    }

    // 비밀번호 변경
    const resetPassword = async (newPassword) => {
        try {
            isLoading.value = true
            const response = await authService.resetPassword(newPassword)

            if (response.status === 'success') {
                // 비밀번호 변경 시 세션이 무효화되므로 로그아웃 상태로 설정
                user.value = null
                isLoggedIn.value = false
                clearLocalStorage()
            }
            return response
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 회원 탈퇴
    const deleteAccount = async () => {
        try {
            isLoading.value = true
            const response = await authService.deleteAccount()

            if (response.status === 'success') {
                // 회원 탈퇴 시 상태 초기화
                user.value = null
                isLoggedIn.value = false
                clearLocalStorage()
            }
            return response
        } catch (err) {
            error.value = err.message
            throw err
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
        clearLocalStorage()
    }
    // 프로필 업데이트 함수
    const updateProfile = (profileData) => {
        if (user.value) {
            user.value = {
                ...user.value,
                ...profileData
            }
            saveToLocalStorage(user.value)
        }
    }

    // 스토어 생성 시 초기 상태 복원
    initializeState()

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
        resetState,
        resetPassword,
        deleteAccount,
        initializeState,  // 필요시 수동으로 상태 복원할 수 있도록
        updateProfile
    }
})