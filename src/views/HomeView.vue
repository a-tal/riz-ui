<template>
  <v-container fluid class="pa-0">
    <LoadingCircle v-if="loading"></LoadingCircle>
    <template v-else>
      <v-row no-gutters v-if="$api.loaded.value">
        <v-col cols="12" v-for="room in $api.rooms.value" :key="room.id">
          <RoomDisplay :room="room"></RoomDisplay>
        </v-col>
      </v-row>
      <v-row no-gutters v-else>
        <v-col
          cols="12"
          class="text-h4 text-center pt-8 font-weight-thin text-muted"
        >
          API Error
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoadingCircle from '@/components/LoadingCircle.vue';
import RoomDisplay from '@/components/RoomDisplay.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    LoadingCircle,
    RoomDisplay,
  },

  data: () => ({
    loading: true,
  }),

  async mounted() {
    await this.$api.fetchRooms();
    this.loading = false;
  },
});
</script>
