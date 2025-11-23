// src/stores/boardStore.js
/* 게시판에 페이징 번호 대신 무한 스크롤 방식 사용,
서버에서는 여전히 페이지 단위로 데이터를 요청하되, 클라이언트에서는 페이지 번호를 표시하지 않고 목록에 데이터를 누적함.
 */
import { defineStore } from 'pinia';
import { boardService } from '@/services/boardService'; // 기존 boardService 사용

export const useBoardStore = defineStore('board', {
    state: () => ({
        boards: [],             // 현재 로드된 게시글 목록
        isEnd: false,           // 마지막 페이지인지 여부
        nextPage: 0,            // 다음에 요청할 페이지 번호 (0부터 시작)
        totalElements: 0,       // 전체 게시글 수
        isLoading: false,       // 데이터 로딩 상태
        error: null,            // 에러 메시지
        pageSize: 10,           // 페이지당 항목 수
    }),

    actions: {
        /**
         * 게시글 목록을 서버에서 가져와 Store 상태를 업데이트
         * @param {number} page - 요청할 페이지 번호
         * @param {string} sort - 정렬 기준 (예: 'boardId')
         * @param {string} direction - 정렬 방향 (예: 'DESC')
         */
        async fetchBoards(size = this.pageSize, sort = 'boardId', direction = 'DESC') {
            if (this.isLoading || this.isEnd) return; // 로딩 중이거나 끝이면 중복 호출 방지

            this.isLoading = true;
            this.error = null;

            try {
                // 다음에 요청할 페이지 번호(this.nextPage) 사용
                const data = await boardService.getAllBoards(this.nextPage, size, sort, direction);

                // Store 상태 업데이트 (새 데이터 누적)
                // 새로운 데이터를 기존 목록 뒤에 붙임
                this.boards = [...this.boards, ...data.content];

                this.totalElements = data.totalElements;

                // 다음 페이지 번호와 마지막 페이지 여부 설정
                this.nextPage = data.number + 1; // 서버가 반환한 현재 페이지 + 1
                this.isEnd = data.last;          // 마지막 페이지인지 여부

            } catch (err) {
                this.error = '게시글 목록을 불러오는 데 실패했습니다.';
                console.error('Board Store fetch error:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        // 게시물 등록 후 목록을 초기화하고 첫 페이지를 다시 불러옴
        async refreshBoardList() {
            // 상태 초기화
            this.boards = [];
            this.nextPage = 0;
            this.isEnd = false;

            // 첫 페이지 다시 불러오기
            await this.fetchBoards(this.pageSize, 'boardId', 'DESC');
        },

        // 목록을 완전히 비우고 초기 상태로 되돌림 (정렬 기준 변경 시 사용 가능)
        clearBoards() {
            this.boards = [];
            this.nextPage = 0;
            this.isEnd = false;
            this.totalElements = 0;
        }
    }
});