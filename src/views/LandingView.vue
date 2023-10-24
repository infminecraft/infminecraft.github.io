<script setup lang="ts">
import HeaderBar from "@/components/HeaderBar.vue";
import {
    NAffix,
    NButton,
    NCarousel,
    NCarouselItem,
    NGradientText,
    NImageGroup,
    NLayout,
    NLayoutContent,
    NLayoutHeader, NMenu
} from "naive-ui";
import type {
    MenuOption
} from "naive-ui";
import {ref} from "vue";

const headerMenuOptions: MenuOption[] = [
    {
        label: 'Home 主页',
        key: 'landing'
    },
    {
        label: 'Server Rules 服务器规则',
        key: 'rules'
    },
    {
        label: 'Donate 捐赠',
        key: 'donate'
    },
    {
        label: 'Penalty Records 惩罚记录',
        key: 'penalties'
    }
]
const activeKey = ref("");
const containerRef = ref<HTMLElement | undefined>(undefined);
</script>

<template>
    <div ref="containerRef">
        <NLayout class="w-full items-center align-middle flex">
            <NLayout>
                <NLayoutContent class="h-screen w-screen">
                    <NCarousel :direction="'horizontal'" :dot-type="'line'" show-dots autoplay>
                        <img src="@/assets/images/bg1.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg2.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg3.png" class="object-cover w-full"/>
                        <img src="@/assets/images/bg4.png" class="object-cover w-full"/>
                    </NCarousel>
                    <div class="absolute inset-0 flex flex-col items-center justify-center align-middle">
                        <NLayoutHeader class="w-full backdrop-blur-md bg-transparent">
                            <NMenu
                                v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions"
                            />
                        </NLayoutHeader>
                        <div class="flex flex-col items-center justify-center align-middle">
                            <NGradientText class="text-6xl font-bold text-center text-green-400">InfMinecraft 我的世界服务器</NGradientText>
                            <div class="mt-5 flex gap-5">
                                <NButton type="primary" strong size="large">Get Started 加入服务器</NButton>
                                <NButton type="primary" strong secondary size="large">Get Started 加入服务器</NButton>
                            </div>
                        </div>
                    </div>
                </NLayoutContent>
            </NLayout>
            <NLayoutContent>
                <NGradientText class="text-6xl font-bold text-center text-green-400">InfMinecraft 我的世界服务器</NGradientText>
                <div class="mt-5 flex gap-5">
                    <NButton type="primary" strong size="large">Get Started 加入服务器</NButton>
                    <NButton type="primary" strong secondary size="large">Get Started 加入服务器</NButton>
                </div>
            </NLayoutContent>
        </NLayout>
    </div>
</template>

<style scoped>

</style>