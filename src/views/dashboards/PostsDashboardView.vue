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
    NSkeleton, NSwitch,
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

// Dependency & Tools
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
            await reloadPage()
        }
    )
    .subscribe()

onMounted(async () => {
    await reloadPage()
})

// Functions
async function reloadPage(){
    loadingPage.value = true

    // posts.value = await $fetcher.fetchUserPosts(props.authStore?.state, message)
    // setPosts(posts.value)
    // addPostsData()
    posts.value = await dashboardStore.fetchPosts(props.authStore?.state, message)
    setPosts(posts.value)
    addPostsData()

    loadingPage.value = false
}

type PostRowData = {
    title: String, created_at: any, updated_at: any, postId: Number, content: string, author_id: string, slug: string
}

function edit(row: PostRowData) {
    console.log('Edit post:', row)
    let tempRow
    for(let i = 0; i < posts.value.length; i++){
        if(row.postId == posts.value[i]?.postId && posts.value.author_id == posts.value[i]?.author_id){
            tempRow = posts.value[i]
            break;
        }
    }
    showEditPostModal.value = true;
    editPostFormModel.value.title = row.title.toString()
    editPostContent.value = row.content.toString()
    editPostFormModel.value.slug = row.slug.toString()
    editPostAuthorId.value = row.author_id.toString()
    editPostId.value = row.postId.valueOf()
}

function setPosts(postList: Post[]) {
    if (!postList) return;
    function createPost({postId, title, content, author_id, created_at, updated_at, slug}: Post): Post {
        return { postId, title, content, author_id, created_at, updated_at, slug };
    }
    postsList.value.length = 0
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
            created_at: formatDateToMMMddYYYY(postsList.value[i].created_at),
            updated_at: formatDateToMMMddYYYY(postsList.value[i].updated_at),
            author_id: postsList.value[i].author_id,
            slug: postsList.value[i].slug,
            content: postsList.value[i].content,
            postId: postsList.value[i].postId
        })
    }
}

function formatDateToMMMddYYYY(isoTimestamp: string): string {
    // Create a new Date object from the timestamp
    const date = new Date(isoTimestamp);

    // Create an options object for formatting
    const options: any = { year: 'numeric', month: 'short', day: 'numeric' };

    // Use Intl.DateTimeFormat to format the date
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function createSlug(title: string): string {
    return title
        .toLowerCase() // Convert the title to lower case
        .replace(/[^a-z0-9\s]/g, '') // Remove any non-alphanumeric or whitespace characters
        .replace(/\s+/g, '-'); // Replace white spaces with hyphen
}

// Data Table Reference
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

//Delete Post Modal
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

// Create Post Modal
const newPostText = ref(''), newPostAutoSlug = ref(true), awaitPublishingPost = ref(false)
const createPostFormRules = {
    title: [
        { required: true, message: 'Please enter the title', trigger: 'blur' },
        { min: 3, max: 100, message: 'Title length should be between 3 and 100 characters', trigger: 'blur' }
    ],
    slug: [
        { required: true, message: 'Please enter the slug', trigger: 'blur' },
        { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Slug should be in kebab-case (i.e., lowercase alphanumeric characters separated by single hyphens)', trigger: 'blur' },
        { min: 3, max: 100, message: 'Slug length should be between 3 and 100 characters', trigger: 'blur' }
    ]
}
const createPostFormModel = ref({title: '', slug: ''})
const formRef = ref(null)
const onTypeTitle = (title: string) => {
    if (newPostAutoSlug) createPostFormModel.value.slug = createSlug(createPostFormModel.value.title)
}
const tryPublishPost = async () => {
    awaitPublishingPost.value = true
    await $fetcher.publishPost(createPostFormModel.value.title, newPostText.value, userData.id, createPostFormModel.value.slug ? createSlug(createPostFormModel.value.title) : createPostFormModel.value.slug, message)
    awaitPublishingPost.value = false
    showCreatePostModel.value = false
}

// Edit post modal
const showEditPostModal = ref(false), editPostTitle = ref(""), editPostContent = ref(''), editPostSlug = ref(''), editPostAuthorId = ref(''), editPostId = ref<number>(-1)
const editPostFormRules = {
    title: [
        { required: true, message: 'Please enter the title', trigger: 'blur' },
        { min: 3, max: 100, message: 'Title length should be between 3 and 100 characters', trigger: 'blur' }
    ],
    slug: [
        { required: true, message: 'Please enter the slug', trigger: 'blur' },
        { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Slug should be in kebab-case (i.e., lowercase alphanumeric characters separated by single hyphens)', trigger: 'blur' },
        { min: 3, max: 100, message: 'Slug length should be between 3 and 100 characters', trigger: 'blur' }
    ]
}
const editPostFormModel = ref({title: editPostTitle.value, slug: editPostSlug}), awaitEditingPost = ref(false)
const tryEditPost = async () => {
    awaitEditingPost.value = true
    await $fetcher.editUserPost(editPostAuthorId.value, editPostId.value, editPostFormModel.value.title, editPostContent.value, editPostFormModel.value.slug, message)
    awaitEditingPost.value = false
    showEditPostModal.value = false
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
                    <NForm ref="formRef" :model="createPostFormModel" :rules="createPostFormRules" :disabled="awaitPublishingPost">
                        <NFormItem path="title" label="Title">
                            <NInput v-model:value="createPostFormModel.title" @input="onTypeTitle"/>
                        </NFormItem>
                        <NFormItem path="autoSlug" label="Auto-Generate Slug">
                            <NSwitch v-model:value="newPostAutoSlug"/>
                        </NFormItem>
                        <NFormItem path="slug" label="Slug">
                            <NInput v-model:value="createPostFormModel.slug" :disabled="newPostAutoSlug"/>
                        </NFormItem>
                        <NFormItem path="content" label="Content" class="mt-1">
                            <MdEditor v-model="newPostText"/>
                        </NFormItem>
                    </NForm>
                    <div class="flex gap-2 w-full justify-end">
                        <NButton strong secondary type="default" @click="showCreatePostModel=false" size="large" :disabled="awaitPublishingPost">Cancel</NButton>
                        <NButton strong primary type="primary" size="large" :loading="awaitPublishingPost" @click="tryPublishPost()" :disabled="awaitPublishingPost">Publish</NButton>
                    </div>
                </div>
            </NCard>
        </NModal>
        <NModal
            :mask-closable="false"
            v-model:show="showEditPostModal"
            :title="'Editing Post'"
        >
            <NCard class="w-full flex m-3 p-2">
                <div>
                    <div class="text-zinc-50 text-3xl font-bold mb-4">Create New Post</div>
                    <NForm ref="formRef" :model="editPostFormModel" :rules="editPostFormRules" :disabled="awaitEditingPost">
                        <NFormItem path="title" label="Title">
                            <NInput v-model:value="editPostFormModel.title"/>
                        </NFormItem>
                        <NFormItem path="slug" label="Slug">
                            <NInput v-model:value="editPostFormModel.slug"/>
                        </NFormItem>
                        <NFormItem path="content" label="Content" class="mt-1">
                            <MdEditor v-model="editPostContent"/>
                        </NFormItem>
                    </NForm>
                    <div class="flex gap-2 w-full justify-end">
                        <NButton strong secondary type="default" @click="showEditPostModal=false" size="large" :disabled="awaitEditingPost">Cancel</NButton>
                        <NButton strong primary type="primary" size="large" :loading="awaitEditingPost" @click="tryEditPost()" :disabled="awaitEditingPost">Publish</NButton>
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
                <NDataTable ref="dataTable" :columns="columns" :data="data" :row-key="rowKey" @update:checked-row-keys="handleCheck" @update-page="reloadPage"/>
            </NScrollbar>
        </div>
        <div class="w-full h-full" v-else>
            <NSkeleton height="100px"/>
        </div>
    </div>
</template>

<style scoped>

</style>