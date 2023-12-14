<template>
  <v-container fluid class="text-muted pa-0">
    <v-row no-gutters>
      <v-col cols="10 pr-2 pb-3 items-align-center">
        <v-text-field
          :style="{ paddingInline: '0px !important' }"
          variant="underlined"
          hide-details
          density="compact"
          v-model="name"
          placeholder="New Room"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="self-align-bottom pb-3">
        <v-tooltip text="Create Room">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              :color="createDisabled ? 'gray' : 'green'"
              :size="18"
              @click="onCreate"
              >mdi-content-save</v-icon
            >
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Light } from '@/models';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreateRoom',

  data: () => ({
    name: '',
    lights: Array<Light>(),
  }),

  computed: {
    createDisabled() {
      return this.name === '';
    },
  },

  methods: {
    async onCreate() {
      if (!this.createDisabled) {
        await this.$api.createRoom(this.name);
        this.name = '';
        this.$emit('create');
      }
    },
  },
});
</script>
