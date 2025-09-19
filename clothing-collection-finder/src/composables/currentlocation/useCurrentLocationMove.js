// src/composables/currentlocation/useCurrentLocationMove.js
// 현재 위치로 지도 이동 관련 기능 전용 composable (모든 이동을 즉시 처리)

export function useCurrentLocationMove() {

    // 현재 위치로 지도 즉시 이동 (기본 함수)
    const moveToCurrentLocation = (map, position, options = {}) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            const latLng = new naver.maps.LatLng(position.lat, position.lng)

            // 현재 위치 전용 기본 옵션
            const defaultOptions = {
                zoomLevel: 17        // 현재 위치는 상세하게 (건물 단위)
            }

            const finalOptions = { ...defaultOptions, ...options }

            // 즉시 이동 (애니메이션 없음)
            map.setCenter(latLng)                  // 중심점 즉시 변경
            map.setZoom(finalOptions.zoomLevel)    // 줌 레벨 즉시 변경

            console.log('현재 위치로 지도 즉시 이동 완료:', position)

        } catch (error) {
            console.error('현재 위치로 지도 이동 중 오류:', error)
        }
    }

    // 현재 위치와 주변 의류수거함이 모두 보이도록 지도 범위 조정
    const fitCurrentLocationWithNearbyBins = (map, currentPosition, nearbyBins = []) => {
        if (!map || !currentPosition) {
            console.error('지도 또는 현재 위치가 없습니다')
            return
        }

        try {
            // 모든 위치를 포함할 수 있는 경계 범위 객체 생성
            const bounds = new naver.maps.LatLngBounds()

            // 현재 위치를 경계에 추가
            bounds.extend(new naver.maps.LatLng(currentPosition.lat, currentPosition.lng))

            // 주변 의류수거함 위치들을 경계에 추가
            nearbyBins.forEach(bin => {
                if (bin.lat && bin.lng) {
                    bounds.extend(new naver.maps.LatLng(bin.lat, bin.lng))
                } else if (bin.latitude && bin.longitude) {
                    // 백엔드 데이터 구조 대응 (latitude/longitude)
                    bounds.extend(new naver.maps.LatLng(bin.latitude, bin.longitude))
                }
            })

            // 즉시 지도 범위 조정 (애니메이션 없음)
            map.fitBounds(bounds, {
                padding: {
                    top: 80,      // 상단 여백
                    right: 80,    // 우측 여백
                    bottom: 80,   // 하단 여백
                    left: 320     // 좌측 여백 (사이드바 고려)
                }
            })

            console.log('현재 위치와 주변 수거함이 모두 보이도록 즉시 조정 완료')

        } catch (error) {
            console.error('지도 범위 조정 중 오류:', error)
        }
    }

    // 현재 위치가 지도 중앙에 오도록 하되 줌 레벨은 그대로 유지
    const centerOnCurrentLocation = (map, position) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            const latLng = new naver.maps.LatLng(position.lat, position.lng)

            // 현재 줌 레벨 유지하며 중심만 즉시 이동
            map.setCenter(latLng)

            console.log('현재 위치를 중심으로 즉시 이동 (줌 레벨 유지)')

        } catch (error) {
            console.error('지도 중심 이동 중 오류:', error)
        }
    }

    // 외부에서 사용할 수 있도록 반환
    return {
        // 기본 이동 함수들
        moveToCurrentLocation,          // 현재 위치로 즉시 이동 (줌 레벨 설정 가능)
        centerOnCurrentLocation,        // 현재 줌 레벨 유지하며 중심만 즉시 이동

        // 고급 이동 함수들
        fitCurrentLocationWithNearbyBins  // 현재 위치 + 주변 데이터 모두 보이도록 범위 즉시 조정
    }
}