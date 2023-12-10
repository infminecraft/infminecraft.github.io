<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import {
    darkTheme, NAffix, NAvatar,
    NConfigProvider,
    NDialogProvider,
    NDivider, NDropdown, NGradientText, NIcon, NLayoutFooter, NLayoutHeader,
    NLoadingBarProvider, NMenu,
    NMessageProvider,
    NNotificationProvider, NText
} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {Home, Newspaper, HeartCircleOutline, AlertCircle, LogOutOutline} from "@vicons/ionicons5";
import {h, ref, onMounted} from "vue";
import type {Component} from "vue";
import ContentLoader from "@/views/components/ContentLoader.vue";
import {supabase} from "@/scripts/client";
import {useAuthStore} from "@/scripts/authentication/store";
function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const $router = useRouter()

const userDropdown = [
    {
        label: "Dashboard",
        key: 'dashboard',
        icon: renderIcon(LogOutOutline),
        props: {
            onClick: () => {
                $router.push('dashboard')
            }
        }
    }
]

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

const { state, checkSession, updateSession } = useAuthStore();

// When App.vue is mounted, we ensure our auth store is synced with any current session
onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
        updateSession(data.session);
    });

    supabase.auth.onAuthStateChange((_, _session) => {
        updateSession(_session);
    });
});
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
                                    <ContentLoader :loading="false">
                                        <div>
                                            <NAffix :listen-to="() => containerRef" :trigger-top="0" :top="0" class="w-full z-10" v-if="$route.name != 'login' && $route.name != 'dashboard' && $route.name != '404'">
                                                <div class="flex items-center justify-center">
                                                    <div class="rounded-2xl p-1 px-2 mt-3 backdrop-blur-md bg-transparent border-0 ring-[0.5px] ring-slate-300 flex">
                                                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 opacity-10 mix-blend-multiply rounded-2xl"/>
                                                        <NMenu
                                                            v-model:value="activeKey" mode="horizontal" :options="headerMenuOptions"
                                                            class="w-fit relative z-10"
                                                        />
                                                        <div class="mx-2 my-1 gap-2 flex bg-transparent">
                                                            <NButton class="h-full" @click="$router.push('login')" v-if="!state.session">Login 登陆</NButton>
                                                            <NDropdown :options="userDropdown" trigger="hover" v-else>
                                                                <NAvatar size="medium"><img :src="state.session.user.user_metadata.avatar_url || '/infmc-icon.png'" /></NAvatar>
                                                            </NDropdown>
    <!--                                                        <NButton class="h-full">Sign Up 注册</NButton>-->
                                                        </div>
                                                    </div>
                                                </div>
                                            </NAffix>
                                        </div>
                                        <div class="w-full">
                                            <RouterView/>
                                        </div>
                                    </ContentLoader>
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
