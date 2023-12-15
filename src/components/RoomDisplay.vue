<template>
  <v-container fluid class="pa-0 text-center">
    <v-row
      no-gutters
      class="pt-4 text-h4 font-weight-thin text-center text-muted items-align-center self-align-center"
      :style="{ maxWidth: '500px', margin: '0 auto' }"
    >
      <v-col cols="2" class="text-right self-align-center">
        <v-tooltip text="New Light">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon size="24" @click="newLightDialog = true">
              <v-icon size="18" color="yellow">mdi-plus</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="8" class="px-4 self-align-center">
        <template v-if="editing">
          <v-text-field
            v-model="name"
            density="compact"
            variant="underlined"
            prepend-icon="mdi-pencil"
            hide-details
          >
          </v-text-field>
        </template>
        <template v-else>
          <v-tooltip text="Edit">
            <template v-slot:activator="{ props }">
              <span v-bind="props" class="pointer" @click="editing = true">{{
                name
              }}</span>
            </template>
          </v-tooltip>
        </template>
      </v-col>

      <v-col cols="2">
        <v-row no-gutters>
          <template v-if="editing">
            <v-tooltip text="Cancel Edit">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon size="24" @click="onCancel"
                  ><v-icon size="18" color="orange"
                    >mdi-undo-variant</v-icon
                  ></v-btn
                >
              </template>
            </v-tooltip>
          </template>
          <template v-else>
            <v-tooltip text="Delete Room">
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
          </template>
        </v-row>
        <v-row no-gutters>
          <template v-if="editing">
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
          </template>
          <template v-else>
            <v-tooltip text="Refresh status">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon
                  @click="getStatus"
                  size="24"
                  :disabled="!haveLights"
                  ><v-icon size="18" color="teal">mdi-reload</v-icon></v-btn
                >
              </template>
            </v-tooltip>
          </template>
        </v-row>
      </v-col>

      <v-col cols="12" class="pt-4">
        <v-btn-group variant="outlined" divided>
          <v-tooltip text="On (room)">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                @click="powerOn"
                :disabled="!haveLights"
                ><v-icon color="green">mdi-power-on</v-icon></v-btn
              >
            </template>
          </v-tooltip>
          <v-tooltip text="Off (room)">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                @click="powerOff"
                :disabled="!haveLights"
                ><v-icon color="red">mdi-power-off</v-icon></v-btn
              >
            </template>
          </v-tooltip>

          <v-tooltip text="Reboot (room)">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                @click="powerCycle"
                :disabled="!haveLights"
                ><v-icon color="yellow">mdi-power-cycle</v-icon></v-btn
              >
            </template>
          </v-tooltip>
        </v-btn-group>
      </v-col>

      <v-col cols="12" class="pt-4">
        <v-btn-group divided variant="outlined">
          <v-menu
            v-model="showScenes"
            :close-on-content-click="false"
            max-width="300px"
          >
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="blue" :disabled="!haveLights"
                ><span class="text-blue">Scene</span>
                <v-icon color="blue" class="pl-4 pr-2"
                  >mdi-television-classic</v-icon
                >
              </v-btn>
            </template>

            <v-card max-width="300">
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12" class="pt-2">
                    <v-select
                      label="Scene"
                      color="blue"
                      variant="underlined"
                      v-model="scene"
                      prepend-icon="mdi-television-classic"
                      density="compact"
                      return-object
                      item-title="name"
                      :items="scenes"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" class="items-align-center">
                    <v-slider
                      v-model="speed"
                      label="Speed"
                      append-icon="mdi-timer"
                      color="cyan"
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

          <template v-if="$vuetify.display.xs">
            <v-btn
              color="purple"
              @click="showPicker = true"
              :disabled="!haveLights"
            >
              <span class="text-purple">Color</span>
              <v-icon color="purple" class="pl-4 pr-2">mdi-eyedropper</v-icon>
            </v-btn>
            <v-dialog v-model="showPicker" max-width="400px">
              <ColorPicker
                title="Room"
                :color="roomColor"
                :temp="roomTemp"
                :cool="roomCool"
                :warm="roomWarm"
                @color="setColor"
                @temp="setTemperature"
                @cool="setCool"
                @warm="setWarm"
              ></ColorPicker>
            </v-dialog>
          </template>

          <v-menu v-else v-model="showPicker" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="purple" :disabled="!haveLights">
                <span class="text-purple">Color</span>
                <v-icon color="purple" class="pl-4 pr-2"
                  >mdi-eyedropper</v-icon
                ></v-btn
              >
            </template>
            <ColorPicker
              title="Room"
              :color="roomColor"
              :temp="roomTemp"
              :cool="roomCool"
              :warm="roomWarm"
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
          min="10"
          max="100"
          @end="setBrightness"
          :disabled="!haveLights"
        ></v-slider>
      </v-col>
    </v-row>

    <template v-if="haveLights">
      <v-expansion-panels v-model="showLights">
        <v-expansion-panel class="rounded-0">
          <v-expansion-panel-title>
            {{ room.lights.length }} Light{{
              room.lights.length === 1 ? '' : 's'
            }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row no-gutters justify="center">
              <v-col
                xs="12"
                sm="6"
                md="4"
                lg="3"
                class="text-body-1 text-center text-muted"
                v-for="(light, i) in room.lights"
                :key="i"
              >
                <LightDisplay :room-id="room.id" :light="light"></LightDisplay>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <template v-else>
      <v-row no-gutters class="text-center font-weight-thin">
        <v-col cols="12" class="text-h3 font-weight-thin pt-4">No lights</v-col>
        <v-col cols="12" class="text-body pt-8">
          You can create a light with the yellow
          <span class="text-yellow">&plus;</span> button left of the room name
          above.
        </v-col>
      </v-row>
    </template>

    <v-dialog v-model="newLightDialog" max-width="300px">
      <v-card>
        <v-card-title>Add light to {{ room.name ?? 'New Room' }}</v-card-title>
        <CreateLight :room-id="room.id" @create="onUpdate"></CreateLight>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text
          >This will delete any lights in the room "{{ name }}" as
          well</v-card-text
        >
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
  Light,
  LightRequest,
  PowerMode,
  Room,
  Scene,
  Scenes,
} from '@/models';

import ColorPicker from '@/components/ColorPicker.vue';
import CreateLight from '@/components/CreateLight.vue';
import LightDisplay from '@/components/LightDisplay.vue';

export default defineComponent({
  name: 'RoomDisplay',

  props: {
    room: {
      type: Room,
      required: false,
      default: () => new Room('New Room'),
    },
    open: {
      type: Boolean,
      required: false,
    },
  },

  components: {
    LightDisplay,
    CreateLight,
    ColorPicker,
  },

  data: () => ({
    editing: false,
    deleteDialog: false,
    newLightDialog: false,
    name: '',
    speed: 100,
    brightness: 100,
    scene: null as Scene | null,
    showScenes: false,
    showPicker: false,
    showLights: [] as Array<number>,
    scenes: Scenes,
  }),

  mounted() {
    this.onRoomChange();
    if (this.open) {
      this.showLights.push(0);
    }
  },

  watch: {
    [`room.id`]() {
      this.onRoomChange();
    },
  },

  computed: {
    haveLights(): boolean {
      return this.room.lights.length > 0;
    },

    roomScene(): Scene | null {
      if (this.room.lights.length === 0) {
        return null;
      }

      const first = this.room.lights[0].status?.scene;
      if (!first) {
        return null;
      }

      for (let i = 1; i < this.room.lights.length; i++) {
        if (this.room.lights[i].status?.scene !== first) {
          return null;
        }
      }

      return new Scene(first);
    },

    roomColor(): string | undefined {
      if (this.room.lights?.length > 0) {
        const red = Math.floor(
          this.room.lights
            .map((l) => l.status?.color?.red || 255)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
        const green = Math.floor(
          this.room.lights
            .map((l) => l.status?.color?.green || 255)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
        const blue = Math.floor(
          this.room.lights
            .map((l) => l.status?.color?.blue || 255)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );

        const color = new Color({ red, green, blue });

        return color.toStr();
      }

      return undefined;
    },

    roomTemp(): number {
      if (this.room.lights?.length > 0) {
        return Math.floor(
          this.room.lights
            .map((l) => l.status?.temp?.kelvin || 4000)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
      }
      return 4000;
    },

    roomCool(): number {
      if (this.room.lights?.length > 0) {
        return Math.floor(
          this.room.lights
            .map((l) => l.status?.cool?.value || 100)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
      }
      return 100;
    },

    roomWarm(): number {
      if (this.room.lights?.length > 0) {
        return Math.floor(
          this.room.lights
            .map((l) => l.status?.warm?.value || 100)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
      }
      return 100;
    },

    roomSpeed(): number {
      if (this.room.lights?.length > 0) {
        return Math.floor(
          this.room.lights
            .map((l) => l.status?.speed?.value || 100)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
      }
      return 100;
    },

    roomBrightness(): number {
      if (this.room.lights?.length > 0) {
        return Math.floor(
          this.room.lights
            .map((l) => l.status?.brightness?.value || 100)
            .reduce((a, i) => a + i, 0) / this.room.lights.length,
        );
      }
      return 100;
    },

    canSave(): boolean {
      if (this.room.name) {
        return this.name.localeCompare(this.room.name) !== 0;
      }
      return this.name !== '';
    },
  },

  methods: {
    async setLighting(req: LightRequest) {
      try {
        await this.$api.roomLighting(this.room.id, req);
      } catch (e) {
        console.log(e);
        this.error('Failed to update lighting');
      }
    },

    async onDelete() {
      this.deleteDialog = false;
      try {
        await this.$api.deleteRoom(this.room.id);
      } catch (e) {
        console.log(e);
        this.error('Failed to delete room');
        return;
      }
      this.$router.push('/');
    },

    async onSave() {
      try {
        await this.$api.updateRoom(this.room.id, this.name);
      } catch (e) {
        console.log(e);
        this.error('Failed to save room');
        return;
      }
      this.editing = false;
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

      if (this.scene !== null) {
        let req = new LightRequest();
        req.setScene(this.scene.mode, this.speed);
        await this.setLighting(req);
      }
    },

    async setColor(color: string) {
      this.showPicker = false;

      let colorObj = new Color();
      colorObj.fromStr(color);

      let req = new LightRequest();
      req.setColor(colorObj);

      await this.setLighting(req);
    },

    async setTemperature(temp: number) {
      this.showPicker = false;

      let req = new LightRequest();
      req.setTemp(temp);

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

    async setBrightness() {
      let req = new LightRequest();
      req.setBrightness(this.brightness);

      await this.setLighting(req);
    },

    async getStatus() {
      try {
        await this.$api.status(this.room.id);
      } catch (e) {
        console.log(e);
        this.error('Failed to fetch status');
      }
    },

    onCancel() {
      this.editing = false;
      this.name = this.room.name ?? 'New Room';
    },

    onUpdate() {
      this.scene = this.roomScene;
      this.speed = this.roomSpeed;
      this.brightness = this.roomBrightness;
    },

    onCreate(light: Light) {
      this.onUpdate();
      light.registerRoom(() => this.onUpdate());
      this.newLightDialog = false;
    },

    onRoomChange() {
      this.name = this.room.name || '';
      this.onUpdate();
      this.room.lights?.forEach((l) => l.registerRoom(() => this.onUpdate()));
      this.room.register(
        (light: Light) => this.onCreate(light),
        () => this.onUpdate(),
      );
    },
  },
});
</script>
