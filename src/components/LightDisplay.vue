<template>
  <v-container fluid>
    <v-row no-gutters>
      <template v-if="editing">
        <v-col cols="11" class="pr-2">
          <v-text-field
            v-model="name"
            density="compact"
            variant="underlined"
            prepend-icon="mdi-lightbulb"
            hide-details
          >
          </v-text-field>
        </v-col>
        <v-col cols="1">
          <v-tooltip text="Cancel">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon size="24" @click="cancelEdit"
                ><v-icon size="18" color="orange"
                  >mdi-undo-variant</v-icon
                ></v-btn
              >
            </template>
          </v-tooltip>
        </v-col>
        <v-col cols="11" class="pr-2">
          <v-text-field
            v-model="ip"
            density="compact"
            variant="underlined"
            prepend-icon="mdi-ip"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-tooltip text="Save">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="24"
                :disabled="!canSave"
                @click="onSave"
                ><v-icon size="18" color="green"
                  >mdi-content-save</v-icon
                ></v-btn
              >
            </template>
          </v-tooltip>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="3">
          <div
            class="rounded-pill text-caption px-2 float-right my-0"
            :style="{
              lineHeight: 'normal',
              width: 'fit-content',
              backgroundColor: lastModeColor,
            }"
          >
            {{ lastMode }}
          </div>
        </v-col>
        <v-col cols="6">
          <v-row no-gutters>
            <v-col cols="12">
              <v-tooltip text="Edit">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    @click="editing = true"
                    class="pointer"
                    size="40"
                    :color="iconColor"
                    >mdi-lightbulb</v-icon
                  >
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="text-caption"
              >{{ light.name ?? 'New Light' }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-tooltip text="Delete Light">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    size="24"
                    @click="deleteDialog = true"
                    ><v-icon color="red" size="18"
                      >mdi-delete-outline</v-icon
                    ></v-btn
                  >
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-tooltip text="Refresh status">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon @click="getStatus" size="24"
                    ><v-icon size="18" color="teal">mdi-reload</v-icon></v-btn
                  >
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </template>

      <v-col cols="12" class="pt-4">
        <v-btn-group variant="outlined" divided>
          <v-tooltip text="On">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon @click="powerOn"
                ><v-icon color="green">mdi-power-on</v-icon></v-btn
              >
            </template>
          </v-tooltip>
          <v-tooltip text="Off">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon @click="powerOff"
                ><v-icon color="red">mdi-power-off</v-icon></v-btn
              >
            </template>
          </v-tooltip>

          <v-tooltip text="Reboot">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon @click="powerCycle"
                ><v-icon color="yellow">mdi-power-cycle</v-icon></v-btn
              >
            </template>
          </v-tooltip>
        </v-btn-group>
      </v-col>

      <v-col cols="12" class="pt-4">
        <v-btn-group variant="outlined" divided>
          <v-menu v-model="showScenes" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="blue"
                ><span class="text-blue">Scene</span>
                <v-icon color="blue" class="pl-4 pr-2"
                  >mdi-television-classic</v-icon
                >
              </v-btn>
            </template>

            <v-card min-width="300">
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-select
                      label="Scene"
                      v-model="scene"
                      :items="scenes"
                      item-title="name"
                      return-object
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="items-align-center">
                    <v-slider
                      v-model="speed"
                      label="Speed"
                      append-icon="mdi-timer"
                      step="1"
                      min="20"
                      max="200"
                    ></v-slider>
                  </v-col>

                  <v-btn :disabled="!scene" @click="setScene">Set</v-btn>
                </v-row>
              </v-container>
            </v-card>
          </v-menu>

          <v-menu v-model="showPicker" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="purple">
                <span class="text-purple">Color</span>
                <v-icon color="purple" class="pl-4 pr-2"
                  >mdi-eyedropper</v-icon
                ></v-btn
              >
            </template>
            <ColorPicker
              :color="light.status?.color?.toStr()"
              :temp="light.status?.temp?.kelvin"
              :cool="light.status?.cool?.value"
              :warm="light.status?.warm?.value"
              @color="setColor"
              @temp="setTemperature"
              @cool="setCool"
              @warm="setWarm"
            ></ColorPicker>
          </v-menu>
        </v-btn-group>
      </v-col>

      <v-col cols="12" class="pt-3">
        <v-slider
          v-model="brightness"
          prepend-icon="mdi-brightness-4"
          append-icon="mdi-brightness-7"
          color="yellow"
          step="1"
          min="1"
          max="100"
          @end="setBrightness"
        ></v-slider>
      </v-col>
    </v-row>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title> Are you sure? </v-card-title>
        <v-card-text>
          This will delete the light at "{{ light.ip }}"
        </v-card-text>
        <v-card-actions class="d-float">
          <v-btn @click="deleteDialog = false" color="green">Cancel</v-btn>
          <v-btn @click="onDelete" color="red">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
  Color,
  LastSet,
  Light,
  LightRequest,
  PowerMode,
  Scene,
  Scenes,
} from '@/models';

import ColorPicker from '@/components/ColorPicker.vue';

export default defineComponent({
  name: 'LightDisplay',

  props: {
    light: {
      type: Light,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
  },

  components: {
    ColorPicker,
  },

  data: () => ({
    name: '',
    ip: '',
    speed: 20,
    brightness: 10,
    editing: false,
    scene: null as null | Scene,
    showPicker: false,
    showScenes: false,
    deleteDialog: false,
    scenes: Scenes,
  }),

  mounted() {
    this.onUpdate();
    this.light.register(() => this.onUpdate());
  },

  computed: {
    iconColor(): string {
      if (this.light.status) {
        switch (this.light.status.last) {
          case LastSet.Color:
            return this.light.status.color?.toStr() ?? 'purple';
          case LastSet.Cool:
            return 'cyan';
          case LastSet.Warm:
            return 'orange';
          case LastSet.Scene:
            return 'blue';
          default:
            return 'yellow';
        }
      } else {
        return 'yellow';
      }
    },

    lastMode(): string {
      if (this.light.status?.last) {
        return this.light.status.last.toLowerCase();
      }
      return '???';
    },

    lastModeColor(): string {
      if (this.light.status?.last) {
        switch (this.light.status.last) {
          case LastSet.Scene:
            return 'blue';
          case LastSet.Color:
            return 'purple';
          case LastSet.Cool:
            return 'cyan';
          case LastSet.Warm:
            return 'orange';
          default:
            return 'yellow';
        }
      } else {
        return 'black';
      }
    },

    canSave(): boolean {
      if (this.name !== this.light.name) {
        return this.name !== '' || this.ip !== this.light.ip;
      }
      return this.ip !== this.light.ip;
    },
  },

  methods: {
    async setLighting(req: LightRequest) {
      try {
        await this.$api.lighting(this.roomId, this.light.id, req);
      } catch (e) {
        console.log(e);
        this.error('Failed to update lighting');
      }
    },

    async powerOn() {
      let req = new LightRequest();
      req.setPower(PowerMode.On);
      await this.setLighting(req);
    },

    async powerOff() {
      let req = new LightRequest();
      req.setPower(PowerMode.Off);
      await this.setLighting(req);
    },

    async powerCycle() {
      let req = new LightRequest();
      req.setPower(PowerMode.Reboot);
      await this.setLighting(req);
    },

    async setScene() {
      this.showScenes = false;
      if (this.scene) {
        let req = new LightRequest();
        req.setScene(this.scene.mode, this.speed);
        await this.setLighting(req);
      }
    },

    async setBrightness() {
      let req = new LightRequest();
      req.setBrightness(this.brightness);
      await this.setLighting(req);
    },

    async setCool(cool: number) {
      this.showPicker = false;

      let req = new LightRequest();
      req.setCool(cool);

      await this.setLighting(req);
    },

    async setWarm(warm: number) {
      this.showPicker = false;

      let req = new LightRequest();
      req.setWarm(warm);

      await this.setLighting(req);
    },

    async setTemperature(temp: number) {
      this.showPicker = false;

      let req = new LightRequest();
      req.setTemp(temp);

      await this.setLighting(req);
    },

    async setColor(color: string) {
      this.showPicker = false;

      let colorObj = new Color();
      colorObj.fromStr(color);

      let req = new LightRequest();
      req.setColor(colorObj);

      await this.setLighting(req);
    },

    async onSave() {
      try {
        await this.$api.updateLight(
          this.roomId,
          this.light.id,
          this.ip,
          this.name,
        );
      } catch (e) {
        console.log(e);
        this.error('Failed to save light');
        return;
      }
      this.editing = false;
    },

    async getStatus() {
      try {
        await this.$api.status(this.roomId, this.light.id);
      } catch (e) {
        console.log(e);
        this.error('Failed to fetch status');
      }
    },

    async onDelete() {
      try {
        await this.$api.deleteLight(this.roomId, this.light.id);
      } catch (e) {
        console.log(e);
        this.error('Failed to delete light');
      }
    },

    cancelEdit() {
      this.editing = false;
      this.name = this.light.name ?? 'New Light';
      this.ip = this.light.ip;
    },

    onUpdate() {
      if (this.light.name) {
        this.name = this.light.name;
      }
      this.ip = this.light.ip;
      this.brightness = this.light.status?.brightness?.value ?? 100;
      this.speed = this.light.status?.speed?.value ?? 100;

      if (this.light.status?.scene) {
        this.scene = new Scene(this.light.status.scene);
      }
    },
  },
});
</script>
