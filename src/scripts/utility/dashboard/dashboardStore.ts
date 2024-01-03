// postStore.ts
import {defineStore} from 'pinia'
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import type {Post} from "@/scripts/types";

export const useDashboardStore = defineStore({
    // unique id of the store across your application
    id: 'dashboardStore',
    state: () => ({
        posts: [] as Post[],
        users: []
    }),
    actions: {
        async fetchPosts(authState: any, message: any, forceRefresh: boolean = false) {
            if (this.posts.length === 0 || forceRefresh) {
                const $fetcher = useDataFetcher();
                this.posts = await $fetcher.fetchUserPosts(authState, message);
            }
            console.log(this.posts)
            return this.posts
        }
    }
})