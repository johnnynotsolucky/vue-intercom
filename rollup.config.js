import vue from 'rollup-plugin-vue'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
  globals: { vue: 'Vue' },
  entry: 'src/index.js',
  plugins: [
    resolve(),
    vue(),
    buble()
  ],
  targets: [
    { dest: 'dist/vue-intercom.js', format: 'umd', name: 'VueIntercom' }
  ]
}
