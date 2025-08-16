// src/services/geocodingService.js
// 네이버 지도 Geocoding API 서비스

/**
 * 좌표를 주소로 변환하는 역지오코딩 함수
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {Promise<Object>} 변환된 주소 정보
 */
export const reverseGeocode = (lat, lng) => {
    return new Promise((resolve, reject) => {
        // 네이버 지도 API가 로드되었는지 확인
        if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
            reject(new Error('네이버 지도 API 또는 Geocoder 서비스가 로드되지 않았습니다.'));
            return;
        }

        // 좌표 유효성 검증
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            reject(new Error('유효하지 않은 좌표입니다.'));
            return;
        }

        try {
            // 네이버 지도 역지오코딩 API 호출
            window.naver.maps.Service.reverseGeocode({
                coords: new window.naver.maps.LatLng(lat, lng),
                orders: [
                    window.naver.maps.Service.OrderType.ADDR,      // 지번 주소
                    window.naver.maps.Service.OrderType.ROAD_ADDR  // 도로명 주소
                ].join(',')
            }, (status, response) => {
                // API 호출 실패 처리
                if (status === window.naver.maps.Service.Status.ERROR) {
                    reject(new Error('역지오코딩 서비스 오류가 발생했습니다.'));
                    return;
                }

                // 결과가 없는 경우 처리
                if (!response.v2 || !response.v2.results || response.v2.results.length === 0) {
                    reject(new Error('해당 좌표에 대한 주소를 찾을 수 없습니다.'));
                    return;
                }

                try {
                    // 결과 데이터 파싱
                    const result = response.v2.results[0];
                    const addressInfo = parseAddressResult(result);

                    resolve(addressInfo);
                } catch (parseError) {
                    reject(new Error(`주소 데이터 파싱 오류: ${parseError.message}`));
                }
            });

        } catch (error) {
            reject(new Error(`역지오코딩 요청 오류: ${error.message}`));
        }
    });
};

/**
 * 주소를 좌표로 변환하는 지오코딩 함수
 * @param {string} address - 검색할 주소
 * @returns {Promise<Object>} 변환된 좌표 정보
 */
export const geocode = (address) => {
    return new Promise((resolve, reject) => {
        // 네이버 지도 API가 로드되었는지 확인
        if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
            reject(new Error('네이버 지도 API 또는 Geocoder 서비스가 로드되지 않았습니다.'));
            return;
        }

        // 주소 유효성 검증
        if (!address || typeof address !== 'string' || address.trim().length === 0) {
            reject(new Error('유효하지 않은 주소입니다.'));
            return;
        }

        try {
            // 네이버 지도 지오코딩 API 호출
            window.naver.maps.Service.geocode({
                query: address.trim()
            }, (status, response) => {
                // API 호출 실패 처리
                if (status === window.naver.maps.Service.Status.ERROR) {
                    reject(new Error('지오코딩 서비스 오류가 발생했습니다.'));
                    return;
                }

                // 결과가 없는 경우 처리
                if (!response.v2 || !response.v2.addresses || response.v2.addresses.length === 0) {
                    reject(new Error(`"${address}"에 대한 검색 결과를 찾을 수 없습니다.`));
                    return;
                }

                try {
                    // 첫 번째 결과 반환
                    const result = response.v2.addresses[0];
                    const coordinateInfo = {
                        lat: parseFloat(result.y),
                        lng: parseFloat(result.x),
                        roadAddress: result.roadAddress || '',
                        jibunAddress: result.jibunAddress || '',
                        originalQuery: address
                    };

                    resolve(coordinateInfo);
                } catch (parseError) {
                    reject(new Error(`좌표 데이터 파싱 오류: ${parseError.message}`));
                }
            });

        } catch (error) {
            reject(new Error(`지오코딩 요청 오류: ${error.message}`));
        }
    });
};

/**
 * 역지오코딩 결과를 파싱하여 사용하기 쉬운 형태로 변환
 * @param {Object} result - 네이버 API 응답 결과
 * @returns {Object} 파싱된 주소 정보
 */
function parseAddressResult(result) {
    const addressInfo = {
        // 기본 정보
        fullAddress: '',
        shortAddress: '',

        // 행정구역 정보
        sido: '',           // 시/도 (서울특별시)
        sigungu: '',        // 시/군/구 (강남구)
        dong: '',           // 동/읍/면 (역삼동)

        // 상세 주소 정보
        roadAddress: '',    // 도로명 주소
        jibunAddress: '',   // 지번 주소

        // 원본 데이터
        originalData: result
    };

    try {
        // 행정구역 정보 추출
        const region = result.region;
        if (region) {
            addressInfo.sido = region.area1?.name || '';
            addressInfo.sigungu = region.area2?.name || '';
            addressInfo.dong = region.area3?.name || '';
        }

        // 지번 주소 구성
        if (result.land) {
            const land = result.land;
            let jibunAddr = '';

            if (addressInfo.sido) jibunAddr += addressInfo.sido + ' ';
            if (addressInfo.sigungu) jibunAddr += addressInfo.sigungu + ' ';
            if (addressInfo.dong) jibunAddr += addressInfo.dong + ' ';

            if (land.number1) {
                jibunAddr += land.number1;
                if (land.number2) jibunAddr += '-' + land.number2;
            }

            addressInfo.jibunAddress = jibunAddr.trim();
        }

        // 도로명 주소 추출
        if (result.land && result.land.addition0) {
            addressInfo.roadAddress = result.land.addition0.value || '';
        }

        // 전체 주소 구성 (도로명 주소 우선, 없으면 지번 주소)
        addressInfo.fullAddress = addressInfo.roadAddress || addressInfo.jibunAddress;

        // 간단한 주소 (시/군/구 + 동)
        if (addressInfo.sigungu && addressInfo.dong) {
            addressInfo.shortAddress = `${addressInfo.sigungu} ${addressInfo.dong}`;
        } else if (addressInfo.sigungu) {
            addressInfo.shortAddress = addressInfo.sigungu;
        } else if (addressInfo.sido) {
            addressInfo.shortAddress = addressInfo.sido;
        }

    } catch (error) {
        console.warn('주소 파싱 중 오류:', error);
        // 파싱 실패해도 기본 구조는 반환
    }

    return addressInfo;
}

/**
 * Geocoding API 사용 가능 여부 확인
 * @returns {boolean} 사용 가능 여부
 */
export const isGeocodingAvailable = () => {
    return !!(window.naver && window.naver.maps && window.naver.maps.Service);
};

/**
 * 여러 주소를 한번에 지오코딩 (순차 처리)
 * @param {string[]} addresses - 주소 배열
 * @param {number} delay - 요청 간 딜레이 (ms)
 * @returns {Promise<Object[]>} 변환된 좌표 정보 배열
 */
export const geocodeMultiple = async (addresses, delay = 1000) => {
    const results = [];

    for (const address of addresses) {
        try {
            const result = await geocode(address);
            results.push({ success: true, data: result, address });
        } catch (error) {
            results.push({ success: false, error: error.message, address });
        }

        // 다음 요청 전 딜레이
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return results;
};