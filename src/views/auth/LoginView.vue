<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
    NButton,
    NDivider,
    NForm,
    NFormItem,
    NFormItemRow,
    NGradientText,
    NInput,
    NTabPane,
    NTabs,
    useMessage
} from "naive-ui";
import {signOut, isValidEmail} from '@/scripts/authentication/auth'
import type {FormInst} from "naive-ui/lib";
import {supabase} from "@/scripts/client";
import {RouterLink, RouterView, useRouter} from "vue-router";
import {useAuthStore} from "@/scripts/authentication/store";

function checkUrlForSupabaseSession() {
    // Get the hash from the current URL (the part after '#')
    const hash = window.location.hash.substr(1);

    // Convert the hash into an object of key-value pairs
    const params = hash.split('&').reduce((accumulator: any, pair) => {
        const [key, value] = pair.split('=');
        accumulator[key] = value;
        return accumulator;
    }, {});

    // Check if 'access_token' is present in the parsed hash object
    if (params.access_token) {
        // Pass the session details to Supabase
        supabase.auth.setSession({access_token: params.access_token, refresh_token: params.refresh_token});

        // Optionally, redirect the user to the dashboard or wherever you need
        // Assuming you have a vue-router instance named '$router'
        $router.push('/dashboard');
    }
}

onMounted(() => {
    window.location.hash = '';
    checkUrlForSupabaseSession()
})

const $router = useRouter()
const $authStore = useAuthStore()

const form = ref<FormInst | null>(null)
const message = useMessage(), emailInput = ref(''), loading = ref(false), inAuth = ref(false)

async function tryOtpLogin() {
    loading.value = true
    if (!isValidEmail(emailInput.value)) {
        message.error("Please enter a valid email format.")
        loading.value = false
        return
    }
    try {
        const {error} = await supabase.auth.signInWithOtp({
            email: emailInput.value
        })
        if (error) throw error
        message.success("Check your email for the login link.")
    } catch (error) {
        if (error instanceof Error) message.error(error.message)
        loading.value = false
        return
    }
    loading.value = false
    inAuth.value = true
}

const userSession = ref($authStore.state.session);

supabase.auth.onAuthStateChange((_event, session) => {
    userSession.value = session;
    if (session) {
        // Perform additional logic or navigation when the user logs in
        console.log('User logged in:', session);
        $router.push('/dashboard');
    }
});
</script>

<template>
    <div class="w-full min-h-screen flex justify-center items-center bg-zinc-800">
        <div class=" justify-center px-10">
            <NGradientText
                type="success" class="w-full text-center text-5xl mb-10">
                InfMinecraft Dashboard
            </NGradientText>
            <NCard>
                <NTabs default-value="signin" size="large" justify-content="space-evenly" class="px-2 pb-4"
                       v-if="!inAuth">
                    <NTabPane name="signin" tab="Sign In" class="flex-col flex gap-4">
                        <NInput v-model:value="emailInput" placeholder="Email"/>
                        <NButton :loading="loading" type="primary" block secondary strong @click="tryOtpLogin">
                            Sign In
                        </NButton>
                    </NTabPane>
                </NTabs>
                <div v-else>
                    <NGradientText :font-size="16">We've sent you an email. You should be able to log in with this
                        link.
                    </NGradientText>
                </div>
            </NCard>
            <NButton @click="$router.push('/')" class="justify-self-center w-full mt-5" text>Back to Menu</NButton>
        </div>
    </div>
</template>

<style scoped>

</style>