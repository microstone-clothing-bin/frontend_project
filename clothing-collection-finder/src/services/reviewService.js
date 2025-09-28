// src/services/reviewService.js
import { api } from './apiService.js'

class ReviewService {

    // 1. 특정 의류수거함의 리뷰 목록 조회
    async getReviewsByBinId(binId) {
        try {
            const response = await api.get(`/api/markers/${binId}/posts`);

            // MarkerPostDto 배열 반환
            return response.data.map(review => ({
                id: review.id,
                content: review.content,
                nickname: review.nickname,
                userId: review.userId,
                createDate: review.createDate,
                imageBase64: review.imageBase64, // Base64 인코딩된 이미지
                binId: review.binId
            }));
        } catch (error) {
            console.error('리뷰 목록 조회 실패:', error);
            throw this.handleError(error);
        }
    }

    // 2. 특정 의류수거함에 리뷰 작성
    async createReview(binId, content, imageFile = null) {
        try {
            const formData = new FormData();
            formData.append('content', content);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await api.post(`/api/markers/${binId}/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return {
                success: true,
                message: response.data || '리뷰가 성공적으로 등록되었습니다.'
            };
        } catch (error) {
            console.error('리뷰 작성 실패:', error);
            throw this.handleError(error);
        }
    }

    // 3. 리뷰 작성 가능 여부 확인 (로그인 상태 확인)
    async canWriteReview() {
        try {
            const response = await api.get('/api/user/session');
            return {
                canWrite: response.data.isLoggedIn,
                user: response.data.isLoggedIn ? {
                    userId: response.data.userId,
                    nickname: response.data.nickname
                } : null,
                message: response.data.isLoggedIn ? null : '리뷰 작성에는 로그인이 필요합니다.'
            };
        } catch (error) {
            return {
                canWrite: false,
                user: null,
                message: '로그인 상태를 확인할 수 없습니다.'
            };
        }
    }

    // 4. 리뷰 개수 조회 (특정 의류수거함)
    async getReviewCount(binId) {
        try {
            const reviews = await this.getReviewsByBinId(binId);
            return reviews.length;
        } catch (error) {
            console.error('리뷰 개수 조회 실패:', error);
            return 0;
        }
    }

    // 5. 최근 리뷰 조회 (최신순 N개)
    async getRecentReviews(binId, limit = 5) {
        try {
            const reviews = await this.getReviewsByBinId(binId);
            // 날짜순으로 정렬 후 제한
            return reviews
                .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                .slice(0, limit);
        } catch (error) {
            console.error('최근 리뷰 조회 실패:', error);
            return [];
        }
    }

    // 에러 처리 헬퍼
    handleError(error) {
        console.error('Review Service Error:', error);

        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    return new Error('리뷰 작성에는 로그인이 필요합니다.');
                case 403:
                    return new Error('리뷰 작성 권한이 없습니다.');
                case 404:
                    return new Error('해당 의류수거함을 찾을 수 없습니다.');
                case 500:
                    return new Error('서버 오류가 발생했습니다.');
                default:
                    return new Error(data || '알 수 없는 오류가 발생했습니다.');
            }
        } else if (error.request) {
            return new Error('네트워크 연결을 확인해주세요.');
        } else {
            return new Error('요청 처리 중 오류가 발생했습니다.');
        }
    }
}

export default new ReviewService();