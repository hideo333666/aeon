const { environment } = require('@rails/webpacker')
const { VueLoaderPlugin } = require('vue-loader')
const vue = require('./loaders/vue')

const webpack = require('webpack')

environment.plugins.prepend(
  'Define',
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  })
)

environment.config.resolve.alias = {
  ...environment.config.resolve.alias,
  vue: 'vue/dist/vue.esm-bundler.js'
}

environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

environment.plugins.prepend('VueLoaderPlugin', new VueLoaderPlugin())
environment.loaders.prepend('vue', vue)
module.exports = environment
