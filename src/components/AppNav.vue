<template>
  <v-navigation-drawer permanent :rail="rail" :width="200" class="text-muted">
    <v-list-item
      title="All rooms"
      subtitle="Riz"
      nav
      class="pl-4 py-3 rounded-0"
      to="/"
    >
      <template v-slot:prepend>
        <v-icon color="blue">mdi-alpha-r-box-outline</v-icon>
      </template>
      <template v-slot:append>
        <v-icon color="gray">mdi-slash-forward</v-icon>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav class="pa-0 ma-0">
      <v-list-item
        v-for="room in $api.rooms.value"
        :key="room.id"
        :title="room.name"
        :subtitle="`${room.lights.length} light${
          room.lights.length === 1 ? '' : 's'
        }`"
        :to="{
          name: 'room',
          params: {
            id: room.id,
          },
        }"
        :class="`${rail ? 'pl-4 py-3' : 'pl-2 py-2'} ma-0 rounded-0`"
      >
        <template v-slot:prepend>
          <v-avatar :class="rail ? undefined : 'mr-2'"
            ><span class="text-h5 text-capitalize text-muted">{{
              (room.name ?? '?')[0]
            }}</span></v-avatar
          >
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list-item
      nav
      class="pl-4 rounded-0 prepend-start"
      :style="{ height: `${rail ? 58 : 58}px !important` }"
    >
      <template v-slot:default>
        <CreateRoom @create="rail = true"></CreateRoom>
      </template>

      <template v-slot:prepend>
        <v-icon color="blue" @click="rail = !rail"
          >mdi-home-plus-outline</v-icon
        >
      </template>
    </v-list-item>
    <v-divider></v-divider>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list-item
        nav
        class="pl-4 py-3 rounded-0"
        :style="{ height: '58px !important' }"
        :title="`Riz ${version}`"
        subtitle="by Adam Talsma"
        :prepend-icon="!rail ? undefined : 'mdi-chevron-right'"
        :append-icon="rail ? undefined : 'mdi-chevron-left'"
        @click.stop="rail = !rail"
      >
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<style lang="scss">
a {
  color: inherit;
}
a:visited {
  color: inherit;
}
* {
  transition-duration: 0s !important;
}
.prepend-start > .v-list-item__prepend {
  align-self: flex-start !important;
  padding-top: 12px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

import CreateRoom from '@/components/CreateRoom.vue';

export default defineComponent({
  name: 'AppNav',

  components: {
    CreateRoom,
  },

  data: () => ({
    rail: true,
    showCreate: false,
  }),

  computed: {
    version(): string {
      return process.env.VUE_APP_VERSION;
    },
  },
});
</script>
