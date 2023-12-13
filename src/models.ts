export interface iRoom {
  name?: string;
  lights?: Record<string, iLight>;
}

export class Room {
  id: string;
  name?: string;
  lights: Array<Light>;
  addCallback?: (light: Light) => void;
  deleteCallback?: () => void;

  constructor(id: string, name?: string, lights?: Record<string, iLight>) {
    this.id = id;
    this.name = name;

    this.lights = [];
    const l = lights ?? {};

    for (const key of Object.keys(l)) {
      this.lights.push(new Light(key, l[key].ip, l[key].name, l[key].status));
    }
  }

  addLight(light: Light): boolean {
    if (this.lights.some((l) => l.id === light.id)) {
      return false;
    }
    this.lights.push(light);
    this.addCallback?.(light);
    return true;
  }

  removeLight(light: Light): void {
    this.lights = this.lights.filter((l) => l.id !== light.id);
  }

  register(
    addCallback: (light: Light) => void,
    deleteCallback: () => void,
  ): void {
    this.addCallback = addCallback;
    this.deleteCallback = deleteCallback;
  }
}

export interface iLight {
  ip: string;
  name?: string;
  status?: LightStatus;
}

export class Light {
  id: string;
  ip: string;
  name?: string;
  status?: LightStatus;
  lightCallback?: () => void;
  roomCallback?: () => void;

  constructor(id: string, ip: string, name?: string, status?: iLightStatus) {
    this.id = id;
    this.ip = ip;
    this.name = name;

    this.status = new LightStatus(status);
  }

  register(callback: () => void): void {
    this.lightCallback = callback;
  }
  registerRoom(callback: () => void): void {
    this.roomCallback = callback;
  }

  onUpdate() {
    this.lightCallback?.();
    this.roomCallback?.();
  }

  updateStatus(status?: LightStatus): void {
    if (status) {
      if (this.status) {
        this.status.update(status);
      } else {
        this.status = status;
      }
      this.onUpdate();
    }
  }

  updateLighting(req: LightRequest): void {
    if (!this.status) {
      this.status = new LightStatus();
    }
    this.status.updateLighting(req);
    this.onUpdate();
  }
}

export interface Brightness {
  value: number;
}

export interface Speed {
  value: number;
}

export interface Kelvin {
  kelvin: number;
}

export interface White {
  value: number;
}

export interface iLightStatus {
  brightness?: Brightness;
  color?: iColor;
  emitting: boolean;
  scene?: SceneMode;
  speed?: Speed;
  temp?: Kelvin;
  cool?: White;
  warm?: White;
  last?: LastSet;
}

export enum LastSet {
  Color = 'Color',
  Scene = 'Scene',
  Temp = 'Temp',
  Cool = 'Cool',
  Warm = 'Warm',
}

export class LightStatus implements iLightStatus {
  brightness?: Brightness;
  color?: Color;
  emitting: boolean;
  scene?: SceneMode;
  speed?: Speed;
  temp?: Kelvin;
  cool?: White;
  warm?: White;
  last?: LastSet;

  constructor(status?: iLightStatus) {
    this.brightness = status?.brightness;
    this.color = status?.color ? new Color(status.color) : undefined;
    this.emitting = status?.emitting ?? true;
    this.scene = status?.scene;
    this.temp = status?.temp;
    this.cool = status?.cool;
    this.warm = status?.warm;
    this.last = status?.last;
  }

  update(other: LightStatus): void {
    if (this.brightness) {
      if (other.brightness) {
        this.brightness.value = other.brightness.value;
      }
    } else if (other.brightness) {
      this.brightness = other.brightness;
    }

    if (this.color) {
      if (other.color) {
        this.color.update(other.color);
      }
    } else if (other.color) {
      this.color = other.color;
    }

    this.emitting = other.emitting;
    this.scene = other.scene;

    if (this.speed) {
      if (other.speed) {
        this.speed.value = other.speed.value;
      }
    } else if (other.speed) {
      this.speed = other.speed;
    }

    if (this.temp) {
      if (other.temp) {
        this.temp.kelvin = other.temp.kelvin;
      }
    } else if (other.temp) {
      this.temp = other.temp;
    }

    if (this.cool) {
      if (other.cool) {
        this.cool.value = other.cool.value;
      }
    } else if (other.cool) {
      this.cool = other.cool;
    }

    if (this.warm) {
      if (other.warm) {
        this.warm.value = other.warm.value;
      }
    } else if (other.warm) {
      this.warm = other.warm;
    }

    if (this.last) {
      if (other.last) {
        this.last = other.last;
      }
    } else if (other.last) {
      this.last = other.last;
    }
  }

  updateLighting(req: LightRequest): void {
    if (req.brightness) {
      this.brightness = req.brightness;
    }
    if (req.color) {
      this.color = req.color;
      this.last = LastSet.Color;
    }
    if (req.power) {
      this.emitting = req.power !== PowerMode.Off;
    }
    if (req.scene) {
      this.scene = req.scene;
      this.speed = req.speed;
      this.last = LastSet.Scene;
    }
    if (req.temp) {
      this.temp = req.temp;
      this.last = LastSet.Temp;
    }
    if (req.cool) {
      this.cool = req.cool;
      this.last = LastSet.Cool;
    }
    if (req.warm) {
      this.warm = req.warm;
      this.last = LastSet.Warm;
    }
  }
}

export interface iColor {
  red: number;
  green: number;
  blue: number;
}

export class Color implements iColor {
  red: number;
  green: number;
  blue: number;

  constructor(color?: iColor) {
    this.red = color?.red ?? 0;
    this.green = color?.green ?? 0;
    this.blue = color?.blue ?? 0;
  }

  fromStr(color: string) {
    switch (color.length) {
      case 4:
        this.red = Number(`0x${color[1]}`);
        this.green = Number(`0x${color[2]}`);
        this.blue = Number(`0x${color[3]}`);
        break;
      case 7:
        this.red = Number(`0x${color.slice(1, 3)}`);
        this.green = Number(`0x${color.slice(3, 5)}`);
        this.blue = Number(`0x${color.slice(5, 7)}`);
        break;
      default:
        this.red = 0;
        this.green = 0;
        this.blue = 0;
    }
  }

  toStr(): string {
    return `#${this.red.toString(16).padStart(2, '0')}${this.green
      .toString(16)
      .padStart(2, '0')}${this.blue.toString(16).padStart(2, '0')}`;
  }

  isValid(): boolean {
    return (
      this.validColor(this.red) &&
      this.validColor(this.green) &&
      this.validColor(this.blue)
    );
  }

  validColor(color: number): boolean {
    return 0 <= color && color <= 255;
  }

  update(other: Color): void {
    this.red = other.red;
    this.green = other.green;
    this.blue = other.blue;
  }
}

export enum PowerMode {
  On = 'On',
  Off = 'Off',
  Reboot = 'Reboot',
}

export enum SceneMode {
  Ocean = 'Ocean',
  Romance = 'Romance',
  Sunset = 'Sunset',
  Party = 'Party',
  Fireplace = 'Fireplace',
  Cozy = 'Cozy',
  Forest = 'Forest',
  PastelColors = 'PastelColors',
  WakeUp = 'WakeUp',
  Bedtime = 'Bedtime',
  WarmWhite = 'WarmWhite',
  Daylight = 'Daylight',
  CoolWhite = 'CoolWhite',
  NightLight = 'NightLight',
  Focus = 'Focus',
  Relax = 'Relax',
  TrueColors = 'TrueColors',
  TvTime = 'TvTime',
  Plantgrowth = 'Plantgrowth',
  Spring = 'Spring',
  Summer = 'Summer',
  Fall = 'Fall',
  Deepdive = 'Deepdive',
  Jungle = 'Jungle',
  Mojito = 'Mojito',
  Club = 'Club',
  Christmas = 'Christmas',
  Halloween = 'Halloween',
  Candlelight = 'Candlelight',
  GoldenWhite = 'GoldenWhite',
  Pulse = 'Pulse',
  Steampunk = 'Steampunk',
}

export interface LightRequest {
  brightness?: Brightness;
  color?: Color;
  speed?: Speed;
  temp?: Kelvin;
  scene?: SceneMode;
  power?: PowerMode;
  cool?: White;
  warm?: White;
}

export class LightRequest implements LightRequest {
  valid(): boolean {
    // NB: speed is not valid on its own, everything else is
    return (
      this.brightness !== undefined ||
      this.color !== undefined ||
      this.temp !== undefined ||
      this.scene !== undefined ||
      this.power !== undefined ||
      this.cool !== undefined ||
      this.warm !== undefined
    );
  }

  setBrightness(value: number): boolean {
    if (10 <= value && value <= 100) {
      this.brightness = { value };
      return true;
    }
    return false;
  }

  private setSpeed(value: number): boolean {
    if (20 <= value && value <= 200) {
      this.speed = { value };
      return true;
    }
    return false;
  }

  setColor(color: Color): boolean {
    if (color.isValid()) {
      this.color = color;
      return true;
    }
    return false;
  }

  setCool(value: number): boolean {
    if (1 <= value && value <= 100) {
      this.cool = { value };
      return true;
    }
    return false;
  }

  setWarm(value: number): boolean {
    if (1 <= value && value <= 100) {
      this.warm = { value };
      return true;
    }
    return false;
  }

  setTemp(kelvin: number): boolean {
    if (1000 <= kelvin && kelvin <= 8000) {
      this.temp = { kelvin };
      return true;
    }
    return false;
  }

  setScene(scene: SceneMode, speed: number): boolean {
    this.scene = scene;
    return this.setSpeed(speed);
  }

  setPower(power: PowerMode): void {
    this.power = power;
  }
}
