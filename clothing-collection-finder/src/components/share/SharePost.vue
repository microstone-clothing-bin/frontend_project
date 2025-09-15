<!-- 작성된 나눔 글 페이지 -->

<template>
  <div class="posting-page-wrapper">
    <div class="posting-frame">
      <!-- 게시물 상세내용 -->
      <div class="post-wrapper">
        <!-- 좌측 -->
        <div class="post-left">
          <img
              class="clothes-img"
              alt="clothes image"
              src="https://c.animaapp.com/mWfNph5Y/img/mask-group.png"
          />
          <div class="user-meta">
            <img
                class="user-photo"
                alt="user photo"
                src="https://c.animaapp.com/mWfNph5Y/img/ellipse-7.svg"
            />
            <div class="nickname">user nickname1</div>
          </div>
        </div>
        <div></div>   <!-- post-wrapper 내부 비어있는 간격 영역 -->
        <!-- 우측 -->
        <div class="post-right">
          <div class="post-title">청원피스 나눔합니다!</div>
          <p class="post-timeline">내 위치에서 10M | 5시간 전</p>
          <p class="post-content">
            옷정리 하면서 안입는 옷들 나눔합니다.<br>
            의류수거함 옆 나이키 쇼핑백 안에 넣어두었습니다.<br>
            착용샷 없어서 모델 이미지 첨부합니다!<br>
          </p>
          <div class="location-row">
            <FiRsMarker_2
                class="fi-rs-marker-icon"
                fiRsMarker="https://c.animaapp.com/mWfNph5Y/img/fi-rs-marker-1.svg"
            />
            <div class="post-location">경기도 의정부시 호원동 324-5</div>
          </div>
          <div class="map-wrapper">
            <SmallMap
                :center="dbCenter"
                :zoom="16"
            />
          </div>
        </div>
      </div>

      <!-- 다른 나눔 리스트 -->
      <div class="other-post-view">다른 나눔 보기</div>
      <div class="other-post-list">
        <div v-for="(info, index) in clothsInfo" :key="index" class="rectangle">
          <img
              class="other-post-img"
              alt="other post img"
              :src="info.img"
          />
          <div class="other-post-title">{{info.title}}</div>
          <div class="other-post-location">{{info.location}}</div>    <!-- h2 연결 데이터 명 확인할 것 (변경 할 수 있음) -->
          <p class="other-post-timeline">내 위치에서 {{info.distance}}M | {{info.redate}} 전</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FiRsMarker_2 from "@/assets/FiRsMarker_2.vue";
import SmallMap from "@/components/map/SmallMap.vue";

export default defineComponent({
  name: "SharePost",
  data() {
    return {
      clothsInfo: [
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-47.svg",
          title: "청바지 나눔합니다.",
          location: "의정부시 호원동 486-1", /* 이건 H2 DB 데이터 -> 데이터 명칭 다를 수 있음 */
          distance: "10",                 /* 이건 H2 DB 데이터 -> 데이터 명칭 다를 수 있음 */
          redate: "19분",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-53.svg",
          title: "티셔츠 가져가세요",
          location: "의정부시 호원동 486-1",
          distance: "30",
          redate: "45분",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-48.svg",
          title: "자라 블라우스 나눔 필요하신 분 가져가세요.",
          location: "의정부시 민락동 432-5",
          distance: "70",
          redate: "1시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-54.svg",
          title: "나이키 신발",
          location: "의정부시 민락동 432-5",
          distance: "100",
          redate: "1시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-49.svg",
          title: "실착 2회 카라티",
          location: "의정부시 가능동 12-8",
          distance: "120",
          redate: "2시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-55.svg",
          title: "청셔츠",
          location: "의정부시 가능동 12-8",
          distance: "10",
          redate: "2시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-50.svg",
          title: "항공점퍼",
          location: "의정부시 금오동 34- 9",
          distance: "30",
          redate: "4시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-56.svg",
          title: "티셔츠 나눔",
          location: "의정부시 금오동 34- 9",
          distance: "70",
          redate: "4시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-51.svg",
          title: "나눔",
          location: "의정부시 호원동 324-5",
          distance: "10",
          redate: "5시간",
        },
        {
          img: "https://c.animaapp.com/mWfNph5Y/img/rectangle-57.svg",
          title: "청원피스 나눔합니다!",
          location: "의정부시 호원동 324-5",
          distance: "10",
          redate: "5시간",
        },
      ]
    };
  },
  components: {
    SmallMap,
    FiRsMarker_2
  }
});
</script>

<style>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>