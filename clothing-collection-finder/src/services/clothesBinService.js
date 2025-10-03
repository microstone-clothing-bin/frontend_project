// src/services/clothesBinService.js
import { api } from './apiService'

export const clothesBinService = {
    /**
     * 모든 의류수거함 목록 조회
     * @returns {Promise<Array>} 의류수거함 데이터 배열
     */
    async getAllClothingBins() {
        try {
            // ✅ 수정: URL 경로 변경
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
            const latDelta = radiusKm * 0.009;
            const lngDelta = radiusKm * 0.011;

            const response = await api.get('/api/clothing-bins/in-bounds', {
                params: {
                    swLat: lat - latDelta,
                    swLng: lng - lngDelta,
                    neLat: lat + latDelta,
                    neLng: lng + lngDelta
                }
            })

            return response.data.filter(bin => {
                const distance = this.calculateDistance(lat, lng, bin.latitude, bin.longitude)
                return distance <= radiusKm
            })
        } catch (error) {
            console.error('반경 기반 의류수거함 조회 실패:', error)
            throw error
        }
    },

    /**
     * 두 지점 간의 거리 계산 (Haversine 공식)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

export default clothesBinService