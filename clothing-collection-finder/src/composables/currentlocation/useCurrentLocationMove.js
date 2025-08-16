// src/composables/currentlocation/useCurrentLocationMove.js
// 현재 위치로 지도 이동 관련 기능 전용 composable

export function useCurrentLocationMove() {

    // 🎯 현재 위치로 지도 이동 (기본 함수 - 가장 많이 사용)
    const moveToCurrentLocation = (map, position, options = {}) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            const latLng = new naver.maps.LatLng(position.lat, position.lng)

            // 현재 위치 전용 기본 옵션
            const defaultOptions = {
                zoomLevel: 17,        // 현재 위치는 상세하게 (건물 단위)
                animate: true,        // 부드러운 이동 애니메이션 사용
                duration: 1500        // 현재 위치는 조금 더 긴 애니메이션 (1.5초)
            }

            const finalOptions = { ...defaultOptions, ...options }

            if (finalOptions.animate) {
                // 부드러운 애니메이션으로 이동 (morph 사용)
                map.morph(latLng, finalOptions.zoomLevel, {
                    duration: finalOptions.duration,   // 애니메이션 시간
                    easing: 'easeOutCubic'             // 부드러운 감속 효과
                })
            } else {
                // 즉시 이동 (애니메이션 없음)
                map.setCenter(latLng)                  // 중심점 즉시 변경
                map.setZoom(finalOptions.zoomLevel)    // 줌 레벨 즉시 변경
            }

            console.log('현재 위치로 지도 이동 완료:', position)

        } catch (error) {
            console.error('현재 위치로 지도 이동 중 오류:', error)
        }
    }

    // ⚡ 현재 위치로 빠르게 이동 (애니메이션 없음)
    const jumpToCurrentLocation = (map, position, zoomLevel = 17) => {
        moveToCurrentLocation(map, position, {
            zoomLevel,              // 원하는 줌 레벨
            animate: false          // 애니메이션 비활성화 → 즉시 이동
        })
    }

    // 🐌 현재 위치로 천천히 이동 (긴 애니메이션)
    const smoothMoveToCurrentLocation = (map, position, zoomLevel = 17) => {
        moveToCurrentLocation(map, position, {
            zoomLevel,              // 원하는 줌 레벨
            animate: true,          // 애니메이션 활성화
            duration: 2500          // 긴 애니메이션 (2.5초)
        })
    }

    // 📍 현재 위치와 주변 의류수거함이 모두 보이도록 지도 범위 조정
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
                }
            })

            // 적절한 패딩으로 지도 범위 조정
            map.fitBounds(bounds, {
                padding: {
                    top: 80,      // 상단 여백
                    right: 80,    // 우측 여백
                    bottom: 80,   // 하단 여백
                    left: 320     // 좌측 여백 (사이드바 고려)
                }
            })

            console.log('현재 위치와 주변 수거함이 모두 보이도록 조정 완료')

        } catch (error) {
            console.error('지도 범위 조정 중 오류:', error)
        }
    }

    // 🎯 현재 위치 기준으로 특정 반경이 보이도록 지도 범위 조정
    const showAreaAroundCurrentLocation = (map, position, radiusInMeters = 1000) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            const center = new naver.maps.LatLng(position.lat, position.lng)

            // 반경을 기준으로 bounds 계산
            const bounds = new naver.maps.LatLngBounds()

            // 대략적인 위도/경도 차이 계산 (1도 ≈ 111km)
            const latDiff = (radiusInMeters / 111000)  // 위도 차이
            const lngDiff = (radiusInMeters / (111000 * Math.cos(position.lat * Math.PI / 180)))  // 경도 차이 (위도에 따라 보정)

            // 현재 위치를 중심으로 지정된 반경만큼 확장된 경계 설정
            bounds.extend(new naver.maps.LatLng(position.lat - latDiff, position.lng - lngDiff))  // 남서쪽 모서리
            bounds.extend(new naver.maps.LatLng(position.lat + latDiff, position.lng + lngDiff))  // 북동쪽 모서리

            // 계산된 경계에 맞춰 지도 범위 조정
            map.fitBounds(bounds, {
                padding: {
                    top: 50,      // 상단 여백
                    right: 50,    // 우측 여백
                    bottom: 50,   // 하단 여백
                    left: 270     // 좌측 여백 (사이드바 고려)
                }
            })

            console.log(`현재 위치 기준 ${radiusInMeters}m 반경이 보이도록 조정 완료`)

        } catch (error) {
            console.error('지도 범위 조정 중 오류:', error)
        }
    }

    // 🎯 현재 위치가 지도 중앙에 오도록 하되 줌 레벨은 그대로 유지
    const centerOnCurrentLocation = (map, position) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            const latLng = new naver.maps.LatLng(position.lat, position.lng)
            const currentZoom = map.getZoom()  // 현재 줌 레벨 가져오기

            // 현재 줌 레벨 유지하며 중심만 이동
            map.morph(latLng, currentZoom, {
                duration: 1000,              // 1초 애니메이션
                easing: 'easeInOutQuad'      // 가속-감속 효과
            })

            console.log('현재 위치를 중심으로 이동 (줌 레벨 유지)')

        } catch (error) {
            console.error('지도 중심 이동 중 오류:', error)
        }
    }

    // 📤 외부에서 사용할 수 있도록 반환
    return {
        // 🔧 기본 이동 함수들
        moveToCurrentLocation,          // 현재 위치로 이동 (옵션 설정 가능) - 가장 범용적
        jumpToCurrentLocation,          // 현재 위치로 즉시 이동 (애니메이션 없음) - 빠른 이동
        smoothMoveToCurrentLocation,    // 현재 위치로 천천히 이동 (긴 애니메이션) - 부드러운 이동
        centerOnCurrentLocation,        // 현재 줌 레벨 유지하며 중심만 이동 - 줌 유지

        // 🚀 고급 이동 함수들
        fitCurrentLocationWithNearbyBins,  // 현재 위치 + 주변 데이터 모두 보이도록 범위 조정
        showAreaAroundCurrentLocation      // 현재 위치 중심 지정 반경 영역 표시
    }
}