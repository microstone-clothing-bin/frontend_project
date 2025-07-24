// src/stores/clotheBinStore.js 의류수거함 상태 관리 스토어
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { clothesBinService } from '@/services/clothesBinService'

export const useClotheBinStore = defineStore('clotheBin', () => {
    // 상태 정의
    const clothingBins = ref([])           // 의류수거함 데이터 배열
    const isLoading = ref(false)           // 로딩 상태
    const error = ref(null)                // 에러 상태

    // 모든 의류수거함 데이터 가져오기
    const fetchClothingBins = async () => {
        try {
            isLoading.value = true
            error.value = null

            const data = await clothesBinService.getAllClothingBins()
            clothingBins.value = data

            console.log(`의류수거함 데이터 로드 완료: ${data.length}개`)
        } catch (err) {
            error.value = err.message
            console.error('의류수거함 데이터 로드 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    // getter - 총 개수
    const totalCount = computed(() => clothingBins.value.length)

    return {
        // 상태
        clothingBins,
        isLoading,
        error,

        // getter
        totalCount,

        // 액션
        fetchClothingBins
    }
})