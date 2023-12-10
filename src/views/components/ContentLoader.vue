<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { supabase } from '@/scripts/client';
import {NGradientText} from "naive-ui";

const loading = ref(true);
const $router = useRouter();

onMounted(async () => {
    // Check user session and navigate accordingly
    const session = ref()
    await supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
    })

    if(!session.value && $router.currentRoute.value.name == 'dashboard') {
        await $router.push("login")
    }

    supabase.auth.onAuthStateChange((_, _session) => {
        session.value = _session
        if(!session.value && $router.currentRoute.value.name == 'dashboard') {
            $router.push("login")
        }
    })

    // At this point, the router-view component routed to should be mounted
    // since onMounted in ContentLoader gets called after router-view children's onMounted gets called

    // Call the fetchData function in the routed component

    // Example:
    //
    // let componentInstance = getCurrentInstance();
    // if (componentInstance && componentInstance.proxy && 'fetchData' in componentInstance.proxy) {
    //   await componentInstance.proxy.fetchData();
    // }
    loading.value = false;
});
</script>

<template>
    <div>
        <div v-if="loading" class="min-h-screen w-full bg-zinc-800 flex items-center align-middle justify-center">
            <NSpin :show="loading">
                <template #description>
                    <NGradientText font-size="16">Loading Page Content...</NGradientText>
                </template>
            </NSpin>
        </div>
        <div v-else>
            <!-- Default slot that gets replaced by wrapped content -->
            <slot/>
        </div>
    </div>
</template>

<style scoped>

</style>