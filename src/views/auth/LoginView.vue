<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
    type FormItemRule, NAvatar,
    NButton, NCollapseTransition,
    NDivider,
    NForm,
    NFormItem,
    NFormItemRow,
    NGradientText, NIcon,
    NInput, NSpin,
    NTabPane,
    NTabs,
    useMessage
} from "naive-ui";
import {isValidEmail, useAuthClient} from '@/scripts/authentication/auth'
import type {FormInst} from "naive-ui/lib";
import {supabase} from "@/scripts/client";
import {RouterLink, RouterView, useRouter} from "vue-router";
import {useAuthStore} from "@/scripts/authentication/store";
import {ArrowForward} from "@vicons/ionicons5"

const $router = useRouter()
const $authStore = useAuthStore()
const $message = useMessage()
const $auth = useAuthClient($message)

const isResettingPassword = ref(false)

const loginFormRules = {
    email: [
        {required: true, message: 'Please enter your email', trigger: 'blur'},
        {validator(rule: FormItemRule, value: string) {return (isValidEmail(value) ? true : new Error("Please enter a proper email format."))}, trigger: 'blur'}
    ]
}
const loginFormModel = ref({email: ''})
const loginFormRef = ref(null)

const passwordInput = ref(''), awaitLogin = ref(false), inAuth = ref(false)

async function tryLogin() {
    awaitLogin.value = true
    if (!isValidEmail(loginFormModel.value.email)) {
        $message.error("Please enter a valid email format.")
        awaitLogin.value = false
        return
    }
    let success = await $auth.signIn(loginFormModel.value.email, passwordInput.value)
    if (success) await $router.push('dashboard');
    awaitLogin.value = false
}

const awaitSendingEmail = ref(false), emailInput = ref('')
async function trySendResetEmail(){
    awaitSendingEmail.value = true
    isResettingPassword.value = await $auth.sendResetPasswordEmail(emailInput.value)
    awaitSendingEmail.value = false
}
</script>

<template>
    <div class="w-full min-h-screen flex justify-center items-center bg-zinc-800">
        <div class=" justify-center px-10">
            <NGradientText
                type="success" class="w-full text-center text-5xl mb-10">
                InfMinecraft Dashboard
            </NGradientText>
            <NCard v-if="!isResettingPassword">
                <NCollapseTransition :show="!awaitLogin">
                    <NTabs default-value="signin" size="large" justify-content="space-evenly" class="px-2 pb-4">
                        <NTabPane name="signin" tab="Sign In" class="flex-col flex gap-4">
                            <NForm :on-submit="tryLogin" :rules="loginFormRules" :model="loginFormModel" ref="loginFormRef">
                                <NFormItem path="title" label="Email">
                                    <NInput v-model:value="loginFormModel.email" placeholder="Email"/>
                                </NFormItem>
                                <NFormItem path="password" label="Password">
                                    <NInput v-model:value="passwordInput" placeholder="Password" type="password"/>
                                </NFormItem>
                            </NForm>
                            <NButton :loading="awaitLogin" type="primary" block secondary strong @click="tryLogin">
                                Sign In
                            </NButton>
                            <NButton class="flex-row flex gap-2" text @click="isResettingPassword = true"><div class="mr-1">Forgot your password?</div><NIcon><ArrowForward/></NIcon></NButton>
                        </NTabPane>
                        <NTabPane name="signup" tab="Sign Up" class="flex-col flex gap-4">
                            <div>This feature is still unfinished. Come back later.</div>
                        </NTabPane>
                    </NTabs>
                </NCollapseTransition>
                <NCollapseTransition :show="awaitLogin" class="flex justify-center">
                    <NSpin class="justify-center items-center">
                        <template #description>
                            Please wait over a cup of hot coffee...
                        </template>
                    </NSpin>
                </NCollapseTransition>
            </NCard>
            <NCard v-else class="flex flex-col">
                <NSpin :show="awaitSendingEmail" class="flex flex-col">
                    <div class="font-bold text-lg text-center mb-4">Enter your email to reset your password.</div>
                    <NInputGroup>
                        <NInput v-model:value="emailInput" placeholder="Email"/>
                        <NButton @click="trySendResetEmail()" strong type="primary">Validate</NButton>
                    </NInputGroup>
                    <div class="flex-row flex mt-3">
                        <NButton class="gap-2 justify-center flex-grow" text @click="isResettingPassword = false">
                            <div class="mr-1 justify-center text-center">Remembered your password?</div>
                            <NIcon><ArrowForward/></NIcon>
                        </NButton>
                    </div>
                </NSpin>
            </NCard>
            <NButton @click="$router.push('/')" class="justify-self-center w-full mt-5" text>Back to Menu</NButton>
        </div>
    </div>
</template>

<style scoped>

</style>