// src/services/naverMapService.js 네이버 지도 연결
class NaverMapService {
    constructor() {
        this.isLoaded = false;
        this.loadPromise = null;
    }

    // 네이버 지도 API 스크립트 동적 로드
    loadNaverMapAPI() {
        if (this.isLoaded) {
            return Promise.resolve();
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise((resolve, reject) => {
            // 이미 로드되었는지 확인
            if (window.naver && window.naver.maps) {
                this.isLoaded = true;
                resolve();
                return;
            }

            // 스크립트 태그 생성
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&submodules=geocoder`;

            script.onload = () => {
                this.isLoaded = true;
                resolve();
            };

            script.onerror = () => {
                reject(new Error('네이버 지도 API 로드 실패'));
            };

            document.head.appendChild(script);
        });

        return this.loadPromise;
    }

    // 지도 생성
    createMap(container, options = {}) {
        const defaultOptions = {
            center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울시청
            zoom: 10,
            mapTypeControl: false
        };

        const mapOptions = { ...defaultOptions, ...options };
        return new window.naver.maps.Map(container, mapOptions);
    }
}

// 싱글톤 인스턴스 생성
const naverMapService = new NaverMapService();
export default naverMapService;