// src/services/wishService.js
import { api } from './apiService'

export const wishService = {
    /**
     * 즐겨찾기 추가
     * @param {number} userId 사용자 ID
     * @param {number} binId 의류수거함 ID
     * @returns {Promise<string>} 성공 시 "success"
     */
    async addWish(userId, binId) {
        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('binId', binId)

            const response = await api.post('/api/wish/add', formData)
            return response.data
        } catch (error) {
            console.error('즐겨찾기 추가 실패:', error)
            throw error
        }
    },

    /**
     * 즐겨찾기 제거
     * @param {number} userId 사용자 ID
     * @param {number} binId 의류수거함 ID
     * @returns {Promise<string>} 성공 시 "success"
     */
    async removeWish(userId, binId) {
        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('binId', binId)

            const response = await api.post('/api/wish/remove', formData)
            return response.data
        } catch (error) {
            console.error('즐겨찾기 제거 실패:', error)
            throw error
        }
    },

    /**
     * 사용자 즐겨찾기 목록 조회
     * @param {number} userId 사용자 ID
     * @returns {Promise<Array<number>>} 즐겨찾기한 binId 배열
     */
    async getUserWishes(userId) {
        try {
            const response = await api.get('/api/wish/list', {
                params: { userId }
            })
            return response.data
        } catch (error) {
            console.error('즐겨찾기 목록 조회 실패:', error)
            throw error
        }
    }
}

export default wishService