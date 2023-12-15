import { v4 } from 'uuid';
import { Ref, ref } from 'vue';

import {
  Light,
  LightRequest,
  LightStatus,
  Room,
  iLight,
  iRoom,
} from '@/models';

const BASE = process.env.VUE_APP_RIZ_API ?? '/v1';

const HEADERS = Object.freeze({
  'Content-Type': 'application/json',
});

export interface API {
  rooms: Ref<Array<Room>>;
  loaded: Ref<boolean>;
  demo: boolean;

  fetchRooms(): Promise<void>;
  fetchRoom(room: string): Promise<Room>;
  createRoom(name: string): Promise<void>;
  updateRoom(id: string, name: string): Promise<void>;
  deleteRoom(id: string): Promise<void>;
  createLight(roomId: string, ip: string, name?: string): Promise<void>;
  updateLight(
    roomId: string,
    lightId: string,
    ip: string,
    name?: string,
  ): Promise<void>;
  deleteLight(roomId: string, lightId: string): Promise<void>;
  lighting(roomId: string, lightId: string, req: LightRequest): Promise<void>;
  roomLighting(roomId: string, req: LightRequest): Promise<void>;
  status(roomId: string, lightId?: string): Promise<void>;
}

export class DemoAPI implements API {
  rooms: Ref<Array<Room>>;
  loaded: Ref<boolean>;
  demo: boolean;

  constructor() {
    this.rooms = ref(new Array<Room>());
    this.loaded = ref(false);
    this.demo = true;
  }

  async fetchRooms(): Promise<void> {
    if (!this.loaded.value) {
      this.loaded.value = true;
    }
  }

  async fetchRoom(room: string): Promise<Room> {
    return new Room(room, 'Demo Room');
  }

  async createRoom(name: string): Promise<void> {
    this.rooms.value.push(new Room(v4(), name));
  }

  async updateRoom(id: string, name: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === id);
    if (room && room.name !== name) {
      room.name = name;
    }
  }

  async deleteRoom(id: string): Promise<void> {
    const index = this.rooms.value.findIndex((r) => r.id === id);
    if (index >= 0) {
      this.rooms.value.splice(index, 1);
    }
  }

  async createLight(roomId: string, ip: string, name?: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      room.addLight(new Light(v4(), ip, name));
    }
  }

  async updateLight(
    roomId: string,
    lightId: string,
    ip: string,
    name?: string,
  ): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      const light = room.lights.find((l) => l.id === lightId);
      if (light) {
        light.ip = ip;
        light.name = name;
      }
    }
  }

  async deleteLight(roomId: string, lightId: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      const light = room.lights.find((l) => l.id === lightId);
      if (light) {
        room.removeLight(light);
      }
    }
  }

  async lighting(
    roomId: string,
    lightId: string,
    req: LightRequest,
  ): Promise<void> {
    this.updateLighting(req, roomId, lightId);
  }

  async roomLighting(roomId: string, req: LightRequest): Promise<void> {
    this.updateLighting(req, roomId);
  }

  async status(roomId: string, lightId?: string): Promise<void> {
    console.log('Unable to get status, no API backend', roomId, lightId);
    return;
  }

  // update the lights in the room, alternatively restricted to a single bulb
  protected updateLighting(
    req: LightRequest,
    roomId: string,
    lightId?: string,
  ): void {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      room.updateLighting(req, lightId);
    }
  }
}

export class API extends DemoAPI {
  constructor() {
    super();
    this.demo = false;
  }

  // GET: /rooms
  async fetchRooms(): Promise<void> {
    if (!this.loaded.value) {
      const rooms = [];
      try {
        const resp = await fetch(`${BASE}/rooms`);
        const data = await resp.json();

        for (const room of data) {
          const room_json = await this.fetchRoom(room);
          rooms.push(room_json);
        }
      } catch (e) {
        console.error(e);
        return;
      }

      while (this.rooms.value.length > 0) {
        this.rooms.value.pop();
      }
      rooms.sort((a, b) => (a.name ?? '_').localeCompare(b.name ?? '_'));
      rooms.forEach((r) => this.rooms.value.push(r));

      this.loaded.value = true;
    }
  }

  // GET: /room/{id}
  async fetchRoom(room: string): Promise<Room> {
    const resp = await fetch(`${BASE}/room/${room}`);
    const data: iRoom = await resp.json();
    return new Room(room, data.name, data.lights);
  }

  // POST: /rooms
  async createRoom(name: string): Promise<void> {
    const payload: iRoom = { name };
    const resp = await fetch(`${BASE}/rooms`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: HEADERS,
    });
    const id: string = await resp.json();
    this.rooms.value.push(new Room(id, name));
  }

  // PATCH: /room/{id}
  async updateRoom(id: string, name: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === id);
    if (room && room.name !== name) {
      const payload: iRoom = { name };
      await fetch(`${BASE}/room/${room.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: HEADERS,
      });
      room.name = name;
    }
  }

  // DELETE: /room/{id}
  async deleteRoom(id: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === id);
    if (room) {
      await fetch(`${BASE}/room/${room.id}`, { method: 'DELETE' });
      this.rooms.value.splice(
        this.rooms.value.findIndex((r) => r.id === id),
        1,
      );
    } else {
      throw new Error(`Unknown room id: ${id}`);
    }
  }

  // POST: /room/{id}/lights
  async createLight(roomId: string, ip: string, name?: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      const payload: iLight = { ip, name };
      const resp = await fetch(`${BASE}/room/${roomId}/lights`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: HEADERS,
      });
      const lightId: string = await resp.json();
      if (!room.addLight(new Light(lightId, ip, name))) {
        console.error('Failed to add light (already known?)');
      }
    }
  }

  // PATCH: /room/{id}/light/{light_id}
  async updateLight(
    roomId: string,
    lightId: string,
    ip: string,
    name?: string,
  ): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      const light = room.lights.find((l) => l.id === lightId);
      if (light) {
        if (light.ip !== ip || light.name !== name) {
          const payload: iLight = { ip, name };
          await fetch(`${BASE}/room/${roomId}/light/${lightId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: HEADERS,
          });
          light.ip = ip;
          light.name = name;
        } else {
          throw new Error('Nothing to update in light');
        }
      } else {
        throw new Error('Failed to update light (unknown light)');
      }
    } else {
      throw new Error('Failed to update light (unknown room)');
    }
  }

  // DELETE: /room/{id}/light/{light_id}
  async deleteLight(roomId: string, lightId: string): Promise<void> {
    const room = this.rooms.value.find((r) => r.id === roomId);
    if (room) {
      const light = room.lights.find((l) => l.id === lightId);
      if (light) {
        await fetch(`${BASE}/room/${roomId}/light/${lightId}`, {
          method: 'DELETE',
        });
        room.removeLight(light);
      } else {
        throw new Error('Failed to delete light (unknown light)');
      }
    } else {
      throw new Error('Failed to delete light (unknown room)');
    }
  }

  // PUT: /room/{id}/light/{light_id}
  async lighting(
    roomId: string,
    lightId: string,
    req: LightRequest,
  ): Promise<void> {
    if (!req.valid()) {
      throw new Error('Invalid payload');
    }
    fetch(`${BASE}/room/${roomId}/light/${lightId}`, {
      method: 'PUT',
      body: JSON.stringify(req),
      headers: HEADERS,
    });
    this.updateLighting(req, roomId, lightId);
  }

  // PUT: /room/{id}/lights
  async roomLighting(roomId: string, req: LightRequest): Promise<void> {
    const data = JSON.stringify(req);

    if (!req.valid()) {
      throw new Error('Invalid payload');
    }

    fetch(`${BASE}/room/${roomId}/lights`, {
      method: 'PUT',
      body: data,
      headers: HEADERS,
    });
    this.updateLighting(req, roomId);
  }

  // GET /room/{id}/status
  // GET /room/{id}/light/{light_id}/status
  async status(roomId: string, lightId?: string): Promise<void> {
    const route = `/room/${roomId}/${
      lightId === undefined ? '' : `light/${lightId}/`
    }status`;
    const resp = await fetch(`${BASE}${route}`);
    if (lightId === undefined) {
      const room: iRoom = await resp.json();

      if (room.lights === undefined) {
        return;
      }

      for (const known of this.rooms.value) {
        if (known.id === roomId) {
          for (const id in room.lights) {
            for (const knownLight of known.lights) {
              if (knownLight.id === id) {
                knownLight.updateStatus(room.lights[id].status);
                break;
              }
            }
          }
          return;
        }
      }
    } else {
      const status: LightStatus = await resp.json();
      for (const known of this.rooms.value) {
        if (known.id === roomId) {
          for (const knownLight of known.lights) {
            if (knownLight.id === lightId) {
              knownLight.updateStatus(status);
              return;
            }
          }
        }
      }
    }
  }
}

export function createAPI(): API {
  if (BASE === '__DEMO__') {
    return new DemoAPI();
  }
  return new API();
}
