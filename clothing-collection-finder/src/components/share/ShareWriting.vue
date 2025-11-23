<template>
  <div class="posting-wrapper">
    <div class="content-frame">
      <div class="main-container">

        <template v-if="!isEditMode">
          <h4 class="photo-upload-header">사진 등록</h4>
        </template>

        <div v-else class="edit-mode-notice">
          ⚠️ 게시물 수정 시 사진과 의류수거함 위치는 변경할 수 없습니다.
        </div>

        <!-- 사진 첨부 섹션 -->
        <div class="photo-upload-row" :class="{ 'disabled-section': isEditMode }">
          <input
              type="file"
              ref="fileInputRef"
              @change="handleFileChange"
              accept="image/*"
              hidden
              :disabled="isEditMode"
          />
          <button class="photo-button" @click="triggerFileInput" :disabled="isEditMode">
            <FiRrCamera class="fi-rr-camera-icon" color="#6029b7" />
            <div class="photo-count">{{ uploadedFile ? 1 : 0 }} / 1</div>
          </button>
          <!-- 첨부한 이미지 미리보기 (첨부한 이미지 삭제 버튼 포함) -->
          <div class="image-preview-item" v-if="uploadedFile">
            <img :src="uploadedFile.previewUrl" alt="미리보기" />
            <button v-if="!isEditMode" class="delete-image-btn" @click="removeFile">x</button>
          </div>
        </div>

        <h4 class="posting-title">제목</h4>
        <input
            type="text"
            placeholder="글 제목"
            class="title-input"
            v-model="postData.title"
        />

        <h4 class="posting-content">자세한 설명</h4>
        <textarea
            placeholder="나눔할 물품에 대한 게시글 내용을 작성해주세요."
            wrap="hard"
            class="content-input"
            v-model="postData.content"
        ></textarea>

        <h4 class="posting-location">의류수거함 위치</h4>
        <div class="map-section" :class="{ 'disabled-map': isEditMode }">
          <div v-if="isLoading" class="map-loading">위치 정보를 불러오는 중...</div>
          <template v-else>
            <PostMap
                v-if="isEditMode && editMapCenter"
                :center="editMapCenter"
                :zoom="17"
            />

            <SmallMap
                v-else
                ref="mapRef"
                width="100%"
                height="100%"
                @location-selected="onLocationSelected"
            />
          </template>
        </div>
        <div v-if="selectedPostLocation" class="selected-location-info">
          지정 위치 주소 : {{ selectedPostLocation.binId }} ({{ selectedPostLocation.address }})
        </div>
        <div v-else class="selected-location-info-warn">
          지도의 마커를 클릭하여 위치를 지정해주세요.
        </div>

        <button
            class="upload-button"
            @click="submitPost"
            :disabled="isSubmitting"
        >
          <div class="upload">{{ isSubmitting ? '등록 중...' : (isEditMode ? '수정 완료' : '등록') }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import router from "@/router/index.js";
import FiRrCamera from "@/assets/FiRrCamera.vue";
import SmallMap from "@/components/map/SmallMap.vue";
import { boardService } from '@/services/boardService';
import { useAuth } from '@/composables/useAuth';
import { useBoard } from '@/composables/useBoard';
import { useRoute, useRouter } from 'vue-router';
import PostMap from "@/components/map/PostMap.vue";

const { user, isLoggedIn } = useAuth();   // 현재 로그인 사용자 정보 가져옴
const { refreshBoardList } = useBoard();    // 게시판 상태 관리 함수 가져옴

const route = useRoute();
const isEditMode = ref(false); // 수정 모드 상태
const editBoardId = ref(null);

const isLoading = ref(true); // 초기 로딩 상태

const postData = ref({
  title: '',
  content: '',
});

// 파일 업로드 관련
const fileInputRef = ref(null);
const uploadedFile = ref(null);

// 지도 및 위치 관련
const mapRef = ref(null);
const isSubmitting = ref(false);
const selectedPostLocation = ref(null); // binId와 좌표, 주소가 저장되도록 정의
const editMapCenter = ref(null);  // 수정 모드에서 PostMap에 전달할 중심 좌표

const isFormValid = computed(() => {
  return (
      postData.value.title.trim() &&
      postData.value.content.trim() &&
      !!uploadedFile.value &&
      selectedPostLocation.value &&
      selectedPostLocation.value.binId !== null
  );
});

// 파일 업로드 로직
/**
 * photo-button 클릭 시 호출되어 숨겨진 input file을 실행
 * @param {Event} event - 클릭 이벤트 객체
 */
const triggerFileInput = () => {
  // ref를 통해 <input> 엘리먼트에 직접 접근하여 click() 메서드 호출
  fileInputRef.value.click();
};

// 이미지 파일 변경 이벤트 처리 (단일 파일 처리)
const handleFileChange = (event) => {
  const files = event.target.files;

  // 파일 선택이 취소된 경우
  if (!files || files.length === 0) { return; }

  // 여러 파일이 선택된 경우 알림 표시
  if (files.length > 1) {
    alert("이미지는 한장만 첨부 가능합니다.");
  }

  // 첫 번째 이미지 파일만 가져옴
  const file = files[0];

  // 기존 파일이 있으면 미리보기 URL 해제
  if (uploadedFile.value && uploadedFile.value.previewUrl) {
    URL.revokeObjectURL(uploadedFile.value.previewUrl);
  }

  // 새 파일로 상태 업데이트
  const previewUrl = URL.createObjectURL(file);
  uploadedFile.value = { file: file, previewUrl: previewUrl };

  // input 값을 초기화하여 동일한 파일을 다시 선택할 수 있도록 함
  event.target.value = null;
};

// 단일 이미지 삭제
const removeFile = () => {
  if (uploadedFile.value && uploadedFile.value.previewUrl) {
    // 미리보기 URL 해제 (메모리 누수 방지)
    URL.revokeObjectURL(uploadedFile.value.previewUrl);
  }
  // 파일 상태를 null로 초기화
  uploadedFile.value = null;
};

onMounted(async () => {
  isLoading.value = true; // 로딩 시작

  try {
    // 1. 파일 목록 초기화 및 메모리 누수 방지
    if (uploadedFile.value && uploadedFile.value.previewUrl) {
      URL.revokeObjectURL(uploadedFile.value.previewUrl);
    }
    uploadedFile.value = null;

    // 2. DOM 파일 입력 값 초기화 (브라우저 캐시 제거)
    if (fileInputRef.value) {
      fileInputRef.value.value = null;
    }

    // 3. 텍스트 필드 초기화 (v-model로 바인딩된 데이터)
    postData.value.title = '';
    postData.value.content = '';

    // 4. 위치 정보 초기화
    selectedPostLocation.value = null;

    // 'uploadedFile' (단수) 상태를 확인
    console.log("게시글 작성 상태가 초기화되었습니다. 이미지 파일 상태: " + (uploadedFile.value ? '파일 있음' : '파일 없음'));

    // 수정 모드인지 확인
    if (route.query.edit === 'true' && route.query.id) {
      isEditMode.value = true;
      editBoardId.value = route.query.id;
      await loadPostForEdit(editBoardId.value);
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false; // 로딩 종료 후 지도 렌더링 시작
  }
});

// 수정모드에서 수정할 데이터 불러오기
const loadPostForEdit = async (boardId) => {
  try {
    const post = await boardService.getBoardById(boardId);
    // 기존 데이터 바인딩
    postData.value.title = post.title;
    postData.value.content = post.content;

    // 기존 이미지 미리보기를 위해 uploadedFile 상태 설정
    if (post.imageUrl) {
      uploadedFile.value = {
        file: null,
        previewUrl: post.imageUrl // 기존 이미지 URL을 미리보기로 사용
      };
    }

    // 위치 정보 바인딩
    selectedPostLocation.value = {
      binId: post.binId,
      latitude: post.latitude,
      longitude: post.longitude,
      address: post.roadAddress
    };

    // PostMap에 전달할 중심 좌표 설정
    if (post.latitude && post.longitude) {
      editMapCenter.value = {
        lat: post.latitude,
        lng: post.longitude
      };
    }

  } catch (error) {
    alert("게시글 정보를 불러오지 못했습니다.");
    router.back();
  }
};

// 위치 선택 이벤트 핸들러 (SmallMap의 'location-selected'(마커 선택) 이벤트 수신)
const onLocationSelected = (locationData) => {
  // SmallMap에서 받아온 binData가 id가 String일 수 있으므로 Number로 변환하여 저장
  selectedPostLocation.value = {
    binId: locationData.binId ? Number(locationData.binId) : null,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    address: locationData.address
  };

};

// 3. 게시물 등록 로직 (로그인 정보 사용 및 서버 전송) - 등록 버튼 클릭 시 호출
const submitPost = async () => {
  // 로그인 상태 확인
  if (!isLoggedIn.value || !user.value?.userId) {
    // 실제로는 로그인 페이지로 리다이렉트가 필요할 수 있음
    return alert("게시글을 작성하려면 로그인이 필요합니다.");
  }

  // 유효성 검사 : 입력 안된 정보 있을 시에 알림 띄움.
  if (!postData.value.title.trim()) {
    return alert("제목을 입력해주세요.");
  }
  if (!postData.value.content.trim()) {
    return alert("내용을 입력해주세요.");
  }
  // 사진 유효성 검사는 수정 모드가 아닐 때만 수행
  if (!isEditMode.value && !uploadedFile.value) {
    return alert("사진을 1장 첨부해주세요.");
  }
  // 위치 지정 유효성 검사
  if (!selectedPostLocation.value || selectedPostLocation.value.binId === null) {
    return alert("의류수거함 위치를 지도에서 지정해주세요.");
  }



  isSubmitting.value = true;

  try {
    if (isEditMode.value) {
      // [수정 로직]
      const updateData = {
        title: postData.value.title,
        content: postData.value.content,
        userId: user.value.userId // 본인 확인용
      };
      await boardService.updateBoard(editBoardId.value, updateData);
      alert("게시물이 수정되었습니다!");
    } else {
      // [등록 로직]
      const formData = new FormData();

      // 텍스트 정보 추가
      formData.append('title', postData.value.title);
      formData.append('content', postData.value.content);

      // 로그인 사용자 정보 추가
      formData.append('userId', user.value.userId);
      formData.append('nickname', user.value.nickname);

      // 위치 정보 (binId) 추가
      formData.append('binId', selectedPostLocation.value.binId);

      // 이미지 파일 추가 - 단일 파일 전송
      if (uploadedFile.value) {
        formData.append('image', uploadedFile.value.file);
      }

      await boardService.createBoard(formData);
      alert("게시물이 성공적으로 등록되었습니다!");
    }

    await refreshBoardList();   // Store에 저장된 목록을 새로고침하도록 요청
    router.push('/share'); // 성공 후 게시판 목록 페이지로 이동

  } catch (error) {
    console.error("게시물 등록 실패 (catch 블록):", error.response || error.message || error);
    alert(`게시물 등록에 실패했습니다: ${error.response?.data?.message || error.message}`);  // 서버에서 던진 에러 메시지를 사용자에게 표시
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
.map-section {
  position: relative;
  width: 49.43vw;
  height: 20.83vw;
  border-radius: 0.78vw;
  overflow: hidden;
}

.selected-location-info {
  font-family: "Pretendard-Bold", Helvetica, sans-serif;
  font-size: 0.89vw;  /* 17px */
  font-weight: 500;
  color: #008000;
  margin-top: 0.7vw;
  margin-bottom: 2vw;
}

.selected-location-info-warn {
  font-family: "Pretendard-Medium", Helvetica, sans-serif;
  font-size: 0.89vw;  /* 17px */
  font-weight: 500;
  color: #5389f5;
  margin-top: 0.7vw;
  margin-bottom: 2vw;
}

.edit-mode-notice {
  padding: 15px;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}
.disabled-map {
  pointer-events: none; /* 수정모드에서 지도 조작 막음 */
  opacity: 0.7;
}

/* 수정 모드일 때 사진 업로드 영역 비활성화 */
.disabled-section {
  opacity: 0.6;
  pointer-events: none; /* 클릭 방지 */
}
</style>