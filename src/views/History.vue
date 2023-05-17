<template>
    <v-container>
        <v-card>
            <v-card-title class="font-weight-bold">
                <span> IP History</span>
            </v-card-title>
            <v-divider />
            <v-card-text class="table-container">
                <v-data-table-server :headers="headers" :items="histories" :loading="loading" :items-length="total"
                    item-value="new_ip" @update:options="getHistory" multi-sort density="compact">
                </v-data-table-server>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import * as history from "@/api/history";
import { History } from '@/types/dyndns';
import { SortItem } from '@/types/vuetify';
import { ref } from "vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";

const headers = [
    { title: "old", key: "old_ip" },
    { title: "new", key: "new_ip" },
    { title: "version", key: "version" },
    { title: "updated", key: "updated" },
];


const loading = ref(true);
const total = ref(0);

const histories = ref<History[]>([]);


async function getHistory({ page, itemsPerPage, sortBy }: { page: number, itemsPerPage: number, sortBy: SortItem[] }) {
    loading.value = true;
    const result = await history.get(page, itemsPerPage, sortBy);

    histories.value = result.histories;
    total.value = result.total;
    loading.value = false;
}

</script>

