// src/services/authService.js
import { api } from './apiService.js'

class AuthService {
    // 1. 로그인 - ApiController 경로로 변경
    async login(credentials) {
        try {
            const formData = new URLSearchParams()
            formData.append('id', credentials.userId)
            formData.append('password', credentials.password)

            const response = await api.post('/api/user/login', formData) // 경로 변경

            // JSON 응답 처리
            if (response.status === 200 && response.data.status === 'success') {
                return {
                    success: true,
                    message: response.data.message,
                    user: {
                        userId: response.data.userId,
                        nickname: response.data.nickname
                    }
                }
            } else {
                return {
                    success: false,
                    message: response.data.message || '로그인에 실패했습니다.'
                }
            }
        } catch (error) {
            throw this.handleError(error)
        }
    }


    // 회원가입
    async signup(userData) {
        try {
            const formData = new URLSearchParams()
            formData.append('id', userData.userId)
            formData.append('password', userData.password)
            formData.append('passwordCheck', userData.passwordConfirm)
            formData.append('nickname', userData.nickname)
            formData.append('email', userData.email)

            const response = await api.post('/api/user/register', formData)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

// 2. 로그아웃 - ApiController 경로로 변경
    async logout() {
        try {
            const response = await api.post('/api/user/logout') // 경로 변경
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 3. 마이페이지 정보 조회 - ApiController에 없는 엔드포인트
    async getMyPageInfo() {
        try {
            // 이 엔드포인트는 ApiController에 없으므로 추가 구현 필요
            // 또는 세션 체크로 대체
            const response = await api.get('/api/user/session')
            if (response.data.status === 'success') {
                return {
                    status: 'success',
                    userId: response.data.userId,
                    nickname: response.data.nickname,
                    // email과 profileImageBase64는 별도 API가 필요
                }
            }
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 프로필 이미지 업로드 경로 수정
    async uploadProfile(profileImage) {
        try {
            const formData = new FormData()
            formData.append('profileImage', profileImage)

            const response = await api.post('/api/mypage/uploadProfile', formData) // 경로 수정
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 비밀번호 재설정 경로 수정
    async resetPassword(newPassword) {
        try {
            const formData = new URLSearchParams()
            formData.append('newPassword', newPassword)
            formData.append('newPasswordCheck', newPassword)

            const response = await api.post('/api/mypage/resetPassword', formData) // 경로 수정
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 4. 회원 탈퇴 - 경로 수정
    async deleteAccount() {
        try {
            const response = await api.post('/api/mypage/deleteAccount') // POST로 변경
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 세션 체크도 경로 수정
    async checkAuthStatus() {
        try {
            console.log('checkAuthStatus 호출됨');
            const response = await api.get('/api/user/session'); // 경로 수정
            console.log('세션 체크 응답:', response.data);

            return {
                isAuthenticated: response.data.isLoggedIn,
                user: response.data.isLoggedIn ? {
                    userId: response.data.userId,
                    nickname: response.data.nickname
                } : null
            };
        } catch (error) {
            console.log('세션 체크 에러:', error);
            return { isAuthenticated: false, user: null };
        }
    }

    // 아이디 중복 확인
    async checkUserIdDuplicate(userId) {
        try {
            const response = await api.get(`/api/checkDuplicate?type=id&value=${userId}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 닉네임 중복 확인
    async checkNicknameDuplicate(nickname) {
        try {
            const response = await api.get(`/api/checkDuplicate?type=nickname&value=${nickname}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // Spring Security 로그인 결과 체크 (로그인 성공/실패 판단)
    async verifyLoginSuccess() {
        try {
            // 로그인 후 마이페이지 정보를 가져올 수 있으면 성공
            await this.getMyPageInfo()
            return true
        } catch (error) {
            return false
        }
    }

    // 에러 처리 - Spring Security 환경에 맞게 개선
    handleError(error) {
        console.error('Auth Service Error:', error)

        if (error.response) {
            const { status, data } = error.response

            // Spring Security에서 오는 다양한 응답 형식 처리
            let message
            if (typeof data === 'string') {
                message = data
            } else if (data?.message) {
                message = data.message
            } else if (data?.error) {
                message = data.error
            } else if (data?.status && data?.message) {
                message = data.message
            } else {
                message = '알 수 없는 오류가 발생했습니다.'
            }

            switch (status) {
                case 400:
                    return new Error(message || '잘못된 요청입니다.')
                case 401:
                    return new Error('로그인이 필요합니다.')
                case 403:
                    // Spring Security에서 CSRF나 권한 문제
                    return new Error('접근 권한이 없습니다.')
                case 409:
                    return new Error(message || '중복된 데이터입니다.')
                case 404:
                    return new Error(message || '요청한 리소스를 찾을 수 없습니다.')
                case 500:
                    return new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
                default:
                    return new Error(message)
            }
        } else if (error.request) {
            return new Error('네트워크 연결을 확인해주세요.')
        } else {
            return new Error('요청 처리 중 오류가 발생했습니다.')
        }
    }
}

export default new AuthService()