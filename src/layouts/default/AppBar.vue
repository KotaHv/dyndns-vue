<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <router-link
            v-for="link in links"
            :key="link.name"
            :to="{ name: link.name }"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 bg-blue-50"
          >
            {{ link.name }}
          </router-link>
        </div>
        <div class="flex items-center" v-if="auth.isAuthenticated">
          <button
            @click="logout"
            class="px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-white hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const links = reactive([{ name: 'Dyndns' }, { name: 'History' }])

const auth = useAuth()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>
