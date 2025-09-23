// src/services/authService.js
import { api } from './apiService.js'

class AuthService {
    // 회원가입
    async signup(userData) {
        try {
            const formData = new FormData()
            formData.append('id', userData.userId)
            formData.append('password', userData.password)
            formData.append('passwordCheck', userData.passwordConfirm) // 수정: passwordConfirm 사용
            formData.append('nickname', userData.nickname)
            formData.append('email', userData.email)

            const response = await api.post('/api/user/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 로그인
    async login(credentials) {
        try {
            const formData = new FormData()
            formData.append('id', credentials.userId)
            formData.append('password', credentials.password)


            const response = await api.post('/api/user/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 로그아웃
    async logout() {
        try {
            const response = await api.post('/api/user/logout', {}, {
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
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

    // 프로필 이미지 업로드
    async uploadProfile(profileImage) {
        try {
            const formData = new FormData()
            formData.append('profileImage', profileImage)

            const response = await api.post('/api/mypage/uploadProfile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 비밀번호 재설정
    async resetPassword(newPassword) {
        try {
            const formData = new FormData()
            formData.append('newPassword', newPassword)
            formData.append('newPasswordCheck', newPassword)

            const response = await api.post('/api/mypage/resetPassword', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 회원 탈퇴
    async deleteAccount() {
        try {
            const response = await api.post('/api/mypage/deleteAccount', {}, {
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 에러 처리
    handleError(error) {
        console.error('Auth Service Error:', error)

        if (error.response) {
            const { status, data } = error.response

            // 백엔드에서 단순 문자열로 응답하므로 data 자체가 메시지
            const message = typeof data === 'string' ? data : (data.message || '알 수 없는 오류가 발생했습니다.')

            switch (status) {
                case 400:
                    return new Error(message)
                case 409:
                    return new Error(message)
                case 404:
                    return new Error(message)
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