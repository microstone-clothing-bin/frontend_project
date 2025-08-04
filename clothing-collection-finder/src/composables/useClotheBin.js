// src/composables/useClotheBin.js 의류수거함 데이터 관리
import { storeToRefs } from 'pinia'
import { useClotheBinStore } from '@/stores/clotheBinStore'

export function useClotheBin() {
    const clotheBinStore = useClotheBinStore()

    // storeToRefs로 반응성 유지
    const { clothingBins, isLoading, error, totalCount } = storeToRefs(clotheBinStore)

    // 의류수거함 데이터 로드
    const loadClothingBins = async () => {
        await clotheBinStore.fetchClothingBins()
    }

    return {
        // 상태 (반응성 유지)
        clothingBins,
        isLoading,
        error,
        totalCount,

        // 액션
        loadClothingBins
    }
}