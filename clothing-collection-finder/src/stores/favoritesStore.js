// src/stores/favoritesStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wishService from '@/services/wishService'

export const useFavoritesStore = defineStore('favorites', () => {
    const favoriteIds = ref(new Set())
    const isLoading = ref(false)
    const error = ref(null)

    // 로그인 상태 확인 (localStorage 기반)
    const checkLoginStatus = () => {
        const savedUser = localStorage.getItem('auth_user')
        const isLoggedIn = localStorage.getItem('auth_isLoggedIn')
        return savedUser && isLoggedIn === 'true'
    }

    // 현재 로그인된 사용자 ID 가져오기
    const getCurrentUserId = () => {
        try {
            if (!checkLoginStatus()) {
                return null
            }
            const savedUser = localStorage.getItem('auth_user')
            const user = JSON.parse(savedUser)
            return user.userId
        } catch (error) {
            console.error('사용자 ID 가져오기 실패:', error)
            return null
        }
    }

    // 즐겨찾기 목록 로드
    const loadFavorites = async () => {
        if (!checkLoginStatus()) {
            console.log('로그인이 필요합니다.')
            favoriteIds.value = new Set()
            return
        }

        const userId = getCurrentUserId()
        if (!userId) {
            favoriteIds.value = new Set()
            return
        }

        try {
            isLoading.value = true
            error.value = null

            const wishes = await wishService.getUserWishes(userId)
            favoriteIds.value = new Set(wishes)

            console.log(`즐겨찾기 데이터 로드: ${wishes.length}개`)
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 로드 실패:', err)
            favoriteIds.value = new Set()
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 추가
    const addFavorite = async (binId) => {
        // 로그인 체크
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        const userId = getCurrentUserId()
        if (!userId) {
            throw new Error('LOGIN_REQUIRED')
        }

        try {
            isLoading.value = true
            error.value = null

            const result = await wishService.addWish(userId, binId)

            if (result === 'success') {
                favoriteIds.value.add(binId)
                console.log(`즐겨찾기 추가: ${binId}`)
            }
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 추가 실패:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 제거
    const removeFavorite = async (binId) => {
        // 로그인 체크
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        const userId = getCurrentUserId()
        if (!userId) {
            throw new Error('LOGIN_REQUIRED')
        }

        try {
            isLoading.value = true
            error.value = null

            const result = await wishService.removeWish(userId, binId)

            if (result === 'success') {
                favoriteIds.value.delete(binId)
                console.log(`즐겨찾기 제거: ${binId}`)
            }
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 제거 실패:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 토글
    const toggleFavorite = async (binId) => {
        // 로그인 체크
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        if (favoriteIds.value.has(binId)) {
            await removeFavorite(binId)
        } else {
            await addFavorite(binId)
        }
    }

    // 특정 ID가 즐겨찾기인지 확인
    const isFavorite = (binId) => {
        return favoriteIds.value.has(binId)
    }

    // 로그인 여부 getter
    const isLoggedIn = computed(() => checkLoginStatus())

    // getter
    const favoriteCount = computed(() => favoriteIds.value.size)
    const favoriteList = computed(() => Array.from(favoriteIds.value))

    return {
        favoriteIds,
        isLoading,
        error,
        isLoggedIn,
        favoriteCount,
        favoriteList,
        loadFavorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        checkLoginStatus
    }
})