// src/composables/useNaverMap.js 네이버 지도 재사용
import { ref, nextTick, onUnmounted } from 'vue'
import naverMapService from '../services/naverMapService'
// 현재 위치 관련 모든 기능을 통합한 composable import
import { useCurrentLocation } from './currentlocation/useCurrentLocation'

export function useNaverMap(containerId) {
    const map = ref(null)
    const isLoading = ref(true)
    const error = ref(null)
    const resizeObserver = ref(null)

    // 현재 위치 관련 모든 기능 가져오기 (통합 버전)
    const currentLocationFeatures = useCurrentLocation()

    // 지도 초기화
    const initMap = async (options = {}) => {
        try {
            isLoading.value = true
            error.value = null

            // 네이버 지도 API 로드
            await naverMapService.loadNaverMapAPI()

            // DOM 렌더링 대기
            await nextTick()

            const container = document.getElementById(containerId)
            if (!container) {
                throw new Error('지도 컨테이너를 찾을 수 없습니다')
            }

            // 지도 생성
            map.value = naverMapService.createMap(container, {
                zoom: options.zoom || 10
            })

            // 윈도우 리사이즈 이벤트 리스너 추가 (화면 크기 변경 대응)
            setupWindowResizeListener()



        } catch (err) {
            error.value = err.message
            console.error('지도 로드 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    // 현재 위치 표시 (통합 함수) - 위치 가져오기 + 마커 + 지도 이동
    const showCurrentLocation = async (options = {}) => {
        if (!map.value) {
            return { success: false, error: '지도가 아직 초기화되지 않았습니다' }
        }

        return await currentLocationFeatures.showCurrentLocationOnMap(map.value, options)
    }

    // 현재 위치와 주변 데이터 함께 보기
    const showCurrentLocationWithNearbyData = async (nearbyData = [], options = {}) => {
        if (!map.value) {
            return { success: false, error: '지도가 아직 초기화되지 않았습니다' }
        }

        return await currentLocationFeatures.showCurrentLocationWithData(map.value, nearbyData, options)
    }

    // 현재 위치 숨기기
    const hideCurrentLocation = () => {
        return currentLocationFeatures.hideCurrentLocation()
    }

    // 현재 위치 새로고침
    const refreshCurrentLocation = async (options = {}) => {
        if (!map.value) {

            return { success: false, error: '지도가 아직 초기화되지 않았습니다' }
        }

        return await currentLocationFeatures.refreshCurrentLocation(map.value, options)
    }

    // 기본 위치(서울 시청)로 이동
    const showDefaultLocation = (options = {}) => {
        if (!map.value) {

            return { success: false, error: '지도가 아직 초기화되지 않았습니다' }
        }

        return currentLocationFeatures.showDefaultLocation(map.value, options)
    }

    // 지도 리사이즈
    const resizeMap = () => {
        if (map.value && window.naver && window.naver.maps) {
            try {
                // 네이버 지도 리사이즈 트리거
                window.naver.maps.Event.trigger(map.value, 'resize')

            } catch (err) {
                console.error('지도 리사이즈 실패:', err)
            }
        }
    }

    // 윈도우 리사이즈 리스너 설정 (브라우저 창 크기 변경 감지)
    const setupWindowResizeListener = () => {
        const handleResize = () => {
            // 디바운스 적용 (연속된 리사이즈 이벤트 방지)
            clearTimeout(window.mapResizeTimeout)
            window.mapResizeTimeout = setTimeout(() => {
                resizeMap()
            }, 200)
        }

        window.addEventListener('resize', handleResize)

        // 정리 함수에서 이벤트 리스너 제거를 위해 저장
        resizeObserver.value = () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(window.mapResizeTimeout)
        }
    }

    // 수동 리사이즈 (필요한 경우에만 사용)
    const triggerResize = () => {
        setTimeout(() => {
            resizeMap()
        }, 100)
    }

    // 정리
    const cleanup = () => {
        // 현재 위치 마커 정리
        currentLocationFeatures.hideCurrentLocation()

        // 리사이즈 리스너 정리
        if (resizeObserver.value) {
            resizeObserver.value() // 윈도우 리사이즈 리스너 제거
            resizeObserver.value = null
        }
        clearTimeout(window.mapResizeTimeout)
    }

    // 컴포넌트 언마운트 시 정리
    onUnmounted(() => {
        cleanup()
    })

    return {
        // 기존 지도 관련
        map,
        isLoading,
        error,
        initMap,
        resizeMap,
        triggerResize,
        cleanup,

        // 현재 위치 관련 상태들
        currentLocationCoordinates: currentLocationFeatures.coordinates,
        currentLocationIsLoading: currentLocationFeatures.isLoading,
        currentLocationError: currentLocationFeatures.error,
        currentLocationHasPermission: currentLocationFeatures.hasPermission,
        currentLocationMarker: currentLocationFeatures.currentLocationMarker,

        // 현재 위치 관련 함수들 (통합 버전 - 추천)
        showCurrentLocation,
        hideCurrentLocation,
        showCurrentLocationWithNearbyData,
        refreshCurrentLocation,
        showDefaultLocation,

        // 현재 위치 관련 함수들 (세부 제어 - 고급 사용)
        getCurrentPosition: currentLocationFeatures.getCurrentPosition,
        getCurrentLocationStatus: currentLocationFeatures.getCurrentLocationStatus,
        isRealLocation: currentLocationFeatures.isRealLocation,

        // 상수
        DEFAULT_LOCATION: currentLocationFeatures.DEFAULT_LOCATION
    }
}