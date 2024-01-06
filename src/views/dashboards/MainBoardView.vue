<script setup lang="ts">

import {NAvatar, NCard, NDivider, NIcon, NSkeleton, useMessage} from "naive-ui";
import {useRouter} from "vue-router"; // Add vue-router
import {onMounted, ref} from 'vue'
import {GitMerge, GitPullRequest, NewspaperOutline, PersonCircle} from "@vicons/ionicons5";
import {useAuthStore} from "@/scripts/authentication/store";
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import {useDashboardStore} from "@/scripts/utility/dashboard/dashboardStore";
import type {Post, User} from "@/scripts/types";
import {supabase} from "@/scripts/client";

const props = defineProps({
    authStore: Object
})
const $router = useRouter(); // Get router instance
const $fetcher = useDataFetcher();
const $message = useMessage();
const $dashboardStore = useDashboardStore();
const loadingPage = ref(false)
const user = ref<User | null>()
const posts = ref<any[]>([])
const users = ref<User[] | null>([])
const githubData = ref<{ issues: any, pull_requests: any } | null>()

const navigate = (path: any) => {
    $router.push('/dashboard/' + path); // router navigation logic
};

const channel = supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        async (payload) => {
            console.log('Change received!', payload)
            await $dashboardStore.fetchPosts(props.authStore?.state, $message, true)
        }
    )
    .subscribe()

onMounted(async () => {
    loadingPage.value = true;

    user.value = await $dashboardStore.fetchUser(props.authStore?.state, $message)
    users.value = await $dashboardStore.fetchUsers($message)
    let tempPosts: Post[] = await $dashboardStore.fetchPosts(props.authStore?.state, $message)
    for (let i = 0; i < tempPosts.length; i++)
        if (tempPosts[i].author_id == user.value?.id) posts.value.push(tempPosts[i])
    githubData.value = await $fetcher.fetchGitHubData($message)

    loadingPage.value = false;
    console.log("loaded")
})
</script>

<template>
    <div class="gap-2 justify-items-start" v-if="!loadingPage">
        <div class="flex items-center gap-3">
            <div class="font-bold text-4xl">Hello, {{ user?.username }}</div>
            <NAvatar round :src="user?.avatar_url" size="large"/>
        </div>
        <div class="text-zinc-500 mt-3">Did you have a good day today?</div>
        <NDivider/>
        <div class="w-full flex flex-row gap-3 grid-cols-2 grid-rows-2 grid">
            <NCard class="flex-grow cursor-pointer" hoverable @click="navigate('posts')">
                <div class="flex gap-5">
                    <div class="bg-emerald-400 h-fit rounded-lg outline-1 p-2">
                        <NIcon size="40" class="w-full flex justify-center text-black">
                            <NewspaperOutline/>
                        </NIcon>
                    </div>
                    <div class="flex-grow">
                        <div class="text-zinc-500">Posts</div>
                        <div class="font-bold text-2xl">{{ posts.length }}</div>
                    </div>
                </div>
            </NCard>
            <NCard class="flex-grow cursor-pointer" hoverable @click="navigate('users')">
                <div class="flex gap-5">
                    <div class="bg-emerald-400 h-fit rounded-lg outline-1 p-2 text-black">
                        <NIcon size="40" class="w-full flex justify-center">
                            <PersonCircle/>
                        </NIcon>
                    </div>
                    <div class="flex-grow">
                        <div class="text-zinc-500">Users</div>
                        <div class="font-bold text-2xl">{{ users?.length }}</div>
                    </div>
                </div>
            </NCard>
            <NCard class="flex-grow cursor-pointer" hoverable @click="navigate('issues')">
                <div class="flex gap-5">
                    <div class="bg-emerald-400 h-fit rounded-lg outline-1 p-2 text-black">
                        <NIcon size="40" class="w-full flex justify-center">
                            <GitMerge/>
                        </NIcon>
                    </div>
                    <div class="flex-grow">
                        <div class="text-zinc-500">Issues</div>
                        <div class="font-bold text-2xl">{{ githubData?.issues.length }}</div>
                    </div>
                </div>
            </NCard>
            <NCard class="flex-grow cursor-pointer" hoverable @click="navigate('pull-requests')">
                <div class="flex gap-5">
                    <div class="bg-emerald-400 h-fit rounded-lg outline-1 p-2 text-black">
                        <NIcon size="40" class="w-full flex justify-center">
                            <GitPullRequest/>
                        </NIcon>
                    </div>
                    <div class="flex-grow">
                        <div class="text-zinc-500">Pull Requests</div>
                        <div class="font-bold text-2xl">{{ githubData?.pull_requests.length }}</div>
                    </div>
                </div>
            </NCard>
        </div>
    </div>
    <div class="gap-2 justify-items-start" v-else>
        <NSkeleton height="40px"/>
        <NSkeleton height="15px" class="mt-2"/>
        <NDivider/>
        <div class="w-full flex flex-row gap-3 grid-cols-2 grid-rows-2 grid">
            <NSkeleton class="flex-grow" height="80px"/>
            <NSkeleton class="flex-grow" height="80px"/>
            <NSkeleton class="flex-grow" height="80px"/>
            <NSkeleton class="flex-grow" height="80px"/>
        </div>
    </div>
</template>

<style scoped>

</style>