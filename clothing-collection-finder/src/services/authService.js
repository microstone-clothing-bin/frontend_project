// src/services/authService.js
import apiService from './apiService.js'

class AuthService {
    // 회원가입
    async signup(userData) {
        try {
            const formData = new FormData()
            formData.append('id', userData.userId)
            formData.append('password', userData.password)
            formData.append('passwordCheck', userData.password)
            formData.append('nickname', userData.nickname)
            formData.append('email', userData.email)

            const response = await apiService.post('/api/user/register', formData)
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

            const response = await apiService.post('/api/user/login', formData)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 로그아웃
    async logout() {
        try {
            const response = await apiService.post('/api/user/logout')
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 아이디 중복 확인
    async checkUserIdDuplicate(userId) {
        try {
            const response = await apiService.get(`/api/checkDuplicate?type=id&value=${userId}`)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 닉네임 중복 확인
    async checkNicknameDuplicate(nickname) {
        try {
            const response = await apiService.get(`/api/checkDuplicate?type=nickname&value=${nickname}`)
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

            const response = await apiService.post('/api/mypage/uploadProfile', formData)
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

            const response = await apiService.post('/api/mypage/resetPassword', formData)
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 회원 탈퇴
    async deleteAccount() {
        try {
            const response = await apiService.post('/api/mypage/deleteAccount')
            return response.data
        } catch (error) {
            throw this.handleError(error)
        }
    }

    // 에러 처리
    handleError(error) {
        if (error.response) {
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
                    return new Error(data || '알 수 없는 오류가 발생했습니다.')
            }
        } else if (error.request) {
            return new Error('네트워크 연결을 확인해주세요.')
        } else {
            return new Error('요청 처리 중 오류가 발생했습니다.')
        }
    }
}

export default new AuthService()