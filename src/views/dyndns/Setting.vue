<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1>DynDNS Setting</h1>
      </div>

      <form @submit.prevent="update" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Server -->
          <div>
            <label class="block mb-2">Server</label>
            <input
              v-model="newDynDNS.server"
              type="text"
              placeholder="members.dyndns.org"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': serverError }"
            />
            <p v-if="serverError" class="mt-1 text-sm text-red-600">{{ serverError }}</p>
          </div>

          <!-- Username -->
          <div>
            <label class="block mb-2">Username</label>
            <input
              v-model="newDynDNS.username"
              type="text"
              placeholder="username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': usernameError }"
            />
            <p v-if="usernameError" class="mt-1 text-sm text-red-600">{{ usernameError }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block mb-2">Password</label>
            <input
              v-model="newDynDNS.password"
              type="password"
              placeholder="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': passwordError }"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <!-- Hostname -->
          <div>
            <label class="block mb-2">Hostname</label>
            <input
              v-model="newDynDNS.hostname"
              type="text"
              placeholder="yourhostname"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': hostnameError }"
            />
            <p v-if="hostnameError" class="mt-1 text-sm text-red-600">{{ hostnameError }}</p>
          </div>

          <!-- IP Version -->
          <div>
            <label class="block mb-2">IP</label>
            <div class="flex space-x-6">
              <label class="flex items-center">
                <input
                  v-model="newDynDNS.ip"
                  type="radio"
                  :value="1"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">IPV4</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="newDynDNS.ip"
                  type="radio"
                  :value="2"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">IPV6</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="newDynDNS.ip"
                  type="radio"
                  :value="3"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">ALL</span>
              </label>
            </div>
          </div>

          <!-- Interface -->
          <div>
            <label class="block mb-2">Interface</label>
            <select
              v-model="newDynDNS.interface"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': interfaceError }"
            >
              <option value="">Select interface</option>
              <option v-for="iface in interfaces" :key="iface" :value="iface">
                {{ iface }}
              </option>
            </select>
            <p v-if="interfaceError" class="mt-1 text-sm text-red-600">{{ interfaceError }}</p>
          </div>

          <!-- Sleep Interval -->
          <div>
            <label class="block mb-2"
              >Sleep Interval (secs)</label
            >
            <input
              v-model.number="newDynDNS.sleep_interval"
              type="number"
              placeholder="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': sleepIntervalError }"
            />
            <p v-if="sleepIntervalError" class="mt-1 text-sm text-red-600">
              {{ sleepIntervalError }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="init"
            class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDynDNS } from '@/stores/dyndns'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { DynDNS } from '@/types/dyndns'
import { onMounted, reactive, ref, computed } from 'vue'
import * as interfacesApi from '@/api/interfaces'

const newDynDNS: DynDNS = reactive({
  server: '',
  username: '',
  password: '',
  hostname: '',
  ip: 3,
  interface: '',
  sleep_interval: 10,
})

const re_scheme = /https?:\/\//
const re_path = /\//g

const interfaces = ref<string[]>([])

const store = useDynDNS()
const { dynDNS } = storeToRefs(store)
const router = useRouter()

// Form validation computed properties
const serverError = computed(() => {
  if (!newDynDNS.server) return 'Field is required'
  if (re_scheme.test(newDynDNS.server) || re_path.test(newDynDNS.server))
    return 'only be the url host'
  return ''
})

const usernameError = computed(() => {
  if (!newDynDNS.username) return 'Field is required'
  return ''
})

const passwordError = computed(() => {
  if (!newDynDNS.password) return 'Field is required'
  return ''
})

const hostnameError = computed(() => {
  if (!newDynDNS.hostname) return 'Field is required'
  if (re_scheme.test(newDynDNS.hostname) || re_path.test(newDynDNS.hostname))
    return 'only be the url host'
  return ''
})

const interfaceError = computed(() => {
  if (!newDynDNS.interface) return 'Field is required'
  return ''
})

const sleepIntervalError = computed(() => {
  if (newDynDNS.sleep_interval <= 0) return 'The value must be greater than 0'
  return ''
})

const isFormValid = computed(() => {
  return (
    !serverError.value &&
    !usernameError.value &&
    !passwordError.value &&
    !hostnameError.value &&
    !interfaceError.value &&
    !sleepIntervalError.value
  )
})

function init() {
  newDynDNS.server = dynDNS.value.server
  newDynDNS.username = dynDNS.value.username
  newDynDNS.password = dynDNS.value.password
  newDynDNS.hostname = dynDNS.value.hostname
  newDynDNS.ip = dynDNS.value.ip
  newDynDNS.interface = dynDNS.value.interface
  newDynDNS.sleep_interval = dynDNS.value.sleep_interval
}

onMounted(async () => {
  init()
  interfaces.value = await interfacesApi.get()
  if (!newDynDNS.interface && interfaces.value.length > 0) {
    newDynDNS.interface = interfaces.value[0]
  }
})

async function update() {
  if (!isFormValid.value) {
    return
  }
  store.$patch({ dynDNS: newDynDNS })
  await store.update()
  router.push({ name: 'Dyndns' })
}
</script>
