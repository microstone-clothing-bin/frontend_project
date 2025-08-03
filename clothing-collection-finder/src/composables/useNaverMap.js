// src/composables/useNaverMap.js 네이버 지도 재사용
import { ref, nextTick, onUnmounted } from 'vue'
import naverMapService from '../services/naverMapService'

export function useNaverMap(containerId) {
    const map = ref(null)
    const isLoading = ref(true)
    const error = ref(null)
    const resizeObserver = ref(null)

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

            console.log('네이버 지도 로드 성공!')

        } catch (err) {
            error.value = err.message
            console.error('지도 로드 실패:', err)
        } finally {
            isLoading.value = false
        }
    }

    // 지도 리사이즈
    const resizeMap = () => {
        if (map.value && window.naver && window.naver.maps) {
            try {
                // 네이버 지도 리사이즈 트리거
                window.naver.maps.Event.trigger(map.value, 'resize')
                console.log('지도 리사이즈 완료')
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
        map,
        isLoading,
        error,
        initMap,
        resizeMap,
        triggerResize,
        cleanup
    }
}