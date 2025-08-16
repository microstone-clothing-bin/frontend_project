// src/composables/useSortedDistance.js
// 거리순 정렬 전용 Composable

import { computed } from 'vue'
import { useDistanceCalculator } from '../currentlocation/useDistanceCalculator.js'

export function useSortedDistance() {
    // 거리 계산 composable 사용
    const { sortLocationsByDistance } = useDistanceCalculator()

    /**
     * 📊 배열을 거리순으로 정렬
     * @param {Array} locations - 정렬할 위치 배열
     * @param {string} latKey - 위도 필드명 (기본: 'lat')
     * @param {string} lngKey - 경도 필드명 (기본: 'lng')
     * @returns {Array} 거리순으로 정렬된 배열 (distance, formattedDistance 필드 추가)
     */
    const sortByDistance = (locations, latKey = 'lat', lngKey = 'lng') => {
        if (!Array.isArray(locations) || locations.length === 0) {
            return []
        }

        return sortLocationsByDistance(locations, latKey, lngKey)
    }

    /**
     * 📊 반응형 거리순 정렬 (computed 버전)
     * @param {Ref} locationsRef - 반응형 위치 배열
     * @param {string} latKey - 위도 필드명 (기본: 'lat')
     * @param {string} lngKey - 경도 필드명 (기본: 'lng')
     * @returns {ComputedRef} 거리순으로 정렬된 반응형 배열
     */
    const sortByDistanceComputed = (locationsRef, latKey = 'lat', lngKey = 'lng') => {
        return computed(() => {
            return sortByDistance(locationsRef.value, latKey, lngKey)
        })
    }

    return {
        sortByDistance,         // 일반 정렬 함수
        sortByDistanceComputed  // 반응형 정렬 함수
    }
}