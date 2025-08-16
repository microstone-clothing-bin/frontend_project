// src/composables/favorites/useFavorites.js - 즐겨찾기 메인 로직
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useClotheBinStore } from '@/stores/clotheBinStore'

export function useFavorites() {
    const favoritesStore = useFavoritesStore()
    const clotheBinStore = useClotheBinStore()

    // 즐겨찾기 스토어에서 상태 가져오기
    const { favoriteCount, favoriteList } = storeToRefs(favoritesStore)

    // 의류수거함 스토어에서 전체 데이터 가져오기
    const { clothingBins } = storeToRefs(clotheBinStore)

    // 즐겨찾기 의류수거함 데이터 (실제 객체들)
    const favoriteClothingBins = computed(() => {
        return clothingBins.value.filter(bin => favoriteList.value.includes(bin.id))
    })

    // 즐겨찾기 추가
    const addToFavorites = (id) => {
        favoritesStore.addFavorite(id)
    }

    // 즐겨찾기 제거
    const removeFromFavorites = (id) => {
        favoritesStore.removeFavorite(id)
    }

    // 즐겨찾기 토글
    const toggleFavorite = (id) => {
        favoritesStore.toggleFavorite(id)
    }

    // 즐겨찾기 여부 확인
    const isFavorite = (id) => {
        return favoritesStore.isFavorite(id)
    }

    // 모든 즐겨찾기 제거
    const clearFavorites = () => {
        favoritesStore.clearAllFavorites()
    }

    // 즐겨찾기가 비어있는지 확인
    const isEmpty = computed(() => favoriteCount.value === 0)

    return {
        // 상태
        favoriteCount,
        favoriteList,
        favoriteClothingBins,
        isEmpty,

        // 액션
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearFavorites
    }
}