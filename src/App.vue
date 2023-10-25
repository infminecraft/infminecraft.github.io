<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {
    darkTheme, NAffix,
    NConfigProvider,
    NDialogProvider,
    NDivider, NIcon, NLayoutHeader,
    NLoadingBarProvider, NMenu,
    NMessageProvider,
    NNotificationProvider
} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {Home, Newspaper, HeartCircleOutline, AlertCircle} from "@vicons/ionicons5";
import {h, ref} from "vue";
import type {Component} from "vue";
function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const headerMenuOptions: MenuOption[] = [
    {
        label: 'Home 主页',
        key: 'landing',
        icon: renderIcon(Home)
    },
    {
        label: 'Server Rules 服务器规则',
        key: 'rules',
        icon: renderIcon(Newspaper)
    },
    {
        label: 'Donate 捐赠',
        key: 'donate',
        icon: renderIcon(HeartCircleOutline)
    },
    {
        label: 'Penalty Records 惩罚记录',
        key: 'penalties',
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
                                <NLayout class="justify-center items-center">
                                    <NLayoutHeader>
                                        <NAffix :listen-to="() => containerRef" :trigger-top="0" :top="0" class="w-screen z-10">
                                            <div class="w-full flex backdrop-blur-lg bg-transparent items-center justify-center p-1">
                                                <NMenu
                                                    v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions" default-value="landing"
                                                />
                                            </div>
                                        </NAffix>
                                    </NLayoutHeader>
                                    <NLayout>
                                        <RouterView />
                                    </NLayout>
                                </NLayout>
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
