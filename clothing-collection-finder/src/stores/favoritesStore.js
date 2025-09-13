// src/stores/favoritesStore.js - 즐겨찾기 상태 관리 스토어
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// 현재 localStorage 기반으로 만들어져 있음 나중에 백엔드 연결하면 api기반으로 수정
export const useFavoritesStore = defineStore('favorites', () => {
    // 상태 정의
    const favoriteIds = ref(new Set())  // 즐겨찾기 ID들을 Set으로 관리 (중복 방지, 빠른 검색)

    // localStorage 키
    const STORAGE_KEY = 'clothing_bin_favorites'

    // 초기화 - localStorage에서 데이터 로드
    const initializeFavorites = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const favoriteArray = JSON.parse(stored)
                favoriteIds.value = new Set(favoriteArray)
                console.log(`즐겨찾기 데이터 로드: ${favoriteArray.length}개`)
            }
        } catch (error) {
            console.error('즐겨찾기 데이터 로드 실패:', error)
            favoriteIds.value = new Set()
        }
    }

    // localStorage에 저장
    const saveFavorites = () => {
        try {
            const favoriteArray = Array.from(favoriteIds.value)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteArray))
        } catch (error) {
            console.error('즐겨찾기 데이터 저장 실패:', error)
        }
    }

    // 즐겨찾기 추가
    const addFavorite = (id) => {
        favoriteIds.value.add(id)
        saveFavorites()
        console.log(`즐겨찾기 추가: ${id}`)
    }

    // 즐겨찾기 제거
    const removeFavorite = (id) => {
        favoriteIds.value.delete(id)
        saveFavorites()
        console.log(`즐겨찾기 제거: ${id}`)
    }

    // 즐겨찾기 토글 (있으면 제거, 없으면 추가)
    const toggleFavorite = (id) => {
        if (favoriteIds.value.has(id)) {
            removeFavorite(id)
        } else {
            addFavorite(id)
        }
    }

    // 특정 ID가 즐겨찾기인지 확인
    const isFavorite = (id) => {
        return favoriteIds.value.has(id)
    }

    // 모든 즐겨찾기 제거
    const clearAllFavorites = () => {
        favoriteIds.value.clear()
        saveFavorites()
        console.log('모든 즐겨찾기 제거')
    }

    // getter - 즐겨찾기 개수
    const favoriteCount = computed(() => favoriteIds.value.size)

    // getter - 즐겨찾기 ID 배열
    const favoriteList = computed(() => Array.from(favoriteIds.value))

    // 스토어 초기화
    initializeFavorites()

    return {
        // 상태
        favoriteIds,

        // getter
        favoriteCount,
        favoriteList,

        // 액션
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearAllFavorites,
        initializeFavorites
    }
})