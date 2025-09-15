<template>
  <div class="screen">
    <div class="frame">
      <div class="content">
        <!-- 글쓰기 버튼 row-->
        <div class="header-row">
          <div class="writing-button" @click="goToWriting('/share-writing')">   <!-- 클릭 시 글쓰기 페이지로 이동 -->
            <div class="button-group">
              <FiRrPencil class="fi-rr-pencil" color="white" />
              <div class="write-post">글 쓰기</div>
            </div>
          </div>
        </div>

        <!-- 상단 툴바 row -->
        <div class="tools-row">
          <div class="count">{{ cardCount }}개</div>   <!-- 게시물 갯수 -->
          <!-- 게시물 정렬 필터 -->
          <div class="filter-wrapper">
            <div class="filter-btn"
                 :class="{ 'filter-active': activeFilter === 'distance', 'filter': activeFilter !== 'distance' }"
                 @click="activeFilter = 'distance'">거리순</div>
            <div class="filter-btn"
                 :class="{ 'filter-active': activeFilter === 'recent', 'filter': activeFilter !== 'recent' }"
                 @click="activeFilter = 'recent'">최신순</div>
          </div>
        </div>

        <!-- 의류 나눔 글 섹션 -->
        <div class="overlap">
          <div v-for="(info, index) in clothsInfo" :key="index" class="card">
            <img class="share-img" :src="info.img" alt="posting img"/>
            <div class="share-title">{{ info.title }}</div>
            <div class="share-location">{{ info.location }}</div>
            <p class="share-distance">내 위치에서 {{ info.distance }} | {{ info.redate }} 전</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FiRrPencil from "@/assets/FiRrPencil.vue";
import router from "@/router/index.js";

export default {
  name: "ShareContent",
  data() {
    return {
      activeFilter: 'distance',
      clothsInfo: [
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-47.svg",
          title: "청바지 나눔합니다.",
          location: "광산구 연산동 1000",    /* 이건 H2 DB 데이터 -> 데이터 명칭 다를 수 있음 */
          distance: "398KM",               /* 이건 H2 DB 데이터 -> 데이터 명칭 다를 수 있음 */
          redate: "19분",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-53.svg",
          title: "티셔츠 가져가세요",
          location: "송파구 잠실동 42-8",
          distance: "23KM",
          redate: "2시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-59.svg",
          title: "검정색 티셔츠",
          location: "안동시 풍천면 갈전리 1161",
          distance: "10M",
          redate: "8시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-48.svg",
          title: "자라 블라우스 나눔 필요하신 분 가져가세요.",
          location: "춘천시 옥천동 111-1",
          distance: "94KM",
          redate: "45분",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-54.svg",
          title: "나이키 신발",
          location: "제주시 이도이동 1176-1",
          distance: "470KM",
          redate: "4시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-60.svg",
          title: "뉴발 빨간색 모자",
          location: "의정부시 민락동 432-5",
          distance: "10M",
          redate: "10시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-49.svg",
          title: "실착 2회 카라티",
          location: "의정부시 가능동 12-8",
          distance: "70M",
          redate: "1시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-55.svg",
          title: "청셔츠",
          location: "전주시 서노송동 568-11",
          distance: "70M",
          redate: "4시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-61.svg",
          title: "원피스 나눔합니다!!",
          location: "평창군 평창읍 중리240",
          distance: "10M",
          redate: "11시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-50.svg",
          title: "항공점퍼",
          location: "파주시 금촌동 64-1",
          distance: "30KM",
          redate: "1시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-56.svg",
          title: "티셔츠 나눔",
          location: "고양시 구교동 34- 9",
          distance: "10M",
          redate: "5시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-62.svg",
          title: "나눔해용",
          location: "의정부시 금오동 34- 9",
          distance: "10M",
          redate: "15시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-51.svg",
          title: "나눔",
          location: "마포구 상수동 330-5",
          distance: "120M",
          redate: "2시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-57.svg",
          title: "청원피스 나눔합니다!",
          location: "원주시 무실동 1",
          distance: "10M",
          redate: "5시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-63.svg",
          title: "체크셔츠",
          location: "의정부시 호원동 324-5",
          distance: "10M",
          redate: "21시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-52.svg",
          title: "흰 티셔츠 나눔이요",
          location: "성동구 성수동2가 300-18",
          distance: "100KM",
          redate: "2시간",
        },
        {
          img: "https://c.animaapp.com/t7PQC0bZ/img/rectangle-58.svg",
          title: "모자 나눔이용",
          location: "의정부시 낙양동 23-7",
          distance: "10M",
          redate: "6시간",
        },
      ]
    }
  },
  computed: {   /* 게시물 개수를 동적으로 계산 */
    cardCount() {
      return this.clothsInfo.length;
    }
  },
  components: {
    FiRrPencil
  },
  methods: {
    goToWriting(path) {
      router.push(path);
    }
  }
};

</script>

<style>
/* 동적 스타일이 필요한 경우만 여기에 */
</style>