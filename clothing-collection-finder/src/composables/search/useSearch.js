// src/composables/search/useSearch.js
import { ref, computed } from 'vue'

export function useSearch() {
    // 검색 상태
    const searchQuery = ref('')           // 검색어
    const searchResults = ref([])         // 검색 결과 배열
    const isSearchMode = ref(false)       // 검색 모드 여부
    const isSearching = ref(false)        // 검색 중 상태

    // 검색 점수 계산 함수 - 도로명 주소와 지번 주소 모두 검색
    const calculateScore = (bin, query) => {
        const roadAddress = (bin.roadAddress || '').toLowerCase()
        const landLotAddress = (bin.landLotAddress || '').toLowerCase()
        const searchTerm = query.toLowerCase()

        if (!searchTerm) return 0

        let score = 0

        // 도로명 주소에서 점수 계산
        const roadScore = calculateAddressScore(roadAddress, searchTerm, 1.0) // 기본 가중치

        // 지번 주소에서 점수 계산 (약간 낮은 가중치)
        const landLotScore = calculateAddressScore(landLotAddress, searchTerm, 0.9)

        // 둘 중 높은 점수 사용 (하나의 주소가 매칭되면 충분)
        score = Math.max(roadScore, landLotScore)

        // 디버깅용 로그 (필요시 주석 해제)
        if (score > 0) {
            console.log(`검색매칭: "${query}" -> 도로명:${roadScore}, 지번:${landLotScore}, 최종:${score}`)
        }

        return score
    }

    // 개별 주소에서 점수 계산하는 헬퍼 함수
    const calculateAddressScore = (address, searchTerm, weight = 1.0) => {
        if (!address || !searchTerm) return 0

        let baseScore = 0

        // 완전 일치 (가장 높은 점수)
        if (address === searchTerm) {
            baseScore = 100
        }
        // 시작 부분 일치
        else if (address.startsWith(searchTerm)) {
            baseScore = 80
        }
        // 포함 일치
        else if (address.includes(searchTerm)) {
            baseScore = 60
        }
        else {
            // 단어별 매칭 (공백, 하이픈, 쉼표로 분리)
            const addressWords = address.split(/[\s\-,]+/).filter(word => word.length > 0)
            let wordMatchScore = 0

            addressWords.forEach(word => {
                if (word === searchTerm) {
                    wordMatchScore += 50 // 단어 완전 일치
                } else if (word.startsWith(searchTerm)) {
                    wordMatchScore += 35 // 단어 시작 일치
                } else if (word.includes(searchTerm)) {
                    wordMatchScore += 25 // 단어 포함 일치
                }
            })

            baseScore = wordMatchScore
        }

        // 부분 매칭 보너스 (검색어가 짧을 때 더 관대하게)
        if (baseScore > 0 && searchTerm.length <= 2) {
            baseScore += 10
        }

        return Math.floor(baseScore * weight)
    }

    // 메인 검색 함수
    const performSearch = (clothingBins, query) => {
        const trimmedQuery = query.trim()

        // 빈 검색어 처리
        if (!trimmedQuery) {
            searchResults.value = []
            isSearchMode.value = false
            return
        }

        isSearching.value = true
        isSearchMode.value = true

        try {
            // 점수 계산 및 필터링
            const scoredResults = clothingBins
                .map(bin => {
                    const score = calculateScore(bin, trimmedQuery)
                    return {
                        ...bin,
                        searchScore: score,
                        // 어떤 주소로 매칭되었는지 표시 (디버깅용)
                        matchedBy: getMatchType(bin, trimmedQuery)
                    }
                })
                .filter(bin => bin.searchScore > 0)  // 점수가 있는 것만
                .sort((a, b) => {
                    // 점수 높은 순으로 정렬, 점수가 같으면 도로명 주소 우선
                    if (b.searchScore !== a.searchScore) {
                        return b.searchScore - a.searchScore
                    }
                    // 점수가 같을 때 도로명 주소가 있는 것 우선
                    return (b.roadAddress ? 1 : 0) - (a.roadAddress ? 1 : 0)
                })
                .slice(0, 15)  // 상위 15개만 (지번 주소 추가로 결과가 많아질 수 있음)

            searchResults.value = scoredResults

            // 검색 결과 로그
            console.log(`🔍 검색 완료: "${trimmedQuery}" → ${scoredResults.length}개 결과`)

            // 매칭된 주소 유형별 통계 (디버깅용)
            if (scoredResults.length > 0) {
                const matchStats = scoredResults.reduce((stats, result) => {
                    stats[result.matchedBy] = (stats[result.matchedBy] || 0) + 1
                    return stats
                }, {})
                console.log('📊 매칭 유형별 통계:', matchStats)
            }

        } catch (error) {
            console.error('검색 중 오류:', error)
            searchResults.value = []
        } finally {
            isSearching.value = false
        }
    }

    // 어떤 주소로 매칭되었는지 확인하는 헬퍼 함수
    const getMatchType = (bin, query) => {
        const roadAddress = (bin.roadAddress || '').toLowerCase()
        const landLotAddress = (bin.landLotAddress || '').toLowerCase()
        const searchTerm = query.toLowerCase()

        const roadScore = calculateAddressScore(roadAddress, searchTerm)
        const landLotScore = calculateAddressScore(landLotAddress, searchTerm)

        if (roadScore > landLotScore) {
            return 'roadAddress'
        } else if (landLotScore > roadScore) {
            return 'landLotAddress'
        } else if (roadScore > 0) {
            return 'both'
        }
        return 'none'
    }

    // 검색 초기화
    const clearSearch = () => {
        searchQuery.value = ''
        searchResults.value = []
        isSearchMode.value = false
        console.log('🧹 검색 초기화')
    }

    // 검색어 강조 함수 - 도로명 주소와 지번 주소 모두 지원
    const highlightSearchTerm = (text, addressType = 'road') => {
        if (!searchQuery.value || !text) return text

        const regex = new RegExp(`(${searchQuery.value})`, 'gi')
        const highlightColor = addressType === 'landLot' ? '#90EE90' : '#FFFF00' // 지번은 연두색, 도로명은 노란색

        return text.replace(regex, `<mark style="background-color: ${highlightColor}; font-weight: bold; padding: 1px 2px; border-radius: 2px;">$1</mark>`)
    }

    // 검색 결과에서 표시할 주소를 결정하는 함수
    const getDisplayAddress = (bin) => {
        // 도로명 주소가 있으면 우선 표시, 없으면 지번 주소
        return bin.roadAddress || bin.landLotAddress || '주소 정보 없음'
    }

    // 검색 결과에서 보조 주소를 표시하는 함수
    const getSecondaryAddress = (bin) => {
        // 도로명 주소가 메인이면 지번 주소를 보조로, 그 반대도 마찬가지
        if (bin.roadAddress && bin.landLotAddress) {
            return bin.roadAddress === getDisplayAddress(bin) ? bin.landLotAddress : bin.roadAddress
        }
        return null
    }

    // 검색 통계 정보
    const searchStats = computed(() => {
        if (!isSearchMode.value) return null

        return {
            total: searchResults.value.length,
            roadAddressMatches: searchResults.value.filter(r => r.matchedBy === 'roadAddress').length,
            landLotAddressMatches: searchResults.value.filter(r => r.matchedBy === 'landLotAddress').length,
            bothMatches: searchResults.value.filter(r => r.matchedBy === 'both').length
        }
    })

    return {
        // 상태
        searchQuery,
        searchResults,
        isSearchMode,
        isSearching,
        searchStats,

        // 함수
        performSearch,
        clearSearch,
        highlightSearchTerm,
        getDisplayAddress,
        getSecondaryAddress
    }
}