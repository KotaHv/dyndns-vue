<template>
  <v-app>
    <default-bar />
    <default-view />
    <v-snackbar v-model="store.snackbar">
      <li v-for="error in store.errorArray" :key="error">
        {{ error }}
      </li>

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="store.close">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
import { useError } from '@/stores/error'

const store = useError();
</script>
