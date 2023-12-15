import '@/styles/style.scss';
import { Ref, createApp, ref } from 'vue';

import { API, createAPI } from '@/api';

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

const snack = ref(false);
const error = ref('');

app.config.globalProperties.$api = createAPI();
app.config.globalProperties.$snack = snack;
app.config.globalProperties.$error = error;
app.config.globalProperties.error = (msg: string) => {
  error.value = msg;
  snack.value = true;
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: API;
    $snack: Ref<boolean>;
    $error: Ref<string>;
    error: (msg: string) => void;
  }
}

app.use(router).use(vuetify).mount('#app');
