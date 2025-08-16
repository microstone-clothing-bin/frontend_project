// src/composables/currentlocation/coordinates/locationPermission.js
// 위치 권한 관리 전용 모듈

import { ref, computed } from 'vue'

// 전역 권한 상태
const globalPermissionState = {
    hasPermission: null,        // null(미확정), true(허용), false(거부)
    permissionState: 'unknown', // 'granted', 'denied', 'prompt', 'unknown'
    lastChecked: null,          // 마지막 권한 확인 시간
    deniedCount: 0              // 권한 거부 횟수
}

export function useLocationPermission() {
    // 로컬 반응형 상태
    const isChecking = ref(false)
    const error = ref(null)

    // 전역 상태를 반응형으로 노출
    const hasPermission = ref(globalPermissionState.hasPermission)
    const permissionState = ref(globalPermissionState.permissionState)
    const deniedCount = ref(globalPermissionState.deniedCount)

    /**
     * 서울시청 기본 위치 상수
     */
    const DEFAULT_LOCATION = {
        lat: 37.5665,
        lng: 126.9780,
        accuracy: null,
        timestamp: Date.now(),
        isDefault: true,
        source: 'default'
    }

    /**
     * 브라우저 Permission API로 권한 상태 확인
     * @returns {Promise<string>} 'granted', 'denied', 'prompt', 'unsupported'
     */
    const checkPermission = async () => {
        if (!navigator.permissions) {
            console.warn('[locationPermission] Permission API 지원하지 않음')
            updatePermissionState('unsupported', null)
            return 'unsupported'
        }

        try {
            isChecking.value = true
            error.value = null

            const result = await navigator.permissions.query({ name: 'geolocation' })
            const state = result.state // 'granted', 'denied', 'prompt'

            updatePermissionState(state, state === 'granted')

            console.log('[locationPermission] 권한 상태 확인:', {
                state: state,
                hasPermission: hasPermission.value,
                timestamp: new Date()
            })

            return state

        } catch (err) {
            const errorMsg = `권한 확인 실패: ${err.message}`
            error.value = errorMsg
            console.error('[locationPermission]', errorMsg)
            updatePermissionState('unsupported', null)
            return 'unsupported'
        } finally {
            isChecking.value = false
        }
    }

    /**
     * 위치 권한 요청 (실제로는 getCurrentPosition 호출로 권한 요청)
     * @param {Object} options - 위치 옵션
     * @returns {Promise<Object>} 권한 결과
     */
    const requestPermission = async (options = {}) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = '브라우저가 위치 서비스를 지원하지 않습니다'
                error.value = errorMsg
                updatePermissionState('unsupported', false)
                reject(new Error(errorMsg))
                return
            }

            const defaultOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

            const finalOptions = { ...defaultOptions, ...options }

            isChecking.value = true
            error.value = null

            console.log('[locationPermission] 위치 권한 요청 시작')

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    isChecking.value = false
                    updatePermissionState('granted', true)

                    const result = {
                        success: true,
                        hasPermission: true,
                        permissionState: 'granted',
                        position: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp,
                            isDefault: false,
                            source: 'geolocation'
                        },
                        message: '위치 권한이 허용되었습니다'
                    }

                    console.log('[locationPermission] 권한 허용됨:', result)
                    resolve(result)
                },
                (err) => {
                    isChecking.value = false

                    let permissionResult
                    let errorMessage = ''
                    let newPermissionState = 'denied'

                    switch (err.code) {
                        case err.PERMISSION_DENIED:
                            globalPermissionState.deniedCount++
                            deniedCount.value = globalPermissionState.deniedCount
                            errorMessage = '위치 권한이 거부되었습니다'
                            newPermissionState = 'denied'
                            break
                        case err.POSITION_UNAVAILABLE:
                            errorMessage = '위치 정보를 사용할 수 없습니다'
                            newPermissionState = 'granted' // 권한은 있지만 위치를 못 찾음
                            break
                        case err.TIMEOUT:
                            errorMessage = '위치 찾기 시간이 초과되었습니다'
                            newPermissionState = 'granted' // 권한은 있지만 시간 초과
                            break
                        default:
                            errorMessage = '위치를 찾을 수 없습니다'
                            break
                    }

                    error.value = errorMessage
                    updatePermissionState(newPermissionState, newPermissionState === 'granted')

                    permissionResult = {
                        success: false,
                        hasPermission: newPermissionState === 'granted',
                        permissionState: newPermissionState,
                        error: errorMessage,
                        code: err.code,
                        deniedCount: deniedCount.value,
                        useDefault: true,
                        position: DEFAULT_LOCATION,
                        message: `${errorMessage}. 기본 위치(서울 시청)로 설정됩니다.`
                    }

                    console.log('[locationPermission] 권한 처리 결과:', permissionResult)

                    // reject 대신 resolve로 기본값과 함께 반환
                    resolve(permissionResult)
                },
                finalOptions
            )
        })
    }

    /**
     * 좌표가 실제 GPS 위치인지 확인
     * @param {Object} coords - 좌표 객체
     * @returns {boolean} 실제 GPS 위치 여부
     */
    const isRealLocation = (coords = null) => {
        // 권한 기반 판단
        if (hasPermission.value === false) {
            return false
        }

        // 좌표 기반 판단
        if (coords) {
            return coords.source === 'geolocation' && !coords.isDefault
        }

        // 전역 상태 기반 판단
        return hasPermission.value === true && permissionState.value === 'granted'
    }

    /**
     * 권한이 거부된 상태인지 확인
     * @returns {boolean} 거부 상태 여부
     */
    const isPermissionDenied = () => {
        return permissionState.value === 'denied' || hasPermission.value === false
    }

    /**
     * 권한 요청이 가능한 상태인지 확인
     * @returns {boolean} 요청 가능 여부
     */
    const canRequestPermission = () => {
        return permissionState.value === 'prompt' || permissionState.value === 'unknown'
    }

    /**
     * 기본 위치 설정 (권한 없을 때 사용)
     * @returns {Object} 기본 위치 정보
     */
    const getDefaultLocation = () => {
        updatePermissionState('denied', false)

        console.log('[locationPermission] 기본 위치 사용:', DEFAULT_LOCATION)

        return {
            success: true,
            hasPermission: false,
            permissionState: 'denied',
            position: DEFAULT_LOCATION,
            isDefault: true,
            message: '기본 위치(서울 시청)로 설정되었습니다'
        }
    }

    /**
     * 권한 상태 초기화
     */
    const resetPermission = () => {
        updatePermissionState('unknown', null)
        globalPermissionState.deniedCount = 0
        deniedCount.value = 0
        error.value = null
        console.log('[locationPermission] 권한 상태 초기화')
    }

    /**
     * 전역 권한 상태 업데이트 (내부 함수)
     * @param {string} state - 권한 상태
     * @param {boolean|null} permission - 권한 여부
     */
    const updatePermissionState = (state, permission) => {
        globalPermissionState.permissionState = state
        globalPermissionState.hasPermission = permission
        globalPermissionState.lastChecked = new Date()

        // 반응형 상태 동기화
        permissionState.value = state
        hasPermission.value = permission
    }

    /**
     * 권한 거부 횟수 증가
     */
    const incrementDeniedCount = () => {
        globalPermissionState.deniedCount++
        deniedCount.value = globalPermissionState.deniedCount
    }

    /**
     * 현재 권한 상태 정보 반환
     * @returns {Object} 권한 상태 정보
     */
    const getPermissionStatus = () => {
        return {
            hasPermission: hasPermission.value,
            permissionState: permissionState.value,
            deniedCount: deniedCount.value,
            lastChecked: globalPermissionState.lastChecked,
            canRequest: canRequestPermission(),
            isDenied: isPermissionDenied(),
            isChecking: isChecking.value,
            error: error.value
        }
    }

    /**
     * 디버깅용 상태 로그
     */
    const logPermissionState = () => {
        console.log('[locationPermission] 현재 상태:', {
            hasPermission: hasPermission.value,
            permissionState: permissionState.value,
            deniedCount: deniedCount.value,
            lastChecked: globalPermissionState.lastChecked,
            isChecking: isChecking.value,
            error: error.value
        })
    }

    return {
        // 반응형 상태
        hasPermission,
        permissionState,
        deniedCount,
        isChecking,
        error,

        // 상수
        DEFAULT_LOCATION,

        // 권한 관리 함수
        checkPermission,
        requestPermission,
        getDefaultLocation,
        resetPermission,

        // 권한 상태 확인 함수
        isRealLocation,
        isPermissionDenied,
        canRequestPermission,
        getPermissionStatus,

        // 유틸리티
        incrementDeniedCount,
        logPermissionState,

        // 내부 접근용 (다른 모듈에서 사용)
        _updatePermissionState: updatePermissionState,
        _globalState: globalPermissionState
    }
}