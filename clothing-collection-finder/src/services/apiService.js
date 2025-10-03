// src/services/apiService.js 백엔드랑 프론트랑 연결 데이터 가져오기
import axios from 'axios'

// 백엔드 API 기본 URL 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-json-74js.onrender.com'

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Spring Security 세션 쿠키(JSESSIONID) 자동 포함
    timeout: 60000, // 60초 타임아웃
    headers: {
        'Accept': 'application/json'
    },

})

// 요청 인터셉터 (요청을 보내기 전에 실행)
apiClient.interceptors.request.use(
    (config) => {
        console.log('API 요청:', config.method?.toUpperCase(), config.url)

        // Content-Type 자동 설정 로직
        if (config.data instanceof FormData) {
            // FormData인 경우 브라우저가 자동으로 multipart/form-data로 설정
            delete config.headers['Content-Type']
        } else if (config.data instanceof URLSearchParams) {
            // URLSearchParams인 경우 form-urlencoded로 설정
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        } else if (config.method !== 'get' && config.data) {
            // 일반 객체인 경우 JSON으로 설정
            config.headers['Content-Type'] = 'application/json'
        }

        return config
    },
    (error) => {
        console.error('요청 에러:', error)
        return Promise.reject(error)
    }
)

// 응답 인터셉터 (응답을 받은 후에 실행)
apiClient.interceptors.response.use(
    (response) => {
        console.log('API 응답 성공:', response.status, response.config.url)
        return response
    },
    (error) => {
        console.error('API 응답 에러:', error.response?.status, error.config?.url)
        console.error('에러 상세:', error.response?.data)

        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 400:
                    console.error('잘못된 요청:', data)
                    break
                case 401:
                    console.error('인증 실패 - 로그인이 필요합니다:', data)
                    // Spring Security에서 401은 주로 로그인 실패나 세션 만료
                    if (window.location.pathname !== '/login') {
                        console.warn('세션이 만료되었거나 로그인이 필요합니다.')
                        // 필요시 Vue Router나 상태관리로 로그인 처리
                        // 예: window.dispatchEvent(new CustomEvent('auth-required'))
                    }
                    break
                case 403:
                    console.error('권한 없음:', data)
                    // Spring Security에서 403은 주로 CSRF 토큰 문제나 권한 부족
                    break
                case 404:
                    console.error('리소스를 찾을 수 없음:', data)
                    break
                case 500:
                    console.error('서버 내부 오류:', data)
                    break
                default:
                    console.error('알 수 없는 오류:', status, data)
            }
        } else if (error.request) {
            console.error('네트워크 오류: 서버에 연결할 수 없습니다')
            console.error('요청 상세:', error.request)
        } else {
            console.error('요청 설정 오류:', error.message)
        }

        return Promise.reject(error)
    }
)

// 기본 HTTP 메서드 함수들
export const api = {
    // GET 요청
    get: (url, config = {}) => {
        return apiClient.get(url, config)
    },

    // POST 요청
    post: (url, data = {}, config = {}) => {
        return apiClient.post(url, data, config)
    },

    // PUT 요청
    put: (url, data = {}, config = {}) => {
        return apiClient.put(url, data, config)
    },

    // DELETE 요청
    delete: (url, config = {}) => {
        return apiClient.delete(url, config)
    },

    // PATCH 요청
    patch: (url, data = {}, config = {}) => {
        return apiClient.patch(url, data, config)
    }
}

// 수정된 authApi (세션 체크 제거)
export const authApi = {
    // REST API 로그인 - ApiController 사용
    login: (credentials) => {
        const formData = new URLSearchParams()
        formData.append('id', credentials.userId || credentials.id)
        formData.append('password', credentials.password)
        return api.post('/api/user/login', formData) // 경로 변경
    },

    // REST API 로그아웃 - ApiController 사용
    logout: () => {
        return api.post('/api/user/logout') // 경로 변경
    }

    // 세션 체크 기능 제거 - JSON 데이터로 상태 관리할 예정
}

// 개별 함수로도 export
export const get = api.get
export const post = api.post
export const put = api.put
export const del = api.delete
export const patch = api.patch

// axios 인스턴스도 export (고급 사용을 위해)
export default apiClient