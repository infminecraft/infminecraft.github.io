<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import {
    darkTheme, NAffix,
    NConfigProvider,
    NDialogProvider,
    NDivider, NGradientText, NIcon, NLayoutFooter, NLayoutHeader,
    NLoadingBarProvider, NMenu,
    NMessageProvider,
    NNotificationProvider, NText
} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {Home, Newspaper, HeartCircleOutline, AlertCircle} from "@vicons/ionicons5";
import {h, ref} from "vue";
import type {Component} from "vue";
function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const $router = useRouter()

const headerMenuOptions: MenuOption[] = [
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'landing'
                }
            },
            { default: () => 'Home 主页' }
        ),
        key: 'landing',
        icon: renderIcon(Home)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'docs'
                }
            },
            { default: () => 'Documentation 服务器文档' }
        ),
        key: 'rules',
        icon: renderIcon(Newspaper)
    },
    {
        label: () => h(
            'a',
            {
                href: "http://afdian.net/a/infminecraft2585",
                target: '_blank',
                rel: 'noopenner noreferrer'
            },
            'Donate 捐赠'
        ),
        key: 'donate',
        icon: renderIcon(HeartCircleOutline)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'penalties'
                }
            },
            { default: () => 'Penalty Records 惩罚记录' }
        ),
        key: 'penalties',
        icon: renderIcon(AlertCircle)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'posts'
                }
            },
            { default: () => 'Posts 公告' }
        ),
        key: 'posts',
        icon: renderIcon(AlertCircle)
    }
]
const containerRef = ref<HTMLElement | undefined>(undefined);
const activeKey = ref("landing");
</script>

<template>
    <NLoadingBarProvider>
        <NNotificationProvider>
            <div ref="containerRef">
                <NMessageProvider>
                    <NDialogProvider>
                        <NConfigProvider :theme="darkTheme">
                            <div class="w-full relative">
                                <div class="w-full justify-center items-center">
                                    <div>
                                        <NAffix :listen-to="() => containerRef" :trigger-top="0" :top="0" class="w-full z-10">
                                            <div class="flex items-center justify-center">
                                                <div class="rounded-2xl p-1 px-2 mt-3 backdrop-blur-md bg-transparent border-0 ring-[0.5px] ring-slate-600">
                                                    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-50 to-zinc-100 opacity-10 mix-blend-multiply rounded-2xl"/>
                                                    <NMenu
                                                        v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions"
                                                        class="w-fit relative z-10"
                                                    />
                                                </div>
                                            </div>
                                        </NAffix>
                                    </div>
                                    <div class="w-full">
                                        <RouterView />
                                    </div>
                                </div>
                            </div>
                        </NConfigProvider>
                    </NDialogProvider>
                </NMessageProvider>
            </div>
        </NNotificationProvider>
    </NLoadingBarProvider>
</template>

<style scoped>
</style>
