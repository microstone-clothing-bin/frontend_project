// src/composables/useMapMarkers.js 마커 생성.제거 담당
import { ref } from 'vue'

export function useMapMarkers() {
    const markers = ref([])

    const addMarkersToMap = async (map, clothingBins) => {
        await import('../utils/markerClustering.js')
        clearMarkers()
        // 1. 먼저 모든 마커 생성
        const allMarkers = clothingBins.map(bin =>
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(bin.latitude, bin.longitude),
                title: bin.roadAddress
                // map: map 제거 (클러스터링이 관리)
            })
        )

        // 2. 클러스터링 적용 (새로 추가)
        const markerClustering = new MarkerClustering({
            map: map,
            markers: allMarkers,
            disableClickZoom: false,
            minClusterSize: 2,
            maxZoom: 15,
            gridSize: 100
        })
        console.log(`클러스터링 적용 완료: ${allMarkers.length}개 마커`)
    }

    // 지도에 마커 추가
    // const addMarkersToMap = (map, clothingBins) => {
    //     // 기존 마커 제거
    //     clearMarkers()
    //
    //     // 새 마커 생성
    //     clothingBins.forEach(bin => {
    //         const marker = new window.naver.maps.Marker({
    //             position: new window.naver.maps.LatLng(bin.latitude, bin.longitude), // 수정
    //             map: map,
    //             title: bin.roadAddress // 수정
    //         })
    //
    //         markers.value.push(marker)
    //     })
    //
    //     console.log(`마커 ${markers.value.length}개 생성 완료`)
    // }

    // 모든 마커 제거
    const clearMarkers = () => {
        markers.value.forEach(marker => {
            marker.setMap(null)
        })
        markers.value = []
    }

    return {
        // 상태
        markers,

        // 액션
        addMarkersToMap,
        clearMarkers
    }
}