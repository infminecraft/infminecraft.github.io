<script setup lang="ts">
import {NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {ref} from "vue"
import {Home} from "@vicons/ionicons5";

const sidebarOptions : MenuOption[] = [
    {
        label: 'Server Rules 服务器规则',
        key: 'server-rules'
    }
]
const activeKey = ref("")
</script>

<template>
    <div class="w-screen">
        <NLayout class="w-full h-full flex">
            <NLayout has-sider>
                <NLayoutSider sider-placement="left">
                    <NMenu v-model:value="activeKey" :options="sidebarOptions" horizontal default-value="server-rules"/>
                </NLayoutSider>
                <NLayoutContent>

                </NLayoutContent>
                <NLayoutSider sider-placement="right">

                </NLayoutSider>
            </NLayout>
        </NLayout>
    </div>
</template>

<style scoped>

</style>