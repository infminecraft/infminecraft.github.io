<script setup lang="ts">

import {toRefs, ref} from "vue";

const props = defineProps({
    loading: Boolean
})
</script>

<template>
    <div>
        <div v-if="props.loading" class="min-h-screen w-full bg-zinc-800 flex items-center align-middle justify-center">
            <NSpin :show="props.loading">
                <template #description>
                    <NGradientText font-size="16">Loading Page Content...</NGradientText>
                </template>
            </NSpin>
        </div>
        <div v-else>
            <slot/>
        </div>
    </div>
</template>

<!-- ... rest of your code ... -->


<style scoped>

</style>