// 라우팅 설정 및 경로 정의
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShareView from '../views/ShareView.vue'
import FavoritesView from "@/views/FavoritesView.vue";
import LoginView from "@/views/LoginView.vue";
import MyPage from "@/views/MyPage.vue";
import SignupView from '../views/SignupView.vue'
import FindIdView from '../views/FindIdView.vue'
import FindPasswordView from '../views/FindPasswordView.vue'
import FindIdNotFoundView from '../views/FindIdNotFoundView.vue'
import FindPasswordNotFoundView from '../views/FindPasswordNotFoundView.vue'
import FindIdSuccessView from '../views/FindIdSuccessView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import SignupTermsView from '../views/SignupTermsView.vue'
import SignupPrivacyView from '../views/SignupPrivacyView.vue'
import SignupLocationView from '../views/SignupLocationView.vue'
import WritingView from "@/views/WritingView.vue";
import PostView from "@/views/PostView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/share',
        name: 'share',
        component: ShareView
    },
    {
        path: '/share-writing',
        name: 'share-writing',
        component: WritingView
    },
    {
        path: '/share-post',
        name: 'share-post',
        component: PostView
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },
    {
      path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignupView
    },
    {
        path: '/signup/terms',
        name: 'signupTerms',
        component: SignupTermsView
    },
    {
        path: '/signup/privacy',
        name: 'SignupPrivacy',
        component: SignupPrivacyView
    },
    {
        path: '/signup/location',
        name: 'SignupLocation',
        component: SignupLocationView
    },
    {
        path: '/find-id',
        name: 'findId',
        component: FindIdView
    },
    {
        path: '/find-password',
        name: 'findPassword',
        component: FindPasswordView
    },
    {
        path: '/find-id/not-found',
        name: 'findIdNotFound',
        component: FindIdNotFoundView
    },
    {
        path: '/find-password/not-found',
        name: 'findPasswordNotFound',
        component: FindPasswordNotFoundView
    },
    {
        path: '/find-id/success',
        name: 'findIdSuccess',
        component: FindIdSuccessView
    },
    {
        path: '/reset-password',
        name: 'resetPassword',
        component: ResetPasswordView
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage
    },
    // 모든 다른 경로를 홈으로 리다이렉트
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router