<template>
  <nav class="navigation-bar">
    <!-- 로고 영역 -->
    <div class="nav-brand">
      <a href="/" to="/" class="brand-link">
        <img src="@/assets/images/logo.png" alt="DropIt Logo" class="brand-logo" />
        <img src="@/assets/images/dropit.png" alt="DropIt Text" class="brand-text-img" />
      </a>
    </div>

    <!-- 메뉴 영역 -->
    <div class="nav-menu">
      <router-link to="/" class="nav-item">의류수거함</router-link>
      <router-link to="/share" class="nav-item">나눔</router-link>
      <router-link to="/favorites" class="nav-item">즐겨찾기</router-link>
    </div>

    <!-- 사용자 메뉴 영역 - 로그인 상태에 따라 변경 -->
    <div class="nav-user">
      <!-- 로그인 안된 상태 -->
      <template v-if="!authStore.isLoggedIn">
        <router-link to="/login" class="nav-item">로그인</router-link>
        <router-link to="/signup" class="nav-item">회원가입</router-link>
      </template>

      <!-- 로그인된 상태 -->
      <template v-else>
        <router-link to="/mypage" class="nav-item">마이페이지</router-link>
        <button @click="handleLogout" class="nav-item nav-logout-btn">로그아웃</button>
      </template>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default {
  name: 'NavigationBar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      try {
        await authStore.logout()
        // 로그아웃 후 홈페이지로 이동
        router.push('/')
      } catch (error) {
        console.error('로그아웃 실패:', error)
      }
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 2px;
}

.brand-logo {
  height: 40px;
  width: 40px;
  padding: 8px;
  margin-bottom: 6px;
  object-fit: contain;
  box-sizing: border-box;
}

.brand-text-img {
  height: 32px;
  width: auto;
  object-fit: contain;
  margin-top: 5px;
}

/* 새 스타일 추가 */
.nav-user-welcome {
  color: #333;
  font-weight: 500;
  margin-right: 10px;
}

.nav-logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  color: inherit;
  text-decoration: none;
}

.nav-logout-btn:hover {
  color: #007bff; /* 다른 nav-item과 동일한 호버 효과 */
}

/* 반응형 처리 */
@media (max-width: 768px) {
  .brand-logo {
    height: 32px;
    width: 32px;
    padding: 6px;
  }

  .brand-text-img {
    height: 24px;
  }

  .nav-user-welcome {
    font-size: 14px;
  }
}
</style>