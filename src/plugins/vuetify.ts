/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */
// Styles
import '@mdi/font/css/materialdesignicons.css';
// Composables
import { createVuetify } from 'vuetify';
// NB: https://github.com/vuetifyjs/vuetify/issues/16346
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import colors from 'vuetify/lib/util/colors';
import 'vuetify/styles';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          background: colors.grey.lighten4,
          primary: colors.blue.darken1,
          secondary: '#5CBBF6',

          filter: colors.green.accent4,
          filtered: colors.deepOrange.darken2,
          slash: colors.blueGrey.lighten2,

          details: colors.blueGrey.darken2,

          status: colors.grey.lighten3,
          topnav: colors.grey.lighten5,
          offset: colors.shades.black,

          error: colors.red.darken3,
          success: colors.green.darken3,
          muted: '#6c757d',
        },
      },
      dark: {
        colors: {
          primary: colors.blue.lighten1,

          filter: colors.lightGreen.accent2,
          filtered: colors.cyan.darken1,
          slash: colors.blueGrey.lighten2,

          details: colors.orange.lighten2,

          status: colors.grey.darken4,
          topnav: colors.grey.darken4,
          offset: colors.shades.white,

          error: colors.red.lighten1,
          success: colors.green.lighten1,
          muted: '#6c757d',
        },
      },
    },
  },
});
