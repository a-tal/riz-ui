<template>
  <v-container fluid>
    <v-row no-gutters class="text-muted text-center">
      <v-col cols="12" class="pb-2">
        <v-text-field
          v-model="lightName"
          hide-details
          density="compact"
          variant="underlined"
          label="Name (optional)"
          prepend-icon="mdi-lightbulb"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-4">
        <v-text-field
          v-model="ipaddr"
          hide-details
          density="compact"
          variant="underlined"
          prepend-icon="mdi-ip"
          label="IP Address (required)"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-4">
        <v-btn
          variant="text"
          :color="lightColor"
          :disabled="lightDisabled"
          @click="onCreate"
          >Create Light</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// this IP_RE doesn't match shorthand ip addresses. rust std lib flags
// shorthand as invalid anyway. so, might as well invalidate it client
// side too. a regex allowing for shorthand would look something like:
// /^(((1[\d]{0,2})|(2([0-4]?[\d]|5[0-5]))|([3-9]?[\d])|[\d])\.){0,3}((1[\d]{0,2})|(2([0-4]?[\d]|5[0-5]))|([3-9]?[\d])|[\d])$/
const IP_RE =
  /^(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))$/;

export default defineComponent({
  name: 'CreateLight',

  props: {
    roomId: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    lightName: '',
    ipaddr: '',
  }),

  computed: {
    lightColor(): string {
      return this.lightDisabled ? 'gray' : 'green';
    },

    lightDisabled(): boolean {
      return this.ipaddr.match(IP_RE) === null;
    },
  },

  methods: {
    async onCreate(): Promise<void> {
      if (this.ipaddr.match(IP_RE)) {
        try {
          await this.$api.createLight(
            this.roomId,
            this.ipaddr,
            this.lightName === '' ? undefined : this.lightName,
          );
          this.ipaddr = '';
          this.lightName = '';
          this.$emit('create');
        } catch (e) {
          console.log(e);
          this.error('Invalid or duplicate IP');
        }
      }
    },
  },
});
</script>
