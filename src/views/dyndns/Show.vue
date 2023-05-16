<template>
    <v-container>
        <v-sheet v-if="v4.show" elevation="0" class="mx-auto mb-2" color="transparent" max-width="1600">
            <v-card>
                <v-card-title class="bg-white py-4 font-weight-bold">
                    IPV4
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">old</v-label>
                            <h3>{{ v4.old }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">current</v-label>
                            <h3>{{ v4.current }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">updated</v-label>
                            <h3>{{ v4.updated }}</h3>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-sheet>
        <v-sheet v-if="v6.show" elevation="0" class="mx-auto mb-2" color="transparent" max-width="1600">
            <v-card>
                <v-card-title class="bg-white py-4 font-weight-bold">
                    IPV6
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">old</v-label>
                            <h3>{{ v6.old }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">current</v-label>
                            <h3>{{ v6.current }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">updated</v-label>
                            <h3>{{ v6.updated }}</h3>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-sheet>
        <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">
            <v-card>
                <v-card-title class="bg-white py-4 font-weight-bold">
                    DynDNS
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Server</v-label>
                            <h3>{{ dynDNS.server }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Username</v-label>
                            <h3>{{ dynDNS.username }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Password</v-label>
                            <h3>{{ dynDNS.password }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Hostname</v-label>
                            <h3>{{ dynDNS.hostname }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">IP</v-label>
                            <h3>{{ ip }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Interface</v-label>
                            <h3>{{ dynDNS.interface }}</h3>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-label class="font-weight-medium mb-2">Sleep Interval (secs)</v-label>
                            <h3>{{ dynDNS.sleep_interval }}</h3>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-5">
                    <v-spacer></v-spacer>
                    <v-btn class="px-5" color="primary" elevation="1" variant="elevated" :to="settingRouter">
                        Go To Edit</v-btn>
                </v-card-actions>
            </v-card>
        </v-sheet>
    </v-container>
</template>
  
<script setup lang="ts">
import { onMounted, computed, reactive } from 'vue';
import { useDynDNS } from "@/stores/dyndns"
import { storeToRefs } from "pinia";
import * as api from "@/api/history";
import { HistoryIpVersion } from "@/types/dyndns"

const settingRouter = { name: "DyndnsSetting" }
const store = useDynDNS();
const { dynDNS } = storeToRefs(store);
const ipText = ["ipv4", "ipv6", "ipv4&ipv6"];

const ip = computed(() => {
    return ipText[dynDNS.value.ip - 1];
})

const v4 = reactive({
    old: "",
    current: "",
    updated: "",
    show: false
})

const v6 = reactive({
    old: "",
    current: "",
    updated: "",
    show: false
})

onMounted(async () => {
    await store.getDynDNS()
    if (dynDNS.value.ip == 1 || dynDNS.value.ip == 3) {
        const res = await api.current(HistoryIpVersion.V4);
        if (res != null) {
            v4.old = res.old_ip || "";
            v4.current = res.new_ip;
            v4.updated = res.updated;
            v4.show = true;
        }
    }
    if (dynDNS.value.ip == 2 || dynDNS.value.ip == 3) {
        const res = await api.current(HistoryIpVersion.V6);
        if (res != null) {
            v6.old = res.old_ip || "";
            v6.current = res.new_ip;
            v6.updated = res.updated;
            v6.show = true;
        }
    }
})
</script>