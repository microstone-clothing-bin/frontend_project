// src/composables/currentlocation/useNaverMapCurrentLocation.js
// 네이버 지도의 현재 위치 관련 핵심 기능 + 지오코딩 포함

import { useGeocoding } from '@/composables/useGeocoding'

export function useNaverMapCurrentLocation(
    map,                                   // 네이버 지도 인스턴스
    clothingBins,                          // 의류수거함 배열 (ref)
    showCurrentLocation,                   // 현재 위치 표시 함수
    hideCurrentLocation,                   // 현재 위치 숨기기 함수
    showCurrentLocationWithNearbyData,     // 현재 위치 + 주변 데이터 표시 함수
    emit                                   // Vue 이벤트 발생 함수
) {
    // 지오코딩 기능 추가
    const {
        getAddressFromCoords,              // 좌표를 주소로 변환하는 함수
        currentAddress                     // 현재 변환된 주소 정보 (reactive)
    } = useGeocoding()

    // 현재 위치 찾기 성공 시 실행되는 메인 핸들러
    const handleLocationSuccess = async (result) => {
        console.log('현재 위치 찾기 성공:', result)

        try {
            // 현재 위치를 지도에 표시 (마커 + 지도 이동)
            const showResult = await showCurrentLocation()

            if (showResult.success) {
                console.log('현재 위치가 지도에 표시되었습니다:', showResult.message)

                // 좌표를 주소로 변환
                await convertLocationToAddress(showResult.position)

                // 부모 컴포넌트에 성공 이벤트 전달
                emit('location-found', {
                    position: showResult.position,
                    isRealLocation: showResult.isRealLocation,
                    message: showResult.message,
                    address: currentAddress.value  // 주소 정보 포함
                })
            } else {
                throw new Error(showResult.error)
            }

        } catch (error) {
            console.error('현재 위치 표시 실패:', error)
            handleLocationError({ error: error.message })
        }
    }

    // 현재 위치 좌표를 주소로 변환하는 함수
    const convertLocationToAddress = async (position) => {
        try {
            console.log('현재 위치 주소 변환 시작:', position)

            // 좌표를 주소로 변환 (네이버 지오코딩 API 사용)
            const addressInfo = await getAddressFromCoords(position.lat, position.lng, {
                useCache: true,          // 캐시 사용으로 성능 향상
                updateGlobalState: true  // 전역 상태 업데이트
            })

            if (addressInfo) {
                console.log('현재 위치 주소 변환 성공:', addressInfo.shortAddress)
                return addressInfo
            } else {
                console.warn('현재 위치 주소 변환 실패 - 결과 없음')
                return null
            }

        } catch (error) {
            console.error('현재 위치 주소 변환 오류:', error.message)
            return null
        }
    }

    // 현재 위치 찾기 실패 시 실행되는 에러 핸들러
    const handleLocationError = (errorData) => {
        console.error('현재 위치 찾기 실패:', errorData)

        // 부모 컴포넌트에 에러 이벤트 전달
        emit('location-error', errorData)
    }

    // 현재 위치 마커 숨기기 (래퍼 함수)
    const hideCurrentLocationMarker = () => {
        const result = hideCurrentLocation()
        console.log('현재 위치 마커 숨김:', result.message)
        return result
    }

    // 외부에서 사용할 수 있도록 반환
    return {
        handleLocationSuccess,          // 현재 위치 찾기 성공 시 실행되는 메인 핸들러
        handleLocationError,            // 현재 위치 찾기 실패 시 실행되는 에러 핸들러
        hideCurrentLocationMarker,      // 현재 위치 마커 숨기기
        convertLocationToAddress,       // 좌표를 주소로 변환
        currentAddress                  // 현재 변환된 주소 정보 (reactive)
    }
}