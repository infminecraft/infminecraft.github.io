<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {
    NConfigProvider,
    NDialogProvider,
    NDivider,
    NLoadingBarProvider,
    NMessageProvider,
    NNotificationProvider
} from "naive-ui";
</script>

<template>
    <NLoadingBarProvider>
        <NNotificationProvider>
            <div>
                <NMessageProvider>
                    <NDialogProvider>
                        <NConfigProvider>
                            <div class="w-full relative">
                                <div class="justify-center items-center">
                                    <RouterView />
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
