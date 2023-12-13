<template>
  <v-container fluid class="pa-0">
    <LoadingCircle v-if="loading"></LoadingCircle>
    <v-row v-else no-gutters>
      <v-col v-if="room" cols="12">
        <RoomDisplay :room="room" open></RoomDisplay>
      </v-col>
      <v-col
        v-else
        cols="12"
        class="text-h4 text-center pt-8 font-weight-thin text-muted"
      >
        API Error
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Room } from '@/models';
import { defineComponent } from 'vue';

import LoadingCircle from '@/components/LoadingCircle.vue';
import RoomDisplay from '@/components/RoomDisplay.vue';

export default defineComponent({
  name: 'RoomView',

  props: {
    id: String,
  },

  data: () => ({
    loading: true,
    room: undefined as Room | undefined,
  }),

  components: {
    RoomDisplay,
    LoadingCircle,
  },

  watch: {
    id() {
      this.room = this.$api.rooms.value.find((r) => r.id === this.id);
    },
  },

  async mounted() {
    await this.$api.fetchRooms();
    this.room = this.$api.rooms.value.find((r) => r.id === this.id);
    this.loading = false;
  },
});
</script>
