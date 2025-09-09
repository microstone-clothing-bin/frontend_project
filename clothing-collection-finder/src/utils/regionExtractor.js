// src/utils/regionExtractor.js - 지역 추출 및 그룹화 유틸리티

/**
 * 주소에서 시/구/동 지역명을 추출합니다
 * @param {string} address - 전체 주소 (예: "경기도 의정부시 녹양동 52-8")
 * @param {Object} options - 추출 옵션
 * @param {boolean} options.includeDistrict - 동/읍/면까지 포함할지 여부 (기본: false)
 * @returns {string} 추출된 지역명 (예: "의정부시" 또는 "의정부시 녹양동")
 */
export function extractRegion(address, options = { includeDistrict: false }) {
    if (!address || typeof address !== 'string') {
        return '알 수 없는 지역'
    }

    try {
        // 주소를 공백으로 분할
        const addressParts = address.trim().split(' ')

        // 도/특별시/광역시 제거를 위한 패턴
        const provincePatterns = [
            '경기도', '서울특별시', '부산광역시', '대구광역시',
            '인천광역시', '광주광역시', '대전광역시', '울산광역시',
            '세종특별자치시', '강원도', '충청북도', '충청남도',
            '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
        ]

        // 도/특별시/광역시 부분 건너뛰기
        let startIndex = 0
        if (provincePatterns.includes(addressParts[0])) {
            startIndex = 1
        }

        // 시/구/동 추출 로직
        let region = ''
        let foundCity = false

        for (let i = startIndex; i < addressParts.length; i++) {
            const part = addressParts[i]

            // 시로 끝나는 경우
            if (part.endsWith('시')) {
                region = part
                foundCity = true

                // 다음 부분이 구인지 확인
                if (i + 1 < addressParts.length && addressParts[i + 1].endsWith('구')) {
                    region += ' ' + addressParts[i + 1]
                    i++ // 구 부분 건너뛰기
                }

                // 동/읍/면 포함 옵션이 true인 경우
                if (options.includeDistrict && i + 1 < addressParts.length) {
                    const nextPart = addressParts[i + 1]
                    if (nextPart.endsWith('동') || nextPart.endsWith('읍') || nextPart.endsWith('면')) {
                        region += ' ' + nextPart
                    }
                }
                break
            }

            // 구로 끝나는 경우 (시 없이 구만 있는 경우)
            if (part.endsWith('구')) {
                region = part
                foundCity = true

                // 동/읍/면 포함 옵션이 true인 경우
                if (options.includeDistrict && i + 1 < addressParts.length) {
                    const nextPart = addressParts[i + 1]
                    if (nextPart.endsWith('동') || nextPart.endsWith('읍') || nextPart.endsWith('면')) {
                        region += ' ' + nextPart
                    }
                }
                break
            }
        }

        // 결과가 없으면 기본값 반환
        return region || '기타 지역'

    } catch (error) {
        console.error('지역 추출 중 오류:', error)
        return '기타 지역'
    }
}

/**
 * 의류수거함 배열을 지역별로 그룹화합니다
 * @param {Array} clothingBins - 의류수거함 데이터 배열
 * @param {Object} options - 그룹화 옵션
 * @param {boolean} options.includeDistrict - 동/읍/면까지 포함할지 여부 (기본: false)
 * @returns {Object} 지역별로 그룹화된 객체
 */
export function groupByRegion(clothingBins, options = { includeDistrict: false }) {
    if (!Array.isArray(clothingBins)) {
        return {}
    }

    const grouped = {}

    clothingBins.forEach(bin => {
        // 도로명 주소에서 지역 추출
        const region = extractRegion(bin.roadAddress, options)

        // 해당 지역 그룹이 없으면 생성
        if (!grouped[region]) {
            grouped[region] = []
        }

        // 해당 지역 그룹에 의류수거함 추가
        grouped[region].push(bin)
    })

    return grouped
}

/**
 * 그룹화된 데이터를 배열 형태로 변환 (정렬 가능한 형태)
 * @param {Object} groupedData - 그룹화된 데이터
 * @returns {Array} [{region: '지역명', items: [...], count: 개수}] 형태의 배열
 */
export function convertGroupsToArray(groupedData) {
    return Object.entries(groupedData).map(([region, items]) => ({
        region,
        items,
        count: items.length
    })).sort((a, b) => {
        // 지역명 가나다순 정렬
        return a.region.localeCompare(b.region, 'ko-KR')
    })
}