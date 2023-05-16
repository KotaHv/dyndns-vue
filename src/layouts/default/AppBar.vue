<template>
  <v-app-bar flat>
    <v-container class="fill-height d-flex align-center">
      <v-btn v-for="link in links" :key="link.name" :to="link" exact variant="text">
        {{ link.name }}
      </v-btn>
      <v-spacer></v-spacer>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const links = reactive([{ name: "Dyndns" },
{ name: "History" }]);
</script>
