<script setup lang="ts">

import {NGrid, NGridItem, NLayout} from "naive-ui";
</script>

<template>
    <div class="w-full h-full">
        <NLayout class="flex w-full h-full pt-13">
            <div class="w-full">
                <img src="@/assets/images/postsHeader.png" class="object-cover w-full"/>
            </div>
            <NGrid class="w-fit flex items-center justify-center" :x-gap="20" :cols="3">
                <NGridItem class="flex h-full w-full">

                </NGridItem>
            </NGrid>
        </NLayout>
    </div>
</template>

<style scoped>

</style>