// src/composables/currentlocation/useCurrentLocationMarker.js
// 현재 위치 마커 관리 전용 composable

import { ref } from 'vue'

export function useCurrentLocationMarker() {
    //  반응형 상태들
    const currentLocationMarker = ref(null)  // 현재 위치 마커 객체 (네이버 지도 Marker)

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
                }
                
                /* 내부 파란색 점 */
                .current-location-inner-dot {
                    width: 12px;
                    height: 12px;
                    background: #4285f4;            /* 파란색 */
                    border-radius: 50%;             /* 원형 */
                }

            </style>
        `
    }

    // 현재 위치 마커 완전 제거
    const removeCurrentLocationMarker = () => {
        if (currentLocationMarker.value) {
            currentLocationMarker.value.setMap(null)  // 지도에서 제거
            currentLocationMarker.value = null        // 참조 초기화
        }
    }

    //  마커 존재 여부 확인
    const hasCurrentLocationMarker = () => {
        return currentLocationMarker.value !== null  // null이 아니면 존재함
    }

    //  외부에서 사용할 수 있도록 반환
    return {
        //  반응형 상태
        currentLocationMarker,     // 현재 위치 마커 객체 (네이버 Marker)

        //  마커 관리 함수들
        addCurrentLocationMarker,     // 마커 생성 및 지도에 추가 (map, position)
        removeCurrentLocationMarker,  // 마커 완전 제거
        hasCurrentLocationMarker      // 마커 존재 여부 확인 (boolean 반환)
    }
}