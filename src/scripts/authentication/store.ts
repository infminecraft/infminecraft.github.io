import { reactive, readonly } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from "@/scripts/client";


interface AuthState {
    session: Session | null;
}

const state = reactive<AuthState>({
    session: null
})

/**
 * Returns an object containing the state of the authentication session,
 * and functions to check and update the session.
 *
 * @returns {Object} The object containing the state and the functions.
 */
export function useAuthStore() {
    async function checkSession() {
        const { data } = await supabase.auth.getSession()
        state.session = data.session
    }

    function updateSession(_session: Session | null) {
        state.session = _session
    }

    return {
        state,
        checkSession,
        updateSession
    }
}
