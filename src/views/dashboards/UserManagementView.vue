<script setup lang="ts">
import {ref, onMounted} from "vue"
import {
    NButton,
    NButtonGroup,
    NDataTable,
    NDivider,
    NForm,
    NFormItem,
    NModal,
    NScrollbar,
    NSkeleton,
    NSwitch
} from "naive-ui";
import {MdEditor} from "md-editor-v3";
const props = defineProps({
    authStore: Object
})
const loadingPage = ref(false)

onMounted(async () => {
    loadingPage.value = true;

    loadingPage.value = false;
})

</script>

<template>
    <div class="w-full h-full">
        <div class="w-full flex">
            <div class="flex-grow font-bold text-4xl">Users 用户</div>
        </div>
        <NDivider/>
        <div class="w-full h-full" v-if="!loadingPage">
            <div class="neon-effect text-4xl">去你的 老子还没做完</div>
        </div>
        <div class="w-full h-full" v-else>
            <NSkeleton height="100px"/>
        </div>
    </div>
</template>

<style scoped>

</style>