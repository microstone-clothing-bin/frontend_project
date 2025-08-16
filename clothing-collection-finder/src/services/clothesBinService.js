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
            const response = await api.get('/mid/bins')
            return response.data
        } catch (error) {
            console.error('의류수거함 데이터 조회 실패:', error)
            throw error
        }
    },

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