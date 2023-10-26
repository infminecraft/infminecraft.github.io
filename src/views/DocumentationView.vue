<script setup lang="ts">
import {
    NAffix,
    NAnchor,
    NAnchorLink, NH1, NH2,
    NLayout,
    NLayoutContent,
    NLayoutHeader,
    NLayoutSider, NList, NListItem,
    NMenu, NScrollbar,
    NText,
    NAlert
} from "naive-ui";
import type {MenuOption} from "naive-ui";
import {onMounted, onUnmounted, ref} from "vue"
import {Home} from "@vicons/ionicons5";
import RuleOneComponent from "@/assets/docs/views/rules/Rule1.vue";
import RuleTwoComponent from "@/assets/docs/views/rules/Rule2.vue";
import Copyrighter from "@/components/Copyrighter.vue";

const sidebarOptions : MenuOption[] = [
    {
        label: 'Server Rules 服务器规则',
        key: 'server-rules'
    }
]
const activeKey = ref("")
const containerRef = ref<HTMLElement | undefined>(undefined);
</script>

<template>
    <div class="w-full">
        <NLayout class="w-full h-full flex">
<!--            <NLayoutHeader class="w-full h-full">-->
<!--                <img src="@/assets/images/bg5.png" alt="Header" class="object-cover w-full"/>-->
<!--            </NLayoutHeader>-->
            <NLayout has-sider class="h-screen w-full pt-14">
                <NLayoutSider sider-placement="left" show-trigger="bar">
                    <NMenu v-model:value="activeKey" :options="sidebarOptions" vertical default-value="server-rules"/>
                </NLayoutSider>
                <NScrollbar>
                    <NLayoutContent class="w-fit">
                        <img src="@/assets/images/docsHeader.png" alt="Header" class="object-cover w-full"/>
                        <div class="w-fit h-full p-10">
                            <RuleOneComponent id="r1"/>
                            <RuleTwoComponent id="r2"/>
                        </div>
                    </NLayoutContent>
                    <Copyrighter/>
                </NScrollbar>
                <NLayoutSider sider-placement="right">
                    <div class="w-fit h-fit p-3">
                        <NAnchor :show-rail="true" :show-background="true" class="w-fit">
                            <NAnchorLink title="Rule 1 规则一" href="#r1">
                                <NAnchorLink title="1.1" href="#r1.1"/>
                                <NAnchorLink title="1.2" href="#r1.2"/>
                                <NAnchorLink title="1.3" href="#r1.3"/>
                                <NAnchorLink title="1.4" href="#r1.4"/>
                            </NAnchorLink>
                            <NAnchorLink title="Rule 2 规则二" href="#r2">
                                <NAnchorLink title="2.1" href="#r2.1"/>
                                <NAnchorLink title="2.2" href="#r2.2"/>
                                <NAnchorLink title="2.3" href="#r2.3"/>
                                <NAnchorLink title="2.3.1" href="#r2.3.1"/>
                                <NAnchorLink title="2.4" href="#r2.4"/>
                                <NAnchorLink title="2.5" href="#r2.5"/>
                                <NAnchorLink title="2.6" href="#r2.6"/>
                                <NAnchorLink title="2.7" href="#r2.7"/>
                            </NAnchorLink>
                        </NAnchor>
                    </div>
                </NLayoutSider>
            </NLayout>
        </NLayout>
    </div>
</template>

<style scoped>

</style>