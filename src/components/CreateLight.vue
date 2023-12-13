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

// this is technically correct, but do people ever actually mean to use
// IPv4 shorthand? probably not... no one else even knows about it...
// also, because the rust std lib doesn't parse shorthand if used
// the request will fail when the api fails to parse...
const IP_RE =
  /^(((1[\d]{0,2})|(2([0-4]?[\d]|5[0-5]))|([3-9]?[\d])|[\d])\.){0,3}((1[\d]{0,2})|(2([0-4]?[\d]|5[0-5]))|([3-9]?[\d])|[\d])$/;

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
        await this.$api.createLight(
          this.roomId,
          this.ipaddr,
          this.lightName === '' ? undefined : this.lightName,
        );
        this.ipaddr = '';
        this.lightName = '';
      }
    },
  },
});
</script>
