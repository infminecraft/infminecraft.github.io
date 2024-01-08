import {supabase} from "@/scripts/client";
import {ref} from "vue";
import {useAuthStore} from "@/scripts/authentication/store";
import * as console from "console";

const session = ref();

export async function signInWithEmailAndPassword(email: string, password: string, message: any): Promise<boolean> {
    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        }, );
        if (error) throw Error
        session.value = data.session;
        useAuthStore().updateSession(session.value)
        await supabase.auth.setSession({access_token: data.session?.access_token, refresh_token: data.session?.refresh_token})
        return true;
    } catch (error: any) {
        console.log("Login error: ", error.message)
        message.error(`An error occurred whilst trying to log you in: ${error.message}`)
    }
    return false;
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

export function useAuthClient($message: any){
    function getSession(){
        return session;
    }

    /**
     * Signs out the user.
     *
     * @return {void}
     */
    async function signOut() {
        try {
            const { error} = await supabase.auth.signOut();
            if (error) throw Error
            session.value = null;
        } catch (error: any) {
            $message.error(`Error occurred while trying to sign you out: ${error?.message}`)
            // console.log(`Error occurred: ${error?.message}`)
        }
    }

    /**
     * Sign in a user with their email and password.
     *
     * @param {string} email - The user email.
     * @param {string} password - The user password.
     * @returns {Promise<boolean>} - Returns `true` if the sign-in is successful, otherwise returns `false`.
     */
    async function signIn(email: string, password: string){
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            }, );
            if (error) throw Error
            session.value = data.session;
            useAuthStore().updateSession(session.value)
            await supabase.auth.setSession({access_token: data.session?.access_token, refresh_token: data.session?.refresh_token})
            $message.success(`Signed in successfully!`)
            return true;
        } catch (error: any) {
            $message.error(`An error occurred whilst trying to log you in: ${error.message}`)
            // console.log("Login error: ", error.message)
        }
        return false;
    }

    /**
     * Resets the password for a given email address.
     *
     * @param {string} email - The email address for which to reset the password.
     * @return {Promise<boolean>} - A promise that resolves to true if the password reset email send
     * was successful, and false otherwise.
     */
    async function sendResetPasswordEmail(email: string): Promise<boolean>{
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://infminecraft.github.io/reset-password',
                // redirectTo: 'http://localhost:5173/reset-password',
            })
            if (error) throw Error
            return true;
        } catch(error: any) {
            $message.error(`An error occurred whilst trying to reset your password: ${error.message}`)
            // console.log("Reset password error: ", error.message)
        }
        return false;
    }

    /**
     * Update the user's password.
     *
     * @param {string} new_password - The new password to be set for the user.
     * @return {Promise<boolean>} A promise that resolves to true if the password update is successful, false otherwise.
     */
    async function updateUserPassword(new_password: string): Promise<boolean>{
        try {
            const { data, error } = await supabase.auth.updateUser({ password: new_password })
            if (error) throw Error
            return true;
        } catch (error: any) {
            $message.error(`An error occurred whilst trying to update your password: ${error.message}`)
            // console.log("Update password error: " + error.message)
        }
        return false;
    }

    return {
        getSession,
        signOut,
        signIn,
        sendResetPasswordEmail,
        updateUserPassword,
    }
}
