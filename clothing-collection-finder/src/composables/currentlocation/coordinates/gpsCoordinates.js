// src/composables/currentlocation/coordinates/gpsCoordinates.js
// GPS 좌표 관리 전용

import { ref, reactive, computed } from 'vue'

// 전역 GPS 좌표 상태
const globalCoordsState = reactive({
    currentCoords: null,       // 현재 위치 좌표 {lat, lng, accuracy, timestamp}
    coordsHistory: [],         // 좌표 히스토리
    lastUpdateTime: null,      // 마지막 업데이트 시간
    isTracking: false         // 위치 추적 상태
})

export function useGpsCoordinates() {
    // 로컬 반응형 상태
    const isUpdating = ref(false)
    const error = ref(null)

    /**
     * 현재 좌표 정보 (computed)
     */
    const currentCoords = computed(() => globalCoordsState.currentCoords)

    /**
     * 좌표 히스토리 (computed)
     */
    const coordsHistory = computed(() => globalCoordsState.coordsHistory)

    /**
     * 위치 추적 상태 (computed)
     */
    const isTracking = computed(() => globalCoordsState.isTracking)

    /**
     * 현재 좌표 설정
     * @param {number} lat - 위도
     * @param {number} lng - 경도
     * @param {Object} options - 추가 옵션
     */
    const setCurrentCoords = (lat, lng, options = {}) => {
        const {
            accuracy = null,
            source = 'manual',     // 'geolocation', 'manual', 'geocoding'
            addToHistory = true
        } = options

        // 좌표 유효성 검증
        if (!isValidCoordinate(lat, lng)) {
            const errorMsg = `유효하지 않은 좌표: lat=${lat}, lng=${lng}`
            error.value = errorMsg
            console.error('[gpsCoordinates]', errorMsg)
            return false
        }

        try {
            isUpdating.value = true
            error.value = null

            const coordsData = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                accuracy: accuracy,
                source: source,
                timestamp: new Date(),
                id: Date.now()
            }

            // 전역 상태 업데이트
            globalCoordsState.currentCoords = coordsData
            globalCoordsState.lastUpdateTime = coordsData.timestamp

            // 히스토리 추가
            if (addToHistory) {
                addToHistoryInternal(coordsData)
            }

            console.log('[gpsCoordinates] 현재 좌표 설정 완료:', {
                lat: coordsData.lat,
                lng: coordsData.lng,
                source: coordsData.source
            })

            return true

        } catch (err) {
            const errorMsg = `좌표 설정 실패: ${err.message}`
            error.value = errorMsg
            console.error('[gpsCoordinates]', errorMsg)
            return false
        } finally {
            isUpdating.value = false
        }
    }

    /**
     * 브라우저 Geolocation API로 현재 위치 가져오기
     * @param {Object} options - Geolocation 옵션
     * @returns {Promise<Object>} 좌표 정보
     */
    const getCurrentPosition = (options = {}) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = '브라우저가 위치 서비스를 지원하지 않습니다.'
                error.value = errorMsg
                reject(new Error(errorMsg))
                return
            }

            const defaultOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

            const finalOptions = { ...defaultOptions, ...options }

            isUpdating.value = true
            error.value = null

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    isUpdating.value = false
                    const { latitude, longitude, accuracy } = position.coords

                    // 자동으로 현재 좌표로 설정
                    const success = setCurrentCoords(latitude, longitude, {
                        accuracy: accuracy,
                        source: 'geolocation',
                        addToHistory: true
                    })

                    if (success) {
                        const coordsData = {
                            lat: latitude,
                            lng: longitude,
                            accuracy: accuracy,
                            timestamp: new Date()
                        }

                        console.log('[gpsCoordinates] GPS 위치 획득 성공:', coordsData)
                        resolve(coordsData)
                    } else {
                        reject(new Error('좌표 설정 실패'))
                    }
                },
                (err) => {
                    isUpdating.value = false
                    let errorMsg = '위치 정보를 가져올 수 없습니다.'

                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            errorMsg = '위치 권한이 거부되었습니다.'
                            break
                        case err.POSITION_UNAVAILABLE:
                            errorMsg = '위치 정보를 사용할 수 없습니다.'
                            break
                        case err.TIMEOUT:
                            errorMsg = '위치 요청 시간이 초과되었습니다.'
                            break
                    }

                    error.value = errorMsg
                    console.error('[gpsCoordinates] GPS 위치 획득 실패:', errorMsg)
                    reject(new Error(errorMsg))
                },
                finalOptions
            )
        })
    }

    /**
     * 현재 좌표를 간단한 객체로 반환
     * @returns {Object|null} {lat: number, lng: number}
     */
    const getCurrentLatLng = () => {
        if (!globalCoordsState.currentCoords) {
            return null
        }

        return {
            lat: globalCoordsState.currentCoords.lat,
            lng: globalCoordsState.currentCoords.lng
        }
    }

    /**
     * 현재 좌표의 상세 정보 반환
     * @returns {Object|null} 전체 좌표 정보
     */
    const getCurrentCoordsDetail = () => {
        return globalCoordsState.currentCoords
    }

    /**
     * 좌표 히스토리에 추가
     * @param {Object} coordsData - 좌표 정보
     */
    const addToHistoryInternal = (coordsData) => {
        globalCoordsState.coordsHistory.unshift({
            ...coordsData,
            historyId: `history_${Date.now()}`
        })

        // 히스토리 크기 제한 (최대 50개)
        if (globalCoordsState.coordsHistory.length > 50) {
            globalCoordsState.coordsHistory = globalCoordsState.coordsHistory.slice(0, 50)
        }

        console.log('[gpsCoordinates] 좌표 히스토리 추가, 총 개수:', globalCoordsState.coordsHistory.length)
    }

    /**
     * 좌표 유효성 검증
     * @param {number} lat - 위도
     * @param {number} lng - 경도
     * @returns {boolean} 유효성 여부
     */
    const isValidCoordinate = (lat, lng) => {
        return (
            typeof lat === 'number' &&
            typeof lng === 'number' &&
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 && lat <= 90 &&
            lng >= -180 && lng <= 180
        )
    }

    /**
     * 현재 좌표 초기화
     */
    const clearCurrentCoords = () => {
        globalCoordsState.currentCoords = null
        globalCoordsState.lastUpdateTime = null
        globalCoordsState.isTracking = false
        error.value = null
        console.log('[gpsCoordinates] 현재 좌표 초기화')
    }

    /**
     * 좌표 히스토리 초기화
     */
    const clearCoordsHistory = () => {
        globalCoordsState.coordsHistory = []
        console.log('[gpsCoordinates] 좌표 히스토리 초기화')
    }

    /**
     * 위치 추적 시작
     * @param {Object} options - 추적 옵션
     * @returns {number} watchId (추적 중단용)
     */
    const startTracking = (options = {}) => {
        if (!navigator.geolocation) {
            error.value = '브라우저가 위치 서비스를 지원하지 않습니다.'
            return null
        }

        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000
        }

        const finalOptions = { ...defaultOptions, ...options }

        globalCoordsState.isTracking = true
        console.log('[gpsCoordinates] 위치 추적 시작')

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords
                setCurrentCoords(latitude, longitude, {
                    accuracy: accuracy,
                    source: 'geolocation_watch',
                    addToHistory: true
                })
            },
            (err) => {
                console.error('[gpsCoordinates] 위치 추적 오류:', err.message)
                error.value = `위치 추적 오류: ${err.message}`
            },
            finalOptions
        )

        return watchId
    }

    /**
     * 위치 추적 중단
     * @param {number} watchId - startTracking에서 반환된 ID
     */
    const stopTracking = (watchId) => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId)
            globalCoordsState.isTracking = false
            console.log('[gpsCoordinates] 위치 추적 중단')
        }
    }

    /**
     * 두 좌표가 같은 위치인지 확인 (허용 오차 내에서)
     * @param {Object} coords1 - {lat, lng}
     * @param {Object} coords2 - {lat, lng}
     * @param {number} tolerance - 허용 오차 (미터)
     * @returns {boolean}
     */
    const isSameLocation = (coords1, coords2, tolerance = 10) => {
        if (!coords1 || !coords2) return false

        // 간단한 거리 계산 (정확하지 않지만 근사치)
        const latDiff = Math.abs(coords1.lat - coords2.lat)
        const lngDiff = Math.abs(coords1.lng - coords2.lng)
        const avgLat = (coords1.lat + coords2.lat) / 2

        const distance = Math.sqrt(
            Math.pow(latDiff * 111000, 2) +
            Math.pow(lngDiff * 111000 * Math.cos(avgLat * Math.PI / 180), 2)
        )

        return distance <= tolerance
    }

    /**
     * 현재 상태 로그 출력 (디버깅용)
     */
    const logCurrentState = () => {
        console.log('[gpsCoordinates] 현재 상태:', {
            currentCoords: globalCoordsState.currentCoords,
            historyCount: globalCoordsState.coordsHistory.length,
            isTracking: globalCoordsState.isTracking,
            isUpdating: isUpdating.value,
            error: error.value
        })
    }

    return {
        // 반응형 상태
        currentCoords,
        coordsHistory,
        isTracking,
        isUpdating,
        error,

        // 좌표 설정/가져오기
        setCurrentCoords,
        getCurrentPosition,
        getCurrentLatLng,
        getCurrentCoordsDetail,

        // 상태 관리
        clearCurrentCoords,
        clearCoordsHistory,

        // 위치 추적
        startTracking,
        stopTracking,

        // 유틸리티
        isValidCoordinate,
        isSameLocation,
        logCurrentState,

        // 전역 상태 직접 접근 (내부 모듈에서 사용)
        _globalState: globalCoordsState
    }
}