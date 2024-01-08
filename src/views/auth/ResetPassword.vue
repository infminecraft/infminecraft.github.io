<script setup lang="ts">
import {type FormItemRule, NCard, useMessage} from "naive-ui";
import {ref} from "vue";
import {useAuthClient} from "@/scripts/authentication/auth";
import {useRouter} from "vue-router";

const $message = useMessage();
const $auth = useAuthClient($message)
const $router = useRouter();
const isResettingPassword = ref(false)


const awaitResettingPassword = ref(false)

const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
};

const passwordInput = ref('')
const resetFormRules = {
    password: [
        {required: true, message: 'Your password cannot be null', trigger: 'blur'},
        {validator(rule: FormItemRule, value: string) {return (validatePassword(value) ? true : new Error("The password must be at least 8 characters, includes a number, an uppercase & lowercase letter, and a special character."))}, trigger: 'blur'}
    ]
}
const resetFormModel = ref({password: passwordInput})
const resetFormRef = ref(null)

async function tryResetPassword(){
    awaitResettingPassword.value = true
    await $auth.updateUserPassword(resetFormModel.value.password)
    $router.push('login')
    awaitResettingPassword.value = false
}
</script>

<template>
    <div class="w-full min-h-screen flex justify-center items-center bg-zinc-800">
        <div class="justify-center w-1/3 h-fit">
            <NCard>
                <NSpin :show="awaitResettingPassword">
                    <div class="mb-2 text-white font-bold text-lg">Enter a new password.</div>
                    <NForm :rules="resetFormRules" :model="resetFormModel" ref="resetFormRef" :disabled="awaitResettingPassword">
                        <NFormItem path="password" label="Password">
                            <NInputGroup>
                                <NInput v-model:value="passwordInput" type="password"/>
                                <NButton @click="tryResetPassword()" strong type="primary">Reset</NButton>
                            </NInputGroup>
                        </NFormItem>
                    </NForm>
                </NSpin>
            </NCard>
        </div>
    </div>
</template>

<style scoped>

</style>