const { defineConfig } = require('@vue/cli-service');
process.env.VUE_APP_VERSION = process.env.npm_package_version;

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_BASE || '/',
  devServer: { port: 8000 },
  lintOnSave: false,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Riz',
    },
  },
});
