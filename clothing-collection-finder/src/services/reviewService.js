// src/services/reviewService.js
import { api } from './apiService.js'

class ReviewService {

    // 현재 로그인한 사용자 정보 가져오기
    getCurrentUser() {
        try {
            const savedUser = localStorage.getItem('auth_user')
            const isLoggedIn = localStorage.getItem('auth_isLoggedIn')

            if (savedUser && isLoggedIn === 'true') {
                return JSON.parse(savedUser)
            }
            return null
        } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error)
            return null
        }
    }

    // 1. 특정 의류수거함의 리뷰 목록 조회
    async getReviewsByBinId(binId) {
        try {
            const response = await api.get(`/api/markers/${binId}/posts`)

            // ✅ 백엔드 응답 구조에 맞게 매핑 수정
            return response.data.map(review => ({
                id: review.postId,
                content: review.content,
                nickname: review.authorNickname,  // ✅ authorNickname으로 수정!
                userId: review.userId,
                createDate: review.createdAt,
                imageUrl: review.imageUrl,
                binId: binId  // binId는 파라미터에서 가져옴
            }))
        } catch (error) {
            console.error('리뷰 목록 조회 실패:', error)
            throw this.handleError(error)
        }
    }

    // 2. 특정 의류수거함에 리뷰 작성
    async createReview(binId, content, imageFile = null) {
        try {
            const user = this.getCurrentUser()
            if (!user || !user.userId) {
                throw new Error('로그인이 필요합니다.')
            }

            const formData = new FormData()
            formData.append('content', content)
            formData.append('userId', user.userId) // ✅ userId 추가

            if (imageFile) {
                formData.append('image', imageFile)
            }

            const response = await api.post(`/api/markers/${binId}/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            return {
                success: true,
                message: response.data.message || '리뷰가 성공적으로 등록되었습니다.'
            }
        } catch (error) {
            console.error('리뷰 작성 실패:', error)
            throw this.handleError(error)
        }
    }

    // 3. 리뷰 작성 가능 여부 확인
    canWriteReview() {
        const user = this.getCurrentUser()

        if (user && user.userId) {
            return {
                canWrite: true,
                user: {
                    userId: user.userId,
                    nickname: user.nickname
                },
                message: null
            }
        }

        return {
            canWrite: false,
            user: null,
            message: '리뷰 작성에는 로그인이 필요합니다.'
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
        console.error('Review Service Error:', error)

        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 401:
                    return new Error('리뷰 작성에는 로그인이 필요합니다.')
                case 403:
                    return new Error('리뷰 작성 권한이 없습니다.')
                case 404:
                    return new Error('해당 의류수거함을 찾을 수 없습니다.')
                case 500:
                    return new Error('서버 오류가 발생했습니다.')
                default:
                    return new Error(data?.message || '알 수 없는 오류가 발생했습니다.')
            }
        } else if (error.request) {
            return new Error('네트워크 연결을 확인해주세요.')
        } else {
            return new Error('요청 처리 중 오류가 발생했습니다.')
        }
    }
}

export default new ReviewService()