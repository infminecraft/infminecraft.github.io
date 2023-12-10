import {supabase} from "@/scripts/client";
import {ref} from "vue";
import {useAuthStore} from "@/scripts/authentication/store";

const session = ref();

export async function signInWithEmail(email: string, password: string) {
    const response = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    session.value = response.data.session;
    return response;
}

export async function signInWithOtp(email: string) {
    const response = await supabase.auth.signInWithOtp({
        email: email
    });
    session.value = response.data.session;
    return response;
}

export async function signOut() {
    const response = await supabase.auth.signOut();
    session.value = null;
    return response;
}

export function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function useSession() {
    if (!session.value) {
        supabase.auth.getSession().then(({ data }) => {
            session.value = data.session;
        });
    }

    // listen for changes to the authentication state
    supabase.auth.onAuthStateChange((event, newSession) => {
        session.value = newSession;
    });

    // Returns a readonly ref to avoid external modifications
    return ref(session.value);
}

// You could also provide an additional function to manually check and update the session:
export async function checkAndUpdateSession() {
    const { data } = await supabase.auth.getSession();
    session.value = data.session;
}

function isAuthenticated() {
    const { state } = useAuthStore();
    return !!state.session;
}
// Use this in components where you need to react to session changes
