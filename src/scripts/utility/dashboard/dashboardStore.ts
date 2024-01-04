// postStore.ts
import {defineStore} from 'pinia'
import {useDataFetcher} from "@/scripts/utility/dashboard/fetch";
import type {Post, User} from "@/scripts/types";

export const useDashboardStore = defineStore({
    // unique id of the store across your application
    id: 'dashboardStore',
    state: () => ({
        posts: [] as Post[],
        user: null as User | null,
        users: [] as User[]
    }),
    actions: {
        async fetchPosts(state: any, message: any, forceRefresh: boolean = false) {
            if (this.posts.length === 0 || forceRefresh) {
                const $fetcher = useDataFetcher();
                this.posts = await $fetcher.fetchUserPosts(state, message);
            }
            console.log(this.posts)
            return this.posts
        },
        async fetchUser(state: any, message: any, forceRefresh: boolean = false){
            if(this.user === null || forceRefresh){
                const $fetcher = useDataFetcher();
                const user = await $fetcher.getProfile(state, message);
                this.user = user || null;
            }
            console.log(this.user)
            return this.user
        },
        async fetchUsers(message: any, forceRefresh: boolean = false){
            if(this.users.length == null || this.users.length === 0 || forceRefresh){
                const $fetcher = useDataFetcher();
                const users = await $fetcher.getUsers(message);
                this.users = users || [];
            }
            console.log(this.users)
            return this.users
        },
    }
})