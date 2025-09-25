// src/services/clothesBinService.js 의류수거함 api 호출 
import { api } from './apiService'

/**
 * 의류수거함 관련 API 호출 서비스
 */
export const clothesBinService = {
    /**
     * 모든 의류수거함 목록 조회
     * 401 에러를 피하기 위해 한국 전체 영역의 in-bounds API 사용
     * @returns {Promise<Array>} 의류수거함 데이터 배열
     */
    async getAllClothingBins() {
        try {
            // 한국 전체를 커버하는 큰 bounds로 요청
            const response = await api.get('/api/clothing-bins/in-bounds', {
                params: {
                    swLat: 33.0,   // 한국 최남단 (제주도)
                    swLng: 124.0,  // 한국 최서단
                    neLat: 39.0,   // 한국 최북단
                    neLng: 132.0   // 한국 최동단 (독도)
                }
            })
            return response.data
        } catch (error) {
            console.error('의류수거함 데이터 조회 실패:', error)
            throw error
        }
    },

    /**
     * 지도 영역 내 의류수거함 조회 (성능 최적화)
     * 이 API는 인증 없이 사용 가능함
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
     * 주의: 이 API는 현재 401 에러 발생 - 백엔드 수정 필요
     * @param {number} lat 중심 위도
     * @param {number} lng 중심 경도
     * @param {number} radiusKm 반경(km)
     * @returns {Promise<Array>} 반경 내 의류수거함 데이터 배열
     */
    async getClothingBinsInRadius(lat, lng, radiusKm) {
        try {
            // 임시 해결책: in-bounds API로 대체
            // 중심점 기준으로 반경을 bounds로 변환
            const latDelta = radiusKm * 0.009; // 대략 1km = 0.009 위도
            const lngDelta = radiusKm * 0.011; // 대략 1km = 0.011 경도 (한국 기준)

            const response = await api.get('/api/clothing-bins/in-bounds', {
                params: {
                    swLat: lat - latDelta,
                    swLng: lng - lngDelta,
                    neLat: lat + latDelta,
                    neLng: lng + lngDelta
                }
            })

            // 클라이언트에서 반경 필터링 (정확한 거리 계산)
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
     * @param {number} lat1 첫 번째 지점 위도
     * @param {number} lng1 첫 번째 지점 경도
     * @param {number} lat2 두 번째 지점 위도
     * @param {number} lng2 두 번째 지점 경도
     * @returns {number} 거리 (km)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 지구 반지름 (km)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
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