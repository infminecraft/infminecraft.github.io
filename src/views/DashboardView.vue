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
import {RouterLink} from "vue-router";
import {Home, PencilSharp, PersonCircle, } from "@vicons/ionicons5";
import {useSession} from "@/scripts/authentication/auth";
import {useAuthStore} from "@/scripts/authentication/store";
import ContentLoader from "@/views/components/ContentLoader.vue";
// @ts-ignore
import type {Post} from "@/scripts/types";
const {state} = useAuthStore();
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
        icon: renderIcon()
    },
    {
        label: 'Users 用户',
        key: 'users',
        icon: renderIcon(PersonCircle)
    }
]

const username = ref('')
const users = ref(), userCount = ref()
const website = ref('')
const avatar_url = ref('')
const userPosts = ref<Post[]>([]); // Replace with the appropriate type for your posts
const loadingPosts = ref(false);

onMounted(async () => {
    await getProfile()
    await fetchUserPosts()
    users.value = await getUsers()
    userCount.value = users.value?.length;
})

async function getUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id')

    if (data) {
        // message.info('Number of authenticated users: ' + data.length)
    } else {
        message.error('Error fetching users: ' + error?.message)
    }
    return data;
}

async function getProfile() {
    if (!state.session) {
        // Handle the case where there is no session, e.g., redirect to login or show a message.
        message.error('No session found. Please login again.');
        return;
    }

    try {
        // loading.value = true
        const user = state.session.user

        const {data, error, status} = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            username.value = data.username
            website.value = data.website
            avatar_url.value = data.avatar_url
        }
    } catch (error) {
        if (error instanceof Error) message.error(error.message)
        else message.error("An Unexpected Error occurred")
    } finally {
        loading.value = false
    }
}
async function fetchUserPosts() {
    if (!state.session) {
        // Handle the case where there is no session, e.g., redirect to login or show a message.
        message.error('No session found. Please login again.');
        return;
    }
    loading.value = true;
    try {
        let userId = state.session.user.id
        let { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        userPosts.value = posts || [];
    } catch (error) {
        if (error instanceof Error) {
            message.error(error.message);
        } else {
            message.error("An error occurred while fetching posts. Please refresh the page and try again.");
        }
    } finally {
        loading.value = false;
    }
}
async function updateProfile() {
    if (!state.session) {
        // Handle the case where there is no session, e.g., redirect to login or show a message.
        message.error('No session found. Please login again.');
        return;
    }
    try {
        loading.value = true
        const user = state.session.user

        const updates = {
            id: user.id,
            username: username.value,
            website: website.value,
            avatar_url: avatar_url.value,
            updated_at: new Date(),
        }

        const { error } = await supabase.from('profiles').upsert(updates)

        if (error) throw error
    } catch (error) {
        if (error instanceof Error) message.error(error.message)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) message.error(error.message)
    } finally {
        loading.value = false
    }
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
                    />
                </NLayoutSider>
                <NLayoutContent class="h-full w-full" :native-scrollbar="false">
                    <div class="p-10 gap-2 justify-items-start">
                        <div class="font-bold text-4xl">Hello, {{username}}</div>
                        <div class="text-zinc-500 mt-3">Did you have a good day today?</div>
                        <NDivider/>
                        <div class="w-full flex flex-row gap-5">
                            <NCard class="flex-grow cursor-pointer" hoverable @click="activeKey='posts'">
                                <div class="flex gap-5">
                                    <div class="bg-black/30 rounded-lg outline-1 p-2">
                                        <NIcon size="40" class="w-full h-full flex justify-center">
                                            <PencilSharp/>
                                        </NIcon>
                                    </div>
                                    <div class="flex-grow">
                                        <div class="text-zinc-500">Posts</div>
                                        <div class="font-bold text-2xl">{{userPosts.length}}</div>
                                    </div>
                                </div>
                            </NCard>
                            <NCard class="flex-grow cursor-pointer" hoverable @click="activeKey='visits'">
                                <div class="flex gap-5">
                                    <div class="bg-black/30 rounded-lg outline-1 p-2">
                                        <NIcon size="40" class="w-full h-full flex justify-center">
                                            <PencilSharp/>
                                        </NIcon>
                                    </div>
                                    <div class="flex-grow">
                                        <div class="text-zinc-500">Visits</div>
                                        <div class="font-bold text-2xl">{{userCount}}</div>
                                    </div>
                                </div>
                            </NCard>
                        </div>
                    </div>
                </NLayoutContent>
            </NLayout>
        </div>
    </ContentLoader>
</template>

<style scoped>

</style>