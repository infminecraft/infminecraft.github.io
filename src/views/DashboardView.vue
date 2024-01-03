<script setup lang="ts">
import { supabase } from '@/scripts/client'
import {type Component, h, onMounted, ref, toRefs} from 'vue'
import {
    NCard,
    NDivider,
    NGradientText, NGrid,
    NIcon,
    NLayout,
    NLayoutContent,
    NLayoutSider,
    NMenu,
    NScrollbar,
    NText,
    useMessage
} from "naive-ui";
import axios from 'axios'
import {RouterLink, useRouter} from "vue-router";
import {Home, PencilSharp, PersonCircle, NewspaperOutline, GitMerge, GitPullRequest } from "@vicons/ionicons5";
import {useSession} from "@/scripts/authentication/auth";
import {useAuthStore} from "@/scripts/authentication/store";
import ContentLoader from "@/views/components/ContentLoader.vue";
// @ts-ignore
import type {Post} from "@/scripts/types";
import PostsDashboardView from "@/views/dashboards/PostsDashboardView.vue";
import Copyrighter from "@/components/Copyrighter.vue";
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import MainBoardView from "@/views/dashboards/MainBoardView.vue";
const $authStore = useAuthStore();
const message = useMessage();
const loading = ref(true); // Initialize loading state

const activeKey = ref('dashboard')

function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const sidebarMenu = [
    {
        label: 'Dashboard 管理面板',
        key: 'dashboard',
        icon: renderIcon(Home)
    },
    {
        key: 'divider-1',
        type: 'divider'
    },
    {
        label: 'Posts 帖子',
        key: 'posts',
        icon: renderIcon(NewspaperOutline)
    },
    {
        label: 'Users 用户',
        key: 'users',
        icon: renderIcon(PersonCircle)
    },
    {
        label: 'Issues 问题',
        key: 'issues',
        icon: renderIcon(GitMerge)
    },
    {
        label: 'Pull Requests 拉取请求',
        key: 'pull-requests',
        icon: renderIcon(GitPullRequest)
    }
]

const githubIssues = ref(), githubPullRequests = ref()
const githubIssueCount = ref(), githubPullReqCount = ref()
const username = ref('')
const users = ref(), userCount = ref()
const website = ref('')
const avatar_url = ref('')
const userPosts = ref<Post[]>([]); // Replace with the appropriate type for your posts
const loadingPosts = ref(false);
const $router = useRouter()
const $fetcher = useDataFetcher()

onMounted(async () => {
    loading.value = true
    let profileData = await $fetcher.getProfile($authStore.state, message)
    username.value = profileData?.username
    website.value = profileData?.website
    avatar_url.value = profileData?.avatar_url
    users.value = await $fetcher.getUsers(message)
    userCount.value = users.value?.length;
    let githubData = await $fetcher.fetchGitHubData(message)
    githubIssues.value = githubData?.issues
    githubPullRequests.value = githubData?.pull_requests
    githubIssueCount.value = githubIssues.value.length
    githubPullReqCount.value = githubPullRequests.value.length
    loading.value = false
})

const handleUpdateValue = (key: string) => {
    activeKey.value = key;
    if(key != 'dashboard') $router.push(`/dashboard/${key}`);
    else $router.push('/dashboard')
}
</script>

<template>
    <ContentLoader :loading="loading">
        <div class="bg-zinc-800 min-h-screen w-full flex">
            <NLayout has-sider class="flex w-full">
                <NLayoutSider has-sider class="h-full"
                              show-trigger="arrow-circle"
                              collapse-mode="width"
                              :collapsed-width="64"
                              :width="240"
                              :native-scrollbar="false">
                    <NMenu :options="sidebarMenu"
                           :collapsed-width="64"
                           :collapsed-icon-size="20"
                           v-model:value="activeKey"
                           :on-update-value="handleUpdateValue"
                    />
                </NLayoutSider>
                <NLayoutContent class="h-full w-full" :native-scrollbar="false">
                    <div class="p-10">
                        <RouterView v-slot="{ Component }">
                            <component :is="Component"
                                       :authStore="$authStore"/>
<!--                            <component :is="PostsDashboardView" :posts="userPosts"/>-->
                        </RouterView>
                    </div>
                    <Copyrighter/>
                </NLayoutContent>
            </NLayout>
        </div>
    </ContentLoader>
</template>

<style scoped>

</style>