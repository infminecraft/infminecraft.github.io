<script setup lang="ts">
import type {Post} from "@/scripts/types"
import {
    NButton,
    NButtonGroup,
    NDataTable,
    NDivider,
    NForm,
    NFormItem,
    NModal,
    NScrollbar,
    NSkeleton,
    useMessage
} from "naive-ui";
import type {DataTableColumn, DataTableRowKey} from "naive-ui"
import {ref, h, onMounted} from "vue"
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import {useAuthStore} from "@/scripts/authentication/store";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {useDashboardStore} from "@/scripts/utility/dashboard/dashboardStore";
import {supabase} from "@/scripts/client";
const props = defineProps({
    authStore: Object
})
const message = useMessage();
const dashboardStore = useDashboardStore()
const userData: any = props.authStore?.state.session?.user;
const $fetcher = useDataFetcher();
const loadingPage = ref(false)
const posts = ref();
const postsList = ref<Post[]>([]);
const channels = supabase.channel('custom-all-channel')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        async (payload) => {
            console.log('Change received!', payload)
            await refreshData()
        }
    )
    .subscribe()

onMounted(async () => {
    loadingPage.value = true

    // posts.value = await $fetcher.fetchUserPosts(props.authStore?.state, message)
    // setPosts(posts.value)
    // addPostsData()
    posts.value = await dashboardStore.fetchPosts(props.authStore?.state, message)
    setPosts(posts.value)
    addPostsData()

    loadingPage.value = false
})

async function refreshData(){
    posts.value = await dashboardStore.fetchPosts(props.authStore?.state, message, true)
    setPosts(posts.value)
    addPostsData()
}

type PostRowData = {
    title: String, created_at: any, updated_at: any, postId: Number
}

function edit(row: PostRowData) {
    console.log('Edit post:', row)
    // Add your edit handler here...
}

function setPosts(postList: Post[]) {
    if (!postList) return;
    function createPost({postId, title, content, author_id, created_at, updated_at}: Post): Post {
        return { postId, title, content, author_id, created_at, updated_at };
    }
    for(const post of postList) {
        postsList.value.push(createPost(post));
    }
}

function addPostsData() {
    data.length = 0
    for(let i = 0; i < postsList.value.length; i++){
        data.push({
            id: postsList.value[i].postId,  // <-- Add this line
            title: postsList.value[i].title,
            created_at: postsList.value[i].created_at,
            updated_at: postsList.value[i].updated_at
        })
    }
}

const dataTable = ref()
const columns: DataTableColumn<any>[] = [
    {
        type: 'selection'
    },
    {
        title: 'Title',
        key: 'title',
        sorter: 'default'
    },
    {
        title: 'Created At',
        key: 'created_at',
        sorter: 'default'
    },
    {
        title: 'Updated At',
        key: 'updated_at',
        sorter: 'default'
    },
    {
        title: 'Action',
        key: 'actions',
        render (row: PostRowData) {
            return h(NButton,
                {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => edit(row)
                },
                { default: () => 'Edit' }
            )
        }
    }
]
const data: any[] = []
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const rowKey = (row: any): string => {
    return row.id;
};
const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
    console.log("checked handle")
    console.log(checkedRowKeysRef.value)
}

const showConfirmDeleteModal = ref(false)
const showCreatePostModel = ref(false)
const deletingPosts = ref(false)

const onPositiveClick = async () => {
    deletingPosts.value = true
    let ids: any = []
    console.log(checkedRowKeysRef.value)
    for (const idsKey of checkedRowKeysRef.value)
        ids.push(idsKey)

    console.log(ids)

    await $fetcher.deletePosts(ids, userData.id, message)
    showConfirmDeleteModal.value = false;
    deletingPosts.value = false
}
const onNegativeClick = () => {
    showConfirmDeleteModal.value = false;
}


const createPostFormRules = {
    title: [
        { required: true, message: 'Please enter the title', trigger: 'blur' },
        { min: 3, max: 100, message: 'Title length should be between 3 and 100 characters', trigger: 'blur' }
    ]
}
const createPostFormModel = ref({
    title: ''
})
const formRef = ref(null)
const newPostText = ref(''), newPostTitle = ref(''), awaitPublishingPost = ref(false)
const tryPublishPost = async () => {
    awaitPublishingPost.value = true
    await $fetcher.publishPost(newPostTitle.value, newPostText.value, userData.id, message)
    awaitPublishingPost.value = false
    showCreatePostModel.value = false
}

</script>

<template>
    <div class="w-full h-full">
        <NModal
            :mask-closable="false"
            v-model:show="showCreatePostModel"
            :title="'Create Post'"
        >
            <NCard class="w-full flex m-3 p-2">
                <div>
                    <div class="text-zinc-50 text-3xl font-bold mb-4">Create New Post</div>
                    <NForm ref="formRef" :model="createPostFormModel" :rules="createPostFormRules">
                        <NFormItem path="title" label="Title">
                            <NInput v-model:value="newPostTitle"/>
                        </NFormItem>
                        <NFormItem path="content" label="Content" class="mt-1">
                            <MdEditor v-model="newPostText"/>
                        </NFormItem>
                    </NForm>
                    <div class="flex gap-2 w-full justify-end">
                        <NButton strong secondary type="default" @click="showCreatePostModel=false" size="large">Cancel</NButton>
                        <NButton strong primary type="primary" size="large" :loading="awaitPublishingPost" @click="tryPublishPost()">Publish</NButton>
                    </div>
                </div>
            </NCard>
        </NModal>
        <NModal
            v-model:show="showConfirmDeleteModal"
            :mask-closable="false"
            preset="confirm"
            :title="'Deleting ' + checkedRowKeysRef.length + ' Post(s)'"
        >
            <div class="mb-3">Are you sure you want to delete these Posts? This action cannot be reversed and these posts will be deleted permanently.</div>
            <div class="gap-3 flex align-bottom justify-end">
                <NButton strong secondary type="default" @click="onNegativeClick" :disabled="deletingPosts">Cancel</NButton>
                <NButton strong type="error" @click="onPositiveClick" :loading="deletingPosts" :disabled="deletingPosts">Delete</NButton>
            </div>
        </NModal>
        <div class="w-full flex">
            <div class="flex-grow font-bold text-4xl">Posts 帖子</div>
            <NButtonGroup class="items-center">
                <NButton strong type="primary" @click="showCreatePostModel=true">New Post</NButton>
                <NButton @click="showConfirmDeleteModal=true" :disabled="checkedRowKeysRef.length == 0" strong secondary type="error">Delete</NButton>
            </NButtonGroup>
        </div>
        <NDivider/>
        <div class="w-full h-full" v-if="!loadingPage">
            <NScrollbar>
                <NDataTable ref="dataTable" :columns="columns" :data="data" :row-key="rowKey" @update:checked-row-keys="handleCheck"/>
            </NScrollbar>
        </div>
        <div class="w-full h-full" v-else>
            <NSkeleton height="100px"/>
        </div>
    </div>
</template>

<style scoped>

</style>