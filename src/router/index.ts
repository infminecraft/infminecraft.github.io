import { createRouter, createWebHistory } from 'vue-router'
import LandingView from "@/views/LandingView.vue";
import DocumentationView from "@/views/DocumentationView.vue";
import PostsView from "@/views/PostsView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import {supabase} from "@/scripts/client";
import DashboardView from "@/views/DashboardView.vue";
import NotFound404 from "@/views/NotFound404.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocumentationView
    },
    {
      path: '/donate',
      name: 'donate',
      component: LandingView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound404
    }
  ]
})

export default router
