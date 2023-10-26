/// <reference types="vite/client" />
declare module 'unplugin-vue-components/vite';
declare module 'unplugin-vue-components/resolvers';

export {}

declare module '*.md' {
    const value: any;
    export default value;
}

declare module 'vue' {
    export interface GlobalComponents {
        RouterLink: typeof import('vue-router')['RouterLink']
        RouterView: typeof import('vue-router')['RouterView']
    }
}
declare module "*.vue" {
    import { ComponentOptions } from "vue";
    const Component: ComponentOptions;
    export default Component;
}

declare module "*.md" {
    import { ComponentOptions } from "vue";
    const Component: ComponentOptions;
    export default Component;
}