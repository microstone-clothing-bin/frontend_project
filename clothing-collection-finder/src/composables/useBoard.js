// src/composables/useBoard.js

import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/boardStore'

export function useBoard() {
    const boardStore = useBoardStore()

    // storeToRefs로 반응성 유지
    const { boards, totalElements, isLoading, error, isEnd, nextPage } = storeToRefs(boardStore)

    // 액션
    const fetchBoards = boardStore.fetchBoards
    const refreshBoardList = boardStore.refreshBoardList
    const clearBoards = boardStore.clearBoards // 목록 초기화 함수

    return {
        // 상태
        boards,
        totalElements,
        isLoading,
        error,
        isEnd,
        nextPage, // 다음 페이지 번호 (디버깅용)

        // 액션
        fetchBoards,
        refreshBoardList,
        clearBoards // 목록 초기화
    }
}