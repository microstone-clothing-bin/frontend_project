// src/stores/favoritesStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wishService from '@/services/wishService'

export const useFavoritesStore = defineStore('favorites', () => {
    const favoriteIds = ref(new Set())
    const isLoading = ref(false)

    // 로그인 상태 확인
    const checkLoginStatus = () => {
        const savedUser = localStorage.getItem('auth_user')
        const isLoggedIn = localStorage.getItem('auth_isLoggedIn')
        return savedUser && isLoggedIn === 'true'
    }

    // 서버에서 즐겨찾기 목록 로드
    const loadFavorites = async () => {
        if (!checkLoginStatus()) {
            favoriteIds.value = new Set()
            return
        }

        try {
            isLoading.value = true
            const binIds = await wishService.getUserWishes()
            favoriteIds.value = new Set(binIds)
            console.log(`즐겨찾기 로드: ${favoriteIds.value.size}개`)
        } catch (error) {
            console.error('즐겨찾기 로드 실패:', error)
            favoriteIds.value = new Set()
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 추가
    const addFavorite = async (binId) => {
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        try {
            const result = await wishService.addWish(binId)
            if (result.success) {
                favoriteIds.value.add(binId)
                console.log(`즐겨찾기 추가: ${binId}`)
            }
            return result
        } catch (error) {
            console.error('즐겨찾기 추가 실패:', error)
            throw error
        }
    }

    // 즐겨찾기 제거
    const removeFavorite = async (binId) => {
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        try {
            const result = await wishService.removeWish(binId)
            if (result.success) {
                favoriteIds.value.delete(binId)
                console.log(`즐겨찾기 제거: ${binId}`)
            }
            return result
        } catch (error) {
            console.error('즐겨찾기 제거 실패:', error)
            throw error
        }
    }

    // 즐겨찾기 토글
    const toggleFavorite = async (binId) => {
        if (!checkLoginStatus()) {
            throw new Error('LOGIN_REQUIRED')
        }

        if (favoriteIds.value.has(binId)) {
            await removeFavorite(binId)
        } else {
            await addFavorite(binId)
        }
    }

    const isFavorite = (binId) => favoriteIds.value.has(binId)
    const isLoggedIn = computed(() => checkLoginStatus())
    const favoriteCount = computed(() => favoriteIds.value.size)
    const favoriteList = computed(() => Array.from(favoriteIds.value))

    return {
        favoriteIds,
        isLoading,
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