import axios from "axios";
import {supabase} from "@/scripts/client";

/**
 * Fetches GitHub data from the given API endpoints.
 *
 * @param {any} message - The message object to display error message.
 * @returns {Promise<object>} - An object containing issues and pull requests data from GitHub.
 * @throws {Error} - Throws an error if there is an issue fetching the data.
 */
export const useDataFetcher = () => {
    /**
     * Fetches GitHub data from the given API endpoints.
     *
     * @param message - The message object to display error message.
     * @returns An object containing issues and pull requests data from GitHub.
     * @throws Throws an error if there is an issue fetching the data.
     */
    async function fetchGitHubData(message: any) {
        const issuesUrl = 'https://api.github.com/repos/infminecraft/infminecraft.github.io/issues?state=all';
        const pullsUrl = 'https://api.github.com/repos/infminecraft/infminecraft.github.io/pulls?state=all';

        console.log("Started Fetching Data")

        try {
            const [issueResponse, pullResponse] = await Promise.all([
                axios.get(issuesUrl),
                axios.get(pullsUrl)
            ]);

            console.log("Finished Fetching Data")
            return {issues: issueResponse.data, pull_requests: pullResponse.data}
        } catch (error) {
            console.log("Fetch Data Error")
            if (error instanceof Error) {
                message.error('Error fetching GitHub data: ' + error.message);
            }
        }
    }

    /**
     * Retrieves a list of users' profiles from the database.
     *
     * @param {any} message - The message object used for displaying notifications.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of user profiles, or an empty array if there are no profiles found. If an error occurs, the promise will be rejected
     * with an error message.
     */
    async function getUsers(message: any) {

        const { data, error } = await supabase
            .from('profiles')
            .select('*')

        if (data) {
            // message.info('Number of authenticated users: ' + data.length)
        } else {
            message.error('Error fetching users: ' + error?.message)
        }
        return data;
    }

    /**
     * Retrieves the user profile from the database.
     *
     * @param {any} state - The current state of the application.
     * @param {any} message - The message object used for displaying error messages.
     * @returns {Promise<object|undefined>} - A promise that resolves to the user profile object if found, or undefined if no profile is found.
     */
    async function getProfile(state: any, message: any) {
        if (!state.session) {
            // Handle the case where there is no session, e.g., redirect to login or show a message.
            message.error('No session found. Please login again.');
            return;
        }

        try {
            console.log("Started Fetch User Profiles")
            // loading.value = true
            const user = state.session.user

            const {data, error, status} = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) throw error

            if (data) {
                return {username: data.username, website: data.website, avatar_url: data.avatar_url}
            }
        } catch (error) {
            if (error instanceof Error) message.error(error.message)
            else message.error("An Unexpected Error occurred")
            console.log("Error Fetch User Profiles")
        }
        console.log("Finished Fetch User Profiles")
    }

    /**
     * Fetches posts of a particular user.
     *
     * @param {object} state - The state object containing session information.
     * @param {object} message - The message object used for displaying error messages.
     * @returns {Promise<Array<object>>} - A promise that resolves to an array of post objects.
     */
    async function fetchUserPosts(state: any, message: any) {
        if (!state.session) {
            // Handle the case where there is no session, e.g., redirect to login or show a message.
            message.error('No session found. Please login again.');
            return [];
        }
        try {
            console.log("Started Fetch User Posts")
            let userId = state.session.user.id
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('author_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return posts || []
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error("An error occurred while fetching posts. Please refresh the page and try again.");
            }
            console.log("Error Fetch User Posts")
            return [];
        }
        console.log("Finished Fetch User Posts")
    }

    /**
     * Updates the profile information of a user.
     *
     * @param {any} state - The application state.
     * @param {string} username - The new username.
     * @param {string} website - The new website URL.
     * @param {string} avatar_url - The new avatar URL.
     * @param {any} message - The message object used for showing error messages.
     * @return {Promise<void>} - A Promise that resolves if the profile is updated successfully or rejects with an error.
     */
    async function updateProfile(state: any, username: string, website: string, avatar_url: string, message: any) {
        if (!state.session) {
            // Handle the case where there is no session, e.g., redirect to login or show a message.
            message.error('No session found. Please login again.');
            return;
        }
        try {
            const user = state.session.user

            const updates = {
                id: user.id,
                username: username,
                website: website,
                avatar_url: avatar_url,
                updated_at: new Date(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)

            if (error) throw error
        } catch (error) {
            if (error instanceof Error) message.error(error.message)
        }
    }

    /**
     * Signs out the user.
     *
     * @param {any} message - The message object to show error messages.
     * @returns {Promise<void>} - A promise that resolves when the user has been successfully signed out or rejects with an error.
     */
    async function signOut(message: any) {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) message.error(error.message)
        }
    }

    /**
     * Deletes posts with the given IDs from the 'posts' table in the Supabase database.
     *
     * @param {number[]} ids - An array of post IDs to delete.
     * @param author_id
     * @param {any} message - The message object used for displaying error messages.
     *
     * @returns {Promise<void>} - A Promise that resolves when all the posts have been deleted successfully.
     * @throws {Error} - If any error occurs during the deletion process.
     */
    async function deletePosts(ids: number[], author_id: string, message: any) {
        for(let i = 0; i < ids.length; i++) {
            try {
                console.log(ids)
                const {error} = await supabase
                    .from('posts')
                    .delete()
                    .in('postId', ids)
                    .eq('author_id', author_id)

                if (error) {
                    console.log(error.message)
                    message.error('Error: ' + error.message)
                } else {
                    console.log(`Finished post deletion of ${ids.join(', ')}`)
                }

            } catch (error) {
                if (error instanceof Error) {
                    message.error('Error: ' + error.message)
                    console.log(error.message)
                }
            }
        }
    }

    /**
     * Creates a new post with the provided title and content and inserts it into the 'posts' table.
     *
     * @param {string} title - The title of the post.
     * @param {string} content - The content of the post.
     * @param {string} author_id - The UUID of the author for the post.
     * @param {any} message - The message object used for displaying notifications or errors.
     *
     * @returns {Promise<void>}
     */
    async function publishPost(title: string, content: string, author_id: string, message: any): Promise<void> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    { title, content, author_id }
                ]);

            if (error)
                throw new Error(error.message);

            // Optionally, use the returned 'data' to do something, e.g., show success message with the post details
            console.log('New post created: ', data);
            message.success('Post created successfully');
        } catch (error: any) {
            // Log the error and show it to the user
            console.error('Error creating post: ', error);
            message.error(`Error creating post: ${error.message}`);
        }
    }
    return {
        fetchGitHubData,
        getUsers,
        getProfile,
        fetchUserPosts,
        updateProfile,
        signOut,
        deletePosts,
        publishPost,
    };
}