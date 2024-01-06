<script setup lang="ts">
import {
    NAvatar,
    NButton, NCard,
    NCarousel, NDivider,
    NGradientText, NGrid, NGridItem,
    NLayout,
    NLayoutContent, NScrollbar, NSkeleton,
    NText,
    useMessage
} from "naive-ui";
import bg1 from "@/assets/images/bg1.png"
import bg3 from "@/assets/images/bg3.png"
import bg4 from "@/assets/images/bg4.png"
import Copyrighter from "@/components/Copyrighter.vue";
import {RouterLink} from "vue-router";
import {ref, onMounted} from "vue";
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import type {Post, User} from "@/scripts/types";
import {useAuthStore} from "@/scripts/authentication/store";
import {useDashboardStore} from "@/scripts/utility/dashboard/dashboardStore";

const descriptionCards = [
    {
        english: "Experience endless possibilities on our Minecraft Server! Enjoy a versatile gameplay experience combining SMP survival with the thrilling conflicts between players. Explore, build, fight, and strategize to your heart's content in a unique adventure.",
        chinese: "在我们的 Minecraft 服务器上体验无限的可能性！ 享受将 SMP 生存与玩家之间惊心动魄的冲突相结合的多功能游戏体验。 在一次独特的冒险中随心所欲地探索、建造、战斗和制定战略。",
        title: "Fun 趣玩 🎉",
        imageSource: bg1
    },
    {
        english: "We prioritize your security. Our server implements strong measures to protect your data. With encryption protocols and regular backups, your progress and personal information are safe, allowing you to focus on the game.",
        chinese: "我们优先考虑您的安全。 我们的服务器采取强有力的措施来保护您的数据。 通过加密协议和定期备份，您的进度和个人信息是安全的，让您可以专注于游戏。",
        title: "Secure 安全 🔒",
        imageSource: bg3
    },
    {
        english: "Join our active Minecraft Server community! Connect, collaborate, and share your adventures with our welcoming community. Our dedicated team and passionate players are here to help, whether you're a seasoned player or new to the game. Let's create lasting memories together!",
        chinese: "加入我们活跃的 Minecraft 服务器社区！ 与我们热情的社区联系、协作并分享您的冒险经历。 无论您是经验丰富的玩家还是游戏新手，我们敬业的团队和热情的玩家都会为您提供帮助。 让我们一起创造永恒的回忆！",
        title: "Support 帮助 💬",
        imageSource: bg4
    }
]

function toGetStarted() {
    window.open("https://docs.qq.com/form/page/DR2lMVGtlT3NKc1F4")
}

const $fetcher = useDataFetcher()
const $authStore = useAuthStore()
const $dashboardStore = useDashboardStore()
const $message = useMessage()
const posts = ref<Post[]>([])
const users = ref<User[]>([])
const loadingPage = ref(false)
onMounted(async () => {
    loadingPage.value = true
    posts.value = await $dashboardStore.fetchPosts($authStore.state, $message)
    users.value = await $dashboardStore.fetchUsers($message)
    loadingPage.value = false;
})

function findUserFromId(id: string): User | undefined {
    for (let i = 0; i < users.value.length; i++)
        if (users.value[i].id == id) return users.value[i];
}

function formatDateToMMMddYYYY(isoTimestamp: string): string {
    // Create a new Date object from the timestamp
    const date = new Date(isoTimestamp);

    // Create an options object for formatting
    const options: any = {year: 'numeric', month: 'short', day: 'numeric'};

    // Use Intl.DateTimeFormat to format the date
    return new Intl.DateTimeFormat('en-US', options).format(date);
}
</script>

<template>
    <div>
        <NLayout class="w-full items-center align-middle flex">
            <NLayout class="w-fit flex">
                <NLayoutContent class="w-full">
                    <NCarousel :direction="'horizontal'" class="w-full" :dot-type="'line'" show-dots autoplay>
                        <img src="@/assets/images/bg1.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg2.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg3.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg4.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg5.png" class="object-cover w-full"/>
                    </NCarousel>
                    <div class="absolute inset-0 flex flex-col items-center justify-center align-middle">
                        <div class="flex flex-col items-center justify-center align-middle">
                            <div class="flex">
                                <NGradientText
                                    class="text-6xl font-bold text-center bg-gradient-to-r from-green-100 to-green-400 opacity-90">
                                    InfMinecraft 我的世界服务器
                                </NGradientText>
                            </div>
                            <div class="mt-5 flex gap-5">
                                <NButton type="primary" strong size="large" @click="toGetStarted()">Get Started
                                    加入服务器
                                </NButton>
                                <NButton type="primary" strong secondary size="large" @click="$router.push('docs')">
                                    Learn More 更多信息
                                </NButton>
                            </div>
                        </div>
                    </div>

                </NLayoutContent>
                <NLayout class="px-10 py-4 w-fit">
                    <NDivider class="text-4xl flex justify-center font-bold mb-6">Features 特性</NDivider>
                    <NGrid class="w-fit flex items-center justify-center" :x-gap="20" :y-gap="20"
                           cols="3 100:1 600:2 1000:3">
                        <NGridItem v-for="desc in descriptionCards" class="flex h-full w-full">
                            <NCard size="large" class="w-full h-full flex" :title="desc.title" hoverable>
                                <template #cover>
                                    <img :src="desc.imageSource" class="object-cover w-full" alt="Card Header Image"/>
                                </template>
                                <NText>{{ desc.english }}</NText>
                                <NDivider/>
                                <NText>{{ desc.chinese }}</NText>
                            </NCard>
                        </NGridItem>
                    </NGrid>
                </NLayout>
                <NLayout class="px-10 py-3 w-full">
                    <NDivider class="text-4xl flex justify-center font-bold mb-6">Posts 帖子</NDivider>
                    <NGrid class="w-full flex items-center justify-center" :y-gap="20" :x-gap="20" cols="2">
                        <NGridItem v-for="post in posts" class="flex h-full w-full cursor-pointer">
                            <NCollapseTransition :show="!loadingPage">
                                <NCard hoverable class="h-fit">
                                    <div class="flex gap-3">
                                        <div class="flex-grow">
                                            <div class="text-2xl font-bold">{{ post.title }}</div>
                                            <div class="text-zinc-500 flex items-center">
                                                Created at {{ formatDateToMMMddYYYY(post.created_at) }} by
                                                {{ findUserFromId(post.author_id)?.username }}
                                                <div class="flex scale-10 ml-1">
                                                    <NAvatar :src="findUserFromId(post.author_id)?.avatar_url" round
                                                             size="small"/>
                                                </div>
                                            </div>
                                        </div>
                                        <RouterLink :to="'/post/' + post.slug">
                                            <NButton type="tertiary" strong>Read More 阅读更多</NButton>
                                        </RouterLink>
                                    </div>
                                </NCard>
                            </NCollapseTransition>
                        </NGridItem>
                    </NGrid>
                    <NCollapseTransition class="w-full items-center justify-center gap-3 grid-cols-2 grid"
                                         :show="loadingPage">
                        <NSkeleton height="80px" class="w-full"/>
                        <NSkeleton height="80px" class="w-full"/>
                        <NSkeleton height="80px" class="w-full"/>
                        <NSkeleton height="80px" class="w-full"/>
                    </NCollapseTransition>
                </NLayout>
                <Copyrighter/>
            </NLayout>
        </NLayout>
    </div>
</template>

<style scoped>

</style>