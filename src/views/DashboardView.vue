<script setup lang="ts">
import {supabase} from '@/scripts/client'
import {type Component, h, onMounted, ref, toRefs, toRef} from 'vue'
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
import {RouterLink, useRouter, useRoute} from "vue-router";
import {Home, PencilSharp, PersonCircle, NewspaperOutline, GitMerge, GitPullRequest} from "@vicons/ionicons5";
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
const $route = useRoute()

const activeKey = ref('');

function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)})
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

const $router = useRouter()
const sidebarCollapsed = ref(true)

const handleUpdateValue = (key: string) => {
    activeKey.value = key;
    if (key != 'dashboard') $router.push(`/dashboard/${key}`);
    else $router.push('/dashboard')
}
</script>

<template>
    <div>
        <div class="bg-zinc-800 min-h-screen w-full flex">
            <NLayout has-sider class="flex w-full">
                <NLayoutSider has-sider class="h-full"
                              show-trigger="arrow-circle"
                              collapse-mode="width"
                              :collapsed-width="64"
                              :width="240"
                              :native-scrollbar="false"
                              v-model:collapsed="sidebarCollapsed"
                >
                    <div class="flex flex-col py-2 gap-2">
                        <div class="items-center justify-center text-center flex flex-row cursor-pointer" @click="$router.push('/')">
                            <NCollapseTransition :show="!sidebarCollapsed" class="w-fit">
                                <NGradientText class="font-bold text-2xl">InfMinecraft</NGradientText>
                            </NCollapseTransition>
                            <div class="object-contain">
                                <img width="44" src="../../public/infmc-icon.png">
                            </div>
                        </div>
                        <NMenu :options="sidebarMenu"
                               :collapsed-width="64"
                               :collapsed-icon-size="20"
                               v-model:value="activeKey"
                               :on-update-value="handleUpdateValue"
                        />
                    </div>
                </NLayoutSider>
                <NLayoutContent class="h-full w-full" :native-scrollbar="false">
                    <div class="p-10">
                        <RouterView v-slot="{ Component }">
                            <component :is="Component" :authStore="$authStore"/>
                        </RouterView>
                    </div>
                    <Copyrighter/>
                </NLayoutContent>
            </NLayout>
        </div>
    </div>
</template>

<style scoped>

</style>