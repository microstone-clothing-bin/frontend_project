// src/composables/useMapMarkers.js 마커 생성.제거 클러스터링 담당
import { ref } from 'vue'

export function useMapMarkers() {
    const markers = ref([])
    const showDetailPanel = ref(false) // 패널 상태 추가
    let clusterer = null // 클러스터러 인스턴스 저장

    // 🔄 수정: onMarkerClick 콜백 함수를 받도록 변경
    const addMarkersToMap = async (map, clothingBins, onMarkerClick = null) => {
        await import('../utils/markerClustering.js')
        clearMarkers()

        // 1. 먼저 모든 마커 생성 (인포윈도우 포함)
        const allMarkers = clothingBins.map(bin => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(bin.latitude, bin.longitude),
                title: bin.roadAddress
            })

            // 🔄 수정: 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
                if (onMarkerClick) {
                    // 콜백 함수가 있으면 호출 (이벤트 방식)
                    onMarkerClick(bin)
                } else {
                    // 콜백 함수가 없으면 기존 방식 (상태 변경)
                    showDetailPanel.value = true
                }
            })

            return marker
        })

        // 2. 클러스터 스타일 정의
        const clusterStyle = {
            content: `
                <div style="
                    background-color: #2ecc71;
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    cursor: pointer;">
                </div>`,
            size: new window.naver.maps.Size(36, 36),
            anchor: new window.naver.maps.Point(18, 18)
        }

        // 3. 고급 클러스터링 적용
        clusterer = new MarkerClustering({
            map: map,
            markers: allMarkers,
            disableClickZoom: false,
            minClusterSize: 2,
            maxZoom: 15,
            gridSize: 120, // 클러스터링 영역 크기
            icons: [clusterStyle],
            indexGenerator: [10, 100, 200, 500, 1000],
            stylingFunction: function (clusterMarker, count) {
                const size = Math.min(50, 10 + Math.sqrt(count) * 2) // 최대 50px 제한
                const fontSize = Math.max(12, size / 3) // 텍스트 크기 설정

                // 클러스터 내부의 div 가져오기
                const clusterDiv = clusterMarker.getElement().querySelector('div')

                // 클러스터에 표시할 숫자 (마커 개수)
                clusterDiv.textContent = count

                // 동그라미 크기 조절
                clusterDiv.style.width = `${size}px`
                clusterDiv.style.height = `${size}px`
                clusterDiv.style.lineHeight = `${size}px`

                // 글자 크기 설정
                clusterDiv.style.fontSize = `${fontSize}px`

                // 🎨 마커 개수에 따라 배경색을 다르게 설정 (그라데이션 효과)
                if (count < 10) {
                    clusterDiv.style.backgroundColor = '#ffd5e1' // 연한 핑크
                } else if (count < 20) {
                    clusterDiv.style.backgroundColor = '#ffacc3' // 핑크
                } else if (count < 30) {
                    clusterDiv.style.backgroundColor = '#ff88bc' // 진한 핑크
                } else if (count < 40) {
                    clusterDiv.style.backgroundColor = '#fd6b88' // 빨강-핑크
                } else if (count < 50) {
                    clusterDiv.style.backgroundColor = '#c637ff' // 보라-핑크
                } else if (count < 60) {
                    clusterDiv.style.backgroundColor = '#7b00ff' // 보라
                } else if (count < 100) {
                    clusterDiv.style.backgroundColor = '#000bff' // 파랑
                } else if (count < 200) {
                    clusterDiv.style.backgroundColor = '#594dff' // 연한 파랑
                } else if (count < 300) {
                    clusterDiv.style.backgroundColor = '#739bff' // 하늘색
                } else if (count < 400) {
                    clusterDiv.style.backgroundColor = '#b2c8ff' // 연한 하늘색
                } else if (count < 500) {
                    clusterDiv.style.backgroundColor = '#ade4ff' // 아주 연한 파랑
                } else {
                    clusterDiv.style.backgroundColor = '#d8edff' // 거의 흰색에 가까운 파랑
                }

                // 기타 스타일 지정
                clusterDiv.style.border = '2px rgba(255, 255, 255, 0.5) solid' // 실선 테두리
                clusterDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.5)' // 그림자 효과
                clusterDiv.style.borderRadius = '50%' // 완전한 원 모양
                clusterDiv.style.color = 'white' // 글자색
                clusterDiv.style.fontWeight = 'bold' // 글자 두껍게
                clusterDiv.style.display = 'flex' // 중앙 정렬을 위한 flex 사용
                clusterDiv.style.justifyContent = 'center' // 수평 중앙 정렬
                clusterDiv.style.alignItems = 'center' // 수직 중앙 정렬
                clusterDiv.style.cursor = 'pointer' // 마우스 올리면 커서 변경

                // ✨ 호버 효과 추가
                clusterDiv.addEventListener('mouseenter', () => {
                    clusterDiv.style.transform = 'scale(1.1)'
                    clusterDiv.style.transition = 'transform 0.2s ease'
                })

                clusterDiv.addEventListener('mouseleave', () => {
                    clusterDiv.style.transform = 'scale(1)'
                })
            }
        })

        // markers.value에 저장 (정리용)
        markers.value = allMarkers

        console.log(`🎯 클러스터링 적용 완료: ${allMarkers.length}개 마커`)
    }

    // 패널 닫기 함수 추가 ✨
    const closeDetailPanel = () => {
        showDetailPanel.value = false
    }

    // 모든 마커 제거
    const clearMarkers = () => {
        // 클러스터링 정리
        if (clusterer) {
            clusterer.setMap(null)
            clusterer = null
        }

        // 기존 마커 정리
        markers.value.forEach(marker => {
            marker.setMap(null)
        })
        markers.value = []

        // 패널도 닫기 ✨
        showDetailPanel.value = false

        // 열린 인포윈도우 정리
        if (window.selectedInfoWindow) {
            window.selectedInfoWindow.close()
            window.selectedInfoWindow = null
        }

        console.log('🧹 마커 정리 완료')
    }

    // 줌 레벨에 따른 클러스터링 제어 (추가 기능)
    const handleZoomChange = (map) => {
        if (!clusterer) return

        const zoom = map.getZoom()
        if (zoom >= 12) {
            if (!clusterer.getMap()) {
                clusterer.setMap(map)
            }
        } else {
            clusterer.setMap(null)
        }
    }

    return {
        // 상태
        markers,
        showDetailPanel,

        // 액션
        addMarkersToMap,
        clearMarkers,
        handleZoomChange,
        closeDetailPanel
    }
}