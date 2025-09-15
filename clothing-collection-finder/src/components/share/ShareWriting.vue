<template>
  <div class="posting-wrapper">
    <div class="content-frame">
      <div class="main-container">
        <!-- 사진 업로드 섹션 -->
        <h4 class="photo-upload">사진 등록</h4>
        <button class="photo-button">
          <FiRrCamera
              class="fi-rr-camera-icon"
              fiRrCamera="https://c.animaapp.com/7dVsVbbk/img/fi-rr-camera-1.svg"
          />
          <div class="photo-count">0/10</div>
        </button>

        <!-- 제목 입력 섹션 -->
        <h4 class="posting-title">제목</h4>
        <input
            type="text"
            placeholder="글 제목"
            class="title-input"
        />

        <!-- 설명 입력 섹션 -->
        <h4 class="posting-content">자세한 설명</h4>
        <textarea
            placeholder="나눔할 물품에 대한 게시글 내용을 작성해주세요."
            wrap="hard"
            class="content-input"
        ></textarea>

        <!-- 의류 수거함 위치 섹션 -->
        <h4 class="posting-location">의류수거함 위치</h4>
        <div class="map-section">
          <SmallMap
              ref="mapRef"
              width="100%"
              height="100%"
              @markerClick="onMarkerClick"
          />
          <!-- 현재 위치로 이동 버튼 -->
          <button class="current-location-btn" @click="goToCurrentLocation">
            <FiRrTarget
                class="fi-rr-target-icon"
                fiRrTarget="https://c.animaapp.com/7dVsVbbk/img/fi-rr-target-1.svg"
            />
          </button>
        </div>

        <router-link to="/share-post" class="upload-button">
          <div class="upload">등록</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FiRrCamera from "@/assets/FiRrCamera.vue";
import FiRrTarget from "@/assets/FiRrTarget.vue";
import SmallMap from "@/components/map/SmallMap.vue";

// 지도 참조
const mapRef = ref(null)

// 마커 클릭 이벤트 핸들러
const onMarkerClick = (binData) => {
  console.log("부모에서 마커 클릭 이벤트 받음:", binData)
  // 여기에 DB 저장 로직 추가하면 됨
}

// 현재 위치 버튼 눌렀을 때 SmallMap.vue의 메서드 호출
const goToCurrentLocation = () => {
  if (mapRef.value?.showCurrentLocationWithOptions) {
    mapRef.value.showCurrentLocationWithOptions({ zoom: 16 })
  } else {
    console.warn("지도 컴포넌트 준비 안 됨")
  }
}
</script>

<style scoped>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>