import { createRouter, createWebHistory } from 'vue-router'
import LandingView from "@/views/LandingView.vue";
import DocumentationView from "@/views/DocumentationView.vue";
import PostsView from "@/views/PostsView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import {supabase} from "@/scripts/client";
import DashboardView from "@/views/DashboardView.vue";
import NotFound404 from "@/views/NotFound404.vue";
// @ts-ignore
import {useAuthStore} from "@/scripts/authentication/store";
import PostsDashboardView from "@/views/dashboards/PostsDashboardView.vue";
import MainBoardView from "@/views/dashboards/MainBoardView.vue"
import PostPageView from "@/views/PostPageView.vue";
import UserManagementView from "@/views/dashboards/UserManagementView.vue";
import GitHubIssuesView from "@/views/dashboards/GitHubIssuesView.vue";
import GitHubPullRequestsView from "@/views/dashboards/GitHubPullRequestsView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const { state } = useAuthStore();
        if (state.session) {
          next({ name: 'dashboard' }); // Redirect to dashboard if already logged in
        } else {
          next(); // Allow route if not logged in
        }
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: '',
          name: 'mainboard',
          component: MainBoardView,
          props: true
        },
        {
          path: 'posts',
          name: 'posts',
          component: PostsDashboardView,
          props: true
        },
        {
          path: 'users',
          name: 'users',
          component: UserManagementView,
          props: true
        },
        {
          path: 'issues',
          name: 'issues',
          component: GitHubIssuesView,
          props: true
        },
        {
          path: 'pull-requests',
          name: 'pull-requests',
          component: GitHubPullRequestsView,
          props: true
        }
      ]
    },
    {
      path: '/post/:slug',
      component: PostPageView
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound404
    },
    {
      path: '/post/404',
      component: NotFound404
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { state } = useAuthStore();

  // Assuming 'dashboard' route requires authentication
  if (to.name === 'dashboard' && !state.session) {
    // Redirect user to login page
    return next({ name: 'login' });
  }

  next(); // proceed to route
});

export default router
