<template>
  <v-bottom-navigation
    variant="text"
    density="compact"
    height="42"
    class="text-muted"
    v-if="isDemo"
  >
    <p class="self-align-center">
      Demo mode.
      <a
        class="text-decoration-underline"
        target="_blank"
        href="https://github.com/a-tal/riz"
        >Riz API</a
      >
      is required for backend functionality.
    </p>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DemoNotification',

  computed: {
    isDemo(): boolean {
      return this.$api.constructor.name === 'DemoAPI';
    },
  },
});
</script>
