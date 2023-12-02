import { createRouter, createWebHistory } from 'vue-router'
import LandingView from "@/views/LandingView.vue";
import DocumentationView from "@/views/DocumentationView.vue";
import PostsView from "@/views/PostsView.vue";

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
      path: '/penalties',
      name: 'penalties',
      component: LandingView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView
    }
  ]
})

export default router
