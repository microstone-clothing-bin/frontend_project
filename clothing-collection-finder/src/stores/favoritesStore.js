// src/stores/favoritesStore.js - 즐겨찾기 상태 관리 스토어
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wishService from '@/services/wishService'

export const useFavoritesStore = defineStore('favorites', () => {
    // 상태 정의
    const favoriteIds = ref(new Set())
    const isLoading = ref(false)
    const error = ref(null)

    // 임시 사용자 ID (나중에 authStore에서 가져와야 함)
    const currentUserId = ref(1)

    // 즐겨찾기 목록 로드 (백엔드에서)
    const loadFavorites = async () => {
        try {
            isLoading.value = true
            error.value = null

            const wishes = await wishService.getUserWishes(currentUserId.value)
            favoriteIds.value = new Set(wishes)

            console.log(`즐겨찾기 데이터 로드: ${wishes.length}개`)
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 로드 실패:', err)
            // 에러 시 빈 Set으로 초기화
            favoriteIds.value = new Set()
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 추가 (백엔드 API 호출)
    const addFavorite = async (binId) => {
        console.log('addFavorite 함수 시작, binId:', binId)
        try {
            isLoading.value = true
            error.value = null

            const result = await wishService.addWish(currentUserId.value, binId)

            console.log('백엔드 응답 결과:', result)  // 이 로그 추가
            console.log('응답 타입:', typeof result)  // 이 로그 추가

            if (result === 'success') {
                favoriteIds.value.add(binId)
                console.log(`즐겨찾기 추가: ${binId}`)
                console.log('현재 즐겨찾기 목록:', Array.from(favoriteIds.value))  // 이 로그 추가
            } else {
                console.log('예상과 다른 응답:', result)  // 이 로그 추가
            }
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 추가 실패:', err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 즐겨찾기 제거 (백엔드 API 호출)
    const removeFavorite = async (binId) => {
        try {
            isLoading.value = true
            error.value = null

            const result = await wishService.removeWish(currentUserId.value, binId)

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

    // 즐겨찾기 토글 (비동기)
    const toggleFavorite = async (binId) => {
        console.log('toggleFavorite 함수 실행됨, binId:', binId)  // 추가
        console.log('현재 즐겨찾기 상태:', favoriteIds.value.has(binId))  // 추가

        if (favoriteIds.value.has(binId)) {
            console.log('제거 실행')  // 추가
            await removeFavorite(binId)
        } else {
            console.log('추가 실행')  // 추가
            await addFavorite(binId)
        }
    }

    // 특정 ID가 즐겨찾기인지 확인
    const isFavorite = (binId) => {
        return favoriteIds.value.has(binId)
    }

    // 모든 즐겨찾기 제거 (실제로는 백엔드에서 모든 항목 제거)
    const clearAllFavorites = async () => {
        try {
            isLoading.value = true

            // 현재 즐겨찾기들을 하나씩 제거 (백엔드에 일괄 삭제 API가 없다면)
            const promises = Array.from(favoriteIds.value).map(binId =>
                wishService.removeWish(currentUserId.value, binId)
            )

            await Promise.all(promises)
            favoriteIds.value.clear()
            console.log('모든 즐겨찾기 제거 완료')
        } catch (err) {
            error.value = err.message
            console.error('즐겨찾기 전체 제거 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    // getter - 즐겨찾기 개수
    const favoriteCount = computed(() => favoriteIds.value.size)

    // getter - 즐겨찾기 ID 배열
    const favoriteList = computed(() => Array.from(favoriteIds.value))

    return {
        // 상태
        favoriteIds,
        isLoading,
        error,
        currentUserId,

        // getter
        favoriteCount,
        favoriteList,

        // 액션
        loadFavorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearAllFavorites
    }
})