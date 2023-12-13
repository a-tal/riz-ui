<template>
  <v-app>
    <AppNav></AppNav>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import AppNav from '@/components/AppNav.vue';

export default {
  name: 'App',

  components: {
    AppNav,
  },
};
</script>
