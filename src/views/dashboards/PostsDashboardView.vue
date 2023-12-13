<script setup lang="ts">
import type {Post} from "@/scripts/types"
import {NButton, NButtonGroup, NDataTable, NDivider, NModal, NScrollbar} from "naive-ui";
import type {DataTableColumn, DataTableRowKey} from "naive-ui"
import {ref, h} from "vue"
const props = defineProps({
    posts: {
        type: Array as () => Post[],
        required: true,
    }
})

type PostRowData = {
    title: String, created_at: any, updated_at: any
}

function createPost({id, title, content, author_id, created_at, updated_at}: Post): Post {
    return { id, title, content, author_id, created_at, updated_at };
}

const postsList = ref<Post[]>([]);

function setPosts(postList: Post[]) {
    if (!postList) return;
    for(const post of postList) {
        postsList.value.push(createPost(post));
    }
}

setPosts(props.posts)

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
function edit(row: PostRowData) {
    console.log('Edit post:', row)
    // Add your edit handler here...
}
const data: any[] = []
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const rowKey = (row: any): string => {
    return row.id;
};

const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeysRef.value = rowKeys
    console.log("checked handle")
}
addPostsData()
function addPostsData() {
    for(let i = 0; i < postsList.value.length; i++){
        data.push({
            id: postsList.value[i].id,  // <-- Add this line
            title: postsList.value[i].title,
            created_at: postsList.value[i].created_at,
            updated_at: postsList.value[i].updated_at
        })
    }
}

const showConfirmDeleteModal = ref(false)
const onPositiveClick = async () => {

    await deletePosts(ids)
    showConfirmDeleteModal.value = false;
}
const onNegativeClick = () => {
    showConfirmDeleteModal.value = false;
}
</script>

<template>
    <div class="w-full h-full">
        <NModal
            v-model:show="showConfirmDeleteModal"
            :mask-closable="false"
            preset="confirm"
            :title="'Deleting ' + checkedRowKeysRef.length + ' Post(s)'"
        >
            <div class="mb-3">Are you sure you want to delete these Posts? This action cannot be reversed and these posts will be deleted permanently.</div>
            <div class="gap-3 flex align-bottom justify-end">
                <NButton strong secondary type="default" @click="onNegativeClick">Cancel</NButton>
                <NButton strong type="error" @click="onPositiveClick">Delete</NButton>
            </div>
        </NModal>
        <div class="w-full flex">
            <div class="flex-grow font-bold text-4xl">Posts 帖子</div>
            <NButtonGroup class="items-center">
                <NButton strong type="primary">New Post</NButton>
                <NButton @click="showConfirmDeleteModal=true" :disabled="checkedRowKeysRef.length == 0" strong secondary type="error">Delete</NButton>
            </NButtonGroup>
        </div>
        <NDivider/>
        <div class="w-full h-full">
            <NScrollbar>
                <NDataTable ref="dataTable" :columns="columns" :data="data" :row-key="rowKey" @update:checked-row-keys="handleCheck"/>
            </NScrollbar>
        </div>
    </div>
</template>

<style scoped>

</style>