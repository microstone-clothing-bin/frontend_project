// src/services/authService.js
import apiService from './apiService.js'

class AuthService {
    // 회원가입
    async signup(userData) {
        try {
            const response = await apiService.post('/auth/signup', {
                userId: userData.userId,
                password: userData.password,
                nickname: userData.nickname,
                email: userData.email,
                agreeTerms: userData.agreeTerms,
                agreePrivacy: userData.agreePrivacy,
                agreeLocation: userData.agreeLocation,
                agreeAge: userData.agreeAge
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 아이디 중복 확인
    async checkUserIdDuplicate(userId) {
        try {
            const response = await apiService.get(`/auth/check-userid/${userId}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 닉네임 중복 확인
    async checkNicknameDuplicate(nickname) {
        try {
            const response = await apiService.get(`/auth/check-nickname/${nickname}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 이메일 중복 확인 (선택사항)
    async checkEmailDuplicate(email) {
        try {
            const response = await apiService.get(`/auth/check-email/${email}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 로그인
    async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', {
                userId: credentials.userId,
                password: credentials.password
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 아이디 찾기
    async findUserId(userData) {
        try {
            const response = await apiService.post('/auth/find-userid', {
                nickname: userData.nickname,
                email: userData.email
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 비밀번호 찾기 (재설정 이메일 발송)
    async findPassword(userData) {
        try {
            const response = await apiService.post('/auth/find-password', {
                userId: userData.userId,
                email: userData.email
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 비밀번호 재설정
    async resetPassword(resetData) {
        try {
            const response = await apiService.post('/auth/reset-password', {
                token: resetData.token,
                newPassword: resetData.newPassword
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 에러 처리
    handleError(error) {
        if (error.response) {
            // 서버에서 응답을 받았지만 에러 상태코드인 경우
            const { status, data } = error.response

            switch (status) {
                case 400:
                    return new Error(data.message || '잘못된 요청입니다.')
                case 409:
                    return new Error(data.message || '이미 존재하는 정보입니다.')
                case 404:
                    return new Error(data.message || '사용자를 찾을 수 없습니다.')
                case 500:
                    return new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
                default:
                    return new Error(data.message || '알 수 없는 오류가 발생했습니다.')
            }
        } else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못한 경우
            return new Error('네트워크 연결을 확인해주세요.')
        } else {
            // 요청 설정 중 오류가 발생한 경우
            return new Error('요청 처리 중 오류가 발생했습니다.')
        }
    }
}

export default new AuthService()