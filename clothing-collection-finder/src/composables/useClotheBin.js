// src/composables/useClotheBin.js 의류수거함 데이터 관리
import { storeToRefs } from 'pinia'
import { useClotheBinStore } from '@/stores/clotheBinStore'

export function useClotheBin() {
    const clotheBinStore = useClotheBinStore()

    // storeToRefs로 반응성 유지
    const { clothingBins, isLoading, error, totalCount } = storeToRefs(clotheBinStore)

    // 의류수거함 데이터 로드 (전체 조회 - 즐겨찾기 등에서 사용)
    const loadClothingBins = async () => {
        await clotheBinStore.fetchClothingBins()
    }

    // 지도 영역 내 의류수거함 데이터 로드 (사각형 영역 - 지도에서 사용)
    const loadClothingBinsInBounds = async (swLat, swLng, neLat, neLng) => {
        await clotheBinStore.fetchClothingBinsInBounds(swLat, swLng, neLat, neLng)
    }

    return {
        // 상태 (반응성 유지)
        clothingBins,
        isLoading,
        error,
        totalCount,

        // 액션
        loadClothingBins,
        loadClothingBinsInBounds  // 새로 추가
    }
}