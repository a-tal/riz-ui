<template>
  <v-card max-width="370px">
    <v-container fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="1">
          <v-btn
            v-if="modeIndex > 0"
            @click="modeIndex--"
            block
            flat
            variant="text"
            class="fill-height"
          >
            <v-icon color="muted">mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="10" class="py-2">
          <v-row no-gutters>
            <v-col
              cols="12"
              class="pt-2 pb-8 text-h4 font-weight-thin text-center"
              >{{ fullTitle }}</v-col
            >
            <v-col cols="12" class="pb-2 px-2">
              <v-slider
                v-if="modeIndex === 1"
                :color="tempColor"
                v-model="modTemp"
                min="1000"
                max="8000"
                step="1"
              ></v-slider>
              <v-slider
                v-else-if="modeIndex === 2"
                color="cyan"
                v-model="modCool"
                min="1"
                max="100"
                step="1"
              ></v-slider>
              <v-slider
                v-else-if="modeIndex === 3"
                color="orange"
                v-model="modWarm"
                min="1"
                max="100"
                step="1"
              ></v-slider>
              <v-color-picker
                v-else
                :style="{ margin: '0 auto', maxWidth: '270px' }"
                :modes="['rgb']"
                hide-inputs
                show-swatches
                v-model="modColor"
              ></v-color-picker>
            </v-col>
            <v-col cols="12" class="text-center text-muted text-caption">{{
              displayValue || '&nbsp;'
            }}</v-col>
            <v-col cols="12" class="text-center py-2">
              <v-btn
                variant="text"
                color="green"
                @click="onSelect"
                :disabled="selectDisabled"
                >Select</v-btn
              >
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1">
          <v-btn
            v-if="modeIndex < 3"
            @click="modeIndex++"
            block
            flat
            variant="text"
            class="fill-height"
          >
            <v-icon color="muted">mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ColorPicker',

  props: {
    color: String,
    temp: Number,
    cool: Number,
    warm: Number,
    title: {
      type: String,
      required: false,
      default: 'Light',
    },
  },

  data: () => ({
    modColor: '',
    modeIndex: 0,
    modTemp: 1000,
    modCool: 1,
    modWarm: 1,
  }),

  mounted() {
    if (this.color) {
      this.modColor = this.color;
    }

    if (this.temp) {
      this.modTemp = this.temp;
    }

    if (this.cool) {
      this.modCool = this.cool;
    }

    if (this.warm) {
      this.modWarm = this.warm;
    }
  },

  computed: {
    tempColor(): string {
      // TODO: dynamic based on modTemp
      return 'orange';
    },

    displayValue(): string {
      switch (this.modeIndex) {
        case 1:
          return `${this.modTemp.toLocaleString()} Kelvin`;
        case 2:
          return `${this.modCool}%`;
        case 3:
          return `${this.modWarm}%`;
        default:
          return this.modColor;
      }
    },

    selectDisabled(): boolean {
      if (this.modeIndex > 0) {
        return false;
      }
      return this.modColor === '';
    },

    fullTitle(): string {
      return `${this.title} ${this.modeTitle}`;
    },

    modeTitle(): string {
      switch (this.modeIndex) {
        case 1:
          return 'Temperature';
        case 2:
          return 'Cool White';
        case 3:
          return 'Warm White';
        default:
          return 'Color';
      }
    },
  },

  methods: {
    onSelect() {
      switch (this.modeIndex) {
        case 0:
          this.$emit('color', this.modColor);
          return;
        case 1:
          this.$emit('temp', this.modTemp);
          return;
        case 2:
          this.$emit('cool', this.modCool);
          return;
        case 3:
          this.$emit('warm', this.modWarm);
          return;
        default:
          return;
      }
    },
  },
});
</script>
