// src/services/wishService.js
import { api } from './apiService'

const getCurrentUserId = () => {
    try {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            return user.userId
        }
    } catch (error) {
        console.error('사용자 ID 가져오기 실패:', error)
    }
    return null
}

export const wishService = {
    // 즐겨찾기 추가
    async addWish(binId) {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            // ✅ userId를 쿼리 파라미터로, binId는 경로에
            const response = await api.post(`/api/wish/add/${binId}?userId=${userId}`, {})

            if (response.data && response.data.status === 'success') {
                return { success: true, message: response.data.message }
            }
            return { success: false, message: '즐겨찾기 추가에 실패했습니다.' }
        } catch (error) {
            console.error('즐겨찾기 추가 실패:', error)
            throw error
        }
    },

    // 즐겨찾기 제거
    async removeWish(binId) {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await api.delete(`/api/wish/remove/${binId}?userId=${userId}`)

            if (response.data && response.data.status === 'success') {
                return { success: true, message: response.data.message }
            }
            return { success: false, message: '즐겨찾기 제거에 실패했습니다.' }
        } catch (error) {
            console.error('즐겨찾기 제거 실패:', error)
            throw error
        }
    },

    // 즐겨찾기 목록 조회
    async getUserWishes() {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                return []
            }

            const response = await api.get(`/api/wish/list?userId=${userId}`)

            // 응답이 binId 배열
            if (Array.isArray(response.data)) {
                return response.data
            }
            return []
        } catch (error) {
            console.error('즐겨찾기 목록 조회 실패:', error)
            return []
        }
    }
}

export default wishService