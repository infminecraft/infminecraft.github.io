<script setup lang="ts">

import {NCard, NDivider, NIcon} from "naive-ui";
import { useRouter } from "vue-router"; // Add vue-router
import { onMounted } from 'vue'
import {GitMerge, GitPullRequest, NewspaperOutline, PersonCircle} from "@vicons/ionicons5";

const props = defineProps({
    username: String,
    userPosts: Array,
    userCount: Number,
    githubIssueCount: Number,
    githubPullReqCount: Number
})
const router = useRouter(); // Get router instance
const navigate = (path: any) => {
    router.push('/dashboard/' + path); // router navigation logic
};
onMounted(() => {
    console.log("loaded")
})
</script>

<template>
    <div class="gap-2 justify-items-start">
        <div class="font-bold text-4xl">Hello, {{props.username}}</div>
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
                        <div class="font-bold text-2xl">{{props.userPosts?.length}}</div>
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
                        <div class="font-bold text-2xl">{{props.userCount}}</div>
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
                        <div class="font-bold text-2xl">{{props.githubIssueCount}}</div>
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
                        <div class="font-bold text-2xl">{{props.githubPullReqCount}}</div>
                    </div>
                </div>
            </NCard>
        </div>
    </div>
</template>

<style scoped>

</style>