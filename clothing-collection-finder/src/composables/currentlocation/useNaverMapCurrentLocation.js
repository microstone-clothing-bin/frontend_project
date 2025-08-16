// src/composables/currentlocation/useNaverMapCurrentLocation.js
// 네이버 지도의 현재 위치 관련 모든 로직을 관리하는 통합 composable

import { useGeocoding } from '@/composables/useGeocoding'
import { useCoordinates } from '@/composables/currentlocation/useCoordinates'

export function useNaverMapCurrentLocation(
    map,                                    // 네이버 지도 인스턴스
    clothingBins,                          // 의류수거함 배열 (ref)
    showCurrentLocation,                   // 현재 위치 표시 함수
    hideCurrentLocation,                   // 현재 위치 숨기기 함수
    showCurrentLocationWithNearbyData,     // 현재 위치 + 주변 데이터 표시 함수
    emit                                   // Vue 이벤트 발생 함수
) {
    // 🌍 지오코딩 Composable 사용 (좌표 ↔ 주소 변환)
    const {
        getAddressFromCoords,              // 좌표를 주소로 변환하는 함수
        currentAddress,                    // 현재 변환된 주소 정보 (reactive)
        isLoading: isGeocodingLoading      // 지오코딩 진행 중인지 여부 (reactive)
    } = useGeocoding()

    // 📍 좌표 관리 Composable 사용
    const {
        setCurrentCoords                   // 현재 좌표를 전역 상태에 저장하는 함수
    } = useCoordinates()

    // 🎯 현재 위치 찾기 성공 시 실행되는 메인 핸들러
    const handleLocationSuccess = async (result) => {
        console.log('현재 위치 찾기 성공:', result)

        try {
            // 1. 지도에 현재 위치 표시 (위치 가져오기 + 마커 + 지도 이동)
            const showResult = await showCurrentLocation({
                animate: true,      // 부드러운 애니메이션 사용
                zoomLevel: 17,      // 상세 줌 레벨 (건물 단위)
                duration: 1500      // 1.5초 애니메이션 지속
            })

            if (showResult.success) {
                console.log('현재 위치가 지도에 표시되었습니다:', showResult.message)

                // 2. 좌표를 useCoordinates 전역 상태에 저장
                await saveCurrentCoords(showResult.position)

                // 3. 현재 위치 좌표를 주소로 변환
                await convertLocationToAddress(showResult.position)

                // 4. 주변 의류수거함과 함께 보기 (선택사항)
                await handleNearbyBinsDisplay(showResult.position)

                // 5. 부모 컴포넌트에 성공 이벤트 전달 (주소 정보 포함)
                emit('location-found', {
                    position: showResult.position,          // 위치 좌표
                    address: currentAddress.value,          // 변환된 주소 정보
                    isRealLocation: showResult.isRealLocation,  // GPS 실제 위치 여부
                    message: showResult.message             // 성공 메시지
                })
            } else {
                throw new Error(showResult.error)
            }

        } catch (error) {
            console.error('현재 위치 표시 실패:', error)
            handleLocationError({ error: error.message })
        }
    }

    // 📍 현재 위치 좌표를 useCoordinates 전역 상태에 저장하는 함수
    const saveCurrentCoords = async (position) => {
        try {
            console.log('🔄 현재 위치 좌표 저장 시작:', position)

            // 좌표를 전역 상태에 저장
            const success = setCurrentCoords(position.lat, position.lng, {
                accuracy: position.accuracy || null,                        // GPS 정확도
                source: position.isRealLocation ? 'geolocation' : 'fallback',  // 좌표 출처
                addToHistory: true                                          // 히스토리에 추가
            })

            if (success) {
                console.log('✅ 현재 위치 좌표 저장 성공:', {
                    lat: position.lat,
                    lng: position.lng,
                    source: position.isRealLocation ? 'GPS' : 'Fallback'
                })
            } else {
                console.warn('⚠️ 현재 위치 좌표 저장 실패')
            }

            return success

        } catch (error) {
            console.error('❌ 현재 위치 좌표 저장 오류:', error.message)
            return false
        }
    }

    // 🌍 현재 위치 좌표를 주소로 변환하는 함수
    const convertLocationToAddress = async (position) => {
        try {
            console.log('🌍 현재 위치 주소 변환 시작:', position)

            // 좌표를 주소로 변환 (네이버 지오코딩 API 사용)
            const addressInfo = await getAddressFromCoords(position.lat, position.lng, {
                useCache: true,          // 캐시 사용으로 성능 향상
                updateGlobalState: true, // 전역 상태 업데이트
                addToHistory: true       // 주소 히스토리에 추가
            })

            if (addressInfo) {
                console.log('✅ 현재 위치 주소 변환 성공:', {
                    shortAddress: addressInfo.shortAddress,    // 간단한 주소 (예: "강남구 역삼동")
                    fullAddress: addressInfo.fullAddress,      // 전체 주소
                    position: position
                })

                // 부모 컴포넌트에 주소 변환 완료 이벤트 전달
                emit('address-updated', {
                    position: position,         // 위치 좌표
                    address: addressInfo,       // 변환된 주소 정보
                    timestamp: new Date()       // 변환 시각
                })

                return addressInfo
            } else {
                console.warn('⚠️ 현재 위치 주소 변환 실패 - 결과 없음')

                // 실패해도 기본 위치 정보는 전달
                emit('address-updated', {
                    position: position,
                    address: null,
                    error: '주소를 찾을 수 없습니다',
                    timestamp: new Date()
                })

                return null
            }

        } catch (error) {
            console.error('❌ 현재 위치 주소 변환 오류:', error.message)

            // 에러 정보도 부모에게 전달
            emit('address-error', {
                position: position,
                error: error.message,
                timestamp: new Date()
            })

            return null
        }
    }

    // ❌ 현재 위치 찾기 실패 시 실행되는 에러 핸들러
    const handleLocationError = (errorData) => {
        console.error('현재 위치 찾기 실패:', errorData)

        // 부모 컴포넌트에 에러 이벤트 전달
        emit('location-error', errorData)
    }

    // 🗺️ 주변 의류수거함 표시 처리 함수
    const handleNearbyBinsDisplay = async (currentPosition) => {
        if (clothingBins.value && clothingBins.value.length > 0) {
            // 현재 위치 근처의 의류수거함 필터링 (예: 2km 반경)
            const nearbyBins = filterNearbyBins(currentPosition, clothingBins.value, 2000)

            if (nearbyBins.length > 0) {
                console.log(`주변 ${nearbyBins.length}개 의류수거함과 함께 표시`)
                // 현재 위치 + 주변 의류수거함이 모두 보이도록 지도 범위 조정
                await showCurrentLocationWithNearbyData(nearbyBins)
            }
        }
    }

    // 📏 주변 의류수거함 필터링 함수 (지정된 반경 내 수거함만 반환)
    const filterNearbyBins = (currentPosition, bins, radiusInMeters) => {
        return bins.filter(bin => {
            // 좌표가 없는 수거함 제외
            if (!bin.lat || !bin.lng) return false

            // 간단한 거리 계산 (정확도보다는 성능 우선)
            const latDiff = Math.abs(bin.lat - currentPosition.lat)      // 위도 차이
            const lngDiff = Math.abs(bin.lng - currentPosition.lng)      // 경도 차이

            // 대략적인 거리 계산 (1도 ≈ 111km 근사)
            const distance = Math.sqrt(
                Math.pow(latDiff * 111000, 2) +                         // 위도 차이를 미터로 변환
                Math.pow(lngDiff * 111000 * Math.cos(currentPosition.lat * Math.PI / 180), 2)  // 경도 차이 (위도 보정)
            )

            return distance <= radiusInMeters  // 지정된 반경 내에 있는지 확인
        })
    }

    // 👻 현재 위치 마커 숨기기 (래퍼 함수)
    const hideCurrentLocationMarker = () => {
        const result = hideCurrentLocation()
        console.log('현재 위치 마커 숨김:', result.message)
        return result
    }

    // 🎛️ 현재 위치 설정 커스터마이징 (옵션 설정 가능한 고급 함수)
    const showCurrentLocationWithOptions = async (options = {}) => {
        const defaultOptions = {
            animate: true,                 // 애니메이션 사용 여부
            zoomLevel: 17,                // 줌 레벨
            duration: 1500,               // 애니메이션 지속 시간
            showNearbyBins: true,         // 주변 의류수거함 표시 여부
            nearbyRadius: 2000,           // 주변 반경 (미터)
            convertToAddress: true        // 주소 변환 여부
        }

        const finalOptions = { ...defaultOptions, ...options }

        try {
            // 1. 현재 위치를 지도에 표시
            const showResult = await showCurrentLocation({
                animate: finalOptions.animate,
                zoomLevel: finalOptions.zoomLevel,
                duration: finalOptions.duration
            })

            if (showResult.success) {
                // 2. 주소 변환 옵션이 활성화된 경우
                if (finalOptions.convertToAddress) {
                    // 좌표를 먼저 저장
                    await saveCurrentCoords(showResult.position)

                    // 주소 변환 실행
                    await convertLocationToAddress(showResult.position)
                }

                // 3. 주변 의류수거함 표시 옵션이 활성화된 경우
                if (finalOptions.showNearbyBins) {
                    const nearbyBins = filterNearbyBins(
                        showResult.position,
                        clothingBins.value || [],
                        finalOptions.nearbyRadius
                    )

                    if (nearbyBins.length > 0) {
                        await showCurrentLocationWithNearbyData(nearbyBins)
                    }
                }
            }

            return showResult

        } catch (error) {
            console.error('현재 위치 표시 실패:', error)
            return { success: false, error: error.message }
        }
    }

    // 🔍 수동으로 특정 좌표의 주소 가져오기 (개별 좌표 주소 변환)
    const getAddressForCoords = async (lat, lng) => {
        try {
            const addressInfo = await getAddressFromCoords(lat, lng, {
                useCache: true,               // 캐시 사용
                updateGlobalState: false,     // 전역 상태는 업데이트하지 않음
                addToHistory: false           // 히스토리에도 추가하지 않음
            })

            return addressInfo
        } catch (error) {
            console.error('좌표 주소 변환 실패:', error.message)
            return null
        }
    }

    // 📍 현재 주소 정보 조회 (상태 정보 종합 반환)
    const getCurrentAddressInfo = () => {
        return {
            address: currentAddress.value,                                      // 전체 주소 객체
            isLoading: isGeocodingLoading.value,                               // 로딩 상태
            hasAddress: !!currentAddress.value,                                // 주소 존재 여부
            shortAddress: currentAddress.value?.shortAddress || '위치 정보 없음',  // 간단한 주소
            fullAddress: currentAddress.value?.fullAddress || '상세 주소 없음'    // 전체 주소
        }
    }

    // 🔧 디버깅 및 상태 확인 함수
    const getCurrentLocationInfo = () => {
        return {
            hasClothingBins: clothingBins.value ? clothingBins.value.length : 0,  // 의류수거함 개수
            mapExists: !!map.value,                                               // 지도 존재 여부
            addressInfo: getCurrentAddressInfo(),                                 // 주소 정보
            timestamp: new Date().toISOString()                                   // 현재 시각
        }
    }

    // 📤 외부에서 사용할 수 있도록 반환
    return {
        // 🔧 기본 핸들러들
        handleLocationSuccess,          // 현재 위치 찾기 성공 시 실행되는 메인 핸들러
        handleLocationError,            // 현재 위치 찾기 실패 시 실행되는 에러 핸들러
        hideCurrentLocationMarker,      // 현재 위치 마커 숨기기

        // 🌍 주소 변환 관련 함수들
        convertLocationToAddress,       // 좌표를 주소로 변환 (지오코딩)
        saveCurrentCoords,             // 좌표를 전역 상태에 저장
        getAddressForCoords,           // 특정 좌표의 주소를 개별적으로 가져오기
        getCurrentAddressInfo,         // 현재 주소 정보 상태 조회

        // 🚀 고급 기능들
        showCurrentLocationWithOptions,  // 옵션 설정 가능한 현재 위치 표시 함수
        filterNearbyBins,               // 지정된 반경 내 의류수거함 필터링
        handleNearbyBinsDisplay,        // 주변 의류수거함 표시 처리

        // 🔄 지오코딩 반응형 상태
        currentAddress,                 // 현재 변환된 주소 정보 (reactive)
        isGeocodingLoading,            // 지오코딩 진행 중인지 여부 (reactive)

        // 🛠️ 유틸리티
        getCurrentLocationInfo          // 전체 상태 정보 디버깅용 함수
    }
}