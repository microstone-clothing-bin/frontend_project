// src/composables/currentlocation/useGeolocation.js
// 🔥 래퍼 버전 - 기존 API 100% 호환성 유지하면서 내부는 모듈화된 구현 사용

import { computed } from 'vue'
import { useGpsCoordinates } from './coordinates/gpsCoordinates'
import { useLocationPermission } from './coordinates/locationPermission'

export function useGeolocation() {
    //  내부 모듈들 가져오기
    const gpsModule = useGpsCoordinates()
    const permissionModule = useLocationPermission()

    //  기존 API와 동일한 반응형 상태들 (100% 호환성)

    /**
     * 현재 좌표 (기존과 동일)
     * gpsCoordinates의 currentCoords를 그대로 사용
     */
    const coordinates = computed(() => gpsModule.currentCoords.value)

    /**
     * 로딩 상태 (기존과 동일)
     * gpsCoordinates의 isUpdating과 permission의 isChecking 조합
     */
    const isLoading = computed(() =>
        gpsModule.isUpdating.value || permissionModule.isChecking.value
    )

    /**
     * 에러 상태 (기존과 동일)
     * 두 모듈의 에러를 우선순위에 따라 표시
     */
    const error = computed(() =>
        permissionModule.error.value || gpsModule.error.value
    )

    /**
     * 권한 상태 (기존과 동일)
     * permission 모듈의 hasPermission 사용
     */
    const hasPermission = computed(() => permissionModule.hasPermission.value)

    //  기존 상수들 (100% 호환성)
    const DEFAULT_LOCATION = permissionModule.DEFAULT_LOCATION

    //  기존 함수들을 내부 모듈들로 연결 (API 100% 동일)

    /**
     *  GPS로 현재 위치 가져오기 + 권한 처리 (기존과 동일한 API)
     * @param {Object} options - 위치 옵션 {enableHighAccuracy, timeout, maximumAge}
     * @returns {Promise<Object>} 좌표 정보 {lat, lng, accuracy, timestamp, isDefault}
     */
    const getCurrentPosition = async (options = {}) => {
        try {
            // 1. 먼저 권한 요청 및 위치 가져오기
            const permissionResult = await permissionModule.requestPermission(options)

            if (permissionResult.success) {
                // 2. 성공한 경우 GPS 모듈에 좌표 설정
                const { position } = permissionResult
                const success = gpsModule.setCurrentCoords(
                    position.lat,
                    position.lng,
                    {
                        accuracy: position.accuracy,
                        source: position.source,
                        addToHistory: true
                    }
                )

                if (success) {
                    console.log('[useGeolocation] 위치 획득 성공:', position)
                    return position
                } else {
                    throw new Error('좌표 설정 실패')
                }
            } else {
                // 3. 실패한 경우 기본 위치 설정
                const { position } = permissionResult
                gpsModule.setCurrentCoords(
                    position.lat,
                    position.lng,
                    {
                        source: 'default',
                        addToHistory: false
                    }
                )

                console.log('[useGeolocation] 기본 위치 사용:', position)
                return position
            }

        } catch (err) {
            console.error('[useGeolocation] getCurrentPosition 실패:', err)

            // 에러 발생 시 기본 위치로 대체
            const defaultResult = permissionModule.getDefaultLocation()
            gpsModule.setCurrentCoords(
                defaultResult.position.lat,
                defaultResult.position.lng,
                {
                    source: 'default',
                    addToHistory: false
                }
            )

            return defaultResult.position
        }
    }

    /**
     *  서울시청 기본 위치 설정 및 반환 (기존과 동일한 API)
     * @returns {Object} 서울시청 좌표 {lat: 37.5665, lng: 126.9780, isDefault: true}
     */
    const getDefaultLocation = () => {
        const defaultResult = permissionModule.getDefaultLocation()

        // GPS 모듈에도 설정
        gpsModule.setCurrentCoords(
            defaultResult.position.lat,
            defaultResult.position.lng,
            {
                source: 'default',
                addToHistory: false
            }
        )

        console.log('[useGeolocation] 기본 위치 설정:', defaultResult.position)
        return defaultResult.position
    }

    /**
     *  실제 GPS 위치인지 기본값인지 구분 (기존과 동일한 API)
     * @returns {boolean} 실제 GPS 위치 여부 (true: GPS, false: 서울시청 기본값)
     */
    const isRealLocation = () => {
        const coords = gpsModule.currentCoords.value
        return permissionModule.isRealLocation(coords)
    }

    /**
     *  에러 메시지 초기화 (기존과 동일한 API)
     */
    const clearError = () => {
        permissionModule.error.value = null
        gpsModule.error.value = null
        console.log('[useGeolocation] 에러 초기화')
    }

    /**
     *  좌표 및 권한 상태 모두 초기화 (기존과 동일한 API)
     */
    const clearCoordinates = () => {
        gpsModule.clearCurrentCoords()
        permissionModule.resetPermission()
        console.log('[useGeolocation] 좌표 및 권한 상태 초기화')
    }

    /**
     *  브라우저 위치 권한 상태 확인 (기존과 동일한 API)
     * @returns {Promise<string>} 권한 상태 ('granted', 'denied', 'prompt', 'unsupported')
     */
    const checkPermission = async () => {
        try {
            return await permissionModule.checkPermission()
        } catch (err) {
            console.error('[useGeolocation] 권한 확인 실패:', err)
            return 'unsupported'
        }
    }

    //  추가 유틸리티 함수들 (기존 코드 호환성 유지하면서 확장)

    /**
     *  현재 위치 관련 모든 상태 정보 반환 (새로 추가된 유틸리티)
     * @returns {Object} 전체 상태 정보 객체
     */
    const getLocationStatus = () => {
        return {
            coordinates: coordinates.value,                              // 현재 좌표
            isLoading: isLoading.value,                                 // 로딩 상태
            error: error.value,                                         // 에러 메시지
            hasPermission: hasPermission.value,                         // 권한 상태
            isRealLocation: isRealLocation(),                           // GPS vs 기본값
            permissionStatus: permissionModule.getPermissionStatus(),   // 상세 권한 정보
            coordsHistory: gpsModule.coordsHistory.value                // 좌표 히스토리
        }
    }

    /**
     *  디버깅용 전체 상태 콘솔 출력 (새로 추가된 유틸리티)
     */
    const logCurrentState = () => {
        console.log('[useGeolocation] 전체 상태:', getLocationStatus())
        permissionModule.logPermissionState()
        gpsModule.logCurrentState()
    }

    //  기존 API 100% 동일하게 반환 (하위 호환성 완벽 보장)
    return {
        //  기존 반응형 상태들 (API 변경 없음)
        coordinates,        // 현재 위치 좌표 (reactive)
        isLoading,         // 위치 가져오는 중 상태 (reactive)
        error,             // 에러 메시지 (reactive)
        hasPermission,     // 위치 권한 상태 (reactive)

        //  기존 상수들 (API 변경 없음)
        DEFAULT_LOCATION,  // 서울시청 기본 좌표 상수

        // 기존 함수들 (API 변경 없음)
        getCurrentPosition,   // GPS + 권한 처리로 현재 위치 가져오기
        getDefaultLocation,   // 서울시청 기본 위치 설정
        isRealLocation,      // GPS vs 기본값 구분
        clearError,          // 에러 메시지 초기화
        clearCoordinates,    // 좌표 및 권한 상태 초기화
        checkPermission,     // 브라우저 위치 권한 상태 확인

        //  추가 유틸리티 (기존 코드에 영향 없음)
        getLocationStatus,   // 전체 상태 정보 반환
        logCurrentState,     // 디버깅용 상태 로그 출력

        //  내부 모듈 접근 (고급 사용자용)
        _gpsModule: gpsModule,           // GPS 좌표 모듈 직접 접근
        _permissionModule: permissionModule  // 권한 관리 모듈 직접 접근
    }
}