// src/services/authService.js
import { api } from './apiService.js'

// ✅ class 밖으로 이동
const getCurrentUserId = () => {
    try {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            return user.userId
        }
    } catch (error) {
        console.error('사용자 ID 가져오기 실패:', error)
    }
    return null
}

class AuthService {
    // 1. 로그인 - ApiController 경로로 변경
    async login(credentials) {
        try {
            // ✅ 수정: JSON 형식으로 전송
            const requestData = {
                id: credentials.userId,
                password: credentials.password
            }

            const response = await api.post('/api/user/login', requestData)

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
            // ✅ 수정: JSON 형식으로 전송
            const requestData = {
                id: userData.userId,
                password: userData.password,
                passwordCheck: userData.passwordConfirm,
                nickname: userData.nickname,
                email: userData.email
            }

            const response = await api.post('/api/user/register', requestData)
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

    // ✅ 신규 추가: 아이디 찾기
    async findUserId(nickname, email) {
        try {
            const requestData = {
                nickname: nickname,
                email: email
            }

            const response = await api.post('/api/user/find-id', requestData)
            return response.data  // { status: 'success', userId: '찾은아이디' }
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // ✅ 신규 추가: 비밀번호 찾기 (사용자 확인)
    async findPassword(userId, email) {
        try {
            const requestData = {
                userId: userId,
                email: email
            }

            const response = await api.post('/api/user/find-password', requestData)
            return response.data  // { status: 'success', message: '사용자 확인 완료' }
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // ✅ 신규 추가: 비밀번호 재설정 (비밀번호 찾기용)
    async resetPasswordWithoutLogin(userId, email, newPassword) {
        try {
            const requestData = {
                userId: userId,
                email: email,
                newPassword: newPassword
            }

            const response = await api.post('/api/user/reset-password', requestData)
            return response.data  // { status: 'success', message: '비밀번호가 변경되었습니다.' }
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // ✅ 여기에 추가!
    async getMyPageInfo() {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await api.get(`/api/mypage/info?userId=${userId}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 프로필 이미지 업로드
    async uploadProfile(profileImage) {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            const formData = new FormData()
            formData.append('profileImage', profileImage)
            formData.append('userId', userId)  // ✅ userId 추가

            const response = await api.post('/api/mypage/uploadProfile', formData)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 비밀번호 재설정
    async resetPassword(newPassword) {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            // ✅ JSON 형식으로 전송 + userId 쿼리 파라미터
            const requestData = {
                newPassword: newPassword,
                newPasswordCheck: newPassword
            }

            const response = await api.post(`/api/mypage/resetPassword?userId=${userId}`, requestData)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 회원 탈퇴
    async deleteAccount() {
        try {
            const userId = getCurrentUserId()
            if (!userId) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await api.post(`/api/mypage/deleteAccount?userId=${userId}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 아이디 중복 확인
    async checkUserIdDuplicate(userId) {
        try {
            const response = await api.get(`/api/user/check-id?id=${userId}`)
            return response.data  // { isDuplicate: true/false }
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 닉네임 중복 확인
    async checkNicknameDuplicate(nickname) {
        try {
            const response = await api.get(`/api/user/check-nickname?nickname=${nickname}`)
            return response.data  // { isDuplicate: true/false }
        } catch (error) {
            throw this.handleError(error)
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