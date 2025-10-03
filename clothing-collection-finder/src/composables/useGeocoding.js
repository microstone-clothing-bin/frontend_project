// src/composables/useGeocoding.js
// 지오코딩 관련 반응형 상태 관리 Composable

import { ref, reactive, computed } from 'vue'
import { reverseGeocode, geocode, isGeocodingAvailable } from '@/services/geocodingService'

// ✅ localStorage에서 주소 로드 함수 추가
const loadAddressFromStorage = () => {
    try {
        const saved = localStorage.getItem('lastAddress')
        if (saved) {
            const parsed = JSON.parse(saved)
            console.log('💾 저장된 주소 복원:', parsed.shortAddress)
            return parsed
        }
    } catch (error) {
        console.error('주소 복원 실패:', error)
    }
    return null
}

// 전역 상태 (여러 컴포넌트에서 공유)
const globalState = reactive({
    currentAddress: loadAddressFromStorage(),  // ✅ 수정: localStorage에서 초기값 로드
    addressHistory: [],
    cache: new Map(),
    lastUpdateTime: null
})

export function useGeocoding() {
    // 로컬 반응형 상태
    const isLoading = ref(false)
    const error = ref(null)
    const isRetrying = ref(false)

    /**
     * 현재 주소 정보 (computed)
     */
    const currentAddress = computed(() => globalState.currentAddress)

    /**
     * 주소 변환 히스토리 (computed)
     */
    const addressHistory = computed(() => globalState.addressHistory)

    /**
     * 지오코딩 API 사용 가능 여부
     */
    const apiAvailable = computed(() => isGeocodingAvailable())

    /**
     * 좌표를 주소로 변환하는 메인 함수
     * @param {number} lat - 위도
     * @param {number} lng - 경도
     * @param {Object} options - 옵션 설정
     * @returns {Promise<Object|null>} 변환된 주소 정보
     */
    const getAddressFromCoords = async (lat, lng, options = {}) => {
        const {
            useCache = true,           // 캐시 사용 여부
            updateGlobalState = true,  // 전역 상태 업데이트 여부
            addToHistory = true,       // 히스토리 추가 여부
            retryCount = 2             // 재시도 횟수
        } = options

        // 입력값 검증
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            const errorMsg = '유효하지 않은 좌표입니다.'
            error.value = errorMsg
            console.error('[useGeocoding]', errorMsg, { lat, lng })
            return null
        }

        // API 사용 가능 여부 확인
        if (!apiAvailable.value) {
            const errorMsg = '네이버 지도 API가 로드되지 않았습니다.'
            error.value = errorMsg
            console.error('[useGeocoding]', errorMsg)
            return null
        }

        // 캐시 키 생성 (소수점 4자리까지만 사용하여 캐시 효율성 높임)
        const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`

        // 캐시에서 결과 확인
        if (useCache && globalState.cache.has(cacheKey)) {
            const cachedResult = globalState.cache.get(cacheKey)
            console.log('[useGeocoding] 캐시에서 주소 반환:', cachedResult.shortAddress)

            if (updateGlobalState) {
                updateCurrentAddress(cachedResult, addToHistory)
            }

            return cachedResult
        }

        let attempt = 0

        while (attempt <= retryCount) {
            try {
                isLoading.value = true
                isRetrying.value = attempt > 0
                error.value = null

                console.log(`[useGeocoding] 주소 변환 시도 ${attempt + 1}/${retryCount + 1}:`, { lat, lng })

                // 역지오코딩 API 호출
                const addressInfo = await reverseGeocode(lat, lng)

                // 성공 시 처리
                console.log('[useGeocoding] 주소 변환 성공:', addressInfo.shortAddress)

                // 캐시에 저장
                if (useCache) {
                    globalState.cache.set(cacheKey, addressInfo)

                    // 캐시 크기 제한 (최대 100개)
                    if (globalState.cache.size > 100) {
                        const firstKey = globalState.cache.keys().next().value
                        globalState.cache.delete(firstKey)
                    }
                }

                // 전역 상태 업데이트
                if (updateGlobalState) {
                    updateCurrentAddress(addressInfo, addToHistory)
                }

                return addressInfo

            } catch (err) {
                attempt++
                const errorMsg = err.message || '주소 변환에 실패했습니다.'

                console.error(`[useGeocoding] 시도 ${attempt} 실패:`, errorMsg)

                if (attempt > retryCount) {
                    // 모든 재시도 실패
                    error.value = `주소 변환 실패: ${errorMsg}`
                    console.error('[useGeocoding] 모든 재시도 실패')
                    return null
                } else {
                    // 재시도 전 대기
                    console.log(`[useGeocoding] ${1000 * attempt}ms 후 재시도...`)
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
                }
            } finally {
                if (attempt > retryCount) {
                    isLoading.value = false
                    isRetrying.value = false
                }
            }
        }

        return null
    }

    /**
     * 주소를 좌표로 변환하는 함수
     * @param {string} address - 검색할 주소
     * @returns {Promise<Object|null>} 변환된 좌표 정보
     */
    const getCoordsFromAddress = async (address) => {
        if (!address || typeof address !== 'string' || address.trim().length === 0) {
            error.value = '유효하지 않은 주소입니다.'
            return null
        }

        if (!apiAvailable.value) {
            error.value = '네이버 지도 API가 로드되지 않았습니다.'
            return null
        }

        try {
            isLoading.value = true
            error.value = null

            console.log('[useGeocoding] 좌표 변환 시작:', address)

            const coordInfo = await geocode(address)

            console.log('[useGeocoding] 좌표 변환 성공:', coordInfo)
            return coordInfo

        } catch (err) {
            const errorMsg = err.message || '좌표 변환에 실패했습니다.'
            error.value = errorMsg
            console.error('[useGeocoding] 좌표 변환 실패:', errorMsg)
            return null
        } finally {
            isLoading.value = false
        }
    }

    /**
     * 현재 주소 정보 업데이트
     * @param {Object} addressInfo - 주소 정보
     * @param {boolean} addToHistory - 히스토리 추가 여부
     */
    const updateCurrentAddress = (addressInfo, addToHistory = true) => {
        globalState.currentAddress = addressInfo
        globalState.lastUpdateTime = new Date()

        // ✅ 추가: localStorage에 저장
        try {
            localStorage.setItem('lastAddress', JSON.stringify(addressInfo))
            console.log('💾 주소 저장 완료:', addressInfo.shortAddress)
        } catch (error) {
            console.error('주소 저장 실패:', error)
        }

        // 히스토리 추가
        if (addToHistory) {
            const historyItem = {
                ...addressInfo,
                timestamp: new Date(),
                id: Date.now()
            }

            globalState.addressHistory.unshift(historyItem)

            if (globalState.addressHistory.length > 20) {
                globalState.addressHistory = globalState.addressHistory.slice(0, 20)
            }
        }

        console.log('[useGeocoding] 현재 주소 업데이트:', addressInfo.shortAddress)
    }

    /**
     * 현재 주소 초기화
     */
    const clearCurrentAddress = () => {
        globalState.currentAddress = null
        globalState.lastUpdateTime = null
        error.value = null

        // ✅ 추가: localStorage도 삭제
        try {
            localStorage.removeItem('lastAddress')
            console.log('💾 저장된 주소 삭제')
        } catch (error) {
            console.error('주소 삭제 실패:', error)
        }

        console.log('[useGeocoding] 현재 주소 초기화')
    }

    /**
     * 캐시 초기화
     */
    const clearCache = () => {
        globalState.cache.clear()
        console.log('[useGeocoding] 캐시 초기화')
    }

    /**
     * 히스토리 초기화
     */
    const clearHistory = () => {
        globalState.addressHistory = []
        console.log('[useGeocoding] 히스토리 초기화')
    }

    /**
     * 에러 초기화
     */
    const clearError = () => {
        error.value = null
    }

    /**
     * 주소 정보가 유효한지 확인
     * @param {Object} addressInfo - 주소 정보
     * @returns {boolean} 유효성 여부
     */
    const isValidAddress = (addressInfo) => {
        return !!(
            addressInfo &&
            (addressInfo.fullAddress || addressInfo.shortAddress) &&
            (addressInfo.sido || addressInfo.sigungu)
        )
    }

    /**
     * 간단한 주소 문자열 반환
     * @param {Object} addressInfo - 주소 정보 (옵션, 없으면 현재 주소 사용)
     * @returns {string} 간단한 주소
     */
    const getSimpleAddress = (addressInfo = null) => {
        const addr = addressInfo || currentAddress.value
        if (!addr) return '위치 정보 없음'

        return addr.shortAddress || addr.sigungu || addr.sido || '알 수 없는 위치'
    }

    /**
     * 상세한 주소 문자열 반환
     * @param {Object} addressInfo - 주소 정보 (옵션, 없으면 현재 주소 사용)
     * @returns {string} 상세한 주소
     */
    const getDetailedAddress = (addressInfo = null) => {
        const addr = addressInfo || currentAddress.value
        if (!addr) return '위치 정보 없음'

        return addr.fullAddress || addr.roadAddress || addr.jibunAddress || getSimpleAddress(addr)
    }

    // 디버깅용 상태 로그
    const logCurrentState = () => {
        console.log('[useGeocoding] 현재 상태:', {
            currentAddress: globalState.currentAddress,
            isLoading: isLoading.value,
            error: error.value,
            cacheSize: globalState.cache.size,
            historyCount: globalState.addressHistory.length,
            apiAvailable: apiAvailable.value
        })
    }

    return {
        // 반응형 상태
        currentAddress,
        addressHistory,
        isLoading,
        error,
        isRetrying,
        apiAvailable,

        // 메인 함수들
        getAddressFromCoords,
        getCoordsFromAddress,

        // 상태 관리 함수들
        updateCurrentAddress,
        clearCurrentAddress,
        clearCache,
        clearHistory,
        clearError,

        // 유틸리티 함수들
        isValidAddress,
        getSimpleAddress,
        getDetailedAddress,
        logCurrentState,

        // 전역 상태 직접 접근 (필요시)
        globalState
    }
}