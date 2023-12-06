<script setup lang="ts">

import {NGradientText, NGrid, NGridItem, NLayout} from "naive-ui";
</script>

<template>
    <div class="w-full h-full">
        <NLayout class="flex w-full h-full min-h-screen pt-13">
            <div class="w-full absolute flex items-center justify-center">
                <img src="@/assets/images/postsHeader.png" class="object-cover w-full"/>
                <div class="absolute inset-0 w-full flex justify-center items-center">
                    <NGradientText class="w-full align-middle justify-center justify-self-center text-6xl font-bold text-center opacity-90">Posts 公告</NGradientText>
                </div>
            </div>
            <NGrid class="w-fit flex items-center justify-center" :x-gap="20" :cols="3">
                <NGridItem class="flex h-full w-full"/>
            </NGrid>
        </NLayout>
    </div>
</template>

<style scoped>

</style>