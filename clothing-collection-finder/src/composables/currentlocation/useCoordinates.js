// src/composables/currentlocation/useCoordinates.js
// 🔥 안전한 래퍼 버전 - useGeolocation을 기반으로 기존 API 제공

import { useGeolocation } from './useGeolocation'

export function useCoordinates() {
    //  마스터 모듈 사용 (중복 방지)
    const geoModule = useGeolocation()

    //  기존 API 그대로 제공하되 내부는 useGeolocation 사용
    return {
        //  반응형 상태 (기존과 동일)
        currentCoords: geoModule.coordinates,                    // 현재 위치 좌표 {lat, lng, accuracy, timestamp, isDefault}
        coordsHistory: geoModule._gpsModule.coordsHistory,       // 위치 히스토리 배열 (최대 50개)
        isTracking: geoModule._gpsModule.isTracking,             // 실시간 위치 추적 중인지 여부 (true/false)
        isUpdating: geoModule.isLoading,                         // 위치 정보 가져오는 중인지 여부 (true/false)
        error: geoModule.error,                                  // 에러 메시지 (없으면 null)

        //  좌표 설정/가져오기 (useGeolocation 통해서)
        setCurrentCoords: geoModule._gpsModule.setCurrentCoords,        // 수동으로 좌표 설정 (lat, lng, options)
        getCurrentPosition: geoModule.getCurrentPosition,               // GPS로 현재 위치 가져오기 + 권한 처리 (Promise 반환)
        getCurrentLatLng: geoModule._gpsModule.getCurrentLatLng,        // 현재 좌표를 간단한 {lat, lng} 객체로 반환
        getCurrentCoordsDetail: geoModule._gpsModule.getCurrentCoordsDetail,  // 현재 좌표의 상세 정보 전체 반환

        //  상태 관리 (기존과 동일)
        clearCurrentCoords: geoModule.clearCoordinates,                 // 현재 좌표 및 권한 상태 모두 초기화
        clearCoordsHistory: geoModule._gpsModule.clearCoordsHistory,    // 위치 히스토리 배열 비우기

        //  위치 추적 (기존과 동일)
        startTracking: geoModule._gpsModule.startTracking,              // 실시간 위치 추적 시작 (watchId 반환)
        stopTracking: geoModule._gpsModule.stopTracking,                // 실시간 위치 추적 중단 (watchId 필요)

        //  유틸리티 (기존과 동일)
        isValidCoordinate: geoModule._gpsModule.isValidCoordinate,      // 좌표 유효성 검증 (lat, lng 범위 체크)
        isSameLocation: geoModule._gpsModule.isSameLocation,            // 두 좌표가 같은 위치인지 비교 (허용 오차 내)
        logCurrentState: geoModule.logCurrentState,                     // 현재 상태 콘솔 출력 (디버깅용)

        //  권한 관련 (기존 코드 호환성 위해 추가)
        hasPermission: geoModule.hasPermission,                         // 위치 권한 상태 (null/true/false)
        isRealLocation: geoModule.isRealLocation,                       // GPS 실제 위치인지 기본값인지 구분

        //  전역 상태 접근
        globalState: geoModule._gpsModule._globalState                  // 내부 전역 상태 직접 접근 (고급 사용자용)
    }
}