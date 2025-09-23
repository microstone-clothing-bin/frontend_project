// src/services/apiService.js 백엔드랑 프론트랑 연결 데이터 가져오기
import axios from 'axios'

// 백엔드 API 기본 URL 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-server-tka2.onrender.com'

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60초 타임아웃
    headers: {
        'Accept': 'application/json'
        // Content-Type은 제거 - FormData 사용시 자동으로 설정됨
    }
})

// 요청 인터셉터 (요청을 보내기 전에 실행)
apiClient.interceptors.request.use(
    (config) => {
        // 요청이 전송되기 전에 수행할 작업
        console.log('API 요청:', config.method?.toUpperCase(), config.url)

        // 인증이 필요한 API만 withCredentials 적용
        if (config.url.includes('/api/user/') ||
            config.url.includes('/api/wish/') ||
            config.url.includes('/api/mypage/') ||
            config.url.includes('/api/clothing-bins/')) {  // 이 줄 추가
            config.withCredentials = true // 쿠키 허용
        }

        // FormData가 아닌 경우에만 JSON Content-Type 설정
        if (!(config.data instanceof FormData) && config.method !== 'get') {
            config.headers['Content-Type'] = 'application/json'
        }

        return config
    },
    (error) => {
        // 요청 오류가 있는 경우
        console.error('요청 에러:', error)
        return Promise.reject(error)
    }
)

// 응답 인터셉터 (응답을 받은 후에 실행)
apiClient.interceptors.response.use(
    (response) => {
        // 성공적인 응답 처리
        console.log('API 응답 성공:', response.status, response.config.url)
        console.log('응답 데이터:', response.data) // 디버깅용
        return response
    },
    (error) => {
        // 응답 오류 처리
        console.error('API 응답 에러:', error.response?.status, error.config?.url)
        console.error('에러 상세:', error.response?.data) // 디버깅용

        if (error.response) {
            // 서버가 응답했지만 에러 상태코드
            const { status, data } = error.response

            switch (status) {
                case 400:
                    console.error('잘못된 요청:', data)
                    break
                case 401:
                    console.error('인증 실패:', data)
                    break
                case 403:
                    console.error('권한 없음:', data)
                    break
                case 404:
                    console.error('리소스를 찾을 수 없음:', data)
                    break
                case 500:
                    console.error('서버 내부 오류:', data)
                    break
                default:
                    console.error('알 수 없는 오류:', data)
            }
        } else if (error.request) {
            // 요청은 보냈지만 응답을 받지 못함
            console.error('네트워크 오류: 서버에 연결할 수 없습니다')
        } else {
            // 요청 설정 중에 오류 발생
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

// 개별 함수로도 export
export const get = api.get
export const post = api.post
export const put = api.put
export const del = api.delete
export const patch = api.patch

// axios 인스턴스도 export (고급 사용을 위해)
export default apiClient