// src/stores/clotheBinStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { clothesBinService } from '@/services/clothesBinService'

export const useClotheBinStore = defineStore('clotheBin', () => {
    const clothingBins = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // ✅ 데이터 변환 함수 추가
    const transformBinData = (bins) => {
        return bins.map(bin => ({
            id: bin.id,
            latitude: bin.lat,           // lat → latitude 변환
            longitude: bin.lng,          // lng → longitude 변환
            roadAddress: bin.address || bin.name || '주소 정보 없음',  // address를 roadAddress로 매핑
            landLotAddress: bin.name || bin.address || null,  // name을 landLotAddress로 매핑
            address: bin.address || bin.name || '주소 정보 없음',
            name: bin.name || bin.address || '주소 정보 없음',
            // 기타 필드가 있다면 추가
            ...bin  // 나머지 데이터 유지
        }))
    }

    // 모든 의류수거함 데이터 가져오기
    const fetchClothingBins = async () => {
        try {
            isLoading.value = true
            error.value = null

            const data = await clothesBinService.getAllClothingBins()
            clothingBins.value = transformBinData(data)  // ✅ 변환 적용

            console.log(`의류수거함 데이터 로드 완료: ${data.length}개`)
        } catch (err) {
            error.value = err.message
            console.error('의류수거함 데이터 로드 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    // 지도 사각형 영역 내 의류수거함 데이터 가져오기
    const fetchClothingBinsInBounds = async (swLat, swLng, neLat, neLng) => {
        try {
            isLoading.value = true
            error.value = null

            const data = await clothesBinService.getClothingBinsInBounds(swLat, swLng, neLat, neLng)
            clothingBins.value = transformBinData(data)  // ✅ 변환 적용

            console.log(`사각형 영역 내 의류수거함 데이터 로드 완료: ${data.length}개`)
        } catch (err) {
            error.value = err.message
            console.error('사각형 영역 검색 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    const totalCount = computed(() => clothingBins.value.length)
    const sidebarClothingBins = computed(() => clothingBins.value.slice(0, 15))

    return {
        clothingBins,
        isLoading,
        error,
        totalCount,
        sidebarClothingBins,
        fetchClothingBins,
        fetchClothingBinsInBounds
    }
})