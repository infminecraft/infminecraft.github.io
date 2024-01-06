import axios from "axios";
import {supabase} from "@/scripts/client";
import type {User} from "@/scripts/types";

/**
 * Fetches GitHub data from the given API endpoints.
 *
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
    async function fetchGitHubData(message: any): Promise<{ issues: any; pull_requests: any; } | undefined> {
        const issuesUrl = 'https://api.github.com/repos/infminecraft/infminecraft.github.io/issues?state=all';
        const pullsUrl = 'https://api.github.com/repos/infminecraft/infminecraft.github.io/pulls?state=all';

        console.log("Started Fetching Github Data")

        try {
            const [issueResponse, pullResponse] = await Promise.all([
                axios.get(issuesUrl),
                axios.get(pullsUrl)
            ]);

            console.log("Finished Fetching Github Data")
            console.log(issueResponse.data)
            console.log(pullResponse.data)
            return {issues: issueResponse.data, pull_requests: pullResponse.data}
        } catch (error) {
            console.log("Fetch Github Data Error")
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
    async function getProfile(state: any, message: any): Promise<User | null | undefined> {
        if (!state.session) {
            // Handle the case where there is no session, e.g., redirect to log in or show a message.
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
                return {username: data.username, website: data.website, avatar_url: data.avatar_url, id: user.id}
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
    async function publishPost(title: string, content: string, author_id: string, slug: string, message: any): Promise<void> {
        try {
            const slug = title.toLowerCase().replace(/\s+/g, '-');
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    { title, content, author_id, slug }
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

    /**
     * Fetches user profile data based on the author_id from the 'profiles' table.
     *
     * @param {string} user_id - The UUID of the author whose profile data is to be retrieved.
     *
     * @returns {Promise<any>}
     */
    async function fetchUserProfile(user_id: string | any): Promise<any> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user_id)
                .single();

            if (error) {
                throw new Error(typeof(error) == undefined ? "Unable to fetch user profile due to unknown errors." : error?.message);
            }

            console.log('User profile data: ', data);
            return data;
        } catch (error: any) {
            console.error('Error fetching user profile: ', error);
        }
    }

    /**
     * Edits a post using the provided post ID, modified title, and content.
     *
     * @param {string} author_id - The UUID of the author of the post.
     * @param {number} postId - The ID of the post to be edited.
     * @param {string} modifiedTitle - The new title for the post.
     * @param {string} modifiedContent - The new content for the post.
     * @param modifiedSlug
     * @param {any} message - The message object used for displaying notifications or errors.
     *
     * @returns {Promise<void>}
     */
    async function editUserPost(author_id: string, postId: number, modifiedTitle: string, modifiedContent: string, modifiedSlug: string, message: any): Promise<void> {
        try {
            console.log("Validating Post Data....")
            // Attempt to fetch the existing post first to verify it belongs to the author
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('*')
                .eq('postId', postId)
                .eq('author_id', author_id)
                .single();

            if (postError) {
                throw new Error(postError.message);
            }

            if (!postData) {
                throw new Error('Post not found or you do not have permission to edit this post.');
            }
            console.log("Validated.\nUploading edited data...")
            // Perform the update operation
            const { data, error } = await supabase
                .from('posts')
                .update({ title: modifiedTitle, content: modifiedContent, slug: modifiedSlug })
                .match({ postId: postId, author_id: author_id });

            if (error) {
                throw new Error(error.message);
            }

            // Optionally, use the returned 'data' to do something, e.g., show success message
            console.log('Post updated: ', data);
            message.success('Post edited successfully');
        } catch (error: Error | any) {
            // Log the error and show it to the user
            console.error('Error editing post: ', error);
            message.error(`Error editing post: ${error?.message}`);
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
        fetchUserProfile,
        editUserPost,
    };
}