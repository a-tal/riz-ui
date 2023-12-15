<template>
  <v-app>
    <AppNav></AppNav>
    <v-main>
      <router-view />
    </v-main>
    <DemoNotification></DemoNotification>
    <AppSnack></AppSnack>
  </v-app>
</template>

<script lang="ts">
import AppNav from '@/components/AppNav.vue';
import AppSnack from '@/components/AppSnack.vue';
import DemoNotification from '@/components/DemoNotification.vue';

export default {
  name: 'App',

  components: {
    AppNav,
    DemoNotification,
    AppSnack,
  },
};
</script>
