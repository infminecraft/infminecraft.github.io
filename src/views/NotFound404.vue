<script setup lang="ts">

import {NButton, NGradientText} from "naive-ui";
</script>

<template>
    <div class="min-h-screen w-full bg-zinc-800 flex items-center justify-center">
        <div class="h-full w-full flex flex-col items-center justify-center">
            <div class="w-full flex items-center justify-center">
                <div class="w-fit backdrop-blur-lg bg-white/10 border-0 ring-[0.5px] ring-zinc-100 p-5 rounded-lg">
                    <NGradientText type="error" font-size="20" class="text-center">404...<br/>The page you were trying to find does not exist.</NGradientText>
                </div>
            </div>
            <NButton text @click="$router.push('/')" class="mt-5">Back to main page</NButton>
        </div>
    </div>
</template>

<style scoped>

</style>