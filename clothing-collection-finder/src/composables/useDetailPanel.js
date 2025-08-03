// src/composables/useDetailPanel.js
import { ref } from 'vue'

export function useDetailPanel() {
    // 정보패널 상태 관리
    const showDetailPanel = ref(false)
    const selectedBinData = ref(null)

    // 마커 클릭 핸들러
    const handleMarkerClick = (binData) => {
        console.log('마커 클릭 받음:', binData)
        selectedBinData.value = binData
        showDetailPanel.value = true
    }

    // 사이드바 패널 표시 핸들러
    const handleShowPanel = (binData) => {
        console.log('사이드바 클릭 받음:', binData)
        selectedBinData.value = binData
        showDetailPanel.value = true
    }

    // 패널 닫기 함수
    const closeDetailPanel = () => {
        showDetailPanel.value = false
        selectedBinData.value = null
    }

    return {
        // 상태
        showDetailPanel,
        selectedBinData,

        // 메서드
        handleMarkerClick,
        handleShowPanel,
        closeDetailPanel
    }
}