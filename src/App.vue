<template>
  <router-view />

  <div
    v-if="store.snackbar"
    class="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md z-50"
  >
    <ul class="list-disc list-inside space-y-1">
      <li v-for="error in store.errorArray" :key="error" class="text-sm">
        {{ error }}
      </li>
    </ul>
    <button
      @click="store.close"
      class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
    >
      Close
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useError } from '@/stores/error'

const store = useError()
</script>
