import { reactive, readonly } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from "@/scripts/client";


interface AuthState {
    session: Session | null;
}

const state = reactive<AuthState>({
    session: null
})

export function useAuthStore() {
    async function checkSession() {
        const { data } = await supabase.auth.getSession()
        state.session = data.session
    }

    function updateSession(_session: Session | null) {
        state.session = _session
    }

    return {
        state: readonly(state),
        checkSession,
        updateSession
    }
}
