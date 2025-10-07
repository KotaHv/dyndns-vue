<template>
  <div class="space-y-6">
    <!-- IPv4 Card -->
    <div v-if="v4.show" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2>IPv4</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr] gap-6">
          <div>
            <label class="block mb-1">Old</label>
            <div class="font-mono text-gray-900 space-y-1">
              <template v-if="splitIps(v4.old).length">
                <p
                  v-for="(ip, index) in splitIps(v4.old)"
                  :key="`v4-old-${index}`"
                  class="break-all sm:break-normal sm:whitespace-nowrap sm:overflow-x-auto"
                >
                  {{ ip }}
                </p>
              </template>
              <p v-else>-</p>
            </div>
          </div>
          <div>
            <label class="block mb-1">Current</label>
            <div class="font-mono text-gray-900 space-y-1">
              <template v-if="splitIps(v4.current).length">
                <p
                  v-for="(ip, index) in splitIps(v4.current)"
                  :key="`v4-current-${index}`"
                  class="break-all sm:break-normal sm:whitespace-nowrap sm:overflow-x-auto"
                >
                  {{ ip }}
                </p>
              </template>
              <p v-else>-</p>
            </div>
          </div>
          <div>
            <label class="block mb-1">Updated</label>
            <p class="font-mono text-gray-900">{{ v4.updated }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- IPv6 Card -->
    <div v-if="v6.show" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2>IPv6</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr] gap-6">
          <div>
            <label class="block mb-1">Old</label>
            <div class="font-mono text-gray-900 space-y-1">
              <template v-if="splitIps(v6.old).length">
                <p
                  v-for="(ip, index) in splitIps(v6.old)"
                  :key="`v6-old-${index}`"
                  class="break-all sm:break-normal sm:whitespace-nowrap sm:overflow-x-auto"
                >
                  {{ ip }}
                </p>
              </template>
              <p v-else>-</p>
            </div>
          </div>
          <div>
            <label class="block mb-1">Current</label>
            <div class="font-mono text-gray-900 space-y-1">
              <template v-if="splitIps(v6.current).length">
                <p
                  v-for="(ip, index) in splitIps(v6.current)"
                  :key="`v6-current-${index}`"
                  class="break-all sm:break-normal sm:whitespace-nowrap sm:overflow-x-auto"
                >
                  {{ ip }}
                </p>
              </template>
              <p v-else>-</p>
            </div>
          </div>
          <div>
            <label class="block mb-1">Updated</label>
            <p class="font-mono text-gray-900">{{ v6.updated }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- DynDNS Configuration Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2>DynDNS Configuration</h2>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block mb-1">Server</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.server }}</p>
          </div>
          <div>
            <label class="block mb-1">Username</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.username }}</p>
          </div>
          <div>
            <label class="block mb-1">Password</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.password }}</p>
          </div>
          <div>
            <label class="block mb-1">Hostname</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.hostname }}</p>
          </div>
          <div>
            <label class="block mb-1">IP Version</label>
            <p class="break-words break-all sm:break-normal">{{ ip }}</p>
          </div>
          <div>
            <label class="block mb-1">Interface</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.interface }}</p>
          </div>
          <div>
            <label class="block mb-1">Sleep Interval (secs)</label>
            <p class="break-words break-all sm:break-normal">{{ dynDNS.sleepInterval }}</p>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <router-link
          :to="settingRouter"
          class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go To Edit
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, reactive } from 'vue'
import { useDynDNS } from '@/stores/dyndns'
import { storeToRefs } from 'pinia'
import * as api from '@/api/history'
import { HistoryIpVersion } from '@/types/history'

const settingRouter = { name: 'DyndnsSetting' }
const store = useDynDNS()
const { dynDNS } = storeToRefs(store)
const ipText = ['ipv4', 'ipv6', 'ipv4&ipv6']

const ip = computed(() => {
  return ipText[dynDNS.value.ip - 1]
})

const v4 = reactive({
  old: '',
  current: '',
  updated: '',
  show: false,
})

const v6 = reactive({
  old: '',
  current: '',
  updated: '',
  show: false,
})

const splitIps = (value: string) =>
  value
    ? value
        .split(',')
        .map((ip) => ip.trim())
        .filter((ip) => ip.length > 0)
    : []

onMounted(async () => {
  await store.getDynDNS()
  if (dynDNS.value.ip == 1 || dynDNS.value.ip == 3) {
    const res = await api.current(HistoryIpVersion.V4)
    if (res != null) {
      v4.old = res.oldIp || ''
      v4.current = res.newIp
      v4.updated = res.updated
      v4.show = true
    }
  }
  if (dynDNS.value.ip == 2 || dynDNS.value.ip == 3) {
    const res = await api.current(HistoryIpVersion.V6)
    if (res != null) {
      v6.old = res.oldIp || ''
      v6.current = res.newIp
      v6.updated = res.updated
      v6.show = true
    }
  }
})
</script>
