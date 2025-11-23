<!-- 게시물 상세 페이지 -->

<template>
  <div class="posting-page-wrapper">
    <div class="posting-frame">

      <div v-if="isLoading" class="loading-message">게시물을 불러오는 중입니다...</div>   <!-- 로딩/에러 메세지 표시 여부 결정 -->
      <div v-if="error" class="error-message">{{ error }}</div>

      <template v-if="post && !isLoading && !error">  <!-- 본문 내용 렌더링(표시) 여부 결정 -->

        <!-- 게시물 상세 내용 -->
        <div class="post-wrapper">
          <!-- 좌측 -->
          <div class="post-left">
            <img
                class="clothes-img"
                alt="clothes image"
                :src="post.imageUrl || defaultClothesImage"
            />
            <div class="user-meta">
              <img
                  class="user-photo"
                  alt="user photo"
                  :src="post.profileImageUrl || defaultUserImage"
              />
              <div class="nickname">{{ post.nickname }}</div>
            </div>
          </div>

          <div></div>   <!-- post-wrapper 내부 비어있는 간격 영역 -->

          <!-- 우측 -->
          <div class="post-right">
            <div class="post-header-row">
              <div class="post-title">{{ post.title }}</div>
              <!-- 게시물 수정, 삭제 메뉴 -->
              <div v-if="isAuthor" class="more-options-container">
                <button class="more-btn" @click="toggleOptions">
                  <img src="@/assets/images/more-vertical.png" alt="더보기" />
                </button>

                <div v-if="showOptions" class="options-menu">
                  <div class="option-item" @click="editPost">수정하기</div>
                  <div class="option-item delete" @click="deletePost">삭제하기</div>
                </div>
              </div>
            </div>
            <p class="post-timeline">{{ timelineInfo }}</p>
            <p class="post-content">
              {{ post.content }}
            </p>
            <div class="location-row">  <!-- 마커 주소 -->
              <img class = "location-marker" src="@/assets/images/sidebar-map-marker.png" alt="현재위치" />
              <div class="post-location">{{ post.roadAddress }}</div>
            </div>
            <!-- 지도 영역 -->
            <div class="map-wrapper">
              <PostMap
                  v-if="dbCenter"
                  :center="dbCenter"
                  :zoom="17"
              />
            </div>
          </div>
        </div>

        <!-- 다른 나눔 리스트 -->
        <div class="other-post-header">
          <div class="other-post-view">다른 나눔 보기</div>
          <div class="learn-more" @click="goToBoardList">
            더 구경하기 &gt
          </div>
        </div>
        <!-- 다른 나눔 리스트 -->
        <div class="other-post-list">
          <div v-for="info in filteredOtherPosts" :key="info.boardId" class="rectangle" @click="goToDetail(info.boardId)">
            <img
                class="other-post-img"
                alt="other post img"
                :src="info.imageUrl || defaultPostImage"
            />
            <div class="other-post-title">{{info.title}}</div>
            <div class="other-post-location">{{info.roadAddress}}</div>
            <p class="other-post-timeline">내 위치에서 {{ info.distance }} | {{info.redate}}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import PostMap from "@/components/map/PostMap.vue";
import { boardService } from '@/services/boardService'; // 서버 호출용 서비스
import { useBoard } from '@/composables/useBoard'; // 다른 글 목록용
import { useCoordinates } from '@/composables/currentlocation/useCoordinates';
import { useDistanceCalculator } from '@/composables/currentlocation/useDistanceCalculator';
import naverMapService from '@/services/naverMapService';

import defaultClothesImage from '@/assets/images/clothes-default.png';
import defaultUserImage from '@/assets/images/clothing-bin-group.png';
import defaultPostImage from '@/assets/images/post-img-default.png';

// 1. 라우터 및 상태 관리
const { user } = useAuth();
const route = useRoute();
const router = useRouter();
const { boards, fetchBoards } = useBoard(); // Store에서 게시물 목록 가져오기
const { currentCoords, getCurrentPosition } = useCoordinates(); // 현재 위치 좌표
const { calculateDistance, formatDistance } = useDistanceCalculator(); // 거리 계산 함수

const showOptions = ref(false); // 메뉴 토글 상태

// 메뉴 토글 함수
const toggleOptions = () => {
  showOptions.value = !showOptions.value;
};

// 2. 컴포넌트 상태 (ref)
const post = ref(null); // 게시물 상세 데이터
const isLoading = ref(true);
const error = ref(null);

// 3. 데이터 로딩 로직을 별도 함수로 분리
const loadPost = async (boardId) => {
  isLoading.value = true;
  error.value = null;

  try {
    if (!boardId) {
      throw new Error('게시물 ID를 찾을 수 없습니다.');
    }

    // API 로드 보장 (지도 및 거리 계산을 위해)
    await naverMapService.loadNaverMapAPI();
    await getCurrentPosition(); // 현재 위치 미리 가져오기

    // 1. 상세 게시물 데이터 가져오기
    const postData = await boardService.getBoardById(boardId);
    post.value = postData;

    // 2. 다른 나눔 리스트 가져오기 (Store 활용)
    if (boards.value.length === 0) {
      await fetchBoards();
    }

  } catch (err) {
    error.value = err.message || '게시물을 불러오는 데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// onMounted에서는 loadPost 함수를 호출만 함
onMounted(() => {
  const boardId = route.query.id || route.params.id;
  loadPost(boardId);
});

// URL 쿼리의 id 값이 변경될 때마다 loadPost 함수를 다시 호출 - 다른 게시물 페이지로 이동할 때 사용
watch(
    () => route.query.id,
    (newId) => {
      if (newId) {
        // 새 ID로 데이터를 다시 불러옴
        loadPost(newId);
        // 페이지 상단으로 스크롤을 이동시킴
        window.scrollTo(0, 0);
      }
    }
);

// 지도 중심 좌표 지정 Computed
const dbCenter = computed(() => { // PostMap에 전달할 중심 좌표
  if (post.value && post.value.latitude && post.value.longitude) {
    return {
      lat: post.value.latitude,
      lng: post.value.longitude
    };
  }
  return null;
});

// 작성자 본인 확인 로직
const isAuthor = computed(() => {
  // 1. 게시물 데이터가 로딩되었는지 확인
  // 2. 로그인한 상태인지(user.value가 있는지) 확인
  // 3. 로그인한 사람의 ID와 게시물 작성자의 ID가 같은지 비교
  if (post.value && user.value) {
    // 문자열/숫자 타입 불일치를 방지하기 위해 String 변환 후 비교하거나 Number로 맞춰줌.
    return Number(post.value.userId) === Number(user.value.userId);
  }
  return false;
});

// 수정 페이지로 이동
const editPost = () => {
  router.push({
    name: 'share-writing',
    query: {
      id: post.value.boardId,
      edit: 'true' // 수정 모드 플래그
    }
  });
};

// 게시물 삭제
const deletePost = async () => {
  if (!confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

  try {
    await boardService.deleteBoard(post.value.boardId, user.value.userId);
    alert("게시물이 삭제되었습니다.");
    router.push('/share'); // 목록으로 이동
  } catch (err) {
    alert("삭제에 실패했습니다.");
  }
};

// 작성 시간 계산 함수
const timeSince = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}년 전`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}개월 전`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}일 전`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}시간 전`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}분 전`;
  return `${Math.floor(seconds)}초 전`;
};

// 거리 계산 함수
const getDistanceText = (board) => {
  if (!currentCoords.value || !board.latitude || !board.longitude) {
    return '위치 미설정';
  }
  try {
    const meters = calculateDistance(
        currentCoords.value.lat,
        currentCoords.value.lng,
        board.latitude,
        board.longitude
    );
    return formatDistance(meters);
  } catch (e) {
    return '계산 오류';
  }
};

// 메인 게시물의 타임라인 정보
const timelineInfo = computed(() => {
  if (!post.value) return '';
  const distance = getDistanceText(post.value);
  const time = timeSince(post.value.redate);
  return `내 위치에서 ${distance} | ${time}`;
});

// 다른 나눔 리스트
const filteredOtherPosts = computed(() => {
  if (!boards.value || !post.value) return [];

  return boards.value
      .filter(b => b.boardId !== post.value.boardId) // 현재 게시물 제외
      .slice(0, 10) // 최대 10개
      .map(otherPost => ({
        ...otherPost,
        distance: getDistanceText(otherPost), // 거리 계산
        redate: timeSince(otherPost.redate), // 시간 계산
        roadAddress: otherPost.roadAddress || '위치 미지정'
      }));
});

// 5. 네비게이션 함수
const goToBoardList = () => {
  router.push('/share');
};

const goToDetail = (boardId) => {
  router.push({ name: 'share-post', query: { id: boardId } });
};

</script>

<style scoped>
/* 동적 스타일이 필요한 경우만 여기에 */

.post-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.more-options-container {
  position: relative;
}

.more-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.26vw;    /* 5px */
}

.more-btn img {
  width: 1.25vw;    /* 24px */
  height: 1.25vw;    /* 24px */
}

.options-menu {
  position: absolute;
  right: 0.68vw;
  top: 1.56vw;      /* 30px */
  background: white;
  border: 0.05vw solid #eee;    /* 1px */
  border-radius: 0.42vw;           /* 8px */
  box-shadow: 0 0.10vw 0.52vw rgba(0,0,0,0.1);  /* 2px 10px */
  height: 4.95vw;    /* 95px */
  width: 5.21vw;    /* 100px */
  z-index: 100;
  overflow: hidden;
}

.option-item {
  padding: 0.52vw 0.89vw;   /* 10px 17px */
  font-size: 0.89vw;        /* 17px */
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-item.delete {
  color: #e74c3c; /* 삭제 버튼 빨간색 */
}
</style>