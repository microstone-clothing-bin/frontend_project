// src/services/apiService.js 백엔드랑 프론트랑 연결 데이터 가져오기
import axios from 'axios'

// 백엔드 API 기본 URL 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://midserver-url.onrender.com'

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60초 타임아웃
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// 요청 인터셉터 (요청을 보내기 전에 실행)
apiClient.interceptors.request.use(
    (config) => {
        // 요청이 전송되기 전에 수행할 작업
        console.log('API 요청:', config.method?.toUpperCase(), config.url)

        // 인증 토큰이 있다면 헤더에 추가 (나중에 로그인 기능 추가시 사용)
        // const token = localStorage.getItem('authToken')
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }

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
        return response
    },
    (error) => {
        // 응답 오류 처리
        console.error('API 응답 에러:', error.response?.status, error.config?.url)

        if (error.response) {
            // 서버가 응답했지만 에러 상태코드
            const { status, data } = error.response

            switch (status) {
                case 400:
                    console.error('잘못된 요청:', data.message)
                    break
                case 401:
                    console.error('인증 실패:', data.message)
                    // 로그인 페이지로 리다이렉트 (나중에 추가)
                    break
                case 403:
                    console.error('권한 없음:', data.message)
                    break
                case 404:
                    console.error('리소스를 찾을 수 없음:', data.message)
                    break
                case 500:
                    console.error('서버 내부 오류:', data.message)
                    break
                default:
                    console.error('알 수 없는 오류:', data.message)
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
    // GET 요청 - 현재 사용 가능
    get: (url, config = {}) => {
        return apiClient.get(url, config)
    },

    // POST 요청 - 백엔드 미완성으로 주석 처리
    // post: (url, data = {}, config = {}) => {
    //   return apiClient.post(url, data, config)
    // },

    // PUT 요청 - 백엔드 미완성으로 주석 처리
    // put: (url, data = {}, config = {}) => {
    //   return apiClient.put(url, data, config)
    // },

    // DELETE 요청 - 백엔드 미완성으로 주석 처리
    // delete: (url, config = {}) => {
    //   return apiClient.delete(url, config)
    // },

    // PATCH 요청 - 백엔드 미완성으로 주석 처리
    // patch: (url, data = {}, config = {}) => {
    //   return apiClient.patch(url, data, config)
    // }
}

// 개별 함수로도 export - GET만 활성화
export const get = api.get

// 나머지 함수들은 백엔드 완성 후 주석 해제 예정
// export const post = api.post
// export const put = api.put
// export const del = api.delete
// export const patch = api.patch

// axios 인스턴스도 export (고급 사용을 위해)
export default apiClient

/*
=== 주석 처리된 기능들 ===
백엔드에서 아래 API들이 완성되면 주석 해제하여 사용 가능:

1. POST /api/clothing-bins - 새 의류수거함 등록
2. PUT /api/clothing-bins/{id} - 의류수거함 정보 수정
3. DELETE /api/clothing-bins/{id} - 의류수거함 삭제
4. GET /api/clothing-bins/{id} - 특정 의류수거함 조회
5. 기타 나눔, 즐겨찾기, 로그인 관련 API들

현재 사용 가능한 API:
 GET /api/clothing-bins - 모든 의류수거함 목록 조회
*/