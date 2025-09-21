// src/services/clothesBinService.js 의류수거함 api 호출 
import { api } from './apiService'

/**
 * 의류수거함 관련 API 호출 서비스
 */
export const clothesBinService = {
    /**
     * 모든 의류수거함 목록 조회
     * @returns {Promise<Array>} 의류수거함 데이터 배열
     */
    async getAllClothingBins() {
        try {
            const response = await api.get('/api/clothing-bins')
            return response.data
        } catch (error) {
            console.error('의류수거함 데이터 조회 실패:', error)
            throw error
        }
    },

    /**
     * 지도 영역 내 의류수거함 조회 (성능 최적화)
     * @param {number} swLat 남서쪽 위도
     * @param {number} swLng 남서쪽 경도
     * @param {number} neLat 북동쪽 위도
     * @param {number} neLng 북동쪽 경도
     * @returns {Promise<Array>} 영역 내 의류수거함 데이터 배열
     */
    async getClothingBinsInBounds(swLat, swLng, neLat, neLng) {
        try {
            const response = await api.get('/api/clothing-bins/in-bounds', {
                params: { swLat, swLng, neLat, neLng }
            })
            return response.data
        } catch (error) {
            console.error('지도 영역 내 의류수거함 조회 실패:', error)
            throw error
        }
    },

    /**
     * 반경 기반 의류수거함 검색
     * @param {number} lat 중심 위도
     * @param {number} lng 중심 경도
     * @param {number} radiusKm 반경(km)
     * @returns {Promise<Array>} 반경 내 의류수거함 데이터 배열
     */
    async getClothingBinsInRadius(lat, lng, radiusKm) {
        try {
            const response = await api.get('/api/clothing-bins', {
                params: { lat, lng, radiusKm }
            })
            return response.data
        } catch (error) {
            console.error('반경 기반 의류수거함 조회 실패:', error)
            throw error
        }
    }

    /**
     * 특정 ID로 의류수거함 조회 (백엔드 완성 후 사용 예정)
     * @param {number} id 의류수거함 ID
     * @returns {Promise<Object>} 의류수거함 데이터
     */
    // async getClothingBinById(id) {
    //   try {
    //     const response = await api.get(`/clothing-bins/${id}`)
    //     return response.data
    //   } catch (error) {
    //     console.error(`의류수거함 ID ${id} 조회 실패:`, error)
    //     throw error
    //   }
    // }
}

export default clothesBinService