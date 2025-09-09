// src/composables/currentlocation/useDistanceCalculator.js
// 거리 계산 전용 Composable

import { ref, computed } from 'vue'
import { useCoordinates } from './useCoordinates'

export function useDistanceCalculator() {
    // 좌표 Composable 사용
    const { getCurrentLatLng } = useCoordinates()

    //  로컬 반응형 상태
    const lastCalculation = ref(null)    // 마지막 계산 결과 저장
    const calculationError = ref(null)   // 계산 에러 메시지

    /**
     *  하버사인 공식을 사용한 두 좌표 간 거리 계산 (정확한 계산)
     * @param {number} lat1 - 첫 번째 지점 위도 (-90 ~ 90)
     * @param {number} lng1 - 첫 번째 지점 경도 (-180 ~ 180)
     * @param {number} lat2 - 두 번째 지점 위도 (-90 ~ 90)
     * @param {number} lng2 - 두 번째 지점 경도 (-180 ~ 180)
     * @returns {number} 거리 (미터 단위)
     */
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        try {
            calculationError.value = null

            // 입력값 검증
            if (!isValidCoordinates(lat1, lng1) || !isValidCoordinates(lat2, lng2)) {
                throw new Error('유효하지 않은 좌표입니다.')
            }

            // 같은 위치인 경우 0 반환
            if (lat1 === lat2 && lng1 === lng2) {
                return 0
            }

            const R = 6371000 // 지구 반지름 (미터)

            // 도 단위를 라디안으로 변환
            const dLat = toRadians(lat2 - lat1)   // 위도 차이
            const dLng = toRadians(lng2 - lng1)   // 경도 차이
            const radLat1 = toRadians(lat1)       // 첫 번째 지점 위도
            const radLat2 = toRadians(lat2)       // 두 번째 지점 위도

            // 하버사인 공식 적용
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(radLat1) * Math.cos(radLat2) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2)

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const distance = R * c  // 최종 거리 (미터)

            // 계산 결과 저장 (디버깅 및 추적용)
            lastCalculation.value = {
                from: { lat: lat1, lng: lng1 },     // 출발점
                to: { lat: lat2, lng: lng2 },       // 도착점
                distance: distance,                 // 계산된 거리
                timestamp: new Date()               // 계산 시간
            }

            // console.log('[useDistanceCalculator] 거리 계산 완료:', {
            //     from: `${lat1}, ${lng1}`,
            //     to: `${lat2}, ${lng2}`,
            //     distance: `${Math.round(distance)}m`
            // })

            return distance

        } catch (error) {
            const errorMsg = `거리 계산 오류: ${error.message}`
            calculationError.value = errorMsg
            console.error('[useDistanceCalculator]', errorMsg)
            return null
        }
    }

    /**
     *  현재 위치에서 특정 지점까지의 거리 계산
     * @param {number} targetLat - 목표 지점 위도
     * @param {number} targetLng - 목표 지점 경도
     * @returns {number|null} 거리 (미터), 실패 시 null
     */
    const getDistanceFromCurrentLocation = (targetLat, targetLng) => {
        try {
            calculationError.value = null

            // 현재 위치 좌표 가져오기
            const currentCoords = getCurrentLatLng()

            if (!currentCoords) {
                throw new Error('현재 위치 정보가 없습니다.')
            }

            if (!isValidCoordinates(targetLat, targetLng)) {
                throw new Error('목표 지점 좌표가 유효하지 않습니다.')
            }

            // 현재 위치 → 목표 지점 거리 계산
            return calculateDistance(
                currentCoords.lat,    // 현재 위도
                currentCoords.lng,    // 현재 경도
                targetLat,           // 목표 위도
                targetLng            // 목표 경도
            )

        } catch (error) {
            const errorMsg = `현재 위치 거리 계산 오류: ${error.message}`
            calculationError.value = errorMsg
            console.error('[useDistanceCalculator]', errorMsg)
            return null
        }
    }

    /**
     * 거리를 사용자 친화적인 형태로 포맷팅
     * @param {number} distanceInMeters - 거리 (미터 단위)
     * @param {Object} options - 포맷 옵션
     * @returns {string} 포맷된 거리 문자열 (예: "1.5KM", "500M")
     */
    const formatDistance = (distanceInMeters, options = {}) => {
        const {
            precision = 0,           // 소수점 자릿수 (기본: 정수)
            useKilometers = true,    // 1km 이상일 때 km 단위 사용 여부
            kmThreshold = 1000,      // km 단위로 변환할 임계값 (미터)
            showUnit = true,         // 단위 표시 여부 (M, KM)
            shortUnit = true         // 짧은 단위 (M, KM) vs 긴 단위 (미터, 킬로미터)
        } = options

        // null/undefined 처리
        if (distanceInMeters === null || distanceInMeters === undefined) {
            return '거리 정보 없음'
        }

        // 음수 처리
        if (distanceInMeters < 0) {
            return '유효하지 않은 거리'
        }

        // 1m 미만은 1m로 표시 (0m 방지)
        if (distanceInMeters < 1) {
            return showUnit ? (shortUnit ? '1M' : '1미터') : '1'
        }

        // km 단위 사용 조건 (1000m 이상)
        if (useKilometers && distanceInMeters >= kmThreshold) {
            const kilometers = distanceInMeters / 1000
            const formattedKm = precision > 0
                ? kilometers.toFixed(precision)    // 소수점 있음 (1.5)
                : Math.round(kilometers)           // 정수 (2)

            if (!showUnit) return formattedKm.toString()
            return shortUnit ? `${formattedKm}KM` : `${formattedKm}킬로미터`
        }

        // m 단위 (1000m 미만)
        const meters = precision > 0
            ? distanceInMeters.toFixed(precision)  // 소수점 있음 (500.5)
            : Math.round(distanceInMeters)         // 정수 (500)

        if (!showUnit) return meters.toString()
        return shortUnit ? `${meters}M` : `${meters}미터`
    }

    /**
     *  여러 지점 중 현재 위치에서 가장 가까운 지점 찾기
     * @param {Array} locations - 지점 배열 [{lat, lng, ...}, ...]
     * @param {string} latKey - 위도 키 이름 (기본: 'lat')
     * @param {string} lngKey - 경도 키 이름 (기본: 'lng')
     * @returns {Object|null} 가장 가까운 지점과 거리 정보
     */
    const findNearestLocation = (locations, latKey = 'lat', lngKey = 'lng') => {
        try {
            calculationError.value = null

            // 입력값 검증
            if (!Array.isArray(locations) || locations.length === 0) {
                throw new Error('유효하지 않은 위치 배열입니다.')
            }

            // 현재 위치 확인
            const currentCoords = getCurrentLatLng()
            if (!currentCoords) {
                throw new Error('현재 위치 정보가 없습니다.')
            }

            let nearestLocation = null       // 가장 가까운 지점
            let shortestDistance = Infinity  // 최단 거리

            // 모든 지점 순회하며 최단 거리 찾기
            locations.forEach((location, index) => {
                const lat = location[latKey]  // 지점 위도
                const lng = location[lngKey]  // 지점 경도

                // 유효하지 않은 좌표 건너뛰기
                if (!isValidCoordinates(lat, lng)) {
                    console.warn(`[useDistanceCalculator] 인덱스 ${index}의 좌표가 유효하지 않음:`, { lat, lng })
                    return
                }

                // 현재 위치에서 이 지점까지의 거리 계산
                const distance = calculateDistance(
                    currentCoords.lat,
                    currentCoords.lng,
                    lat,
                    lng
                )

                // 더 가까운 지점 발견 시 업데이트
                if (distance !== null && distance < shortestDistance) {
                    shortestDistance = distance
                    nearestLocation = {
                        ...location,                                    // 원본 데이터 복사
                        distance: distance,                             // 거리 추가 (미터)
                        formattedDistance: formatDistance(distance),    // 포맷된 거리 추가
                        index: index                                    // 원본 배열 인덱스
                    }
                }
            })

            if (!nearestLocation) {
                throw new Error('가까운 위치를 찾을 수 없습니다.')
            }

            // console.log('[useDistanceCalculator] 가장 가까운 위치 찾기 완료:', {
            //     distance: nearestLocation.formattedDistance,
            //     index: nearestLocation.index
            // })

            return nearestLocation

        } catch (error) {
            const errorMsg = `가까운 위치 찾기 오류: ${error.message}`
            calculationError.value = errorMsg
            console.error('[useDistanceCalculator]', errorMsg)
            return null
        }
    }

    /**
     *  현재 위치 기준으로 위치 배열을 거리순으로 정렬
     * @param {Array} locations - 위치 배열
     * @param {string} latKey - 위도 키 이름 (기본: 'lat')
     * @param {string} lngKey - 경도 키 이름 (기본: 'lng')
     * @param {boolean} ascending - 오름차순 정렬 여부 (기본: true - 가까운 순)
     * @returns {Array} 거리순으로 정렬된 배열 (distance, formattedDistance 필드 추가)
     */
    const sortLocationsByDistance = (locations, latKey = 'lat', lngKey = 'lng', ascending = true) => {
        try {
            calculationError.value = null

            // 입력값 검증
            if (!Array.isArray(locations)) {
                throw new Error('유효하지 않은 위치 배열입니다.')
            }

            // 현재 위치 확인
            const currentCoords = getCurrentLatLng()
            if (!currentCoords) {
                throw new Error('현재 위치 정보가 없습니다.')
            }

            // 각 위치에 거리 정보 추가
            const locationsWithDistance = locations.map((location, index) => {
                const lat = location[latKey]  // 지점 위도
                const lng = location[lngKey]  // 지점 경도

                // 유효하지 않은 좌표 처리
                if (!isValidCoordinates(lat, lng)) {
                    return {
                        ...location,
                        distance: Infinity,              // 무한대 거리 (맨 뒤로)
                        formattedDistance: '거리 계산 불가',
                        originalIndex: index             // 원본 인덱스 보존
                    }
                }

                // 거리 계산
                const distance = calculateDistance(
                    currentCoords.lat,
                    currentCoords.lng,
                    lat,
                    lng
                )

                return {
                    ...location,                                    // 원본 데이터 복사
                    distance: distance || Infinity,                // 거리 (실패 시 무한대)
                    formattedDistance: formatDistance(distance),    // 포맷된 거리
                    originalIndex: index                            // 원본 인덱스 보존
                }
            })

            // 거리순으로 정렬
            locationsWithDistance.sort((a, b) => {
                return ascending ? a.distance - b.distance : b.distance - a.distance
            })

            // console.log('[useDistanceCalculator] 거리순 정렬 완료:', {
            //     총개수: locationsWithDistance.length,
            //     가장가까운거리: locationsWithDistance[0]?.formattedDistance
            // })

            return locationsWithDistance

        } catch (error) {
            const errorMsg = `거리순 정렬 오류: ${error.message}`
            calculationError.value = errorMsg
            console.error('[useDistanceCalculator]', errorMsg)
            return locations // 오류 시 원본 배열 반환
        }
    }

    /**
     *  좌표 유효성 검증 (위도: -90~90, 경도: -180~180)
     * @param {number} lat - 위도
     * @param {number} lng - 경도
     * @returns {boolean} 유효성 여부
     */
    const isValidCoordinates = (lat, lng) => {
        return (
            typeof lat === 'number' &&      // 숫자 타입
            typeof lng === 'number' &&      // 숫자 타입
            !isNaN(lat) &&                  // NaN 아님
            !isNaN(lng) &&                  // NaN 아님
            lat >= -90 && lat <= 90 &&      // 위도 범위
            lng >= -180 && lng <= 180       // 경도 범위
        )
    }

    /**
     *  도를 라디안으로 변환 (삼각함수 계산용)
     * @param {number} degrees - 도 단위 각도
     * @returns {number} 라디안 단위 각도
     */
    const toRadians = (degrees) => {
        return degrees * (Math.PI / 180)
    }

    /**
     * ⚡ 간단한 거리 계산 (정확도 낮음, 성능 높음)
     * 대략적인 거리 비교용으로 사용 (정렬이나 필터링 시 유용)
     * @param {number} lat1 - 첫 번째 지점 위도
     * @param {number} lng1 - 첫 번째 지점 경도
     * @param {number} lat2 - 두 번째 지점 위도
     * @param {number} lng2 - 두 번째 지점 경도
     * @returns {number} 대략적인 거리 (미터)
     */
    const calculateApproximateDistance = (lat1, lng1, lat2, lng2) => {
        // 좌표 유효성 검증
        if (!isValidCoordinates(lat1, lng1) || !isValidCoordinates(lat2, lng2)) {
            return null
        }

        const latDiff = Math.abs(lat2 - lat1)    // 위도 차이
        const lngDiff = Math.abs(lng2 - lng1)    // 경도 차이
        const avgLat = (lat1 + lat2) / 2         // 평균 위도

        // 1도 ≈ 111km 근사 계산 (평면 근사)
        const distance = Math.sqrt(
            Math.pow(latDiff * 111000, 2) +      // 위도 차이를 미터로 변환
            Math.pow(lngDiff * 111000 * Math.cos(avgLat * Math.PI / 180), 2)  // 경도 차이 (위도 보정)
        )

        return distance
    }

    /**
     *  에러 상태 초기화
     */
    const clearError = () => {
        calculationError.value = null
    }

    /**
     *  마지막 계산 결과 초기화
     */
    const clearLastCalculation = () => {
        lastCalculation.value = null
    }

    //  Computed 상태들
    const hasError = computed(() => !!calculationError.value)           // 에러 발생 여부
    const hasLastCalculation = computed(() => !!lastCalculation.value)  // 계산 결과 존재 여부

    //  외부에서 사용할 수 있도록 반환
    return {
        //  반응형 상태
        lastCalculation,        // 마지막 계산 결과 {from, to, distance, timestamp}
        calculationError,       // 계산 에러 메시지
        hasError,              // 에러 발생 여부 (computed)
        hasLastCalculation,    // 계산 결과 존재 여부 (computed)

        //  기본 거리 계산 함수들
        calculateDistance,                    // 두 좌표 간 정확한 거리 계산 (하버사인 공식)
        getDistanceFromCurrentLocation,       // 현재 위치에서 특정 지점까지 거리 계산

        //  거리 포맷팅
        formatDistance,                       // 거리를 사용자 친화적 형태로 포맷 (1.5KM, 500M)

        //  고급 기능들
        findNearestLocation,                  // 여러 지점 중 가장 가까운 지점 찾기
        sortLocationsByDistance,              // 현재 위치 기준 거리순 정렬

        // 성능 최적화용
        calculateApproximateDistance,         // 빠른 근사 거리 계산 (정확도 낮음)

        // ️ 유틸리티 함수들
        isValidCoordinates,                   // 좌표 유효성 검증
        toRadians,                           // 도 → 라디안 변환
        clearError,                          // 에러 초기화
        clearLastCalculation                 // 계산 결과 초기화
    }
}