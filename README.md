# Riz UI

Vue 3+Typescript UI to control Wiz lights with the [Riz](https://github.com/a-tal/riz) API.

## Dev

### `dev.sh`

- Starts the npm dev server with hot-reloading enabled
- use `--container, -c` to build and start with Docker

## Config

| Env Var         | Default                  | Description               |
| --------------- | ------------------------ | ------------------------- |
| VUE_APP_RIZ_API | http://localhost:8080/v1 | Base path for the Riz API |

## Docker

Run `npm build` first, then `docker build` will create a nginx container for the static files.

## Features

- Add, edit and remove rooms (separate from Wiz room configurations)
- Add, edit and remove lights
- Set brightness, scene, color, temp, cool or warm values for a room or light
- Turn a light on/off (emitting, not power), or reboot a room or light
- Mobile friendly

## Known Limitations

Stale browser states may not be accurate. Some other user could change the state through some other client. You can use the refresh state button(s) to attempt a state resync through the API; or set a new state, which the API will then remember.

## Demo

- TODO
