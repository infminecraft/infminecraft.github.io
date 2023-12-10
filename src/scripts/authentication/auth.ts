import {supabase} from "@/scripts/client";
import {ref} from "vue";

export async function signInWithEmail(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
}

export async function signInWithOtp(email: string) {
    return await supabase.auth.signInWithOtp({
        email: email
    })
}

export async function signOut() {
    return await supabase.auth.signOut()
}

export function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export async function isValidSession(){
    const session = ref()
    await supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
    })
    return !!session.value;
}