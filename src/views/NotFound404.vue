<script setup lang="ts">

import {NButton, NGradientText, NResult} from "naive-ui";
</script>

<template>
    <div class="min-h-screen w-full bg-zinc-800 flex items-center justify-center">
        <div class="h-full w-full flex flex-col items-center justify-center">
            <div class="w-full flex items-center justify-center">
                <NResult
                    status="404"
                    title="404 Not Found"
                    description="You know life is always ridiculous."
                />
            </div>
            <NButton text @click="$router.push('/')" class="mt-5">Back to main page</NButton>
        </div>
    </div>
</template>

<style scoped>

</style>