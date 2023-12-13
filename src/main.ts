import { API, createAPI } from '@/api';
import '@/styles/style.scss';
import { createApp } from 'vue';

import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';

if (process.env.NODE_ENV !== 'production') {
  // NB: must use async import since it's not top level
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import('@/styles/debug.scss').then(() => console.log('debug styles loaded'));
}

loadFonts();

const app = createApp(App);

app.config.globalProperties.$api = createAPI();

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: API;
  }
}

app.use(router).use(vuetify).mount('#app');
