<template>
  <v-card class="pa-0 no-bg" :height="`${container}px`" flat>
    <v-container fluid class="fill-height pa-0">
      <v-row no-gutters class="fill-height">
        <v-col cols="12" class="text-center self-align-center">
          <v-progress-circular
            width="1"
            rotate="-90"
            color="filter"
            :size="size"
            indeterminate
            >Loading...</v-progress-circular
          >
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingCircle',

  props: {
    size: {
      type: Number,
      required: false,
      default: 300,
    },
  },

  computed: {
    container(): number {
      return this.size * 2;
    },
  },
});
</script>
