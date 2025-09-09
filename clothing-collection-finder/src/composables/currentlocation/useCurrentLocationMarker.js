// src/composables/currentlocation/useCurrentLocationMarker.js
// 현재 위치 마커 관리 전용 composable

import { ref } from 'vue'

export function useCurrentLocationMarker() {
    //  반응형 상태들
    const currentLocationMarker = ref(null)  // 현재 위치 마커 객체 (네이버 지도 Marker)
    const accuracyCircle = ref(null)         // 위치 정확도 표시 원 객체 (네이버 지도 Circle)

    //  현재 위치 마커 생성 및 지도에 추가
    const addCurrentLocationMarker = (map, position) => {
        if (!map || !position) {
            console.error('지도 또는 위치 정보가 없습니다')
            return
        }

        try {
            // 네이버 지도 좌표 객체 생성
            const latLng = new naver.maps.LatLng(position.lat, position.lng)

            // 현재 위치 마커 생성 (파란색 원형 점 + 애니메이션)
            currentLocationMarker.value = new naver.maps.Marker({
                position: latLng,                    // 마커 위치
                map: map,                           // 표시할 지도
                icon: {
                    content: createMarkerContent(), // 커스텀 HTML 아이콘
                    anchor: new naver.maps.Point(15, 15)  // 앵커 포인트 (중심점)
                },
                zIndex: 1000                        // 다른 마커보다 위에 표시
            })

            // 정확도 원 표시 (정확도가 1km 이하일 때만)
            if (position.accuracy && position.accuracy < 1000) {
                addAccuracyCircle(map, position)
            }

            console.log('현재 위치 마커가 추가되었습니다:', position)

        } catch (error) {
            console.error('현재 위치 마커 생성 중 오류:', error)
        }
    }

    //  마커 HTML 콘텐츠 생성 (파란색 원형 점 + 펄스 애니메이션)
    const createMarkerContent = () => {
        return `
            <div class="current-location-blue-dot">
                <div class="current-location-inner-dot"></div>
            </div>
            <style>
                /* 외부 흰색 원 (테두리 파란색) */
                .current-location-blue-dot {
                    position: relative;
                    width: 30px;
                    height: 30px;
                    background: #ffffff;            /* 흰색 배경 */
                    border: 3px solid #4285f4;     /* 파란색 테두리 */
                    border-radius: 50%;             /* 원형 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.4);  /* 그림자 */
                    animation: currentLocationPulse 2s infinite;      /* 펄스 애니메이션 */
                }
                
                /* 내부 파란색 점 */
                .current-location-inner-dot {
                    width: 12px;
                    height: 12px;
                    background: #4285f4;            /* 파란색 */
                    border-radius: 50%;             /* 원형 */
                }
                
                /* 파장 효과 (바깥쪽 확산 원) */
                .current-location-blue-dot::after {
                    content: '';
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 2px solid #4285f4;      /* 파란색 테두리만 */
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    animation: currentLocationRipple 2s infinite;     /* 파장 애니메이션 */
                }
                
                /* 펄스 애니메이션 (크기 변화) */
                @keyframes currentLocationPulse {
                    0% { transform: scale(1); }     /* 원래 크기 */
                    50% { transform: scale(1.1); }  /* 10% 커짐 */
                    100% { transform: scale(1); }   /* 원래 크기 */
                }
                
                /* 파장 애니메이션 (확산 효과) */
                @keyframes currentLocationRipple {
                    0% {
                        opacity: 1;                  /* 불투명 */
                        transform: translate(-50%, -50%) scale(0.7);  /* 작게 시작 */
                    }
                    100% {
                        opacity: 0;                  /* 투명 */
                        transform: translate(-50%, -50%) scale(1.5);  /* 크게 확산 */
                    }
                }
            </style>
        `
    }

    //  위치 정확도 원 추가 (GPS 정확도 시각화)
    const addAccuracyCircle = (map, position) => {
        removeAccuracyCircle()  // 기존 원 제거

        const latLng = new naver.maps.LatLng(position.lat, position.lng)

        // 정확도 범위를 나타내는 반투명 원 생성
        accuracyCircle.value = new naver.maps.Circle({
            map: map,                           // 표시할 지도
            center: latLng,                     // 원의 중심점
            radius: position.accuracy,          // 반지름 (미터 단위)
            fillColor: '#4285f4',              // 내부 색상 (파란색)
            fillOpacity: 0.1,                  // 내부 투명도 (10%)
            strokeColor: '#4285f4',            // 테두리 색상 (파란색)
            strokeOpacity: 0.3,                // 테두리 투명도 (30%)
            strokeWeight: 1                    // 테두리 두께
        })
    }

    //  정확도 원 제거
    const removeAccuracyCircle = () => {
        if (accuracyCircle.value) {
            accuracyCircle.value.setMap(null)  // 지도에서 제거
            accuracyCircle.value = null        // 참조 초기화
        }
    }

    // 현재 위치 마커 완전 제거 (마커 + 정확도 원)
    const removeCurrentLocationMarker = () => {
        // 마커 제거
        if (currentLocationMarker.value) {
            currentLocationMarker.value.setMap(null)  // 지도에서 제거
            currentLocationMarker.value = null        // 참조 초기화
        }
        // 정확도 원도 함께 제거
        removeAccuracyCircle()
    }

    //  마커 존재 여부 확인
    const hasCurrentLocationMarker = () => {
        return currentLocationMarker.value !== null  // null이 아니면 존재함
    }

    //  외부에서 사용할 수 있도록 반환
    return {
        // 🔄 반응형 상태
        currentLocationMarker,     // 현재 위치 마커 객체 (네이버 Marker)
        accuracyCircle,           // 위치 정확도 원 객체 (네이버 Circle)

        // 🔧 마커 관리 함수들
        addCurrentLocationMarker,     // 마커 생성 및 지도에 추가 (map, position)
        removeCurrentLocationMarker,  // 마커 및 정확도 원 완전 제거
        hasCurrentLocationMarker      // 마커 존재 여부 확인 (boolean 반환)
    }
}