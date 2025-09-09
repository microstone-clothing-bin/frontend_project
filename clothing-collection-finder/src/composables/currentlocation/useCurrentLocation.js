// src/composables/currentlocation/useCurrentLocation.js
// 현재 위치 관련 모든 기능을 통합하는 composable

import { useCoordinates } from './useCoordinates'
import { useCurrentLocationMarker } from './useCurrentLocationMarker'
import { useCurrentLocationMove } from './useCurrentLocationMove'

export function useCurrentLocation() {
    // 각 composable들에서 기능 가져오기
    const {
        currentCoords: coordinates,  // 현재 위치 좌표 {lat, lng, accuracy, timestamp, isDefault}
        isUpdating: isLoading,      // 위치 정보 가져오는 중인지 여부 (true/false)
        error,                      // 에러 메시지 (없으면 null)
        hasPermission,             // 위치 권한 상태 (null/true/false)
        getCurrentPosition,        // GPS로 현재 위치 가져오기 + 권한 처리
        isRealLocation,           // GPS 실제 위치인지 기본값인지 구분
        clearCurrentCoords: clearCoordinates,  // 현재 좌표 및 권한 상태 모두 초기화
        //  useCoordinates만의 추가 기능들
        setCurrentCoords,         // 수동으로 좌표 설정
        getCurrentLatLng,         // 간단한 {lat, lng} 객체 반환
        coordsHistory,            // 위치 히스토리 배열
        startTracking,            // 실시간 위치 추적 시작
        stopTracking,             // 실시간 위치 추적 중단
        logCurrentState           // 디버깅용 상태 로그
    } = useCoordinates()

    //  useCoordinates에 없는 기능들 직접 구현
    const DEFAULT_LOCATION = {    // 서울시청 기본 좌표 상수
        lat: 37.5665,
        lng: 126.9780,
        accuracy: null,
        timestamp: Date.now(),
        isDefault: true
    }

    const getDefaultLocation = () => {    // 서울시청 기본 위치 설정
        setCurrentCoords(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, {
            source: 'default',
            addToHistory: false
        })
        return DEFAULT_LOCATION
    }

    const clearError = () => {           // 에러 메시지 초기화
        error.value = null
    }

    const checkPermission = async () => { // 브라우저 위치 권한 상태 확인
        if (!navigator.permissions) {
            return 'unsupported'
        }
        try {
            const result = await navigator.permissions.query({ name: 'geolocation' })
            return result.state
        } catch (err) {
            return 'unsupported'
        }
    }

    const {
        currentLocationMarker,        // 현재 위치 마커 객체 (네이버 지도 마커)
        addCurrentLocationMarker,     // 지도에 현재 위치 마커 추가
        removeCurrentLocationMarker,  // 지도에서 현재 위치 마커 제거
        hasCurrentLocationMarker      // 현재 위치 마커가 표시되어 있는지 확인
    } = useCurrentLocationMarker()

    const {
        moveToCurrentLocation,            // 현재 위치로 지도 이동 (애니메이션 포함)
        jumpToCurrentLocation,            // 현재 위치로 지도 즉시 이동 (애니메이션 없음)
        smoothMoveToCurrentLocation,      // 현재 위치로 부드러운 애니메이션 이동
        centerOnCurrentLocation,          // 현재 위치를 지도 중심으로 설정
        fitCurrentLocationWithNearbyBins, // 현재 위치와 주변 데이터가 모두 보이도록 지도 범위 조정
        showAreaAroundCurrentLocation     // 현재 위치 중심으로 지정된 반경 영역 표시
    } = useCurrentLocationMove()

    //  통합 함수: 현재 위치 가져오기 + 지도에 표시
    const showCurrentLocationOnMap = async (map, options = {}) => {
        if (!map) {
            console.error('지도가 없습니다')
            return { success: false, error: '지도가 없습니다' }
        }

        try {
            // 현재 위치 가져오기
            const position = await getCurrentPosition()

            // 지도에 마커 표시
            addCurrentLocationMarker(map, position)

            // 지도 이동 (옵션에 따라)
            const moveOptions = {
                animate: options.animate !== false,
                zoomLevel: options.zoomLevel || 17,
                duration: options.duration || 1500
            }

            moveToCurrentLocation(map, position, moveOptions)

            return {
                success: true,
                position,
                isRealLocation: isRealLocation(),
                message: position.isDefault ? '기본 위치(서울 시청) 주변 데이터를 표시합니다' : '현재 위치로 이동했습니다'
            }

        } catch (err) {
            console.error('현재 위치 표시 실패:', err)
            return { success: false, error: err.message }
        }
    }

    //  통합 함수: 현재 위치 + 주변 데이터와 함께 보기
    const showCurrentLocationWithData = async (map, nearbyData = [], options = {}) => {
        if (!map) {
            console.error('지도가 없습니다')
            return { success: false, error: '지도가 없습니다' }
        }

        try {
            // 현재 위치 가져오기
            const position = await getCurrentPosition()

            // 지도에 마커 표시
            addCurrentLocationMarker(map, position)

            // 현재 위치와 주변 데이터가 모두 보이도록 지도 범위 조정
            if (nearbyData.length > 0) {
                fitCurrentLocationWithNearbyBins(map, position, nearbyData)
            } else {
                // 주변 데이터가 없으면 기본 반경으로 표시
                const radius = options.radius || 1000 // 1km
                showAreaAroundCurrentLocation(map, position, radius)
            }

            return {
                success: true,
                position,
                isRealLocation: isRealLocation(),
                nearbyCount: nearbyData.length,
                message: `현재 위치와 주변 ${nearbyData.length}개 데이터가 표시되었습니다`
            }

        } catch (err) {
            console.error('현재 위치와 데이터 표시 실패:', err)
            return { success: false, error: err.message }
        }
    }

    //  현재 위치 숨기기
    const hideCurrentLocation = () => {
        removeCurrentLocationMarker()
        return { success: true, message: '현재 위치가 숨겨졌습니다' }
    }

    //  현재 위치 상태 확인
    const getCurrentLocationStatus = () => {
        return {
            hasMarker: hasCurrentLocationMarker(),      // 마커 표시 여부
            hasPermission: hasPermission.value,         // 위치 권한 상태
            isLoading: isLoading.value,                 // 로딩 상태
            coordinates: coordinates.value,             // 현재 좌표
            error: error.value,                         // 에러 상태
            isRealLocation: isRealLocation()            // 실제 GPS 위치 여부
        }
    }

    //  현재 위치 새로고침
    const refreshCurrentLocation = async (map, options = {}) => {
        // 기존 위치 정보 초기화
        clearCoordinates()
        clearError()

        // 새로 위치 가져와서 표시
        return await showCurrentLocationOnMap(map, options)
    }

    return {
        //  반응형 상태들
        coordinates,              // 현재 위치 좌표 (reactive)
        isLoading,               // 위치 가져오는 중 상태 (reactive)
        error,                   // 에러 메시지 (reactive)
        hasPermission,           // 위치 권한 상태 (reactive)
        currentLocationMarker,   // 현재 위치 마커 객체 (reactive)

        //  상수
        DEFAULT_LOCATION,        // 서울시청 기본 좌표 {lat, lng, isDefault: true}

        //  기본 위치 관련 함수들
        getCurrentPosition,      // GPS + 권한 처리로 현재 위치 가져오기 (Promise)
        getDefaultLocation,      // 서울시청 기본 위치 반환
        isRealLocation,         // GPS 실제 위치인지 기본값인지 구분 (boolean)
        clearError,             // 에러 메시지 초기화
        clearCoordinates,       // 좌표 및 권한 상태 모두 초기화
        checkPermission,        // 브라우저 위치 권한 상태 확인 (Promise)

        //  useCoordinates 추가 기능들
        setCurrentCoords,       // 수동으로 좌표 설정 (lat, lng, options)
        getCurrentLatLng,       // 간단한 {lat, lng} 객체 반환
        coordsHistory,          // 위치 히스토리 배열 (최대 50개)
        startTracking,          // 실시간 위치 추적 시작 (watchId 반환)
        stopTracking,           // 실시간 위치 추적 중단 (watchId 필요)
        logCurrentState,        // 디버깅용 상태 로그 출력

        //  마커 관련 함수들
        addCurrentLocationMarker,     // 지도에 현재 위치 마커 추가 (map, position)
        removeCurrentLocationMarker,  // 지도에서 현재 위치 마커 제거
        hasCurrentLocationMarker,     // 현재 위치 마커 표시 여부 확인 (boolean)

        //  지도 이동 관련 함수들
        moveToCurrentLocation,            // 현재 위치로 애니메이션 이동 (map, position, options)
        jumpToCurrentLocation,            // 현재 위치로 즉시 이동 (map, position)
        smoothMoveToCurrentLocation,      // 부드러운 애니메이션으로 이동 (map, position, duration)
        centerOnCurrentLocation,          // 현재 위치를 지도 중심으로 설정 (map, position)
        fitCurrentLocationWithNearbyBins, // 현재 위치 + 주변 데이터 모두 보이도록 범위 조정
        showAreaAroundCurrentLocation,    // 현재 위치 중심 지정 반경 영역 표시

        //  통합 고급 함수들 (추천 사용)
        showCurrentLocationOnMap,      // 위치 가져오기 + 마커 표시 + 지도 이동 통합 (map, options)
        showCurrentLocationWithData,   // 현재 위치 + 주변 데이터 함께 표시 (map, nearbyData, options)
        hideCurrentLocation,           // 현재 위치 마커 숨기기 (간단한 래퍼)
        getCurrentLocationStatus,      // 현재 위치 관련 모든 상태 정보 반환 (객체)
        refreshCurrentLocation         // 위치 정보 초기화 후 새로 가져와서 표시 (map, options)
    }
}