<template>
  <v-app>
    <AppNav></AppNav>
    <v-main>
      <router-view />
    </v-main>
    <DemoNotification></DemoNotification>
  </v-app>
</template>

<script lang="ts">
import AppNav from '@/components/AppNav.vue';
import DemoNotification from '@/components/DemoNotification.vue';

export default {
  name: 'App',

  components: {
    AppNav,
    DemoNotification,
  },
};
</script>
