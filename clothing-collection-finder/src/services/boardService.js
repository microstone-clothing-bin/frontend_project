// 서버에서 게시판 데이터 가져오기

import axios from 'axios';
import { api } from './apiService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-json-74js.onrender.com'

// 1. Axios 인스턴스 설정
const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // 추후 로그인 기능 구현 시, 인증 토큰을 여기에 포함해야 함.
        // 예: 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
});

// 2. 게시판 관련 API 함수 모음
export const boardService = {

    /**
     * [GET] 모든 게시글 목록을 페이징하여 조회
     * @param {number} page - 요청할 페이지 번호 (0부터 시작)
     * @param {string} sort - 정렬 기준 필드 (예: 'boardId', 'viewCnt', 'redate')
     * @param {string} direction - 정렬 방향 ('DESC' 또는 'ASC')
     * @returns {Promise<Object>} 게시글 목록과 페이징 정보를 포함하는 Page 객체
     */
    getAllBoards(page = 0, size = 10, sort = 'boardId', direction = 'DESC') {
        // 서버 API: GET /api/boards?page=0&size=10&sort=boardId,DESC
        return http.get('/api/boards', {
            params: {
                page: page,
                size: size,
                sort: `${sort},${direction}` // Spring Data Pageable 형식
            }
        })
            .then(response => {
                // 서버에서 받은 데이터 (Page 객체)를 반환
                return response.data;
            })
            .catch(error => {
                console.error("게시글 목록 조회 실패:", error);
                throw error;
            });
    },

    /**
     * [GET] 특정 boardId를 가진 게시글 1개를 상세 조회 (조회수 +1 기능 포함)
     * @param {number} boardId - 조회할 게시글의 ID
     * @returns {Promise<Object>} 게시글 상세 데이터 객체 (Base64 인코딩된 이미지 데이터 포함)
     */
    getBoardById(boardId) {
        // 서버 API: GET /api/boards/{boardId}
        return http.get(`/api/boards/${boardId}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`게시글 ID ${boardId} 조회 실패:`, error);
                throw error;
            });
    },

    /**
     * [POST] 새 게시글을 작성하고 이미지 파일을 업로드합니다.
     * 서버 API 시그니처에 맞게 FormData를 인자로 받도록 함.
     * @param {FormData} formData - 제목, 내용, userId, nickname, binId, imageFile을 포함하는 FormData
     * @returns {Promise<Object>} 서버 응답
     */
    async createBoard(formData) {
        // 서버 API: POST /api/boards (ApiController.java의 writeBoard 메소드)
        return http.post('/api/boards', formData, {
            headers: {
                'Content-Type': undefined,
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error("게시글 작성 실패:", error);
                throw error; // 에러를 호출자에게 다시 던짐
            });
    },

    /**
     * [PUT] 게시글 수정 (텍스트만)
     * @param {number} boardId - 게시글 ID
     * @param {Object} boardData - 수정할 데이터 { title, content, userId }
     */
    async updateBoard(boardId, boardData) {
        // 서버 API: PUT /api/boards/{boardId}

        return http.put(`/api/boards/${boardId}`, null, {
            params: {
                title: boardData.title,
                content: boardData.content,
                userId: boardData.userId
            }
        })
            .then(response => response.data)
            .catch(error => {
                console.error(`게시글 ID ${boardId} 수정 실패:`, error);
                throw error;
            });
    },

    /**
     * [DELETE] 게시글 삭제
     * @param {number} boardId - 게시글 ID
     * @param {number} userId - 작성자 ID (권한 확인용)
     */
    async deleteBoard(boardId, userId) {
        // 서버 API: DELETE /api/boards/{boardId}?userId={userId} (가정)
        return http.delete(`/api/boards/${boardId}`, {
            params: { userId: userId }
        })
            .then(response => response.data)
            .catch(error => {
                console.error(`게시글 ID ${boardId} 삭제 실패:`, error);
                throw error;
            });
    },
};

export default boardService;