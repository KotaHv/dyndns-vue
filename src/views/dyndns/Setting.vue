<template>
    <v-container>
        <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">
            <v-card>
                <v-card-title class="bg-white py-4 font-weight-bold">
                    DynDNS Setting
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form ref="form">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Server</v-label>
                                <v-text-field :rules="[rules.required, rules.host]" v-model="newDynDNS.server"
                                    color="primary" variant="outlined" density="compact" placeholder="members.dyndns.org" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Username</v-label>
                                <v-text-field :rules="[rules.required]" v-model="newDynDNS.username" color="primary"
                                    variant="outlined" density="compact" placeholder="username" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Password</v-label>
                                <v-text-field :rules="[rules.required]" v-model="newDynDNS.password" color="primary"
                                    variant="outlined" density="compact" type="password" placeholder="password" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Hostname</v-label>
                                <v-text-field :rules="[rules.required, rules.host]" v-model="newDynDNS.hostname"
                                    color="primary" variant="outlined" density="compact" placeholder="yourhostname" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">IP</v-label>
                                <v-radio-group v-model="newDynDNS.ip" inline>
                                    <v-radio label="IPV4" :value="1"></v-radio>
                                    <v-radio label="IPV6" :value="2"></v-radio>
                                    <v-radio label="ALL" :value="3"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Interface</v-label>
                                <v-select :rules="[rules.required]" color="primary" variant="outlined" density="compact"
                                    v-model="newDynDNS.interface" :items="interfaces"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-label class="font-weight-medium mb-2">Sleep Interval (secs)</v-label>
                                <v-text-field :rules="[rules.unsigned]" v-model.number="newDynDNS.sleep_interval"
                                    color="primary" variant="outlined" density="compact" type="number" placeholder="10" />
                            </v-col>
                        </v-row>
                        <v-row justify="end">
                            <v-divider></v-divider>
                            <v-col cols="12" sm="3"><v-btn @click="update" block size="large" color="primary">
                                    Unpdate</v-btn></v-col>
                            <v-col cols="12" sm="2"><v-btn block size="large" @click="init">
                                    Reset</v-btn></v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
            </v-card>
        </v-sheet>
    </v-container>
</template>
  
<script setup lang="ts">
import { useDynDNS } from "@/stores/dyndns"
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router'
import { DynDNS } from "@/types/dyndns"
import { onMounted, reactive, ref } from "vue"
import { VForm } from 'vuetify/components'
import * as interfacesApi from "@/api/interfaces";

const form = ref<VForm | null>(null);

const newDynDNS: DynDNS = reactive({
    server: "",
    username: "",
    password: "",
    hostname: "",
    ip: 0,
    interface: "",
    sleep_interval: 10
});

const re_scheme = /https?:\/\//;
const re_path = /\//g;

const rules = reactive({
    required: (value: string) => !!value || 'Field is required',
    host: (value: string) => {
        if (re_scheme.test(value) || re_path.test(value)) return "only be the url host";
        return true;
    },
    unsigned: (value: number) => value > 0 || 'The value must be greater than 0',
});
const interfaces = ref<string[]>([])

const store = useDynDNS();
const { dynDNS } = storeToRefs(store);
const router = useRouter()

function init() {
    newDynDNS.server = dynDNS.value.server;
    newDynDNS.username = dynDNS.value.username;
    newDynDNS.password = dynDNS.value.password;
    newDynDNS.hostname = dynDNS.value.hostname;
    newDynDNS.ip = dynDNS.value.ip;
    newDynDNS.interface = dynDNS.value.interface;
    newDynDNS.sleep_interval = dynDNS.value.sleep_interval;
}

onMounted(async () => {
    init();
    interfaces.value = await interfacesApi.get();
})

async function update() {
    if (!form.value) {
        return;
    }
    const { valid } = await form.value.validate();
    if (!valid) {
        return;
    }
    store.$patch({ dynDNS: newDynDNS });
    await store.update();
    router.push({ name: "Dyndns" })
}
</script>