<div align="center">
<h1>Riz UI</h1>
<p><i>Vue 3+Typescript UI to control Wiz lights with the <a href="https://github.com/a-tal/riz">Riz</a> API.
</i></p>

[![ci-badge]][ci] [![docker-badge]][docker] [![size-badge]][docker] ![lic-badge]
</div>


## Dev

### `dev.sh`

- Starts the npm dev server with hot-reloading enabled
- use `--container, -c` to build and start with Docker

## Config

| Env Var         | Default | Description               |
| --------------- | ------- | ------------------------- |
| VUE_APP_RIZ_API | /v1     | Base path for the Riz API |

## Docker

Run `npm build` first, then `docker build` will create a nginx container for the static files.

Or pull the [automatically built image][docker]: `docker pull ghcr.io/a-tal/riz-ui:master`

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


[ci-badge]: https://github.com/a-tal/riz-ui/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/a-tal/riz-ui/actions/workflows/ci.yml
[docker-badge]: https://ghcr-badge.deta.dev/a-tal/riz-ui/latest_tag?trim=major&label=ghcr.io
[size-badge]: https://ghcr-badge.deta.dev/a-tal/riz-ui/size?tag=master
[docker]: https://github.com/a-tal/riz-ui/pkgs/container/riz
[lic-badge]: https://img.shields.io/github/license/a-tal/riz-ui
